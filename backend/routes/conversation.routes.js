import { Router } from 'express';
import { list, getById } from '../controllers/conversation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, list);
router.get('/:id', authenticate, getById);

export default router;
