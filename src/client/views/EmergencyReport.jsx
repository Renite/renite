import React from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';

export default function EmergencyReport() {
  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="bg-slate-900 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-lg">
        <div className="bg-red-500/20 text-red-500 p-2 rounded-xl mt-1">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-white font-bold">Missing Person Report</h2>
          <p className="text-slate-400 text-xs mt-1">All submissions are encrypted and verified by biometric AI</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative px-2">
        <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0"></div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold border-4 border-slate-50">1</div>
          <span className="text-[10px] font-bold text-slate-600">Personal Info</span>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold border-4 border-slate-50">2</div>
          <span className="text-[10px] font-bold text-slate-400">Biometric</span>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold border-4 border-slate-50">3</div>
          <span className="text-[10px] font-bold text-slate-400">Location</span>
        </div>
      </div>

      {/* Form */}
      <h3 className="font-bold text-slate-900 text-lg mb-4">Person Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
          <input type="text" placeholder="Enter full name" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 shadow-sm" />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
            <input type="number" placeholder="e.g. 22" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none shadow-sm" />
          </div>
          <div className="flex-[2]">
            <label className="text-xs font-bold text-slate-700 block mb-1">Relation to You</label>
            <div className="relative">
              <select className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none appearance-none shadow-sm text-slate-500">
                <option>Select...</option>
                <option>Family</option>
                <option>Friend</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Physical Description</label>
          <textarea rows="4" placeholder="Height, clothing, distinctive features..." className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none resize-none shadow-sm"></textarea>
        </div>

        <button className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-4">
          Continue to Biometric Verification
        </button>
      </div>
    </div>
  );
}