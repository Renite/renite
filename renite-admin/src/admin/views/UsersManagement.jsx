import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mail } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get('/admin/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users from database:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Loading user accounts...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">User Management</h2>
          <p className="text-xs text-slate-500">Inspect registered user accounts and roles</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {users.length}
        </span>
      </div>

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No user accounts found in database.
          </div>
        ) : (
          users.map((user) => (
            <div 
              key={user._id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{user.name || user.username || 'Unnamed User'}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                    user.role === 'admin' 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}