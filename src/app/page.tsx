import StatCard from '@/components/dashboard/StatCard';
import AttendanceChart from '@/components/dashboard/AttendanceChart';

export default function DashboardPage() {
  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>ยินดีต้อนรับ, คุณครู 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>ภาพรวมสถิติการมาเรียนของนักเรียนวันนี้</p>
      </div>

      <div className="dashboard-grid">
        <StatCard title="นักเรียนทั้งหมด" value="320" trend="✓ อัปเดตล่าสุด: วันนี้" trendType="positive" />
        <StatCard title="มาเรียน (คน)" value="305" trend="↑ 95.3% จากทั้งหมด" trendType="positive" color="#2e7d32" />
        <StatCard title="ขาดเรียน (คน)" value="15" trend="↓ เพิ่มขึ้นจากเมื่อวาน 2 คน" trendType="negative" color="#c62828" />
        <StatCard title="มาสาย (คน)" value="8" trend="ลดลง 5% สัปดาห์นี้" color="#f57f17" />
      </div>

      <div className="charts-section">
        <div className="chart-card glass">
          <h2 className="section-title">สถิติการมาเรียนรายสัปดาห์</h2>
          <AttendanceChart />
        </div>
        <div className="chart-card glass">
          <h2 className="section-title">สรุปยอดประจำวัน</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['ม.1', 'ม.2', 'ม.3', 'ม.4'].map((level, i) => (
              <div key={level} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 500 }}>{level}</span>
                <span style={{ color: 'var(--text-muted)' }}>มาเรียน {90 + i}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
