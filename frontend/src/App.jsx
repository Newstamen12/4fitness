import { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About'; 
import PremiumUpgrade from './pages/PremiumUpgrade';
import AuthPanel from './components/AuthPanel';

// 🛡️ 1. PROTECTED ROUTE WRAPPER (Moved outside of render)
// Blocks non-logged-in users from seeing internal pages
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🔓 2. PUBLIC ONLY ROUTE WRAPPER (Moved outside of render)
// If they ARE logged in, stop them from going back to Login/Signup pages
const PublicRoute = ({ user, isAdmin, children }) => {
  if (user) {
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/profile"} replace />;
  }
  return children;
};

function LandingPage({ setUser }) {
  return (
    <div className="min-h-[80vh] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_60%,_#111827_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300">
            Welcome to 4 FITNESS
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Train smarter with a personal performance hub.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:mx-0">
            Track goals, review progress, and keep your coaching journey moving with a polished client dashboard built for momentum.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Goal tracking</div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Performance reviews</div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Actionable coaching</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300">Featured client dashboard</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Ari • Performance snapshot</h2>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                +12% this month
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Consistency</p>
                <p className="mt-2 text-2xl font-black text-white">92%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recovery</p>
                <p className="mt-2 text-2xl font-black text-white">84%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strength</p>
                <p className="mt-2 text-2xl font-black text-white">+6.2%</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Weekly readiness</span>
                <span className="font-semibold text-white">82%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-700">
                <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Next goal</p>
                  <p className="mt-1 font-semibold text-white">Complete 3 mobility sessions</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Coach note</p>
                  <p className="mt-1 font-semibold text-white">Keep protein intake steady</p>
                </div>
              </div>
            </div>
          </div>

          <AuthPanel setUser={setUser} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Safe synchronous state initialization from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user session:", error);
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  const [currentPage, setCurrentPage] = useState('home');

  const resolvedProfile = user?.user ? user.user : user;
  const isAdmin = resolvedProfile?.role === 'admin';

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950">
        
        <Navbar 
          user={user} 
          setUser={setUser} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
        
        <main className="grow">
          <Routes>
            
            {/* Private Internal Pages */}
            <Route path="/" element={
              user ? <Home user={user} /> : <LandingPage setUser={setUser} />
            } />
            
            <Route path="/about" element={
              <ProtectedRoute user={user}>
                <About />
              </ProtectedRoute>
            } />
            
            <Route path="/premium-upgrade" element={
              <ProtectedRoute user={user}>
                <PremiumUpgrade user={user} setUser={setUser} />
              </ProtectedRoute>
            } />

            {/* Secure Profile / Role Protections */}
            <Route path="/profile" element={
              user && !isAdmin ? <Profile user={user} /> : <Navigate to="/login" replace />
            } />

            <Route path="/performance-dashboard" element={
              user ? <ClientDashboard user={user} /> : <Navigate to="/login" replace />
            } />
            
            <Route path="/admin-dashboard" element={
              isAdmin ? <AdminDashboard user={user} /> : <Navigate to="/login" replace />
            } />

            {/* Dedicated Auth Form Entryways */}
            <Route path="/login" element={
              <PublicRoute user={user} isAdmin={isAdmin}>
                <Login setUser={setUser} />
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute user={user} isAdmin={isAdmin}>
                <Signup />
              </PublicRoute>
            } />

            {/* Fallback Catch-all Router Protection */}
            <Route path="*" element={
              <Navigate to={user ? (isAdmin ? "/admin-dashboard" : "/profile") : "/"} replace />} 
            />

          </Routes>
        </main>

        <Footer setCurrentPage={setCurrentPage} />

      </div>
    </Router>
  );
}