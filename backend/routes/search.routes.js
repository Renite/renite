import { Router } from 'express';
import { search } from '../controllers/search.controller.js';

const router = Router();

// Public — same visibility as the underlying tables' own public read policies.
router.get('/', search);

export default router;
