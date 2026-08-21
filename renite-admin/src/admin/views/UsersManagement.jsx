import { useState, useEffect } from 'react';
import { supabase } from '../../supabase'; // Adjust path if needed
import { Mail, Loader2, AlertCircle } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        // Fetching from Supabase 'profiles' table (adjust table name if your users table is named differently)
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setUsers(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load users from Supabase:', err);
        setError('Failed to load user accounts.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

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
          <p className="text-xs text-slate-500">Inspect registered user accounts and roles</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {users.length}
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No user accounts found in database.
          </div>
        ) : (
          users.map((user) => {
            const userId = user.id || user._id;
            const userName = user.name || user.username || user.full_name || 'Unnamed User';
            const userRole = user.role || 'user';
            const userCreatedAt = user.created_at || user.createdAt;

            return (
              <div 
                key={userId}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{userName}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                      userRole === 'admin' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {userRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email || 'No email provided'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">
                    {userCreatedAt ? new Date(userCreatedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}