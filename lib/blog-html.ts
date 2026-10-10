import sanitizeHtml from 'sanitize-html';
import { POST_CLASSES } from './post-markup';

// Used by the post save action and by scripts/seed.ts, so no `server-only` import here.

/**
 * Cleans article HTML from the admin editor before it is saved. Only the markup the editor can
 * produce survives (headings, lists, links, images, tables, the boxes and classes in
 * lib/post-markup.ts); scripts, styles and event handlers are dropped.
 */
export function sanitizePostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'h2',
      'h3',
      'h4',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'hr',
      'img',
      'div',
      'span',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      ol: ['start'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedClasses: Object.fromEntries(Object.entries(POST_CLASSES).map(([tag, classes]) => [tag, [...classes]])),
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      // The page title is the only h1.
      h1: 'h2',
      // Width and height only as pixel numbers (they reserve the image's space while it loads).
      img: (tagName, attribs) => {
        const { width = '', height = '', ...rest } = attribs;
        const valid = /^\d{1,5}$/.test(width) && /^\d{1,5}$/.test(height);
        return { tagName, attribs: valid ? { ...rest, width, height } : rest };
      },
      // Links opening a new tab never get access to this page.
      a: (tagName, attribs) => {
        const { target, rel, ...rest } = attribs;
        if (target === '_blank') return { tagName, attribs: { ...rest, target, rel: 'noopener noreferrer' } };
        return { tagName, attribs: rel ? { ...rest, rel } : rest };
      },
    },
    // An empty editor still sends "<p></p>"; images whose source was removed are dropped too.
    exclusiveFilter: (frame) =>
      (frame.tag === 'p' && !frame.text.trim() && !frame.mediaChildren.length) ||
      (frame.tag === 'img' && !frame.attribs.src),
  }).trim();
}
/** Plain text of an article, e.g. for a meta description. */
export const postText = (html: string) =>
  sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
