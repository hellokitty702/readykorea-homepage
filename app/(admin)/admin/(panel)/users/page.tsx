import type { Metadata } from 'next';
import { NewUserForm, UserRowActions } from '@/components/admin/user-forms';
import { badge, card, cardFlush, cardTitle, cx, muted, small, strong, table, tag } from '@/components/admin/styles';
import { PageHeader, PageSub, fmtDate, fmtDateTime } from '@/components/admin/ui';
import { listUsers } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Users' };

export default async function UsersPage() {
  const me = await requireAdmin();
  const list = await listUsers();

  return (
    <>
      <PageHeader title="Users">
        <PageSub>Admins can sign in to this panel. Users with the “user” role can&apos;t.</PageSub>
      </PageHeader>

      <section className={cardFlush}>
        <table className={table()}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Last sign-in</th>
              <th>Added</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className={strong}>{u.name}</span> {u.id === me.id && <span className={tag}>You</span>}
                  <div className={cx(muted, small)}>{u.email}</div>
                </td>
                <td>
                  <span
                    className={cx(
                      badge,
                      u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700',
                    )}
                  >
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className={muted}>{fmtDateTime(u.lastLoginAt)}</td>
                <td className={muted}>{fmtDate(u.createdAt)}</td>
                <td className="w-px whitespace-nowrap">
                  <UserRowActions user={{ id: u.id, email: u.email, role: u.role }} isMe={u.id === me.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={cx(card, 'max-w-190')}>
        <h2 className={cardTitle}>Add a user</h2>
        <NewUserForm />
      </section>
    </>
  );
}
