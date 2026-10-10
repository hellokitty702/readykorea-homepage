import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/admin/confirm-button';
import { PostForm } from '@/components/admin/post-form';
import { alertOk, button, cardTitle, cx, dangerCard, muted, small } from '@/components/admin/styles';
import { PageHeader, PageSub, PostStatusBadge, fmtDateTime } from '@/components/admin/ui';
import { deletePost } from '@/lib/actions/posts';
import { allTagNames, getPostForEdit, listCategories, parseId } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { postPath } from '@/lib/blog';

export const metadata: Metadata = { title: 'Edit post' };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const post = await getPostForEdit(parseId((await params).id));
  if (!post) notFound();
  const { saved } = await searchParams;
  const [categories, tagSuggestions] = await Promise.all([listCategories(), allTagNames()]);

  return (
    <>
      <PageHeader
        title={post.title}
        crumbs={[{ href: '/admin/blog/', label: 'Blog' }]}
        actions={
          post.status === 'published' && (
            <a className={button()} href={postPath(post.slug)} target="_blank" rel="noopener">
              View post ↗
            </a>
          )
        }
      >
        <PageSub>
          <PostStatusBadge status={post.status} />
          {post.publishedAt ? `Published ${fmtDateTime(post.publishedAt)}` : 'Not published yet'} · Updated{' '}
          {fmtDateTime(post.updatedAt)}
        </PageSub>
      </PageHeader>

      {saved && (
        <p className={alertOk}>
          Saved. {post.status === 'published' ? 'The blog shows the update.' : 'It stays hidden until you publish it.'}
        </p>
      )}

      {/* Remount after each save so the form shows what was stored (e.g. a generated slug). */}
      <PostForm key={post.updatedAt.getTime()} post={post} categories={categories} tagSuggestions={tagSuggestions} />

      <section className={dangerCard}>
        <h2 className={cardTitle}>Delete post</h2>
        <p className={cx(muted, small, 'mb-3')}>
          The post disappears from the blog and its link stops working. To hide it for now, set it back to Draft.
        </p>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton className={button('danger')} message={`Delete “${post.title}”? This can't be undone.`}>
            Delete post
          </ConfirmButton>
        </form>
      </section>
    </>
  );
}
