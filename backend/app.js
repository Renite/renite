import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { requestId } from "./middleware/request-id.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import reportRoutes from "./routes/report.routes.js";
import searchRoutes from "./routes/search.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import caseRoutes from "./routes/case.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

// CORS_ORIGIN was documented in .env.example but never actually wired up --
// cors() with no options just reflects any origin back, which happens to
// work for Bearer-token requests (no cookies involved) but silently
// ignores the env var and won't restrict anything in production. Supports
// a comma-separated list since renite-app and renite-admin are two
// separate origins hitting this same backend.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    // Allow no-origin requests (curl, server-to-server, mobile webviews)
    // and anything in the allow-list.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin ${origin} is not allowed`));
  },
  credentials: true,
}));
app.use(apiLimiter);
app.use(requestId);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Renite API is operational (Supabase-backed)",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/verification", verificationRoutes);
app.use("/api/v1/cases", caseRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/conversations", messageRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
