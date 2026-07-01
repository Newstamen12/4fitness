import { useState } from 'react';
import { apiUrl } from '../config/api';

export default function AuthPage({ setUser }) {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (targetTab) => {
    setActiveTab(targetTab);
    setIsVerifying(false);
    setUsername('');
    setEmail('');
    setPassword('');
    setOtpCode('');
    setError(null);
    setSuccessMessage('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    const endpoint = activeTab === 'register' ? '/api/user/signup' : '/api/user/login';
    const payload = activeTab === 'register' ? { username, email, password } : { email, password };

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        if (activeTab === 'register') {
          setSuccessMessage("Signup initiated! Enter your 6-digit verification code below.");
          setIsVerifying(true);
        } else {
          setSuccessMessage("Identity confirmed. Access granted.");
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Connection failure to the authentication service.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/user/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setSuccessMessage("Verification successful! Redirecting to login space...");
        setTimeout(() => handleTabChange('login'), 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Network handshake error during verification loops.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 text-white bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button type="button" onClick={() => handleTabChange('login')} className={`py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400'}`}>Sign In</button>
          <button type="button" onClick={() => handleTabChange('register')} className={`py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Register</button>
        </div>

        {!isVerifying ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Username</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm focus:outline-hidden focus:border-emerald-500/50" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Email Address</label>
              <input type="email" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm focus:outline-hidden focus:border-emerald-500/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Password</label>
              <input type="password" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm focus:outline-hidden focus:border-emerald-500/50" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono">{successMessage}</div>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-emerald-400 transition-colors disabled:opacity-50">
              {loading ? "Verifying Matrix..." : activeTab === 'register' ? "Register Account" : "Access Console"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4 text-left">
            <div className="text-center">
              <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-tight">Security Handshake</h3>
              <p className="text-xs text-slate-400 mt-1">Token transmitted to {email}</p>
            </div>
            <input type="text" maxLength="6" placeholder="******" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-center font-mono text-xl text-emerald-400 focus:outline-hidden focus:border-emerald-500/50" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono">{successMessage}</div>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-emerald-400 transition-colors disabled:opacity-50">Verify Token</button>
          </form>
        )}
      </div>
    </div>
  );
}