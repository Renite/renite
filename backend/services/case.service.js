import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIVILEGED_ROLES = ['admin', 'police'];

export const caseService = {
  // Mirrors the cases RLS policy: privileged roles see everything,
  // everyone else only sees cases tied to their own fayda_id or assigned to them.
  async list(actor, { status, page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    let query = supabaseAdmin.from('cases').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(from, to);

    if (!PRIVILEGED_ROLES.includes(actor.role)) {
      query = query.or(`assigned_officer_id.eq.${actor.id},fayda_id.eq.${actor.fayda_id}`);
    }
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw toAppError(error);
    return { cases: data, total: count, page: Number(page), limit: Number(limit) };
  },

  async getById(id, actor) {
    const { data, error } = await supabaseAdmin.from('cases').select('*').eq('id', id).maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'CASE_NOT_FOUND', 'Case not found');

    const isOwner = data.assigned_officer_id === actor.id || data.fayda_id === actor.fayda_id;
    if (!PRIVILEGED_ROLES.includes(actor.role) && !isOwner) {
      throw new AppError(403, 'FORBIDDEN', 'You are not authorized to view this case');
    }
    return data;
  },

  async updateStatus(id, status, actorRole) {
    if (!PRIVILEGED_ROLES.includes(actorRole)) {
      throw new AppError(403, 'FORBIDDEN', 'Only police or admin can update case status');
    }
    if (!STATUSES.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${STATUSES.join(', ')}`);
    }
    const { data, error } = await supabaseAdmin.from('cases').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw toAppError(error);
    if (!data) throw new AppError(404, 'CASE_NOT_FOUND', 'Case not found');
    return data;
  }
};
