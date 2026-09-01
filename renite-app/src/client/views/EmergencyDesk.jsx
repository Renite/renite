import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { AlertTriangle, User, MapPin, Phone, Camera, CheckCircle, Loader2 } from 'lucide-react';

export default function EmergencyDesk() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('MISSING_PERSON');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    lastSeenLocation: '',
    contactPhone: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase
        .from('emergency_reports')
        .insert([
          {
            type: reportType,
            full_name: formData.fullName,
            age: Number(formData.age),
            contact_phone: formData.contactPhone,
            last_seen_location: formData.lastSeenLocation,
            details: formData.details,
          },
        ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting emergency report:', err);
      alert('Failed to dispatch alert to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Emergency Desk</h1>
        <p className="text-xs text-slate-500">Dispatch alerts directly to district response units</p>
      </div>

      <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1 text-xs font-bold">
        <button 
          type="button"
          onClick={() => setReportType('MISSING_PERSON')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'MISSING_PERSON' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
        >
          Missing Person
        </button>
        <button 
          type="button"
          onClick={() => setReportType('GENERAL_ALERT')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'GENERAL_ALERT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
        >
          Safety Incident
        </button>
      </div>

      {submitted ? (
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Alert Dispatched Successfully</h2>
          <p className="text-xs text-slate-500">Local emergency volunteers and police district posts have been notified.</p>
          <button 
            type="button"
            onClick={() => navigate('/track')}
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Track Status Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Subject name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Age</label>
              <input 
                required
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Phone</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="tel" 
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+251 9..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Last Seen Location</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.lastSeenLocation}
                onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                placeholder="e.g. Merkato, Addis Ababa"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Additional Description</label>
            <textarea 
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Clothing, distinguishing features..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none mt-1"
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition">
            <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-600">Upload Photo</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold text-xs hover:bg-rose-600 shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            {loading ? 'Dispatching...' : 'Dispatch Emergency Alert'}
          </button>
        </form>
      )}
    </div>
  );
}