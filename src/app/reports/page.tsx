"use client";

import { useState } from 'react';

export default function ReportsPage() {
  const [period, setPeriod] = useState('week');

  const weeklyData = [
    { day: 'จ.', present: 310, absent: 5, late: 5, total: 320 },
    { day: 'อ.', present: 305, absent: 8, late: 7, total: 320 },
    { day: 'พ.', present: 312, absent: 4, late: 4, total: 320 },
    { day: 'พฤ.', present: 300, absent: 12, late: 8, total: 320 },
    { day: 'ศ.', present: 308, absent: 6, late: 6, total: 320 },
  ];

  const classData = [
    { name: 'ม.1/1', present: 38, absent: 1, late: 1, total: 40 },
    { name: 'ม.1/2', present: 37, absent: 2, late: 1, total: 40 },
    { name: 'ม.2/1', present: 39, absent: 0, late: 1, total: 40 },
    { name: 'ม.2/2', present: 36, absent: 3, late: 1, total: 40 },
    { name: 'ม.3/1', present: 38, absent: 1, late: 1, total: 40 },
    { name: 'ม.3/2', present: 35, absent: 3, late: 2, total: 40 },
  ];

  const avgPresent = Math.round(weeklyData.reduce((a, d) => a + (d.present / d.total * 100), 0) / weeklyData.length);

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out backwards" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            รายงานสถิติ
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', background: 'rgba(76,175,80,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', marginLeft: '0.5rem' }}>ภาพรวมระบบ</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>สรุปข้อมูลการเข้าเรียนและสถิติสำคัญต่าง ๆ</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { value: 'week', label: 'รายสัปดาห์' },
            { value: 'month', label: 'รายเดือน' },
            { value: 'semester', label: 'รายภาคเรียน' },
          ].map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)} style={{
              padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
              background: period === p.value ? 'var(--text-main)' : 'rgba(255,255,255,0.6)',
              color: period === p.value ? 'white' : 'var(--text-main)',
              boxShadow: period === p.value ? '0 4px 12px rgba(27, 94, 32, 0.2)' : 'none',
              transition: 'all 0.2s',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b5e20' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>อัตราการมาเรียนเฉลี่ย</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{avgPresent}%</div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 83, 80, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c62828' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>ขาดเรียนรวม (สัปดาห์นี้)</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{weeklyData.reduce((a, d) => a + d.absent, 0)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>ครั้ง</span></div>
          </div>
        </div>
        <div className="glass stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 152, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e65100' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div className="stat-title" style={{ fontSize: '0.8rem' }}>มาสายรวม (สัปดาห์นี้)</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{weeklyData.reduce((a, d) => a + d.late, 0)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>ครั้ง</span></div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Weekly Bar Chart */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            สถิติการเข้าเรียนรายวัน
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '200px', padding: '0 0.5rem' }}>
            {weeklyData.map((d, i) => {
              const pct = (d.present / d.total) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{Math.round(pct)}%</span>
                  <div style={{ width: '100%', borderRadius: '8px 8px 4px 4px', overflow: 'hidden', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ height: `${(d.late / d.total) * 160}px`, background: '#ffcc02', transition: 'height 0.5s ease' }}></div>
                    <div style={{ height: `${(d.absent / d.total) * 160}px`, background: '#ef5350', transition: 'height 0.5s ease' }}></div>
                    <div style={{ height: `${(d.present / d.total) * 160}px`, background: 'linear-gradient(180deg, #66bb6a, #43a047)', transition: 'height 0.5s ease', borderRadius: '8px 8px 0 0' }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#43a047' }}></div> มาเรียน
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef5350' }}></div> ขาด
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ffcc02' }}></div> สาย
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            สัดส่วนภาพรวมวันนี้
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#43a047" strokeWidth="3" strokeDasharray={`${95.3} ${100 - 95.3}`} strokeDashoffset="0" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef5350" strokeWidth="3" strokeDasharray={`${3.1} ${100 - 3.1}`} strokeDashoffset={`${-95.3}`} strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffcc02" strokeWidth="3" strokeDasharray={`${1.6} ${100 - 1.6}`} strokeDashoffset={`${-95.3 - 3.1}`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>95%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>มาเรียน</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#43a047' }}></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>มาเรียน</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>305 คน <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#43a047' }}>(95.3%)</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ef5350' }}></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ขาดเรียน</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>10 คน <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#ef5350' }}>(3.1%)</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ffcc02' }}></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>มาสาย</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>5 คน <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#e65100' }}>(1.6%)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance by Class */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            สถิติแยกตามห้องเรียน
          </h3>
          <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            ส่งออก Excel
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>ห้องเรียน</th>
                <th>จำนวนนักเรียน</th>
                <th>มาเรียน</th>
                <th>ขาด</th>
                <th>สาย</th>
                <th>อัตราการมาเรียน</th>
              </tr>
            </thead>
            <tbody>
              {classData.map(c => {
                const pct = Math.round((c.present / c.total) * 100);
                return (
                  <tr key={c.name}>
                    <td data-label="ห้องเรียน" style={{ fontWeight: 600 }}>{c.name}</td>
                    <td data-label="จำนวนนักเรียน">{c.total} คน</td>
                    <td data-label="มาเรียน">
                      <span style={{ color: '#2e7d32', fontWeight: 600 }}>{c.present}</span>
                    </td>
                    <td data-label="ขาด">
                      <span style={{ color: c.absent > 0 ? '#c62828' : 'var(--text-muted)', fontWeight: 600 }}>{c.absent}</span>
                    </td>
                    <td data-label="สาย">
                      <span style={{ color: c.late > 0 ? '#e65100' : 'var(--text-muted)', fontWeight: 600 }}>{c.late}</span>
                    </td>
                    <td data-label="อัตราการมาเรียน">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden', minWidth: '80px' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%', borderRadius: '4px',
                            background: pct >= 95 ? 'linear-gradient(90deg, #66bb6a, #43a047)' : pct >= 90 ? '#ffcc02' : '#ef5350',
                            transition: 'width 0.6s ease',
                          }}></div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: pct >= 95 ? '#2e7d32' : pct >= 90 ? '#e65100' : '#c62828' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Absent Students */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          นักเรียนที่ขาดเรียนบ่อย (Top 5)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'สุภาพร รักดี', class: 'ม.1/1', absences: 5, color: '#fce4ec', iconColor: '#c62828' },
            { name: 'กิตติพงษ์ ศรีสะอาด', class: 'ม.2/1', absences: 4, color: '#ffebee', iconColor: '#b71c1c' },
            { name: 'สมชาย มาดแมน', class: 'ม.2/2', absences: 3, color: '#fff8e1', iconColor: '#f9a825' },
            { name: 'อนุชา วงศ์สกุล', class: 'ม.1/2', absences: 2, color: '#e3f2fd', iconColor: '#1976d2' },
            { name: 'ใจดี มีสุข', class: 'ม.3/1', absences: 2, color: '#e8f5e9', iconColor: '#388e3c' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: s.color, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0, border: '2px solid white' }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.class}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.2rem' }}>{s.absences}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ครั้ง</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
