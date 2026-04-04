"use client";

import React, { useEffect, useState } from 'react';

export type MascotState = 'idle' | 'email' | 'password' | 'peek' | 'error';

export default function LoginMascot({ state }: { state: MascotState }) {
  // We use CSS transitions on SVG properties to achieve smooth animations
  const isPassword = state === 'password';
  const isPeek = state === 'peek';
  const isEmail = state === 'email';
  const isError = state === 'error';

  // Base colors
  const skinColor = "#ffb74d";
  const earColor = "#f57c00";
  const noseColor = "#5d4037";

  return (
    <div style={{ 
      width: '120px', 
      height: '120px', 
      position: 'relative', 
      margin: '0 auto',
      overflow: 'visible'
    }}>
      <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <clipPath id="head-clip">
            <circle cx="60" cy="60" r="50" />
          </clipPath>
        </defs>

        {/* Ears */}
        <circle cx="25" cy="25" r="18" fill={skinColor} />
        <circle cx="25" cy="25" r="10" fill={earColor} />
        
        <circle cx="95" cy="25" r="18" fill={skinColor} />
        <circle cx="95" cy="25" r="10" fill={earColor} />

        {/* Head */}
        <circle cx="60" cy="60" r="50" fill={skinColor} />
        
        {/* Face Elements (Clipped inside head) */}
        <g clipPath="url(#head-clip)">
          {/* Eyes Group. Moving pupils based on state */}
          <g style={{ 
            transform: `translate(${isError ? (Math.random() * 4 - 2) : 0}px, ${isEmail ? 8 : isError ? -5 : 0}px)`,
            transition: 'transform 0.3s ease'
          }}>
            {/* Left Eye */}
            <circle cx="40" cy="55" r="8" fill="#fff" />
            <circle 
              cx="40" 
              cy="55" 
              r="4" 
              fill={noseColor} 
              style={{
                transform: `translate(${isEmail ? 0 : 0}px, ${isEmail ? 3 : 0}px)`,
                transition: 'transform 0.2s'
              }}
            />
            {/* Right Eye */}
            <circle cx="80" cy="55" r="8" fill="#fff" />
            <circle 
              cx="80" 
              cy="55" 
              r="4" 
              fill={noseColor} 
              style={{
                transform: `translate(${isEmail ? 0 : 0}px, ${isEmail ? 3 : 0}px)`,
                transition: 'transform 0.2s'
              }}
            />

            {/* Error X eyes overlaid */}
            <g style={{ opacity: isError ? 1 : 0, transition: 'opacity 0.2s' }}>
              <path d="M 35 50 L 45 60 M 45 50 L 35 60" stroke={noseColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M 75 50 L 85 60 M 85 50 L 75 60" stroke={noseColor} strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          {/* Snout */}
          <circle cx="60" cy="75" r="18" fill="#ffe082" />
          
          {/* Nose */}
          <path 
            d="M 50 68 Q 60 65 70 68 Q 65 78 60 78 Q 55 78 50 68 Z" 
            fill={noseColor} 
            style={{
              transform: isEmail ? 'translateY(2px)' : 'translateY(0)',
              transition: 'transform 0.3s ease'
            }}
          />
          
          {/* Mouth */}
          <path 
            d={isError 
              ? "M 52 82 Q 60 76 68 82" 
              : "M 52 80 Q 60 88 68 80"
            } 
            fill="none" 
            stroke={noseColor} 
            strokeWidth="3" 
            strokeLinecap="round" 
            style={{ transition: 'd 0.3s' }}
          />

          {/* Blush */}
          <ellipse cx="28" cy="65" rx="8" ry="4" fill="#ff8a65" opacity="0.6" />
          <ellipse cx="92" cy="65" rx="8" ry="4" fill="#ff8a65" opacity="0.6" />
        </g>

        {/* Arms/Paws (Floating Paws Design) */}
        {/* Left Paw */}
        <g style={{
          transform: isPassword 
            ? 'translate(20px, -35px)'   // Covers left eye (40, 50)
            : isPeek 
              ? 'translate(0px, -20px)'    // Peeks (moved down and left)
              : 'translate(0px, 0px)',     // Idle (20, 85)
          transition: 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}>
          {/* Paw body */}
          <circle cx="20" cy="85" r="14" fill={skinColor} />
          {/* Paw pad */}
          <ellipse cx="20" cy="85" rx="6" ry="4" fill="#ffe082" />
        </g>

        {/* Right Paw */}
        <g style={{
          transform: isPassword || isPeek
            ? 'translate(-20px, -35px)'  // Covers right eye (80, 50)
            : 'translate(0px, 0px)',     // Idle (100, 85)
          transition: 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}>
          {/* Paw body */}
          <circle cx="100" cy="85" r="14" fill={skinColor} />
          {/* Paw pad */}
          <ellipse cx="100" cy="85" rx="6" ry="4" fill="#ffe082" />
        </g>

        {/* Desk or border to give depth to the bear popping out */}
        <path d="M 0 110 L 120 110 L 120 120 L 0 120 Z" fill="rgba(129, 199, 132, 0.4)" rx="5" />
      </svg>
    </div>
  );
}
