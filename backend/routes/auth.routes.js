import { Router } from 'express';
import { completeProfile, me, lookupEmail } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Login/signup themselves stay client-side via supabase.auth.* --
// this backend only handles what Supabase Auth doesn't: profile
// completion (with role locked server-side) and the email lookup
// login needs now that `profiles` isn't publicly readable.
router.post('/lookup-email', authLimiter, lookupEmail);
router.post('/complete-profile', authenticate, completeProfile);
router.get('/me', authenticate, me);

export default router;
