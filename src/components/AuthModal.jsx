import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth, ADMIN_MASTER_KEY } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login', onAdminSuccess }) => {
  const { login, signup, loginWithGoogle, loginAsAdmin } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else if (tab === 'signup') {
        if (!email || !password) throw new Error('Please fill all required fields');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signup(email, password, displayName, phone);
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else if (tab === 'admin') {
        await loginAsAdmin(adminPin);
        setSuccessMsg('Admin access verified!');
        setTimeout(() => {
          onClose();
          if (onAdminSuccess) onAdminSuccess();
        }, 600);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const rawMsg = (err?.message || '').toLowerCase();
      if (rawMsg.includes('rate limit') || rawMsg.includes('over_email_send_rate_limit') || rawMsg.includes('too many requests')) {
        setError('Email rate limit reached: Supabase free tier limits confirmation emails to ~3-4 emails per hour. Please wait a few minutes, use another email, or sign in directly if your account was already created.');
      } else if (rawMsg.includes('invalid login credentials')) {
        setError('Invalid email or password. Please verify your details or sign up if you have not registered yet.');
      } else if (rawMsg.includes('user already registered')) {
        setError('An account with this email already exists. Please switch to the "User Login" tab to sign in.');
      } else {
        setError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Redirecting to Google Sign-In...');
    } catch (err) {
      console.warn('Google sign-in notice:', err);
      if (err?.message?.includes('provider is not enabled') || err?.error_code === 'validation_failed') {
        setError('Google OAuth provider is not enabled in your Supabase project yet. Please use Email/Password signup or enable Google in Supabase Dashboard > Authentication > Providers.');
      } else {
        setError(err.message || 'Google sign in failed. Please use Email/Password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-900 text-white p-6 relative">
          <button 
            id="close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Krishi Kutir Authentication</span>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight">
            {tab === 'login' && 'Welcome Back'}
            {tab === 'signup' && 'Create User Profile'}
            {tab === 'admin' && 'Admin Store Portal'}
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            {tab === 'login' && 'Sign in to access your saved delivery address and order history.'}
            {tab === 'signup' && 'Create your customer profile for seamless 1-click Razorpay checkout.'}
            {tab === 'admin' && 'Authorized store owner login to edit catalog, prices, images & manage orders.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/80 p-1">
          <button
            id="tab-user-login"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              tab === 'login' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            User Login
          </button>
          <button
            id="tab-user-signup"
            onClick={() => { setTab('signup'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              tab === 'signup' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Sign Up
          </button>
          <button
            id="tab-admin-portal"
            onClick={() => { setTab('admin'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              tab === 'admin' ? 'bg-neutral-900 text-amber-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Admin Key
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3.5">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {tab !== 'admin' ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs mb-3">
                  <span className="font-bold block mb-0.5">Store Owner Security Access:</span>
                  Enter the master admin key (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">krishi2026</code>) to manage store products, update pricing, upload images, and process customer orders.
                </div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Admin Master Key / Password</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-pin-input"
                    type="password"
                    placeholder="Enter krishi2026"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-mono"
                    required
                  />
                </div>
              </div>
            )}

            <button
              id="submit-auth-btn"
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                tab === 'admin'
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : (
                <>
                  <span>
                    {tab === 'login' && 'Sign In to My Account'}
                    {tab === 'signup' && 'Create My Profile'}
                    {tab === 'admin' && 'Enter Admin Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {tab !== 'admin' && (
            <>
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-neutral-200 w-full"></div>
                <span className="bg-white px-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Or</span>
              </div>

              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Footer note */}
          <div className="pt-2 text-center">
            {tab === 'login' ? (
              <p className="text-xs text-neutral-500">
                Don't have an account?{' '}
                <button onClick={() => setTab('signup')} className="font-bold text-emerald-700 hover:underline">
                  Create one now
                </button>
              </p>
            ) : tab === 'signup' ? (
              <p className="text-xs text-neutral-500">
                Already registered?{' '}
                <button onClick={() => setTab('login')} className="font-bold text-emerald-700 hover:underline">
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-500">
                Customer login?{' '}
                <button onClick={() => setTab('login')} className="font-bold text-emerald-700 hover:underline">
                  Switch to User Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
