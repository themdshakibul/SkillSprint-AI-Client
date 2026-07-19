'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from './DashboardSidebar';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';

interface DashboardShellProps {
  children: ReactNode;
  pathname: string;
  hideMobileTrigger?: boolean;
}

export function DashboardShell({ children, pathname, hideMobileTrigger }: DashboardShellProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const openMobile = () => setMobileSidebar(true);
  const closeMobile = () => setMobileSidebar(false);

  const handleNav = (href: string) => {
    setMobileSidebar(false);
    router.push(href);
  };

  if (typeof window !== 'undefined') {
    (window as any).__dashboardOpenMobile = openMobile;
  }

  return (
     <div className="flex min-h-screen">
      {/* Desktop sidebar - sticky */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto border-r border-border/40 bg-background p-3">
          <DashboardSidebar pathname={pathname} onNav={handleNav} />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-56 bg-background border-r border-border p-4 pt-6">
            <DashboardSidebar pathname={pathname} onNav={handleNav} />
          </div>
        </div>
      )}

       {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* User Profile Header for Mobile */}
        <div className="lg:hidden px-4 sm:px-6 lg:px-8 pt-4 pb-2 border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="CurrentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
