import RecoveryCase from '../models/RecoveryCase.js';
import RecoveryParticipant from '../models/RecoveryParticipant.js';
import Match from '../models/Match.js';
import Verification from '../models/Verification.js';
import Report from '../models/Report.js';
import { AppError } from './auth.service.js';
import {
  assertCanViewRecoveryCase,
  assertParticipant,
} from './recoveryCaseAuthorization.service.js';

async function loadPopulatedMatch(matchId) {
  const match = await Match.findOne({ _id: matchId, deleted_at: null })
    .populate('lost_report_id')
    .populate('found_report_id');
  if (!match) throw new AppError(404, 'MATCH_NOT_FOUND', 'Match not found');
  return match;
}

function isReportOwner(match, userId) {
  return [match.lost_report_id.user_id.toString(), match.found_report_id.user_id.toString()].includes(userId);
}

export const recoveryCaseService = {
  async open(userId, matchId) {
    const match = await loadPopulatedMatch(matchId);
    if (!isReportOwner(match, userId)) {
      throw new AppError(403, 'FORBIDDEN', 'You are not a party to this match');
    }
    if (match.status !== 'ACCEPTED') {
      throw new AppError(409, 'MATCH_NOT_ACCEPTED', 'Match must be ACCEPTED first');
    }

    const verified = await Verification.findOne({ match_id: matchId, status: 'VERIFIED' });
    if (!verified) {
      throw new AppError(409, 'NOT_VERIFIED', 'Match must have a VERIFIED verification before opening a case');
    }

    const existing = await RecoveryCase.findOne({ match_id: matchId, deleted_at: null });
    if (existing) throw new AppError(409, 'CASE_EXISTS', 'A recovery case already exists for this match');

    const recoveryCase = await RecoveryCase.create({ match_id: matchId, status: 'OPEN' });

    await RecoveryParticipant.insertMany([
      { recovery_case_id: recoveryCase._id, user_id: match.lost_report_id.user_id, role: 'OWNER' },
      { recovery_case_id: recoveryCase._id, user_id: match.found_report_id.user_id, role: 'FINDER' }
    ]);

    return recoveryCase;
  },

  async getById(id, userId, userRole) {
    const rc = await RecoveryCase.findOne({ _id: id, deleted_at: null }).populate({
      path: 'match_id', populate: [{ path: 'lost_report_id' }, { path: 'found_report_id' }]
    });
    if (!rc) throw new AppError(404, 'CASE_NOT_FOUND', 'Recovery case not found');
    await assertCanViewRecoveryCase(rc, userId, userRole);
    const participants = await RecoveryParticipant.find({ recovery_case_id: id });
    return { ...rc.toObject(), participants };
  },

  async getByMatch(matchId, userId, userRole) {
    const rc = await RecoveryCase.findOne({ match_id: matchId, deleted_at: null });
    if (!rc) throw new AppError(404, 'CASE_NOT_FOUND', 'No recovery case exists for this match');
    return this.getById(rc._id, userId, userRole);
  },

  async updateStatus(id, userId, userRole, status) {
    const valid = ['IN_PROGRESS', 'HANDOFF_PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED'];
    if (!valid.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${valid.join(', ')}`);
    }

    const isPrivileged = ['admin', 'police'].includes(userRole);
    if (status === 'DISPUTED' && !isPrivileged) {
      throw new AppError(403, 'FORBIDDEN', 'Only police/admin can mark a case disputed');
    }
    if (!isPrivileged) {
      await assertParticipant(id, userId);
    }

    const recoveryCase = await RecoveryCase.findOne({ _id: id, deleted_at: null });
    if (!recoveryCase) throw new AppError(404, 'CASE_NOT_FOUND', 'Recovery case not found');

    recoveryCase.status = status;
    if (status === 'COMPLETED') recoveryCase.completed_at = new Date();
    await recoveryCase.save();

    if (status === 'COMPLETED') {
      const match = await Match.findById(recoveryCase.match_id);
      await Report.updateMany(
        { _id: { $in: [match.lost_report_id, match.found_report_id] } },
        { status: 'RECOVERED' }
      );
    }

    return recoveryCase;
  }
};
