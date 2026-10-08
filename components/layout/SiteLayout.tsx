import type { ReactNode } from 'react';
import { HeaderNav } from './HeaderNav';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/**
 * Document shell used by every root layout: the site header and footer around the page.
 * Each root layout imports its own page stylesheet followed by styles/layout.css.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <HeaderNav />
      </body>
    </html>
  );
}
