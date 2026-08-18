import React from 'react';
import { Plus, CheckCircle, MapPin, EyeOff } from 'lucide-react';

export default function AssetTracker() {
  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Registry</p>
          <h1 className="text-xl font-bold text-slate-900 mt-1">My Devices</h1>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-md">
          <Plus size={16} /> Register
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Card Header Image Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 to-purple-900 relative p-4 flex flex-col justify-between">
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 w-max">
            <CheckCircle size={12} /> SAFE — Registered
          </span>
          <div>
            <h2 className="text-white font-bold text-lg">MacBook Pro 14"</h2>
            <p className="text-white/70 text-xs">MacBook Pro M3 Pro - Space Black</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Serial Number</p>
              <p className="font-mono text-sm mt-1 text-slate-800">C02X••••••XJ</p>
            </div>
            <button className="text-slate-300 border border-slate-200 p-2 rounded-lg"><EyeOff size={16} /></button>
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">MAC Address</p>
              <p className="font-mono text-sm mt-1 text-slate-800">A4:C3:••:••:F1:2B</p>
            </div>
            <button className="text-slate-300 border border-slate-200 p-2 rounded-lg"><EyeOff size={16} /></button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Brand</p>
              <p className="font-medium text-sm mt-1 text-slate-800">Apple</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Registered</p>
              <p className="font-medium text-sm mt-1 text-slate-800">Jan 12, 2024</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-3">
            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Last tracked: Bole Road, Addis Ababa, 2h ago
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm text-slate-900">Mark as Lost</p>
              <p className="text-[10px] text-slate-500 mt-1">Activates network tracking & recovery mode</p>
            </div>
            <div className="w-10 h-6 bg-slate-200 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Hardware Token</p>
          <p className="font-bold text-sm mt-1 text-slate-900">Scannable Recovery QR</p>
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded">Verified</span>
      </div>
    </div>
  );
}