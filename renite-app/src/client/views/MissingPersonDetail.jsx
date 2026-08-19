import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';

export default function MissingPersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        // Fetch specific missing person record from the backend database
        const res = await api.get(`/missing-persons/${id}`);
        setPerson(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve record from database.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 items-center justify-center max-w-md mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <p className="text-xs text-slate-500 mt-2">Loading case records...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 items-center justify-center max-w-md mx-auto p-4 text-center">
        <p className="text-xs text-red-500 mb-4">{error || 'Record not found.'}</p>
        <button onClick={() => navigate(-1)} className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans max-w-md mx-auto relative shadow-2xl overflow-y-auto pb-24">
      
      {/* Active Alert Header Card */}
      <div className="bg-red-500 text-white p-5 rounded-b-3xl relative shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Active Alert
          </span>
          <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/10 overflow-hidden flex items-center justify-center text-white flex-shrink-0">
            {person.biometricPhotoUrl || person.imageUrl ? (
              <img src={person.biometricPhotoUrl || person.imageUrl} alt={person.fullName} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{person.fullName}</h1>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              {person.age} years old · Case {person.caseNumber || person._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 -mt-4 relative z-10 flex flex-col gap-4">
        
        {/* Physical Description Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Physical Description</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-400">Relation</p>
              <p className="text-sm font-semibold text-slate-800">{person.relation || 'Family'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Contact Phone</p>
              <p className="text-sm font-semibold text-slate-800">{person.contactPhone || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-400">Last Seen Location</p>
              <p className="text-sm font-semibold text-slate-800">{person.lastSeenLocation || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-400 mb-0.5">Details & Distinguishing Features</p>
            <p className="text-sm font-semibold text-slate-800">{person.details || 'No additional details provided.'}</p>
          </div>
        </div>

        {/* Reported Sightings Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Reported Sightings</h2>
          
          {person.sightings && person.sightings.length > 0 ? (
            <div className="relative pl-6 border-l-2 border-red-200 ml-2 space-y-6">
              {person.sightings.map((sighting, index) => (
                <div className="relative" key={index}>
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{sighting.time || 'Recent'} — {sighting.location}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{sighting.source || 'Witness report'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No verified sightings reported yet.</p>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate(`/report-sighting/${person._id}`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2 text-sm mt-1"
        >
          <span>📍 Report Sighting</span>
        </button>

      </div>
    </div>
  );
}