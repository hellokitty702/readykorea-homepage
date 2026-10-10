import type { Metadata } from 'next';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { CategoryRowActions, NewCategoryForm } from '@/components/admin/category-forms';
import { button, card, cardFlush, cardTitle, code, cx, muted, num, small, strong, table } from '@/components/admin/styles';
import { Empty, PageHeader, PageSub } from '@/components/admin/ui';
import { moveCategory } from '@/lib/actions/posts';
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
        <PageSub>
          Each post can have one category. The header's Blog menu and the blog list the categories that have published
          posts, in this order.
        </PageSub>
      </PageHeader>

      <section className={cardFlush}>
        {list.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Category</th>
                <th>Page</th>
                <th className={num}>Posts</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => (
                <tr key={c.id}>
                  <td className="w-px whitespace-nowrap">
                    <form action={moveCategory} className="flex gap-1">
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        className={button('default', 'sm')}
                        name="move"
                        value="up"
                        disabled={i === 0}
                        aria-label={`Move ${c.name} up`}
                        title="Move up"
                      >
                        <ArrowUp className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        className={button('default', 'sm')}
                        name="move"
                        value="down"
                        disabled={i === list.length - 1}
                        aria-label={`Move ${c.name} down`}
                        title="Move down"
                      >
                        <ArrowDown className="size-3.5" aria-hidden="true" />
                      </button>
                    </form>
                  </td>
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
