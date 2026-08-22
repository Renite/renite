import { Router } from 'express';
import { create, getById, listForMatch, listPending, updateStatus, getContact } from '../controllers/verification.controller.js';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, create);

// Must come before /:id, or Express would treat "pending" as an :id value.
router.get('/pending', authenticate, can('verification:review'), listPending);

router.get('/match/:matchId/contact', authenticate, getContact);
router.get('/match/:matchId', authenticate, listForMatch);
router.get('/:id', authenticate, getById);

router.patch('/:id/status', authenticate, can('verification:review'), updateStatus);

export default router;
