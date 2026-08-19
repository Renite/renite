import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  AlertTriangle, 
  Monitor, 
  Heart, 
  Star, 
  Activity, 
  Users, 
  Laptop, 
  Smartphone, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Loader2 
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch live data from database endpoints in parallel
      const [alertsRes, assetsRes] = await Promise.all([
        api.get('/missing-persons').catch(() => ({ data: { data: [] } })),
        api.get('/assets').catch(() => ({ data: { data: [] } })),
      ]);

      // Handle standard response envelopes ({ success: true, data: [...] }) or direct arrays
      const alertsList = alertsRes.data?.data || alertsRes.data || [];
      const assetsList = assetsRes.data?.data || assetsRes.data?.assets || assetsRes.data || [];

      setActiveAlerts(Array.isArray(alertsList) ? alertsList : []);
      setRecentItems(Array.isArray(assetsList) ? assetsList : []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to synchronize live data from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const alertCount = activeAlerts.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-6">
      {/* Greeting Header */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getGreeting()}, EDOM</p>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mt-1">National Safety Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Ethiopia Nationwide · Community Safety Network</p>
      </div>

      {/* Emergency Banner */}
      <div 
        onClick={() => navigate('/emergency-report')}
        className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:bg-red-100/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white p-2 rounded-full">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900">{alertCount} Active Missing Person Alert{alertCount !== 1 ? 's' : ''}</h3>
            <p className="text-xs text-red-600 mt-0.5">Ongoing investigation — nationwide...</p>
          </div>
        </div>
        <span className="text-red-600 text-xs font-bold flex items-center gap-0.5">View <ChevronRight className="w-3 h-3" /></span>
      </div>

      {/* Quick Action Cards */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/assets')} 
            className="flex-1 bg-slate-900 text-white rounded-2xl p-5 text-left flex flex-col justify-between h-40 shadow-lg hover:bg-slate-800 transition active:scale-[0.98]"
          >
            <Monitor size={24} className="text-slate-300" />
            <div>
              <h3 className="font-bold text-base leading-tight">Report Lost Asset</h3>
              <p className="text-xs text-slate-400 mt-1">Register & recover nationwide</p>
              <span className="inline-block mt-3 bg-slate-800 text-[10px] px-2 py-1 rounded-full text-slate-300 font-medium">Recovery Mode</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/emergency-report')} 
            className="flex-1 bg-red-500 text-white rounded-2xl p-5 text-left flex flex-col justify-between h-40 shadow-lg shadow-red-500/30 hover:bg-red-600 transition active:scale-[0.98]"
          >
            <Heart size={24} className="text-red-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Report Missing Person</h3>
              <p className="text-xs text-red-100 mt-1">Emergency alert dispatch</p>
              <span className="inline-block mt-3 bg-red-600 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-max font-semibold">
                <AlertTriangle size={10} /> Urgent
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="flex gap-3">
        <button 
          onClick={() => navigate('/rewards')}
          className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-xs hover:bg-slate-50 transition active:scale-[0.97]"
        >
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><Star size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Rewards</span>
        </button>

        <button 
          onClick={() => navigate('/track')}
          className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-xs hover:bg-slate-50 transition active:scale-[0.97]"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Activity size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Track Status</span>
        </button>

        <button 
          onClick={() => navigate('/volunteers')}
          className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 shadow-xs hover:bg-slate-50 transition active:scale-[0.97]"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Users size={16} /></div>
          <span className="text-[10px] font-bold text-slate-700">Volunteers</span>
        </button>
      </div>

      {/* Active Alerts Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Active Alerts</h2>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{alertCount} active</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : activeAlerts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400">No active missing person alerts recorded in the database.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div 
                key={alert._id || alert.id}
                onClick={() => navigate(`/track?code=MP-${alert._id || alert.id}`)}
                className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:bg-rose-100/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-700 font-bold rounded-full flex items-center justify-center text-xs">
                    {alert.initials || (alert.fullName ? alert.fullName.substring(0, 2).toUpperCase() : 'MP')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{alert.fullName} <span className="text-slate-400 font-normal">• {alert.age}y</span></h3>
                    <p className="text-[10px] text-slate-500">Last seen: {alert.lastSeenLocation}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">MISSING</span>
                  <p className="text-[10px] text-slate-400 mt-1">{alert.time || 'Recent'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recently Found Items Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Recently Found Items</h2>
          <button 
            onClick={() => navigate('/assets')} 
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : recentItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400">No recently registered assets found in the database.</p>
            </div>
          ) : (
            recentItems.map((item) => {
              const itemName = item.name || item.title;
              const itemCategory = item.category || item.tag || 'Electronics';
              const itemLocation = item.location;
              const itemTime = item.time || 'Today';
              const itemOwner = item.owner || 'Verified Hub Storage';
              
              return (
                <div 
                  key={item._id || item.id}
                  onClick={() => setSelectedItem({ ...item, title: itemName, tag: itemCategory, location: itemLocation, time: itemTime, owner: itemOwner })}
                  className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:border-slate-300 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                      {itemCategory.toLowerCase().includes('mobile') || itemCategory.toLowerCase().includes('phone') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">{itemName}</h3>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Safe
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Found at {itemLocation}</p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">{itemCategory}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{itemTime}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedItem.title}</h3>
                <span className="text-xs text-emerald-600 font-semibold">{selectedItem.owner}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <p><strong>Location Found:</strong> {selectedItem.location}</p>
              <p><strong>Time Reported:</strong> {selectedItem.time}</p>
              <p><strong>Category:</strong> {selectedItem.tag}</p>
            </div>
            <button 
              onClick={() => {
                setSelectedItem(null);
                navigate(`/track?code=AST-${selectedItem._id || selectedItem.id}`);
              }}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition"
            >
              Claim / Track Recovery
            </button>
          </div>
        </div>
      )}
    </div>
  );
}