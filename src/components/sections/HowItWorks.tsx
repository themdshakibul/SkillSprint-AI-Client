'use client';

import { FadeIn } from '@/components/shared/FadeIn';

const steps = [
  {
    number: '1',
    title: 'Set Your Goals',
    description: 'Tell us what you want to learn or achieve. Our AI analyzes your profile to find the best path forward.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    number: '2',
    title: 'Get Matched',
    description: 'Receive personalized recommendations for services and mentors that align with your unique goals.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '3',
    title: 'Learn & Grow',
    description: 'Book sessions, track your progress, and level up with AI-powered insights every step of the way.',
    color: 'from-emerald-500 to-teal-500',
  },
];

export function HowItWorks({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Accelerate your career in three simple steps.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.number} direction="up" delay={i * 150}>
              <div className="relative p-8 rounded-2xl border border-border/50 bg-background card-hover text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[75%] h-px bg-gradient-to-r from-primary/30 to-transparent -z-10" />
                )}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}