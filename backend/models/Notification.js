import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true 
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: {}
  },
  read_at: {
    type: Date,
    default: null
  },
  expires_at: {
    type: Date,
    default: null
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

NotificationSchema.index({ user_id: 1, read_at: 1 });
NotificationSchema.index({ created_at: -1 });

export default mongoose.model('Notification', NotificationSchema);