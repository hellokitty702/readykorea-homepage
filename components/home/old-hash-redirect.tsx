'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SITE_ROUTES } from '@/lib/site-pages';

/**
 * The old one-page site linked its sections as `/#<target>` (e.g. `/#e2-visa`, `/#region-seoul`). Those
 * are separate pages now; the hash never reaches the server, so the homepage forwards them here.
 */
export function OldHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const href = SITE_ROUTES[decodeURIComponent(window.location.hash.slice(1))];
    if (href && href !== '/') router.replace(href);
  }, [router]);
  return null;
}
