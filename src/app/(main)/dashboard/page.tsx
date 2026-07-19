'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { ServiceCard, ServiceCardSkeleton } from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn } from '@/components/shared/FadeIn';
import { useAuth } from '@/lib/auth';
import type { Service, Order } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface Recommendation {
  title: string;
  reason: string;
  matchScore: number;
  addressesGoal: string;
}

interface MentorStats {
  servicesCount: number;
  ordersCount: number;
  revenue: number;
}

interface BuyerStats {
  ordersCount: number;
  totalSpent: number;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

const recentStatuses: Record<string, string> = {
  completed: 'was completed',
  paid: 'was paid',
  pending: 'was placed',
  cancelled: 'was cancelled',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isMentor = user?.role === 'mentor' || user?.role === 'admin';

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [topServices, setTopServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mentorStats, setMentorStats] = useState<MentorStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const calls: Promise<Response>[] = [
        fetch(`${API_BASE}/ai/recommendations`, { credentials: 'include' }),
        fetch(`${API_BASE}/orders/me`, { credentials: 'include' }),
      ];

      if (isMentor) {
        calls.push(fetch(`${API_BASE}/services/stats`, { credentials: 'include' }));
      }

      const [recRes, ordersRes, ...rest] = await Promise.all(calls);

      if (recRes.ok) {
        const data = await recRes.json();
        setRecommendations(data.recommendations || []);
        setTopServices(data.topServices || []);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data || []);
      }

      if (isMentor && rest[0]?.ok) {
        const data = await rest[0].json();
        setMentorStats(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [isMentor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const buyerStats: BuyerStats = {
    ordersCount: orders.length,
    totalSpent: orders
      .filter(o => o.status === 'completed' && typeof o.serviceId === 'object')
      .reduce((sum, o) => sum + ((o.serviceId as any)?.price || 0), 0),
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name || 'User'}</p>
            </div>
          </FadeIn>

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              <FadeIn delay={50}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {isMentor ? (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">My Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{mentorStats?.servicesCount ?? 0}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Orders Received</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{mentorStats?.ordersCount ?? 0}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">${mentorStats?.revenue ?? 0}</p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Orders Placed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{buyerStats.ordersCount}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">${buyerStats.totalSpent}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1.5">
                            {user?.goals?.length ? user.goals.map((g, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">{g}</span>
                            )) : <span className="text-xs text-muted-foreground">No goals set</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium capitalize">{user?.role || 'User'}</span>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/[0.02]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {isMentor ? (
                        <>
                          <Button variant="gradient" className="w-full" onClick={() => router.push('/items/add')}>Add Service</Button>
                          <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/ai-chat')}>AI Chat</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="gradient" className="w-full" onClick={() => router.push('/explore')}>Browse Services</Button>
                          <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/analytics')}>View Analytics</Button>
                        </>
                      )}
                      <Button variant="outline" className="w-full" onClick={() => router.push('/orders')}>View Orders</Button>
                    </CardContent>
                  </Card>
                </div>
              </FadeIn>

              <FadeIn delay={100}>
                {recommendations.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h2 className="text-lg font-bold">AI Recommendations</h2>
                      <span className="text-xs text-muted-foreground">Based on your profile</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendations.map((rec, i) => (
                        <Card key={i} className="border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm font-semibold">{rec.title}</CardTitle>
                              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{rec.matchScore}%</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                            <p className="text-xs text-indigo-400">Goal: {rec.addressesGoal}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </FadeIn>

              <FadeIn delay={150}>
                {topServices.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold">Top Services</h2>
                      <Button variant="outline" onClick={() => router.push('/explore')}>View all</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {topServices.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                    </div>
                  </div>
                )}
              </FadeIn>

              <FadeIn delay={200}>
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Orders</h2>
                    {orders.length > 0 && (
                      <Button variant="outline" onClick={() => router.push('/orders')}>View all</Button>
                    )}
                  </div>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground text-sm mb-3">No orders yet</p>
                      <Button variant="gradient" onClick={() => router.push('/explore')}>
                        {isMentor ? 'Create a service' : 'Browse Services'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {recentOrders.map((order) => {
                        const svc = order.serviceId as any;
                        return (
                          <Card key={order._id} className="border border-border/40 hover:border-border transition-colors cursor-pointer" onClick={() => router.push(`/services/${svc?._id || ''}`)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-2 h-2 rounded-full bg-primary/30 shrink-0" />
                                  <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full shrink-0 ${getStatusColor(order.status)}`}>
                                    {order.status.toUpperCase()}
                                  </span>
                                  <p className="text-sm font-medium truncate">
                                    {svc?.title || 'Service'}
                                  </p>
                                  <span className="text-xs text-muted-foreground hidden sm:inline">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {svc?.price && (
                                    <span className="text-sm font-semibold text-indigo-400">${svc.price}</span>
                                  )}
                                  <svg className="w-4 h-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </FadeIn>
            </>
          )}
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}