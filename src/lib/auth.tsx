'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  googleLogin: (credential: { email: string; name: string; googleId: string; avatar?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get<{ user: User }>('/auth/me');
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string }>('/auth/login', { email, password });
    await fetchUser();
    router.push('/');
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    const res = await api.post<{ token: string }>('/auth/register', { name, email, password, role });
    await fetchUser();
    router.push('/');
  };

  const demoLogin = async () => {
    const res = await api.post<{ token: string }>('/auth/demo');
    await fetchUser();
    router.push('/');
  };

  const googleLogin = async (credential: { email: string; name: string; googleId: string; avatar?: string }) => {
    const res = await api.post<{ token: string }>('/auth/google', credential);
    await fetchUser();
    router.push('/');
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
