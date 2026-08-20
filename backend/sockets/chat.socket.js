import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { messageService, loadConversation, assertCanAccessConversation } from '../services/message.service.js';
import { logAudit } from '../utils/audit.js';

function roomName(conversationId) {
  return `conversation:${conversationId}`;
}

export function initSocket(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin || '*' },
  });

  // Authenticated handshake — same JWT used for REST, no separate socket auth scheme.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('NO_TOKEN'));
      socket.user = verifyAccessToken(token); // { sub, role }
      next();
    } catch {
      next(new Error('INVALID_TOKEN'));
    }
  });

  io.on('connection', (socket) => {
    const { sub: userId, role: userRole } = socket.user;

    // Client must explicitly join a conversation room before sending/
    // receiving — this is also where authorization is enforced, so a
    // socket can never listen in on a conversation it has no access to.
    socket.on('conversation:join', async (conversationId, ack) => {
      try {
        const conversation = await loadConversation(conversationId);
        await assertCanAccessConversation(conversation, userId, userRole);
        socket.join(roomName(conversationId));
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: err.code || 'ERROR', message: err.message });
      }
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(roomName(conversationId));
    });

    socket.on('message:send', async ({ conversationId, body, message_type }, ack) => {
      try {
        const message = await messageService.send(conversationId, userId, userRole, { body, message_type });
        io.to(roomName(conversationId)).emit('message:new', message);
        ack?.({ ok: true, data: message });
      } catch (err) {
        ack?.({ ok: false, error: err.code || 'ERROR', message: err.message });
      }
    });

    socket.on('message:edit', async ({ conversationId, messageId, body }, ack) => {
      try {
        const message = await messageService.editOwn(conversationId, messageId, userId, body);
        io.to(roomName(conversationId)).emit('message:edited', message);
        ack?.({ ok: true, data: message });
      } catch (err) {
        ack?.({ ok: false, error: err.code || 'ERROR', message: err.message });
      }
    });

    socket.on('message:delete', async ({ conversationId, messageId }, ack) => {
      try {
        await messageService.softDeleteOwn(conversationId, messageId, userId);
        io.to(roomName(conversationId)).emit('message:deleted', { messageId, conversationId });
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: err.code || 'ERROR', message: err.message });
      }
    });
  });

  return io;
}
