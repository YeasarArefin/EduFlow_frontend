"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/lib/auth/sign-out";

export function PublicAccount({ name }: { name?: string | null }) {
  const signOut = useSignOut();
  const displayName = name || "Account";
  const initial = displayName.slice(0, 1).toUpperCase();

  return <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" aria-hidden="true">{initial}</span><span className="hidden max-w-36 truncate text-sm font-medium lg:block">{displayName}</span><Button variant="outline" size="sm" onClick={signOut}><LogOut data-icon="inline-start" /> Sign out</Button></div>;
}
