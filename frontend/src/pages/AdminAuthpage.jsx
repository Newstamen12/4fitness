import { useState } from 'react';
import { apiUrl } from '../config/api';

export default function AdminAuthPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/user/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Administrative handshake failure.");
      } else {
        const checkRole = data.role || data.user?.role;
        if (checkRole !== 'admin') {
          setError("Access revoked. Invalid administrative credentials.");
          return;
        }
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      }
    } catch (err) {
      console.error(err);
      setError("Cannot establish link to access matrix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 text-white bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-red-500/20 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center">
          <span className="text-xs font-mono uppercase bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">Secure Operator Node</span>
          <h1 className="text-2xl font-black mt-3 uppercase tracking-tight">Admin Console</h1>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Admin Email</label>
            <input type="email" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm focus:outline-hidden focus:border-red-500/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Password</label>
            <input type="password" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm focus:outline-hidden focus:border-red-500/50" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono">{error}</div>}
          <button disabled={loading} className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white font-black py-3 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50">
            {loading ? "Authorizing Identity..." : "Verify Operator Access"}
          </button>
        </form>
      </div>
    </div>
  );
}