'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn } from '@/components/shared/FadeIn';
import type { Service } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const gradients = [
  'from-indigo-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-rose-500',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-orange-600',
];

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 overflow-hidden">
          <Skeleton className="h-48 rounded-none" />
          <div className="p-6 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-24 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Blog({ id }: { id?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/services?limit=3&sort=newest`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setServices(data.data || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id={id} className="py-24">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn direction="up" delay={0}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-3">Latest Insights</h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                Tips, stories, and guides to help you succeed in your learning journey.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="hidden sm:inline-flex">
                View all posts
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </FadeIn>

        {loading ? (
          <BlogSkeleton />
        ) : services.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground text-sm">No insights yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <FadeIn key={service._id} direction="up" delay={i * 120}>
                <Link href={`/services/${service._id}`} className="group block">
                  <div className="rounded-2xl border border-border/50 bg-background overflow-hidden card-hover flex flex-col h-full">
                    <div className={`h-48 bg-gradient-to-br ${gradients[i % gradients.length]} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)] opacity-20" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-indigo-400">{service.category}</span>
                        <span className="text-xs text-muted-foreground">&bull;</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(service.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                        {service.shortDesc}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 self-start mt-4">
                        Read article
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}