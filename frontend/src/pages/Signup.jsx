import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function Signup() {
  const navigate = useNavigate();

  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification handling state
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Status communication states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/user/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          requestedRole: 'client' // Cleans up UI. Everyone signs up under one form seamlessly.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error || "The server rejected this provisioning request.");
      } else {
        setLoading(false);
        setSuccessMessage(data.message || "Signup successful! Check your email for your 6-digit OTP code.");
        setIsVerifying(true);
      }
    } catch (error) { 
      console.error(error);
      setLoading(false);
      setError("Cannot link to authentication service. Verify your backend server is running.");
    }
  };

  const handleVerifySubmit = async (e) => {
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
        setLoading(false);
        setError(data.error || "Invalid verification code sequence.");
      } else {
        setLoading(false);
        setSuccessMessage(data.message || "Account verified successfully! Redirecting to sign in...");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) { 
      console.error(error);
      setLoading(false);
      setError("Network error encountered during verification handshake.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">Create Profile</h2>
          <p className="text-xs text-slate-500 mt-1">Join the 4 FITNESS central engine network</p>
        </div>

        {!isVerifying ? (
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Username</label>
              <input 
                type="text" 
                placeholder="User handle"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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

            <button disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-emerald-400 disabled:opacity-50">
              {loading ? "Processing..." : "Provision Unique Profile"}
            </button>

            <p className="text-xs text-center text-slate-500 pt-2">
              Already verified? <Link to="/login" className="text-emerald-400 hover:underline">Sign In here</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4 text-left">
            <div className="text-center pb-2">
              <h3 className="text-lg font-bold text-emerald-400">Security Verification</h3>
              <p className="text-xs text-slate-400 mt-1">We sent a 6-digit verification code to <span className="text-slate-300 font-semibold">{email}</span></p>
            </div>

            <input 
              type="text" 
              maxLength="6"
              placeholder="123456"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-center font-mono text-xl tracking-[10px] text-emerald-400 focus:outline-none focus:border-emerald-500"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">{error}</div>}
            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">{successMessage}</div>}

            <button disabled={loading} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg uppercase tracking-wider text-sm hover:bg-emerald-400">
              Verify Operational Access
            </button>
          </form>
        )}
      </div>
    </div>
  );
}