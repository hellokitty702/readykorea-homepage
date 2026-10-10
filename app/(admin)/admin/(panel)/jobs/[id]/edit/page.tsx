import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JobForm } from '@/components/admin/job-form';
import { PageHeader } from '@/components/admin/ui';
import { getJob, parseId } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Edit job' };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const job = await getJob(parseId((await params).id));
  if (!job) notFound();

  return (
    <>
      <PageHeader
        title={`Edit: ${job.en.title}`}
        crumbs={[
          { href: '/admin/jobs/', label: 'Jobs' },
          { href: `/admin/jobs/${job.id}/`, label: job.code },
        ]}
      />
      <JobForm job={job} />
    </>
  );
}
