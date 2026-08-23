import { supabaseAdmin } from '../config/supabase.js';
import { AppError, toAppError } from '../utils/errors.js';

export const messageService = {
  async send(conversationId, senderLabel, body) {
    if (!body || !body.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'body is required');
    }
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{ conversation_id: conversationId, sender: senderLabel, content: body.trim() }])
      .select()
      .single();
    if (error) throw toAppError(error);
    return data;
  },

  async list(conversationId, { page = 1, limit = 30 } = {}) {
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    const { data, error, count } = await supabaseAdmin
      .from('messages').select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(from, to);
    if (error) throw toAppError(error);
    return { messages: data, total: count, page: Number(page), limit: Number(limit) };
  }
};
