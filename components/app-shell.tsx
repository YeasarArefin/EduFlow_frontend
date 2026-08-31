"use client"

import { Menu, ChevronDown, LogOut, PanelLeft, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type AppShellNavItem = { label: string; href: string; icon?: ReactNode }
export type AppShellNavGroup = { label?: string; items: AppShellNavItem[] }
export type AppShellUser = { name: string; email?: string; onSignOut?: () => void }

export function AppShell({ children, navigation, productName = "EduFlow", user }: { children: ReactNode; navigation: AppShellNavGroup[]; productName?: string; user?: AppShellUser }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const nav = <ShellNavigation groups={navigation} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
      <ShellBrand productName={productName} />
      <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>
      <ShellFooter user={user} />
    </aside>
    {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" aria-hidden="true" onClick={() => setMobileOpen(false)} />}
    <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")} aria-label="Mobile navigation">
      <div className="flex items-center justify-between px-4"><ShellBrand productName={productName} /><Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></Button></div>
      <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div><ShellFooter user={user} />
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8"><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></Button><div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex"><PanelLeft className="size-4" /> Workspace</div><div className="ml-auto flex items-center gap-2"><ThemeToggle />{user && <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>}</div></header><main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main></div>
  </div>
}

function ShellBrand({ productName }: { productName: string }) { return <Link href="/" className="flex h-14 items-center gap-2 px-2 text-base font-semibold tracking-tight"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">E</span>{productName}</Link> }
function ShellNavigation({ groups, pathname, onNavigate }: { groups: AppShellNavGroup[]; pathname: string; onNavigate: () => void }) { return <nav className="flex flex-col gap-6" aria-label="Application navigation">{groups.map((group, i) => <div key={group.label ?? i} className="flex flex-col gap-1"><p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.label}</p>{group.items.map(item => { const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)); return <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("flex h-9 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")} aria-current={active ? "page" : undefined}>{item.icon}{item.label}</Link> })}</div>)}</nav> }
function ShellFooter({ user }: { user?: AppShellUser }) { return <div className="flex flex-col gap-3 p-4"><Separator />{user && <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{user.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name}</p>{user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}</div><ChevronDown className="size-4 text-muted-foreground" /></div>}{user?.onSignOut && <Button variant="ghost" size="sm" className="justify-start" onClick={user.onSignOut}><LogOut data-icon="inline-start" /> Sign out</Button>}</div> }
