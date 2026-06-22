import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ user }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Grading fields
  const [workoutMetrics, setWorkoutMetrics] = useState('');
  const [dietMetrics, setDietMetrics] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Token extraction from auth state
  const token = user?.token || user?.user?.token;
  const adminName = user?.username || user?.user?.username || 'Admin';

  // Fetch registered athlete directories
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/user/profiles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          // Keep the list clean by filtering out other admins
          setClients(data.filter(c => c.role !== 'admin'));
        }
      } catch (err) {
        console.error("Error accessing profile index directories:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchClients();
  }, [token]);

  // Submit performance matrix updates to backend MongoDB
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:4000/api/user/grade-performance', {
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
        
        // Sync internal client wrapper state instantly
        const updatedAnalysis = data.analysis || data.performanceAnalysis || data;
        setSelectedClient(prev => ({ ...prev, performanceAnalysis: updatedAnalysis }));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit metrics vectors.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection handshake failure.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#262626] font-sans antialiased relative pt-24 pb-16">
      {/* Soft Luxury Accent Blur */}
      <div className="absolute top-0 right-[5%] w-[450px] h-[450px] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* UPPER BRANDING BAR */}
        <div className="border-b border-neutral-200 pb-6 mb-10 text-left">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-1 rounded-full mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-600 text-[10px] font-mono font-bold uppercase tracking-widest">
              Administrative Control Terminal
            </span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">
            Performance <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 normal-case">Management Portal</span>
          </h1>
          <p className="text-neutral-400 text-xs mt-1 font-mono">
            Operational Account: {adminName}
          </p>
        </div>

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
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {clients.map(client => (
                  <button
                    key={client._id}
                    onClick={() => { setSelectedClient(client); setMessage({ type: '', text: '' }); }}
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

          {/* DYNAMIC GRADING WORKSPACE ENGINE */}
          <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            {!selectedClient ? (
              <div className="border border-dashed border-neutral-200 rounded-2xl py-28 text-center text-neutral-400 text-sm font-light">
                Select an active athlete account from the ledger to initiate performance review.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Highlighted Profile Snapshot Pill */}
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-sm">
                  <div>
                    <span className="text-neutral-400 text-[9px] block uppercase font-mono tracking-widest">Evaluating Profile</span>
                    <strong className="text-neutral-900 text-base font-bold">{selectedClient.username}</strong>
                    <span className="text-neutral-400 block text-xs font-mono">{selectedClient.email}</span>
                  </div>
                  <span className="self-start sm:self-center px-3 py-1 text-[10px] font-mono bg-white border border-neutral-200 text-neutral-500 rounded-full shadow-3xs">
                    ID: {selectedClient._id.substring(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Input Controls */}
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

                  {message.text && (
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

                {/* Current Active Logs Ledger Mirror */}
                {selectedClient.performanceAnalysis && (
                  <div className="mt-6 pt-5 border-t border-neutral-100 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Active Database Entry Profile</h4>
                    <div className="bg-[#FAFAFA] p-4 rounded-xl border border-neutral-200 font-mono text-[11px] text-neutral-500 max-h-40 overflow-y-auto shadow-3xs">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(selectedClient.performanceAnalysis, null, 2)}</pre>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}