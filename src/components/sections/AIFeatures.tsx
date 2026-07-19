'use client';

import { FadeIn } from '@/components/shared/FadeIn';

const aiFeatures = [
  {
    title: 'Smart Recommendations',
    tag: 'AI Engine',
    description: 'Our AI analyzes your goals, skills, and behavior to match you with the perfect mentors and services.',
    gradient: 'from-indigo-500 to-blue-500',
    features: ['Goal-based matching', 'Behavior learning', 'Personalized feed'],
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  },
  {
    title: 'Content Generator',
    tag: 'AI Writer',
    description: 'Mentors can create professional service descriptions, FAQs, and tags in seconds with AI assistance.',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Custom templates', 'Length control', 'One-click regenerate'],
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  },
  {
    title: 'Chat Assistant',
    tag: 'AI Chat',
    description: 'Ask questions naturally. Our AI understands context and provides smart suggestions in real-time.',
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Natural conversation', 'Context-aware', 'Smart suggestions'],
    icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
  },
  {
    title: 'Document Analyzer',
    tag: 'AI Insights',
    description: 'Upload any document and get instant AI analysis — summary, key points, skill detection, and suggestions.',
    gradient: 'from-orange-500 to-rose-500',
    features: ['Instant analysis', 'Skill detection', 'Career suggestions'],
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  },
];

export function AIFeatures({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.45_0.13_264_/_0.04),transparent_60%)]" />
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              Powered by Intelligent AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              4 AI features working together to help you learn, teach, and grow.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {aiFeatures.map((feature, i) => (
            <FadeIn key={feature.title} direction="up" delay={i * 120}>
              <div className="group relative p-6 sm:p-8 rounded-2xl border border-border/50 bg-background card-hover overflow-hidden">
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-sm`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-1.5">
                    {feature.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}