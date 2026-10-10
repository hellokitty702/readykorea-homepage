import type { Metadata } from 'next';
import { JobForm } from '@/components/admin/job-form';
import { PageHeader } from '@/components/admin/ui';
import { suggestJobCode } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Post a job' };

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Post a job" crumbs={[{ href: '/admin/jobs/', label: 'Jobs' }]} />
      <JobForm defaults={{ code: await suggestJobCode() }} />
    </>
  );
}
