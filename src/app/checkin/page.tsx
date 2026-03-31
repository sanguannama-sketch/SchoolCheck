"use client";

import { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  nickname: string;
  class: string;
  number: number;
  gender: string;
  status: 'present' | 'absent' | 'late';
  avatarColor: string;
  iconColor: string;
}

const initialStudents: Student[] = [
  { id: 1, name: "ณัฐวุฒิ แสงดาว", nickname: "นัท", class: "ม.1/1", number: 1, gender: "male", status: "present", avatarColor: "#e3f2fd", iconColor: "#1976d2" },
  { id: 2, name: "ปราโมทย์ สุขใจ", nickname: "โอ๊ต", class: "ม.1/1", number: 2, gender: "male", status: "present", avatarColor: "#e8f5e9", iconColor: "#388e3c" },
  { id: 3, name: "สุภาพร รักดี", nickname: "แพร", class: "ม.1/1", number: 3, gender: "female", status: "present", avatarColor: "#fce4ec", iconColor: "#c62828" },
  { id: 4, name: "อนุชา วงศ์สกุล", nickname: "ชา", class: "ม.1/2", number: 4, gender: "male", status: "present", avatarColor: "#fff8e1", iconColor: "#f9a825" },
  { id: 5, name: "มินตรา จิตรดี", nickname: "มิน", class: "ม.1/2", number: 5, gender: "female", status: "present", avatarColor: "#f3e5f5", iconColor: "#7b1fa2" },
  { id: 6, name: "ธนากร พัฒนา", nickname: "ก้อง", class: "ม.2/1", number: 6, gender: "male", status: "present", avatarColor: "#e0f2f1", iconColor: "#00695c" },
  { id: 7, name: "พิมพ์ชนก วิไล", nickname: "พิมพ์", class: "ม.2/1", number: 7, gender: "female", status: "present", avatarColor: "#e8eaf6", iconColor: "#283593" },
  { id: 8, name: "กิตติพงษ์ ศรีสะอาด", nickname: "กิต", class: "ม.2/1", number: 8, gender: "male", status: "present", avatarColor: "#ffebee", iconColor: "#b71c1c" },
  { id: 9, name: "สมจริง จริงใจ", nickname: "จริง", class: "ม.2/1", number: 9, gender: "male", status: "present", avatarColor: "#e3f2fd", iconColor: "#1976d2" },
  { id: 10, name: "มาลี สวยมาก", nickname: "ลี", class: "ม.2/2", number: 10, gender: "female", status: "present", avatarColor: "#fce4ec", iconColor: "#c62828" },
  { id: 11, name: "สมชาย มาดแมน", nickname: "ชาย", class: "ม.2/2", number: 11, gender: "male", status: "present", avatarColor: "#fff8e1", iconColor: "#f9a825" },
  { id: 12, name: "ใจดี มีสุข", nickname: "ใจ", class: "ม.3/1", number: 12, gender: "female", status: "present", avatarColor: "#e8f5e9", iconColor: "#388e3c" },
];

