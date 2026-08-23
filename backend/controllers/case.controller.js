import { caseService } from '../services/case.service.js';
import { logAudit } from '../utils/audit.js';

export async function list(req, res, next) {
  try {
    const result = await caseService.list(req.user, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const c = await caseService.getById(req.params.id, req.user);
    res.status(200).json({ success: true, data: c });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const c = await caseService.updateStatus(req.params.id, req.body.status, req.user.role);
    logAudit(req, { action: 'CASE_STATUS_CHANGED', description: `id=${c.id} status=${c.status}` });
    res.status(200).json({ success: true, data: c });
  } catch (err) { next(err); }
}
