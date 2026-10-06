'use client';

import { CheckCircle2, LogOut, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { authClient, signOut, useSession } from '@/lib/auth/client';

const resendCooldownSeconds = 60;

export function VerifyEmailCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [cooldown, setCooldown] = useState(resendCooldownSeconds);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!session && !isPending) router.replace('/signin');
    if (session?.user.emailVerified) router.replace('/post-auth');
  }, [isPending, router, session]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = window.setInterval(
      () => setCooldown((seconds) => Math.max(0, seconds - 1)),
      1_000
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const resend = async () => {
    if (!session?.user.email || cooldown > 0) return;
    setIsSending(true);
    const result = await authClient.sendVerificationEmail({
      email: session.user.email,
      callbackURL: `${window.location.origin}/verify-email?next=/post-auth`,
    });
    setIsSending(false);

    if (result.error) {
      toast.error('We could not send a verification email. Please try again shortly.');
      return;
    }

    setCooldown(resendCooldownSeconds);
    toast.success('Verification email sent.');
  };

  const logout = async () => {
    await signOut();
    router.replace('/signin');
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12 sm:px-8">
      <section
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8"
        aria-labelledby="verify-email-title"
      >
        <div className="flex size-11 items-center justify-center rounded-full border border-accent-border bg-accent-soft text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h1
          id="verify-email-title"
          className="mt-6 font-heading text-3xl font-medium tracking-tight"
        >
          Verify your email
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We sent a verification link to{' '}
          <span className="font-medium text-foreground">{session.user.email}</span>. Open it to
          continue to EduFlow.
        </p>
        {searchParams.get('error') ? (
          <Alert className="mt-5" variant="destructive">
            <AlertTitle>That verification link is no longer valid</AlertTitle>
            <AlertDescription>
              Request a new email below, then use the most recent link.
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>Check your inbox and spam folder. The link expires after one hour.</span>
          </div>
        </div>
        <Button
          className="mt-6 h-10 w-full"
          variant="outline"
          disabled={cooldown > 0 || isSending}
          onClick={resend}
        >
          {isSending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RefreshCw data-icon="inline-start" />
          )}
          {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend verification email'}
        </Button>
        <div className="mt-6 border-t border-border pt-5">
          <p className="flex gap-2 text-xs leading-5 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
            Once verified, this page will take you to your account automatically.
          </p>
          <Button className="mt-4" variant="ghost" size="sm" onClick={logout}>
            <LogOut data-icon="inline-start" />
            Sign out
          </Button>
        </div>
      </section>
    </main>
  );
}
