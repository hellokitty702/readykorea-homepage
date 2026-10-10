import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { readContent } from '@/lib/content';

type HtmlBlockProps<T extends ElementType> = {
  as?: T;
  /** Path of the HTML fragment inside `content/`. */
  src: string;
  /** Placeholders to fill, e.g. `{ '<!--JOB_CARDS-->': html }`. */
  replace?: Record<string, string>;
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'dangerouslySetInnerHTML'>;

/** Renders a stored HTML fragment as the inner markup of a single element. */
export function HtmlBlock<T extends ElementType = 'div'>({ as, src, replace, ...props }: HtmlBlockProps<T>) {
  const Tag: ElementType = as ?? 'div';
  let html = readContent(src);
  for (const [placeholder, value] of Object.entries(replace ?? {})) html = html.replace(placeholder, () => value);
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}
