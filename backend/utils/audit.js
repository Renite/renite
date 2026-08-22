import AuditLog from '../models/AuditLog.js';

/**
 * Write an audit log entry. Fire-and-forget by design: a logging failure
 * must never break the actual request, so errors are caught and logged
 * to the console instead of being thrown.
 *
 * @param {import('express').Request} req  - used for req.user, req.ip, user-agent
 * @param {Object} entry
 * @param {string} entry.action       - e.g. 'LOGIN', 'REGISTER', 'ROLE_UPDATED'
 * @param {string} entry.entityType   - e.g. 'User', 'Report'
 * @param {string|null} [entry.entityId]
 * @param {Object} [entry.metadata]   - anything extra worth capturing (old/new values, etc.)
 * @param {string|null} [entry.userId] - overrides req.user?.sub when the actor
 *                                        isn't authenticated yet (e.g. register/login)
 */
export async function logAudit(req, { action, entityType, entityId = null, metadata = {}, userId }) {
  try {
    await AuditLog.create({
      user_id: userId ?? req.user?.sub ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}
