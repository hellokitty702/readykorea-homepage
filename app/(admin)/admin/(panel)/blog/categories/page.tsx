import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryRowActions, NewCategoryForm } from '@/components/admin/category-forms';
import { card, cardFlush, cardTitle, code, cx, muted, num, small, strong, table } from '@/components/admin/styles';
import { Empty, PageHeader, PageSub } from '@/components/admin/ui';
import { listCategories } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { categoryPath } from '@/lib/blog';

export const metadata: Metadata = { title: 'Blog categories' };

export default async function CategoriesPage() {
  await requireAdmin();
  const list = await listCategories();

  return (
    <>
      <PageHeader title="Categories" crumbs={[{ href: '/admin/blog/', label: 'Blog' }]}>
        <PageSub>Each post can have one category. The blog lists categories that have published posts.</PageSub>
      </PageHeader>

      <section className={cardFlush}>
        {list.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Page</th>
                <th className={num}>Posts</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={strong}>{c.name}</span>
                    {c.description && <div className={cx(muted, small, 'max-w-md')}>{c.description}</div>}
                  </td>
                  <td>
                    {c.published > 0 ? (
                      <a href={categoryPath(c.slug)} target="_blank" rel="noopener">
                        <code className={code}>{categoryPath(c.slug)}</code>
                      </a>
                    ) : (
                      <code className={code}>{categoryPath(c.slug)}</code>
                    )}
                  </td>
                  <td className={num}>
                    <Link href="/admin/blog/">{c.posts}</Link>
                    {c.posts > c.published && (
                      <span className="block text-2xs text-slate-500">{c.posts - c.published} draft</span>
                    )}
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <CategoryRowActions category={c} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No categories yet.</Empty>
        )}
      </section>

      <section className={cx(card, 'max-w-3xl')}>
        <h2 className={cardTitle}>Add a category</h2>
        <NewCategoryForm />
      </section>
    </>
  );
}
