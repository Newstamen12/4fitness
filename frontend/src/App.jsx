import { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
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
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-950/20">
          <h1 className="text-4xl font-black text-white mb-4">Welcome to 4 FITNESS</h1>
          <p className="text-slate-400 mb-6">Please sign in or create a profile to continue.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="/login" className="rounded-2xl bg-emerald-500 px-6 py-4 text-center text-white font-bold uppercase tracking-[0.12em] hover:bg-emerald-400 transition">Sign In</a>
            <a href="/signup" className="rounded-2xl border border-slate-700 px-6 py-4 text-center text-slate-100 font-bold uppercase tracking-[0.12em] hover:bg-slate-800 transition">Sign Up</a>
          </div>
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
              user ? <Home user={user} /> : <Navigate to="/login" replace />
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

            <Route path="/forgot-password" element={
              <PublicRoute user={user} isAdmin={isAdmin}>
                <ForgotPassword />
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