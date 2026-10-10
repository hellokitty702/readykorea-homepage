import type { Metadata } from 'next';
import Link from 'next/link';
import {
  alertOk,
  badge,
  button,
  cardFlush,
  cx,
  muted,
  small,
  strong,
  table,
  tabCount,
  tabLink,
  tabs,
} from '@/components/admin/styles';
import { Empty, PageHeader, PostStatusBadge, fmtDate } from '@/components/admin/ui';
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

      <section className={cardFlush}>
        {list.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Post</th>
                <th>Status</th>
                <th>Published</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link className={strong} href={`/admin/blog/${post.id}/`}>
                      {post.title}
                    </Link>
                    <div className={cx(muted, small)}>
                      {[post.category ?? 'No category', post.tags.map((t) => `#${t}`).join(' ')]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </td>
                  <td>
                    <span className="flex flex-wrap gap-1.5">
                      <PostStatusBadge status={post.status} />
                      {post.isFeatured && <span className={cx(badge, 'bg-amber-100 text-amber-800')}>Featured</span>}
                    </span>
                  </td>
                  <td>{fmtDate(post.publishedAt)}</td>
                  <td className={muted}>{fmtDate(post.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>{status === 'draft' ? 'No drafts.' : 'No posts yet. Write the first one.'}</Empty>
        )}
      </section>
    </>
  );
}
