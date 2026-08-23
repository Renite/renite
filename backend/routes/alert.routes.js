import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, can } from '../middleware/auth.middleware.js';
import { logAudit } from '../utils/audit.js';
import { toAppError } from '../utils/errors.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('broadcasts').select('*').order('created_at', { ascending: false });
    if (error) throw toAppError(error);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', authenticate, can('alert:issue'), async (req, res, next) => {
  try {
    const { title, message, priority } = req.body;
    const { data, error } = await supabaseAdmin
      .from('broadcasts')
      .insert([{
        title, message, priority: priority ?? 'normal',
        issuer_name: req.user.email, badge_number: req.user.badge_number
      }])
      .select()
      .single();
    if (error) throw toAppError(error);
    logAudit(req, { action: 'ALERT_ISSUED', description: `id=${data.id} priority=${data.priority}` });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
