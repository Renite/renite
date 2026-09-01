import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  MapPin, 
  Eye,
  CheckCircle,
  Copy,
  Info,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabase";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  
  // State to manage screen flow
  const [view, setView] = useState('login'); // 'login' | 'step1' | 'step2' | 'step3' | 'device' | 'success'
  const [loginRole, setLoginRole] = useState('citizen'); // 'citizen' | 'police'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Unified state across all registration & login steps
  const [formData, setFormData] = useState({
    faydaId: '',
    fullName: '',
    dob: '',
    dobYear: '',
    dobMonth: '',
    dobDay: '',
    gender: '',
    phone: '',
    email: '',
    region: '',
    city: '',
    kebele: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRel: '',
    password: '',
    confirmPassword: '',
    deviceName: '',
    deviceType: '',
    brand: '',
    model: '',
    serial: '',
    color: '',
    purchaseDate: '',
    recoveryToken: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e, nextView) => {
    e.preventDefault();
    setView(nextView);
  };

  // ---------------------------------------------------------------------------
  // SUPABASE API: Handle User Login with Role Verification & Redirection
  // ---------------------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanFayda = formData.faydaId.replace(/\s+/g, '');

      // 1. profiles is no longer publicly readable (RLS locked to owner-only),
      //    so look up the account's email via the backend, then actually
      //    authenticate -- the previous version stopped here and just
      //    navigated without ever calling signInWithPassword.
      const { data: lookup } = await api.post('/auth/lookup-email', { fayda_id: cleanFayda });

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: lookup.email,
        password: formData.password,
      });
      if (authError) throw new Error('Invalid Fayda ID or password.');

      // 2. Now that we have a real session, fetch our own profile (RLS
      //    allows this since auth.uid() === profiles.id at this point).
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle();
      if (profileErr) throw profileErr;
      if (!profile) throw new Error('Profile not found for this account.');

      // Check if trying to log in as police but lacking clearance
      if (loginRole === 'police' && profile.role !== 'police' && profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access Denied: This Fayda ID does not have Law Enforcement clearance.');
      }

      // Route based on database role
      if (profile.role === 'police' || profile.role === 'admin') {
        navigate('/police-home');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SUPABASE API: Handle Account Registration (Step 3 Submit)
  // ---------------------------------------------------------------------------
  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const cleanFayda = formData.faydaId.replace(/\s+/g, '');
      const userEmail = formData.email || `${cleanFayda}@renite.et`;

      // 1. Create Supabase Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            fayda_id: cleanFayda,
          },
        },
      });

      if (authError) throw authError;

      // 2. Complete the profile via the backend, NOT a direct client insert.
      //    The backend always forces role='user' here regardless of what's
      //    sent -- self-registration can never grant 'police' or 'admin'
      //    (that previously was possible: the old code inserted
      //    role: regRole straight from client state). Officer accounts are
      //    now admin-provisioned only, via POST /admin/staff.
      await api.post('/auth/complete-profile', {
        fayda_id: cleanFayda,
        full_name: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        region: formData.region,
        city: formData.city,
        kebele: formData.kebele,
        emergency_name: formData.emergencyName,
        emergency_phone: formData.emergencyPhone,
        emergency_rel: formData.emergencyRel,
      });

      setView('device');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SUPABASE API: Handle Device Asset Registration
  // ---------------------------------------------------------------------------
  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: device } = await api.post('/reports/devices', {
        device_name: formData.deviceName,
        device_type: formData.deviceType,
        brand: formData.brand,
        model: formData.model,
        serial_number: formData.serial,
        color: formData.color,
        purchase_date: formData.purchaseDate || null,
      });

      setFormData((prev) => ({ ...prev, recoveryToken: device.recovery_token }));
      setView('success');
    } catch (err) {
      setErrorMsg(err.message || 'Device registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. LOGIN VIEW
  // ---------------------------------------------------------------------------
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Renite</h1>
          <p className="text-sm text-slate-500 text-center mt-1 max-w-[250px]">National Civic Safety & Asset Recovery Platform</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="w-full bg-slate-200/70 p-1 rounded-2xl flex mb-6">
          <button
            type="button"
            onClick={() => setLoginRole('citizen')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              loginRole === 'citizen' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck size={14} /> Citizen Portal
          </button>
          <button
            type="button"
            onClick={() => setLoginRole('police')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              loginRole === 'police' ? 'bg-blue-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert size={14} /> Police Command
          </button>
        </div>

        {errorMsg && <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}

        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${loginRole === 'police' ? 'bg-blue-50 text-blue-950' : 'bg-slate-100 text-slate-600'}`}>
              <Lock size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {loginRole === 'police' ? 'Officer Authentication' : 'Fayda ID Authentication'}
              </h2>
              <p className="text-[10px] text-slate-500">
                {loginRole === 'police' ? 'Law Enforcement Credential Check' : 'National Digital Identity'}
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {loginRole === 'police' ? 'Officer Fayda ID / Badge ID' : 'Enter your 10-digit Fayda ID'}
              </label>
              <input 
                type="text" 
                name="faydaId"
                value={formData.faydaId}
                onChange={handleChange}
                placeholder="e.g., 1234 5678 90" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input type="checkbox" className="mt-1 border-slate-300 rounded text-slate-900 focus:ring-slate-900" required />
              <p className="text-[10px] text-slate-500 leading-tight">
                I agree to the <span className="font-bold text-slate-700">Terms of Service</span> and <span className="font-bold text-slate-700">Privacy Policy</span>
              </p>
            </div>

            {/* Navy Blue button for Police Command */}
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2 flex justify-center items-center gap-2 text-white ${
                loginRole === 'police' 
                  ? 'bg-blue-950 hover:bg-blue-900 shadow-blue-950/20' 
                  : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {loading ? 'Authenticating...' : loginRole === 'police' ? 'Access Police Command ›' : 'Continue with Fayda ›'}
            </button>
          </form>
        </div>

        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-6 flex items-center gap-1">
          <ShieldCheck size={12} /> YOUR DATA IS SECURED BY THE NATIONAL ENCRYPTION STANDARD.
        </p>

        {loginRole === 'citizen' && (
          <>
            <div className="w-full flex items-center my-6 gap-4 px-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 font-bold">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <button onClick={() => navigate('/home')} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm mb-4">
              <Lock size={16} /> Continue as Guest
            </button>

            <div className="text-center text-sm">
              <span className="text-slate-500">Don't have an account? </span>
              <button onClick={() => setView('step1')} className="font-bold text-slate-900 hover:underline">
                Create account
              </button>
            </div>
          </>
        )}

        {loginRole === 'police' && (
          <div className="text-center text-sm mt-6">
            <span className="text-slate-500">
              Officer accounts are provisioned by an administrator and cannot be self-registered.
            </span>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. REGISTRATION - STEP 1: Personal & Professional Info
  // ---------------------------------------------------------------------------
  if (view === 'step1') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
        <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => setView('login')} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {'Step 1 of 3'}
            </p>
            <h1 className="text-lg font-bold text-slate-900">
              {'Personal Info'}
            </h1>
          </div>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${'bg-indigo-50 text-indigo-600'}`}>
            {<ShieldCheck size={16} />}
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">
            {'Your identity and basic details'}
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); setView('step2'); }} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={'e.g. Abebe Girma'} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                <select 
                  value={formData.dobYear} 
                  onChange={(e) => {
                    const year = e.target.value;
                    const month = formData.dobMonth || '01';
                    const day = formData.dobDay || '01';
                    setFormData({ ...formData, dobYear: year, dob: `${year}-${month}-${day}` });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none" 
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <select 
                  value={formData.dobMonth} 
                  onChange={(e) => {
                    const month = e.target.value;
                    const year = formData.dobYear || new Date().getFullYear();
                    const day = formData.dobDay || '01';
                    setFormData({ ...formData, dobMonth: month, dob: `${year}-${month}-${day}` });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none" 
                  required
                >
                  <option value="">Month</option>
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m, idx) => (
                    <option key={m} value={m}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx]}</option>
                  ))}
                </select>

                <select 
                  value={formData.dobDay} 
                  onChange={(e) => {
                    const day = e.target.value;
                    const year = formData.dobYear || new Date().getFullYear();
                    const month = formData.dobMonth || '01';
                    setFormData({ ...formData, dobDay: day, dob: `${year}-${month}-${day}` });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none" 
                  required
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gender <span className="text-red-500">*</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fayda National ID <span className="text-red-500">*</span></label>
              <input type="text" name="faydaId" value={formData.faydaId} onChange={handleChange} placeholder="e.g. 1234 5678 90" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono focus:outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251 91 234 5678" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Official Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={'abebe@example.com'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
            </div>

            <button type="submit" className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-colors mt-4 text-white ${'bg-indigo-600 hover:bg-indigo-700'}`}>
              Continue &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. REGISTRATION - STEP 2: Location & Contact
  // ---------------------------------------------------------------------------
  if (view === 'step2') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
        <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => setView('step1')} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {'Step 2 of 3'}
            </p>
            <h1 className="text-lg font-bold text-slate-900">Location & Contact</h1>
          </div>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${'bg-indigo-50 text-indigo-600'}`}>
            {<ShieldCheck size={16} />}
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">Where you are stationed and who to call</p>
          <div className={`${'bg-indigo-50/50 border-indigo-100 text-slate-700'} border rounded-xl p-4 flex gap-3 mb-6`}>
            <div className="bg-white p-2 rounded-full shadow-sm h-fit">
              <MapPin size={16} className={'text-indigo-500'} />
            </div>
            <p className="text-sm mt-1">Your region helps us assign local response teams and jurisdiction access.</p>
          </div>
          
          <form onSubmit={(e) => handleNext(e, 'step3')} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Region <span className="text-red-500">*</span></label>
              <select name="region" value={formData.region} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required>
                <option value="">Select region...</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City / Woreda <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Bole" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kebele</label>
                <input type="text" name="kebele" value={formData.kebele} onChange={handleChange} placeholder="e.g. 03" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Emergency Contact</h3>
              <p className="text-xs text-slate-500 mb-4">Person to notify in case of emergency.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="e.g. Tigist Haile" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone <span className="text-red-500">*</span></label>
                    <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="09x xxx xxxx" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Relationship <span className="text-red-500">*</span></label>
                    <select name="emergencyRel" value={formData.emergencyRel} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required>
                      <option value="">Select</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-colors mt-8 text-white ${'bg-indigo-600 hover:bg-indigo-700'}`}>
              Continue &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. REGISTRATION - STEP 3: Security
  // ---------------------------------------------------------------------------
  if (view === 'step3') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
        <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => setView('step2')} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {'Step 3 of 3'}
            </p>
            <h1 className="text-lg font-bold text-slate-900">Security</h1>
          </div>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${'bg-indigo-50 text-indigo-600'}`}>
            {<ShieldCheck size={16} />}
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
          <div className={`h-1 flex-1 rounded-full ${'bg-indigo-600'}`}></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">Password and officer clearance consent</p>

          <div className={`${'bg-emerald-50 border-emerald-100 text-emerald-800'} border rounded-xl p-4 flex gap-3 mb-6`}>
            <Lock size={20} className={'text-emerald-500 mt-0.5'} />
            <p className="text-sm font-medium">Set a strong password to protect your {'Renite'} account.</p>
          </div>
          
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}
          
          <form onSubmit={handleRegisterAccount} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-lg tracking-widest focus:outline-none" required />
                <Eye size={18} className="absolute right-4 top-3.5 text-slate-400" />
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1 bg-amber-400 flex-1 rounded-full"></div>
                <div className="h-1 bg-amber-400 flex-1 rounded-full"></div>
                <div className="h-1 bg-slate-200 flex-1 rounded-full"></div>
                <div className="h-1 bg-slate-200 flex-1 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400 text-right mt-1">Fair</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-lg tracking-widest focus:outline-none" required />
                <Eye size={18} className="absolute right-4 top-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl">
                <input type="checkbox" className={`mt-1 w-4 h-4 rounded border-slate-300 ${'text-indigo-600 focus:ring-indigo-600'}`} required />
                <p className="text-xs text-slate-600 leading-tight">
                  I agree to the <span className={`font-bold ${'text-indigo-600'}`}>Terms of Service</span> and <span className={`font-bold ${'text-indigo-600'}`}>Privacy Policy</span> of the Renite National Civic Safety Platform. <span className="text-red-500">*</span>
                </p>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl">
                <input type="checkbox" className={`mt-1 w-4 h-4 rounded border-slate-300 ${'text-indigo-600 focus:ring-indigo-600'}`} required />
                <p className="text-xs text-slate-600 leading-tight">
                  {'I consent to the collection and processing of my biometric and location data for national safety purposes under Ethiopian law.'} <span className="text-red-500">*</span>
                </p>
              </label>
            </div>

            <button type="submit" disabled={loading} className={`w-full font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-white ${'bg-indigo-600 hover:bg-indigo-700'}`}>
              {loading ? 'Creating Account...' : 'Create My Account'} <ShieldCheck size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. REGISTER FIRST DEVICE
  // ---------------------------------------------------------------------------
  if (view === 'device') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
        <header className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-10 flex gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              ACCOUNT CREATED <CheckCircle size={10} />
            </p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Register Your First Device</h1>
            <p className="text-xs text-slate-500 mt-1 leading-snug">Protect your electronics nationwide. Recovered if lost.</p>
          </div>
        </header>

        <div className="bg-white px-6 py-3 border-b border-slate-100 flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
            <CheckCircle size={12} /> Profile complete
          </div>
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full">
            Asset setup
          </div>
        </div>

        <div className="p-6">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}

          <form onSubmit={handleRegisterDevice} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Device Name <span className="text-red-500">*</span></label>
              <input type="text" name="deviceName" value={formData.deviceName} onChange={handleChange} placeholder="e.g. My MacBook Pro" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Device Type <span className="text-red-500">*</span></label>
                <select name="deviceType" value={formData.deviceType} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required>
                  <option value="">Select...</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Phone">Phone</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brand <span className="text-red-500">*</span></label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required>
                  <option value="">Select...</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="HP">HP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Model</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. MacBook Pro M3, Galaxy S24 Ultra" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Serial Number / IMEI <span className="text-red-500">*</span></label>
              <input type="text" name="serial" value={formData.serial} onChange={handleChange} placeholder="Found in Settings -> About or device" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono focus:outline-none" required />
              <p className="text-[10px] text-slate-400 mt-1">This is your primary proof of ownership.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Space Black" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Date</label>
                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 my-4">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">A unique Renite recovery token (QR + code) is generated for your device and added to the national database. Anyone who finds it can verify ownership securely.</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
              {loading ? 'Registering Asset...' : 'Register This Device'} <ShieldCheck size={18} />
            </button>

            <button type="button" onClick={() => navigate('/home')} className="w-full text-slate-500 font-medium py-2 text-sm hover:text-slate-700">
              Skip for now — I'll add assets later
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. SUCCESS SCREEN
  // ---------------------------------------------------------------------------
  if (view === 'success') {
    const recoveryToken = formData.recoveryToken || 'RNT-8UFGQ502';

    const handleCopy = () => {
      navigator.clipboard.writeText(recoveryToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <CheckCircle size={32} />
          </div>
          <div className="absolute top-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white">
            <ShieldCheck size={12} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Asset Registered!</h1>
        <p className="text-sm text-slate-500 text-center mb-8">
          <strong className="text-slate-800">{formData.brand || 'Your device'}</strong> is now protected on the Renite national registry.
        </p>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recovery Token</p>
          <p className="text-xs text-slate-500 mb-4">Save this code — you'll need it to prove ownership.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-slate-800 tracking-widest">{recoveryToken}</span>
            <button type="button" onClick={handleCopy} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 shadow-sm" aria-label="Copy recovery token">
              {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8">
          <div className="h-32 bg-slate-800 rounded-xl overflow-hidden relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
              <h3 className="text-white font-bold text-lg">{formData.brand || 'HP'} - {formData.model || 'Elitebook'}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> PROTECTED
            </span>
            <span className="text-xs font-mono text-slate-400">{recoveryToken}</span>
          </div>
        </div>

        <button onClick={() => navigate('/home')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
          Go to Renite Dashboard &rarr;
        </button>
      </div>
    );
  }

  return null;
}