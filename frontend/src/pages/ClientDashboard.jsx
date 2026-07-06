import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiUrl } from '../config/api';

// Utility to parse mixed grade strings into a 0-100 scale
export function convertGradeToNumeric(grade) {
  if (!grade) return 0;
  let str = String(grade).trim().toLowerCase();
  
  // 1. Check if it is a fraction (e.g. 9/10, 8.5/10)
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return Math.min(100, Math.round((num / den) * 100));
      }
    }
  }
  
  // 2. Check if it ends with %
  if (str.endsWith('%')) {
    const val = parseFloat(str);
    if (!isNaN(val)) return Math.min(100, Math.max(0, val));
  }
  
  // 3. Try parsing as a raw number
  const parsedNum = parseFloat(str);
  if (!isNaN(parsedNum)) {
    if (parsedNum <= 10 && parsedNum >= 0) {
      return Math.round(parsedNum * 10);
    }
    return Math.min(100, Math.max(0, Math.round(parsedNum)));
  }

  // 4. Letter grades mapping
  const letterMap = {
    'a+': 98, 'a': 95, 'a-': 90,
    'b+': 88, 'b': 85, 'b-': 80,
    'c+': 78, 'c': 75, 'c-': 70,
    'd+': 68, 'd': 65, 'd-': 60,
    'f': 50
  };
  
  for (const letter in letterMap) {
    if (str.startsWith(letter)) {
      return letterMap[letter];
    }
  }
  
  // 5. Descriptive keywords matching
  if (str.includes('elite') || str.includes('excellent') || str.includes('outstanding') || str.includes('perfect')) {
    return 95;
  }
  if (str.includes('very good') || str.includes('strong') || str.includes('great') || str.includes('good')) {
    return 85;
  }
  if (str.includes('average') || str.includes('satisfactory') || str.includes('decent') || str.includes('fair') || str.includes('medium')) {
    return 70;
  }
  if (str.includes('poor') || str.includes('weak') || str.includes('subpar') || str.includes('bad')) {
    return 55;
  }
  if (str.includes('fail') || str.includes('unsatisfactory') || str.includes('terrible')) {
    return 40;
  }

  return 50;
}

