import Link from "next/link";
import { PublicContainer } from "@/components/public/public-container";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <PublicContainer className="py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Mission Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-full text-foreground outline-none group"
              aria-label="EduFlow home"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold tracking-tight text-primary-foreground shadow-[0_0_14px_rgba(190,242,100,0.35)] transition-transform group-hover:scale-105">
                EF
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground font-heading">EduFlow</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground font-light leading-relaxed">
              The intelligent operating system for tutors and coaching centers. Manage students, batches,
              attendance, fees, and guardian notifications from one synchronized workspace.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/70">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_6px_rgba(190,242,100,0.8)]" />
              <span>All systems operational · Enterprise multi-tenant isolation</span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="transition-colors hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/signin" className="transition-colors hover:text-accent-foreground">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="transition-colors hover:text-foreground">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition-colors hover:text-foreground">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Company & Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/pricing" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#security" className="transition-colors hover:text-foreground">
                  Security
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/50">
                  Privacy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/50">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground/70 sm:flex-row">
          <p>© {new Date().getFullYear()} EduFlow. All rights reserved.</p>
          <p className="font-mono text-[11px] text-muted-foreground/50">Multi-tenant education operations architecture.</p>
        </div>
      </PublicContainer>
    </footer>
  );
}
