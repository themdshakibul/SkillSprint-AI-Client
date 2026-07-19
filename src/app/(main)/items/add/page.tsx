'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const categories = [
  'Web Development',
  'AI & Machine Learning',
  'Data Science',
  'Mobile Development',
  'Design & UI/UX',
  'DevOps & Cloud',
  'Career',
];

const outputLengths = ['short', 'medium', 'long'];

export default function AddItemPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiLength, setAiLength] = useState('medium');
  const [form, setForm] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    category: '',
    price: '',
    duration: '',
    imageUrl: '',
    tags: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAIGenerate = async () => {
    if (!form.title) {
      toast.error('Please enter a title first');
      return;
    }

    setAiGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/ai/generate-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          category: form.category || undefined,
          length: aiLength,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.shortDesc) updateField('shortDesc', data.shortDesc);
      if (data.fullDesc) updateField('fullDesc', data.fullDesc);
      if (data.tags) updateField('tags', data.tags.join(', '));

      toast.success('AI content generated');
    } catch (err: any) {
      toast.error(err.message || 'AI generation failed. Try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.shortDesc || !form.fullDesc || !form.category || !form.price || !form.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          shortDesc: form.shortDesc,
          fullDesc: form.fullDesc,
          category: form.category,
          price: parseFloat(form.price),
          duration: form.duration,
          images: form.imageUrl ? [form.imageUrl] : [],
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create service');
      }

      await fetch(`${API_BASE}/ai/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'order_created',
          payload: { title: form.title, category: form.category },
        }),
      });

      toast.success('Service created successfully');
      router.push('/items/manage');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="mb-6 border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Content Generator
                </CardTitle>
                <CardDescription className="text-xs">Generate professional descriptions, tags, and FAQ with AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Select value={aiLength} onValueChange={(v) => setAiLength(v || 'medium')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Output length" />
                      </SelectTrigger>
                      <SelectContent>
                        {outputLengths.map(l => (
                          <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAIGenerate} disabled={aiGenerating || !form.title} className="whitespace-nowrap">
                    {aiGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      'Generate with AI'
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleAIGenerate} disabled={aiGenerating || !form.title} title="Regenerate">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g., React Component Debugging" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Textarea id="shortDesc" placeholder="Brief overview (max 200 chars)" value={form.shortDesc} onChange={(e) => updateField('shortDesc', e.target.value)} maxLength={200} required className="resize-none" />
                <p className="text-xs text-muted-foreground text-right">{form.shortDesc.length}/200</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDesc">Full Description *</Label>
                <Textarea id="fullDesc" placeholder="Detailed description of your service..." value={form.fullDesc} onChange={(e) => updateField('fullDesc', e.target.value)} required className="min-h-[120px]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={(v) => updateField('category', v || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input id="price" type="number" min="0" step="5" placeholder="50" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min) *</Label>
                  <Input id="duration" type="number" min="15" step="15" placeholder="60" value={form.duration} onChange={(e) => updateField('duration', e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input id="imageUrl" type="url" placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="react, debugging, javascript" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} />
              </div>

              <Separator />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Submit Service'}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
