"use client";

import React, { useState, useRef } from 'react';

interface AnimatedPasswordInputProps {
  label?: string;
  placeholder?: string;
  passwordValue?: string;
  onPasswordChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export default function AnimatedPasswordInput({ 
  label = "รหัสผ่าน", 
  placeholder = "••••••••",
  passwordValue,
  onPasswordChange,
  onFocus,
  onBlur,
  onVisibilityChange
}: AnimatedPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalPassword, setInternalPassword] = useState('');
  const password = passwordValue !== undefined ? passwordValue : internalPassword;
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalPassword(val);
    onPasswordChange?.(val);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // คำนวณความแข็งแกร่งของรหัสผ่าน (แค่ตัวอย่าง Visual Effect)
  const strength = password.length > 0 ? Math.min(password.length / 8, 1) : 0;
  const strengthColor = strength < 0.33 ? '#ef5350' : strength < 0.66 ? '#ffa726' : '#66bb6a';

  return (
    <div className="animated-password-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.2rem', paddingRight: '0.2rem' }}>
        <label style={{ 
          fontSize: '0.95rem', 
          fontWeight: 600, 
          color: isFocused ? '#2e7d32' : '#4caf50',
          transition: 'color 0.3s ease'
        }}>
          {label}
        </label>
        <a href="#" style={{ fontSize: '0.85rem', color: '#4caf50', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#1b5e20'} onMouseOut={e => e.currentTarget.style.color = '#4caf50'}>
          ลืมรหัสผ่าน?
        </a>
      </div>

      <div style={{ position: 'relative', perspective: '1000px' }}>
        {/* Animated Glow Border */}
        <div style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '18px',
          backgroundImage: isFocused 
            ? `linear-gradient(120deg, #81c784, #4caf50, #81c784)` 
            : 'none',
          backgroundColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: isFocused ? 'gradientMove 3s ease infinite' : 'none',
          opacity: isFocused ? 0.7 : 0,
          transition: 'opacity 0.4s ease, background-image 0.4s ease',
          zIndex: 0,
          filter: 'blur(4px)'
        }}></div>

        {/* Input Container */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: isFocused ? '#ffffff' : 'rgba(255,255,255,0.8)',
          border: `2px solid ${isFocused ? '#4caf50' : 'rgba(129, 199, 132, 0.3)'}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isFocused ? '0 8px 16px rgba(76, 175, 80, 0.15)' : 'none',
          overflow: 'hidden'
        }}>
          {/* Lock Icon */}
          <div style={{ 
            paddingLeft: '16px', 
            color: isFocused ? '#4caf50' : '#81c784',
            display: 'flex',
            transition: 'all 0.3s ease',
            transform: isFocused ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <input 
            ref={inputRef}
            type={showPassword ? 'text' : 'password'} 
            placeholder={placeholder}
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => { setIsFocused(true); onFocus?.(); }}
            onBlur={() => { setIsFocused(false); onBlur?.(); }}
            style={{ 
              width: '100%', 
              padding: '1rem',
              background: 'transparent', 
              border: 'none',
              fontSize: '1.1rem', 
              color: '#1b5e20', 
              fontWeight: 500, 
              letterSpacing: showPassword || password.length === 0 ? 'normal' : '0.2em',
              outline: 'none',
              transition: 'letter-spacing 0.3s ease'
            }}
          />

          {/* Eye Button with Animation */}
          <button 
            type="button"
            onClick={() => { const s = !showPassword; setShowPassword(s); onVisibilityChange?.(s); }}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
            style={{ 
              background: 'none', 
              border: 'none', 
              color: showPassword ? '#4caf50' : '#a5d6a7', 
              cursor: 'pointer', 
              padding: '0 16px',
              height: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              transform: showPassword ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div style={{ position: 'relative', width: 20, height: 20 }}>
              {/* Eye Open Path */}
              <svg 
                style={{ 
                  position: 'absolute', inset: 0, 
                  opacity: showPassword ? 1 : 0, 
                  transform: showPassword ? 'rotate(0deg) scale(1)' : 'rotate(-45deg) scale(0.5)',
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }} 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {/* Eye Closed Path */}
              <svg 
                style={{ 
                  position: 'absolute', inset: 0, 
                  opacity: showPassword ? 0 : 1, 
                  transform: showPassword ? 'rotate(45deg) scale(0.5)' : 'rotate(0deg) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }} 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                <line x1="2" y1="2" x2="22" y2="22"></line>
              </svg>
            </div>
          </button>
        </div>

        {/* Password Strength Indicator */}
        <div style={{
          height: '4px',
          width: '100%',
          background: 'rgba(129, 199, 132, 0.2)',
          borderRadius: '0 0 8px 8px',
          position: 'absolute',
          bottom: '0px',
          left: 0,
          overflow: 'hidden',
          zIndex: 2,
          opacity: isFocused && password.length > 0 ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          <div style={{
            height: '100%',
            width: `${strength * 100}%`,
            background: strengthColor,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease',
            boxShadow: `0 0 8px ${strengthColor}`
          }}></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
}
