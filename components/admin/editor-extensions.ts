import { Extension, Mark, Node } from '@tiptap/core';
import { allowedClasses } from '@/lib/post-markup';

// Editor support for the markup of the posts imported from the old site (lib/post-markup.ts): boxes,
// small labels, and classes on paragraphs and lists. Without these the editor would drop that markup
// the first time an imported post is edited.

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    box: {
      /** Puts the selected blocks in a box, or restyles the box around them. */
      setBox: (className: string) => ReturnType;
      /** Removes the box around the cursor, keeping everything that was in it. */
      unsetBox: () => ReturnType;
    };
    label: {
      toggleLabel: () => ReturnType;
    };
  }
}

/** A `class` attribute that keeps only the classes the site styles for this tag. */
const classAttribute = (tag: string) => ({
  class: {
    default: null,
    // A new paragraph after an intro is not an intro.
    keepOnSplit: false,
    parseHTML: (el: HTMLElement) => allowedClasses(tag, el.classList),
    renderHTML: (attrs: Record<string, unknown>) => (attrs.class ? { class: attrs.class } : {}),
  },
});

/** `<div class="highlight-box">…</div>` and the other boxes: a block holding other blocks. */
export const Box = Node.create({
  name: 'box',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes: () => classAttribute('div'),
  parseHTML: () => [{ tag: 'div' }],
  renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes, 0],
  addCommands() {
    return {
      setBox:
        (className) =>
        ({ editor, commands }) =>
          editor.isActive(this.name)
            ? commands.updateAttributes(this.name, { class: className })
            : commands.wrapIn(this.name, { class: className }),
      unsetBox:
        () =>
        ({ state, tr, dispatch }) => {
          const { $from } = state.selection;
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name !== this.name) continue;
            if (dispatch) tr.replaceWith($from.before(depth), $from.after(depth), node.content);
            return true;
          }
          return false;
        },
    };
  },
});

/** `<span class="label">Sample script</span>`: the small heading at the top of a box. */
export const Label = Mark.create({
  name: 'label',
  parseHTML: () => [{ tag: 'span.label' }],
  renderHTML: () => ['span', { class: 'label' }, 0],
  addCommands() {
    return {
      toggleLabel:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});

/** Keeps classes such as `p.intro`, `ol.steps` and `table.md-table`. */
export const BlockClasses = Extension.create({
  name: 'blockClasses',
  addGlobalAttributes: () => [
    { types: ['paragraph'], attributes: classAttribute('p') },
    { types: ['bulletList'], attributes: classAttribute('ul') },
    { types: ['orderedList'], attributes: classAttribute('ol') },
    { types: ['table'], attributes: classAttribute('table') },
  ],
});
