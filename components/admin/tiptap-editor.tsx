'use client';

import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  BetweenHorizontalEnd,
  BetweenVerticalEnd,
  Bold,
  CircleAlert,
  Code,
  Grid2x2X,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  LoaderCircle,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  TableColumnsSplit,
  TableRowsSplit,
  Tag,
  Underline,
  Undo2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { BOX_STYLES } from '@/lib/post-markup';
import { BlockClasses, Box, Label } from './editor-extensions';
import { MediaPicker, type PickedImage } from './media-picker';
import { uploadImage } from './media-upload';
import { cx, toolbarPlaceholder } from './styles';

/** A 3 × 3 table with a header row, in the wrapper the blog styles (lib/post-markup.ts). */
const NEW_TABLE = `<div class="md-table-wrap"><table class="md-table"><tr>${'<th><p></p></th>'.repeat(3)}</tr>${`<tr>${'<td><p></p></td>'.repeat(3)}</tr>`.repeat(2)}</table></div>`;

type Upload = { id: number; name: string; error?: string };
let nextUploadId = 1;

/** Image files being dropped or pasted, if that's all there is (pasted text keeps the default handling). */
function droppedImages(data: DataTransfer | null) {
  if (!data?.files.length || data.getData('text/plain')) return [];
  return [...data.files].filter((file) => file.type.startsWith('image/'));
}

/**
 * Tiptap editor and toolbar inside RichTextEditor (./rich-text-editor.tsx), which loads it in the
 * browser only. `onChange` gets the article HTML after every change ('' when empty); it must keep the
 * same identity, since the editor is set up once.
 */
