import { conversationService } from '../services/conversation.service.js';

export async function list(req, res, next) {
  try {
    const conversations = await conversationService.list();
    res.status(200).json({ success: true, data: conversations });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const conversation = await conversationService.getById(req.params.id);
    res.status(200).json({ success: true, data: conversation });
  } catch (err) { next(err); }
}
