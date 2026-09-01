import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Shield, Plus, Search, X, Loader2, AlertCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AssetTracker() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Laptop', serialNumber: '', description: '' });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assets from Supabase 'devices' table on load
  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('devices')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (!cancelled) {
          setAssets(data || []);
        }
      } catch (err) {
        console.error('Fetch assets error:', err);
        if (!cancelled) {
          setError('Could not connect to database server.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber || submitting) return;

    try {
      setSubmitting(true);
      const recoveryToken = 'REC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      const payload = {
        device_name: newAsset.name,
        device_type: newAsset.category,
        brand: newAsset.category,
        serial_number: newAsset.serialNumber,
        status: 'REGISTERED',
        recovery_token: recoveryToken,
      };

      const { data, error: insertError } = await supabase
        .from('devices')
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      if (data && data[0]) {
        setAssets([data[0], ...assets]);
      }
      setIsRegistering(false);
      setNewAsset({ name: '', category: 'Laptop', serialNumber: '', description: '' });
    } catch (err) {
      console.error('Register asset error:', err);
      alert('Failed to register asset: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportLost = async (id) => {
    try {
      setSubmitting(true);
      const { error: updateError } = await supabase
        .from('devices')
        .update({ status: 'LOST' })
        .eq('id', id);

      if (updateError) throw updateError;

      setAssets(assets.map(a => ((a.id || a._id) === id) ? { ...a, status: 'LOST' } : a));
      setSelectedAsset(null);
    } catch (err) {
      console.error('Report lost error:', err);
      alert('Failed to update asset status.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const name = asset.device_name || asset.name || '';
    const serial = asset.serial_number || asset.serial || '';
    const status = asset.status || 'REGISTERED';

    const matchesTab = activeTab === 'ALL' || status === activeTab;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          serial.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // ==========================================
  // DETAIL VIEW (Matches Missing Person Format)
  // ==========================================
  if (selectedAsset) {
    const isLost = selectedAsset.status === 'LOST';

    return (
      <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-y-auto pb-24">
        
        {/* Dynamic Header Card */}
        <div className={`${isLost ? 'bg-red-500' : 'bg-slate-900'} text-white p-5 rounded-b-3xl relative shadow-md transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
              <span className={`w-2 h-2 rounded-full ${isLost ? 'bg-white animate-pulse' : 'bg-emerald-400'}`}></span>
              {isLost ? 'Lost Asset Alert' : 'Secured Asset'}
            </span>
            <button 
              onClick={() => setSelectedAsset(null)} 
              className="text-white/80 hover:text-white p-1 rounded-lg transition"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/10 overflow-hidden flex items-center justify-center text-white shrink-0">
              <Shield className={`w-8 h-8 ${isLost ? 'opacity-90' : 'opacity-80'}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{selectedAsset.name}</h1>
              <p className="text-xs text-white/90 font-medium mt-0.5 font-mono">
                S/N: {selectedAsset.serial}
              </p>
            </div>
          </div>
        </div>

        {/* Main Details Body */}
        <div className="px-4 -mt-3 relative z-10 flex flex-col gap-4">
          
          {/* Device Details Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Device Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400">Current Status</p>
                <p className={`text-sm font-bold ${isLost ? 'text-red-600' : 'text-emerald-600'}`}>
                  {selectedAsset.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Category</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{selectedAsset.device_type || selectedAsset.category || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Recovery Token</p>
                <p className="text-xs font-bold font-mono text-slate-800 bg-slate-200 inline-block px-2 py-0.5 rounded">
                  {selectedAsset.recovery_token || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Asset Identification</p>
                <p className="text-xs font-medium text-slate-800">Please present the Recovery Token to authorities to verify ownership if found.</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {selectedAsset.status !== 'LOST' ? (
            <button 
              disabled={submitting}
              onClick={() => handleReportLost(selectedAsset.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-red-500/20 transition flex items-center justify-center gap-2 text-xs disabled:opacity-70"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
              {submitting ? 'Updating...' : 'Report Lost / Stolen'}
            </button>
          ) : (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 shadow-xs text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">Asset Reported Lost</h3>
              <p className="text-xs text-red-500">This device has been flagged in the database. Ensure authorities have your serial number and recovery token.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // LIST VIEW (Default UI)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asset Protection</h1>
          <p className="text-xs text-slate-500">Register & safeguard your electronics</p>
        </div>
        <button 
          onClick={() => setIsRegistering(true)}
          className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-slate-800 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Register
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by asset name or serial code..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'REGISTERED', 'LOST', 'RECOVERED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <p className="text-xs text-slate-400">Loading assets from database...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-1">
            <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No assets found</p>
            <p className="text-[11px] text-slate-400">Register your first item to begin tracking.</p>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const assetName = asset.device_name || asset.name;
            const assetSerial = asset.serial_number || asset.serial;
            const assetStatus = asset.status || 'REGISTERED';
            const assetId = asset.id || asset._id;

            return (
              <div 
                key={assetId} 
                onClick={() => setSelectedAsset({ ...asset, id: assetId, name: assetName, serial: assetSerial, status: assetStatus })}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{assetName}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">S/N: {assetSerial}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  assetStatus === 'REGISTERED' ? 'bg-emerald-100 text-emerald-800' :
                  assetStatus === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {assetStatus}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Registration Modal */}
      {isRegistering && (
        <div 
          onClick={() => setIsRegistering(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <form 
            onSubmit={handleRegisterSubmit} 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Register New Asset</h3>
              <button type="button" onClick={() => setIsRegistering(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Device Name</label>
                <input 
                  required
                  type="text" 
                  value={newAsset.name} 
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g. Dell XPS 15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Serial Number</label>
                <input 
                  required
                  type="text" 
                  value={newAsset.serialNumber} 
                  onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  placeholder="e.g. SN-998123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select 
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile Phone</option>
                  <option value="Audio">Audio / Headphones</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Registering...' : 'Save Registration'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}