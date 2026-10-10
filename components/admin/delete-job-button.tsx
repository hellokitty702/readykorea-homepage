import { Trash2 } from 'lucide-react';
import { deleteJob } from '@/lib/actions/jobs';
import { ConfirmDialogButton } from './confirm-dialog';
import { button } from './styles';

/**
 * Delete button for a job (jobs list and job page). Jobs with applications can't be deleted (the
 * applications and their history would go too): the button is disabled and the job should be closed instead.
 */
export function DeleteJobButton({
  job,
  applications,
  compact = false,
}: {
  job: { id: number; code: string; title: string; status: string };
  applications: number;
  /** Icon-only button, for table rows. */
  compact?: boolean;
}) {
  return (
    <ConfirmDialogButton
      action={deleteJob}
      fields={{ id: job.id }}
      title="Delete this job?"
      confirmLabel="Delete job"
      pendingLabel="Deleting…"
      trigger={compact ? <Trash2 className="size-3.5" aria-hidden="true" /> : 'Delete job'}
      triggerClassName={compact ? button('dangerGhost', 'sm') : button('danger')}
      triggerLabel={compact ? `Delete ${job.title}` : undefined}
      disabled={applications > 0}
      disabledReason={`This job has ${applications === 1 ? 'an application' : `${applications} applications`}, so it can't be deleted. Close it instead.`}
    >
      <p>
        <strong className="text-slate-900">{job.title}</strong> ({job.code}) will be deleted
        {job.status === 'published' ? ' and removed from the Job Board' : ''}. This can&apos;t be undone.
      </p>
    </ConfirmDialogButton>
  );
}
