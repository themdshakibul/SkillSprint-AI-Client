'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface Analysis {
  summary: string;
  keyPoints: string[];
  suggestions: string[];
  skills: string[];
  topics: string[];
}

const steps = ['Uploading file', 'Extracting content', 'Analyzing document', 'Generating insights'];

export default function AnalyzeDocumentPage() {
  const pathname = usePathname();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    setFile(f);
    setAnalysis(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setStep(0);
    setAnalysis(null);

    const interval = setInterval(() => {
      setStep(prev => Math.min(prev + 1, 3));
    }, 800);

    try {
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      if (content.length < 1) {
        throw new Error('File appears empty. Try a different file.');
      }
      if (content.length > 48000) {
        toast.warning('File is large. Analyzing first 48000 characters.');
      }

      const res = await fetch(`${API_BASE}/ai/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: content.slice(0, 48000),
          fileName: file.name,
          fileType: file.type || 'text/plain',
        }),
      });

      clearInterval(interval);
      setStep(3);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Analysis failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAnalysis(data);
      toast.success('Document analyzed successfully');
    } catch (err: any) {
      clearInterval(interval);
      toast.error(err.message || 'Analysis failed. Try a text-based file.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardShell pathname={pathname}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">AI Document Intelligence</h1>
            <p className="text-muted-foreground text-sm mt-1">Upload any document for real-time AI-powered analysis</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Upload Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 px-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-border hover:border-indigo-500/40'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  dragOver ? 'bg-indigo-500/20' : 'bg-muted'
                }`}>
                  <svg className={`w-6 h-6 ${dragOver ? 'text-indigo-400' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {file ? file.name : 'Drop your file here or click to browse'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {file
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : 'PDF, DOCX, TXT, CSV, JSON, MD, HTML — max 5MB'}
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.csv,.json,.md,.html"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  className="hidden"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAnalyze} disabled={!file || analyzing} className="rounded-xl">
                  {analyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Now'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {analyzing && (
            <Card className="mb-8 border-indigo-500/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        step > i
                          ? 'bg-emerald-500 text-white'
                          : step === i
                          ? 'bg-indigo-500 text-white animate-pulse'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step > i ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className="text-[10px] font-bold">{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${
                        step > i ? 'text-emerald-500' : step === i ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {s}
                      </span>
                      {step === i && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {analysis.keyPoints.map((point, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {analysis.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Detected Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.skills.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.topics.map((topic, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
