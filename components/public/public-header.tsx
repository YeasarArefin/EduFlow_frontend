import { PublicAccount } from '@/components/public/public-account';
import { PublicContainer } from '@/components/public/public-container';
import { PublicMobileNav } from '@/components/public/public-mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { serverEnv } from '@/config/server-env';
import { getServerSession } from '@/lib/auth/server';
import { LayoutDashboard, Shield } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
];

export async function PublicHeader() {
  const session = await getServerSession();
  const user = session?.user;

  let isAdmin = false;
  if (user?.id) {
    try {
      const cookie = (await headers()).get('cookie') ?? '';
      const platformAccess = await fetch(`${serverEnv.apiBaseUrl}/plans`, {
        headers: { cookie },
        cache: 'no-store',
      });
      isAdmin = platformAccess.ok;
    } catch {
      isAdmin = false;
    }
  }

  const dashboardHref = isAdmin ? '/platform' : '/post-auth';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-[20px] transition-all">
      <PublicContainer className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-full text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 group"
          aria-label="EduFlow home"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold tracking-tight text-primary-foreground shadow-[0_0_14px_rgba(190,242,100,0.35)] transition-transform group-hover:scale-105">
            EF
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground font-heading">
            EduFlow
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button
                variant="default"
                size="lg"
                className="rounded-full gap-1.5"
                render={<Link href={dashboardHref} />}
              >
                {isAdmin ? (
                  <>
                    <Shield className="size-3.5" data-icon="inline-start" />
                    <span>Admin</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="size-3.5" data-icon="inline-start" />
                    <span>Workspace</span>
                  </>
                )}
              </Button>
              <PublicAccount name={user.name} isAdmin={isAdmin} />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full"
                render={<Link href="/signin" />}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-full cursor-pointer"
                render={<Link href="/signup" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <PublicMobileNav user={user} isAdmin={isAdmin} dashboardHref={dashboardHref} />
        </div>
      </PublicContainer>
    </header>
  );
}
