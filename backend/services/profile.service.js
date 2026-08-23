import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

// Fields the owner may update about themselves. Notably excludes
// fayda_id, role, badge_number, station, is_active -- those are
// admin/system controlled (see admin.service.js).
const UPDATABLE_FIELDS = [
  'full_name', 'dob', 'gender', 'phone', 'email',
  'region', 'city', 'kebele', 'emergency_name', 'emergency_phone', 'emergency_rel'
];

function pickUpdatable(data = {}) {
  return Object.fromEntries(
    UPDATABLE_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );
}

export const profileService = {
  async getMyProfile(userId) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found');
    return data;
  },

  async updateMyProfile(userId, data) {
    const fields = pickUpdatable(data);
    if (Object.keys(fields).length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'No profile fields provided');
    }
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(fields)
      .eq('id', userId)
      .select()
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!profile) throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found');
    return profile;
  }
};
