import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

const VALID_ROLES = ['user', 'admin', 'police'];

export const adminService = {
  async listUsers({ page = 1, limit = 20, role, search }) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;

    let query = supabaseAdmin
      .from('profiles')
      .select('id, fayda_id, full_name, phone, email, role, is_active, badge_number, station, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (role) query = query.eq('role', role);
    if (search) query = query.or(`full_name.ilike.%${search}%,fayda_id.ilike.%${search}%,phone.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw toAppError(error);
    return { users: data, total: count, page: Number(page), limit: Number(limit) };
  },

  async updateRole(targetId, role) {
    if (!VALID_ROLES.includes(role)) {
      throw new AppError(400, 'INVALID_ROLE', `Role must be one of: ${VALID_ROLES.join(', ')}`);
    }
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', targetId)
      .select()
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'User not found');
    return data;
  },

  async setActive(targetId, is_active) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active })
      .eq('id', targetId)
      .select()
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'User not found');

    // Belt-and-suspenders on top of the is_active check in auth.middleware:
    // also block Supabase Auth login itself while deactivated, and restore
    // it on reactivation. Best-effort -- profiles.is_active is still the
    // source of truth the API checks on every request.
    try {
      await supabaseAdmin.auth.admin.updateUserById(targetId, {
        ban_duration: is_active ? 'none' : '876000h'
      });
    } catch (err) {
      console.error('Failed to sync auth ban state:', err.message);
    }

    return data;
  },

  // Admin-provisioned staff account (police or admin). This is the ONLY
  // path that can grant a 'police' or 'admin' role -- self-registration
  // (auth.service.completeProfile) always forces role='user'.
  async createStaff({ email, password, full_name, role, badge_number, station, fayda_id }) {
    if (!['police', 'admin'].includes(role)) {
      throw new AppError(400, 'INVALID_ROLE', "role must be 'police' or 'admin'");
    }
    if (!email || !password || !full_name || !fayda_id) {
      throw new AppError(400, 'VALIDATION_ERROR', 'email, password, full_name, fayda_id are required');
    }
    if (role === 'police' && !badge_number) {
      throw new AppError(400, 'VALIDATION_ERROR', 'badge_number is required for police accounts');
    }

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true
    });
    if (createErr) throw toAppError(createErr, 'Failed to create staff account');

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: created.user.id,
        fayda_id, full_name, email, role,
        badge_number: role === 'police' ? badge_number : null,
        station: role === 'police' ? station : null,
        is_active: true
      }])
      .select()
      .single();

    if (profileErr) {
      // Roll back the auth user so we don't leave an orphaned login with no profile.
      await supabaseAdmin.auth.admin.deleteUser(created.user.id).catch(() => {});
      throw toAppError(profileErr, 'Failed to create staff profile');
    }

    return profile;
  },

  async listAuditLogs({ page = 1, limit = 50 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    const { data, error, count } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw toAppError(error);
    return { logs: data, total: count, page: Number(page), limit: Number(limit) };
  },

  // Dashboard summary counts. Needs service-role because profiles/devices
  // are now owner-only RLS and audit_logs has no client policy at all --
  // a direct client-side count query (as the old dashboard did) would
  // silently return wrong/zero numbers instead of failing loudly.
  async getDashboardStats() {
    const [users, missing, devices, auditLogs] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('emergency_reports').select('*', { count: 'exact', head: true }).eq('type', 'MISSING_PERSON'),
      supabaseAdmin.from('devices').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('audit_logs').select('*', { count: 'exact', head: true }),
    ]);
    if (users.error) throw toAppError(users.error);
    if (missing.error) throw toAppError(missing.error);
    if (devices.error) throw toAppError(devices.error);
    if (auditLogs.error) throw toAppError(auditLogs.error);

    return {
      usersCount: users.count ?? 0,
      missingCount: missing.count ?? 0,
      assetsCount: devices.count ?? 0,
      auditLogsCount: auditLogs.count ?? 0,
    };
  }
};
