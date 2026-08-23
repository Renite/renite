import { messageService } from '../services/message.service.js';
import { logAudit } from '../utils/audit.js';

export async function send(req, res, next) {
  try {
    const senderLabel = req.user.full_name || req.user.email || req.user.id;
    const message = await messageService.send(req.params.conversationId, senderLabel, req.body.body);
    logAudit(req, { action: 'MESSAGE_SENT', description: `conversation=${req.params.conversationId}` });
    res.status(201).json({ success: true, data: message });
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const result = await messageService.list(req.params.conversationId, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
