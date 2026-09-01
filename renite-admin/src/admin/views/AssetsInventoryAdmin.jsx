import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Package, Plus, Search, Trash2, Edit2, AlertCircle, Loader2 } from "lucide-react";

export default function AssetsInventoryAdmin() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAssets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/reports/devices?limit=200');

        if (!isMounted) return;
        setAssets(data.devices || []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setError(err.message || "Failed to load assets inventory.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset record?")) return;
    try {
      await api.delete(`/reports/devices/${id}`);
      setAssets(assets.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete asset: " + err.message);
    }
  };

  const filteredAssets = assets.filter((item) => {
    const nameStr = item.device_name || `${item.brand || ''} ${item.model || ''}` || "";
    return nameStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assets & Inventory</h1>
          <p className="text-sm text-slate-500">Manage citizen-registered devices and recovery tokens.</p>
        </div>
        <button 
          onClick={() => alert("Add Item modal can be integrated here.")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition active:scale-[0.98]"
          style={{ backgroundColor: '#0a2540' }}
        >
          <Plus className="w-4 h-4" /> Add New Asset
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search inventory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
        />
      </div>

      {/* Content Feed / Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading inventory items...
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">No assets found</p>
          <p className="text-xs text-slate-400">Get started by adding your first inventory item.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-4">Item Name / Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity / Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssets.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.device_name || `${item.brand || ''} ${item.model || ''}`.trim() || "Unnamed Asset"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.device_type || "General"}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-slate-100 text-slate-700 font-mono">
                        {item.recovery_token}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 transition" title="Edit Asset"><Edit2 className="w-4 h-4" /></button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 transition"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}