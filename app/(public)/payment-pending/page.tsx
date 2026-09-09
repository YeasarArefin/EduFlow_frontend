import { redirect } from 'next/navigation';
import { PublicContainer } from '@/components/public/public-container';
import { PaymentPendingClient } from '@/components/payment-pending/payment-pending-client';
import { postAuthDestinations, resolvePostAuthDestination } from '@/lib/auth/post-auth-destination';

export default async function PaymentPendingPage() {
  const destination = await resolvePostAuthDestination();
  if (destination === '/signin') redirect('/signin');
  if (destination === postAuthDestinations.platform) redirect(postAuthDestinations.platform);
  if (destination === postAuthDestinations.onboarding) redirect(postAuthDestinations.onboarding);

  if (destination !== postAuthDestinations.paymentPending) redirect(destination);

  return (
    <PublicContainer className="flex flex-1 items-start py-16 sm:py-24">
      <PaymentPendingClient />
    </PublicContainer>
  );
}
