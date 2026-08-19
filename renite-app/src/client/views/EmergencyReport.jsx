import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronLeft, 
  Camera, 
  MapPin, 
  CheckCircle, 
  Loader2, 
  User, 
  ShieldCheck 
} from 'lucide-react';

export default function EmergencyReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    relation: 'Family',
    details: '',
    biometricPhoto: null,
    lastSeenLocation: '',
    contactPhone: '',
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        fullName: formData.fullName,
        age: Number(formData.age) || 0,
        relation: formData.relation,
        details: formData.details,
        lastSeenLocation: formData.lastSeenLocation,
        contactPhone: formData.contactPhone,
        type: 'MISSING_PERSON',
      };

      await api.post('/missing-persons', payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to dispatch missing person report. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-slate-50 min-h-screen flex items-center justify-center max-w-md mx-auto">
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center space-y-4 shadow-sm w-full">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Alert Dispatched Successfully</h2>
          <p className="text-xs text-slate-500">
            Biometric AI verification initialized. Local emergency response posts and district police units have been notified.
          </p>
          <button 
            onClick={() => navigate('/track')}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Track Incident Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen max-w-md mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-lg">
        <div className="bg-red-500/20 text-red-500 p-2 rounded-xl mt-1">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-white font-bold text-sm">Missing Person Report</h2>
          <p className="text-slate-400 text-xs mt-0.5">All submissions are encrypted and verified by biometric AI</p>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-3 left-8 right-8 h-0.5 bg-slate-200 z-0"></div>
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step >= 1 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>1</div>
          <span className={`text-[10px] font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Personal</span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step >= 2 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>2</div>
          <span className={`text-[10px] font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Biometric</span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step === 3 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>3</div>
          <span className={`text-[10px] font-bold ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>Location</span>
        </div>
      </div>

      {/* Form Content per Step */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 1: Person Information</h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Age</label>
                <input 
                  required
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 22" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Relation to You</label>
                <div className="relative">
                  <select 
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none appearance-none text-slate-700"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Physical Description</label>
              <textarea 
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Height, clothing, distinctive features..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none resize-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md transition text-xs mt-2">
              Continue to Biometric Verification
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 2: Biometric Photo AI</h3>
            <p className="text-xs text-slate-500">Upload a clear photo of the person for automated facial recognition scanning across district databases.</p>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">Tap to upload photo</span>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-[10px] text-slate-600">Encrypted transmission compliant with privacy and emergency safety standards.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={handleBack}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md transition text-xs"
              >
                Continue to Location
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 3: Last Seen Details</h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Last Seen Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  required
                  type="text" 
                  value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                  placeholder="e.g. Bole Medhanialem, Addis Ababa" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Your Contact Phone *</label>
              <input 
                required
                type="tel" 
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+251 9..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={handleBack}
                disabled={loading}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md shadow-red-500/20 transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                {loading ? 'Dispatching Alert...' : 'Dispatch Emergency Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}