import { useState, useEffect } from 'react';

// 📊 1. LOCAL INLINE SWOT ENGINE COMPONENT
function SwotEngine({ clientName, swotData, onChange, onSave, submitting }) {
  return (
    <div className="w-full bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs mt-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">Core Matrix Evaluation</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 uppercase">
            Performance SWOT Evaluation
          </h2>
          <p className="text-xs text-neutral-400 font-normal">
            Mapping core values for: <span className="text-neutral-700 font-mono font-semibold">{clientName}</span>
          </p>
        </div>
      </div>

      {/* SWOT Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <div className="p-5 bg-emerald-50/30 border border-emerald-100/80 rounded-2xl space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase font-mono">
            <span>💪 [S] Strengths // Consistency</span>
          </label>
          <textarea
            name="strengths"
            value={swotData.strengths}
            onChange={onChange}
            placeholder="Record physical baseline milestones, excellent execution vectors, or flawless log frequencies..."
            className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed font-mono focus:outline-none focus:border-emerald-400 transition-all resize-none shadow-3xs"
          />
        </div>

        {/* WEAKNESSES */}
        <div className="p-5 bg-rose-50/30 border border-rose-100/80 rounded-2xl space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-rose-800 uppercase font-mono">
            <span>⏳ [W] Weaknesses // Discipline</span>
          </label>
          <textarea
            name="weaknesses"
            value={swotData.weaknesses}
            onChange={onChange}
            placeholder="Identify execution friction points, irregular session drops, or posture vulnerabilities..."
            className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed font-mono focus:outline-none focus:border-rose-400 transition-all resize-none shadow-3xs"
          />
        </div>

        {/* OPPORTUNITIES */}
        <div className="p-5 bg-amber-50/30 border border-amber-100/80 rounded-2xl space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-800 uppercase font-mono">
            <span>📈 [O] Opportunities // Growth</span>
          </label>
          <textarea
            name="opportunities"
            value={swotData.opportunities}
            onChange={onChange}
            placeholder="Map out training load expansions, targeted macro sheet upgrades, or kinetic changes..."
            className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed font-mono focus:outline-none focus:border-amber-400 transition-all resize-none shadow-3xs"
          />
        </div>

        {/* THREATS */}
        <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-700 uppercase font-mono">
            <span>🎯 [T] Threats // Dedication</span>
          </label>
          <textarea
            name="threats"
            value={swotData.threats}
            onChange={onChange}
            placeholder="Log high fatigue indicators, schedule constraints, or motivational plateau trends..."
            className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed font-mono focus:outline-none focus:border-neutral-400 transition-all resize-none shadow-3xs"
          />
        </div>
      </div>

      {/* Deploy Actions */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={submitting}
          className="w-full sm:w-auto bg-neutral-900 text-white font-mono text-xs font-bold tracking-widest px-8 py-4 rounded-xl uppercase hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99] disabled:opacity-40"
        >
          {submitting ? "Deploying SWOT Fields..." : "Deploy SWOT Metrics →"}
        </button>
      </div>
    </div>
  );
}

// 🖥️ 2. MAIN ADMINISTRATIVE CONTROL PANEL TERMINAL
export default function AdminDashboard({ user }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Grading state hooks
  const [workoutMetrics, setWorkoutMetrics] = useState('');
  const [dietMetrics, setDietMetrics] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [manualGrade, setManualGrade] = useState('');
  const [manualFeedback, setManualFeedback] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // SWOT sub-matrix hooks
  const [swotData, setSwotData] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
  const [swotSubmitting, setSwotSubmitting] = useState(false);

  // 📝 Admin Data Seeding Engine state hooks
  const [seeding, setSeeding] = useState(false);

  // Authentication configuration variables
  const token = user?.token || user?.user?.token;
  const adminName = user?.username || user?.user?.username || 'Admin';

  // Fetch registered athlete directories
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/profiles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setClients(data.filter(c => c.role !== 'admin' && c.role !== 'ceo'));
        }
      } catch (error) {
        console.error("Error accessing profile index directories:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchClients();
  }, [token]);

  // Hook effect to fetch existing SWOT matrix profile details when a client selection event fires
  useEffect(() => {
    const fetchSwotMatrix = async () => {
      if (!selectedClient) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/swot/${selectedClient._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Clear fields out first to avoid leaking previous user details
        setSwotData({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSwotData({
              strengths: data.strengths || '',
              weaknesses: data.weaknesses || '',
              opportunities: data.opportunities || '',
              threats: data.threats || ''
            });
          }
        }
      } catch (error) {
        console.error("Failed fetching structural user SWOT schema mapping fields:", error);
      }
    };

    fetchSwotMatrix();
  }, [selectedClient, token]);

  // Handle local SWOT textbox configuration typing adjustments
  const handleSwotChange = (e) => {
    const { name, value } = e.target;
    setSwotData(prev => ({ ...prev, [name]: value }));
  };

  // Dispatch Matrix parameters update to backend API endpoint
  const handleSaveSwot = async () => {
    if (!selectedClient) return;
    setSwotSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/swot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedClient._id,
          ...swotData
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: `SWOT Core value metrics mapped successfully for ${selectedClient.username}` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sync structural SWOT matrix.' });
      }
    } catch (error) { 
      console.error(error);
      setMessage({ type: 'error', text: 'Network configuration mapping failure.' });
    } finally {
      setSwotSubmitting(false);
    }
  };

  // Submit performance matrix updates to backend Gemini Engine endpoints
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/grade-performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clientId: selectedClient._id, workoutMetrics, dietMetrics })
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Performance indicators logged for ${selectedClient.username}!` });
        setWorkoutMetrics('');
        setDietMetrics('');
        
        const updatedAnalysis = data.analysis || data.performanceAnalysis || data;
        setSelectedClient(prev => ({ ...prev, performanceAnalysis: updatedAnalysis }));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit metrics vectors.' });
      }
    } catch (error) { 
      console.error(error);
      setMessage({ type: 'error', text: 'Network connection handshake failure.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    setManualSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/grade/manual/${selectedClient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ grade: manualGrade, feedback: manualFeedback })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: `Admin judgment saved for ${selectedClient.username}.` });
        setManualGrade('');
        setManualFeedback('');
        setSelectedClient(prev => ({ 
          ...prev, 
          aiAnalysis: data.aiAnalysis || prev.aiAnalysis,
          gradeHistory: data.gradeHistory || prev.gradeHistory
        }));
        setClients(prev => prev.map(c => c._id === selectedClient._id ? { 
          ...c, 
          aiAnalysis: data.aiAnalysis || c.aiAnalysis,
          gradeHistory: data.gradeHistory || c.gradeHistory
        } : c));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save manual admin judgment.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Network error saving manual judgment.' });
    } finally {
      setManualSubmitting(false);
    }
  };

  // 🎯 SET FITNESS GOAL FOR CLIENT
  // 📝 Process Seed Data Injections via Management Action Bar
  const handleInjectSeeds = async () => {
    if (!selectedClient) {
      setMessage({ type: 'error', text: 'Select a client first to enter review mode.' });
      return;
    }

    setReviewMode(true);
    setSeeding(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/auto-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          metrics: "Squat load 120kg, tracking linear recovery paths",
          weight: 82,
          primaryGoal: "Hypertrophy structural bounds"
        })
      });
      const data = await response.json();
      if (response.ok) {
        setWorkoutMetrics("Squat load 120kg, tracking linear recovery paths");
        setDietMetrics("Caloric surplus managed cleanly, macros targeted at 3200 kcal.");
        setMessage({ type: 'success', text: `Review mode enabled for ${selectedClient.username}. Enter the client rating below.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed execution structural seeding pipeline. Route not configured on Server backend.' });
      }
    } catch (error) { 
      console.error(error);
      setMessage({ type: 'error', text: 'Seeding network route interface error.' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#262626] font-sans antialiased relative pt-24 pb-16">
      <div className="absolute top-0 right-[5%] w-112.5 h-112.5 bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* UPPER BRANDING BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-200 pb-6 mb-4 text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-1 rounded-full mb-3">
              <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-600 text-[10px] font-mono font-bold uppercase tracking-widest">
                Administrative Control Terminal
              </span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">
              Performance <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-amber-500 normal-case">Management Portal</span>
            </h1>
            <p className="text-neutral-400 text-xs mt-1 font-mono">
              Operational Account: {adminName}
            </p>
          </div>
        </div>

        {/* SYSTEM DIAGNOSTICS CONTROL HOOD */}
        <div className="w-full bg-neutral-900 text-neutral-100 rounded-2xl p-4 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-neutral-800 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">System Diagnostics</span>
            <p className="text-xs text-neutral-400 font-light">Provision internal data mock-ups or clear testing endpoints directly into workspace clusters.</p>
          </div>
          <button
            type="button"
            onClick={handleInjectSeeds}
            disabled={seeding}
            className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-750 text-amber-400 border border-neutral-700 font-mono text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-xl uppercase transition-all shadow-3xs disabled:opacity-40 active:scale-[0.99]"
          >
            {seeding ? "Processing Injection Vector..." : "⚡ Inject Seed Data"}
          </button>
        </div>

        {/* Global messaging portal handler block */}
        {message.text && !selectedClient && (
          <div className={`p-4 rounded-xl text-xs font-mono mb-6 border text-left ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* WORKSPACE LAYOUT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* ROSTER SIDEBAR DIRECTORY */}
          <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Active Roster</h3>
              <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-500 font-bold">{clients.length} Members</span>
            </div>

            {loading ? (
              <p className="text-xs font-mono text-neutral-400 animate-pulse py-4">Pulling document schemas...</p>
            ) : clients.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4">No client directories indexed.</p>
            ) : (
              <div className="space-y-1.5 max-h-105 overflow-y-auto pr-1">
                {clients.map(client => (
                  <button
                    key={client._id}
                    onClick={() => { setSelectedClient(client); setMessage({ type: '', text: '' }); setReviewMode(false); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all block ${
                      selectedClient?._id === client._id
                        ? 'bg-rose-50/50 border-rose-300 text-rose-700 font-medium shadow-2xs'
                        : 'bg-[#FAFAFA]/60 border-neutral-200/50 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-bold text-neutral-900 text-sm truncate">{client.username}</div>
                    <div className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">{client.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MAIN ACTIONS AREA WRAPPER */}
          <div className="lg:col-span-8 space-y-6">
            {!selectedClient ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 text-center text-neutral-400 text-sm font-light py-28 border-dashed">
                Select an active athlete account from the ledger to initiate performance review.
              </div>
            ) : (
              <>
                {/* REVIEW MODE PROMPT */}
                {!reviewMode ? (
                  <div className="bg-white border border-amber-200/70 rounded-2xl p-8 text-center space-y-4 shadow-2xs">
                    <h2 className="text-xl font-bold text-neutral-900">Review Mode Disabled</h2>
                    <p className="text-sm text-neutral-500 max-w-2xl mx-auto">Select a client from the roster, then click <span className="font-semibold text-neutral-900">⚡ Inject Seed Data</span> to enter review mode and unlock the rating workflow.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                        <p className="text-[11px] uppercase tracking-wider text-rose-500 font-bold">Client</p>
                        <p className="mt-2 text-sm text-neutral-900">{selectedClient.username}</p>
                        <p className="text-[11px] text-neutral-500">{selectedClient.email}</p>
                      </div>
                      <div className="p-4 bg-neutral-950/5 border border-neutral-200 rounded-2xl">
                        <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Next Step</p>
                        <p className="mt-2 text-sm text-neutral-700">Use the seed injection action to activate the visible review interface.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
                    <div className="space-y-6">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-sm">
                        <div>
                          <span className="text-emerald-700 text-[9px] block uppercase font-mono tracking-widest">Review Mode Active</span>
                          <strong className="text-neutral-900 text-base font-bold">{selectedClient.username}</strong>
                          <span className="text-neutral-500 block text-xs font-mono">{selectedClient.email}</span>
                        </div>
                        <span className="self-start sm:self-center px-3 py-1 text-[10px] font-mono bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full shadow-3xs">
                          CLIENT UNDER REVIEW
                        </span>
                      </div>

                      <form onSubmit={handleGradeSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">Workout Performance Metrics</label>
                          <textarea
                            rows="3"
                            placeholder="e.g., Progressive overload targets achieved. Bench press mechanics sustained at higher execution bounds."
                            className="w-full bg-[#FAFAFA] border border-neutral-200 p-3.5 rounded-xl text-neutral-800 font-mono text-xs focus:outline-none focus:border-rose-300 focus:bg-white transition-all resize-none shadow-3xs"
                            value={workoutMetrics}
                            onChange={(e) => setWorkoutMetrics(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">Nutrition & Dietary Thresholds</label>
                          <textarea
                            rows="3"
                            placeholder="e.g., Caloric surplus managed cleanly. Macro targets hit within precise 5% margin constraints."
                            className="w-full bg-[#FAFAFA] border border-neutral-200 p-3.5 rounded-xl text-neutral-800 font-mono text-xs focus:outline-none focus:border-rose-300 focus:bg-white transition-all resize-none shadow-3xs"
                            value={dietMetrics}
                            onChange={(e) => setDietMetrics(e.target.value)}
                            required
                          />
                        </div>

                        {message.text && message.type && (
                          <div className={`p-3.5 rounded-xl text-xs font-mono border ${
                            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            {message.text}
                          </div>
                        )}

                        <button 
                          disabled={submitting} 
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider transition-all disabled:opacity-40 shadow-xs active:scale-[0.99]"
                        >
                          {submitting ? "Analyzing Metrics Array via Gemini..." : "Compute Performance Grade & Log"}
                        </button>
                      </form>

                      <form onSubmit={handleManualGradeSubmit} className="space-y-5 bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900 uppercase">Manual Judgement Entry</h3>
                            <p className="text-xs text-neutral-500">Save a coach grade and written feedback for this customer.</p>
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 bg-white border border-neutral-200 rounded-full px-3 py-1">
                            Admin-only
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Judgment Grade</label>
                          <input
                            type="text"
                            value={manualGrade}
                            onChange={(e) => setManualGrade(e.target.value)}
                            placeholder="e.g. A+, 9/10, Strong execution"
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-rose-300 transition-all"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Judgment Feedback</label>
                          <textarea
                            rows="4"
                            value={manualFeedback}
                            onChange={(e) => setManualFeedback(e.target.value)}
                            placeholder="Write a short performance summary and next steps for the client."
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-rose-300 transition-all resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={manualSubmitting}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider transition-all disabled:opacity-40"
                        >
                          {manualSubmitting ? 'Saving Admin Judgment...' : 'Save Admin Judgment'}
                        </button>
                      </form>

                      {/* 📊 SWOT Component Rendering Section */}
                      <SwotEngine 
                        clientName={selectedClient.username}
                        swotData={swotData}
                        onChange={handleSwotChange}
                        onSave={handleSaveSwot}
                        submitting={swotSubmitting}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}