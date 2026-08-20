import { useState } from 'react';
<<<<<<< HEAD
import { Search, Clock } from 'lucide-react';

export default function TrackStatus() {
  const [searchCode, setSearchCode] = useState('');
  const [activeCase, setActiveCase] = useState({
    code: 'MP-9021',
    title: 'Yonas Bekele (Missing Person Case)',
    status: 'IN_PROGRESS',
    assignedTo: 'District 3 Search Response & Volunteers',
    updates: [
      { time: '10:30 AM', text: 'Volunteer search team deployed to Merkato Market.' },
      { time: '08:15 AM', text: 'Case registered and broadcast nationwide.' },
    ]
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setActiveCase({
        code: searchCode.toUpperCase(),
        title: `Tracking Case ${searchCode.toUpperCase()}`,
        status: 'VERIFIED',
        assignedTo: 'Addis Ababa Central Command',
        updates: [
          { time: 'Just now', text: 'Status synchronized with community database.' }
        ]
      });
=======
import { Search, Clock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function TrackStatus() {
  const [searchCode, setSearchCode] = useState('');
  const [activeCase, setActiveCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = searchCode.trim();
    if (!code) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/cases/${code.toUpperCase()}`);
      setActiveCase(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Case not found or invalid tracking code.');
      setActiveCase(null);
    } finally {
      setLoading(false);
>>>>>>> feature/backend-setup
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Track Case Status</h1>
        <p className="text-xs text-slate-500">Real-time status updates for reports & assets</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter tracking code (e.g. MP-9021)..."
<<<<<<< HEAD
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition">
          Lookup
        </button>
      </form>

=======
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center min-w-[70px]"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Lookup'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

>>>>>>> feature/backend-setup
      {activeCase && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{activeCase.code}</span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">{activeCase.title}</h2>
<<<<<<< HEAD
              <p className="text-[10px] text-slate-500 mt-0.5">Assigned: {activeCase.assignedTo}</p>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
=======
              <p className="text-[10px] text-slate-500 mt-0.5">Assigned: {activeCase.assignedTo || 'Unassigned'}</p>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
>>>>>>> feature/backend-setup
              <Clock className="w-3 h-3" /> {activeCase.status}
            </span>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-3">Audit Timeline</h3>
            <div className="space-y-3 pl-2 border-l-2 border-slate-100">
<<<<<<< HEAD
              {activeCase.updates.map((up, i) => (
                <div key={i} className="relative pl-4">
                  <span className="absolute -left-[13px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                  <p className="text-[10px] font-bold text-slate-400">{up.time}</p>
                  <p className="text-xs text-slate-700 mt-0.5">{up.text}</p>
                </div>
              ))}
=======
              {activeCase.updates && activeCase.updates.length > 0 ? (
                activeCase.updates.map((up, i) => (
                  <div key={i} className="relative pl-4">
                    <span className="absolute -left-[13px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                    <p className="text-[10px] font-bold text-slate-400">{up.time}</p>
                    <p className="text-xs text-slate-700 mt-0.5">{up.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 pl-2">No timeline updates recorded yet.</p>
              )}
>>>>>>> feature/backend-setup
            </div>
          </div>
        </div>
      )}
    </div>
  );
}