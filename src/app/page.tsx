import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { AIFeatures } from '@/components/sections/AIFeatures';
import { Categories } from '@/components/sections/Categories';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Statistics } from '@/components/sections/Statistics';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Blog } from '@/components/sections/Blog';
import { Newsletter } from '@/components/sections/Newsletter';
import { FadeIn } from '@/components/shared/FadeIn';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero id="hero" />
        <FadeIn><Features id="features" /></FadeIn>
        <FadeIn delay={100}><AIFeatures id="ai-features" /></FadeIn>
        <FadeIn delay={100}><Categories id="categories" /></FadeIn>
        <FadeIn delay={100}><HowItWorks id="how-it-works" /></FadeIn>
        <FadeIn delay={100}><Statistics id="statistics" /></FadeIn>
        <FadeIn delay={100}><Testimonials id="testimonials" /></FadeIn>
        <FadeIn delay={100}><FAQ id="faq" /></FadeIn>
        <FadeIn delay={100}><Blog id="blog" /></FadeIn>
        <FadeIn delay={100}><Newsletter id="newsletter" /></FadeIn>
      </main>
      <Footer />
    </>
  );
}
