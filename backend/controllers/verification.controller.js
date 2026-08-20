import { verificationService } from '../services/verification.service.js';
import { logAudit } from '../utils/audit.js';

export async function create(req, res, next) {
  try {
    const verification = await verificationService.create(req.user.sub, req.body);
    logAudit(req, { action: 'VERIFICATION_STARTED', entityType: 'Verification', entityId: verification._id });
    res.status(201).json({ success: true, data: verification });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const verification = await verificationService.getById(req.params.id, req.user.sub, req.user.role);
    res.status(200).json({ success: true, data: verification });
  } catch (err) { next(err); }
}

export async function listForMatch(req, res, next) {
  try {
    const verifications = await verificationService.listForMatch(req.params.matchId, req.user.sub, req.user.role);
    res.status(200).json({ success: true, data: verifications });
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
    const verification = await verificationService.updateStatus(req.params.id, req.body.status, req.body.notes);
    logAudit(req, { action: 'VERIFICATION_REVIEWED', entityType: 'Verification', entityId: verification._id, metadata: { status: verification.status } });
    res.status(200).json({ success: true, data: verification });
  } catch (err) { next(err); }
}

export async function getContact(req, res, next) {
  try {
    const contact = await verificationService.getContactExchange(req.params.matchId, req.user.sub);
    logAudit(req, { action: 'CONTACT_EXCHANGED', entityType: 'Match', entityId: req.params.matchId });
    res.status(200).json({ success: true, data: contact });
  } catch (err) { next(err); }
}
