import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Loader2, AlertCircle, Users } from 'lucide-react';
import { supabase } from '../../supabase'; // Adjust path if your supabase client is located elsewhere

export default function VolunteerNetwork() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch volunteers from Supabase table
      const { data, error } = await supabase
        .from('volunteers')
        .select('*');

      if (error) throw error;

      // Map Supabase columns safely to UI fields with fallback defaults
      const formattedData = (data || []).map((v) => ({
        id: v.id,
        name: v.full_name || v.name || 'Anonymous Responder',
        role: v.role || 'Community Responder',
        location: v.location || `${v.city || ''}${v.city && v.region ? ', ' : ''}${v.region || 'Ethiopia'}`.trim() || 'General Region',
        rating: v.rating ?? 5.0,
        cases: v.cases_resolved ?? v.cases ?? 0,
      }));

      setVolunteers(formattedData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setErrorMsg('Failed to load volunteer network. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchVolunteers();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleStartChat = (volunteer) => {
    // Navigate to chat and pass volunteer details in state
    navigate('/chat', { state: { volunteer } });
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'VR';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Volunteer Network</h1>
        <p className="text-xs text-slate-500">Verified community responders across regions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          <p className="text-xs text-slate-500">Loading active responders...</p>
        </div>
      )}

      {/* Error Feedback */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !errorMsg && volunteers.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No volunteers active yet</p>
          <p className="text-[11px] text-slate-500">
            Registered community coordinators will appear here once onboarded.
          </p>
        </div>
      )}

      {/* Volunteer List */}
      {!loading && (
        <div className="space-y-3">
          {volunteers.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs transition hover:border-slate-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(v.name)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{v.name}</h3>
                  <p className="text-[10px] text-slate-500">
                    {v.role} • {v.location}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {v.rating}
                    </span>
                    <span className="text-[9px] text-slate-400">{v.cases} cases resolved</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartChat(v)}
                className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition shrink-0"
                title={`Chat with ${v.name}`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}