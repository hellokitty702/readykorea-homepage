'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Links inside stored HTML (page content, job cards, blog posts) are plain <a> tags. Same-site page links
 * among them navigate like next/link: in place, without reloading the page.
 */
export function ContentLinks() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // next/link handles its own links (and prevents the default first).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      // Files (/uploads/…, /sitemap.xml) and admin pages load normally.
      if (/\.[a-z0-9]+$/i.test(url.pathname) || url.pathname.startsWith('/admin/')) return;
      // An anchor on this page: let the browser scroll to it.
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      e.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return null;
}
