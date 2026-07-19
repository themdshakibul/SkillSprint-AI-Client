'use client';

import { FadeIn } from '@/components/shared/FadeIn';

const stats = [
  { value: '200+', label: 'Expert Mentors' },
  { value: '500+', label: 'Services' },
  { value: '5,000+', label: 'Learners' },
  { value: '95%', label: 'Satisfaction' },
];

export function Statistics({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 relative overflow-hidden bg-gradient-to-r from-indigo-500/[0.03] via-purple-500/[0.03] to-pink-500/[0.03]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join a growing community of learners and mentors achieving more together.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} direction="up" delay={i * 100}>
              <div className="text-center p-6 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm">
                <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}