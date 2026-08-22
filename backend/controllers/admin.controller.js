import { adminService } from '../services/admin.service.js';
import { logAudit } from '../utils/audit.js';

export async function listUsers(req, res, next) {
  try {
    const result = await adminService.listUsers(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateRole(req, res, next) {
  try {
    const user = await adminService.updateRole(req.params.id, req.body.role);
    logAudit(req, {
      action: 'ROLE_UPDATED',
      entityType: 'User',
      entityId: req.params.id,
      metadata: { new_role: req.body.role }
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function setActive(req, res, next) {
  try {
    const user = await adminService.setActive(req.params.id, req.body.is_active);
    logAudit(req, {
      action: 'STATUS_UPDATED',
      entityType: 'User',
      entityId: req.params.id,
      metadata: { is_active: req.body.is_active }
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
}
