import { authService } from '../services/auth.service.js';
import { logAudit } from '../utils/audit.js';

export async function completeProfile(req, res, next) {
  try {
    const profile = await authService.completeProfile(req.user, req.body);
    logAudit(req, { action: 'PROFILE_COMPLETED', description: `fayda_id=${profile.fayda_id}` });
    res.status(201).json({ success: true, data: profile });
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const profile = await authService.me(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (err) { next(err); }
}

export async function lookupEmail(req, res, next) {
  try {
    const result = await authService.lookupEmailByFaydaId(req.body.fayda_id);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
