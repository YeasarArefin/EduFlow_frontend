'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/dashboard-primitives';
import { cn } from '@/lib/utils';
import { SETTING_TABS, type SettingsPageProps, type SettingsTab } from '@/types/settings';
import { AcademicSetup } from './academic-setup';
import { WorkspaceSettingsCards } from './workspace-settings-cards';

const tabs = SETTING_TABS;
const labels = {
  general: 'General',
  billing: 'Billing',
  academic: 'Academic Setup',
  salary: 'Salary Settings',
  sms: 'SMS Settings',
  reminders: 'Reminder Settings',
};
export function SettingsPage({ workspaceId }: SettingsPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get('tab');
  const tab: SettingsTab = tabs.includes(requested as SettingsTab)
    ? (requested as SettingsTab)
    : 'general';

  function select(next: SettingsTab) {
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
