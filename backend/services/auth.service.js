import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

// Roles a user is allowed to self-assign when completing their own profile.
// 'police' and 'admin' can ONLY be granted via admin.service.createStaff --
// this is the fix for the client-side `role: 'police'` self-registration bug.
const SELF_SERVICE_ROLE = 'user';

const PROFILE_FIELDS = [
  'fayda_id', 'full_name', 'dob', 'gender', 'phone', 'email',
  'region', 'city', 'kebele', 'emergency_name', 'emergency_phone', 'emergency_rel'
];

function pickProfileFields(data = {}) {
  return Object.fromEntries(
    PROFILE_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );
}

export const authService = {
  // Called right after supabase.auth.signUp() on the client. Creates (or
  // completes) the caller's own profiles row. Always forces role='user' --
  // there is no code path here that lets a client grant itself 'police' or
  // 'admin'.
  async completeProfile(authUser, data) {
    const fields = pickProfileFields(data);
    if (!fields.fayda_id || !fields.full_name) {
      throw new AppError(400, 'VALIDATION_ERROR', 'fayda_id and full_name are required');
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .upsert([{ id: authUser.id, ...fields, role: SELF_SERVICE_ROLE }], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw toAppError(error, 'Failed to save profile');
    return profile;
  },

  async me(userId) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw toAppError(error);
    if (!profile) throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found');
    return profile;
  },

  // Public, rate-limited. The login screen only collects a Fayda ID +
  // password, but supabase.auth.signInWithPassword() needs an email --
  // and profiles is no longer publicly readable (see migration 001), so
  // the client can't look this up itself anymore. This intentionally
  // returns only the email, nothing else about the profile.
  async lookupEmailByFaydaId(faydaId) {
    const cleaned = String(faydaId || '').replace(/\s+/g, '');
    if (!cleaned) throw new AppError(400, 'VALIDATION_ERROR', 'fayda_id is required');

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('fayda_id', cleaned)
      .maybeSingle();

    if (error) throw toAppError(error);
    if (!profile?.email) {
      throw new AppError(404, 'NOT_FOUND', 'Fayda ID not registered in national database');
    }
    return { email: profile.email };
  }
};
