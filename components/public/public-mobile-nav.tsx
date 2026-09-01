"use client";

import { LayoutDashboard, LogOut, Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/lib/auth/sign-out";

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export function PublicMobileNav({
  user,
  isAdmin = false,
  dashboardHref = "/post-auth",
}: {
  user?: { name?: string | null };
  isAdmin?: boolean;
  dashboardHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const signOut = useSignOut();
  const displayName = user?.name || "Account";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-4 shadow-sm">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-3 flex flex-col gap-3 border-t border-border pt-4">
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="flex h-9 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {isAdmin ? (
                    <>
                      <Shield className="size-4 text-foreground" />
                      <span>Admin Dashboard</span>
                    </>
                  ) : (
                    <>
                      <LayoutDashboard className="size-4 text-foreground" />
                      <span>Dashboard</span>
                    </>
                  )}
                </Link>

                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {isAdmin ? <Shield className="size-3.5" /> : initial}
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setOpen(false);
                      void signOut();
                    }}
                  >
                    <LogOut data-icon="inline-start" /> Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-ink-deep"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

