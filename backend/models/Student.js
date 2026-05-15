const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Keeping custom ID for now
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  class: { type: String, required: true },
  number: { type: Number, required: true },
  gender: { type: String, required: true },
  status: { type: String, default: 'present' },
  avatarColor: { type: String },
  iconColor: { type: String },
  // 🔴 Here we store the face descriptor array so the AI can use it later
  faceDescriptor: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
