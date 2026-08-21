import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase'; // Adjust path to your supabase client file
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminSecret: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Supabase Login
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (data?.session) {
          localStorage.setItem('adminToken', data.session.access_token);
          navigate('/admin');
        }
      } else {
        // Supabase Signup with Metadata
        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              admin_secret: formData.adminSecret,
            }
          }
        });

        if (authError) throw authError;

        // If email confirmation is disabled in Supabase, session is created immediately
        if (data?.session) {
          localStorage.setItem('adminToken', data.session.access_token);
          navigate('/admin');
        } else {
          setError('Registration successful! Please check your email to confirm your account before signing in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6 animate-in">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div 
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-md text-white"
            style={{ backgroundColor: '#0a2540' }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isLogin ? 'Admin Portal Sign In' : 'Create Admin Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {isLogin 
              ? 'Enter your credentials to access the control center' 
              : 'Register a new authorized administrative profile'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  name="name"
                  required={!isLogin}
                  placeholder="Edom Anteneh"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/20 focus:border-[#0a2540] transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="email"
                name="email"
                required
                placeholder="admin@renite.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/20 focus:border-[#0a2540] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/20 focus:border-[#0a2540] transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Admin Secret Passcode</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password"
                  name="adminSecret"
                  placeholder="Security verification code"
                  value={formData.adminSecret}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/20 focus:border-[#0a2540] transition"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] outline-none flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            style={{ backgroundColor: '#0a2540' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium transition"
          >
            {isLogin ? (
              <>Don't have an admin account? <span className="font-bold" style={{ color: '#0a2540' }}>Create account</span></>
            ) : (
              <>Already have an account? <span className="font-bold" style={{ color: '#0a2540' }}>Sign in</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}