import { Router } from 'express';
import { generate, listForReport, getById, updateStatus } from '../controllers/match.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/generate/:reportId', authenticate, generate);
router.get('/report/:reportId', authenticate, listForReport);
router.get('/:id', authenticate, getById);
router.patch('/:id/status', authenticate, updateStatus);

export default router;
