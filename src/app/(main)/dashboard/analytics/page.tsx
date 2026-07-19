'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn } from '@/components/shared/FadeIn';
import { useAuth } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface AnalyticsData {
  totalViews: number;
  bookings: number;
  revenue: number;
  servicesCount: number;
  ordersCount: number;
}

export default function AnalyticsPage() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE}/services/analytics`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground text-sm mt-1">Track your service performance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-16" /> : (
                    <p className="text-2xl font-bold">{data?.servicesCount ?? 0}</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-16" /> : (
                    <p className="text-2xl font-bold">{data?.bookings ?? 0}</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-16" /> : (
                    <p className="text-2xl font-bold">${data?.revenue ?? 0}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-48 w-full rounded-lg" />
                  ) : data && data.servicesCount > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Active Services</p>
                        <p className="text-xl font-bold mt-1">{data.servicesCount}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-xl font-bold mt-1">{data.ordersCount}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                      {user?.role === 'mentor' || user?.role === 'admin'
                        ? 'Analytics data will appear once you have service interactions'
                        : 'Analytics are available for mentors and admins'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
