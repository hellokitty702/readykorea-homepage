import type { ReactNode } from 'react';
import { ContentLinks } from './content-links';
import { HeaderNav } from './header-nav';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

/**
 * Document shell of the public site (app/(app)/layout.tsx): the site header and footer around the
 * page. Each route group's layout adds its page stylesheet and `.page-*` wrapper.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <HeaderNav />
        <ContentLinks />
      </body>
    </html>
  );
}
