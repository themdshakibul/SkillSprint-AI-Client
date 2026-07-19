'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!sessionId) {
      setStatus('success');
      return;
    }
    fetch(`${API_BASE}/orders/verify-payment?session_id=${sessionId}`, { credentials: 'include' })
      .then(res => res.ok ? setStatus('success') : setStatus('error'))
      .catch(() => setStatus('success'));
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground">Verifying your payment...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">Your order has been confirmed. You can track its status from your orders page.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Explore More
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
