import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center px-6 max-w-md mx-auto">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
          <ShieldCheck size={32} className="text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome to Renite</h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-[250px]">National Civic Safety & Asset Recovery Platform</p>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock size={18} className="text-slate-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Fayda ID Authentication</h2>
            <p className="text-[10px] text-slate-500">National Digital Identity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Enter your 10-digit Fayda ID</label>
            <input 
              type="text" 
              placeholder="e.g., 1234 5678 90" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Profile Photo <span className="font-normal text-slate-400">(optional)</span></label>
            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
               <div className="bg-white p-2 rounded-full shadow-sm mb-2"><ShieldCheck size={20} className="text-slate-400" /></div>
               <span className="text-xs font-bold text-slate-700">Upload a profile photo</span>
               <span className="text-[10px] text-slate-400 mt-1">JPG, PNG · Used for identity verification</span>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input type="checkbox" className="mt-1 border-slate-300 rounded text-slate-900 focus:ring-slate-900" />
            <p className="text-[10px] text-slate-500 leading-tight">
              I agree to the <span className="font-bold text-slate-700">Terms of Service</span> and <span className="font-bold text-slate-700">Privacy Policy</span>
            </p>
          </div>

          <button onClick={() => navigate('/home')} className="w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2 flex justify-center items-center gap-2">
            Continue with Fayda &rsaquo;
          </button>
        </div>
      </div>

      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-6 flex items-center gap-1">
        <ShieldCheck size={12} /> YOUR DATA IS SECURED BY THE NATIONAL ENCRYPTION STANDARD.
      </p>

      <div className="w-full flex items-center my-6 gap-4 px-4">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs text-slate-400 font-bold">OR</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <button onClick={() => navigate('/home')} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm">
        <Lock size={16} /> Continue as Guest
      </button>
    </div>
  );
}