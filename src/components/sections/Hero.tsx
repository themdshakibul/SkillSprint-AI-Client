'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/FadeIn';

export function Hero({ id }: { id?: string }) {
  return (
    <section id={id} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-500/[0.02] via-transparent to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/8 rounded-full blur-[160px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[200px]" />

      <div className="relative z-10 px-6 sm:px-8 lg:px-12 text-center">
        <FadeIn direction="none" delay={0}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-500 dark:text-indigo-400 text-sm font-semibold tracking-wide mb-10 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all duration-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            AI-Powered Skill Marketplace
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={100}>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-6">
            Find Experts,{' '}
            <span className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Level Up Skills
            </span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" delay={200}>
          <p className="text-xl sm:text-2xl text-muted-foreground/80 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover micro-services from top mentors. Get AI-powered recommendations
            tailored to your goals. Learn faster, grow smarter.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/explore">
              <Button variant="gradient" size="xl" className="shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all duration-500 scale-100 hover:scale-105">
                Explore Services
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/register?role=mentor">
              <Button variant="outline" size="xl" className="glass hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-500 border-2">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={400}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm">
            {[
              { value: '200+', label: 'Expert Mentors' },
              { value: '500+', label: 'Services' },
              { value: '5,000+', label: 'Learners' },
              { value: '95%', label: 'Satisfaction' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{s.value}</span>
                <span className="text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}