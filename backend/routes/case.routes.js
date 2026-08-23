import { Router } from 'express';
import { list, getById, updateStatus } from '../controllers/case.controller.js';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, can('case:read'), list);
router.get('/:id', authenticate, can('case:read'), getById);
router.patch('/:id/status', authenticate, can('case:close'), updateStatus);

export default router;
