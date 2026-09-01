import { useState } from 'react';
import { Search, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from './supabase'; // Adjust path if needed

export default function TrackStatus() {
  const [searchCode, setSearchCode] = useState('');
  const [activeCase, setActiveCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchCode.trim();

    if (!query) return;

    setLoading(true);
    setErrorMsg('');
    setActiveCase(null);

    try {
      // 1. Fetch record matching recovery_token OR serial_number
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .or(`recovery_token.eq.${query.toUpperCase()},serial_number.ilike.${query}`)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErrorMsg('No registered device or case found with this code.');
        return;
      }

      // 2. Format database record into UI model
      setActiveCase({
        code: data.recovery_token || data.serial_number,
        title: `${data.brand || ''} ${data.model || data.device_name}`.trim(),
        status: data.status || 'REGISTERED', // Defaults to REGISTERED if status column is empty
        assignedTo: 'Central Security Registry',
        updatedAt: new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        details: {
          serial: data.serial_number,
          type: data.device_type,
          color: data.color,
        },
        // Generated timeline entries from record metadata
        updates: [
          {
            time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: 'Device registered and verification token issued.'
          }
        ]
      });

    } catch (err) {
      console.error('Lookup error:', err);
      setErrorMsg('Failed to fetch status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Track Asset Status</h1>
        <p className="text-xs text-slate-500">Real-time verification for registered devices & reports</p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Token (RNT-...) or Serial No..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Lookup'}
        </button>
      </form>

      {/* Error / Not Found Feedback */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Case / Asset Result Card */}
      {activeCase && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{activeCase.code}</span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">{activeCase.title}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Authority: {activeCase.assignedTo}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activeCase.status}
            </span>
          </div>

          {/* Quick Details */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600">
            <div><span className="font-semibold text-slate-800">Serial:</span> {activeCase.details.serial || 'N/A'}</div>
            <div><span className="font-semibold text-slate-800">Color:</span> {activeCase.details.color || 'N/A'}</div>
          </div>

          {/* Timeline Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-3">Audit Timeline</h3>
            <div className="space-y-3 pl-2 border-l-2 border-slate-100">
              {activeCase.updates.map((up, i) => (
                <div key={i} className="relative pl-4">
                  <span className="absolute -left-[13px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                  <p className="text-[10px] font-bold text-slate-400">{up.time} • {activeCase.updatedAt}</p>
                  <p className="text-xs text-slate-700 mt-0.5">{up.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}