import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PublicContainer } from "@/components/public/public-container";
import { PublicMobileNav } from "@/components/public/public-mobile-nav";
import { PublicAccount } from "@/components/public/public-account";
import { getServerSession } from "@/lib/auth/server";

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export async function PublicHeader() {
  const session = await getServerSession();
  const user = session?.user;
  return (
    <header className="relative border-b border-border bg-background">
      <PublicContainer className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 rounded-full text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="EduFlow home">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold tracking-tight text-primary-foreground">EF</span>
          <span className="text-base font-semibold tracking-tight">EduFlow</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? <PublicAccount name={user.name} /> : <Button render={<Link href="/signin" />} size="sm">Sign In</Button>}
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <PublicMobileNav user={user} />
        </div>
      </PublicContainer>
    </header>
  );
}
