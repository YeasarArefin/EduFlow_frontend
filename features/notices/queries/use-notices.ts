'use client';
import { useQuery } from '@tanstack/react-query';
import { getNotice, getNoticeRecipients, getNotices, previewNotice } from '../api/notices';
import { noticeKeys } from '../notice-query-keys';
export const useNotices = (workspaceId: string) => useQuery({ queryKey: noticeKeys.list(workspaceId), queryFn: ({ signal }) => getNotices(workspaceId, signal), enabled: Boolean(workspaceId), staleTime: 20_000 });
export const useNotice = (workspaceId: string, id: string) => useQuery({ queryKey: noticeKeys.detail(workspaceId, id), queryFn: ({ signal }) => getNotice(workspaceId, id, signal), enabled: Boolean(workspaceId && id), staleTime: 3_000, refetchInterval: (query) => { const p = query.state.data?.progress; return p && (p.queued > 0 || p.processing > 0) ? 2_500 : false; } });
export const useNoticeRecipients = (workspaceId: string, id: string, status: 'failed' | 'skipped') => useQuery({ queryKey: noticeKeys.recipients(workspaceId, id, status), queryFn: ({ signal }) => getNoticeRecipients(workspaceId, id, status, signal), enabled: Boolean(workspaceId && id), staleTime: 5_000 });
export const useNoticePreview = (workspaceId: string, id: string) => useQuery({ queryKey: [...noticeKeys.detail(workspaceId, id), 'preview'], queryFn: () => previewNotice(workspaceId, id), enabled: Boolean(workspaceId && id), staleTime: 30_000 });
