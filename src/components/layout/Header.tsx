"use client";

export default function Header() {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input type="text" className="search-bar" placeholder="ค้นหาข้อมูล..." />
      </div>
      <div className="user-profile">
        <div className="notif-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="notif-dot"></span>
        </div>
        <span>คุณครูประจำชั้น</span>
        <div className="avatar">ครู</div>
      </div>
    </header>
  );
}
