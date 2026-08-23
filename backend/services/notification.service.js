import Notification from '../models/Notification.js';
import { AppError } from './auth.service.js';

export const notificationService = {
  // Internal — called by other services (message, recovery case, etc.),
  // never exposed as a public "create for anyone" endpoint.
  async create(userId, { type, title, message, data = {}, expires_at = null }) {
    return Notification.create({ user_id: userId, type, title, message, data, expires_at });
  },

  async listForUser(userId, { page = 1, limit = 20, unread } = {}) {
    const filter = { user_id: userId };
    if (unread === 'true' || unread === true) filter.read_at = null;

    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(filter),
    ]);
    return { notifications, total, page: Number(page), limit: Number(limit) };
  },

  async unreadCount(userId) {
    const count = await Notification.countDocuments({ user_id: userId, read_at: null });
    return { count };
  },

  async markRead(id, userId) {
    const notification = await Notification.findOne({ _id: id, user_id: userId });
    if (!notification) throw new AppError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
    if (!notification.read_at) {
      notification.read_at = new Date();
      await notification.save();
    }
    return notification;
  },

  async markAllRead(userId) {
    const result = await Notification.updateMany(
      { user_id: userId, read_at: null },
      { read_at: new Date() }
    );
    return { updated: result.modifiedCount };
  },
};
