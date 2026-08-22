import mongoose from 'mongoose';

const RecoveryParticipantSchema = new mongoose.Schema({
  recovery_case_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RecoveryCase', 
    required: true 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['OWNER', 'FINDER', 'MODERATOR', 'ADMIN'], 
    required: true 
  },
  joined_at: { type: Date, default: Date.now }
}, { timestamps: false });

RecoveryParticipantSchema.index({ recovery_case_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('RecoveryParticipant', RecoveryParticipantSchema);
