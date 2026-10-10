import type { Metadata } from 'next';
import Link from 'next/link';
import { PostTable } from '@/components/admin/post-table';
import { alertOk, button, cardFlush, tabCount, tabLink, tabs } from '@/components/admin/styles';
import { Empty, PageHeader } from '@/components/admin/ui';
import { listPosts, postStatusCounts } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { POST_STATUSES } from '@/lib/db/schema';

export const metadata: Metadata = { title: 'Blog' };

const LABEL = { published: 'Published', draft: 'Drafts' } as const;

export default async function BlogPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = POST_STATUSES.find((s) => s === params.status);
  const [list, counts] = await Promise.all([listPosts(status), postStatusCounts()]);
  const total = POST_STATUSES.reduce((n, s) => n + (counts[s] ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Blog"
        actions={
          <>
            <Link className={button()} href="/admin/blog/categories/">
              Categories
            </Link>
            <Link className={button('primary')} href="/admin/blog/new/">
              Write a post
            </Link>
          </>
        }
      />
      {params.deleted && <p className={alertOk}>Post deleted.</p>}

      <nav className={tabs} aria-label="Filter by status">
        <Link className={tabLink} href="/admin/blog/" aria-current={!status ? 'page' : undefined}>
          All <span className={tabCount}>{total}</span>
        </Link>
        {(['published', 'draft'] as const).map((s) => (
          <Link
            key={s}
            className={tabLink}
            href={`/admin/blog/?status=${s}`}
            aria-current={status === s ? 'page' : undefined}
          >
            {LABEL[s]} <span className={tabCount}>{counts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {list.length ? (
        // Keyed by tab, so a selection doesn't carry over to another tab.
        <PostTable key={status ?? 'all'} rows={list} />
      ) : (
        <section className={cardFlush}>
          <Empty>{status === 'draft' ? 'No drafts.' : 'No posts yet. Write the first one.'}</Empty>
        </section>
      )}
    </>
  );
}
