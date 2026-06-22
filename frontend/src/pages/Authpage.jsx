import React, { useState } from 'react';

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
      const response = await fetch(`http://localhost:4000${endpoint}`, {
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
      // ✅ FIX: Aligned explicitly to match your endpoint path
      const response = await fetch('http://localhost:4000/api/user/verify-otp', {
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
      setError("Network handshake error during verification verification loop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button onClick={() => handleTabChange('login')} className={`py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-slate-900 text-emerald-400' : 'text-slate-400'}`}>Sign In</button>
          <button onClick={() => handleTabChange('register')} className={`py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Register</button>
        </div>

        {!isVerifying ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs uppercase text-slate-400 font-bold">Username</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold">Email Address</label>
              <input type="email" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold">Password</label>
              <input type="password" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">{successMessage}</div>}
            <button disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg text-sm uppercase tracking-wider">
              {loading ? "Verifying Matrix..." : activeTab === 'register' ? "Register Account" : "Access Console"}
            </button>
          </form>
          ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4 text-left">
            <div className="text-center">
              <h3 className="text-lg font-bold text-emerald-400">Security Handshake</h3>
              <p className="text-xs text-slate-400 mt-1">Token transmitted to {email}</p>
            </div>
            <input type="text" maxLength="6" placeholder="******" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-center font-mono text-xl text-emerald-400" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">{successMessage}</div>}
            <button className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg text-sm uppercase">Verify Token</button>
          </form>
        )}
      </div>
    </div>
  );
}