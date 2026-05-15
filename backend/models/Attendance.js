const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { 
    type: String,  // เก็บเป็น "YYYY-MM-DD" เช่น "2026-05-15"
    required: true,
    index: true 
  },
  studentId: { type: Number, required: true },
  studentName: { type: String, required: true },
  class: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late'], 
    required: true 
  },
  checkinTime: { type: String }, // เวลาที่เช็คชื่อ เช่น "08:30:22"
  method: { 
    type: String, 
    enum: ['face', 'manual'],  // face = สแกนใบหน้า, manual = ครูกดเอง
    default: 'manual'
  }
}, { timestamps: true });

// Unique constraint: นักเรียน 1 คน เช็คได้ 1 ครั้งต่อวัน
attendanceSchema.index({ date: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
