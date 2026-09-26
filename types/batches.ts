export const BATCH_STATUSES = ['active', 'inactive', 'archived'] as const;

export type BatchStatus = (typeof BATCH_STATUSES)[number];

export type AcademicLabel = { id: string; name: string };

export type Batch = {
  id: string;
  name: string;
  classLevelId: string;
  mediumId: string | null;
  academicGroupId: string | null;
  startDate: string | null;
  classDays: number[];
  monthlyFee?: string;
  monthlyFeeMinor: string;
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
  classLevel?: AcademicLabel;
  medium?: AcademicLabel | null;
  academicGroup?: AcademicLabel | null;
};

export type BatchInput = {
  name: string;
  classLevelId: string;
  mediumId?: string | null;
  academicGroupId?: string | null;
  startDate?: string | null;
  classDays: number[];
  monthlyFee?: number | string;
  monthlyFeeMinor?: string;
  status?: BatchStatus;
};

export type BatchListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: BatchStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BatchTeacher = {
  id: string;
  teacherId: string;
  teacherCode: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: 'active' | 'inactive' | 'archived';
  isPrimary: boolean;
  assignedAt: string;
};

export type Enrollment = {
  id: string;
  studentId: string;
  studentCode: string;
  name: string;
  phone: string | null;
  joinedAt: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled' | 'archived';
  feeOverrideMinor: string | null;
  discountMinor: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BatchEnrollStudentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  batchId: string;
  batchName: string;
  defaultMonthlyFeeMinor: string;
  existingEnrollments: Enrollment[];
};

export type BatchSheetValues = {
  name: string;
  classLevelId: string;
  mediumId: string;
  academicGroupId: string;
  startDate: string;
  classDays: number[];
  monthlyFee: string;
  status: Exclude<BatchStatus, 'archived'>;
};

export type BatchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  batch?: Batch;
};

export type BatchProfileHeroProps = {
  batch: Batch;
  activeStudentsCount: number;
  isStudentsLoading: boolean;
  teachersCount: number;
  isTeachersLoading: boolean;
  onEdit: () => void;
};

export type BatchProfileMetadataItemProps = {
  label: string;
  value: import('react').ReactNode;
  icon: import('react').ReactNode;
};

export type BatchDetailPageProps = { workspaceId: string; id: string };
export type BatchesPageProps = { workspaceId: string };

export type BatchStudentsCardProps = {
  workspaceId: string;
  batchId: string;
  defaultMonthlyFeeMinor: string;
  batchName: string;
};

export type BatchTeachersCardProps = Pick<BatchStudentsCardProps, 'workspaceId' | 'batchId'>;

export type EnrollmentInput = {
  studentId: string;
  joinedAt?: string;
  feeOverrideMinor?: string | null;
  discountMinor?: string | null;
};

export type EnrollmentMutationInput = {
  workspaceId: string;
  batchId: string;
  id: string;
};

export type EnrollStudentMutationInput = Omit<EnrollmentMutationInput, 'id'> & {
  input: EnrollmentInput;
};

export type UpdateEnrollmentMutationInput = EnrollmentMutationInput & {
  input: Partial<Pick<Enrollment, 'status' | 'joinedAt' | 'feeOverrideMinor' | 'discountMinor'>>;
};

export type BatchMutationInput = { workspaceId: string; input: BatchInput };
export type UpdateBatchMutationInput = Omit<BatchMutationInput, 'input'> & {
  id: string;
  input: Partial<BatchInput>;
};

export type BatchTeacherMutationInput = {
  workspaceId: string;
  batchId: string;
  teacherId: string;
  isPrimary: boolean;
};

export type RemoveBatchTeacherMutationInput = Omit<BatchTeacherMutationInput, 'isPrimary'>;
