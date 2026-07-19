'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardSidebar } from '@/components/shared/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import type { Order } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<'buyer' | 'mentor'>('buyer');

  const fetchOrders = async (mode: 'buyer' | 'mentor') => {
    setLoading(true);
    try {
      const endpoint = mode === 'buyer' ? '/orders/me' : '/orders/mentor';
      const res = await fetch(`${API_BASE}${endpoint}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(viewMode);
  }, [viewMode]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handlePay = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/create-checkout-session`, {
        method: 'POST', credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to create checkout session');
      const data = await res.json();
      if (!data.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch {
      toast.error('Failed to initiate payment');
    }
  };

  const handleNav = (href: string) => {
    setMobileSidebar(false);
    router.push(href);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="hidden lg:flex flex-col border-r border-border/40 bg-background w-56 flex-shrink-0">
          <div className="flex-1 overflow-y-auto p-3">
            <DashboardSidebar pathname={pathname} onNav={handleNav} />
          </div>
        </div>

        {mobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-56 bg-background border-r border-border p-4 pt-6">
              <DashboardSidebar pathname={pathname} onNav={handleNav} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
              onClick={() => setMobileSidebar(true)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Dashboard Menu</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your bookings and requests</p>
              </div>
              
              {user?.role === 'mentor' && (
                <div className="flex bg-muted p-1 rounded-lg">
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'buyer' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setViewMode('buyer')}
                  >
                    My Bookings
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'mentor' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setViewMode('mentor')}
                  >
                    Incoming Orders
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-4">No orders found</p>
                {viewMode === 'buyer' && (
                  <Button onClick={() => router.push('/explore')}>Explore Services</Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order._id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="text-base font-semibold truncate mb-1">
                            {order.serviceId?.title || 'Unknown Service'}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <span>${order.serviceId?.price}</span>
                            <span>•</span>
                            <span>{order.serviceId?.duration} mins</span>
                            {order.scheduledAt && (
                              <>
                                <span>•</span>
                                <span>Scheduled: {new Date(order.scheduledAt).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                          
                          {viewMode === 'mentor' && typeof order.userId === 'object' && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Buyer: </span>
                              <span className="font-medium">{(order.userId as any).name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-4">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => router.push(`/services/${order.serviceId?._id}`)}>View Service</Button>
                          
                          {order.status === 'pending' && viewMode === 'buyer' && (
                            <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handlePay(order._id)}>Pay Now</Button>
                          )}
                          
                          {order.status === 'pending' && viewMode === 'mentor' && (
                            <Button size="sm" className="w-full sm:w-auto" onClick={() => handleStatusUpdate(order._id, 'paid')}>Mark Paid</Button>
                          )}

                          {order.status === 'paid' && viewMode === 'mentor' && (
                            <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusUpdate(order._id, 'completed')}>Mark Completed</Button>
                          )}
                          
                          {(order.status === 'pending' || order.status === 'paid') && (
                            <Button variant="ghost" size="sm" className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleStatusUpdate(order._id, 'cancelled')}>Cancel</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
