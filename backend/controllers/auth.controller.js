import { authService } from '../services/auth.service.js';
import { logAudit } from '../utils/audit.js';

export async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'full_name, email, phone, password are required' }
      });
    }
    const result = await authService.register({ full_name, email, phone, password });
    logAudit(req, {
      action: 'REGISTER',
      entityType: 'User',
      entityId: result.user.id,
      userId: result.user.id
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'identifier (email or phone) and password are required' }
      });
    }
    const result = await authService.login({ identifier, password });
    logAudit(req, {
      action: 'LOGIN',
      entityType: 'User',
      entityId: result.user.id,
      userId: result.user.id
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.user.sub);
    logAudit(req, { action: 'LOGOUT', entityType: 'User', entityId: req.user.sub });
    res.status(200).json({ success: true, data: { loggedOut: true } });
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.sub);
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
}
