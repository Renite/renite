import { profileService } from '../services/profile.service.js';
import { logAudit } from '../utils/audit.js';

export async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getMyProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (err) { next(err); }
}

export async function updateMyProfile(req, res, next) {
  try {
    const profile = await profileService.updateMyProfile(req.user.id, req.body);
    logAudit(req, { action: 'PROFILE_UPDATED' });
    res.status(200).json({ success: true, data: profile });
  } catch (err) { next(err); }
}
