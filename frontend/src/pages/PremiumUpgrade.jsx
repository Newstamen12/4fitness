import { useState } from 'react';

export default function PremiumUpgrade({ user, setUser }) {
  const [isActivating, setIsActivating] = useState(false);
  const [success, setSuccess] = useState(false);

  const resolvedUser = user?.user ? user.user : user;
  const isAdmin = resolvedUser?.role === 'admin';

  const handleSimulatedUpgrade = () => {
    setIsActivating(true);
    
    // Simulate a brief network check to make it look realistic
    setTimeout(() => {
      setIsActivating(false);
      setSuccess(true);

      // Create the updated user payload with an admin/premium role
      const updatedUser = {
        ...user,
        user: {
          ...resolvedUser,
          role: 'admin' // Instantly elevate them to Admin to showcase all features
        }
      };

      // Save to localStorage and update state so the entire app reflects the upgrade
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
            4 FITNESS ELITE
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight">Tier Activation</h2>
          <p className="text-slate-400 text-xs font-medium">
            Unlock advanced diagnostic metrics and the full backend configuration suite.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 bg-slate-950/50 p-4 border border-slate-950 rounded-xl font-sans text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="text-emerald-400">✔</span> Advanced Metrics Hub Access
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="text-emerald-400">✔</span> Diagnostic Food & Diet Planner
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="text-emerald-400">✔</span> Full Administrative Privileges
          </div>
        </div>

        {/* Dynamic Interactive Button */}
        <div className="pt-2">
          {isAdmin || success ? (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-mono text-xs font-bold py-4 rounded-xl uppercase tracking-wider animate-pulse">
              🎉 Elite Status Fully Active
            </div>
          ) : (
            <button
              onClick={handleSimulatedUpgrade}
              disabled={isActivating}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl uppercase text-xs tracking-wider transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              {isActivating ? 'Bypassing Gateway Engine...' : 'Bypass Payment & Activate →'}
            </button>
          )}
        </div>

        <p className="text-[10px] text-center text-slate-500 font-mono">
          Staging Build Sandbox. No financial transactions will be processed.
        </p>
      </div>
    </div>
  );
}