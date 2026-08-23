import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

const METHODS = ['MANUAL', 'IMAGE', 'SERIAL_NUMBER', 'OWNERSHIP_PROOF', 'ADMIN_REVIEW'];
const REPORT_TYPES = ['emergency_report', 'stolen_asset'];

export const verificationService = {
  // Police/admin open a verification review against an emergency report
  // or stolen asset report (optionally tied to a case).
  async create({ case_id, report_type, report_id, method, evidence_url, notes }) {
    if (!report_type || !report_id) {
      throw new AppError(400, 'VALIDATION_ERROR', 'report_type and report_id are required');
    }
    if (!REPORT_TYPES.includes(report_type)) {
      throw new AppError(400, 'VALIDATION_ERROR', `report_type must be one of: ${REPORT_TYPES.join(', ')}`);
    }
    if (method && !METHODS.includes(method)) {
      throw new AppError(400, 'VALIDATION_ERROR', `method must be one of: ${METHODS.join(', ')}`);
    }
    const { data, error } = await supabaseAdmin
      .from('verifications')
      .insert([{
        case_id: case_id ?? null, report_type, report_id,
        method: method ?? 'MANUAL', evidence_url: evidence_url ?? null,
        notes: notes ?? null, status: 'PENDING'
      }])
      .select()
      .single();
    if (error) throw toAppError(error);
    return data;
  },

  async listPending() {
    const { data, error } = await supabaseAdmin
      .from('verifications').select('*').eq('status', 'PENDING').order('created_at', { ascending: true });
    if (error) throw toAppError(error);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('verifications').select('*').eq('id', id).maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'VERIFICATION_NOT_FOUND', 'Verification not found');
    return data;
  },

  async updateStatus(id, status, notes, reviewerId) {
    const valid = ['VERIFIED', 'REJECTED'];
    if (!valid.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${valid.join(', ')}`);
    }
    const existing = await this.getById(id);
    if (existing.status !== 'PENDING') {
      throw new AppError(409, 'VERIFICATION_ALREADY_REVIEWED', 'This verification has already been reviewed');
    }
    const { data, error } = await supabaseAdmin
      .from('verifications')
      .update({
        status, notes: notes ?? existing.notes, reviewed_by: reviewerId,
        verified_at: status === 'VERIFIED' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw toAppError(error);
    return data;
  }
};
