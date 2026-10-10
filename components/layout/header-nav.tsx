'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DESKTOP = '(min-width: 1101px)';

/**
 * Header behaviour on every page: dropdowns (hover or click), the compact menu, the EN/KO switch and
 * search. Menu entries are links (next/link); the open menu closes when one is followed.
 */
export function HeaderNav() {
  const router = useRouter();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header.site');
    if (!header) return;

    const controller = new AbortController();
    const { signal } = controller;
    const isDesktop = () => window.matchMedia(DESKTOP).matches;
    const dropdowns = [...header.querySelectorAll<HTMLElement>('.main-nav-dd')];
    const search = header.querySelector<HTMLInputElement>('#nav-search-input');
    let closeTimer: number | undefined;

    const setOpen = (dd: HTMLElement, open: boolean) => {
      dd.classList.toggle('open', open);
      dd.querySelectorAll('[aria-haspopup]').forEach((t) => t.setAttribute('aria-expanded', String(open)));
    };
    const closeAll = () => {
      window.clearTimeout(closeTimer);
      dropdowns.forEach((dd) => setOpen(dd, false));
    };
    const open = (dd: HTMLElement) => {
      window.clearTimeout(closeTimer);
      dropdowns.forEach((other) => setOpen(other, other === dd));
    };
    // EN / 한글 switch. Page text is translated by public/js/site.js, which listens for `rk:lang`.
    const applyLang = (lang: string) => {
      document.documentElement.lang = lang;
      header.querySelectorAll<HTMLElement>('.audience-pill[data-lang]').forEach((pill) => {
        const active = pill.dataset.lang === lang;
        pill.classList.toggle('active', active);
        pill.setAttribute('aria-selected', String(active));
      });
      if (search) search.placeholder = lang === 'ko' ? '검색' : 'Search';
    };
    try {
      const saved = localStorage.getItem('rk-lang');
      if (saved === 'en' || saved === 'ko') applyLang(saved);
    } catch {}
    header.querySelectorAll<HTMLElement>('.audience-pill[data-lang]').forEach((pill) => {
      pill.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
          const lang = pill.dataset.lang === 'ko' ? 'ko' : 'en';
          applyLang(lang);
          try {
            localStorage.setItem('rk-lang', lang);
          } catch {}
          window.dispatchEvent(new CustomEvent('rk:lang', { detail: lang }));
          closeAll();
        },
        { signal },
      );
    });

    // Desktop dropdowns: open on hover or click.
    header.querySelectorAll<HTMLElement>('.nav-center .nav-item-dd').forEach((dd) => {
      dd.addEventListener('mouseenter', () => isDesktop() && open(dd), { signal });
      dd.addEventListener(
        'mouseleave',
        () => {
          if (isDesktop()) closeTimer = window.setTimeout(closeAll, 300);
        },
        { signal },
      );
      dd.querySelector('.nav-top-trigger')?.addEventListener(
        'click',
        (e) => {
          if (!isDesktop()) return;
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = dd.classList.contains('open');
          closeAll();
          if (!wasOpen) open(dd);
        },
        { signal },
      );
    });

    // Compact menu (below 1100px).
    const mobile = header.querySelector<HTMLElement>('#nav-menu-mobile');
    mobile?.querySelector('.nav-menu-btn')?.addEventListener(
      'click',
      (e) => {
        if (isDesktop()) return;
        e.stopPropagation();
        const wasOpen = mobile.classList.contains('open');
        closeAll();
        if (!wasOpen) open(mobile);
      },
      { signal },
    );

    // Links navigate without a page load (next/link), so close the menu they were in.
    header.addEventListener(
      'click',
      (e) => {
        if ((e.target as Element).closest('a[href]')) closeAll();
      },
      { signal },
    );

    // "apply" and "blog" open those pages; anything else searches the Support Center guides
    // (Korean visitors get the lesson library instead).
    search?.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        closeAll();
        const query = search.value.trim();
        const key = query.toLowerCase();
        if (/^(apply|application|지원|지원하기)$/i.test(key) || key.includes('apply') || key.includes('지원')) {
          router.push('/apply/');
        } else if (key.includes('blog') || key.includes('블로그')) {
          router.push('/blog/');
        } else if (document.documentElement.lang === 'ko') {
          router.push('/lessons/');
        } else if (window.location.pathname === '/support/') {
          const input = document.querySelector<HTMLInputElement>('#support-search');
          if (input) {
            input.value = query;
            input.dispatchEvent(new Event('input'));
            input.focus();
          }
        } else {
          router.push(query ? `/support/?q=${encodeURIComponent(query)}` : '/support/');
        }
      },
      { signal },
    );

    document.addEventListener(
      'click',
      (e) => {
        if (!(e.target as Element).closest('header.site .main-nav-dd, header.site .nav-item-dd')) closeAll();
      },
      { signal },
    );
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeAll(), { signal });

    return () => {
      controller.abort();
      window.clearTimeout(closeTimer);
    };
  }, [router]);

  return null;
}
