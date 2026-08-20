import { conversationService } from '../services/conversation.service.js';
import { logAudit } from '../utils/audit.js';

export async function getByRecoveryCase(req, res, next) {
  try {
    const conversation = await conversationService.getByRecoveryCase(
      req.params.id,
      req.user.sub,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
}

export async function createForRecoveryCase(req, res, next) {
  try {
    const conversation = await conversationService.createForRecoveryCase(
      req.params.id,
      req.user.sub,
      req.user.role
    );

    logAudit(req, {
      action: 'CONVERSATION_CREATED',
      entityType: 'Conversation',
      entityId: conversation._id,
      metadata: { recovery_case_id: conversation.recovery_case_id },
    });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
}
