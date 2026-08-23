import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initSocket } from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer, process.env.CORS_ORIGIN);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Socket.io attached`);
  console.log(`🗄️  Backed by Supabase: ${process.env.SUPABASE_URL || '(not configured)'}`);
});
