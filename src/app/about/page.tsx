import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const stats = [
  { value: '200+', label: 'Expert Mentors', icon: 'people' },
  { value: '500+', label: 'Services', icon: 'star' },
  { value: '5,000+', label: 'Learners', icon: 'chart' },
  { value: '95%', label: 'Satisfaction', icon: 'heart' },
];

const values = [
  {
    title: 'AI-First Approach',
    description: 'We leverage artificial intelligence to provide personalized learning recommendations and content generation.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Quality Mentorship',
    description: 'Every mentor is verified and vetted to ensure the highest quality learning experience.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Flexible Learning',
    description: 'Micro-services designed for busy professionals. Learn at your own pace, on your schedule.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Community Driven',
    description: 'A supportive community of learners and mentors helping each other grow.',
    gradient: 'from-orange-500 to-rose-500',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="mx-auto text-center mb-16 max-w-3xl">
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">About Us</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                About{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  SkillSprint AI
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                We believe everyone deserves access to expert guidance and AI-powered tools to accelerate their career.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl border border-border/50 bg-background text-center card-hover">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">Our Values</span>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">What We Stand For</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our values shape everything we do — from how we build our platform to how we support our community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="p-6 rounded-2xl border border-border/50 bg-background card-hover">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center shadow-lg`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">{v.title}</h3>
                  </div>
                  <p className="text-base text-muted-foreground">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mx-auto text-center max-w-3xl">
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">Our Mission</span>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Empowering Careers Through AI</h2>
              <p className="text-xl text-muted-foreground mb-6">
                SkillSprint AI was built to bridge the gap between talent and opportunity. We combine the power of artificial intelligence with the wisdom of experienced mentors to create a learning experience that is personal, practical, and transformative.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether you are looking to learn a new skill, advance your career, or share your expertise as a mentor, SkillSprint AI is here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
