import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { api } from '../../services/api'; // Adjust path if your views folder is structured differently
=======
import { api } from '../../services/api';
>>>>>>> feature/backend-setup
import { Shield, Plus, Search, X, Loader2, AlertCircle } from 'lucide-react';

export default function AssetTracker() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Laptop', serialNumber: '', description: '' });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assets from MongoDB on component load
  useEffect(() => {
<<<<<<< HEAD
    let isMounted = true;

    api.get('/assets')
      .then((data) => {
        if (isMounted) {
          setAssets(Array.isArray(data) ? data : data.assets || []);
        }
      })
      .catch(() => {
        if (isMounted) {
=======
    let cancelled = false;

    api.get('/assets')
      .then((data) => {
        if (!cancelled) {
          setAssets(Array.isArray(data) ? data : data.assets || []);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
>>>>>>> feature/backend-setup
          setError('Could not connect to database server.');
        }
      })
      .finally(() => {
<<<<<<< HEAD
        if (isMounted) {
=======
        if (!cancelled) {
>>>>>>> feature/backend-setup
          setLoading(false);
        }
      });

    return () => {
<<<<<<< HEAD
      isMounted = false;
=======
      cancelled = true;
>>>>>>> feature/backend-setup
    };
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber) return;

    try {
      const payload = {
        name: newAsset.name,
        category: newAsset.category,
        status: 'REGISTERED',
        serial: newAsset.serialNumber,
        date: new Date().toISOString().split('T')[0],
      };

<<<<<<< HEAD
      // Save to MongoDB via backend POST route
      const response = await api.post('/assets', payload);
      const createdAsset = response.asset || response;

      // Update local state with database record
=======
      const response = await api.post('/assets', payload);
      const createdAsset = response.asset || response;

>>>>>>> feature/backend-setup
      setAssets([createdAsset, ...assets]);
      setIsRegistering(false);
      setNewAsset({ name: '', category: 'Laptop', serialNumber: '', description: '' });
    } catch (err) {
<<<<<<< HEAD
=======
      console.error(err);
>>>>>>> feature/backend-setup
      alert('Failed to register asset: ' + err.message);
    }
  };

  const handleReportLost = async (id) => {
    try {
<<<<<<< HEAD
      // Update status in MongoDB
      await api.put(`/assets/${id}`, { status: 'LOST' });
      
      // Update local state
      setAssets(assets.map(a => (a._id === id || a.id === id) ? { ...a, status: 'LOST' } : a));
      setSelectedAsset(null);
    } catch {
=======
      await api.put(`/assets/${id}`, { status: 'LOST' });
      setAssets(assets.map(a => (a._id === id || a.id === id) ? { ...a, status: 'LOST' } : a));
      setSelectedAsset(null);
    } catch (err) {
      console.error(err);
>>>>>>> feature/backend-setup
      alert('Failed to update asset status.');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === 'ALL' || asset.status === activeTab;
    const matchesSearch = (asset.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (asset.serial || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asset Protection</h1>
          <p className="text-xs text-slate-500">Register & safeguard your electronics</p>
        </div>
        <button 
          onClick={() => setIsRegistering(true)}
          className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition active:scale-95"
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

<<<<<<< HEAD
      {/* Database Asset Feed / List */}
=======
>>>>>>> feature/backend-setup
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
          filteredAssets.map((asset) => (
            <div 
              key={asset._id || asset.id} 
              onClick={() => setSelectedAsset(asset)}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{asset.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">S/N: {asset.serial}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                asset.status === 'REGISTERED' ? 'bg-emerald-100 text-emerald-800' :
                asset.status === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {asset.status}
              </span>
            </div>
          ))
        )}
      </div>

<<<<<<< HEAD
      {/* Registration Modal */}
=======
>>>>>>> feature/backend-setup
      {isRegistering && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRegisterSubmit} className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select 
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile Phone</option>
                  <option value="Audio">Audio / Headphones</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition active:scale-95">
              Save Registration
            </button>
          </form>
        </div>
      )}

<<<<<<< HEAD
      {/* Asset Detail / Actions Modal */}
=======
>>>>>>> feature/backend-setup
      {selectedAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedAsset(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-slate-900 text-sm">{selectedAsset.name}</h3>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
              <p><strong>Status:</strong> {selectedAsset.status}</p>
              <p><strong>Serial:</strong> <span className="font-mono">{selectedAsset.serial}</span></p>
              <p><strong>Category:</strong> {selectedAsset.category}</p>
            </div>
            {selectedAsset.status !== 'LOST' && (
              <button 
                onClick={() => handleReportLost(selectedAsset._id || selectedAsset.id)}
                className="w-full bg-rose-500 text-white py-2 rounded-xl font-bold text-xs hover:bg-rose-600 transition active:scale-95"
              >
                Report Lost / Stolen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}