import { ResetPasswordCard } from '@/features/auth/components/reset-password-card';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : undefined;

  return <ResetPasswordCard token={token} invalidLink={params.error === 'INVALID_TOKEN'} />;
}
