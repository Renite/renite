import { notificationService } from '../services/notification.service.js';

export async function list(req, res, next) {
  try {
    const result = await notificationService.listForUser(req.user.sub, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function unreadCount(req, res, next) {
  try {
    const result = await notificationService.unreadCount(req.user.sub);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markRead(req.params.id, req.user.sub);
    res.status(200).json({ success: true, data: notification });
  } catch (err) { next(err); }
}

export async function markAllRead(req, res, next) {
  try {
    const result = await notificationService.markAllRead(req.user.sub);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
