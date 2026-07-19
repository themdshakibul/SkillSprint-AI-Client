'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const contactInfo = [
  {
    label: 'Email',
    value: 'hello@skillsprint.ai',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    label: 'Location',
    value: 'San Francisco, CA',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Response Time',
    value: 'Within 24 hours',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent" />
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="mx-auto text-center mb-16 max-w-3xl">
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">Contact</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Have a question, feedback, or want to become a mentor? We would love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
              <div className="lg:col-span-3">
                <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-background">
                  <h2 className="text-lg font-bold mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" placeholder="John Doe" value={form.name} onChange={(e) => updateField('name', e.target.value)} required className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} required className="h-11 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => updateField('subject', e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" placeholder="Tell us more about your inquiry..." value={form.message} onChange={(e) => updateField('message', e.target.value)} required className="min-h-[150px] rounded-xl" />
                    </div>
                    <Button type="submit" variant="gradient" disabled={sending} size="lg" className="rounded-xl">
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="p-5 rounded-2xl border border-border/50 bg-background card-hover">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg`}>
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{info.label}</p>
                        <p className="text-sm font-semibold">{info.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
