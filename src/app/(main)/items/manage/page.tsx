'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Service } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function ManageItemsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/services/me`, { credentials: 'include' });
      const data = await res.json();
      setServices(data.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id: string, title: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success(`"${title}" deleted successfully`);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">My Services</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your service listings</p>
              </div>
              <Button onClick={() => router.push('/items/add')}>Add New Service</Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-4">No services yet</p>
                <Button onClick={() => router.push('/items/add')}>Create Your First Service</Button>
              </div>
            ) : (
              <div className="space-y-3">
                  {services.map((service) => (
                  <Card key={service._id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {service.images[0] && (
                            <img src={service.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              service.approved
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {service.approved ? 'APPROVED' : 'PENDING'}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold truncate">{service.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{service.shortDesc}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="text-indigo-400 font-medium">{service.category}</span>
                            <span>${service.price}</span>
                            <span>{service.duration} min</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span>{service.ratingAvg} ({service.ratingCount})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/services/${service._id}`)}>View</Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(service)}>Delete</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>

        <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open && !deleting) setDeleteTarget(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteTarget!._id, deleteTarget!.title)} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </ProtectedRoute>
  );
}
