import { useState, useEffect } from 'react';
import { Search, Star, MessageSquare, PhoneCall } from 'lucide-react';
import { api } from '../services/api';

export default function VolunteerNetwork() {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.getVolunteers().then(setVolunteers);
  }, []);

  const filtered = volunteers.filter((v) => {
    if (filter === 'Available') return v.status === 'Available';
    if (filter === 'On Duty') return v.status === 'On Duty';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 max-w-md mx-auto pb-24">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900 text-white rounded-2xl p-3 text-center">
          <span className="text-lg font-bold block">248</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Volunteers</span>
        </div>
        <div className="bg-slate-900 text-white rounded-2xl p-3 text-center">
          <span className="text-lg font-bold block">11</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Regions Covered</span>
        </div>
        <div className="bg-slate-900 text-white rounded-2xl p-3 text-center">
          <span className="text-lg font-bold block">1.2K</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Cases Assisted</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, location, skill..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['All', 'Available', 'On Duty'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Volunteer Cards */}
      <div className="space-y-3">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
                  {v.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{v.name}</h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{v.role}</p>
                  <p className="text-[10px] text-slate-400">📍 {v.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-0.5 justify-end">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {v.rating}
                </span>
                <span className="text-[10px] text-slate-400">{v.cases} cases</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {v.tags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <button className="flex-1 bg-slate-900 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Request Assist
              </button>
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50">
                <MessageSquare className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Become a Volunteer Card */}
      <div className="mt-6 bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold">Become a Volunteer</h4>
          <p className="text-[10px] text-slate-400">Join Ethiopia's safety network</p>
        </div>
        <button className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl font-medium">Apply →</button>
      </div>
    </div>
  );
}