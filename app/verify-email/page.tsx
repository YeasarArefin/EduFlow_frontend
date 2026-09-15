import { redirect } from 'next/navigation';
import { VerifyEmailCard } from '@/features/auth/components/verify-email-card';
import { getServerSession } from '@/lib/auth/server';

export default async function VerifyEmailPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/signin');
  if (session.user.emailVerified) redirect('/post-auth');
  return <VerifyEmailCard />;
}
