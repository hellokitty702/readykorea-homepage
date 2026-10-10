import Link from 'next/link';
import { tagPath } from '@/lib/blog';

/** A post's tags, each linking to its tag page. */
export function TagLinks({ tags }: { tags: { slug: string; name: string }[] }) {
  if (!tags.length) return null;
  return (
    <ul className="post-tags" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link href={tagPath(tag.slug)}>#{tag.name}</Link>
        </li>
      ))}
    </ul>
  );
}
