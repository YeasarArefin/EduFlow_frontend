import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { postAuthDestinations, resolvePostAuthDestination } from '@/lib/auth/post-auth-destination';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const destination = await resolvePostAuthDestination();
  if (destination !== postAuthDestinations.account) redirect(destination);

  return (
    <PublicContainer className="flex flex-1 items-center py-16 sm:py-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-heading text-3xl font-medium tracking-tight">
            Choose a plan when you’re ready
          </CardTitle>
          <CardDescription className="max-w-prose leading-7">
            Your account is ready. Choose a plan and submit payment when you want to start a
            workspace; no workspace is created until an approved payment unlocks it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          You can return later and continue from this account in any browser.
        </CardContent>
        <CardFooter>
          <Button render={<Link href="/pricing" />}>View plans</Button>
        </CardFooter>
      </Card>
    </PublicContainer>
  );
}
