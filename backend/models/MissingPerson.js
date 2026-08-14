import mongoose from 'mongoose';

const MissingPersonSchema = new mongoose.Schema({
  reporter_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  full_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['MALE', 'FEMALE', 'OTHER'] 
  },
  description: { 
    type: String,
    trim: true 
  },
  
  id_face_photo_url: { 
    type: String, 
    required: true 
  },
  live_face_photo_url: { 
    type: String, 
    default: null 
  },
  biometric_match_score: { 
    type: Number, 
    default: 0 
  },

  last_seen_date: { 
    type: Date, 
    required: true 
  },
  
  last_known_location: {
    address: { type: String },
    city: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number }
  },

  police_notified: { 
    type: Boolean, 
    default: false 
  },
  
  status: { 
    type: String, 
    enum: ['MISSING', 'LOCATED', 'RESOLVED', 'CLOSED'], 
    default: 'MISSING' 
  },

  deleted_at: { 
    type: Date, 
    default: null 
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

MissingPersonSchema.index({ reporter_id: 1 });
MissingPersonSchema.index({ status: 1 });
MissingPersonSchema.index({ 'last_known_location.city': 1 });
MissingPersonSchema.index({ created_at: -1 });

export default mongoose.model('MissingPerson', MissingPersonSchema);