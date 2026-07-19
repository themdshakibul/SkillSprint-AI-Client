'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { ReactNode } from 'react';

const dashboardRoutes = ['/dashboard', '/dashboard/analytics', '/dashboard/ai-chat', '/dashboard/analyze-document', '/items/add', '/items/manage', '/profile', '/admin', '/orders'];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = dashboardRoutes.includes(pathname);

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
