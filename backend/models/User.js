import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },

  // Fayda verification: bypassed for now, wired in later
  fayda_id: { type: String, unique: true, sparse: true, default: null },
  fayda_verified: { type: Boolean, default: false },

  role: { type: String, enum: ['user', 'admin', 'police'], default: 'user' },
  referral_code: { type: String, unique: true, sparse: true },
  referred_by: { type: String, default: null },
  loyalty_points: { type: Number, default: 0 },
  preferred_language: { type: String, default: 'en' },

  refresh_token: { type: String, default: null },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    full_name: this.full_name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    fayda_verified: this.fayda_verified,
    loyalty_points: this.loyalty_points,
    preferred_language: this.preferred_language
  };
};

export default mongoose.model('User', UserSchema);
