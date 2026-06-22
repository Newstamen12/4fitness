import { Link } from 'react-router-dom';

export default function Footer({ setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0f172a] border-t border-slate-900 text-slate-400 font-sans antialiased mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Brand/Logo Section */}
          <div className="space-y-2">
            <Link 
              to="/" 
              onClick={() => setCurrentPage?.('home')}
              className="inline-flex items-center gap-2 font-black tracking-tighter text-lg text-white uppercase"
            >
              4 <span className="text-emerald-400">FITNESS</span>
            </Link>
            <p className="text-xs text-slate-500 font-mono">
              Forge your discipline. Track your metrics. Achieve perfection.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex justify-center gap-6 text-xs font-mono uppercase tracking-wider font-bold">
            <Link 
              to="/" 
              onClick={() => setCurrentPage?.('home')}
              className="hover:text-emerald-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setCurrentPage?.('about')}
              className="hover:text-emerald-400 transition-colors"
            >
              About
            </Link>
            {/* 🌟 FIX: Links beautifully to your new premium sandbox page instead of an unpolished window alert! */}
            <Link 
              to="/premium" 
              onClick={() => setCurrentPage?.('premium')}
              className="hover:text-emerald-400 transition-colors"
            >
              Premium
            </Link>
          </div>

          {/* Secure Access/System Status */}
          <div className="md:text-right space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-slate-500 uppercase bg-slate-900/50 border border-slate-900 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Core System Live
            </span>
            <p className="text-[10px] font-mono text-slate-600 mt-1">
              &copy; {currentYear} 4 FITNESS. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}