export const communicationKeys = {
  all: ['communication'] as const,
  wallet: (workspaceId: string) => [...communicationKeys.all, 'wallet', workspaceId] as const,
  preview: (workspaceId: string, message: string, recipientCount: number) =>
    [...communicationKeys.all, 'preview', workspaceId, message, recipientCount] as const,
};
