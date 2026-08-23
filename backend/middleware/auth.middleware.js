import { supabaseAdmin } from '../config/supabase.js';
import { hasPermission } from '../config/permissions.js';

// Verifies the Supabase access token the frontend already gets from
// supabase.auth.signInWithPassword() / supabase.auth.getSession(), via
// supabase.auth.getUser(token) using the service-role client server-side.
// No separate JWT secret to manage -- Supabase Auth remains the single
// source of truth for "who is logged in."
export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Access token required' }
    });
  }

  const token = header.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired access token' }
      });
    }

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('id, fayda_id, role, is_active, badge_number, station')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr) {
      return next(profileErr);
    }

    if (!profile) {
      // Auth user exists but hasn't completed profile setup yet.
      return res.status(403).json({
        success: false,
        error: { code: 'PROFILE_INCOMPLETE', message: 'Complete your profile before continuing' }
      });
    }

    if (profile.is_active === false) {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'This account has been deactivated' }
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      fayda_id: profile.fayda_id,
      role: profile.role || 'user',
      badge_number: profile.badge_number,
      station: profile.station
    };
    next();
  } catch (err) {
    next(err);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
}

// Fine-grained permission check, e.g. can('verification:review')
export function can(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user?.role, permission)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Missing permission: ${permission}` }
      });
    }
    next();
  };
}
