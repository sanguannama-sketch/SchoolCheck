"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem',
      backgroundColor: '#f4fbf4',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(129, 199, 132, 0.25) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(200, 247, 197, 0.4) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(46, 125, 50, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(76, 175, 80, 0.2) 0px, transparent 50%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Blur Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', background: 'rgba(129, 199, 132, 0.4)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, animation: 'float 8s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '350px', height: '350px', background: 'rgba(67, 160, 71, 0.3)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, animation: 'float 10s ease-in-out infinite reverse' }}></div>

      <div style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '32px',
        padding: '3rem',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 24px 48px rgba(27, 94, 32, 0.12), inset 0 1px 0 rgba(255,255,255,1)',
        animation: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards',
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
            width: '72px', height: '72px', borderRadius: '22px', 
            background: 'linear-gradient(135deg, #1b5e20, #4caf50)', 
            color: 'white', fontSize: '2rem', fontWeight: 800, 
            boxShadow: '0 12px 28px rgba(27, 94, 32, 0.35), inset 0 2px 0 rgba(255,255,255,0.2)',
            marginBottom: '1.5rem',
            position: 'relative'
          }}>
            SC
            <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}></div>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1b5e20', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            ยินดีต้อนรับ
          </h1>
          <p style={{ color: '#4caf50', fontSize: '1rem', fontWeight: 500 }}>
            เข้าสู่ระบบจัดการ SchoolCheck
          </p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2e7d32', paddingLeft: '0.2rem' }}>อีเมล</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#81c784', pointerEvents: 'none', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </div>
              <input 
                type="email" 
                placeholder="teacher@school.com" 
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3rem',
                  background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(129, 199, 132, 0.3)',
                  borderRadius: '16px', fontSize: '1rem', color: '#1b5e20', fontWeight: 500,
                  transition: 'all 0.3s ease', outline: 'none'
                }}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#4caf50'; e.target.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.1)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.8)'; e.target.style.borderColor = 'rgba(129, 199, 132, 0.3)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.2rem', paddingRight: '0.2rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2e7d32' }}>รหัสผ่าน</label>
              <Link href="#" style={{ fontSize: '0.85rem', color: '#4caf50', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#1b5e20'} onMouseOut={e => e.currentTarget.style.color = '#4caf50'}>
                ลืมรหัสผ่าน?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#81c784', pointerEvents: 'none', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={{ 
                  width: '100%', padding: '1rem 3rem',
                  background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(129, 199, 132, 0.3)',
                  borderRadius: '16px', fontSize: '1.1rem', color: '#1b5e20', fontWeight: 500, letterSpacing: showPassword ? 'normal' : '0.2em',
                  transition: 'all 0.3s ease', outline: 'none'
                }}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#4caf50'; e.target.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.1)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.8)'; e.target.style.borderColor = 'rgba(129, 199, 132, 0.3)'; e.target.style.boxShadow = 'none'; }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', 
                  background: 'none', border: 'none', color: showPassword ? '#4caf50' : '#a5d6a7', cursor: 'pointer', padding: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          
          <Link 
            href="/" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem',
              padding: '1.1rem', marginTop: '1rem',
              background: 'linear-gradient(135deg, #2e7d32, #43a047)',
              color: 'white', fontSize: '1.1rem', fontWeight: 700, 
              borderRadius: '16px', cursor: 'pointer', textDecoration: 'none',
              boxShadow: isHovered ? '0 12px 28px rgba(46, 125, 50, 0.4)' : '0 8px 20px rgba(46, 125, 50, 0.25)',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            เข้าสู่ระบบ
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>

        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
      `}} />
    </div>
  );
}
