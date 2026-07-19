'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/shared/FadeIn';

const faqs = [
  {
    q: 'How does the AI recommendation engine work?',
    a: 'Our AI analyzes your goals, skills, and past interactions to match you with the best mentors and services. It improves over time as you use the platform.',
  },
  {
    q: 'How are mentors verified?',
    a: 'Every mentor goes through a verification process including skill assessment, portfolio review, and background check to ensure quality.',
  },
  {
    q: 'Can I get a refund if I am not satisfied?',
    a: 'Yes. If a service does not meet expectations, you can request a refund within 48 hours.',
  },
  {
    q: 'How do I become a mentor?',
    a: 'Sign up, complete your profile with your skills and experience, and start listing your services. Our AI helps you create professional service descriptions.',
  },
  {
    q: 'Is there a free trial?',
    a: 'New users get 3 free consultation credits to try any service before committing to paid sessions.',
  },
];

export function FAQ({ id }: { id?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-3xl">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about SkillSprint AI.</p>
          </div>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} direction="up" delay={i * 80}>
              <div
                className={`rounded-2xl border transition-all duration-300 ${
                  openIndex === i ? 'border-primary/20 bg-card shadow-sm' : 'border-border/40 bg-background hover:border-muted-foreground/20'
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold gap-4"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="text-sm">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180 text-primary' : 'text-muted-foreground'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`grid transition-all duration-300 ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
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