import { Router } from 'express';
import { listUsers, updateRole, setActive, createStaff } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// All admin routes require a logged-in admin
router.use(authenticate, authorize('admin'));

router.get('/users', listUsers);
router.patch('/users/:id/role', updateRole);
router.patch('/users/:id/status', setActive);
router.post('/staff', createStaff);

export default router;
