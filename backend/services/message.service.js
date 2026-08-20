import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import RecoveryCase from '../models/RecoveryCase.js';
import { AppError } from './auth.service.js';
import { assertCanViewRecoveryCase } from './recoveryCaseAuthorization.service.js';

function assertValidObjectId(id, code, message) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, code, message);
  }
}

export async function loadConversation(id) {
  assertValidObjectId(id, 'INVALID_CONVERSATION_ID', 'Invalid conversation ID');

  const conversation = await Conversation.findOne({ _id: id, deleted_at: null });
  if (!conversation) {
    throw new AppError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found');
  }
  return conversation;
}

// A conversation doesn't store its own participant list — access is
// derived from the RecoveryCase it belongs to, same as conversation.service.js.
// Exported separately so the Socket.io layer can reuse the exact same
// check instead of re-implementing authorization.
export async function assertCanAccessConversation(conversation, userId, userRole) {
  const recoveryCase = await RecoveryCase.findOne({ _id: conversation.recovery_case_id, deleted_at: null });
  if (!recoveryCase) {
    throw new AppError(404, 'RECOVERY_CASE_NOT_FOUND', 'Recovery case not found');
  }
  await assertCanViewRecoveryCase(recoveryCase, userId, userRole);
}

export const messageService = {
  async send(conversationId, userId, userRole, { body, message_type = 'TEXT' }) {
    if (!body || !body.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'body is required');
    }
    if (!['TEXT', 'IMAGE'].includes(message_type)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'message_type must be TEXT or IMAGE');
    }

    const conversation = await loadConversation(conversationId);
    await assertCanAccessConversation(conversation, userId, userRole);

    return Message.create({
      conversation_id: conversation._id,
      sender_id: userId,
      body: body.trim(),
      message_type,
    });
  },

  async list(conversationId, userId, userRole, { page = 1, limit = 30 } = {}) {
    const conversation = await loadConversation(conversationId);
    await assertCanAccessConversation(conversation, userId, userRole);

    const skip = (page - 1) * limit;
    const filter = { conversation_id: conversation._id, deleted_at: null };
    const [messages, total] = await Promise.all([
      Message.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Message.countDocuments(filter),
    ]);

    return { messages, total, page: Number(page), limit: Number(limit) };
  },

  async editOwn(conversationId, messageId, userId, body) {
    if (!body || !body.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'body is required');
    }
    assertValidObjectId(messageId, 'INVALID_MESSAGE_ID', 'Invalid message ID');

    const message = await Message.findOne({ _id: messageId, conversation_id: conversationId, deleted_at: null });
    if (!message) throw new AppError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
    if (message.sender_id.toString() !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only edit your own messages');
    }

    message.body = body.trim();
    message.edited_at = new Date();
    await message.save();
    return message;
  },

  async softDeleteOwn(conversationId, messageId, userId) {
    assertValidObjectId(messageId, 'INVALID_MESSAGE_ID', 'Invalid message ID');

    const message = await Message.findOne({ _id: messageId, conversation_id: conversationId, deleted_at: null });
    if (!message) throw new AppError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
    if (message.sender_id.toString() !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only delete your own messages');
    }

    message.deleted_at = new Date();
    await message.save();
    return { deleted: true };
  },
};
