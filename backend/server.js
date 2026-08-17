import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; 
import connectDB from './config/db.js'; 
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import caseRoutes from './routes/case.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import alertRoutes from './routes/alert.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

import './models/User.js';
import './models/Profile.js';
import './models/Category.js';
import './models/Material.js';
import './models/Report.js';
import './models/MissingPerson.js';
import './models/Match.js';
import './models/Verification.js';
import './models/RecoveryCase.js';
import './models/RecoveryParticipant.js';
import './models/Conversation.js';
import './models/Message.js';
import './models/Notification.js';
import './models/AuditLog.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(apiLimiter);

connectDB();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Renite API & Database Models are operational',
    timestamp: new Date()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/verification', verificationRoutes);
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/alerts', alertRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});