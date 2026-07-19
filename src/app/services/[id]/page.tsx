'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FadeIn } from '@/components/shared/FadeIn';
import { toast } from 'sonner';
import type { Service, Review } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface ServiceDetail {
  service: Service;
  reviews: Review[];
  related: Service[];
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!data?.service) return;
    setBooking(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ serviceId: data.service._id }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Please sign in to book a service');
          router.push('/login');
          return;
        }
        throw new Error('Failed to book service');
      }
      toast.success('Service booked successfully!');
      router.push('/orders');
    } catch {
      toast.error('Failed to book service');
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/services/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Service not found</h2>
          <p className="text-sm text-muted-foreground mb-4">This service might have been removed or does not exist.</p>
          <Button onClick={() => router.push('/explore')}>
            Back to Explore
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const { service, reviews, related } = data;
  const mentor = typeof service.mentorId === 'object' ? service.mentorId : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn>
          <div className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/explore" className="hover:text-foreground">Explore</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {service.images.length > 0 && (
                <div>
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-3">
                    <img
                      src={service.images[selectedImage]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {service.images.length > 1 && (
                    <div className="flex gap-2">
                      {service.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                            i === selectedImage ? 'border-indigo-500' : 'border-transparent'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  <span className="text-sm text-muted-foreground">{service.duration} min</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">{service.title}</h1>
                <p className="text-muted-foreground mb-4">{service.shortDesc}</p>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{service.fullDesc}</p>
                </div>
              </div>

              {service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="border-t border-border/40 pt-6">
                <h2 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const reviewer = typeof review.userId === 'object' ? review.userId : null;
                      return (
                        <div key={review._id} className="flex gap-3 p-4 rounded-xl bg-muted/30">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={reviewer?.avatar} />
                            <AvatarFallback className="text-xs bg-indigo-500/10 text-indigo-500">
                              {reviewer?.name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{reviewer?.name || 'Anonymous'}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-border/50 rounded-xl p-6 sticky top-24">
                <div className="text-3xl font-bold mb-4">${service.price}</div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-medium">{service.ratingAvg}</span>
                      <span className="text-muted-foreground">({service.ratingCount})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{service.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                </div>

                <Button variant="gradient" className="w-full" onClick={handleBook} disabled={booking}>
                  {booking ? 'Booking...' : 'Book This Service'}
                </Button>
              </div>

              {mentor && (
                <div className="border border-border/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-3">About the Mentor</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback className="text-xs bg-indigo-500/10 text-indigo-500">
                        {mentor.name?.charAt(0) || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          </FadeIn>

          {related.length > 0 ? (
            <FadeIn>
              <div className="mt-12 pt-8 border-t border-border/40">
                <h2 className="text-xl font-bold mb-6">Related Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {related.map((s) => (
                    <ServiceCard key={s._id} service={s} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
