import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Monitor, Heart, Star, Activity, Users, Laptop, Smartphone, CheckCircle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-6">
      
      {/* Header with Dynamic Greeting */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getGreeting()}, EDOM</p>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mt-1">National Safety Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Ethiopia Nationwide · Community Safety Network</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white p-2 rounded-full">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900">2 Active Missing Person Alerts</h3>
            <p className="text-xs text-red-600 mt-0.5">Ongoing investigation — nationwide...</p>
          </div>
        </div>
        <span className="text-red-600 text-xs font-bold">View &rarr;</span>
      </div>

      {/* Quick Actions (Large Cards) */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/assets')} className="flex-1 bg-slate-900 text-white rounded-2xl p-5 text-left flex flex-col justify-between h-40 shadow-lg">
            <Monitor size={24} className="text-slate-300" />
            <div>
              <h3 className="font-bold text-base leading-tight">Report Lost Asset</h3>
              <p className="text-xs text-slate-400 mt-1">Register & recover nationwide</p>
              <span className="inline-block mt-3 bg-slate-800 text-[10px] px-2 py-1 rounded-full text-slate-300">Recovery Mode</span>
            </div>
          </button>
          
          <button onClick={() => navigate('/emergency-report')} className="flex-1 bg-red-500 text-white rounded-2xl p-5 text-left flex flex-col justify-between h-40 shadow-lg shadow-red-500/30">
            <Heart size={24} className="text-red-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Report Missing Person</h3>
              <p className="text-xs text-red-100 mt-1">Emergency alert dispatch</p>
              <span className="inline-block mt-3 bg-red-600 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 w-max">
                <AlertTriangle size={10} /> Urgent
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Nav Pills (Mini Cards) */}
      <div className="flex gap-3">
        <button className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><Star size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Rewards</span>
        </button>
        <button onClick={() => navigate('/track')} className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Activity size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Track Status</span>
        </button>
        <button className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Users size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Volunteers</span>
        </button>
      </div>

      {/* Active Alerts List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Active Alerts</h2>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">2 active</span>
        </div>

        <div className="space-y-3">
          {/* Alert 1 */}
          <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 font-bold rounded-full flex items-center justify-center text-xs">
                YB
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Yonas Bekele <span className="text-slate-400 font-normal">• 22y</span></h3>
                <p className="text-[10px] text-slate-500">Last seen: Merkato Market...</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">MISSING</span>
              <p className="text-[10px] text-slate-400 mt-1">3h ago</p>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 font-bold rounded-full flex items-center justify-center text-xs">
                MT
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Meron Tadesse <span className="text-slate-400 font-normal">• 19y</span></h3>
                <p className="text-[10px] text-slate-500">Last seen: Bole International...</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">MISSING</span>
              <p className="text-[10px] text-slate-400 mt-1">8h ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Found Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Recently Found Items</h2>
          <button className="text-xs text-indigo-600 font-medium">See all</button>
        </div>

        <div className="space-y-3">
          {[
            { title: 'MacBook Pro 14"', location: 'Bole Road, Addis Ababa', time: '2h ago', tag: 'Electronics', type: 'Laptop' },
            { title: 'Samsung Galaxy S24', location: 'Hawassa Bus Terminal', time: '5h ago', tag: 'Electronics', type: 'Mobile' },
            { title: 'Dell XPS Charger', location: 'Dire Dawa Railway Station', time: '1d ago', tag: 'Accessories', type: 'Charger' },
            { title: 'Logitech MX Keys', location: 'Mekelle City Hall, Tigray', time: '2d ago', tag: 'Electronics', type: 'Keyboard' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  {item.type === 'Laptop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Safe
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Found at {item.location}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">{item.tag}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">{item.type}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}