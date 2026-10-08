import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './lessons.module.css';

export type Crumb = { label: string; href?: string };

/** Page frame shared by the lesson hub, grade lists and lesson pages. */
export function LessonShell({ crumbs, children }: { crumbs?: Crumb[]; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      {crumbs && (
        <nav className={styles.breadcrumb}>
          {crumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && ' › '}
              {/* Plain link home: the homepage needs a full load to run its scripts. */}
              {!crumb.href ? crumb.label : crumb.href === '/' ? <a href="/">{crumb.label}</a> : <Link href={crumb.href}>{crumb.label}</Link>}
            </span>
          ))}
        </nav>
      )}
      {children}
    </div>
  );
}
