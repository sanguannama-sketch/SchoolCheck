"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ScanLog = {
  id: string;
  name: string;
  time: string;
  status: 'success' | 'late' | 'unknown';
  avatar: string;
};

export default function FaceScanPage() {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState<ScanLog | null>(null);

  const simulateScan = () => {
    if (!isScanning) return;
    
    setIsScanning(false);
    
    const isLate = Math.random() > 0.7; // 30% chance of being marked late
    const mockStudent: ScanLog = {
      id: Math.random().toString(36).substring(7),
      name: isLate ? 'เด็กชาย มาสาย ปกติ' : 'เด็กหญิง ตั้งใจ เรียนดี',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: isLate ? 'late' : 'success',
      avatar: isLate ? 'ด' : 'ต',
    };
    
    setLastScanned(mockStudent);
    setLogs(prev => [mockStudent, ...prev].slice(0, 5)); // Keep last 5 scans
    
    // Resume scanning after 3 seconds
    setTimeout(() => {
      setLastScanned(null);
      setIsScanning(true);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a192f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* CSS สำหรับ Animation โหมดสแกน */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanLineAnim {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulseBorder {
          0% { border-color: rgba(76, 175, 80, 0.3); box-shadow: 0 0 10px rgba(76, 175, 80, 0.1); }
          50% { border-color: rgba(76, 175, 80, 1); box-shadow: 0 0 30px rgba(76, 175, 80, 0.6); }
          100% { border-color: rgba(76, 175, 80, 0.3); box-shadow: 0 0 10px rgba(76, 175, 80, 0.1); }
        }
        @keyframes successPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scanner-frame {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 480px;
          border-radius: 20px;
          overflow: hidden;
          background: #0d233a;
          border: 3px solid rgba(76, 175, 80, 0.4);
          animation: pulseBorder 2s infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: #4caf50;
          box-shadow: 0 0 20px 4px #4caf50;
          animation: scanLineAnim 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 10;
        }
        .corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-width: 4px;
          border-style: solid;
          border-color: #81c784;
          z-index: 5;
        }
        .corner-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; border-radius: 12px 0 0 0; }
        .corner-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; border-radius: 0 12px 0 0; }
        .corner-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; border-radius: 0 0 0 12px; }
        .corner-br { bottom: 20px; right: 20px; border-left: none; border-top: none; border-radius: 0 0 12px 0; }
        
        .success-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 47, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          animation: successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />

      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #4caf50, #81c784)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>SC</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>ระบบเช็คอิน (Kiosk Mode)</h1>
            <p style={{ fontSize: '0.85rem', color: '#a0aec0', margin: 0 }}>กรุณามองกล้องเพื่อเช็คชื่อเข้าเรียน</p>
          </div>
        </div>
        
        <Link href="/" style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          กลับสู่แผงควบคุม
        </Link>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', padding: '2rem', gap: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Camera/Scanner Section */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="scanner-frame">
            {isScanning && <div className="scan-line"></div>}
            
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            {/* Fake Guide Silhouette */}
            <svg width="200" height="200" viewBox="0 0 24 24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>

            {/* Success Overlay Pop-up */}
            {lastScanned && (
              <div className="success-overlay">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: lastScanned.status === 'success' ? '#4caf50' : '#f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', boxShadow: lastScanned.status === 'success' ? '0 8px 32px rgba(76,175,80,0.4)' : '0 8px 32px rgba(245,124,0,0.4)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>สวัสดี, {lastScanned.name}</h2>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: lastScanned.status === 'success' ? 'rgba(76,175,80,0.2)' : 'rgba(245,124,0,0.2)', color: lastScanned.status === 'success' ? '#81c784' : '#ffb74d', fontWeight: 600, fontSize: '0.9rem' }}>
                  {lastScanned.status === 'success' ? 'บันทึกเวลามาเรียนเรียบร้อย' : 'บันทึกเวลามาสาย'} - {lastScanned.time}
                </span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#8892b0', fontSize: '0.95rem', marginBottom: '1rem' }}>โหมดจำลอง: กดปุ่มเพื่อจำลองเหตุการณ์ใบหน้าผ่านกล้อง</p>
            <button onClick={simulateScan} disabled={!isScanning} style={{ padding: '0.75rem 2rem', background: isScanning ? '#1b5e20' : '#2A3B4C', color: isScanning ? 'white' : '#8892b0', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: isScanning ? 'pointer' : 'not-allowed', boxShadow: isScanning ? '0 4px 14px rgba(27,94,32,0.4)' : 'none', transition: 'all 0.2s' }}>
              {isScanning ? '🔍 แตะจุดนี้เพื่อจำลองสแกนใบหน้า' : 'รอการรีเซ็ตระบบกล้อง...'}
            </button>
          </div>
        </div>

        {/* Scan Log/Sidebar Area */}
        <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              สแกนล่าสุด
            </h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(76,175,80,0.2)', color: '#81c784', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>วันนี้: {logs.length} คน</span>
          </div>

          {logs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#596a84', textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <p>ยังไม่มีข้อมูลการสแกนในขณะนี้</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {logs.map((log, index) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)', animation: 'successPop 0.3s ease-out' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: log.status === 'success' ? '#2e7d32' : '#e65100', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {log.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{log.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#8892b0' }}>{log.time}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: log.status === 'success' ? 'rgba(76,175,80,0.15)' : 'rgba(245,124,0,0.15)', color: log.status === 'success' ? '#81c784' : '#ffb74d' }}>
                      {log.status === 'success' ? 'มาเรียน' : 'สาย'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
