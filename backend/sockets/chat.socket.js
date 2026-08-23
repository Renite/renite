import { Server } from 'socket.io';
import { supabaseAdmin } from '../config/supabase.js';
import { messageService } from '../services/message.service.js';

function roomName(conversationId) {
  return `conversation:${conversationId}`;
}

export function initSocket(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin || '*' },
  });

  // Authenticated handshake — verifies the same Supabase access token
  // used for REST, via supabase.auth.getUser(). No separate socket auth scheme.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('NO_TOKEN'));
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) return next(new Error('INVALID_TOKEN'));

      const { data: profile } = await supabaseAdmin
        .from('profiles').select('full_name, role, is_active').eq('id', user.id).maybeSingle();
      if (profile?.is_active === false) return next(new Error('ACCOUNT_DISABLED'));

      socket.user = { id: user.id, label: profile?.full_name || user.email, role: profile?.role || 'user' };
      next();
    } catch {
      next(new Error('INVALID_TOKEN'));
    }
  });

  io.on('connection', (socket) => {
    // conversations/messages are shared/public tables (no participant
    // column exists), so joining just subscribes to a room -- there is
    // no per-conversation authorization to enforce here.
    socket.on('conversation:join', (conversationId, ack) => {
      socket.join(roomName(conversationId));
      ack?.({ ok: true });
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(roomName(conversationId));
    });

    socket.on('message:send', async ({ conversationId, body }, ack) => {
      try {
        const message = await messageService.send(conversationId, socket.user.label, body);
        io.to(roomName(conversationId)).emit('message:new', message);
        ack?.({ ok: true, data: message });
      } catch (err) {
        ack?.({ ok: false, error: err.code || 'ERROR', message: err.message });
      }
    });
  });

  return io;
}
