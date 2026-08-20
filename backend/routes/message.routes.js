import { Router } from 'express';
import { send, list, editOwn, softDeleteOwn } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/:conversationId/messages', authenticate, send);
router.get('/:conversationId/messages', authenticate, list);
router.patch('/:conversationId/messages/:messageId', authenticate, editOwn);
router.delete('/:conversationId/messages/:messageId', authenticate, softDeleteOwn);

export default router;
