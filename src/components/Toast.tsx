"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const toastConfig: Record<ToastType, { icon: JSX.Element; bg: string; border: string; color: string; glow: string }> = {
  success: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    bg: 'rgba(232, 245, 233, 0.95)',
    border: 'rgba(76, 175, 80, 0.4)',
    color: '#2e7d32',
    glow: 'rgba(76, 175, 80, 0.15)',
  },
  error: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    bg: 'rgba(255, 235, 238, 0.95)',
    border: 'rgba(211, 47, 47, 0.4)',
    color: '#c62828',
    glow: 'rgba(211, 47, 47, 0.15)',
  },
  warning: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    bg: 'rgba(255, 248, 225, 0.95)',
    border: 'rgba(245, 124, 0, 0.4)',
    color: '#e65100',
    glow: 'rgba(245, 124, 0, 0.15)',
  },
  info: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    bg: 'rgba(227, 242, 253, 0.95)',
    border: 'rgba(25, 118, 210, 0.4)',
    color: '#1565c0',
    glow: 'rgba(25, 118, 210, 0.15)',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 400);
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '92%',
          maxWidth: '420px',
          pointerEvents: 'none',
        }}>
          {toasts.map((toast) => {
            const cfg = toastConfig[toast.type];
            return (
              <div
                key={toast.id}
                onClick={() => dismissToast(toast.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1rem 1.25rem',
                  background: cfg.bg,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: '18px',
                  boxShadow: `0 12px 32px ${cfg.glow}, 0 4px 12px rgba(0,0,0,0.06)`,
                  color: cfg.color,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  animation: toast.exiting
                    ? 'toastSlideOut 0.4s cubic-bezier(0.6, -0.28, 0.74, 0.05) forwards'
                    : 'toastSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                {/* Icon */}
                <div style={{
                  flexShrink: 0,
                  width: '40px', height: '40px',
                  borderRadius: '12px',
                  background: `${cfg.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cfg.icon}
                </div>

                {/* Message */}
                <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>
                  {toast.message}
                </div>

                {/* Close */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>

                {/* Progress bar */}
                {!toast.exiting && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: '12px', right: '12px',
                    height: '3px',
                    borderRadius: '0 0 18px 18px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      background: cfg.color,
                      opacity: 0.35,
                      borderRadius: '3px',
                      animation: 'toastProgress 3.5s linear forwards',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastSlideIn {
          0% { transform: translateY(-120%) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes toastSlideOut {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120%) scale(0.9); opacity: 0; }
        }
        @keyframes toastProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}} />
    </ToastContext.Provider>
  );
}
