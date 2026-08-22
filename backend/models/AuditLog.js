import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  action: { type: String, required: true }, // e.g., 'LOGIN', 'REPORT_CREATED', 'MATCH_ACCEPTED'
  entity_type: { type: String, required: true }, // e.g., 'Report', 'User'
  entity_id: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: Object, default: {} },
  ip_address: { type: String },
  user_agent: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

AuditLogSchema.index({ user_id: 1 });
AuditLogSchema.index({ action: 1 });

export default mongoose.model('AuditLog', AuditLogSchema);
