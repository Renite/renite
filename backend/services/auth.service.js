import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function issueTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refresh_token = refreshToken;
  await user.save();
  return { user: user.toSafeJSON(), accessToken, refreshToken };
}

export const authService = {
  async register({ full_name, email, phone, password }) {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) throw new AppError(409, 'ALREADY_REGISTERED', 'Email or phone already in use');

    const password_hash = await hashPassword(password);
    const user = await User.create({ full_name, email, phone, password_hash });
    return issueTokens(user);
  },

  async login({ identifier, password }) {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');

    return issueTokens(user);
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new AppError(401, 'NO_TOKEN', 'Refresh token required');

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    const user = await User.findById(payload.sub);
    if (!user || user.refresh_token !== refreshToken) {
      throw new AppError(401, 'INVALID_TOKEN', 'Refresh token mismatch');
    }
    return issueTokens(user);
  },

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refresh_token: null });
  },

  async me(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    return user.toSafeJSON();
  }
};

export { AppError };
