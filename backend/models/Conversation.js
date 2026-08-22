import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  recovery_case_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RecoveryCase', 
    required: true 
  },
  status: { type: String, enum: ['ACTIVE', 'CLOSED', 'ARCHIVED'], default: 'ACTIVE' },
  deleted_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Conversation', ConversationSchema);
