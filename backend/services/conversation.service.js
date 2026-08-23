import { supabaseAdmin } from '../config/supabase.js';
import { toAppError } from '../utils/errors.js';

// conversations/messages are flat, shared tables (no participant column
// exists in the schema) -- this is currently shared/public chat, not
// private DMs. RLS already allows public read/insert on both, so this
// service mainly exists for the Socket.io layer and any server-side
// validation/audit hook, not to gate access.
export const conversationService = {
  async list() {
    const { data, error } = await supabaseAdmin
      .from('conversations').select('*').order('created_at', { ascending: false });
    if (error) throw toAppError(error);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('conversations').select('*').eq('id', id).maybeSingle();
    if (error) throw toAppError(error);
    return data;
  }
};
