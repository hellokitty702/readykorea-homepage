import type { Metadata } from 'next';
import { PasswordForm, ProfileForm } from '@/components/admin/account-forms';
import { card, cardTitle, cx } from '@/components/admin/styles';
import { PageHeader, PageSub } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage() {
  const me = await requireAdmin();

  return (
    <>
      <PageHeader title="Account">
        <PageSub>The admin account. It is the only account that can sign in to this panel.</PageSub>
      </PageHeader>

      <section className={cx(card, 'max-w-190')}>
        <h2 className={cardTitle}>Profile</h2>
        <ProfileForm name={me.name} email={me.email} />
      </section>

      <section className={cx(card, 'max-w-190')}>
        <h2 className={cardTitle}>Password</h2>
        <PasswordForm />
      </section>
    </>
  );
}
