import { supabaseAdmin } from '../config/supabase.js';

/**
 * Write an audit log entry. Fire-and-forget by design: a logging failure
 * must never break the actual request, so errors are caught and logged
 * to the console instead of being thrown.
 *
 * The real audit_logs table is intentionally simple (action, description,
 * executed_by) -- no entity_type/entity_id/metadata columns like the old
 * Mongo model had, so entity + metadata info gets folded into `description`.
 *
 * @param {import('express').Request} req  - used for req.user
 * @param {Object} entry
 * @param {string} entry.action        - e.g. 'LOGIN', 'ROLE_UPDATED'
 * @param {string} [entry.description] - human-readable detail
 * @param {string} [entry.executedBy]  - overrides req.user identity when the
 *                                        actor isn't authenticated yet
 */
export async function logAudit(req, { action, description = null, executedBy }) {
  try {
    const actor = executedBy ?? req.user?.fayda_id ?? req.user?.email ?? req.user?.id ?? 'unknown';
    const { error } = await supabaseAdmin.from('audit_logs').insert([
      { action, description, executed_by: actor }
    ]);
    if (error) console.error('Audit log write failed:', error.message);
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}
