import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

export default function AdminSwotEngine({ clientName = "Member", selectedClientId, onSaveSwot }) {
  const [swotData, setSwotData] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });
  const [loading, setLoading] = useState(false);

  // Look up existing SWOT records whenever the selected client changes
  useEffect(() => {
    const fetchClientSwot = async () => {
      if (!selectedClientId) return;
      
      setLoading(true);
      try {
        const response = await fetch(apiUrl(`/api/user/swot/${selectedClientId}`), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (response.ok && data) {
          setSwotData({
            strengths: data.strengths || '',
            weaknesses: data.weaknesses || '',
            opportunities: data.opportunities || '',
            threats: data.threats || ''
          });
        } else {
          // Reset fields if the selected client doesn't have a SWOT matrix yet
          setSwotData({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
        }
      } catch (error) {
        console.error("Error fetching client matrix data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSwot();
  }, [selectedClientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSwotData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSwot) {
      onSaveSwot(swotData);
    }
  };

  if (loading) {
    return <p className="text-xs font-mono text-neutral-400 animate-pulse">Reindexing client performance metrics...</p>;
  }

  return (
    <div className="w-full bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-neutral-100/40 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-50 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">Administrative Framework</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
            Performance SWOT Evaluation
          </h2>
          <p className="text-xs text-neutral-400 font-normal">
            Evaluating matrix thresholds for client: <span className="text-neutral-700 font-mono font-semibold">{clientName}</span>
          </p>
        </div>
      </div>

      {/* SWOT Input Grid Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* STRENGTHS */}
          <div className="p-5 bg-emerald-50/30 border border-emerald-100/80 rounded-2xl space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase font-mono">
              <span>💪 [S] Strengths // Consistency</span>
            </label>
            <textarea
              name="strengths"
              value={swotData.strengths}
              onChange={handleChange}
              placeholder="Record physical baseline milestones..."
              className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all resize-none"
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
              onChange={handleChange}
              placeholder="Identify execution friction points..."
              className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all resize-none"
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
              onChange={handleChange}
              placeholder="Map out training load expansions..."
              className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
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
              onChange={handleChange}
              placeholder="Log high fatigue indicators..."
              className="w-full h-32 bg-white border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all resize-none"
            />
          </div>

        </div>

        {/* Submit Execution Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-neutral-900 text-white font-mono text-xs font-bold tracking-widest px-8 py-4 rounded-xl uppercase hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99]"
          >
            Deploy SWOT Metrics →
          </button>
        </div>
      </form>
    </div>
  );
}