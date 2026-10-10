import type { ApplicationStatus } from '@/lib/db/schema';

/** Main hiring path, in order. */
export const PIPELINE: ApplicationStatus[] = ['new', 'reviewing', 'interview', 'offered', 'hired'];
/** Ways out of the pipeline. */
export const EXITS: ApplicationStatus[] = ['rejected', 'withdrawn'];
export const ALL_STATUSES: ApplicationStatus[] = [...PIPELINE, ...EXITS];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  interview: 'Interview',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

/**
 * Allowed moves from each status: one step forward, or out (rejected / withdrawn) while still open.
 * Closed applications can be reopened into Reviewing.
 */
export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  new: ['reviewing', 'rejected', 'withdrawn'],
  reviewing: ['interview', 'rejected', 'withdrawn'],
  interview: ['offered', 'rejected', 'withdrawn'],
  offered: ['hired', 'rejected', 'withdrawn'],
  hired: [],
  rejected: ['reviewing'],
  withdrawn: ['reviewing'],
};

export const ACTION_LABEL: Record<ApplicationStatus, string> = {
  new: 'Mark as new',
  reviewing: 'Start review',
  interview: 'Move to interview',
  offered: 'Make offer',
  hired: 'Mark as hired',
  rejected: 'Reject',
  withdrawn: 'Mark withdrawn',
};

export const isOpen = (status: ApplicationStatus) => !EXITS.includes(status) && status !== 'hired';

export function canMove(from: ApplicationStatus, to: ApplicationStatus) {
  return TRANSITIONS[from].includes(to);
}
