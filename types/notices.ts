export type NoticeAudience = 'batch' | 'all_students' | 'all_teachers';
export type NoticeProgress = { total: number; queued: number; processing: number; sent: number; failed: number; skipped: number };
export type Notice = { id: string; audience: NoticeAudience; batchId: string | null; subject: string; body: string; createdAt: string; updatedAt: string };
export type NoticeDetail = Notice & { progress: NoticeProgress };
export type NoticeRecipient = { id: string; recipientKind: 'student' | 'teacher'; recipientName: string | null; recipientEmail: string | null; status: 'failed' | 'skipped'; retryCount: number; lastError: string | null; sentAt: string | null };
export type NoticePagination = { page: number; limit: number; total: number; totalPages: number };
