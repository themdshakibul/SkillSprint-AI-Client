'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FadeIn } from '@/components/shared/FadeIn';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Full-Stack Developer',
    content: 'The AI recommendations helped me find the perfect mentor for React. I went from beginner to building production apps in 3 months.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Data Scientist',
    content: 'SkillSprint AI matched me with an expert who helped me transition from analytics to machine learning. Career-changing experience.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'UI/UX Designer',
    content: 'The micro-service format is perfect for busy professionals. I learned advanced Figma techniques in just a few sessions.',
    rating: 5,
  },
];

export function Testimonials({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">What Learners Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real stories from real people who transformed their careers with SkillSprint AI.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} direction="up" delay={i * 120}>
              <div className="p-8 rounded-2xl border border-border/50 bg-background card-hover flex flex-col">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-border/30">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}