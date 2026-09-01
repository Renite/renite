import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { api } from '../../services/api';

// Wraps a group of routes and blocks them until we know the visitor is
// actually signed in. Nothing in ClientLayout/AdminLayout ever checked
// this before, so typing /home or /police-home into the address bar with
// no session at all would render the full page shell and only fail
// later, per API call, in confusing partial ways.
//
// allowedRoles: optional array (e.g. ['police', 'admin']). When present,
// this also fetches the caller's own profile and blocks anyone whose
// role isn't in the list -- e.g. a citizen navigating straight to
// /police-home.
export default function RequireAuth({ allowedRoles, loginPath = '/login' }) {
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

      if (!allowedRoles || allowedRoles.length === 0) {
        if (mounted) setStatus('ok');
        return;
      }

      try {
        const profile = await api.get('/profile/me').then((res) => res.data);
        if (mounted) setStatus(allowedRoles.includes(profile?.role) ? 'ok' : 'denied');
      } catch {
        if (mounted) setStatus('denied');
      }
    }

    check();

    // If the session ends while the user is sitting on a protected page
    // (token expiry, manual sign-out in another tab), bounce them out
    // immediately instead of leaving a stale, half-working screen up.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate(loginPath, { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [allowedRoles, loginPath, navigate]);

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
