import { Router } from 'express';
import { create, list, getById, update, updateStatus, remove } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', list);              // public: browse active lost/found reports
router.get('/:id', getById);        // public: view one report
router.post('/', authenticate, create);
router.patch('/:id', authenticate, update);
router.patch('/:id/status', authenticate, updateStatus);
router.delete('/:id', authenticate, remove);

export default router;
