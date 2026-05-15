const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { 
    type: String,
    required: true,
    index: true 
  },
  studentId: { type: Number, required: true },
  studentName: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late'], 
    required: true 
  },
  checkinTime: { type: String },
  method: { 
    type: String, 
    enum: ['face', 'manual', 'auto'],
    default: 'manual'
  }
}, { timestamps: true });

// Unique constraint: นักเรียน 1 คน เช็คได้ 1 ครั้งต่อวัน
attendanceSchema.index({ date: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
