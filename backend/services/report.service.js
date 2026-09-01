import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

const EMERGENCY_STATUSES = ['OPEN', 'IN_PROGRESS', 'LOCATED', 'RESOLVED', 'CLOSED'];
const ASSET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RECOVERED', 'CLOSED'];
const PRIVILEGED_ROLES = ['admin', 'police'];

function requirePrivileged(actorRole) {
  if (!PRIVILEGED_ROLES.includes(actorRole)) {
    throw new AppError(403, 'FORBIDDEN', 'Only police or admin can update case status');
  }
}

export const reportService = {
  // ---- emergency_reports (missing persons / other emergencies) ----
  async createEmergencyReport(data) {
    const { type, full_name, age, contact_phone, last_seen_location, details, relation, biometric_photo_url } = data;
    if (!type || !full_name || !age || !contact_phone || !last_seen_location) {
      throw new AppError(400, 'VALIDATION_ERROR', 'type, full_name, age, contact_phone, last_seen_location are required');
    }
    const { data: report, error } = await supabaseAdmin
      .from('emergency_reports')
      .insert([{
        type, full_name, age: Number(age), contact_phone, last_seen_location,
        details: details ?? null, relation: relation ?? null,
        biometric_photo_url: biometric_photo_url ?? null, status: 'OPEN'
      }])
      .select()
      .single();
    if (error) throw toAppError(error);
    return report;
  },

  async listEmergencyReports({ status, page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    let query = supabaseAdmin.from('emergency_reports').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(from, to);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) throw toAppError(error);
    return { reports: data, total: count, page: Number(page), limit: Number(limit) };
  },

  async updateEmergencyStatus(id, status, actorRole) {
    requirePrivileged(actorRole);
    if (!EMERGENCY_STATUSES.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${EMERGENCY_STATUSES.join(', ')}`);
    }
    const { data, error } = await supabaseAdmin
      .from('emergency_reports').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'Emergency report not found');
    return data;
  },

  // ---- stolen_assets ----
  async createStolenAsset(data) {
    const { type, asset_name, category, serial_number, description, asset_photo_url, stolen_location, stolen_date, contact_phone } = data;
    if (!asset_name || !stolen_location || !contact_phone) {
      throw new AppError(400, 'VALIDATION_ERROR', 'asset_name, stolen_location, contact_phone are required');
    }
    const { data: asset, error } = await supabaseAdmin
      .from('stolen_assets')
      .insert([{
        type: type ?? 'STOLEN_ASSET', asset_name, category: category ?? null,
        serial_number: serial_number ?? null, description: description ?? null,
        asset_photo_url: asset_photo_url ?? null, stolen_location,
        stolen_date: stolen_date || null, contact_phone
      }])
      .select()
      .single();
    if (error) throw toAppError(error);
    return asset;
  },

  async listStolenAssets({ page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    const { data, error, count } = await supabaseAdmin
      .from('stolen_assets').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(from, to);
    if (error) throw toAppError(error);
    return { assets: data, total: count, page: Number(page), limit: Number(limit) };
  },

  async updateStolenAssetStatus(id, status, actorRole) {
    requirePrivileged(actorRole);
    if (!ASSET_STATUSES.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${ASSET_STATUSES.join(', ')}`);
    }
    const { data, error } = await supabaseAdmin
      .from('stolen_assets').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'Stolen asset report not found');
    return data;
  },

  // ---- devices (own registered devices; own-user RLS now enforced too,
  //      but the backend goes through service-role so app code owns the check) ----
  async registerDevice(userId, faydaId, data) {
    const { device_name, device_type, brand, model, serial_number, color, purchase_date } = data;
    if (!device_name || !device_type || !brand || !serial_number) {
      throw new AppError(400, 'VALIDATION_ERROR', 'device_name, device_type, brand, serial_number are required');
    }
    const recovery_token = 'RNT-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const { data: device, error } = await supabaseAdmin
      .from('devices')
      .insert([{
        user_id: userId, fayda_id: faydaId, device_name, device_type, brand,
        model: model ?? null, serial_number, color: color ?? null,
        purchase_date: purchase_date || null, recovery_token
      }])
      .select()
      .single();
    if (error) throw toAppError(error);
    return device;
  },

  async listMyDevices(userId) {
    const { data, error } = await supabaseAdmin
      .from('devices').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw toAppError(error);
    return data;
  },

  // Admin inventory view (AssetsInventoryAdmin.jsx) -- all devices, since
  // devices RLS is now own-user-only for clients.
  async listAllDevices({ page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    const { data, error, count } = await supabaseAdmin
      .from('devices').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(from, to);
    if (error) throw toAppError(error);
    return { devices: data, total: count, page: Number(page), limit: Number(limit) };
  },

  async deleteDevice(id) {
    const { error } = await supabaseAdmin.from('devices').delete().eq('id', id);
    if (error) throw toAppError(error);
    return { deleted: true };
  },

  // ---- officer lookups (PoliceHome search) ----
  async lookupDeviceByToken(token) {
    const { data, error } = await supabaseAdmin
      .from('devices')
      .select('*, profiles(full_name, phone, region, city)')
      .eq('recovery_token', String(token || '').trim().toUpperCase())
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'No device found matching this recovery token.');
    return data;
  },

  async lookupCitizenByFaydaId(faydaId) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, devices(*)')
      .eq('fayda_id', String(faydaId || '').replace(/\s+/g, ''))
      .maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'NOT_FOUND', 'No citizen found matching this Fayda ID.');
    return data;
  }
};
