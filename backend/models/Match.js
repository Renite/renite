import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  lost_report_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report', 
    required: true 
  },
  found_report_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report', 
    required: true 
  },
  score: { type: Number, default: 0 }, // AI / Rule confidence score
  source: { 
    type: String, 
    enum: ['RULE_BASED', 'AI_ASSISTED', 'MANUAL'], 
    default: 'RULE_BASED' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'], 
    default: 'PENDING' 
  },
  deleted_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Section 30: Query performance indexing
MatchSchema.index({ lost_report_id: 1 });
MatchSchema.index({ found_report_id: 1 });

export default mongoose.model('Match', MatchSchema);