import { Router } from 'express';
import { open, getById, getByMatch, updateStatus } from '../controllers/recoveryCase.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, open);
router.get('/:id', authenticate, getById);
router.get('/match/:matchId', authenticate, getByMatch);
router.patch('/:id/status', authenticate, updateStatus);

export default router;
