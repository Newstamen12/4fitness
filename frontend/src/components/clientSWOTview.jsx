import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

export default function ClientSwotView({ user }) {
  const [swot, setSwot] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = user?.token || user?.user?.token;

  useEffect(() => {
    const fetchMySwot = async () => {
      try {
        const profileRes = await fetch(apiUrl('/api/user/profile-details'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        
        if (profileRes.ok && profileData._id) {
          const swotRes = await fetch(apiUrl(`/api/user/swot/${profileData._id}`), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const swotData = await swotRes.json();
          if (swotRes.ok) {
            setSwot(swotData);
          }
        }
      } catch (error) {
        console.error("Error loading personal SWOT evaluation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMySwot();
  }, [token]);

  if (loading) return <p className="text-xs font-mono text-slate-400 animate-pulse p-6">Syncing performance matrix charts...</p>;
  if (!swot || (!swot.strengths && !swot.weaknesses && !swot.opportunities && !swot.threats)) return null;

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm mt-8 text-left">
      <div className="border-b border-neutral-100 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">Official Coach Evaluation</span>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-neutral-900 uppercase">Your Performance SWOT Matrix</h3>
        <p className="text-xs text-neutral-400">Strategic physical analysis deployed directly by your head trainer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2">
          <span className="block text-xs font-bold tracking-wider text-emerald-800 uppercase font-mono">💪 Strengths // Consistency</span>
          <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap">
            {swot.strengths || "Awaiting structural assessment updates..."}
          </p>
        </div>

        <div className="p-5 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-2">
          <span className="block text-xs font-bold tracking-wider text-rose-800 uppercase font-mono">⏳ Weaknesses // Discipline</span>
          <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap">
            {swot.weaknesses || "No execution vulnerabilities flagged."}
          </p>
        </div>

        <div className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-2">
          <span className="block text-xs font-bold tracking-wider text-amber-800 uppercase font-mono">📈 Opportunities // Growth</span>
          <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap">
            {swot.opportunities || "Awaiting load expansion recommendations..."}
          </p>
        </div>

        <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
          <span className="block text-xs font-bold tracking-wider text-neutral-700 uppercase font-mono">🎯 Threats // Dedication</span>
          <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap">
            {swot.threats || "No routine plateau indicators flagged."}
          </p>
        </div>
      </div>
    </div>
  );
}