export function TiptapEditor({
  defaultValue,
  labelledBy,
  onChange,
}: {
  defaultValue: string;
  labelledBy?: string;
  onChange: (html: string) => void;
}) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  // The editor's drop and paste handlers are fixed at creation, so they reach the editor through a ref.
  const editorRef = useRef<Editor | null>(null);

  /** Uploads dropped or pasted images to the media library and puts them in the article. */
  async function insertUploads(files: File[], at?: number) {
    for (const file of files) {
      const id = nextUploadId++;
      setUploads((list) => [...list, { id, name: file.name }]);
      const result = await uploadImage(file);
      const ed = editorRef.current;
      if (result.media && ed) {
        const { url, alt, width, height } = result.media;
        const image = { type: 'image', attrs: { src: url, alt, width, height } };
        if (at === undefined) ed.chain().focus().insertContent(image).run();
        else ed.chain().focus().insertContentAt(at, image).run();
        // The cursor now sits after this image: the next one goes there.
        at = undefined;
        setUploads((list) => list.filter((u) => u.id !== id));
      } else {
        setUploads((list) => list.map((u) => (u.id === id ? { ...u, error: result.error } : u)));
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: { rel: null, target: null },
        },
      }),
      Image,
      // Markup of the imported posts: boxes, labels, tables, classes on paragraphs and lists.
      Box,
      Label,
      BlockClasses,
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: 'Write the article…' }),
    ],
    content: defaultValue,
    // Rendered on the client only: avoids a hydration mismatch with the server HTML.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'rich-text min-h-80 px-4 py-3 focus:outline-none',
        role: 'textbox',
        'aria-multiline': 'true',
        ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
      },
      handleDrop: (view, event, _slice, moved) => {
        const files = moved ? [] : droppedImages(event.dataTransfer);
        if (!files.length) return false;
        event.preventDefault();
        insertUploads(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = droppedImages(event.clipboardData);
        if (!files.length) return false;
        insertUploads(files);
        return true;
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });

  return (
    <>
      {editor ? <Toolbar editor={editor} /> : <div className={toolbarPlaceholder} />}
      {uploads.length > 0 && (
        <ul className="grid gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2 text-label" aria-live="polite">
          {uploads.map((u) => (
            <li key={u.id} className={cx('flex items-start gap-2', u.error ? 'text-red-700' : 'text-slate-600')}>
              {u.error ? (
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              ) : (
                <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1 wrap-anywhere">{u.error ?? `Uploading ${u.name}…`}</span>
              {u.error && (
                <button
                  type="button"
                  className="cursor-pointer rounded p-0.5 hover:bg-red-100"
                  aria-label="Dismiss"
                  onClick={() => setUploads((list) => list.filter((x) => x.id !== u.id))}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <EditorContent editor={editor} />
    </>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      label: e.isActive('label'),
      box: e.isActive('box') ? ((e.getAttributes('box').class as string | null) ?? '') : null,
      table: e.isActive('table'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();
  const [picking, setPicking] = useState(false);

  const setLink = () => {
    const current = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt('Link address (https://… or /page/)', current ?? 'https://');
    if (href === null) return;
    if (!href.trim() || href.trim() === 'https://') chain().extendMarkRange('link').unsetLink().run();
    else chain().extendMarkRange('link').setLink({ href: href.trim() }).run();
  };
  const insertImage = ({ src, alt, width, height }: PickedImage) =>
    chain()
      .setImage({ src, alt, ...(width && height ? { width, height } : {}) })
      .run();

  const tools: ({ icon: LucideIcon; label: string; run: () => void; active?: boolean; disabled?: boolean } | '|')[] = [
    { icon: Heading2, label: 'Heading', run: () => chain().toggleHeading({ level: 2 }).run(), active: state.h2 },
    { icon: Heading3, label: 'Subheading', run: () => chain().toggleHeading({ level: 3 }).run(), active: state.h3 },
    '|',
    { icon: Bold, label: 'Bold', run: () => chain().toggleBold().run(), active: state.bold },
    { icon: Italic, label: 'Italic', run: () => chain().toggleItalic().run(), active: state.italic },
    { icon: Underline, label: 'Underline', run: () => chain().toggleUnderline().run(), active: state.underline },
    { icon: Strikethrough, label: 'Strikethrough', run: () => chain().toggleStrike().run(), active: state.strike },
    { icon: Code, label: 'Inline code', run: () => chain().toggleCode().run(), active: state.code },
    '|',
    { icon: List, label: 'Bulleted list', run: () => chain().toggleBulletList().run(), active: state.bullet },
    { icon: ListOrdered, label: 'Numbered list', run: () => chain().toggleOrderedList().run(), active: state.ordered },
    { icon: Quote, label: 'Quote', run: () => chain().toggleBlockquote().run(), active: state.quote },
    { icon: Minus, label: 'Divider', run: () => chain().setHorizontalRule().run() },
    '|',
    { icon: Link2, label: state.link ? 'Edit link' : 'Add link', run: setLink, active: state.link },
    { icon: Link2Off, label: 'Remove link', run: () => chain().unsetLink().run(), disabled: !state.link },
    { icon: ImagePlus, label: 'Image', run: () => setPicking(true) },
    '|',
    { icon: Tag, label: 'Small label (top of a box)', run: () => chain().toggleLabel().run(), active: state.label },
    { icon: Table, label: 'Insert table', run: () => chain().insertContent(NEW_TABLE).run(), disabled: state.table },
    ...(state.table
      ? [
          { icon: BetweenHorizontalEnd, label: 'Add row below', run: () => chain().addRowAfter().run() },
          { icon: BetweenVerticalEnd, label: 'Add column right', run: () => chain().addColumnAfter().run() },
          { icon: TableRowsSplit, label: 'Delete row', run: () => chain().deleteRow().run() },
          { icon: TableColumnsSplit, label: 'Delete column', run: () => chain().deleteColumn().run() },
          { icon: Grid2x2X, label: 'Delete table', run: () => chain().deleteTable().run() },
        ]
      : []),
    '|',
    { icon: Undo2, label: 'Undo', run: () => chain().undo().run(), disabled: !state.canUndo },
    { icon: Redo2, label: 'Redo', run: () => chain().redo().run(), disabled: !state.canRedo },
  ];

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1"
      role="toolbar"
      aria-label="Formatting"
    >
      {tools.map((tool, i) =>
        tool === '|' ? (
          <span key={i} className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
        ) : (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={tool.active === undefined ? undefined : tool.active}
            disabled={tool.disabled}
            onClick={tool.run}
            className="grid size-8 cursor-pointer place-items-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 aria-pressed:bg-blue-100 aria-pressed:text-blue-800"
          >
            <tool.icon className="size-4" aria-hidden="true" />
          </button>
        ),
      )}
      <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
      <select
        aria-label="Box"
        title="Put the selected paragraphs in a box"
        value={state.box ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value) chain().setBox(value).run();
          else chain().unsetBox().run();
        }}
        className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-label text-slate-700 hover:border-slate-300"
      >
        <option value="">{state.box === null ? 'Box…' : 'No box'}</option>
        {BOX_STYLES.map((box) => (
          <option key={box.value} value={box.value}>
            {box.label}
          </option>
        ))}
        {/* Boxes from the old site that the menu doesn't offer, e.g. formula-box. */}
        {state.box && !BOX_STYLES.some((b) => b.value === state.box) && <option value={state.box}>{state.box}</option>}
      </select>
      <MediaPicker open={picking} onClose={() => setPicking(false)} onInsert={insertImage} />
    </div>
  );
}
