import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import connectDB from './config/db.js'; 

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

app.use(express.json());
app.use(cors());

connectDB();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Renite API & Database Models are operational',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});