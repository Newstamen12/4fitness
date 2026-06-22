import { useState, useEffect } from 'react';

export default function Profile({ user }) {
  // ----------------------------------------------------------------
  // 1. STATE & INITIALIZATION (Lazy Initializer for Pure Renders)
  // ----------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('workouts');
  
  // Admin configured prescriptions
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

  // Using function initializer to completely resolve purity warnings
  const [workouts, setWorkouts] = useState(() => [
    { _id: '1', title: 'Compound Deadlifts', load: 140, reps: 6, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: '2', title: 'Progressive Overload Bench Press', load: 100, reps: 8, createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Form States
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);

  // User resolution logic
  const resolvedUser = user?.user ? user.user : user;
  const clientName = resolvedUser?.username || resolvedUser?.name || 'Athlete';
  const clientEmail = resolvedUser?.email || 'No synchronized email';

  // Sanitized Safe HIIT Timer Loop
  useEffect(() => {
    let interval = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerRunning(false); // Clean asynchronous de-activation
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // ----------------------------------------------------------------
  // 2. CORE COMPUTED ANALYTICS METRICS
  // ----------------------------------------------------------------
  const totalVolume = workouts.reduce((acc, curr) => acc + (Number(curr.load || 0) * Number(curr.reps || 0)), 0);
  
  const personalRecord = workouts.length > 0 
    ? Math.max(...workouts.map(w => Number(w.load || 0))) 
    : 0;

  const totalSetsLogged = workouts.length;

  // ----------------------------------------------------------------
  // 3. SYSTEM HANDLERS
  // ----------------------------------------------------------------
  const handleCreateWorkout = (e) => {
    e.preventDefault();
    if (!title || !load || !reps) {
      setError('All metadata tracking fields are required.');
      return;
    }

    const newWorkout = {
      _id: Date.now().toString(),
      title,
      load: Number(load),
      reps: Number(reps),
      createdAt: new Date().toISOString()
    };

    setWorkouts([newWorkout, ...workouts]);
    setTitle('');
    setLoad('');
    setReps('');
    setError(null);
    
    // Auto-trigger 60s rest period timer on tracking commit
    setTimeLeft(60);
    setIsTimerRunning(true);
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w._id !== id));
  };

  const seedMockData = () => {
    const diagnosticData = [
      { _id: 'mock-1', title: 'Barbell Back Squat', load: 120, reps: 6, createdAt: new Date().toISOString() },
      { _id: 'mock-2', title: 'Overhead Military Press', load: 60, reps: 8, createdAt: new Date().toISOString() },
      { _id: 'mock-3', title: 'Weighted Pull-Ups', load: 20, reps: 5, createdAt: new Date().toISOString() },
      { _id: 'mock-4', title: 'Romanian Deadlift', load: 100, reps: 10, createdAt: new Date().toISOString() }
    ];
    setWorkouts([...diagnosticData, ...workouts]);
  };

  // Head Admin Coach WhatsApp connection channel
  const whatsappNumber = "2348000000000"; 
  const whatsappMessage = encodeURIComponent(`Hello Coach, I am logged into my 4 FITNESS portal and I want to inquire about your private 1-on-1 coaching program!`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 sm:p-8 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER BRAND BANNER */}
        <div className="bg-linear-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">4 FITNESS ATHLETE PORTAL</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Welcome Back, <span className="text-emerald-400">{clientName}</span>!
            </h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{clientEmail}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={seedMockData}
              className="text-[10px] font-mono tracking-wider uppercase bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 px-4 py-2.5 rounded-xl transition-all font-bold cursor-pointer"
            >
              🧪 Inject Seed Data
            </button>
            <div className="bg-slate-950 border border-slate-800/80 px-4 py-2 rounded-xl text-center md:text-right hidden sm:block">
              <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-wider">Assigned By</span>
              <span className="text-emerald-400 font-bold text-xs uppercase font-mono">● Head Admin Coach</span>
            </div>
          </div>
        </div>

        {/* PREMIUM WHATSAPP PRIVATE COACHING BANNER */}
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

        {/* ANALYTICS ENGINE HUB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-md">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black">Gross Volume Moved</span>
            <div className="text-3xl font-black tracking-tight text-white mt-2 font-mono">
              {totalVolume.toLocaleString()} <span className="text-emerald-400 text-xs font-sans font-bold">KG</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Sum of all cumulative sets parsed.</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-md">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black">Absolute Peak Load (PR)</span>
            <div className="text-3xl font-black tracking-tight text-emerald-400 mt-2 font-mono">
              {personalRecord} <span className="text-white text-xs font-sans font-bold">KG</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Highest structural thresholds cleared.</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-md">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black">Total Dataset Entries</span>
            <div className="text-3xl font-black tracking-tight text-white mt-2 font-mono">
              {totalSetsLogged} <span className="text-slate-500 text-xs font-sans font-bold">SETS</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Active entries compiled in workspace storage.</p>
          </div>
        </div>

        {/* NAVIGATION TABS (ADMIN CONFIGS) */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-800 gap-2">
            {['workouts', 'nutrition'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-mono tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
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

          {/* VIEW PANEL CONTENTS */}
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

        {/* RUNTIME METRICS LOGGING LAYER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LOGGER COMPONENT BLOCK */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* INTRA-SET TIMER PROTOCOL */}
            <div className="p-6 bg-slate-900 border border-emerald-500/10 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">⚡ Intra-Set Rest Protocol</span>
                <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'}`} />
              </div>
              <div className="text-center py-4 bg-slate-950/60 border border-slate-950 rounded-xl">
                <div className="text-5xl font-mono font-black tracking-widest text-emerald-400">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] font-bold uppercase">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`py-2.5 rounded-lg transition-colors cursor-pointer ${isTimerRunning ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
                >
                  {isTimerRunning ? 'Pause System' : 'Start Interval'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsTimerRunning(false); setTimeLeft(60); }}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Clock
                </button>
              </div>
            </div>

            {/* TELEMETRY LOGGER FORM */}
            <form onSubmit={handleCreateWorkout} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">Log Execution Set</h3>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">Commit active performance loads to records.</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Exercise Nomenclature</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  list="prescribed-exercises"
                  placeholder="e.g., Compound Deadlifts"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-hidden transition-colors font-medium"
                />
                <datalist id="prescribed-exercises">
                  {assignedWorkouts.map(w => (
                    <option key={w.id} value={w.exercise} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Mass Load (KG)</label>
                  <input 
                    type="number" value={load} onChange={(e) => setLoad(e.target.value)} placeholder="140"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm font-mono outline-hidden transition-colors text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Repetitions</label>
                  <input 
                    type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="6"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm font-mono outline-hidden transition-colors text-white"
                  />
                </div>
              </div>

              {error && <p className="text-xs font-mono font-bold text-rose-400 bg-rose-500/5 p-2.5 border border-rose-500/10 rounded-lg">{error}</p>}

              <button type="submit" className="w-full bg-slate-950 border border-slate-800 hover:border-emerald-500/30 text-white hover:text-emerald-400 font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider transition-all cursor-pointer">
                Commit Entry Matrix →
              </button>
            </form>
          </div>

          {/* TELEMETRY HISTORY DISPLAY */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 h-full flex flex-col justify-between">
            <div className="w-full">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h3 className="font-black text-base text-white uppercase tracking-tight">Personal Performance Track Records</h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">Historical telemetry records verified in local isolated instance.</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase hidden sm:inline">Active Live Cache</span>
              </div>

              {workouts.length === 0 ? (
                <div className="p-12 text-center bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl text-slate-500 font-mono text-xs my-4">
                  No tracking parameters processed yet. Inject staging data to compile view metrics.
                </div>
              ) : (
                <div className="space-y-3 max-h-115 overflow-y-auto pr-1 mt-2">
                  {workouts.map((workout) => (
                    <div 
                      key={workout._id}
                      className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl flex justify-between items-center hover:border-emerald-500/20 transition-all group"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                          {workout.title}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500">
                          {workout.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex gap-4 font-mono text-xs text-right">
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider">LOAD</span>
                            <span className="text-emerald-400 font-bold">{workout.load} kg</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-wider">REPS</span>
                            <span className="text-slate-200 font-bold">{workout.reps}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteWorkout(workout._id)}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer text-[10px] font-mono px-2.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
