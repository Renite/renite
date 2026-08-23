import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, can } from '../middleware/auth.middleware.js';
import { logAudit } from '../utils/audit.js';
import { toAppError } from '../utils/errors.js';

const router = Router();

// announcements RLS already lets the client insert/read directly with its
// own session (SELECT is public, INSERT checks profiles.role via auth.uid()),
// so the frontend is fine calling supabase.from('announcements') directly.
// This backend route exists for audit logging + admin dashboards that
// prefer going through the API.
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) throw toAppError(error);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', authenticate, can('announcement:create'), async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert([{ title, content, author_id: req.user.id }])
      .select()
      .single();
    if (error) throw toAppError(error);
    logAudit(req, { action: 'ANNOUNCEMENT_CREATED', description: `id=${data.id}` });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