export function convertNumericToGrade(val) {
  if (val >= 90) return 'A';
  if (val >= 80) return 'B';
  if (val >= 70) return 'C';
  if (val >= 60) return 'D';
  return 'F';
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-md text-left font-sans max-w-xs">
        <p className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider mb-1">{data.fullDate}</p>
        <p className="text-sm font-bold text-neutral-900">
          Normalized Score: <span className="text-emerald-600 font-mono">{data.grade}%</span>
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          <strong className="text-neutral-700">Coach Grade:</strong> {data.originalGrade}
        </p>
        {data.feedback && (
          <p className="text-xs text-neutral-500 mt-2 italic border-t border-neutral-100 pt-2 line-clamp-3">
            "{data.feedback}"
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ClientDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [notifPrefs, setNotifPrefs] = useState({ onGradeUpdate: true, onFeedback: true, onGoalSet: true });
  const token = user?.token || user?.user?.token;

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl('/api/user/dashboard'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
          setNotifPrefs(data.emailNotifications || { onGradeUpdate: true, onFeedback: true, onGoalSet: true });
        } else {
          setMessage({ type: 'error', text: 'Failed to load dashboard' });
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setMessage({ type: 'error', text: 'Network error loading dashboard' });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  const handleNotificationChange = async (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);

    try {
      const response = await fetch(apiUrl('/api/user/notification-preferences'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences updated successfully' });
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-neutral-400 text-sm font-mono animate-pulse">Loading your performance dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-neutral-400">Unable to load dashboard data</p>
      </div>
    );
  }

  const chartData = (dashboardData.gradeHistory || [])
    .slice(-10)
    .map((entry) => ({
      date: new Date(entry.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date(entry.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      grade: convertGradeToNumeric(entry.grade),
      originalGrade: entry.grade,
      feedback: entry.feedback || ''
    }));

  const activeGoals = (dashboardData.goals || []).filter(g => g.status === 'active');
  const completedGoals = (dashboardData.goals || []).filter(g => g.status === 'completed');

  // Calculate statistics
  const totalReviews = chartData.length;
  const averageNumeric = totalReviews > 0 ? Math.round(chartData.reduce((acc, c) => acc + c.grade, 0) / totalReviews) : 0;
  const averageLetter = convertNumericToGrade(averageNumeric);
  const highestNumeric = totalReviews > 0 ? Math.max(...chartData.map(c => c.grade)) : 0;
  const highestLetter = convertNumericToGrade(highestNumeric);
  const latestNumeric = totalReviews > 0 ? chartData[totalReviews - 1].grade : 0;

  // Progression trend (delta between last two reviews)
  const progressionTrend = totalReviews >= 2 
    ? chartData[totalReviews - 1].grade - chartData[totalReviews - 2].grade 
    : null;

  // Mock progression data for empty state
  const mockChartData = [
    { date: 'Wk 1', fullDate: 'Mock Week 1', grade: 65, originalGrade: 'D+ (Mock)', feedback: 'Initial baseline assessment.' },
    { date: 'Wk 2', fullDate: 'Mock Week 2', grade: 72, originalGrade: 'C (Mock)', feedback: 'Good recovery tracking, form improving.' },
    { date: 'Wk 3', fullDate: 'Mock Week 3', grade: 70, originalGrade: 'C- (Mock)', feedback: 'Slight fatigue markers noted on compound lifts.' },
    { date: 'Wk 4', fullDate: 'Mock Week 4', grade: 82, originalGrade: 'B (Mock)', feedback: 'Excellent response to caloric adjustments.' },
    { date: 'Wk 5', fullDate: 'Mock Week 5', grade: 88, originalGrade: 'B+ (Mock)', feedback: 'Linear strength progression sustained.' },
    { date: 'Wk 6', fullDate: 'Mock Week 6', grade: 95, originalGrade: 'A (Mock)', feedback: 'Elite level execution targets met!' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#262626] font-sans antialiased relative pt-24 pb-16">
      <div className="absolute top-0 right-[5%] w-112.5 h-112.5 bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* HEADER */}
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1 rounded-full mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 text-[10px] font-mono font-bold uppercase tracking-widest">
              Performance Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">
            Your <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 normal-case">Fitness Performance</span>
          </h1>
          <p className="text-neutral-400 text-xs mt-1 font-mono">
            Athlete: {dashboardData.username}
          </p>
        </div>

        {/* MESSAGING */}
        {message.text && (
          <div className={`p-4 rounded-xl text-xs font-mono mb-6 border text-left ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CURRENT PERFORMANCE CARD */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 uppercase">Current Grade</h2>
              <span className="text-[10px] font-mono text-neutral-400">Latest</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-1">
                  {dashboardData.currentGrade || 'Pending'}
                </div>
                <p className="text-xs text-neutral-400 font-mono uppercase">Coach Rating</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-neutral-700 leading-relaxed">
                <p className="font-semibold text-neutral-900 mb-1">Feedback:</p>
                <p className="whitespace-pre-wrap text-xs">
                  {dashboardData.currentFeedback || 'No feedback yet. Keep training!'}
                </p>
              </div>
            </div>
          </div>

          {/* GOALS PROGRESS */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 uppercase">Goals</h2>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                {activeGoals.length} Active
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Active:</span>
                <span className="font-bold text-amber-600">{activeGoals.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Completed:</span>
                <span className="font-bold text-emerald-600">{completedGoals.length}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 font-mono">Total Goals: {dashboardData.goals?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 uppercase">Notifications</h2>
              <span className="text-[10px] font-mono text-neutral-400">Settings</span>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={notifPrefs.onGradeUpdate || false}
                  onChange={() => handleNotificationChange('onGradeUpdate')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600"
                />
                <span className="text-neutral-700">Grade Updates</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={notifPrefs.onFeedback || false}
                  onChange={() => handleNotificationChange('onFeedback')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600"
                />
                <span className="text-neutral-700">Feedback</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={notifPrefs.onGoalSet || false}
                  onChange={() => handleNotificationChange('onGoalSet')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600"
                />
                <span className="text-neutral-700">New Goals</span>
              </label>
            </div>
          </div>
        </div>

        {/* ANALYTICAL PERFORMANCE SECTION */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase">
                Analytical Performance
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Visualizing workout metrics & nutrition progression history
              </p>
            </div>
            {totalReviews > 0 && (
              <span className="self-start sm:self-center px-3 py-1 text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-bold">
                {totalReviews} REVIEWS RECORDED
              </span>
            )}
          </div>

          {/* STATISTICS RIBBON */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Average Grade</span>
              <span className="text-lg font-bold text-neutral-800 block mt-1">
                {totalReviews > 0 ? `${averageNumeric}% (${averageLetter})` : '--'}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Highest Rating</span>
              <span className="text-lg font-bold text-neutral-800 block mt-1">
                {totalReviews > 0 ? `${highestLetter} (${highestNumeric}%)` : '--'}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Latest Score</span>
              <span className="text-lg font-bold text-neutral-800 block mt-1">
                {totalReviews > 0 ? `${latestNumeric}%` : '--'}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Progression Trend</span>
              <span className="text-lg font-bold mt-1 block">
                {totalReviews < 2 ? (
                  <span className="text-neutral-400 font-medium text-sm">Awaiting reviews</span>
                ) : progressionTrend > 0 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    ▲ +{progressionTrend}%
                  </span>
                ) : progressionTrend < 0 ? (
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">
                    ▼ {progressionTrend}%
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold">
                    Stable (0%)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* DYNAMIC CHART OR STUNNING EMPTY STATE */}
          <div className="relative w-full h-[320px]">
            {totalReviews > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(tick) => {
                      if (tick === 100) return 'A+';
                      if (tick === 90) return 'A';
                      if (tick === 80) return 'B';
                      if (tick === 70) return 'C';
                      if (tick === 60) return 'D';
                      if (tick === 50) return 'F';
                      return '';
                    }}
                    stroke="#9CA3AF" 
                    style={{ fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                    activeDot={{ fill: '#059669', stroke: '#ffffff', strokeWidth: 2, r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <>
                {/* Mock Chart Background */}
                <div className="absolute inset-0 opacity-[0.08] select-none pointer-events-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#CCCCCC" vertical={false} />
                      <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <YAxis domain={[0, 100]} stroke="#9CA3AF" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <Line
                        type="monotone"
                        dataKey="grade"
                        stroke="#9CA3AF"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#D1D5DB', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Centered Glassmorphism Alert Card */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white/85 backdrop-blur-xs border border-neutral-200/60 rounded-2xl p-6 sm:p-8 max-w-md text-center shadow-lg space-y-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl mx-auto animate-pulse">
                      📈
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                      Awaiting Coach Evaluation
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Your progression line-chart and statistical trend vectors will populate here as soon as your coach records your first manual rating. Keep logging your metrics!
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ACTIVE GOALS */}
        {activeGoals.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm mb-8 text-left">
            <h2 className="text-sm font-bold text-neutral-900 uppercase mb-4 border-b border-neutral-100 pb-3">
              Active Fitness Goals
            </h2>
            <div className="space-y-3">
              {activeGoals.map((goal, idx) => (
                <div key={idx} className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{goal.title}</h3>
                      <p className="text-xs text-neutral-600 mt-1">{goal.description}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-1 rounded whitespace-nowrap">
                      {goal.status}
                    </span>
                  </div>
                  {goal.target && <p className="text-xs text-amber-700 font-semibold">Target: {goal.target}</p>}
                  {goal.deadline && (
                    <p className="text-xs text-neutral-500 font-mono">
                      Due: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SWOT ANALYSIS */}
        {dashboardData.swot && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm mb-8 text-left">
            <h2 className="text-sm font-bold text-neutral-900 uppercase mb-4 border-b border-neutral-100 pb-3">
              SWOT Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.swot.strengths && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase">💪 Strengths</h3>
                  <p className="text-xs text-neutral-700 whitespace-pre-wrap">{dashboardData.swot.strengths}</p>
                </div>
              )}
              {dashboardData.swot.weaknesses && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-rose-800 uppercase">⏳ Weaknesses</h3>
                  <p className="text-xs text-neutral-700 whitespace-pre-wrap">{dashboardData.swot.weaknesses}</p>
                </div>
              )}
              {dashboardData.swot.opportunities && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-amber-800 uppercase">📈 Opportunities</h3>
                  <p className="text-xs text-neutral-700 whitespace-pre-wrap">{dashboardData.swot.opportunities}</p>
                </div>
              )}
              {dashboardData.swot.threats && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-neutral-700 uppercase">🎯 Threats</h3>
                  <p className="text-xs text-neutral-700 whitespace-pre-wrap">{dashboardData.swot.threats}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERFORMANCE REVIEWS TIMELINE */}
        {dashboardData.gradeHistory && dashboardData.gradeHistory.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm text-left">
            <h2 className="text-sm font-bold text-neutral-900 uppercase mb-4 border-b border-neutral-100 pb-3">
              Performance Reviews
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...dashboardData.gradeHistory].reverse().map((entry, idx) => (
                <div key={idx} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 font-mono">
                        {new Date(entry.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm font-bold text-neutral-900 mt-1">Grade: {entry.grade}</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{entry.ratedBy}</span>
                  </div>
                  {entry.feedback && (
                    <p className="text-xs text-neutral-600 whitespace-pre-wrap">{entry.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}