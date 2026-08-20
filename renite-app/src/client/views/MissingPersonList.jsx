import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Search } from 'lucide-react';

const MOCK_MISSING_PERSONS = [
  { id: 'MP-2024-0487', name: 'Yonas Bekele', age: 22, lastSeen: 'Merkato Market, Addis Ababa', date: 'Today, 12:30 PM' },
  { id: 'MP-2024-0488', name: 'Hanna Tadesse', age: 19, lastSeen: 'Bole Atlas, Addis Ababa', date: 'Yesterday' },
  { id: 'MP-2024-0489', name: 'Dawit Alemayehu', age: 27, lastSeen: 'Megenagna, Addis Ababa', date: '2 days ago' },
];

export default function MissingPersonList() {
  const navigate = useNavigate();

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
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none shadow-xs"
        />
      </div>

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
    </div>
  );
}