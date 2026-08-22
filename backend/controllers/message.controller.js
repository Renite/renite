import { messageService } from '../services/message.service.js';
import { logAudit } from '../utils/audit.js';

export async function send(req, res, next) {
  try {
    const message = await messageService.send(req.params.conversationId, req.user.sub, req.user.role, req.body);
    logAudit(req, { action: 'MESSAGE_SENT', entityType: 'Message', entityId: message._id, metadata: { conversation_id: req.params.conversationId } });
    res.status(201).json({ success: true, data: message });
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const result = await messageService.list(req.params.conversationId, req.user.sub, req.user.role, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function editOwn(req, res, next) {
  try {
    const message = await messageService.editOwn(req.params.conversationId, req.params.messageId, req.user.sub, req.body.body);
    logAudit(req, { action: 'MESSAGE_EDITED', entityType: 'Message', entityId: message._id });
    res.status(200).json({ success: true, data: message });
  } catch (err) { next(err); }
}

export async function softDeleteOwn(req, res, next) {
  try {
    const result = await messageService.softDeleteOwn(req.params.conversationId, req.params.messageId, req.user.sub);
    logAudit(req, { action: 'MESSAGE_DELETED', entityType: 'Message', entityId: req.params.messageId });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
