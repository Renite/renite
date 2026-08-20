import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MapPin } from 'lucide-react';

export default function MissingPersonsAdmin() {
  const [missingCases, setMissingCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissingPersons() {
      try {
        const data = await api.get('/admin/missing-persons');
        setMissingCases(data);
      } catch (error) {
        console.error('Failed to load missing persons data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMissingPersons();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.post(`/admin/missing-persons/${id}/status`, { status: newStatus });
      setMissingCases(missingCases.map(item => 
        item._id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Failed to update case status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Loading missing persons records...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">Missing Persons Management</h2>
          <p className="text-xs text-slate-500">Manage active alerts and case statuses</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {missingCases.length}
        </span>
      </div>

      <div className="space-y-3">
        {missingCases.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No missing person cases logged in database.
          </div>
        ) : (
          missingCases.map((item) => (
            <div 
              key={item._id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                    {item.lastSeenLocation || 'Location unspecified'}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  item.status === 'resolved' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status || 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">ID: {item._id.slice(-6)}</span>
                <div className="flex items-center gap-2">
                  {item.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'resolved')}
                      className="px-2.5 py-1 rounded-lg text-white font-medium text-[11px] transition"
                      style={{ backgroundColor: '#0a2540' }}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}