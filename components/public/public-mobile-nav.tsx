"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/lib/auth/sign-out";

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export function PublicMobileNav({ user }: { user?: { name?: string | null } }) {
  const [open, setOpen] = useState(false);
  const signOut = useSignOut();
  const displayName = user?.name || "Account";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-4 shadow-sm">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {link.label}
              </Link>
            ))}
            {user ? <div className="mt-3 flex items-center justify-between border-t border-border px-4 pt-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" aria-hidden="true">{initial}</span><span className="truncate text-sm font-medium">{displayName}</span></div><Button variant="outline" size="sm" onClick={() => { setOpen(false); void signOut(); }}><LogOut data-icon="inline-start" /> Sign out</Button></div> : <Link href="/signin" onClick={() => setOpen(false)} className="mt-2 flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">Sign In</Link>}
          </nav>
        </div>
      )}
    </div>
  );
}
