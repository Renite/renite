import { verificationService } from '../services/verification.service.js';
import { logAudit } from '../utils/audit.js';

export async function create(req, res, next) {
  try {
    const verification = await verificationService.create(req.body);
    logAudit(req, { action: 'VERIFICATION_STARTED', description: `id=${verification.id} report=${verification.report_type}:${verification.report_id}` });
    res.status(201).json({ success: true, data: verification });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const verification = await verificationService.getById(req.params.id);
    res.status(200).json({ success: true, data: verification });
  } catch (err) { next(err); }
}

export async function listPending(req, res, next) {
  try {
    const verifications = await verificationService.listPending();
    res.status(200).json({ success: true, data: verifications });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const verification = await verificationService.updateStatus(req.params.id, req.body.status, req.body.notes, req.user.id);
    logAudit(req, { action: 'VERIFICATION_REVIEWED', description: `id=${verification.id} status=${verification.status}` });
    res.status(200).json({ success: true, data: verification });
  } catch (err) { next(err); }
}
