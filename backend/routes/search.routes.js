import { Router } from 'express';
import { searchReports } from '../controllers/search.controller.js';

const router = Router();

// Public — same visibility as report listing, just richer filtering
router.get('/reports', searchReports);

export default router;
