"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

interface AttendanceRecord {
  _id: string;
  date: string;
  studentId: number;
  studentName: string;
  class: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  checkinTime: string;
  method: 'face' | 'manual' | 'auto';
}

const API_URL = 'http://localhost:5000/api/attendance';

const STATUS_INFO = {
  present: { label: 'มาเรียน', bg: '#e8f5e9', color: '#2e7d32', border: '#81c784', icon: '✓' },
  absent:  { label: 'ขาดเรียน', bg: '#ffebee', color: '#c62828', border: '#e57373', icon: '✗' },
  late:    { label: 'มาสาย',   bg: '#fff8e1', color: '#e65100', border: '#ffcc02', icon: '⏰' },
};

export default function AttendancePage() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [isClient, setIsClient] = useState(false);

  // Edit modal state
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [editSubject, setEditSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  // Custom delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetch('http://localhost:5000/api/students')
      .then(r => r.json())
      .then(data => {
        const unique = Array.from(new Set<string>(data.map((s: any) => s.class))).sort();
        setClasses(unique);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { if (isClient) fetchAttendance(); }, [isClient, selectedDate, selectedClass]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}?date=${selectedDate}`;
      if (selectedClass !== 'all') url += `&class=${encodeURIComponent(selectedClass)}`;
      const data = await fetch(url).then(r => r.json());
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      showToast('ไม่สามารถเชื่อมต่อ Backend ได้', 'error');
      setRecords([]);
    } finally { setIsLoading(false); }
  };

  // ── Edit ──
  const openEdit = (r: AttendanceRecord) => {
    setEditRecord(r);
    setEditStatus(r.status);
    setEditSubject(r.subject || '');
  };
  const saveEdit = async () => {
    if (!editRecord) return;
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/${editRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, subject: editSubject }),
      });
      showToast('แก้ไขสำเร็จ', 'success');
      setEditRecord(null);
      fetchAttendance();
    } catch { showToast('แก้ไขไม่สำเร็จ', 'error'); }
    finally { setIsSaving(false); }
  };

  // ── Delete ──
  const deleteRecord = async (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${API_URL}/${deleteTarget.id}`, { method: 'DELETE' });
      showToast('ลบรายการแล้ว', 'success');
      setRecords(prev => prev.filter(r => r._id !== deleteTarget.id));
    } catch { showToast('ลบไม่สำเร็จ', 'error'); }
    finally { setDeleteTarget(null); }
  };

  const totalPresent = records.filter(r => r.status === 'present').length;
  const totalLate    = records.filter(r => r.status === 'late').length;
  const totalAbsent  = records.filter(r => r.status === 'absent').length;

  const formatDate = (d: string) => new Date(d + 'T00:00:00')
    .toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const methodLabel = (m: string) => m === 'face' ? '🤖 AI' : m === 'auto' ? '⚙️ อัตโนมัติ' : '✋ ครู';
  const methodColor = (m: string) => m === 'face' ? { bg: 'rgba(33,150,243,0.1)', color: '#1565c0' }
    : m === 'auto' ? { bg: 'rgba(156,39,176,0.1)', color: '#6a1b9a' }
    : { bg: 'rgba(158,158,158,0.1)', color: '#616161' };

  if (!isClient) return null;

  return (
    <div style={{ animation: 'fadeUp 0.6s ease-out backwards' }}>
      <style>{`
        .att-filters { display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; }
        .att-filter-item { display:flex; align-items:center; gap:0.4rem; flex:1; min-width:160px; }
        .att-filter-item input, .att-filter-item select {
          flex:1; padding:0.45rem 0.7rem; border-radius:10px;
          border:1px solid rgba(76,175,80,0.3); background:var(--bg-card);
          color:var(--text-main); font-size:0.88rem; cursor:pointer; width:100%;
        }
        .att-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; margin-bottom:1.25rem; }
        .att-card-list { display:none; }
        .att-table-el { display:table; }
        .att-action-btn { background:none; border:none; cursor:pointer; padding:0.3rem; border-radius:8px; transition:background 0.15s; display:inline-flex; align-items:center; }
        .att-action-btn:hover { background:rgba(0,0,0,0.07); }
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal-card { background:var(--bg-main,#fff); border-radius:20px; padding:1.5rem; width:100%; max-width:380px; box-shadow:0 24px 64px rgba(0,0,0,0.3); animation:fadeUp 0.25s ease-out; border:1px solid rgba(76,175,80,0.15); }
        @media (max-width:640px) {
          .att-card-list { display:flex; flex-direction:column; gap:0.6rem; }
          .att-table-el { display:none; }
          .att-filter-item { min-width:100%; }
          .att-stats { gap:0.5rem; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'var(--text-main)', marginBottom:'0.2rem', display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            ประวัติการเช็คชื่อ
            <span style={{ fontSize:'0.9rem', fontWeight:500, color:'var(--text-muted)', background:'rgba(76,175,80,0.12)', padding:'0.15rem 0.55rem', borderRadius:'10px' }}>
              {records.length} รายการ
            </span>
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{formatDate(selectedDate)}</p>
        </div>
        <button className="btn-primary" onClick={fetchAttendance} style={{ padding:'0.55rem 1rem', fontSize:'0.88rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          รีเฟรช
        </button>
      </div>

      {/* Filters */}
      <div className="glass att-filters" style={{ padding:'1rem', borderRadius:'16px', marginBottom:'1.25rem' }}>
        <div className="att-filter-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <label style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-muted)', whiteSpace:'nowrap' }}>วันที่</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="att-filter-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <label style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-muted)', whiteSpace:'nowrap' }}>ห้องเรียน</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="all">ทุกห้อง</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="att-stats">
        {([{ key:'present', count:totalPresent }, { key:'late', count:totalLate }, { key:'absent', count:totalAbsent }] as const).map(({ key, count }) => {
          const s = STATUS_INFO[key];
          return (
            <div key={key} className="glass" style={{ padding:'1rem', borderRadius:'16px', textAlign:'center', background:s.bg }}>
              <div style={{ fontSize:'1.4rem' }}>{s.icon}</div>
              <div style={{ fontSize:'1.9rem', fontWeight:800, color:s.color, lineHeight:1.1 }}>{count}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:600, marginTop:'0.15rem' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Table / Cards */}
      <div className="glass" style={{ borderRadius:'20px', overflow:'hidden' }}>
        {isLoading ? (
          <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)' }}>⏳ กำลังโหลด...</div>
        ) : records.length === 0 ? (
          <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem' }}>📋</div>
            <p style={{ fontWeight:600 }}>ไม่มีข้อมูลการเช็คชื่อ</p>
            <p style={{ fontSize:'0.82rem' }}>{formatDate(selectedDate)}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div style={{ overflowX:'auto' }}>
              <table className="att-table-el" style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'rgba(76,175,80,0.08)', borderBottom:'1px solid rgba(76,175,80,0.15)' }}>
                    {['#','ชื่อ-นามสกุล','ห้อง','รายวิชา','สถานะ','เวลา','วิธี',''].map(h => (
                      <th key={h} style={{ padding:'0.8rem 0.75rem', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const s = STATUS_INFO[r.status] || STATUS_INFO.present;
                    const mc = methodColor(r.method);
                    return (
                      <tr key={r._id} style={{ borderBottom:'1px solid rgba(0,0,0,0.04)', transition:'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(76,175,80,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                        <td style={{ padding:'0.75rem', color:'var(--text-muted)', fontSize:'0.82rem' }}>{i+1}</td>
                        <td style={{ padding:'0.75rem' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                            <div style={{ width:32, height:32, minWidth:32, borderRadius:'50%', background:'linear-gradient(135deg,#1b5e20,#43a047)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.82rem', fontWeight:700 }}>{r.studentName.charAt(0)}</div>
                            <span style={{ fontWeight:600, color:'var(--text-main)', fontSize:'0.88rem' }}>{r.studentName}</span>
                          </div>
                        </td>
                        <td style={{ padding:'0.75rem' }}>
                          <span style={{ background:'rgba(76,175,80,0.1)', color:'#1b5e20', padding:'0.15rem 0.55rem', borderRadius:'8px', fontSize:'0.8rem', fontWeight:600 }}>{r.class}</span>
                        </td>
                        <td style={{ padding:'0.75rem', fontSize:'0.82rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                          {r.subject || <span style={{ opacity:0.4 }}>—</span>}
                        </td>
                        <td style={{ padding:'0.75rem' }}>
                          <span style={{ padding:'0.2rem 0.55rem', borderRadius:'20px', fontSize:'0.76rem', fontWeight:600, background:s.bg, color:s.color, border:`1px solid ${s.border}`, whiteSpace:'nowrap' }}>
                            {s.icon} {s.label}
                          </span>
                        </td>
                        <td style={{ padding:'0.75rem', color:'var(--text-muted)', fontSize:'0.82rem', whiteSpace:'nowrap' }}>🕐 {r.checkinTime||'—'}</td>
                        <td style={{ padding:'0.75rem' }}>
                          <span style={{ fontSize:'0.72rem', padding:'0.2rem 0.5rem', borderRadius:'8px', background:mc.bg, color:mc.color, fontWeight:600, whiteSpace:'nowrap' }}>{methodLabel(r.method)}</span>
                        </td>
                        <td style={{ padding:'0.75rem' }}>
                          <div style={{ display:'flex', gap:'4px' }}>
                            <button className="att-action-btn" title="แก้ไข" onClick={() => openEdit(r)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b5e20" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="att-action-btn" title="ลบ" onClick={() => deleteRecord(r._id, r.studentName)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="att-card-list" style={{ padding:'0.75rem' }}>
              {records.map(r => {
                const s = STATUS_INFO[r.status] || STATUS_INFO.present;
                const mc = methodColor(r.method);
                return (
                  <div key={r._id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', borderRadius:'14px', background:'var(--bg-card)', border:'1px solid rgba(76,175,80,0.1)' }}>
                    <div style={{ position:'relative', flexShrink:0 }}>
                      <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#1b5e20,#43a047)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:700 }}>{r.studentName.charAt(0)}</div>
                      <div style={{ position:'absolute', bottom:-2, right:-2, width:16, height:16, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.55rem', color:'white', border:'1.5px solid white' }}>{s.icon}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.92rem', color:'var(--text-main)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.studentName}</div>
                      <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.2rem', flexWrap:'wrap', alignItems:'center' }}>
                        <span style={{ fontSize:'0.72rem', background:'rgba(76,175,80,0.12)', color:'#1b5e20', padding:'1px 6px', borderRadius:'6px', fontWeight:600 }}>{r.class}</span>
                        {r.subject && <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>📚 {r.subject}</span>}
                        <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>🕐 {r.checkinTime||'—'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <span style={{ padding:'0.2rem 0.55rem', borderRadius:'16px', fontSize:'0.75rem', fontWeight:600, background:s.bg, color:s.color, border:`1px solid ${s.border}`, display:'block', whiteSpace:'nowrap', marginBottom:'0.25rem' }}>{s.icon} {s.label}</span>
                      <div style={{ display:'flex', gap:'4px', justifyContent:'flex-end' }}>
                        <button className="att-action-btn" onClick={() => openEdit(r)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b5e20" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="att-action-btn" onClick={() => deleteRecord(r._id, r.studentName)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editRecord && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditRecord(null)}>
          <div className="modal-card">
            <h3 style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--text-main)', marginBottom:'0.25rem' }}>แก้ไขการเช็คชื่อ</h3>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1.25rem', fontWeight:500 }}>
              {editRecord.studentName} · <span style={{ background:'rgba(76,175,80,0.15)', color:'#2e7d32', padding:'1px 8px', borderRadius:'8px' }}>{editRecord.class}</span>
            </p>

            <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-main)', display:'block', marginBottom:'0.4rem' }}>รายวิชา</label>
            <input value={editSubject} onChange={e => setEditSubject(e.target.value)} placeholder="เช่น คณิตศาสตร์"
              style={{ width:'100%', padding:'0.55rem 0.8rem', borderRadius:'10px', border:'1.5px solid rgba(76,175,80,0.4)', background:'var(--bg-main,#f8f9fa)', color:'var(--text-main)', fontSize:'0.9rem', marginBottom:'1rem', boxSizing:'border-box' as const }} />

            <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-main)', display:'block', marginBottom:'0.5rem' }}>สถานะ</label>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem' }}>
              {(['present','late','absent'] as const).map(st => {
                const s = STATUS_INFO[st];
                const active = editStatus === st;
                return (
                  <button key={st} onClick={() => setEditStatus(st)} style={{
                    flex:1, padding:'0.6rem 0.25rem', borderRadius:'12px',
                    border: `2px solid ${active ? s.color : 'rgba(0,0,0,0.1)'}`,
                    background: active ? s.bg : 'transparent',
                    color: active ? s.color : 'var(--text-muted)',
                    fontWeight:700, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.15s'
                  }}>
                    {st === 'present' ? '✓ มาเรียน' : st === 'late' ? '⏰ มาสาย' : '✗ ขาดเรียน'}
                  </button>
                );
              })}
            </div>

            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={() => setEditRecord(null)} style={{ flex:1, padding:'0.65rem', borderRadius:'12px', background:'rgba(0,0,0,0.06)', border:'none', color:'var(--text-main)', fontWeight:600, cursor:'pointer', fontSize:'0.9rem' }}>ยกเลิก</button>
              <button onClick={saveEdit} disabled={isSaving} style={{ flex:2, padding:'0.65rem', borderRadius:'12px', background:'linear-gradient(135deg,#1b5e20,#43a047)', border:'none', color:'white', fontWeight:700, cursor:'pointer', opacity:isSaving?0.7:1, fontSize:'0.9rem' }}>
                {isSaving ? 'กำลังบันทึก...' : '✓ บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal-card" style={{ maxWidth:340, textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(198,40,40,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <h3 style={{ fontWeight:800, color:'var(--text-main)', marginBottom:'0.4rem', fontSize:'1.05rem' }}>ยืนยันการลบ</h3>
            <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', marginBottom:'1.5rem' }}>
              ลบรายการของ <strong style={{ color:'var(--text-main)' }}>{deleteTarget.name}</strong> ออกจากประวัติ?<br/>
              <span style={{ fontSize:'0.78rem' }}>การกระทำนี้ไม่สามารถย้อนกลับได้</span>
            </p>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex:1, padding:'0.65rem', borderRadius:'12px', background:'rgba(0,0,0,0.06)', border:'none', color:'var(--text-main)', fontWeight:600, cursor:'pointer' }}>ยกเลิก</button>
              <button onClick={confirmDelete} style={{ flex:1, padding:'0.65rem', borderRadius:'12px', background:'linear-gradient(135deg,#b71c1c,#e53935)', border:'none', color:'white', fontWeight:700, cursor:'pointer' }}>ลบออก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
