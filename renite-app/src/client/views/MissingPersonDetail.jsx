import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { Loader2, ArrowLeft, MapPin, UserCheck, AlertTriangle } from 'lucide-react';

export default function MissingPersonDetail() {
  const { id } = useParams();
  console.log("ROUTE PARAM ID RECEIVED:", id);
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPersonDetails = async () => {
      if (!id) {
        setError('Invalid or missing record ID.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetching from your emergency_reports table
        const { data, error: fetchError } = await supabase
          .from('emergency_reports')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (isMounted) {
          setPerson({
            ...data,
            fullName: data.full_name || 'Unknown Person',
            caseNumber: data.case_number || (data.id ? data.id.slice(-8).toUpperCase() : 'N/A'),
            lastKnownClothing: data.last_known_clothing || data.clothing_description || 'Not provided',
            biometricPhotoUrl: data.biometric_photo_url || data.image_url || null,
            lastSeenLocation: data.last_seen_location || 'Location unmapped',
            sightings: data.sightings || []
          });
        }
      } catch (err) {
        console.error('Error fetching missing person details for ID:', id, err);
        if (isMounted) {
          setError(`Could not retrieve record (ID: ${id}).`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPersonDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 items-center justify-center max-w-md mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <p className="text-xs text-slate-500 mt-2 font-medium">Loading case records...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 items-center justify-center max-w-md mx-auto p-4 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mb-2" />
        <p className="text-xs text-slate-600 mb-4">{error || 'Record not found.'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-y-auto pb-24">
      
      {/* Active Alert Header Card */}
      <div className="bg-red-500 text-white p-5 rounded-b-3xl relative shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Active Alert
          </span>
          <button 
            onClick={() => navigate(-1)} 
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/10 overflow-hidden flex items-center justify-center text-white shrink-0">
            {person.biometricPhotoUrl ? (
              <img src={person.biometricPhotoUrl} alt={person.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserCheck className="w-8 h-8 opacity-80" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{person.fullName}</h1>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              {person.age ? `${person.age} years old · ` : ''}Case #{person.caseNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 -mt-3 relative z-10 flex flex-col gap-4">
        
        {/* Physical Description Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Physical Description</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-400">Relation</p>
              <p className="text-sm font-semibold text-slate-800">{person.relation || 'Family'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Last Seen</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{person.lastSeenLocation}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Last known clothing</p>
              <p className="text-xs font-medium text-slate-800">{person.lastKnownClothing}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Details & Distinguishing Features</p>
              <p className="text-xs font-medium text-slate-800">{person.details || 'No additional details provided.'}</p>
            </div>
          </div>
        </div>

        {/* Reported Sightings Section */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Reported Sightings</h2>
          {person.sightings && person.sightings.length > 0 ? (
            <div className="relative pl-6 border-l-2 border-red-200 ml-2 space-y-5">
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
          onClick={() => navigate(`/report-sighting/${person.id}`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-red-500/20 transition flex items-center justify-center gap-2 text-xs"
        >
          <MapPin className="w-4 h-4" /> Report Sighting
        </button>

      </div>
    </div>
  );
}