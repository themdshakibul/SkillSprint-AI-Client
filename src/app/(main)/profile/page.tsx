'use client';

import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-muted-foreground text-sm mt-1">Your account information</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg bg-indigo-500/10 text-indigo-500">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user?.name || 'User'}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium capitalize">{user?.role || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="text-sm font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user?.skillsInterested?.length ? user.skillsInterested.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{s}</span>
                    )) : (
                      <span className="text-xs text-muted-foreground">No skills listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Goals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user?.goals?.length ? user.goals.map((g, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">{g}</span>
                    )) : (
                      <span className="text-xs text-muted-foreground">No goals set</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
