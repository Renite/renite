import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Clock, User, Terminal, Loader2, AlertCircle } from 'lucide-react';

export default function AuditLogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/audit-logs?limit=100');
        setLogs(data.logs || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
        setError(err.message || 'Failed to load system audit logs.');
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading system audit logs...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">System Audit Logs</h2>
          <p className="text-xs text-slate-500">Monitor security events and administrative actions</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {logs.length}
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No audit logs recorded in database.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div 
              key={log.id || idx}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" style={{ color: '#0a2540' }} />
                  {log.action || log.event || 'System Event'}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(log.created_at || log.createdAt) ? new Date(log.created_at || log.createdAt).toLocaleString() : 'Just now'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {log.description || log.details || 'No additional log payload provided.'}
              </p>
              {(log.user || log.executed_by) && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-500">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Executed by: {log.user || log.executed_by}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}