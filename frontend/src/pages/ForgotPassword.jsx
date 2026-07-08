import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data.error || 'Unable to request password reset.');
        return;
      }
      setSuccessMessage(data.message || 'Reset code sent if that email exists.');
      setStep('confirm');
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Network error while requesting password reset.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data.error || 'Unable to reset password.');
        return;
      }
      setSuccessMessage(data.message || 'Password reset complete. Redirecting to login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Network error while resetting password.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">Recover your access with a secure reset code.</p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4 text-left">
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

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">{successMessage}</div>}

            <button disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-emerald-400 disabled:opacity-50">
              {loading ? 'Requesting reset...' : 'Send reset code'}
            </button>

            <p className="text-xs text-center text-slate-500 pt-2">
              Remembered your password? <Link to="/login" className="text-emerald-400 hover:underline">Sign In</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Reset Code</label>
              <input
                type="text"
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">{successMessage}</div>}

            <button disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-emerald-400 disabled:opacity-50">
              {loading ? 'Resetting password...' : 'Reset password'}
            </button>

            <p className="text-xs text-center text-slate-500 pt-2">
              Need to start over? <Link to="/forgot-password" className="text-emerald-400 hover:underline">Send another code</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
