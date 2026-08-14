import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversation_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  sender_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true },
  message_type: { type: String, enum: ['TEXT', 'IMAGE', 'SYSTEM'], default: 'TEXT' },
  edited_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

MessageSchema.index({ conversation_id: 1, created_at: 1 });

export default mongoose.model('Message', MessageSchema);