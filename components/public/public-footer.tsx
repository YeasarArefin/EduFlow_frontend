import Link from "next/link";
import { PublicContainer } from "@/components/public/public-container";

export function PublicFooter() {
  return (
    <footer className="border-t border-border">
      <PublicContainer className="flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} EduFlow</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
          <Link href="/features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link href="/faq" className="transition-colors hover:text-foreground">FAQ</Link>
          <Link href="/signin" className="transition-colors hover:text-foreground">Sign In</Link>
        </nav>
      </PublicContainer>
    </footer>
  );
}
