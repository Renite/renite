import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  category_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  deleted_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

MaterialSchema.index({ category_id: 1 });

export default mongoose.model('Material', MaterialSchema);
