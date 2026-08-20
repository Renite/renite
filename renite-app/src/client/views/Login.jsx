import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Eye,
  CheckCircle,
  Copy,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppAuth() {
  const navigate = useNavigate();
  
  // State to manage which screen is currently visible
  // 'login' | 'step1' | 'step2' | 'step3' | 'device' | 'success'
  const [view, setView] = useState('login');

  // Unified state to hold all form data across steps
  const [formData, setFormData] = useState({
    faydaId: '',
    fullName: '',
    dob: '',
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
    purchaseDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e, nextView) => {
    e.preventDefault();
    setView(nextView);
  };

  // ---------------------------------------------------------------------------
  // 1. LOGIN VIEW
  // ---------------------------------------------------------------------------
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Renite</h1>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-[250px]">National Civic Safety & Asset Recovery Platform</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock size={18} className="text-slate-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Fayda ID Authentication</h2>
              <p className="text-[10px] text-slate-500">National Digital Identity</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/home'); }}>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Enter your 10-digit Fayda ID</label>
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

            <div className="flex items-start gap-3 mt-2">
              <input type="checkbox" className="mt-1 border-slate-300 rounded text-slate-900 focus:ring-slate-900" required />
              <p className="text-[10px] text-slate-500 leading-tight">
                I agree to the <span className="font-bold text-slate-700">Terms of Service</span> and <span className="font-bold text-slate-700">Privacy Policy</span>
              </p>
            </div>

            <button type="submit" className="w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2 flex justify-center items-center gap-2">
              Continue with Fayda &rsaquo;
            </button>
          </form>
        </div>

        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-6 flex items-center gap-1">
          <ShieldCheck size={12} /> YOUR DATA IS SECURED BY THE NATIONAL ENCRYPTION STANDARD.
        </p>

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
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. REGISTRATION - STEP 1: Personal Info
  // ---------------------------------------------------------------------------
  if (view === 'step1') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
        <header className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => setView('login')} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1 of 3</p>
            <h1 className="text-lg font-bold text-slate-900">Personal Info</h1>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShieldCheck size={16} />
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">Your identity and basic details</p>
          
          <form onSubmit={(e) => handleNext(e, 'step2')} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Profile Photo <span className="text-red-500">*</span></label>
              <div className="w-full border-2 border-dashed border-red-200 bg-red-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-600 cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                  <Camera size={20} className="text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">Upload your photo</span>
                <span className="text-[10px] text-slate-500 mt-1">Clear face photo - used for identity verification</span>
              </div>
              <p className="text-[10px] text-red-500 mt-1">Profile photo is required</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Abebe Girma" className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm focus:outline-none" required />
              <p className="text-[10px] text-red-500 mt-1">Full name is required</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm focus:outline-none" required />
                <p className="text-[10px] text-red-500 mt-1">Date of birth is required</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender <span className="text-red-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm focus:outline-none" required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <p className="text-[10px] text-red-500 mt-1">Gender is required</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fayda National ID <span className="text-red-500">*</span></label>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input type="text" name="faydaId" value={formData.faydaId} onChange={handleChange} placeholder="e.g. 1234 5678 90" className="w-full bg-white border border-red-200 rounded-xl py-3 pl-10 pr-3 text-sm font-mono focus:outline-none" required />
              </div>
              <p className="text-[10px] text-red-500 mt-1">Enter a valid 10-digit Fayda ID</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251 91 234 5678" className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm focus:outline-none" required />
              <p className="text-[10px] text-red-500 mt-1">Enter a valid phone number</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="abebe@example.com (optional)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-4">
              Continue &rarr;
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4 pb-6">
              Already registered? <button type="button" onClick={() => setView('login')} className="font-bold text-indigo-600">Sign in instead</button>
            </p>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2 of 3</p>
            <h1 className="text-lg font-bold text-slate-900">Location & Contact</h1>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShieldCheck size={16} />
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
          <div className="h-1 bg-slate-100 flex-1 rounded-full"></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">Where you are and who to call</p>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3 mb-6">
            <div className="bg-white p-2 rounded-full shadow-sm h-fit">
              <MapPin size={16} className="text-indigo-500" />
            </div>
            <p className="text-sm text-slate-700 mt-1">Your region helps us assign local response teams.</p>
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

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-8">
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3 of 3</p>
            <h1 className="text-lg font-bold text-slate-900">Security</h1>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShieldCheck size={16} />
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1">
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
          <div className="h-1 bg-indigo-600 flex-1 rounded-full"></div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-6">Password and consent</p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 mb-6 text-emerald-800">
            <Lock size={20} className="text-emerald-500 mt-0.5" />
            <p className="text-sm font-medium">Set a strong password to protect your Renite account.</p>
          </div>
          
          <form onSubmit={(e) => handleNext(e, 'device')} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-lg tracking-widest focus:outline-none" required />
                <Eye size={18} className="absolute right-4 top-3.5 text-slate-400" />
              </div>
              {/* Strength Indicator */}
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
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <p className="text-xs text-slate-600 leading-tight">
                  I agree to the <span className="font-bold text-indigo-600">Terms of Service</span> and <span className="font-bold text-indigo-600">Privacy Policy</span> of the Renite National Civic Safety Platform. <span className="text-red-500">*</span>
                </p>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <p className="text-xs text-slate-600 leading-tight">
                  I consent to the collection and processing of my biometric and location data for national safety purposes under Ethiopian law. <span className="text-red-500">*</span>
                </p>
              </label>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
              Create My Account <ShieldCheck size={18} />
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
          <form onSubmit={(e) => handleNext(e, 'success')} className="space-y-5">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Device Photo <span className="text-red-500">*</span></label>
              <div className="w-full border-2 border-dashed border-slate-300 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-slate-600 cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl shadow-sm flex items-center justify-center mb-2">
                  <Camera size={20} className="text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">Take or upload device photo</span>
                <span className="text-[10px] text-slate-500 mt-1">Clear photo helps match & recover faster</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Device Name <span className="text-red-500">*</span></label>
              <input type="text" name="deviceName" value={formData.deviceName} onChange={handleChange} placeholder="e.g. My MacBook Pro, Work Laptop" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" required />
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

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
              Register This Device <ShieldCheck size={18} />
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

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">My asset Registered!</h1>
        <p className="text-sm text-slate-500 text-center mb-8">
          <strong className="text-slate-800">{formData.brand || 'Your device'}</strong> is now protected on the Renite national registry.
        </p>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recovery Token</p>
          <p className="text-xs text-slate-500 mb-4">Save this code — you'll need it to prove ownership.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-slate-800 tracking-widest">RNT-8UFGQ502</span>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 shadow-sm">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8">
          <div className="h-32 bg-slate-800 rounded-xl overflow-hidden relative mb-4">
             {/* Placeholder for the user's uploaded image, resembling the screenshot */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
               <h3 className="text-white font-bold text-lg">{formData.brand || 'HP'} - {formData.model || 'Elitebook'}</h3>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> PROTECTED
            </span>
            <span className="text-xs font-mono text-slate-400">RNT-8UFGQ502</span>
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