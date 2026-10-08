'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const DESKTOP = '(min-width: 1101px)';

/**
 * Header behaviour on pages other than the homepage. On the homepage public/js/home.js drives the
 * header (in-page navigation, dropdowns, EN/KO switch); elsewhere the same controls work the same
 * way, but menu entries open the homepage at `/#<target>` (home.js routes that hash on load).
 */
export function HeaderNav() {
  const isHome = usePathname() === '/';

  useEffect(() => {
    if (isHome) return;
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
    const go = (target: string) => {
      closeAll();
      window.location.href = target === 'home' ? '/' : `/#${target}`;
    };

    // EN / 한글 switch (same storage key as home.js).
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

    // Menu entries → homepage section. The logo is a real link to `/#home`.
    header.addEventListener(
      'click',
      (e) => {
        const el = (e.target as Element).closest<HTMLElement>('[data-nav]');
        if (!el || el.matches('a[href]')) return;
        e.preventDefault();
        go(el.dataset.nav!);
      },
      { signal },
    );

    // Same rules as handleNavSearch() in home.js.
    search?.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        closeAll();
        const key = search.value.trim().toLowerCase();
        if (/^(apply|application|지원|지원하기)$/i.test(key) || key.includes('apply') || key.includes('지원')) {
          window.location.href = '/apply/';
        } else if (key.includes('blog') || key.includes('블로그')) {
          window.location.href = '/blog/';
        } else {
          go(document.documentElement.lang === 'ko' ? 'lessons' : 'support');
        }
      },
      { signal },
    );

    header.querySelector('#nav-apply-btn')?.addEventListener(
      'click',
      () => {
        closeAll();
        window.location.href = '/apply/';
      },
      { signal },
    );
    header.querySelector('#nav-inquire-btn')?.addEventListener('click', () => go('school-posting'), { signal });

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
  }, [isHome]);

  return null;
}
