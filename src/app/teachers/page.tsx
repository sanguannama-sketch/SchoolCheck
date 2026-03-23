"use client";

import { useState } from 'react';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const teachers = [
    { id: 1, name: "สมหมาย ใจดี", subject: "คณิตศาสตร์", phone: "081-234-5678", role: "ครูประจำชั้น ม.2/1", status: "active", avatarColor: "#e8f5e9", iconColor: "#4caf50" },
    { id: 2, name: "สมหญิง รักเรียน", subject: "วิทยาศาสตร์", phone: "089-876-5432", role: "หัวหน้าระดับ ม.ต้น", status: "active", avatarColor: "#e3f2fd", iconColor: "#2196f3" },
    { id: 3, name: "วิชัย เก่งการ", subject: "ภาษาอังกฤษ", phone: "082-345-6789", role: "ครูประจำวิชา", status: "inactive", avatarColor: "#ffebee", iconColor: "#f44336" },
    { id: 4, name: "พรทิพย์ ยิ้มแย้ม", subject: "ภาษาไทย", phone: "086-555-4433", role: "ครูประจำชั้น ม.1/2", status: "active", avatarColor: "#fff3e0", iconColor: "#ff9800" },
    { id: 5, name: "จิราพร แสงทอง", subject: "สังคมศึกษา", phone: "084-111-2222", role: "ครูประจำวิชา", status: "active", avatarColor: "#f3e5f5", iconColor: "#9c27b0" },
  ];

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.includes(searchTerm) || t.subject.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out backwards" }}>
      
      {/* Header Section */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>จัดการครูผู้สอน <span style={{fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', background: 'rgba(76, 175, 80, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', marginLeft: '0.5rem'}}>{teachers.length} คน</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>รายชื่อและข้อมูลติดต่อของคุณครูทั้งหมดในระบบ</p>
        </div>
        <button className="btn-primary" style={{ boxShadow: '0 4px 15px rgba(27, 94, 32, 0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          เพิ่มคุณครูใหม่
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b5e20' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>คุณครูทั้งหมด</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>5 <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500}}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 199, 132, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>กำลังปฏิบัติราชการ</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>4 <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500}}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 83, 80, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c62828' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>งดสอน / ลา</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>1 <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500}}>คน</span></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ วิชาที่สอน..." 
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">กำลังปฏิบัติงาน</option>
            <option value="inactive">งดสอน / ลา</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-icon" style={{ background: 'white', borderRadius: '8px', padding: '0.4rem 0.6rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }} title="มุมมองตาราง">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <button className="btn-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#1b5e20', borderRadius: '8px', padding: '0.4rem 0.6rem' }} title="มุมมองการ์ด">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
        </div>
      </div>

      {/* Teachers Grid (Modern Approach) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="glass teacher-profile-card">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: teacher.avatarColor, color: teacher.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, border: `2px solid white`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.1rem' }}>{teacher.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{teacher.role}</p>
                </div>
              </div>
              <button className="btn-icon" style={{ padding: '0.2rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.4)', padding: '1rem', borderRadius: '12px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                 </div>
                 <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{teacher.subject}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                 </div>
                 <span style={{ color: 'var(--text-muted)' }}>{teacher.phone}</span>
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
              <span className={`badge ${teacher.status}`}>
                 {teacher.status === 'active' ? 'กำลังปฏิบัติงาน' : 'งดสอน / ลา'}
              </span>
              <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}>ดูรายละเอียด</button>
            </div>
            
          </div>
        ))}
        {filteredTeachers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p>ไม่พบข้อมูลคุณครูคำค้นหานี้</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .teacher-profile-card {
          padding: 1.5rem;
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s;
        }
        .teacher-profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(76, 175, 80, 0.15);
        }
      `}</style>

    </div>
  );
}
