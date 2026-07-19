'use client';

import { usePathname } from 'next/navigation';
import { FloatingChat } from './FloatingChat';

const authRoutes = ['/login', '/register'];

export function AuthLayoutWrapper() {
  const pathname = usePathname();
  const isAuth = authRoutes.includes(pathname);

  if (isAuth) return null;

  return <FloatingChat />;
}
