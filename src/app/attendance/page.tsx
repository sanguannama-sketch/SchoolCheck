"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

interface AttendanceRecord {
  _id: string;
  date: string;
  studentId: number;
  studentName: string;
  class: string;
  status: 'present' | 'absent' | 'late';
  checkinTime: string;
  method: 'face' | 'manual';
}

const API_URL = 'http://localhost:5000/api/attendance';

export default function AttendancePage() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        const unique = Array.from(new Set<string>(data.map((s: any) => s.class))).sort();
        setClasses(unique);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isClient) fetchAttendance();
  }, [isClient, selectedDate, selectedClass]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}?date=${selectedDate}`;
      if (selectedClass !== 'all') url += `&class=${encodeURIComponent(selectedClass)}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาเปิด Server ก่อน', 'error');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPresent = records.filter(r => r.status === 'present').length;
  const totalLate    = records.filter(r => r.status === 'late').length;
  const totalAbsent  = records.filter(r => r.status === 'absent').length;

  const statusInfo: Record<string, { label: string; bg: string; color: string; border: string; icon: string }> = {
    present: { label: 'มาเรียน',  bg: '#e8f5e9', color: '#2e7d32', border: '#81c784', icon: '✓' },
    absent:  { label: 'ขาดเรียน', bg: '#ffebee', color: '#c62828', border: '#e57373', icon: '✗' },
    late:    { label: 'มาสาย',   bg: '#fff8e1', color: '#e65100', border: '#ffcc02', icon: '⏰' },
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!isClient) return null;

  return (
    <div style={{ animation: 'fadeUp 0.6s ease-out backwards' }}>
      <style>{`
        .att-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .att-filter-item { display: flex; align-items: center; gap: 0.4rem; flex: 1; min-width: 160px; }
        .att-filter-item input, .att-filter-item select {
          flex: 1; padding: 0.45rem 0.7rem; border-radius: 10px;
          border: 1px solid rgba(76,175,80,0.3);
          background: var(--bg-card); color: var(--text-main);
          font-size: 0.88rem; cursor: pointer; width: 100%;
        }
        .att-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        .att-stat-card { padding: 1rem; border-radius: 16px; text-align: center; }
        .att-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 20px; }
        /* Mobile card list replaces table on small screens */
        .att-card-list { display: none; }
        .att-table-el { display: table; }
        @media (max-width: 640px) {
          .att-card-list { display: flex; flex-direction: column; gap: 0.6rem; }
          .att-table-el { display: none; }
          .att-filter-item { min-width: 100%; }
          .att-stats { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
          .att-stat-card { padding: 0.75rem 0.5rem; }
          .att-stat-num { font-size: 1.5rem !important; }
          .att-stat-label { font-size: 0.72rem !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            ประวัติการเช็คชื่อ
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', background: 'rgba(76,175,80,0.12)', padding: '0.15rem 0.55rem', borderRadius: '10px' }}>
              {records.length} รายการ
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(selectedDate)}</p>
        </div>
        <button className="btn-primary" onClick={fetchAttendance} style={{ boxShadow: '0 4px 15px rgba(27,94,32,0.2)', padding: '0.55rem 1rem', fontSize: '0.88rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          รีเฟรช
        </button>
      </div>

      {/* Filters */}
      <div className="glass att-filters" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
        <div className="att-filter-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>วันที่</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="att-filter-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>ห้องเรียน</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="all">ทุกห้อง</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="att-stats">
        {([
          { key: 'present', count: totalPresent },
          { key: 'late',    count: totalLate    },
          { key: 'absent',  count: totalAbsent  },
        ] as const).map(({ key, count }) => {
          const s = statusInfo[key];
          return (
            <div key={key} className="glass att-stat-card" style={{ background: s.bg.replace(')', ',0.7)').replace('rgb', 'rgba') }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.1rem' }}>{s.icon}</div>
              <div className="att-stat-num" style={{ fontSize: '1.9rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{count}</div>
              <div className="att-stat-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>ไม่มีข้อมูลการเช็คชื่อ</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>{formatDate(selectedDate)}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="att-table-wrap">
              <table className="att-table-el" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(76,175,80,0.08)', borderBottom: '1px solid rgba(76,175,80,0.15)' }}>
                    {['#', 'ชื่อ-นามสกุล', 'ห้อง', 'สถานะ', 'เวลา', 'วิธี'].map(h => (
                      <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const s = statusInfo[r.status] || statusInfo.present;
                    return (
                      <tr key={r._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(76,175,80,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1b5e20, #43a047)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                              {r.studentName.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>{r.studentName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{ background: 'rgba(76,175,80,0.1)', color: '#1b5e20', padding: '0.15rem 0.55rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>{r.class}</span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                            {s.icon} {s.label}
                            {r.method === 'face' && <span style={{ fontSize: '0.62rem', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', padding: '1px 4px' }}>AI</span>}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>🕐 {r.checkinTime || '-'}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '8px', background: r.method === 'face' ? 'rgba(33,150,243,0.1)' : 'rgba(158,158,158,0.1)', color: r.method === 'face' ? '#1565c0' : '#616161', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {r.method === 'face' ? '🤖 AI' : '✋ ครู'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="att-card-list" style={{ padding: '0.75rem' }}>
              {records.map((r, i) => {
                const s = statusInfo[r.status] || statusInfo.present;
                return (
                  <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid rgba(76,175,80,0.1)' }}>
                    {/* Avatar + number */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1b5e20, #43a047)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}>
                        {r.studentName.charAt(0)}
                      </div>
                      <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'white', border: '1.5px solid white' }}>{s.icon}</div>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.studentName}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(76,175,80,0.12)', color: '#1b5e20', padding: '1px 6px', borderRadius: '6px', fontWeight: 600 }}>{r.class}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🕐 {r.checkinTime || '-'}</span>
                      </div>
                    </div>
                    {/* Status */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: 'block', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                        {s.icon} {s.label}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: r.method === 'face' ? '#1565c0' : '#9e9e9e' }}>
                        {r.method === 'face' ? '🤖 AI' : '✋ ครู'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
