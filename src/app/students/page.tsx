"use client";

import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  nickname: string;
  class: string;
  number: number;
  gender: string;
  status: string;
  avatarColor: string;
  iconColor: string;
}

const avatarColors = [
  { bg: '#e3f2fd', color: '#1976d2' },
  { bg: '#e8f5e9', color: '#388e3c' },
  { bg: '#fce4ec', color: '#c62828' },
  { bg: '#fff8e1', color: '#f9a825' },
  { bg: '#f3e5f5', color: '#7b1fa2' },
  { bg: '#e0f2f1', color: '#00695c' },
  { bg: '#e8eaf6', color: '#283593' },
  { bg: '#fff3e0', color: '#e65100' },
];

const initialStudents: Student[] = [
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', nickname: '', class: 'ม.1/1', gender: 'male' });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.nickname.includes(searchTerm);
    const matchesClass = classFilter === 'all' || s.class === classFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const totalPresent = students.filter(s => s.status === 'present').length;
  const totalAbsent = students.filter(s => s.status === 'absent').length;
  const totalLate = students.filter(s => s.status === 'late').length;

  const handleAddStudent = () => {
    if (!formData.name.trim()) return;
    const randomColor = avatarColors[students.length % avatarColors.length];
    const newStudent: Student = {
      id: students.length + 1,
      name: formData.name,
      nickname: formData.nickname || formData.name.charAt(0),
      class: formData.class,
      number: students.length + 1,
      gender: formData.gender,
      status: 'present',
      avatarColor: randomColor.bg,
      iconColor: randomColor.color,
    };
    setStudents([...students, newStudent]);
    setFormData({ name: '', nickname: '', class: 'ม.1/1', gender: 'male' });
    setShowModal(false);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
      present: { label: 'มาเรียน', bg: '#e8f5e9', color: '#2e7d32', border: '#81c784' },
      absent: { label: 'ขาดเรียน', bg: '#ffebee', color: '#c62828', border: '#e57373' },
      late: { label: 'มาสาย', bg: '#fff8e1', color: '#e65100', border: '#ffcc02' },
    };
    const s = map[status] || map.present;
    return (
      <span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500, background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: 'inline-block' }}>
        {s.label}
      </span>
    );
  };

  const classes = Array.from(new Set(students.map(s => s.class)));

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out backwards" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            จัดการนักเรียน
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', background: 'rgba(76,175,80,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', marginLeft: '0.5rem' }}>{students.length} คน</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ข้อมูลนักเรียนทั้งหมดในระบบ SchoolCheck</p>
        </div>
        <button className="btn-primary" style={{ boxShadow: '0 4px 15px rgba(27, 94, 32, 0.2)' }} onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          เพิ่มนักเรียนใหม่
        </button>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b5e20' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>นักเรียนทั้งหมด</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{students.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 199, 132, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>มาเรียนวันนี้</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{totalPresent} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 83, 80, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c62828' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>ขาดเรียน</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{totalAbsent} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 152, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e65100' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>มาสาย</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{totalLate} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap', minWidth: '200px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px', minWidth: '180px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ ชื่อเล่น..." 
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit' }} 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <select 
            style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }} 
            value={classFilter} 
            onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">ห้องเรียนทั้งหมด</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }} 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="present">มาเรียน</option>
            <option value="absent">ขาดเรียน</option>
            <option value="late">มาสาย</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>ชื่อ-นามสกุล</th>
              <th>ห้อง</th>
              <th>สถานะวันนี้</th>
              <th style={{ textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map(student => (
              <tr key={student.id}>
                <td data-label="เลขที่" style={{ fontWeight: 600 }}>{student.number}</td>
                <td data-label="ชื่อ-นามสกุล">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: student.avatarColor, color: student.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0, border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ชื่อเล่น: {student.nickname}</div>
                    </div>
                  </div>
                </td>
                <td data-label="ห้อง">
                  <span style={{ background: 'rgba(76,175,80,0.08)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem' }}>{student.class}</span>
                </td>
                <td data-label="สถานะวันนี้">{statusBadge(student.status)}</td>
                <td data-label="จัดการ" style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                    <button className="btn-icon" aria-label="View" title="ดูรายละเอียด" style={{ padding: '0.35rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="btn-icon" aria-label="Edit" title="แก้ไข" style={{ padding: '0.35rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                    </button>
                    <button className="btn-icon" aria-label="Delete" title="ลบ" style={{ color: '#e57373', padding: '0.35rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedStudents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p>ไม่พบข้อมูลนักเรียนตามคำค้นหา</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            แสดง {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredStudents.length)} จาก {filteredStudents.length} รายการ
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                onClick={() => setCurrentPage(p)}
                style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, 
                  background: p === currentPage ? 'var(--text-main)' : 'rgba(255,255,255,0.6)', 
                  color: p === currentPage ? 'white' : 'var(--text-main)', 
                  boxShadow: p === currentPage ? '0 4px 12px rgba(27, 94, 32, 0.2)' : 'none', 
                  transition: 'all 0.2s' 
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== ADD STUDENT MODAL ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>เพิ่มนักเรียนใหม่</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">ชื่อ-นามสกุล <span style={{ color: '#ef5350' }}>*</span></label>
                <input className="form-input" type="text" placeholder="กรอกชื่อ-นามสกุล" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">ชื่อเล่น</label>
                <input className="form-input" type="text" placeholder="กรอกชื่อเล่น" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ห้องเรียน</label>
                  <select className="form-select" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}>
                    <option value="ม.1/1">ม.1/1</option>
                    <option value="ม.1/2">ม.1/2</option>
                    <option value="ม.2/1">ม.2/1</option>
                    <option value="ม.2/2">ม.2/2</option>
                    <option value="ม.3/1">ม.3/1</option>
                    <option value="ม.3/2">ม.3/2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">เพศ</label>
                  <select className="form-select" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
              <button className="btn-primary" onClick={handleAddStudent} disabled={!formData.name.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
