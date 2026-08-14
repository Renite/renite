import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
  match_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Match', 
    required: true 
  },
  initiated_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  method: { 
    type: String, 
    enum: ['MANUAL', 'IMAGE', 'SERIAL_NUMBER', 'OWNERSHIP_PROOF', 'ADMIN_REVIEW'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
    default: 'PENDING' 
  },
  evidence_reference: { type: String }, 
  notes: { type: String },
  verified_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

VerificationSchema.index({ match_id: 1 });

export default mongoose.model('Verification', VerificationSchema);
