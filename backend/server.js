require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// อนุญาตให้เรียก API ข้ามโดเมนได้ (CORS) และตั้งค่ารับข้อมูล JSON ขนาดใหญ่ (สำหรับเก็บข้อมูลใบหน้า)
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// นำเข้าโมเดล
const Student = require('./models/Student');

// API ทดสอบการทำงาน
app.get('/', (req, res) => {
  res.send('SchoolCheck API is running...');
});

// === Students APIs ===

// ข้อมูลตั้งต้น
const initialStudents = [
  { id: 1, name: "ณัฐวุฒิ แสงดาว", nickname: "นัท", class: "ม.1/1", number: 1, gender: "male", status: "present", avatarColor: "#e3f2fd", iconColor: "#1976d2" },
  { id: 2, name: "ปราโมทย์ สุขใจ", nickname: "โอ๊ต", class: "ม.1/1", number: 2, gender: "male", status: "present", avatarColor: "#e8f5e9", iconColor: "#388e3c" },
  { id: 3, name: "สุภาพร รักดี", nickname: "แพร", class: "ม.1/1", number: 3, gender: "female", status: "absent", avatarColor: "#fce4ec", iconColor: "#c62828" },
  { id: 4, name: "อนุชา วงศ์สกุล", nickname: "ชา", class: "ม.1/2", number: 4, gender: "male", status: "late", avatarColor: "#fff8e1", iconColor: "#f9a825" },
  { id: 5, name: "มินตรา จิตรดี", nickname: "มิน", class: "ม.1/2", number: 5, gender: "female", status: "present", avatarColor: "#f3e5f5", iconColor: "#7b1fa2" },
  { id: 6, name: "ธนากร พัฒนา", nickname: "ก้อง", class: "ม.2/1", number: 6, gender: "male", status: "present", avatarColor: "#e0f2f1", iconColor: "#00695c" },
  { id: 7, name: "พิมพ์ชนก วิไล", nickname: "พิมพ์", class: "ม.2/1", number: 7, gender: "female", status: "present", avatarColor: "#e8eaf6", iconColor: "#283593" },
  { id: 8, name: "กิตติพงษ์ ศรีสะอาด", nickname: "กิต", class: "ม.2/1", number: 8, gender: "male", status: "absent", avatarColor: "#ffebee", iconColor: "#b71c1c" },
  { id: 9, name: "สมจริง จริงใจ", nickname: "จริง", class: "ม.2/1", number: 9, gender: "male", status: "present", avatarColor: "#e3f2fd", iconColor: "#1976d2" },
  { id: 10, name: "มาลี สวยมาก", nickname: "ลี", class: "ม.2/2", number: 10, gender: "female", status: "present", avatarColor: "#fce4ec", iconColor: "#c62828" },
  { id: 11, name: "สมชาย มาดแมน", nickname: "ชาย", class: "ม.2/2", number: 11, gender: "male", status: "late", avatarColor: "#fff8e1", iconColor: "#f9a825" },
  { id: 12, name: "ใจดี มีสุข", nickname: "ใจ", class: "ม.3/1", number: 12, gender: "female", status: "present", avatarColor: "#e8f5e9", iconColor: "#388e3c" },
];

// GET: ดึงนักเรียนทั้งหมด
app.get('/api/students', async (req, res) => {
  try {
    let students = await Student.find().sort({ class: 1, number: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: เพิ่มนักเรียนใหม่
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: อัปเดตข้อมูลนักเรียนทั่วไป
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: ลบนักเรียน
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: เซฟใบหน้า (Face Registration)
app.put('/api/students/:id/face', async (req, res) => {
  try {
    const { descriptor } = req.body;
    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id }, 
      { faceDescriptor: descriptor }, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// === Attendance APIs ===
const Attendance = require('./models/Attendance');

// POST: บันทึกการเช็คชื่อ (สร้างหรืออัปเดตถ้ามีแล้ว)
app.post('/api/attendance', async (req, res) => {
  try {
    const { date, studentId, studentName, class: cls, status, checkinTime, method } = req.body;
    
    // upsert: ถ้ามีแล้ว → อัปเดต, ถ้าไม่มี → สร้างใหม่
    const record = await Attendance.findOneAndUpdate(
      { date, studentId },
      { date, studentId, studentName, class: cls, status, checkinTime, method },
      { new: true, upsert: true }
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: ดึงประวัติตามวันที่ (เช่น /api/attendance?date=2026-05-15&class=ม.1/1)
app.get('/api/attendance', async (req, res) => {
  try {
    const { date, class: cls } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (cls) filter.class = cls;
    
    const records = await Attendance.find(filter).sort({ checkinTime: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: ดึงประวัติรายนักเรียน (เช่น /api/attendance/student/5)
app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId })
      .sort({ date: -1 })
      .limit(30); // แสดงย้อนหลัง 30 วัน
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: สรุปสถิติตามช่วงวันที่ (เช่น /api/attendance/summary?startDate=2026-05-01&endDate=2026-05-15)
app.get('/api/attendance/summary', async (req, res) => {
  try {
    const { startDate, endDate, class: cls } = req.query;
    const filter = {};
    if (startDate && endDate) filter.date = { $gte: startDate, $lte: endDate };
    if (cls) filter.class = cls;

    const records = await Attendance.find(filter);

    // จัดกลุ่มตามวันที่
    const summary = {};
    records.forEach(r => {
      if (!summary[r.date]) summary[r.date] = { date: r.date, present: 0, absent: 0, late: 0, total: 0 };
      summary[r.date][r.status]++;
      summary[r.date].total++;
    });

    res.json(Object.values(summary).sort((a, b) => b.date.localeCompare(a.date)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