export default function CheckinPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classFilter, setClassFilter] = useState('ม.1/1');
  const [isScanActive, setIsScanActive] = useState(false);
  const [allowedDistance, setAllowedDistance] = useState<number>(100);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Sync scan state based on selected class
  useEffect(() => {
    const checkState = () => {
      try {
        const savedRoomsStr = localStorage.getItem('activeScanRooms');
        if (savedRoomsStr) {
          const rooms = JSON.parse(savedRoomsStr);
          setIsScanActive(rooms.some((r: any) => (r.room || r) === classFilter));
        } else {
          // Check legacy single-room
          const legacyRoom = localStorage.getItem('activeScanRoom');
          setIsScanActive(legacyRoom === classFilter);
        }
      } catch (e) {
        setIsScanActive(false);
      }
    };
    
    checkState();
    
    // Listen to changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeScanRooms' || e.key === 'activeScanRoom') {
        checkState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [classFilter]);

  const toggleScan = () => {
    let currentRooms: any[] = [];
    try {
      const savedStr = localStorage.getItem('activeScanRooms');
      if (savedStr) {
        currentRooms = JSON.parse(savedStr);
      } else {
        const legacyRoom = localStorage.getItem('activeScanRoom');
        if (legacyRoom) currentRooms = [{ room: legacyRoom, lat: 0, lng: 0, radius: 0 }];
      }
    } catch (e) { }

    if (isScanActive) {
      // Remove room
      currentRooms = currentRooms.filter(r => (r.room || r) !== classFilter);
      setIsScanActive(false);
      
      if (currentRooms.length > 0) {
        localStorage.setItem('activeScanRooms', JSON.stringify(currentRooms));
      } else {
        localStorage.removeItem('activeScanRooms');
        localStorage.removeItem('activeScanRoom'); // Clear legacy just in case
      }
    } else {
      // Add room - requires GPS
      if (!navigator.geolocation) {
        alert("เบราว์เซอร์ของคุณไม่รองรับ GPS");
        return;
      }
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsGettingLocation(false);
          
          if (!currentRooms.some(r => (r.room || r) === classFilter)) {
            currentRooms.push({ 
              room: classFilter, 
              lat: latitude, 
              lng: longitude, 
              radius: allowedDistance 
            });
          }
          setIsScanActive(true);
          localStorage.setItem('activeScanRooms', JSON.stringify(currentRooms));
        },
        (error) => {
          setIsGettingLocation(false);
          alert("ไม่สามารถเข้าถึงตำแหน่งที่ตั้งได้ กรุณาอนุญาตให้ระบบเข้าถึง GPS เพื่อตั้งค่าจุดสแกน");
        },
        { enableHighAccuracy: true }
      );
    }
  };
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredStudents = students.filter(s => s.class === classFilter);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const totalPresent = filteredStudents.filter(s => s.status === 'present').length;
  const totalAbsent = filteredStudents.filter(s => s.status === 'absent').length;
  const totalLate = filteredStudents.filter(s => s.status === 'late').length;

  const classes = Array.from(new Set(students.map(s => s.class)));

  const handleStatusChange = (studentId: number, newStatus: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
  };
  
  const handleMarkAllPresent = () => {
    setStudents(prev => prev.map(s => {
      if (s.class === classFilter) {
        return { ...s, status: 'present' };
      }
      return s;
    }));
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

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out backwards" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            เช็คอินรายวัน
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ห้องเรียน {classFilter} ประจำวันที่มองเห็น</p>
        </div>
        <button className="btn-primary" style={{ boxShadow: '0 4px 15px rgba(27, 94, 32, 0.2)' }} onClick={handleMarkAllPresent}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          มาเรียนทั้งหมด
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>วันที่:</span>
            <input 
              type="date" 
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }} 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>ห้องเรียน:</span>
            <select 
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }} 
              value={classFilter} 
              onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>ระยะ (ม.):</span>
            <input 
              type="number" 
              style={{ width: '80px', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', fontFamily: 'inherit', color: 'var(--text-main)', fontWeight: 500 }} 
              value={allowedDistance} 
              onChange={(e) => setAllowedDistance(Number(e.target.value))}
              min={10}
              disabled={isScanActive}
            />
          </div>

          <button 
            onClick={toggleScan}
            disabled={isGettingLocation}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: isGettingLocation ? 'wait' : 'pointer', transition: 'all 0.2s', border: 'none',
              background: isScanActive ? 'var(--text-main)' : 'rgba(255,255,255,0.8)', 
              color: isScanActive ? 'white' : 'var(--text-main)',
              boxShadow: isScanActive ? '0 4px 12px rgba(27, 94, 32, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              borderBottom: isScanActive ? '2px solid #0a3a0e' : '2px solid rgba(0,0,0,0.05)',
              opacity: isGettingLocation ? 0.7 : 1
            }}
          >
            {isGettingLocation ? (
              <>กำลังเปิดระบบและปักหมุดรัศมี...</>
            ) : isScanActive ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                ปิดระบบรับสแกน
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8l4 4-4 4M8 12h7"></path></svg>
                เปิดสแกนห้องนี้
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #1b5e20' }}>
          <div>
            <div className="stat-title" style={{ fontSize: '0.85rem' }}>นักเรียนในห้อง</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#1b5e20' }}>{filteredStudents.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #2e7d32' }}>
          <div>
            <div className="stat-title" style={{ fontSize: '0.85rem' }}>มาเรียน</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#2e7d32' }}>{totalPresent} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #c62828' }}>
          <div>
            <div className="stat-title" style={{ fontSize: '0.85rem' }}>ขาดเรียน</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#c62828' }}>{totalAbsent} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #e65100' }}>
          <div>
            <div className="stat-title" style={{ fontSize: '0.85rem' }}>มาสาย</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#e65100' }}>{totalLate} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>คน</span></div>
          </div>
        </div>
      </div>

      {/* Checkin Table */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>เลขที่</th>
              <th>ชื่อ-นามสกุล</th>
              <th style={{ textAlign: 'center' }}>สถานะปัจจุบัน</th>
              <th style={{ textAlign: 'center', minWidth: '300px' }}>เช็คชื่อ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map(student => (
              <tr key={student.id} style={{ transition: 'background-color 0.2s', backgroundColor: student.status === 'present' ? 'transparent' : (student.status === 'absent' ? 'rgba(229, 115, 115, 0.05)' : 'rgba(255, 204, 0, 0.05)') }}>
                <td data-label="เลขที่" style={{ fontWeight: 600 }}>{student.number}</td>
                <td data-label="ชื่อ-นามสกุล">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: student.avatarColor, color: student.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0, border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.nickname}</div>
                    </div>
                  </div>
                </td>
                <td data-label="สถานะปัจจุบัน" style={{ textAlign: 'center' }}>{statusBadge(student.status)}</td>
                <td data-label="เช็คชื่อ" style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    
                    <button 
                      onClick={() => handleStatusChange(student.id, 'present')}
                      style={{ 
                        padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #81c784',
                        background: student.status === 'present' ? '#2e7d32' : 'white', 
                        color: student.status === 'present' ? 'white' : '#2e7d32' 
                      }}
                    >
                      มาเรียน
                    </button>
                    
                    <button 
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      style={{ 
                        padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e57373',
                        background: student.status === 'absent' ? '#d32f2f' : 'white', 
                        color: student.status === 'absent' ? 'white' : '#d32f2f' 
                      }}
                    >
                      ขาด
                    </button>
                    
                    <button 
                      onClick={() => handleStatusChange(student.id, 'late')}
                      style={{ 
                        padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #ffcc02',
                        background: student.status === 'late' ? '#f57f17' : 'white', 
                        color: student.status === 'late' ? 'white' : '#f57f17' 
                      }}
                    >
                      สาย
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
            <p>ไม่มีข้อมูลนักเรียนในห้องนี้</p>
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

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', boxShadow: '0 4px 15px rgba(27, 94, 32, 0.3)' }} onClick={() => alert('บันทึกข้อมูลการเช็คชื่อสำเร็จ!')}>
          บันทึกข้อมูลวันนี้
        </button>
      </div>

    </div>
  );
}
