// Classes a blog post's HTML may carry. styles/blog-post.css styles them; the sanitizer (lib/blog-html.ts)
// keeps only these, and the admin editor (components/admin/editor-extensions.ts) keeps them while
// editing. They come from the posts of the old static site. No imports, so client components can use it.

/** Boxes: a `<div>` with one of these classes around paragraphs, lists, tables… */
export const POST_BOX_CLASSES = [
  'highlight-box',
  'warning-box',
  'warn-box',
  'quote-box',
  'note',
  'formula-box',
  'intent-box',
  'script-box',
  'action-box',
  'mindset-box',
  'next-step',
  'closing',
  'skill-card',
  'stat-grid',
  'stat-card',
  'md-table-wrap',
  'cta-box',
] as const;

/** Allowed classes per tag. */
export const POST_CLASSES: Record<string, readonly string[]> = {
  div: POST_BOX_CLASSES,
  p: ['intro', 'closing', 'disclaimer'],
  span: ['label'],
  ul: ['roadmap-step'],
  ol: ['steps'],
  table: ['md-table'],
  a: ['cta-btn'],
};

/** Boxes offered in the editor's Box menu, with their names there. */
export const BOX_STYLES: { value: (typeof POST_BOX_CLASSES)[number]; label: string }[] = [
  { value: 'highlight-box', label: 'Highlight' },
  { value: 'warning-box', label: 'Warning' },
  { value: 'note', label: 'Note' },
  { value: 'quote-box', label: 'Quote' },
  { value: 'intent-box', label: 'Info (blue)' },
  { value: 'script-box', label: 'Script (gold)' },
  { value: 'skill-card', label: 'Card' },
  { value: 'closing', label: 'Closing note' },
  { value: 'next-step', label: 'Next step' },
  { value: 'cta-box', label: 'Call to action' },
];

/** The allowed classes of an element, or null. */
export function allowedClasses(tag: string, classList: Iterable<string>) {
  const allowed = POST_CLASSES[tag] ?? [];
  return [...classList].filter((c) => allowed.includes(c)).join(' ') || null;
}
