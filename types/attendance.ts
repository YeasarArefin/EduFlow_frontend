export const ATTENDANCE_SESSION_STATUSES = ['draft', 'finalized'] as const;
export const ATTENDANCE_RECORD_STATUSES = ['present', 'absent'] as const;

export type AttendanceSessionStatus = (typeof ATTENDANCE_SESSION_STATUSES)[number];
export type AttendanceRecordStatus = (typeof ATTENDANCE_RECORD_STATUSES)[number];

export type AttendanceStudent = {
  id: string;
  studentCode: string;
  fullName: string;
  phone: string | null;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  status: AttendanceRecordStatus;
  createdAt: string;
  updatedAt: string;
  student: AttendanceStudent;
};

export type AttendanceSession = {
  id: string;
  batchId: string;
  sessionDate: string;
  status: AttendanceSessionStatus;
  batch: { id: string; name: string; classDays?: number[] };
  records: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
};

export type AttendanceSessionSummary = Omit<AttendanceSession, 'records'> & {
  rosterCount: number;
  presentCount: number;
  absentCount: number;
};

export type AttendanceSessionListParams = {
  batchId?: string;
  sessionDate?: string;
  status?: AttendanceSessionStatus;
  page?: number;
  limit?: number;
};

export type AttendanceSessionListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AttendanceRecordInput = Pick<AttendanceRecord, 'studentId' | 'status'>;

export type CreateAttendanceSessionInput = Pick<AttendanceSession, 'batchId' | 'sessionDate'>;

export type SaveAttendanceInput = {
  sessionId: string;
  records: AttendanceRecordInput[];
};

export type AttendancePageProps = { workspaceId: string };

export type AttendanceControlProps = {
  value: AttendanceRecordStatus;
  disabled: boolean;
  onChange: (status: AttendanceRecordStatus) => void;
};

export type AttendanceRosterProps = AttendanceControlProps & { record: AttendanceRecord };

export type AttendanceHistoryRowProps = {
  session: AttendanceSessionSummary;
  onOpen: () => void;
};

export type AttendanceSessionSelectorProps = {
  batches: Array<{ id: string; name: string; classDays: number[]; status: string }>;
  selectedBatchId: string;
  onBatchChange: (batchId: string) => void;
  sessionDate: string;
  onDateChange: (date: string) => void;
  onLoadSession?: () => void;
  isLoading: boolean;
};

export type AttendanceSessionWorkbenchProps = {
  session: AttendanceSession;
  draftStatuses: Record<string, AttendanceRecordStatus>;
  onStatusChange: (studentId: string, status: AttendanceRecordStatus) => void;
  onMarkAll: (status: AttendanceRecordStatus) => void;
  onSaveDraft: () => void;
  onFinalize: () => void;
  isSaving: boolean;
  isFinalizing: boolean;
  isDirty: boolean;
};

export type AttendanceHistoryTableProps = {
  sessions: AttendanceSessionSummary[];
  batches: Array<{ id: string; name: string }>;
  selectedBatchId: string;
  onBatchChange: (batchId: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isLoading: boolean;
  onOpenSession: (session: AttendanceSessionSummary) => void;
  onRetry?: () => void;
  isError?: boolean;
};
