import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function AuthPanel({ setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setOtpCode('');
    setError(null);
    setSuccessMessage('');
    setIsVerifying(false);
  };

  const handleLogin = async (e) => {
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
        setError(data.error || 'Login failed');
      } else {
        const userData = { ...data, email };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate(data.role === 'admin' ? '/admin-dashboard' : '/profile');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
      } else {
        setSuccessMessage(data.message || 'Account created. Please verify your OTP.');
        setIsVerifying(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
      } else {
        setSuccessMessage(data.message || 'Email verified successfully. You can now log in.');
        setIsVerifying(false);
        resetForm();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex rounded-full border border-white/10 bg-slate-800/70 p-1">
        <button
          type="button"
          onClick={() => { setActiveTab('login'); resetForm(); }}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'login' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('signup'); resetForm(); }}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'signup' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          Sign Up
        </button>
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}
      {successMessage && <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMessage}</div>}

      {activeTab === 'login' && !isVerifying && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <button disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
            {loading ? 'Please wait...' : 'Log In'}
          </button>
        </form>
      )}

      {activeTab === 'signup' && !isVerifying && (
        <form onSubmit={handleSignup} className="space-y-4">
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Full Name" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <button disabled={loading} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20 disabled:opacity-50">
            {loading ? 'Please wait...' : 'Create Account'}
          </button>
        </form>
      )}

      {isVerifying && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-slate-300">Enter the OTP sent to your email to verify your account.</p>
          <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} type="text" placeholder="Enter OTP" className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none ring-0" required />
          <button disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}
