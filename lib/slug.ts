// URL slugs for jobs, blog posts, categories and tags. No imports, so client components can use it.

export const SLUG_MAX = 80;
/** Lowercase words joined by single dashes, e.g. kindergarten-lead-teacher-k2-k3. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_HINT = 'Use lowercase letters, numbers and single dashes only.';

/** URL slug from free text: accents dropped, anything else non-alphanumeric becomes a dash. */
export function slugify(text: string) {
  const slug = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > SLUG_MAX ? slug.slice(0, SLUG_MAX).replace(/-[^-]*$/, '') || slug.slice(0, SLUG_MAX) : slug;
}
