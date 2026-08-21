import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronLeft, 
  Camera, 
  MapPin, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  Package,
  Hash,
  Tag,
  Calendar
} from 'lucide-react';

export default function AssetReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    assetName: '',
    category: 'Electronics',
    serialNumber: '',
    description: '',
    assetPhoto: null, // Holds the selected photo file
    stolenLocation: '',
    stolenDate: '',
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
      let photoUrl = null;

      // 1. Upload photo to Supabase Storage if provided
      if (formData.assetPhoto) {
        const file = formData.assetPhoto;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `assets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('asset-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('asset-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // 2. Insert record into 'stolen_assets' table
      const { error } = await supabase
        .from('stolen_assets')
        .insert([
          {
            type: 'STOLEN_ASSET',
            asset_name: formData.assetName,
            category: formData.category,
            serial_number: formData.serialNumber,
            description: formData.description,
            asset_photo_url: photoUrl,
            stolen_location: formData.stolenLocation,
            stolen_date: formData.stolenDate,
            contact_phone: formData.contactPhone,
          },
        ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting asset report:', err);
      alert(`Failed to dispatch report: ${err.message || 'Please check your connection.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-slate-50 min-h-screen flex items-center justify-center max-w-md mx-auto">
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center space-y-4 shadow-xs w-full">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Stolen Asset Alert Registered</h2>
          <p className="text-xs text-slate-500">
            Serial number and visual markers indexed into local law enforcement and verification databases.
          </p>
          <button 
            onClick={() => navigate('/track')}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Track Report Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen max-w-md mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-lg">
        <div className="bg-amber-500/20 text-amber-500 p-2 rounded-xl mt-1">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-white font-bold text-sm">Report Stolen Asset</h2>
          <p className="text-slate-400 text-xs mt-0.5">Register missing or stolen property for active recovery</p>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-3 left-8 right-8 h-0.5 bg-slate-200 z-0"></div>
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step >= 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>1</div>
          <span className={`text-[10px] font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Details</span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>2</div>
          <span className={`text-[10px] font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Media</span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 ${
            step === 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>3</div>
          <span className={`text-[10px] font-bold ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>Incident</span>
        </div>
      </div>

      {/* Form Content per Step */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 1: Asset Information</h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Asset Name / Title *</label>
              <div className="relative">
                <Package className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  required
                  type="text" 
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  placeholder="e.g. MacBook Pro M2, iPhone 14, Vehicle" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-xs focus:outline-none appearance-none text-slate-700"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicle">Vehicle / Bike</option>
                    <option value="Jewelry">Jewelry / Watch</option>
                    <option value="Document">ID / Document</option>
                    <option value="Other">Other</option>
                  </select>
                  <Tag className="absolute left-2.5 top-3 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="w-1/2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Serial / VIN / IMEI</label>
                <div className="relative">
                  <Hash className="absolute left-2.5 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input 
                    type="text" 
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. SN-8839201" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Distinctive Marks & Details</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Color, scratches, stickers, custom modifications..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none resize-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button type="submit" className="w-full bg-[#0A192F] hover:bg-[#000080] text-white py-3 rounded-xl font-bold text-sm transition">
              Continue to Media Upload
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 2: Asset / Proof Photo</h3>
            <p className="text-xs text-slate-500">Upload a photo of the item, serial tag, or proof of ownership for identity matching.</p>

            <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer block space-y-2">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">
                  {formData.assetPhoto ? formData.assetPhoto.name : 'Tap to upload asset photo'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG up to 10MB</p>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, assetPhoto: e.target.files[0] })}
                className="hidden"
              />
            </label>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-[10px] text-slate-600">Encrypted transmission stored securely in the incident registry database.</p>
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
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition text-xs"
              >
                Continue to Incident Info
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Step 3: Incident Details</h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Stolen / Last Seen Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  required
                  type="text" 
                  value={formData.stolenLocation}
                  onChange={(e) => setFormData({ ...formData, stolenLocation: e.target.value })}
                  placeholder="e.g. Bole Medhanialem, Addis Ababa" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date / Time</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input 
                    type="date" 
                    value={formData.stolenDate}
                    onChange={(e) => setFormData({ ...formData, stolenDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700" 
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Contact Phone *</label>
                <input 
                  required
                  type="tel" 
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+251 9..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900" 
                />
              </div>
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
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-500/20 transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                {loading ? 'Submitting Report...' : 'Dispatch Stolen Asset Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}