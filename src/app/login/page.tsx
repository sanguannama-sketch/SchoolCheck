import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem 2.5rem', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeUp 0.6s ease-out backwards' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #1b5e20, #43a047)', color: 'white', fontSize: '1.8rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(27, 94, 32, 0.3)', marginBottom: '1.5rem' }}>
            SC
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>ยินดีต้อนรับกลับมา</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>เข้าสู่ระบบเพื่อจัดการระบบ SchoolCheck</p>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>อีเมลของคุณ</label>
          <input type="email" className="form-input" placeholder="teacher@school.com" />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0, fontSize: '0.9rem' }}>รหัสผ่าน</label>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>ลืมรหัสผ่าน?</Link>
          </div>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>
        
        <Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem', borderRadius: '14px', boxShadow: '0 8px 24px rgba(27, 94, 32, 0.25)' }}>
          เข้าสู่ระบบ
        </Link>
        


      </div>
    </div>
  );
}
