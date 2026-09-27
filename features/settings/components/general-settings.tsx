import type { GeneralSettingsProps } from '@/types/settings';
import { AccountInformationCard } from './account-information-card';
import { CoachingCenterInformationCard } from './coaching-center-information-card';

export function GeneralSettings({ workspaceId }: GeneralSettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      <AccountInformationCard />
      <CoachingCenterInformationCard workspaceId={workspaceId} />
    </div>
  );
}
