import React from 'react';
import { Edit3, Shield, CreditCard, Bell, Settings, LogOut, CheckCircle } from 'lucide-react';

export default function Profile() {
  return (
    <div className="bg-slate-50 min-h-screen pb-6">
      {/* Profile Header */}
      <div className="bg-slate-900 pt-6 pb-20 px-6 rounded-b-[40px] relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-slate-600 text-white flex items-center justify-center font-bold text-xl">
              AM
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Abebe Girma</h2>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                Fayda ID Verified
              </p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      {/* ID Card & Stats */}
      <div className="px-4 -mt-14 relative z-10 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">National ID</p>
              <p className="font-mono text-sm font-bold text-slate-800 mt-0.5">FYD-**** 9042</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">Active</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">4</p>
            <p className="text-[10px] text-slate-500 mt-1">Cases Filed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">3</p>
            <p className="text-[10px] text-slate-500 mt-1">Resolved</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">280</p>
            <p className="text-[10px] text-slate-500 mt-1">Points</p>
          </div>
        </div>
      </div>

      {/* Account Options List */}
      <div className="px-4 mt-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Options</p>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {[
            { icon: Edit3, label: 'Edit Profile', color: 'text-slate-600' },
            { icon: Shield, label: 'Security & Privacy', color: 'text-emerald-600' },
            { icon: CreditCard, label: 'Payment Methods', color: 'text-slate-400' },
            { icon: Bell, label: 'Notification Preferences', color: 'text-yellow-600' },
            { icon: Settings, label: 'Account Settings', color: 'text-slate-600' }
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${i !== 4 ? 'border-b border-slate-50' : ''}`}>
              <div className="flex items-center gap-4">
                <item.icon size={20} className={item.color} />
                <span className="font-bold text-sm text-slate-800">{item.label}</span>
              </div>
              <span className="text-slate-300">&rarr;</span>
            </button>
          ))}
        </div>

        <button className="w-full mt-6 bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-red-100">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}