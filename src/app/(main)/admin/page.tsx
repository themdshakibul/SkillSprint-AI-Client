'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Service, User } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  totalBuyers: number;
  totalServices: number;
  pendingServices: number;
  approvedServices: number;
  totalOrders: number;
  completedOrders: number;
}

type Tab = 'overview' | 'pending' | 'services' | 'users';

function StatCard({ label, value, loading }: { label: string; value: number | string; loading: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{value}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'user' | 'service'; name: string } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
  };

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/services/pending`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPending(data.data || []);
      }
    } catch { /* silent */ }
  };

  const fetchServices = async (status?: string) => {
    try {
      const params = status ? `?status=${status}` : '';
      const res = await fetch(`${API_BASE}/admin/services${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAllServices(data.data || []);
      }
    } catch { /* silent */ }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
      }
    } catch { /* silent */ }
  };

  const loadTab = async (t: Tab) => {
    setTab(t);
    setLoading(true);
    try {
      if (t === 'overview') await fetchStats();
      else if (t === 'pending') await fetchPending();
      else if (t === 'services') await fetchServices();
      else if (t === 'users') await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTab('overview'); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/admin/services/${id}/approve`, {
        method: 'PATCH', credentials: 'include',
      });
      if (!res.ok) throw new Error();
      toast.success('Service approved');
      setPending(prev => prev.filter(s => s._id !== id));
      if (stats) setStats({ ...stats, pendingServices: stats.pendingServices - 1, approvedServices: stats.approvedServices + 1 });
    } catch { toast.error('Failed to approve'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/admin/services/${id}/reject`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) throw new Error();
      toast.success('Service rejected');
      setPending(prev => prev.filter(s => s._id !== id));
      if (stats) setStats({ ...stats, pendingServices: stats.pendingServices - 1 });
    } catch { toast.error('Failed to reject'); }
    finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) throw new Error();
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch { toast.error('Failed to delete user'); }
    finally { setActionLoading(null); }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'pending', label: `Pending${stats?.pendingServices ? ` (${stats.pendingServices})` : ''}` },
    { key: 'services', label: 'All Services' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Full platform management</p>
          </div>

          <div className="flex gap-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => loadTab(t.key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tab === t.key ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={stats?.totalUsers ?? 0} loading={loading} />
              <StatCard label="Mentors" value={stats?.totalMentors ?? 0} loading={loading} />
              <StatCard label="Buyers" value={stats?.totalBuyers ?? 0} loading={loading} />
              <StatCard label="Total Services" value={stats?.totalServices ?? 0} loading={loading} />
              <StatCard label="Approved" value={stats?.approvedServices ?? 0} loading={loading} />
              <StatCard label="Pending" value={stats?.pendingServices ?? 0} loading={loading} />
              <StatCard label="Orders" value={stats?.totalOrders ?? 0} loading={loading} />
              <StatCard label="Completed" value={stats?.completedOrders ?? 0} loading={loading} />
            </div>
          )}

          {tab === 'pending' && (
            <div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
              ) : pending.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm">No pending services. All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map(s => (
                    <Card key={s._id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-semibold">PENDING</span>
                              <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-sm font-semibold truncate">{s.title}</h3>
                            <p className="text-xs text-muted-foreground truncate">{s.shortDesc}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="text-indigo-400 font-medium">{s.category}</span>
                              <span>${s.price}</span>
                              <span>{s.duration} min</span>
                              {typeof s.mentorId === 'object' && <span>by {(s.mentorId as any).name}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(s._id)} disabled={actionLoading === s._id}>
                              {actionLoading === s._id ? '...' : 'Approve'}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(s._id)} disabled={actionLoading === s._id}>
                              {actionLoading === s._id ? '...' : 'Reject'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'services' && (
            <div>
              <div className="flex gap-2 mb-4">
                <Button variant={tab === 'services' ? 'default' : 'outline'} size="sm" onClick={() => fetchServices()}>All</Button>
                <Button variant="outline" size="sm" onClick={() => fetchServices('approved')}>Approved</Button>
                <Button variant="outline" size="sm" onClick={() => fetchServices('pending')}>Pending</Button>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
              ) : allServices.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm">No services found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allServices.map(s => (
                    <Card key={s._id} className="border border-border/40">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            s.approved
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {s.approved ? 'APPROVED' : 'PENDING'}
                          </span>
                          <p className="text-sm font-medium truncate flex-1">{s.title}</p>
                          <span className="text-xs text-muted-foreground">${s.price}</span>
                          {typeof s.mentorId === 'object' && <span className="text-xs text-muted-foreground hidden sm:inline">{(s.mentorId as any).name}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : users.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm">No users found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map(u => (
                    <Card key={u._id} className="border border-border/40">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{u.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {u.role}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                          {u.role !== 'admin' && (
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
                              onClick={() => setDeleteTarget({ id: u._id, type: 'user', name: u.name })}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                {deleteTarget?.type === 'user'
                  ? `Delete user "${deleteTarget?.name}" and all their data? This cannot be undone.`
                  : `Delete service "${deleteTarget?.name}"? This cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                variant="destructive"
                disabled={actionLoading === deleteTarget?.id}
                onClick={async () => {
                  if (!deleteTarget) return;
                  if (deleteTarget.type === 'user') {
                    await handleDeleteUser(deleteTarget.id);
                  }
                  setDeleteTarget(null);
                }}
              >
                {actionLoading === deleteTarget?.id ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </ProtectedRoute>
  );
}