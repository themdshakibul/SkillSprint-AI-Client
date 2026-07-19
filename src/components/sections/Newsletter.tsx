'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/shared/FadeIn';

export function Newsletter({ id }: { id?: string }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed! Check your inbox for updates.');
      setEmail('');
    }
  };

  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn direction="up" delay={0}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_white_0%,_transparent_50%)] opacity-10" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Stay Ahead with SkillSprint AI
              </h2>
              <p className="text-indigo-200 max-w-lg mx-auto mb-8 text-lg">
                Get weekly AI-powered learning tips, new service alerts, and exclusive mentor insights.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-indigo-200 focus-visible:border-white/40 focus-visible:ring-white/30"
                />
                <Button type="submit" size="lg" className="rounded-xl h-12 px-6 bg-white text-indigo-700 hover:bg-white/90 hover:text-indigo-800 shadow-lg">
                  Subscribe
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}