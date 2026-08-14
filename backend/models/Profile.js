import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  display_name: { type: String },
  profile_image: { type: String }, 
  language: { type: String, default: 'en' },
  location: { type: String }, 
  bio: { type: String },
  deleted_at: { type: Date, default: null } 
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

ProfileSchema.index({ user_id: 1 });

export default mongoose.model('Profile', ProfileSchema);