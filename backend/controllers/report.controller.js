import { reportService } from '../services/report.service.js';
import { logAudit } from '../utils/audit.js';

export async function create(req, res, next) {
  try {
    const report = await reportService.create(req.user.sub, req.body);
    logAudit(req, { action: 'REPORT_CREATED', entityType: 'Report', entityId: report._id });
    res.status(201).json({ success: true, data: report });
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const result = await reportService.list(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const report = await reportService.getById(req.params.id);
    res.status(200).json({ success: true, data: report });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const report = await reportService.update(req.params.id, req.user.sub, req.body);
    logAudit(req, { action: 'REPORT_UPDATED', entityType: 'Report', entityId: report._id });
    res.status(200).json({ success: true, data: report });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const report = await reportService.updateStatus(req.params.id, req.user.sub, req.body.status, req.user.role);
    logAudit(req, { action: 'REPORT_STATUS_CHANGED', entityType: 'Report', entityId: report._id, metadata: { status: report.status } });
    res.status(200).json({ success: true, data: report });
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    const result = await reportService.remove(req.params.id, req.user.sub);
    logAudit(req, { action: 'REPORT_DELETED', entityType: 'Report', entityId: req.params.id });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
