"use client";

import { useState, useEffect, useRef } from 'react';
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
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [manualName, setManualName] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Gesture instruction from checkin page
  const gestureMap: Record<string, { emoji: string; label: string; hint: string }> = {
    peace:    { emoji: '✌️', label: 'ชู 2 นิ้ว', hint: 'กรุณาชู 2 นิ้วให้กล้องเห็นชัด' },
    thumbs:   { emoji: '👍', label: 'โชว์นิ้วโป้ง', hint: 'กรุณายกนิ้วโป้งขึ้น' },
    wave:     { emoji: '👋', label: 'โบกมือ', hint: 'กรุณาโบกมือให้กล้องเห็น' },
    fist:     { emoji: '✊', label: 'กำมือ', hint: 'กรุณากำมือแล้วยกขึ้น' },
    openhand: { emoji: '🖐️', label: 'แบมือ 5 นิ้ว', hint: 'กรุณาแบมือทั้ง 5 นิ้ว' },
  };
  const [gestureId, setGestureId] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('scanGesture') || 'peace';
    return 'peace';
  });
  const gesture = gestureMap[gestureId] || gestureMap['peace'];

  useEffect(() => {
    // Camera activation logic
    if (selectedRoom && isScanning && !cameraError) {
      if (!streamRef.current) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.error("Camera access error:", err);
            setCameraError(true);
          });
      }
    } else {
      // Stop the camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedRoom, isScanning, cameraError]);

  useEffect(() => {
    const updateStateFromStorage = () => {
      try {
        const savedRoomsStr = localStorage.getItem('activeScanRooms');
        let rooms: any[] = [];
        if (savedRoomsStr) {
          rooms = JSON.parse(savedRoomsStr);
        } else {
          const legacyRoom = localStorage.getItem('activeScanRoom');
          if (legacyRoom) rooms = [{ room: legacyRoom, lat: 0, lng: 0, radius: 0 }];
        }
        
        setActiveRooms(rooms);
        
        if (rooms.length > 0) {
          setIsScanning(true);
          setSelectedRoom(prev => rooms.some(r => (r.room || r) === prev) ? prev : (rooms[0].room || rooms[0]));
        } else {
          setIsScanning(false);
          setSelectedRoom('');
        }
      } catch (e) {
        setActiveRooms([]);
        setIsScanning(false);
        setSelectedRoom('');
      }
    };

    // Initial load
    updateStateFromStorage();
    
    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeScanRooms' || e.key === 'activeScanRoom') {
        updateStateFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync gesture when localStorage changes (cross-tab)
  useEffect(() => {
    const handleGestureChange = (e: StorageEvent) => {
      if (e.key === 'scanGesture') setGestureId(e.newValue || 'peace');
    };
    window.addEventListener('storage', handleGestureChange);
    return () => window.removeEventListener('storage', handleGestureChange);
  }, []);

  const executeSimulatedScan = () => {
    const isLate = Math.random() > 0.7; // 30% chance of being marked late
    const fallbackName = isLate ? 'เด็กชาย มาสาย ปกติ' : 'เด็กหญิง ตั้งใจ เรียนดี';
    const finalName = manualName.trim() !== '' ? manualName : fallbackName;
    
    const mockStudent: ScanLog = {
      id: Math.random().toString(36).substring(7),
      name: finalName,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: isLate ? 'late' : 'success',
      avatar: finalName.charAt(0),
    };
    
    setLastScanned(mockStudent);
    setLogs(prev => [mockStudent, ...prev].slice(0, 5)); // Keep last 5 scans
    setManualName(""); // Reset input field
    
    // Resume scanning after 3 seconds
    setTimeout(() => {
      setLastScanned(null);
      setLocationErrorMsg("");
      setIsScanning(true);
    }, 3000);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const simulateScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isScanning || !selectedRoom) return;
    
    const config = activeRooms.find(r => (r.room || r) === selectedRoom);
    if (!config || !config.lat) {
      // If legacy or no GPS config, just execute
      setIsScanning(false);
      executeSimulatedScan();
      return;
    }

    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ไม่ร้องรับ GPS");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, config.lat, config.lng);
        
        setIsScanning(false);
        if (dist > config.radius) {
          // Geofence failed!
          const errorLog: ScanLog = {
            id: Math.random().toString(36).substring(7),
            name: 'ไม่สามารถเช็คอินได้',
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: 'unknown',
            avatar: '!',
          };
          setLocationErrorMsg(`อยู่นอกพื้นที่สแกน (ห่าง ${Math.round(dist)} ม. จากจุดที่กำหนด ${config.radius} ม.)`);
          setLastScanned(errorLog);
          setTimeout(() => {
            setLastScanned(null);
            setLocationErrorMsg("");
            setIsScanning(true);
          }, 4000);
        } else {
          // Success
          executeSimulatedScan();
        }
      },
      (error) => {
        setIsLocating(false);
        alert("กรุณาอนุญาต GPS เพื่อเช็คอิน");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center 30%, #112240 0%, #0a192f 100%)', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* CSS สำหรับ Animation โหมดสแกน */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanLineAnim {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(0, 230, 118, 0.15), inset 0 0 60px rgba(0, 230, 118, 0.05); border-color: rgba(0, 230, 118, 0.3); }
          50% { box-shadow: 0 0 60px rgba(0, 230, 118, 0.3), inset 0 0 80px rgba(0, 230, 118, 0.1); border-color: rgba(0, 230, 118, 0.6); }
        }
        @keyframes successPop {
          0% { transform: scale(0.95); opacity: 0; filter: blur(4px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        .scanner-frame {
          position: relative;
          width: 100%;
          max-width: 380px;
          height: 480px;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(10, 25, 47, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 230, 118, 0.2);
          animation: pulseGlow 3s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(0, 230, 118, 0.1) 80%, rgba(0, 230, 118, 0.8) 100%);
          animation: scanLineAnim 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 10;
        }
        /* ลบเส้น box-shadow แข็งๆ เปลี่ยนเป็นเส้นเลเซอร์ชัดๆ */
        .scan-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 5%;
          width: 90%;
          height: 2px;
          background: #00e676;
          box-shadow: 0 0 15px 2px #00e676;
          border-radius: 50%;
        }
        .corner {
          position: absolute;
          width: 50px;
          height: 50px;
          border-width: 3px;
          border-style: solid;
          border-color: #00e676;
          opacity: 0.8;
          z-index: 5;
          border-radius: 8px; /* มุมมนนิดๆ เพื่อความนุ่มนวล */
          box-shadow: 0 0 10px rgba(0, 230, 118, 0.3), inset 0 0 10px rgba(0, 230, 118, 0.3);
          transition: all 0.3s ease;
        }
        /* กำหนดมุม 4 ด้าน โดยลบเส้นขอบบางส่วนออก */
        .corner-tl { top: 24px; left: 24px; border-right: none; border-bottom: none; border-bottom-right-radius: 0; border-bottom-left-radius: 0; border-top-right-radius: 0; }
        .corner-tr { top: 24px; right: 24px; border-left: none; border-bottom: none; border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 0; }
        .corner-bl { bottom: 24px; left: 24px; border-right: none; border-top: none; border-top-right-radius: 0; border-top-left-radius: 0; border-bottom-right-radius: 0; }
        .corner-br { bottom: 24px; right: 24px; border-left: none; border-top: none; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 0; }
        
        .success-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 47, 0.7);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          animation: successPop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .glass-panel {
          background: rgba(13, 35, 58, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .glow-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 230, 118, 0.4) !important;
        }
        @keyframes gestureShake {
          0%, 100% { transform: rotate(-10deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.15); }
          50% { transform: rotate(-5deg) scale(1.08); }
          75% { transform: rotate(8deg) scale(1.12); }
        }
        @keyframes pulseLive {
          0%, 100% { box-shadow: 0 0 0 4px rgba(0,230,118,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(0,230,118,0); }
        }
      `}} />

      {/* Header */}
      <header className="glass-panel" style={{ padding: '1.25rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #00e676, #00b0ff)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(0, 230, 118, 0.3)' }}>SC</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>ระบบเช็คอิน (Kiosk Mode)</h1>
            {activeRooms.length > 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#81c784', fontWeight: 600 }}>กำลังเปิดรับสแกน:</span>
                <select 
                  value={selectedRoom} 
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#81c784', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                  {activeRooms.map(r => {
                    const roomName = r.room || r;
                    return <option key={roomName} value={roomName} style={{ background: '#0a192f', color: '#fff' }}>{roomName}</option>
                  })}
                </select>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: selectedRoom ? '#81c784' : '#a0aec0', margin: 0, fontWeight: selectedRoom ? 600 : 400 }}>
                {selectedRoom ? `กำลังเปิดรับสแกนห้อง: ${selectedRoom}` : 'กรุณามองกล้องเพื่อเช็คชื่อเข้าเรียน'}
              </p>
            )}
          </div>
        </div>
        
        <Link href="/" className="glow-btn" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          กลับสู่แผงควบคุม
        </Link>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', padding: '2rem', gap: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Camera/Scanner Section */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="scanner-frame">
            {/* Locked Overlay */}
            {!selectedRoom && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 12, 23, 0.95)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 30, color: '#fff', textAlign: 'center', padding: '2rem' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#607d8b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.8 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#b0bec5', fontSize: '1.25rem' }}>ระบบสแกนยังไม่เปิดทำงาน</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#78909c' }}>กรุณารอคุณครูประจำชั้นเปิดระบบจากแผงควบคุม</p>
              </div>
            )}

            {selectedRoom && isScanning && <div className="scan-line"></div>}
            
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            {/* Camera Feed or Fake Guide Silhouette */}
            {(!cameraError && selectedRoom && isScanning) ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.8) contrast(1.1)' }} 
              />
            ) : (
              <svg width="200" height="200" viewBox="0 0 24 24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}

            {/* Success/Error Overlay Pop-up */}
            {lastScanned && (
              <div className="success-overlay">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: locationErrorMsg ? '#d32f2f' : (lastScanned.status === 'success' ? '#4caf50' : '#f57c00'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', boxShadow: locationErrorMsg ? '0 8px 32px rgba(211,47,47,0.4)' : (lastScanned.status === 'success' ? '0 8px 32px rgba(76,175,80,0.4)' : '0 8px 32px rgba(245,124,0,0.4)') }}>
                  {locationErrorMsg ? (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: locationErrorMsg ? '#ef5350' : '#fff', textAlign: 'center' }}>
                  {locationErrorMsg ? 'การเช็คอินถูกระงับ' : `สวัสดี, ${lastScanned.name}`}
                </h2>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: locationErrorMsg ? 'rgba(211,47,47,0.2)' : (lastScanned.status === 'success' ? 'rgba(76,175,80,0.2)' : 'rgba(245,124,0,0.2)'), color: locationErrorMsg ? '#ef5350' : (lastScanned.status === 'success' ? '#81c784' : '#ffb74d'), fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  {locationErrorMsg || ((lastScanned.status === 'success' ? 'บันทึกเวลามาเรียนเรียบร้อย' : 'บันทึกเวลามาสาย') + ' - ' + lastScanned.time)}
                </span>
              </div>
            )}
          </div>

          {/* Gesture Instruction Banner */}
          {selectedRoom && isScanning && !lastScanned && (
            <div style={{
              marginTop: '1.5rem',
              width: '100%', maxWidth: '380px',
              background: 'rgba(0,230,118,0.06)',
              border: '1.5px solid rgba(0,230,118,0.25)',
              borderRadius: '24px',
              padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              animation: 'successPop 0.5s ease-out backwards',
            }}>
              {/* Animated emoji */}
              <div style={{
                fontSize: '3rem', lineHeight: 1, flexShrink: 0,
                animation: 'gestureShake 1.8s ease-in-out infinite',
                display: 'inline-block',
              }}>
                {gesture.emoji}
              </div>
              <div>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,230,118,0.6)' }}>
                  ทำท่าทางนี้ก่อนสแกน
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {gesture.label}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8892b0', fontWeight: 500 }}>
                  {gesture.hint}
                </p>
              </div>
              {/* Pulsing dot */}
              <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#00e676',
                  boxShadow: '0 0 0 4px rgba(0,230,118,0.2)',
                  animation: 'pulseLive 1.4s ease-in-out infinite',
                }} />
              </div>
            </div>
          )}

          <div className="glass-panel" style={{ marginTop: '1.5rem', borderRadius: '24px', padding: '1.5rem', width: '100%', maxWidth: '380px' }}>
            <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 500 }}>โหมดจำลองการสแกนใบหน้า</p>
            <form onSubmit={simulateScan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล..."
                disabled={!isScanning || !selectedRoom}
                style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0, 230, 118, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button 
                type="submit" 
                disabled={!isScanning || !selectedRoom || isLocating} 
                className={isScanning && selectedRoom && !isLocating ? 'glow-btn' : ''}
                style={{ 
                  padding: '1rem', 
                  background: (isScanning && selectedRoom && !isLocating) ? 'linear-gradient(135deg, #00c853, #00e676)' : 'rgba(255,255,255,0.05)', 
                  color: (isScanning && selectedRoom) ? 'white' : '#596a84', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  cursor: (isScanning && selectedRoom && !isLocating) ? 'pointer' : 'not-allowed', 
                  boxShadow: (isScanning && selectedRoom && !isLocating) ? '0 4px 14px rgba(0,230,118,0.2)' : 'none', 
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isLocating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                    กำลังประมวลผลพิกัด...
                  </span>
                ) : ((isScanning && selectedRoom) ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    เริ่มสแกนใบหน้า
                  </>
                ) : 'รอการเปิดระบบ...')}
              </button>
            </form>
          </div>
        </div>

        {/* Scan Log/Sidebar Area */}
        <div className="glass-panel" style={{ flex: '1 1 300px', borderRadius: '32px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
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
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)', animation: 'successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: log.status === 'success' ? 'linear-gradient(135deg, #00c853, #00e676)' : 'linear-gradient(135deg, #ff9100, #ff6d00)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: log.status === 'success' ? '0 4px 12px rgba(0,230,118,0.3)' : '0 4px 12px rgba(255,145,0,0.3)' }}>
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
