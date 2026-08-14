import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fayda_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'police'], default: 'user' },
  referral_code: { type: String, unique: true },
  referred_by: { type: String, default: null },
  loyalty_points: { type: Number, default: 0 },
  preferred_language: { type: String, default: 'en' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);