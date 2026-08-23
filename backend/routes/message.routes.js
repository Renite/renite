import { Router } from 'express';
import { send, list } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/:conversationId/messages', authenticate, send);
router.get('/:conversationId/messages', authenticate, list);

export default router;
