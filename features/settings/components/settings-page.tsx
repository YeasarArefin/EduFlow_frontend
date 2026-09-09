'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/dashboard-primitives';
import { cn } from '@/lib/utils';
import { AcademicSetup } from './academic-setup';
import { WorkspaceSettingsCards } from './workspace-settings-cards';

const tabs = ['general', 'billing', 'academic', 'salary', 'sms', 'reminders'] as const;
const labels = {
  general: 'General',
  billing: 'Billing',
  academic: 'Academic Setup',
  salary: 'Salary Settings',
  sms: 'SMS Settings',
  reminders: 'Reminder Settings',
};
type Tab = (typeof tabs)[number];
export function SettingsPage({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get('tab');
  const tab: Tab = tabs.includes(requested as Tab) ? (requested as Tab) : 'general';

  function select(next: Tab) {
    const params = new URLSearchParams(searchParams);
    if (next === 'general') params.delete('tab');
    else params.set('tab', next);
    router.replace(params.size ? `${pathname}?${params}` : pathname);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your center configuration and preferences."
      />
      <nav className="w-full overflow-x-auto border-b border-border" aria-label="Settings sections">
        <div className="grid min-w-[720px] grid-cols-6">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => select(item)}
              className={cn(
                'h-10 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                tab === item
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </nav>
      {tab === 'academic' ? (
        <AcademicSetup workspaceId={workspaceId} />
      ) : (
        <WorkspaceSettingsCards workspaceId={workspaceId} tab={tab} />
      )}
    </div>
  );
}
