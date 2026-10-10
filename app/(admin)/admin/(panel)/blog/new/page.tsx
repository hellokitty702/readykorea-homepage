import type { Metadata } from 'next';
import { PostForm } from '@/components/admin/post-form';
import { PageHeader } from '@/components/admin/ui';
import { allTagNames, listCategories } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Write a post' };

export default async function NewPostPage() {
  await requireAdmin();
  const [categories, tagSuggestions] = await Promise.all([listCategories(), allTagNames()]);
  return (
    <>
      <PageHeader title="Write a post" crumbs={[{ href: '/admin/blog/', label: 'Blog' }]} />
      <PostForm categories={categories} tagSuggestions={tagSuggestions} />
    </>
  );
}
