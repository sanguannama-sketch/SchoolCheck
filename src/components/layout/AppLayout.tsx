"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ตรวจสอบว่าหน้าปัจจุบันคือหน้า Login หรือสแกนเช็คอินหรือไม่
  const isPublicRoute = ['/login', '/scan'].includes(pathname || '');
  if (isPublicRoute) {
    return <main>{children}</main>;
  }

  // สำหรับหน้าอื่นๆ ให้แสดง UI ปกติ (Sidebar + Header)
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
