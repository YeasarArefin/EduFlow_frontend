"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHeader, SectionCard } from "@/components/dashboard-primitives";
import { cn } from "@/lib/utils";
import { AcademicReferenceCard } from "./academic-reference-card";

const tabs = [
  "general",
  "billing",
  "academic",
  "salary",
  "sms",
  "reminders",
] as const;
const labels = {
  general: "General",
  billing: "Billing",
  academic: "Academic Setup",
  salary: "Salary Settings",
  sms: "SMS Settings",
  reminders: "Reminder Settings",
};
type Tab = (typeof tabs)[number];
function AcademicSetup({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start">
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="class-levels"
        title="Class Levels"
        description="Define the classes taught by your coaching center."
      />
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="mediums"
        title="Mediums"
        description="Define the academic mediums your center supports."
      />
      <AcademicReferenceCard
        workspaceId={workspaceId}
        resource="academic-groups"
        title="Academic Groups"
        description="Define group options such as Science or Business Studies."
      />
    </div>
  );
}

export function SettingsPage({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: Tab = tabs.includes(requested as Tab)
    ? (requested as Tab)
    : "general";

  function select(next: Tab) {
    const params = new URLSearchParams(searchParams);
    if (next === "general") params.delete("tab");
    else params.set("tab", next);
    router.replace(params.size ? `${pathname}?${params}` : pathname);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your center configuration and preferences."
      />
      <nav
        className="w-full overflow-x-auto border-b border-border"
        aria-label="Settings sections"
      >
        <div className="grid min-w-[720px] grid-cols-6">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => select(item)}
              className={cn(
                "h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                tab === item
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </nav>
      {tab === "academic" ? (
        <AcademicSetup workspaceId={workspaceId} />
      ) : (
        <SectionCard
          title={labels[tab]}
          description="No workspace settings are available for this group yet."
        >
          <p className="text-sm text-muted-foreground">
            There are no saved settings to display.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
