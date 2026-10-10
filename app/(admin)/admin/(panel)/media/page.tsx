import type { Metadata } from 'next';
import Link from 'next/link';
import { MediaCard, MediaUploader } from '@/components/admin/media-library';
import { button, card, cx, input, muted } from '@/components/admin/styles';
import { Empty, PageHeader, PageSub } from '@/components/admin/ui';
import { listMedia } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Media' };

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const search = (params.q ?? '').slice(0, 100);
  const { items, page, pages, total } = await listMedia({ page: Math.max(1, Number(params.page) || 1), search });
  const pageHref = (n: number) =>
    `/admin/media/?${new URLSearchParams({ ...(search ? { q: search } : {}), page: String(n) })}`;

  return (
    <>
      <PageHeader title="Media">
        <PageSub>
          Images for blog posts. Upload them here or straight from the post editor (Image button, or drag a file into
          the article).
        </PageSub>
      </PageHeader>

      <section className={card}>
        <MediaUploader />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={muted}>
          {total} {total === 1 ? 'image' : 'images'}
          {search && ` matching “${search}”`}
        </p>
        <form className="flex flex-1 gap-1.5 sm:flex-none" role="search">
          <input
            className={cx(input, 'min-w-0 flex-1 sm:w-64')}
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search file name or alt text"
            aria-label="Search media"
          />
          <button className={button()}>Search</button>
        </form>
      </div>

      {items.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-3.5" aria-label="Images">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <section className={card}>
          <Empty>{search ? 'No images match that search.' : 'No images yet. Upload the first one above.'}</Empty>
        </section>
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Pages">
          {page > 1 ? (
            <Link className={button('default', 'sm')} href={pageHref(page - 1)}>
              Newer
            </Link>
          ) : (
            <span />
          )}
          <span className={muted}>
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link className={button('default', 'sm')} href={pageHref(page + 1)}>
              Older
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
