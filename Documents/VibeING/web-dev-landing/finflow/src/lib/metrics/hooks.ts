'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageview } from './service';

/**
 * Hook to automatically track pageviews
 * Usage: useMetrics() in layout or specific pages
 */
export function useMetrics() {
  const router = useRouter();

  const handleRouteChange = useCallback((url: string) => {
    trackPageview(url);
  }, []);

  useEffect(() => {
    // Track initial pageview
    trackPageview();

    // Track subsequent navigation
    router.events?.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, handleRouteChange]);
}