import { Router } from 'express';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, can('announcement:create'), (req, res) => {
  res.status(201).json({ success: true, data: { message: 'Announcement created (placeholder)' } });
});

export default router;
