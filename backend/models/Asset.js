import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  name: { type: String, required: true },
  category: { type: String, required: true },
  serial: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['REGISTERED', 'LOST', 'RECOVERED'], 
    default: 'REGISTERED' 
  },
  date: { type: String, required: true },
  description: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

AssetSchema.index({ serial: 1 });

export default mongoose.model('Asset', AssetSchema);