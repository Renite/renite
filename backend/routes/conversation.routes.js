import { Router } from 'express';
import {
  getByRecoveryCase,
  createForRecoveryCase,
} from '../controllers/conversation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:id/conversation', authenticate, getByRecoveryCase);
router.post('/:id/conversation', authenticate, createForRecoveryCase);

export default router;
