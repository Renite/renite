import { Router } from 'express';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, can('alert:issue'), (req, res) => {
  res.status(201).json({ success: true, data: { message: 'Alert issued (placeholder)' } });
});

export default router;
