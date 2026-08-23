import { Router } from 'express';
import { create, getById, listPending, updateStatus } from '../controllers/verification.controller.js';
import { authenticate, can } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, can('verification:review'));

// Must come before /:id, or Express would treat "pending" as an :id value.
router.get('/pending', listPending);
router.post('/', create);
router.get('/:id', getById);
router.patch('/:id/status', updateStatus);

export default router;
