import type { ReactNode } from 'react';
import { HtmlBlock } from '@/components/html-block';
import { Overlays } from './overlays';
import { PageScripts } from './page-scripts';

/**
 * A page built from stored HTML: content/pages/ for the page itself, content/sections/ for parts shared
 * between pages. `id` keeps the `level-<id>` wrapper the stylesheet expects (styles/site.css).
 */
export function SectionPage({
  id,
  src,
  replace,
  className,
  region,
  children,
}: {
  id: string;
  src: string | string[];
  replace?: Record<string, string>;
  className?: string;
  /** Region pages: the key of their neighbourhood guides in site.js. */
  region?: string;
  /** Rendered after the stored HTML. */
  children?: ReactNode;
}) {
  return (
    <>
      <HtmlBlock
        id={`level-${id}`}
        className={className ? `level-content active ${className}` : 'level-content active'}
        data-region={region}
        src={src}
        replace={replace}
      />
      {children}
      <Overlays />
      <PageScripts />
    </>
  );
}
