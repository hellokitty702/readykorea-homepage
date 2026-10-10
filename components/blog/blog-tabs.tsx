import Link from 'next/link';
import { categoryPath, countPublishedPosts, getBlogCategories } from '@/lib/blog';

/** "All (17)" plus every category that has published posts, in menu order; links to their pages. */
export async function BlogTabs({ current }: { current?: string }) {
  const [list, total] = await Promise.all([getBlogCategories(), countPublishedPosts()]);
  if (!list.length) return null;
  return (
    <nav className="category-tabs" aria-label="Blog categories">
      <Link className="tab-btn" href="/blog/" aria-current={current ? undefined : 'page'}>
        All ({total})
      </Link>
      {list.map((category) => (
        <Link
          key={category.slug}
          className="tab-btn"
          href={categoryPath(category.slug)}
          aria-current={current === category.slug ? 'page' : undefined}
        >
          {category.name} ({category.posts})
        </Link>
      ))}
    </nav>
  );
}
