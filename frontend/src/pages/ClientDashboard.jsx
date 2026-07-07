import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { convertGradeToNumeric, convertNumericToGrade } from '../utils/gradeUtils';

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

  // Modern environment configuration setup with clean fallback bounds
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/user/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
          setNotifPrefs(data.emailNotifications || { onGradeUpdate: true, onFeedback: true, onGoalSet: true });
        } else {
          setMessage({ type: 'error', text: 'Failed to load dashboard parameters.' });
        }
      } catch (error) {
        console.error('Dashboard analytical core link drop error:', error);
        setMessage({ type: 'error', text: 'Network connection error pulling data metrics.' });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
  }, [token, baseUrl]);

  const handleNotificationChange = async (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);

    try {
      const response = await fetch(`${baseUrl}/api/user/notification-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification preferences synced successfully.' });
      }
    } catch (error) {
      console.error('Failed processing server preferences change payload:', error);
      setMessage({ type: 'error', text: 'Failed updating notification flags.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-neutral-400 text-sm font-mono animate-pulse">Loading your performance dashboard workspace...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-neutral-400 text-sm font-mono">Unable to parse linked user dashboard profile schemas.</p>
      </div>
    );
  }

  // Calculate analytical bounds safely from gradeHistory profiles array
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

  const totalReviews = chartData.length;
  const averageNumeric = totalReviews > 0 ? Math.round(chartData.reduce((acc, c) => acc + c.grade, 0) / totalReviews) : 0;
  const averageLetter = convertNumericToGrade(averageNumeric);
  const highestNumeric = totalReviews > 0 ? Math.max(...chartData.map(c => c.grade)) : 0;
  const highestLetter = convertNumericToGrade(highestNumeric);
  const latestNumeric = totalReviews > 0 ? chartData[totalReviews - 1].grade : 0;

  const progressionTrend = totalReviews >= 2 
    ? chartData[totalReviews - 1].grade - chartData[totalReviews - 2].grade 
    : null;

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
        
        {/* DASHBOARD HEADER BRANDING BAR */}
        <div className="mb-8 text-left border-b border-neutral-200/60 pb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1 rounded-full mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 text-[10px] font-mono font-bold uppercase tracking-widest">
              Performance Dashboard Workspace
            </span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">
            Your <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500 normal-case">Fitness Performance</span>
          </h1>
          <p className="text-neutral-400 text-xs mt-1 font-mono">
            Athlete Identity Ledger: <span className="text-neutral-700 font-bold">{dashboardData.username}</span>
          </p>
        </div>

        {/* MESSAGING TOAST ENGINE */}
        {message.text && (
          <div className={`p-4 rounded-xl text-xs font-mono mb-6 border text-left ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* WORKSPACE ANALYTICAL METRIC GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* CURRENT COACH REVIEW MATRIX */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Current Grade Indicators</h2>
              <span className="text-[9px] font-mono bg-neutral-900 text-white font-bold tracking-widest uppercase px-1.5 py-0.5 rounded">Latest</span>
            </div>
            <div className="space-y-3">
              <div className="text-center py-2 bg-neutral-50 rounded-xl border border-neutral-100 shadow-3xs">
                <div className="text-4xl font-bold text-emerald-600 tracking-tight">
                  {dashboardData.currentGrade || 'Pending'}
                </div>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider mt-0.5">Assigned Performance Evaluation</p>
              </div>
              <div className="bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-4 text-xs text-neutral-700 leading-relaxed">
                <p className="font-bold font-mono uppercase tracking-wide text-[10px] text-emerald-800 mb-1.5">Coach Evaluation Notes</p>
                <p className="whitespace-pre-wrap font-sans text-neutral-600 leading-relaxed">
                  {dashboardData.currentFeedback || 'Analytical runtime notes pending. Execute macro goals and update metrics lines.'}
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE FITNESS CORE OBJECTIVES */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Objective Targets</h2>
              <span className="text-[10px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {activeGoals.length} Target vectors
              </span>
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 uppercase">Active Clusters //</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{activeGoals.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 uppercase">Deployed Bounds //</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{completedGoals.length}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Core Target Index Total:</span>
                <span className="font-bold text-neutral-700">{dashboardData.goals?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* SYSTEM PREFERENCES FLAG CAPTURE */}
          <div className="lg:col-span-1 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Notification Subsystems</h2>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Parameters</span>
            </div>
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-neutral-600 hover:text-neutral-900 transition-all select-none">
                <input
                  type="checkbox"
                  checked={notifPrefs.onGradeUpdate || false}
                  onChange={() => handleNotificationChange('onGradeUpdate')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-neutral-50 cursor-pointer"
                />
                <span>Grade Assessment Pushes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-neutral-600 hover:text-neutral-900 transition-all select-none">
                <input
                  type="checkbox"
                  checked={notifPrefs.onFeedback || false}
                  onChange={() => handleNotificationChange('onFeedback')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-neutral-50 cursor-pointer"
                />
                <span>Strategic Feedback Syncs</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-neutral-600 hover:text-neutral-900 transition-all select-none">
                <input
                  type="checkbox"
                  checked={notifPrefs.onGoalSet || false}
                  onChange={() => handleNotificationChange('onGoalSet')}
                  className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-neutral-50 cursor-pointer"
                />
                <span>Target Vector Additions</span>
              </label>
            </div>
          </div>
        </div>

        {/* ANALYTICAL TIME-SERIES RECHARTS WRAPPER */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs mb-8 text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">
                Analytical Performance Matrix
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Time-series execution history of physical tracking parameters.
              </p>
            </div>
            {totalReviews > 0 && (
              <span className="self-start sm:self-center px-3 py-1 text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-bold uppercase tracking-wider shadow-3xs">
                {totalReviews} Evaluation Snapshots Listed
              </span>
            )}
          </div>

          {/* STATISTICS SUMMARY DASHBOARD STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#FAFAFA] border border-neutral-200/40 p-4 rounded-xl shadow-3xs">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Running Average</span>
              <span className="text-base font-bold text-neutral-800 block mt-1 font-mono">
                {totalReviews > 0 ? `${averageNumeric}% (${averageLetter})` : '--'}
              </span>
            </div>
            <div className="bg-[#FAFAFA] border border-neutral-200/40 p-4 rounded-xl shadow-3xs">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Peak Metric Index</span>
              <span className="text-base font-bold text-neutral-800 block mt-1 font-mono">
                {totalReviews > 0 ? `${highestLetter} (${highestNumeric}%)` : '--'}
              </span>
            </div>
            <div className="bg-[#FAFAFA] border border-neutral-200/40 p-4 rounded-xl shadow-3xs">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Latest Evaluated Run</span>
              <span className="text-base font-bold text-neutral-800 block mt-1 font-mono">
                {totalReviews > 0 ? `${latestNumeric}%` : '--'}
              </span>
            </div>
            <div className="bg-[#FAFAFA] border border-neutral-200/40 p-4 rounded-xl shadow-3xs">
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Progression Vector Delta</span>
              <span className="text-sm font-bold mt-1.5 block font-mono">
                {totalReviews < 2 ? (
                  <span className="text-neutral-400 font-normal text-xs uppercase">Awaiting evaluation delta</span>
                ) : progressionTrend > 0 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    ▲ +{progressionTrend}%
                  </span>
                ) : progressionTrend < 0 ? (
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">
                    ▼ {progressionTrend}%
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold">Stable (0%)</span>
                )}
              </span>
            </div>
          </div>

          {/* DYNAMIC SVGS CANVAS ENGINE */}
          <div className="relative w-full h-80">
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
                {/* Visual Empty Mask */}
                <div className="absolute inset-0 opacity-[0.07] select-none pointer-events-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#CCCCCC" vertical={false} />
                      <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <YAxis domain={[0, 100]} stroke="#9CA3AF" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <Line type="monotone" dataKey="grade" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#D1D5DB', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Dynamic Notification Hub Shield */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white/90 backdrop-blur-xs border border-neutral-200/60 rounded-2xl p-6 sm:p-8 max-w-md text-center shadow-lg space-y-2">
                    <div className="h-11 w-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg mx-auto animate-pulse">
                      📈
                    </div>
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      Awaiting Coach Review Injection
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                      Your trend metric visualizations populates here following administrative profile manual scoring execution tasks. Keep running baseline tracking parameters!
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ACTIVE OBJECTIVES MATRIX DISPLAY */}
        {activeGoals.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs mb-8 text-left">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase mb-4 border-b border-neutral-100 pb-3 tracking-wider">
              Active Fitness Milestone Vectors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal, idx) => (
                <div key={idx} className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-4 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-neutral-900 tracking-tight">{goal.title}</h3>
                      <span className="text-[9px] font-mono font-bold uppercase bg-amber-100/80 border border-amber-200 text-amber-800 px-2 py-0.5 rounded shadow-3xs whitespace-nowrap">
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{goal.description}</p>
                  </div>
                  <div className="pt-2 border-t border-amber-200/30 flex flex-col gap-1">
                    {goal.target && (
                      <p className="text-xs text-amber-900 font-medium">
                        <span className="font-mono text-[10px] text-amber-600 uppercase font-bold tracking-wider mr-1">Target Cluster //</span> 
                        {goal.target}
                      </p>
                    )}
                    {goal.deadline && (
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Target Boundary Term: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SWOT CORE CONFIGURATION BLOCK */}
        {dashboardData.swot && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs mb-8 text-left">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase mb-4 border-b border-neutral-100 pb-3 tracking-wider">
              SWOT Performance Matrix Fields
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.swot.strengths && (
                <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-xl p-4 space-y-1">
                  <h3 className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">💪 [S] Strengths Vector</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap font-mono">{dashboardData.swot.strengths}</p>
                </div>
              )}
              {dashboardData.swot.weaknesses && (
                <div className="bg-rose-50/30 border border-rose-100/70 rounded-xl p-4 space-y-1">
                  <h3 className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-wider">⏳ [W] Weaknesses Vector</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap font-mono">{dashboardData.swot.weaknesses}</p>
                </div>
              )}
              {dashboardData.swot.opportunities && (
                <div className="bg-amber-50/30 border border-amber-100/70 rounded-xl p-4 space-y-1">
                  <h3 className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">📈 [O] Opportunities Vector</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap font-mono">{dashboardData.swot.opportunities}</p>
                </div>
              )}
              {dashboardData.swot.threats && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-1">
                  <h3 className="text-[10px] font-mono font-bold text-neutral-700 uppercase tracking-wider">🎯 [T] Threats Vector</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap font-mono">{dashboardData.swot.threats}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS ARCHIVE CHRONOLOGY BLOCK */}
        {dashboardData.gradeHistory && dashboardData.gradeHistory.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs text-left">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase mb-4 border-b border-neutral-100 pb-3 tracking-wider">
              Chronological Performance Reviews Log
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {[...dashboardData.gradeHistory].reverse().map((entry, idx) => (
                <div key={idx} className="bg-[#FAFAFA] border border-neutral-200/60 hover:bg-neutral-50 transition-all rounded-xl p-4 space-y-2 shadow-3xs">
                  <div className="flex items-center justify-between border-b border-neutral-100/80 pb-1.5">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {new Date(entry.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm font-bold text-neutral-900 mt-0.5">Grade Index: <span className="text-emerald-600 font-mono">{entry.grade}</span></p>
                    </div>
                    <span className="text-[10px] font-mono bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-semibold tracking-wide uppercase">{entry.ratedBy}</span>
                  </div>
                  {entry.feedback && (
                    <p className="text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-wrap pt-0.5">{entry.feedback}</p>
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