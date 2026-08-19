import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';

export default function VolunteerNetwork() {
  const navigate = useNavigate();
  const [volunteers] = useState([
    { id: '1', name: 'Hana Tesfaye', role: 'Field Coordinator', location: 'Addis Ababa, Bole', rating: 4.9, cases: 12 },
    { id: '2', name: 'Dawit Alemu', role: 'Community Reporter', location: 'Hawassa, SNNPR', rating: 4.7, cases: 8 },
    { id: '3', name: 'Girma Worku', role: 'Tech Specialist', location: 'Mekelle, Tigray', rating: 4.8, cases: 17 },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Volunteer Network</h1>
        <p className="text-xs text-slate-500">Verified community responders across regions</p>
      </div>

      <div className="space-y-3">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                {v.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{v.name}</h3>
                <p className="text-[10px] text-slate-500">{v.role} • {v.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-500" /> {v.rating}
                  </span>
                  <span className="text-[9px] text-slate-400">{v.cases} cases resolved</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/chat')}
              className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}