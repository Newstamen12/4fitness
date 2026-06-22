import { useState } from 'react';

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState('workouts');
  
  // Admin configured assignments
  const [assignedWorkouts] = useState([
    { id: 1, exercise: "Compound Deadlifts", sets: "4 Sets x 6 Reps", note: "Focus on explosive drive from the floor" },
    { id: 2, exercise: "Weighted Planks / Ab Rollouts", sets: "3 Sets x Failure", note: "Keep core locked, no hip sagging" },
    { id: 3, exercise: "Hamstring Curls & Glute Bridges", sets: "3 Sets x 10 Reps", note: "Squeeze glutes for 2 seconds at the top" },
    { id: 4, exercise: "Progressive Overload Bench Press", sets: "4 Sets x 8 Reps", note: "Add 2.5kg if last week felt comfortable" },
  ]);

  const [assignedMeals] = useState([
    { id: 1, name: "Breakfast", details: "Oats, Whey Protein, 1 Banana", calories: 650 },
    { id: 2, name: "Lunch", details: "Grilled Chicken Breast, Basmati Rice & 1/2 Avocado", calories: 850 },
    { id: 3, name: "Pre-Workout", details: "Rice Cakes with 2 tbsps Peanut Butter", calories: 300 },
    { id: 4, name: "Dinner", details: "Lean Beef, Sweet Potatoes & Steamed Broccoli", calories: 900 },
  ]);

  const clientName = user?.user?.username || user?.username || 'Athlete';
  const clientEmail = user?.user?.email || user?.email || 'No synchronized email';

  // 📞 Head Admin Coach WhatsApp connection
  const whatsappNumber = "2348000000000"; 
  const whatsappMessage = encodeURIComponent(`Hello Coach, I am logged into my 4 FITNESS portal and I want to inquire about your private 1-on-1 coaching program!`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER BRAND BANNER */}
        {/* Updated syntax on line below: bg-linear-to-r */}
        <div className="bg-linear-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">4 FITNESS ATHLETE PORTAL</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Welcome Back, <span className="text-emerald-400">{clientName}</span>!
            </h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{clientEmail}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 px-4 py-2 rounded-xl text-center md:text-right">
            <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider">Assigned By</span>
            <span className="text-emerald-400 font-bold text-xs uppercase font-mono">● Head Admin Coach</span>
          </div>
        </div>

        {/* PREMIUM WHATSAPP PRIVATE COACHING BANNER */}
        {/* Updated syntax on line below: bg-linear-to-br */}
        <div className="bg-linear-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🔥</span> Premium Private 1-on-1 Training
            </h2>
            <p className="text-slate-300 text-xs max-w-xl">
              Ready to accelerate your results? Get custom macro targets, video form reviews, and direct 24/7 access to your coach via secure WhatsApp chat.
            </p>
          </div>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase rounded-xl tracking-wider transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            💬 Chat On WhatsApp
          </a>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 gap-2">
          {['workouts', 'nutrition'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono tracking-wider uppercase border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-emerald-400 text-emerald-400 font-bold bg-emerald-500/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'workouts' && '🏋️‍♂️ Assigned Training Plan'}
              {tab === 'nutrition' && '🥗 Admin Diet Prescriptions'}
            </button>
          ))}
        </div>

        {/* MAIN VIEWPANEL */}
        <div className="grid grid-cols-1 gap-6">

          {/* TAB 1: WORKOUTS */}
          {activeTab === 'workouts' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-black text-lg text-white">Your Admin Prescribed Workout Protocol</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Execute your custom sets and reps exactly as detailed below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {assignedWorkouts.map((w) => (
                  <div key={w.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-bold text-slate-200">{w.exercise}</span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-cyan-400 font-bold shrink-0">{w.sets}</span>
                    </div>
                    <p className="text-xs text-slate-400 italic font-sans border-t border-slate-900 pt-2">
                      <span className="text-emerald-400 font-mono font-bold not-italic mr-1">Coach Note:</span> {w.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NUTRITION */}
          {activeTab === 'nutrition' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-lg text-white">Daily Target Macro Profile</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Admin configured nutritional intake distribution.</p>
                </div>
                <span className="text-xs font-mono text-amber-400 font-black bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  2,700 kcal Target
                </span>
              </div>

              <div className="space-y-3">
                {assignedMeals.map((m) => (
                  <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 block">{m.name}</span>
                      <span className="text-sm text-slate-200 font-sans font-medium">{m.details}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400 shrink-0 bg-slate-900 px-2.5 py-1 rounded border border-slate-800/80">
                      {m.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}