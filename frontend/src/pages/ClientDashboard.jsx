import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiUrl } from '../config/api';

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
      grade: entry.grade ? parseInt(entry.grade) || 0 : 0
    }));

  const activeGoals = (dashboardData.goals || []).filter(g => g.status === 'active');
  const completedGoals = (dashboardData.goals || []).filter(g => g.status === 'completed');

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

        {/* GRADE HISTORY CHART */}
        {chartData.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-sm font-bold text-neutral-900 uppercase mb-4 border-b border-neutral-100 pb-3">
              Grade History Trend
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    formatter={(value) => [value, 'Grade']}
                  />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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