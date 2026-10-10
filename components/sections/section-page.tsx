import { Fragment, type ReactElement, type ReactNode } from 'react';
import { HtmlBlock } from '@/components/html-block';
import { Overlays } from './overlays';
import { PageScripts } from './page-scripts';

/**
 * A page built from stored HTML: content/pages/ for the page itself, content/sections/ for parts shared
 * between pages. `id` keeps the `level-<id>` wrapper the stylesheet expects (styles/site.css).
 * `src` can mix fragment paths with React sections (e.g. the Job Board), rendered in that order.
 */
export function SectionPage({
  id,
  src,
  className,
  region,
  children,
}: {
  id: string;
  src: string | (string | ReactElement)[];
  className?: string;
  /** Region pages: the key of their neighbourhood guides in site.js. */
  region?: string;
  /** Rendered after the stored HTML. */
  children?: ReactNode;
}) {
  const parts = Array.isArray(src) ? src : [src];
  const fragments = parts.filter((part): part is string => typeof part === 'string');
  const wrapper = {
    id: `level-${id}`,
    className: className ? `level-content active ${className}` : 'level-content active',
    'data-region': region,
  };

  return (
    <>
      {fragments.length === parts.length ? (
        <HtmlBlock {...wrapper} src={fragments} />
      ) : (
        <div {...wrapper}>
          {parts.map((part, i) =>
            typeof part === 'string' ? (
              // display: contents keeps the fragment's elements laid out as children of the wrapper.
              <HtmlBlock key={i} src={part} style={{ display: 'contents' }} />
            ) : (
              <Fragment key={i}>{part}</Fragment>
            ),
          )}
        </div>
      )}
      {children}
      <Overlays />
      <PageScripts />
    </>
  );
}
