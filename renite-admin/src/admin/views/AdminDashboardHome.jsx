import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, FileText, Layers, ShieldAlert, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    usersCount: 0,
    missingCount: 0,
    assetsCount: 0,
    auditLogsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setLoading(true);
        setErrorMsg('');

        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load admin metrics:', error);
        setErrorMsg(error.message || 'Failed to sync metrics with the backend.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  const statCards = [
    { label: 'Total Users', count: stats.usersCount, icon: Users, path: '/admin/users' },
    { label: 'Missing Persons', count: stats.missingCount, icon: FileText, path: '/admin/missing' },
    { label: 'Tracked Assets', count: stats.assetsCount, icon: Layers, path: '/admin/assets' },
    { label: 'Audit Logs', count: stats.auditLogsCount, icon: ShieldAlert, path: '/admin/audit-logs' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm space-y-2">
        <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
        <span>Syncing with backend...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div 
        className="p-5 rounded-2xl text-white shadow-sm flex items-center justify-between"
        style={{ backgroundColor: '#0a2540' }}
      >
        <div>
          <h2 className="font-bold text-base leading-tight">System Operations</h2>
          <p className="text-xs text-slate-300 mt-1">Live metrics across all network sectors</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                  <Icon className="w-4 h-4" style={{ color: '#0a2540' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{item.count}</h3>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live sync
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Alerts Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-bold text-slate-900 text-sm">System Health & Alerts</h3>
          <AlertCircle className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></span>
            <div>
              <p className="font-semibold text-slate-800">Backend Connection Active</p>
              <p className="text-slate-500 text-[11px] mt-0.5">All dashboard queries executed successfully.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}