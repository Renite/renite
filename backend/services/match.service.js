import Report from '../models/Report.js';
import Match from '../models/Match.js';
import { AppError } from './auth.service.js';
import { distanceKm } from '../utils/geo.js';

const THRESHOLD = 40; // minimum score to auto-create a PENDING match

function keywordScore(a, b) {
  const words = (s) => new Set((s || '').toLowerCase().split(/\W+/).filter(Boolean));
  const wa = words(a), wb = words(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  let overlap = 0;
  for (const w of wa) if (wb.has(w)) overlap++;
  return (overlap / Math.max(wa.size, wb.size)) * 30;
}

function locationScore(a, b) {
  if (!a?.latitude || !a?.longitude || !b?.latitude || !b?.longitude) return 0;
  const km = distanceKm(a.latitude, a.longitude, b.latitude, b.longitude);
  if (km >= 20) return 0;
  return Math.max(0, 40 * (1 - km / 20));
}

function dateScore(a, b) {
  if (!a || !b) return 0;
  const days = Math.abs((new Date(a) - new Date(b)) / 86400000);
  if (days >= 30) return 0;
  return Math.max(0, 30 * (1 - days / 30));
}

export const matchService = {
  computeScore(reportA, reportB) {
    const kw = keywordScore(`${reportA.title} ${reportA.description || ''}`, `${reportB.title} ${reportB.description || ''}`);
    const loc = locationScore(reportA.location, reportB.location);
    const date = dateScore(reportA.incident_date, reportB.incident_date);
    return Math.round(kw + loc + date);
  },

  async generateForReport(report) {
    const oppositeType = report.type === 'LOST' ? 'FOUND' : 'LOST';
    const candidates = await Report.find({
      type: oppositeType,
      category_id: report.category_id,
      material_id: report.material_id,
      status: 'ACTIVE',
      deleted_at: null
    });

    const created = [];
    for (const candidate of candidates) {
      const [lostId, foundId] = report.type === 'LOST'
        ? [report._id, candidate._id]
        : [candidate._id, report._id];

      const exists = await Match.findOne({ lost_report_id: lostId, found_report_id: foundId, deleted_at: null });
      if (exists) continue;

      const score = this.computeScore(report, candidate);
      if (score < THRESHOLD) continue;

      const match = await Match.create({
        lost_report_id: lostId, found_report_id: foundId,
        score, source: 'RULE_BASED', status: 'PENDING'
      });
      created.push(match);
    }
    return created;
  },

  async listForReport(reportId) {
    return Match.find({
      $or: [{ lost_report_id: reportId }, { found_report_id: reportId }],
      deleted_at: null
    })
      .populate('lost_report_id')
      .populate('found_report_id')
      .sort({ score: -1 });
  },

  async getById(id) {
    const match = await Match.findOne({ _id: id, deleted_at: null })
      .populate('lost_report_id')
      .populate('found_report_id');
    if (!match) throw new AppError(404, 'MATCH_NOT_FOUND', 'Match not found');
    return match;
  },

  async updateStatus(matchId, userId, userRole, status) {
    const match = await this.getById(matchId);
    const isOwner = [match.lost_report_id.user_id.toString(), match.found_report_id.user_id.toString()].includes(userId);
    const isPrivileged = ['admin', 'police'].includes(userRole);
    if (!isOwner && !isPrivileged) {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized to act on this match');
    }
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'status must be ACCEPTED or REJECTED');
    }

    match.status = status;
    await match.save();

    if (status === 'ACCEPTED') {
      await Report.updateMany(
        { _id: { $in: [match.lost_report_id._id, match.found_report_id._id] } },
        { status: 'MATCHED' }
      );
    }
    return match;
  }
};
