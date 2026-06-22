import { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About'; 
import PremiumUpgrade from './pages/PremiumUpgrade';

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
              <ProtectedRoute user={user}>
                <Home user={user} />
              </ProtectedRoute>
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
              <Navigate to={user ? (isAdmin ? "/admin-dashboard" : "/profile") : "/login"} replace />} 
            />

          </Routes>
        </main>

        <Footer setCurrentPage={setCurrentPage} />

      </div>
    </Router>
  );
}