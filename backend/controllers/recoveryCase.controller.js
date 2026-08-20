import { recoveryCaseService } from '../services/recoveryCase.service.js';
import { logAudit } from '../utils/audit.js';

export async function open(req, res, next) {
  try {
    const recoveryCase = await recoveryCaseService.open(req.user.sub, req.body.match_id);
    logAudit(req, { action: 'RECOVERY_CASE_OPENED', entityType: 'RecoveryCase', entityId: recoveryCase._id });
    res.status(201).json({ success: true, data: recoveryCase });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const recoveryCase = await recoveryCaseService.getById(req.params.id, req.user.sub, req.user.role);
    res.status(200).json({ success: true, data: recoveryCase });
  } catch (err) { next(err); }
}

export async function getByMatch(req, res, next) {
  try {
    const recoveryCase = await recoveryCaseService.getByMatch(req.params.matchId, req.user.sub, req.user.role);
    res.status(200).json({ success: true, data: recoveryCase });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const recoveryCase = await recoveryCaseService.updateStatus(req.params.id, req.user.sub, req.user.role, req.body.status);
    logAudit(req, { action: 'RECOVERY_CASE_STATUS_CHANGED', entityType: 'RecoveryCase', entityId: recoveryCase._id, metadata: { status: recoveryCase.status } });
    res.status(200).json({ success: true, data: recoveryCase });
  } catch (err) { next(err); }
}
