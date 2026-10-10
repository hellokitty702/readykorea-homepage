import { categoryPath, getBlogCategories } from '@/lib/blog';

/** "All posts" plus every category that has published posts. */
export async function BlogNav({ current }: { current?: string }) {
  const list = await getBlogCategories();
  if (!list.length) return null;
  return (
    <nav className="blog-nav" aria-label="Blog categories">
      <a href="/blog/" aria-current={current ? undefined : 'page'}>
        All posts
      </a>
      {list.map((category) => (
        <a
          key={category.slug}
          href={categoryPath(category.slug)}
          aria-current={current === category.slug ? 'page' : undefined}
        >
          {category.name} <span>{category.posts}</span>
        </a>
      ))}
    </nav>
  );
}
