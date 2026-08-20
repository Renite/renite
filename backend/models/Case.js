import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  time: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const caseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  title: { type: String, required: true },
  status: { type: String, default: 'IN_PROGRESS' },
  assignedTo: { type: String, default: 'Central Command' },
  updates: [updateSchema]
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);