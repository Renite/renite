import Verification from '../models/Verification.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { AppError } from './auth.service.js';

const METHODS = ['MANUAL', 'IMAGE', 'SERIAL_NUMBER', 'OWNERSHIP_PROOF', 'ADMIN_REVIEW'];

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

async function assertCanView(verification, userId, userRole) {
  if (['admin', 'police'].includes(userRole)) return;
  const match = await loadPopulatedMatch(verification.match_id._id || verification.match_id);
  if (!isReportOwner(match, userId)) {
    throw new AppError(403, 'FORBIDDEN', 'You are not authorized to view this verification');
  }
}

export const verificationService = {
  async create(userId, { match_id, method, evidence_reference, notes }) {
    if (!match_id || !method) {
      throw new AppError(400, 'VALIDATION_ERROR', 'match_id and method are required');
    }
    if (!METHODS.includes(method)) {
      throw new AppError(400, 'VALIDATION_ERROR', `method must be one of: ${METHODS.join(', ')}`);
    }

    const match = await loadPopulatedMatch(match_id);
    if (!isReportOwner(match, userId)) {
      throw new AppError(403, 'FORBIDDEN', 'You are not a party to this match');
    }
    if (match.status !== 'ACCEPTED') {
      throw new AppError(409, 'MATCH_NOT_ACCEPTED', 'Match must be ACCEPTED before verification can start');
    }

    const existing = await Verification.findOne({ match_id, status: 'PENDING' });
    if (existing) throw new AppError(409, 'VERIFICATION_EXISTS', 'A pending verification already exists for this match');

    return Verification.create({ match_id, initiated_by: userId, method, evidence_reference, notes, status: 'PENDING' });
  },

  async getById(id, userId, userRole) {
    const v = await Verification.findById(id).populate({
      path: 'match_id',
      populate: [{ path: 'lost_report_id' }, { path: 'found_report_id' }]
    });
    if (!v) throw new AppError(404, 'VERIFICATION_NOT_FOUND', 'Verification not found');
    await assertCanView(v, userId, userRole);
    return v;
  },

  async listForMatch(matchId, userId, userRole) {
    if (!['admin', 'police'].includes(userRole)) {
      const match = await loadPopulatedMatch(matchId);
      if (!isReportOwner(match, userId)) {
        throw new AppError(403, 'FORBIDDEN', 'You are not authorized to view these verifications');
      }
    }
    return Verification.find({ match_id: matchId }).sort({ createdAt: -1 });
  },

  async listPending() {
    return Verification.find({ status: 'PENDING' }).sort({ createdAt: 1 });
  },

  async updateStatus(id, status, notes) {
    const valid = ['VERIFIED', 'REJECTED'];
    if (!valid.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${valid.join(', ')}`);
    }
    const verification = await Verification.findById(id);
    if (!verification) throw new AppError(404, 'VERIFICATION_NOT_FOUND', 'Verification not found');
    if (verification.status !== 'PENDING') {
      throw new AppError(409, 'VERIFICATION_ALREADY_REVIEWED', 'This verification has already been reviewed');
    }

    verification.status = status;
    if (notes) verification.notes = notes;
    if (status === 'VERIFIED') verification.verified_at = new Date();
    await verification.save();
    return verification;
  },

  // TEMPORARY STOPGAP: reveals contact info directly once verified.
  // Once BE-010 (Chat) exists, this should be replaced by chat-mediated
  // contact exchange rather than a raw phone/email handoff — see
  // architecture doc §17 on minimizing exposure of private contact info.
  async getContactExchange(matchId, requestingUserId) {
    const match = await loadPopulatedMatch(matchId);
    if (!isReportOwner(match, requestingUserId)) {
      throw new AppError(403, 'FORBIDDEN', 'You are not a party to this match');
    }

    const verified = await Verification.findOne({ match_id: matchId, status: 'VERIFIED' });
    if (!verified) throw new AppError(409, 'NOT_VERIFIED', 'This match has not completed verification yet');

    const lostOwnerId = match.lost_report_id.user_id.toString();
    const otherPartyId = requestingUserId === lostOwnerId ? match.found_report_id.user_id : match.lost_report_id.user_id;

    const otherParty = await User.findById(otherPartyId);
    if (!otherParty) throw new AppError(404, 'NOT_FOUND', 'Other party not found');

    return { full_name: otherParty.full_name, email: otherParty.email, phone: otherParty.phone };
  }
};
