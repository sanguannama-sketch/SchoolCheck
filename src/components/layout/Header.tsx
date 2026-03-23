export default function Header() {
  return (
    <header className="top-header">
      <input type="text" className="search-bar" placeholder="ค้นหาข้อมูล..." />
      <div className="user-profile">
        <span>คุณครูประจำชั้น</span>
        <div className="avatar">ครู</div>
      </div>
    </header>
  );
}
