import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { readContent } from '@/lib/content';

type HtmlBlockProps<T extends ElementType> = {
  as?: T;
  /** Path of the HTML fragment inside `content/`. */
  src: string;
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'dangerouslySetInnerHTML'>;

/** Renders a stored HTML fragment as the inner markup of a single element. */
export function HtmlBlock<T extends ElementType = 'div'>({ as, src, ...props }: HtmlBlockProps<T>) {
  const Tag: ElementType = as ?? 'div';
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: readContent(src) }} />;
}
