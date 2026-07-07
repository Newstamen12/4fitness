import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error);
      } else {
        setLoading(false);
        setSuccessMessage("Authentication verified! Loading profile...");
        
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data); 

        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/profile');
          }
        }, 1000);
      }
    } catch (error) { console.error(error);
      setLoading(false);
      setError("Cannot link to authentication service. Verify your backend server is running.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access the 4 FITNESS operational platform</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">{error}</div>}
          {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">{successMessage}</div>}

          <button disabled={loading} className="w-full bg-slate-800 text-white font-black py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-slate-700 disabled:opacity-50">
            {loading ? "Verifying Matrix..." : "Initialize Interface Access"}
          </button>

          <p className="text-xs text-center text-slate-500 pt-2">
            New athlete? <Link to="/signup" className="text-emerald-400 hover:underline">Register Profile here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}