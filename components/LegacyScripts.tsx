'use client';

import { useEffect } from 'react';

let injected = false;

/**
 * Loads plain (non-module) scripts after hydration, in the given order, so they can
 * enhance the server-rendered markup the same way they did on the static site.
 */
export function LegacyScripts({ srcs }: { srcs: string[] }) {
  useEffect(() => {
    // Effects run twice in dev (Strict Mode); the scripts declare top-level consts and must only run once.
    if (injected) return;
    injected = true;
    for (const src of srcs) {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // execute in insertion order
      document.body.appendChild(script);
    }
  }, [srcs]);

  return null;
}
