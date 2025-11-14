// components/Analytics.tsx
'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();

  // Track VibeCode section views with Vercel Analytics custom events (if you upgrade to paid)
  useEffect(() => {
    // Log VibeCode visits for your own debugging
    if (pathname?.startsWith('/vibecode')) {
      console.log('VibeCode section visited:', pathname);
      
      // If you upgrade to Vercel Analytics paid plan, you can track custom events:
      // track('vibecode_view', { page: pathname });
    }
  }, [pathname]);

  return (
    <>
      <VercelAnalytics 
        mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'}
        debug={process.env.NODE_ENV === 'development'}
      />
      <SpeedInsights />
    </>
  );
}