import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function VolunteerNetwork() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/volunteers');
        setVolunteers(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load volunteer network data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Volunteer Network</h1>
        <p className="text-xs text-slate-500">Verified community responders across regions</p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && volunteers.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-8">No verified volunteers found at the moment.</p>
      )}

      <div className="space-y-3">
        {volunteers.map((v) => (
          <div key={v._id || v.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                {v.name ? v.name.split(' ').map(n => n[0]).join('') : 'V'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{v.name}</h3>
                <p className="text-[10px] text-slate-500">{v.role} • {v.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-500" /> {v.rating || '5.0'}
                  </span>
                  <span className="text-[9px] text-slate-400">{v.casesResolved || 0} cases resolved</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/chat/${v._id || v.id}`)}
              className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
              title={`Chat with ${v.name}`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}