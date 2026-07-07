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
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#262626] font-sans antialiased relative flex items-center justify-center pt-24 pb-16">
      {/* Editorial aesthetic background blur element */}
      <div className="absolute top-0 right-[5%] w-112.5 h-112.5 bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-2xl p-8 relative z-10 shadow-sm space-y-6">
        
        {/* Brand Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 uppercase">
            Console <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500 normal-case">Gateway</span>
          </h2>
          <p className="text-neutral-400 text-[11px] font-mono mt-1 uppercase tracking-wider">
            Secure Authentication Node
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="grid grid-cols-2 p-1 bg-neutral-50 rounded-xl border border-neutral-200/60 shadow-3xs">
          <button 
            type="button" 
            onClick={() => handleTabChange('login')} 
            className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-emerald-600 border border-neutral-200/50 shadow-3xs' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => handleTabChange('register')} 
            className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'register' 
                ? 'bg-white text-emerald-600 border border-neutral-200/50 shadow-3xs' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Authentication Form Routing */}
        {!isVerifying ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl p-3 text-neutral-800 text-sm focus:outline-hidden focus:border-emerald-500/50 focus:bg-white transition-all shadow-3xs" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl p-3 text-neutral-800 text-sm focus:outline-hidden focus:border-emerald-500/50 focus:bg-white transition-all shadow-3xs" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Password</label>
              <input 
                type="password" 
                className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl p-3 text-neutral-800 text-sm focus:outline-hidden focus:border-emerald-500/50 focus:bg-white transition-all shadow-3xs" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* Notification Messages Hooks */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono leading-relaxed">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-mono leading-relaxed">
                {successMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-mono font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying Handshake..." : activeTab === 'register' ? "Initialize Registration" : "Request Portal Access"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-5 text-left">
            <div className="text-center bg-amber-50/50 border border-amber-100 rounded-xl p-4">
              <h3 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">Security Token Challenge</h3>
              <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                A validation cipher has been transmitted to <span className="text-neutral-700 font-mono font-semibold">{email}</span>
              </p>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block text-center">Verification Code</label>
              <input 
                type="text" 
                maxLength="6" 
                placeholder="******" 
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 rounded-xl text-center font-mono text-xl tracking-widest text-emerald-600 font-bold focus:outline-hidden focus:border-emerald-500/50 focus:bg-white transition-all shadow-3xs" 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                required 
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono leading-relaxed">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-mono leading-relaxed">
                {successMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-mono font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              Confirm Security Token
            </button>
          </form>
        )}
      </div>
    </div>
  );
}