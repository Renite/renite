import { Router } from 'express';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

// Example: police (and admin, via wildcard) can review verifications.
// Real verification logic comes with the Verification module later —
// this route just proves the permission gate works end-to-end.
router.get('/pending', authenticate, can('verification:review'), (req, res) => {
  res.status(200).json({ success: true, data: { message: 'Verification queue placeholder' } });
});

export default router;
