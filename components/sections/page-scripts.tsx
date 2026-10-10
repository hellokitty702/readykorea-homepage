'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    rkInitPage?: () => void;
    rkCleanupPage?: () => void;
  }
}

const SCRIPTS = ['/js/support-guides.js', '/js/site.js'];
let loaded: Promise<void> | undefined;

/** Adds the plain (non-module) scripts once, in order; they declare globals, so they must never run twice. */
function loadScripts() {
  loaded ??= SCRIPTS.reduce(
    (previous, src) =>
      previous.then(
        () =>
          new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Could not load ${src}`));
            document.body.appendChild(script);
          }),
      ),
    Promise.resolve(),
  );
  return loaded;
}

/**
 * Runs public/js/site.js on pages made from the old homepage panels. The script is loaded once; after
 * every navigation it binds to the new page's markup (rkInitPage) and lets go of the old one (rkCleanupPage).
 */
export function PageScripts() {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    loadScripts().then(() => active && window.rkInitPage?.(), console.error);
    return () => {
      active = false;
      window.rkCleanupPage?.();
    };
  }, [pathname]);

  return null;
}
