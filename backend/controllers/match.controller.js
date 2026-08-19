import { matchService } from '../services/match.service.js';
import { reportService } from '../services/report.service.js';
import { logAudit } from '../utils/audit.js';

export async function generate(req, res, next) {
  try {
    const report = await reportService.getById(req.params.reportId);
    const matches = await matchService.generateForReport(report);
    res.status(200).json({ success: true, data: { generated: matches.length, matches } });
  } catch (err) { next(err); }
}

export async function listForReport(req, res, next) {
  try {
    const matches = await matchService.listForReport(req.params.reportId);
    res.status(200).json({ success: true, data: matches });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const match = await matchService.getById(req.params.id);
    res.status(200).json({ success: true, data: match });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const match = await matchService.updateStatus(req.params.id, req.user.sub, req.user.role, req.body.status);
    logAudit(req, { action: 'MATCH_STATUS_CHANGED', entityType: 'Match', entityId: match._id, metadata: { status: match.status } });
    res.status(200).json({ success: true, data: match });
  } catch (err) { next(err); }
}
