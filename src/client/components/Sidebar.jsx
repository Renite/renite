import { useNavigate } from 'react-router-dom';
import { User, AlertTriangle, Shield, Wallet, Users, MapPin, HandHeart, Activity, Cpu, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />

      {/* Drawer */}
      <div className="relative w-72 bg-slate-900 text-white h-full p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* User Profile Card */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 font-bold">
              AG
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Abebe Girma</h3>
              <p className="text-[10px] text-slate-400 font-mono">FYD-3821-9042</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/50 rounded-xl p-2 mb-6 text-center border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">4</span>
              <span className="text-[9px] text-slate-400">Cases Filed</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">3</span>
              <span className="text-[9px] text-slate-400">Resolved</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">280</span>
              <span className="text-[9px] text-slate-400">Points</span>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2">Main</span>
              <div className="space-y-1">
                <button onClick={() => handleNav('/home')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <User className="w-4 h-4 text-slate-400" /> Profile
                </button>
                <button onClick={() => handleNav('/home')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-400 hover:bg-slate-800 rounded-xl font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Missing Persons
                </button>
                <button onClick={() => handleNav('/register')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <Shield className="w-4 h-4 text-slate-400" /> My asset Tracker
                </button>
                <button onClick={() => handleNav('/home')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <Wallet className="w-4 h-4 text-slate-400" /> Rewards Wallet
                </button>
              </div>
            </div>

            {/* Community Navigation */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2">Community</span>
              <div className="space-y-1">
                <button onClick={() => handleNav('/home')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <Users className="w-4 h-4 text-slate-400" /> Community Reports
                </button>
                <button onClick={() => handleNav('/map')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <MapPin className="w-4 h-4 text-slate-400" /> Safety Zones Map
                </button>
                <button onClick={() => handleNav('/volunteer-network')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <HandHeart className="w-4 h-4 text-slate-400" /> Volunteer Network
                </button>
                <button onClick={() => handleNav('/track')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <Activity className="w-4 h-4 text-slate-400" /> Track Status
                </button>
                <button onClick={() => handleNav('/home')} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl">
                  <Cpu className="w-4 h-4 text-slate-400" /> AI Detection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('renite_token');
            handleNav('/login');
          }}
          className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white pt-4 border-t border-slate-800"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}