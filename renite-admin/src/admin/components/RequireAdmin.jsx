import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { api } from '../../services/api';

// AdminLayout previously rendered for anyone, session or not -- typing
// /admin/users straight into the address bar with no session at all
// would render the full dashboard shell and only fail per-request, as
// each individual API call came back 401. This blocks that: no session,
// or a session that isn't role='admin', both bounce to the sign-in page.
export default function RequireAdmin({ loginPath = '/admin/auth' }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (mounted) setStatus('denied');
        return;
      }
      try {
        const res = await api.get('/profile/me');
        if (mounted) setStatus(res?.data?.role === 'admin' ? 'ok' : 'denied');
      } catch {
        if (mounted) setStatus('denied');
      }
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate(loginPath, { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [loginPath, navigate]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
        Checking your session…
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
}
