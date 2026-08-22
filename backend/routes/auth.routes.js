import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
