import mongoose from 'mongoose';

const RecoveryCaseSchema = new mongoose.Schema({
  match_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Match', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'HANDOFF_PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED'], 
    default: 'OPEN' 
  },
  opened_at: { type: Date, default: Date.now },
  completed_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('RecoveryCase', RecoveryCaseSchema);
