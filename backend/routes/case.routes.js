import { Router } from 'express';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

// Real case data comes with the Recovery Case / Missing Person modules later.
// These stubs exist now so permission-gating is already correct and wired.
router.get('/', authenticate, can('case:read'), (req, res) => {
  res.status(200).json({ success: true, data: { message: 'Case list placeholder' } });
});

router.get('/:id', authenticate, can('case:read'), (req, res) => {
  res.status(200).json({ success: true, data: { message: `Case ${req.params.id} placeholder` } });
});

router.patch('/:id/close', authenticate, can('case:close'), (req, res) => {
  res.status(200).json({ success: true, data: { message: `Case ${req.params.id} closed (placeholder)` } });
});

export default router;
