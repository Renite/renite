import User from '../models/User.js';
import { AppError } from './auth.service.js';

const VALID_ROLES = ['user', 'admin', 'police'];

export const adminService = {
  async listUsers({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().select('-password_hash -refresh_token').skip(skip).limit(limit),
      User.countDocuments()
    ]);
    return { users, total, page: Number(page), limit: Number(limit) };
  },

  async updateRole(userId, role) {
    if (!VALID_ROLES.includes(role)) {
      throw new AppError(400, 'INVALID_ROLE', `Role must be one of: ${VALID_ROLES.join(', ')}`);
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    return user.toSafeJSON();
  },

  async setActive(userId, is_active) {
    const user = await User.findByIdAndUpdate(userId, { is_active }, { new: true });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    return user.toSafeJSON();
  }
};
