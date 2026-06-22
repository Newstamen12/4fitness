import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-full min-h-[calc(screen-16)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">⚡ Engineered Operational Platform</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-white">
          Intelligent Metrics.<br />
          <span className="text-emerald-400">Elite Performance.</span>
        </h1>
        
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Welcome to the 4 FITNESS central diagnostic space. Track, grade, and optimize your thresholds smoothly.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/auth" className="bg-emerald-500 text-slate-950 font-black px-8 py-4 rounded-xl uppercase text-sm tracking-wider hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10">
            Client Access Workspace
          </Link>
          <Link to="/admin-portal" className="bg-slate-900 border border-slate-800 text-slate-300 font-bold px-8 py-4 rounded-xl uppercase text-sm tracking-wider hover:text-white transition-colors">
            Administrative Gate
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 max-w-3xl mx-auto text-left">
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-xl space-y-2">
            <div className="text-xl">🛡️</div>
            <h3 className="font-bold text-white">Admin AI Grading Hub</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Allows administrators to evaluate performance parameters, compute execution metrics, and instantly generate score breakdowns.</p>
          </div>
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-xl space-y-2">
            <div className="text-xl">⚙️</div>
            <h3 className="font-bold text-white">AI Food & Diet Engine</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Provides users immediate clarity over adaptive macro balances and targeted meal layout sheets relative to output data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}