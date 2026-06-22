import { Link } from 'react-router-dom';
import ifeanyiImg from '../assets/ifeanyi.png';
import logoImg from '../assets/4fitness logo.jpg';

export default function Home({ user }) {
  const resolvedUser = user?.user ? user.user : user;
  const isAdmin = resolvedUser?.role === 'admin';

  const brandCards = [
    { icon: "✨", title: "INTELLIGENT METRICS", desc: "Algorithmic parameter tracking calculated to optimize structural output ceilings smoothly." },
    { icon: "🤍", title: "ELEVATED RADIANCE", desc: "Premium wellness tracking built to empower alignment, vitality, and physical strength." },
    { icon: "⚙️", title: "BIOMECHANICAL FORM", desc: "Prioritizing strict posture, joint safety, and elegant movement execution vectors." },
    { icon: "🌸", title: "ADAPTIVE NUTRITION", desc: "Immediate target layouts over macro balances engineered perfectly for your lifestyle." },
    { icon: "🔥", title: "PROGRESSIVE ENERGY", desc: "Systematic performance escalation mapping structured to step up physical ceilings." },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-neutral-800 font-sans antialiased selection:bg-rose-200 selection:text-neutral-900 overflow-x-hidden relative">
      
      {/* LUXURY LUXE GRADIENT AMBIENT RAYS */}
      <div className="absolute top-[-5%] left-[20%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. CLEAN CHIC NAVIGATION BAR */}
      <nav className="w-full border-b border-neutral-100 bg-[#FAFAFA]/70 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img 
              src={logoImg} 
              alt="4 FITNESS Logo" 
              className="h-9 w-auto object-contain mix-blend-multiply group-hover:scale-[1.01] transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://placehold.co/150x150/FAFAFA/333333?text=4+FITNESS";
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest text-rose-500 font-bold uppercase bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
              {resolvedUser ? `WELCOME PORTAL // ${resolvedUser.name || 'MEMBER'}` : 'EMPOWER YOURSELF'}
            </span>
          </div>
        </div>
      </nav>

      <main className="w-full py-20 space-y-36 relative z-10">
        
        {/* 2. MAJESTIC HERO SECTION WITH STEADY SCROLL PAUSE */}
        <section className="w-full space-y-16 pt-4">
          <div className="max-w-4xl mx-auto text-center px-4 space-y-8 relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/60 px-5 py-2 rounded-full shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-rose-500 text-xs font-mono font-black uppercase tracking-widest">THE 4 FITNESS EXPERIENCE</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-neutral-900 leading-[1.05]">
              Intelligent Metrics.<br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-amber-500">
                Beautiful Performance.
              </span>
            </h1>
            
            <p className="text-neutral-500 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
              Transform the way you trace your strength. Evaluate physical performance indexes, record logs effortlessly, and unlock your physical threshold beautifully.
            </p>

            <div className="flex justify-center flex-wrap gap-4 pt-2">
              {resolvedUser ? (
                <Link 
                  to={isAdmin ? "/admin-dashboard" : "/profile"} 
                  className="bg-neutral-900 text-white font-medium px-10 py-4.5 rounded-full uppercase text-xs tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-[0.98]"
                >
                  ENTER WORKSPACE →
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-10 py-4.5 rounded-full uppercase text-xs tracking-widest hover:opacity-95 transition-all shadow-lg shadow-rose-400/20 active:scale-[0.98]">
                    CREATE ACCOUNT
                  </Link>
                  <Link to="/login" className="bg-white border border-neutral-200 text-neutral-700 font-medium px-10 py-4.5 rounded-full uppercase text-xs tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                    SIGN IN
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* INFINITE MARQUEE SHELF (WITH EASE-IN-OUT STOP LOGIC) */}
          <div className="relative w-full overflow-hidden border-y border-neutral-100 bg-white/60 py-8 group">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-loop px-4 group-hover:[animation-play-state:paused] transition-transform duration-700">
              {[...brandCards, ...brandCards].map((card, idx) => (
                <div 
                  key={idx} 
                  className="w-76 sm:w-84 bg-white border border-neutral-100 rounded-2xl p-6 space-y-4 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 group/card select-none"
                >
                  <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-lg text-rose-500 border border-rose-100">
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold tracking-wider text-neutral-800 uppercase">{card.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PLATFORM CORE MODULE CARDS (FLOAT UP/DOWN SCROLL REACTIVE) */}
        <section className="scroll-capture-flow max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest text-center md:text-left">
            // Core Framework Modules
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto md:mx-0 text-left">
            <Link 
              to={resolvedUser && isAdmin ? "/admin-dashboard" : "/login"} 
              className="p-8 bg-white border border-neutral-100 rounded-2xl space-y-3 block hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="text-xl">🛡️</div>
              <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider group-hover:text-rose-500 transition-colors">Admin Hub</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Allows administrators to evaluate performance parameters, compute execution metrics, and instantly generate score breakdowns.</p>
            </Link>
            
            <Link 
              to={resolvedUser ? (isAdmin ? "/admin-dashboard" : "/profile") : "/login"} 
              className="p-8 bg-white border border-neutral-100 rounded-2xl space-y-3 block hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="text-xl">⚙️</div>
              <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider group-hover:text-rose-500 transition-colors">Food & Diet Engine</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">Provides users immediate clarity over adaptive macro balances and targeted meal layout sheets relative to output data.</p>
            </Link>
          </div>
        </section>

        {/* 4. PREMIUM IFEANYI BIOGRAPHY ACCUSED PRESTIGE (FLOAT UP/DOWN SCROLL REACTIVE) */}
        <section className="scroll-capture-flow max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden p-6 sm:p-12 shadow-xl shadow-neutral-100 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden group shadow-lg border border-neutral-100 bg-neutral-50">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent z-10" />
                  <img 
                    src={ifeanyiImg} 
                    alt="Ifeanyi Profile Showcase" 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out filter brightness-[1.02]"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-[1px] w-6 bg-rose-400" />
                    <span className="text-xs font-mono uppercase tracking-widest text-rose-500 font-bold">
                      HEAD FITNESS DIRECTOR
                    </span>
                  </div>
                  <h2 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">
                    MEET <span className="font-serif italic font-normal text-rose-500">IFEANYI</span>
                  </h2>
                </div>

                <p className="text-neutral-500 text-sm leading-relaxed">
                  Ifeanyi Onyeneke is the Founder and CEO of 4 Fitness. A graduate of Human Kinetics from Tai Solarin University of Education, he began his fitness career in 2023 at the Covenant University Gym Centre. Over the years, he has gained valuable experience as a fitness coach and is currently a Professional Certified Fitness Coach at i-Fitness. Through 4 Fitness, he is committed to helping individuals achieve healthier lifestyles and reach their full physical potential.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-[#FAFAFA] border border-neutral-100 rounded-xl space-y-1">
                    <span className="text-rose-500 text-xs font-bold block tracking-wider">01 // BIOMECHANICAL FORM</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">Prioritizing joint longevity, safe weight distributions, and flawless alignment vectors.</p>
                  </div>
                  <div className="p-5 bg-[#FAFAFA] border border-neutral-100 rounded-xl space-y-1">
                    <span className="text-amber-600 text-xs font-bold block tracking-wider">02 // PROGRESSIVE LOGS</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">Systematically stepping up physical performance load limits consistently over time.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <footer className="w-full border-t border-neutral-100 py-8 text-center text-[9px] font-mono text-neutral-400 tracking-widest uppercase relative z-10 bg-white">
        © {new Date().getFullYear()} 4 FITNESS STUDIO LABS. ALL RIGHTS RESERVED.
      </footer>

    </div>
  );
}