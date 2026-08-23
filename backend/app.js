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

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
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
