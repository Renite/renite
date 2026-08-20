import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import RecoveryCase from '../models/RecoveryCase.js';
import RecoveryParticipant from '../models/RecoveryParticipant.js';
import { AppError } from './auth.service.js';

function assertValidObjectId(id, code, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, code, message);
  }
}

async function loadRecoveryCase(id) {
  assertValidObjectId(id, 'INVALID_RECOVERY_CASE_ID', 'Invalid recovery case ID');

  const recoveryCase = await RecoveryCase.findOne({
    _id: id,
    deleted_at: null,
  });

  if (!recoveryCase) {
    throw new AppError(404, 'RECOVERY_CASE_NOT_FOUND', 'Recovery case not found');
  }

  return recoveryCase;
}

async function assertCanAccessRecoveryCase(recoveryCaseId, userId, userRole) {
  if (['admin', 'police'].includes(userRole)) return;

  const participant = await RecoveryParticipant.findOne({
    recovery_case_id: recoveryCaseId,
    user_id: userId,
  });

  if (!participant) {
    throw new AppError(403, 'NOT_AUTHORIZED', 'You are not authorized to access this conversation');
  }
}

export const conversationService = {
  async getByRecoveryCase(recoveryCaseId, userId, userRole) {
    const recoveryCase = await loadRecoveryCase(recoveryCaseId);
    await assertCanAccessRecoveryCase(recoveryCase._id, userId, userRole);

    const conversation = await Conversation.findOne({
      recovery_case_id: recoveryCase._id,
      deleted_at: null,
    });

    if (!conversation) {
      throw new AppError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found');
    }

    return conversation;
  },

  async createForRecoveryCase(recoveryCaseId, userId, userRole) {
    const recoveryCase = await loadRecoveryCase(recoveryCaseId);
    await assertCanAccessRecoveryCase(recoveryCase._id, userId, userRole);

    const existing = await Conversation.findOne({
      recovery_case_id: recoveryCase._id,
      deleted_at: null,
    });

    if (existing) return existing;

    try {
      return await Conversation.create({
        recovery_case_id: recoveryCase._id,
        status: 'ACTIVE',
      });
    } catch (err) {
      // Protect against concurrent creates when the unique active-conversation
      // index is hit between the existence check and insert.
      if (err?.code === 11000) {
        const conversation = await Conversation.findOne({
          recovery_case_id: recoveryCase._id,
          deleted_at: null,
        });
        if (conversation) return conversation;
      }
      throw err;
    }
  },
};
