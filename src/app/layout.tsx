import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'SchoolCheck Dashboard',
  description: 'A beautiful dashboard for SchoolCheck',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-container">
          <Sidebar />
          <div className="main-wrapper">
            <Header />
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
