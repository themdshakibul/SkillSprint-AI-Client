'use client';

import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServiceCardSkeleton } from '@/components/shared/ServiceCard';
import { ExploreContent } from './ExploreContent';

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <Suspense fallback={<ExploreFallback />}>
            <ExploreContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ExploreFallback() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-1" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
