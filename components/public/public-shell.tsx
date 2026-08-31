import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col"><PublicHeader /><main className="flex flex-1 flex-col">{children}</main><PublicFooter /></div>;
}
