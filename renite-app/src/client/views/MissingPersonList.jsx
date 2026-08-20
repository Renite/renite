<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Search } from 'lucide-react';

const MOCK_MISSING_PERSONS = [
  { id: 'MP-2024-0487', name: 'Yonas Bekele', age: 22, lastSeen: 'Merkato Market, Addis Ababa', date: 'Today, 12:30 PM' },
  { id: 'MP-2024-0488', name: 'Hanna Tadesse', age: 19, lastSeen: 'Bole Atlas, Addis Ababa', date: 'Yesterday' },
  { id: 'MP-2024-0489', name: 'Dawit Alemayehu', age: 27, lastSeen: 'Megenagna, Addis Ababa', date: '2 days ago' },
];

export default function MissingPersonList() {
  const navigate = useNavigate();
=======
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { MapPin, ChevronRight, Search, Loader2 } from 'lucide-react';

export default function MissingPersonList() {
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        // Fetch all missing persons from the backend database
        const res = await api.get('/missing-persons');
        setPersons(res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load missing persons records.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  // Filter list based on search input (matches name or location)
  const filteredPersons = persons.filter((person) => {
    const name = person.fullName || person.name || '';
    const location = person.lastSeenLocation || person.lastSeen || '';
    const query = searchTerm.toLowerCase();
    return name.toLowerCase().includes(query) || location.toLowerCase().includes(query);
  });
>>>>>>> feature/backend-setup

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-4">
      {/* Header & Search */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Missing Persons Directory</h1>
        <p className="text-xs text-slate-500">Active alerts and community dispatch records</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name or location..."
<<<<<<< HEAD
=======
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
>>>>>>> feature/backend-setup
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none shadow-xs"
        />
      </div>

<<<<<<< HEAD
      {/* List of Persons */}
      <div className="space-y-3">
        {MOCK_MISSING_PERSONS.map((person) => (
          <div 
            key={person.id}
            onClick={() => navigate(`/missing/${person.id}`)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-red-300 transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 font-bold flex items-center justify-center text-sm border border-red-100 flex-shrink-0">
                {person.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{person.name}</h2>
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                    Age {person.age}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {person.lastSeen}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{person.date}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        ))}
      </div>
=======
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
          <p className="text-xs text-slate-400">Loading active alerts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* List of Persons */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person) => {
              const id = person._id || person.id;
              const name = person.fullName || person.name || 'Unknown';
              const age = person.age || 'N/A';
              const lastSeen = person.lastSeenLocation || person.lastSeen || 'Location not specified';
              const date = person.createdAt ? new Date(person.createdAt).toLocaleDateString() : 'Recent';

              return (
                <div 
                  key={id}
                  onClick={() => navigate(`/missing/${id}`)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-red-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 font-bold flex items-center justify-center text-sm border border-red-100 flex-shrink-0 overflow-hidden">
                      {person.biometricPhotoUrl || person.imageUrl ? (
                        <img src={person.biometricPhotoUrl || person.imageUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900">{name}</h2>
                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                          Age {age}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {lastSeen}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-xs text-slate-400">No missing person records found.</p>
            </div>
          )}
        </div>
      )}
>>>>>>> feature/backend-setup
    </div>
  );
}