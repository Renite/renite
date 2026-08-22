import { useState, useEffect } from 'react';
import { supabase } from '../../supabase'; // Adjust path if needed
import { Loader2, AlertCircle } from 'lucide-react';

export default function VerificationsAdmin() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVerifications() {
      try {
        setLoading(true);
        // Fetching from Supabase 'verifications' table
        const { data, error: fetchError } = await supabase
          .from('verifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setVerifications(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load verifications from Supabase:', err);
        setError('Failed to load verification requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchVerifications();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const { error: updateError } = await supabase
        .from('verifications')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      setVerifications(verifications.map(item => 
        (item.id === id || item._id === id) ? { ...item, status } : item
      ));
    } catch (err) {
      console.error('Failed to process verification request:', err);
      alert('Failed to process verification request.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading verification requests...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">Verifications Queue</h2>
          <p className="text-xs text-slate-500">Review and approve user or volunteer credentials</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {verifications.length}
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {verifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs shadow-xs">
            No pending verifications in database.
          </div>
        ) : (
          verifications.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div 
                key={itemId}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {item.user_name || item.userName || item.title || 'Verification Request'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.details || item.type || 'Credentials review required'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : item.status === 'rejected'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.status || 'Pending'}
                  </span>
                </div>

                {(!item.status || item.status === 'pending') && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(itemId, 'rejected')}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(itemId, 'approved')}
                      className="px-3 py-1 rounded-lg text-white font-medium text-xs transition"
                      style={{ backgroundColor: '#0a2540' }}
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}