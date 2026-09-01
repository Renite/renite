import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mail, Loader2, AlertCircle } from 'lucide-react';

const ROLES = ['user', 'police', 'admin'];

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      // profiles is no longer publicly listable -- this now goes through
      // BE-012's admin endpoint (service-role, admin-only).
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      setUsers(data.users || []);
      setTotal(data.total ?? data.users?.length ?? 0);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoleChange = async (userId, newRole) => {
    setBusyId(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    setBusyId(userId);
    try {
      await api.patch(`/admin/users/${userId}/status`, { is_active: !isActive });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u)));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading user accounts...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">User Management</h2>
          <p className="text-xs text-slate-500">Manage registered accounts, roles, and access</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {total}
        </span>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        placeholder="Search by name, Fayda ID, or phone..."
        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-slate-400"
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No user accounts found.
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm">{user.full_name || 'Unnamed User'}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                    user.role === 'admin' ? 'bg-amber-50 text-amber-700' :
                    user.role === 'police' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role || 'user'}
                  </span>
                  {user.is_active === false && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 uppercase">
                      Deactivated
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email || 'No email provided'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">{user.fayda_id}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={user.role || 'user'}
                  disabled={busyId === user.id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 focus:outline-none"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  disabled={busyId === user.id}
                  onClick={() => handleToggleActive(user.id, user.is_active !== false)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    user.is_active === false
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {user.is_active === false ? 'Activate' : 'Deactivate'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
