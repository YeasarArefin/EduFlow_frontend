export const FEE_STATUSES = [
  'unpaid',
  'partially_paid',
  'paid',
  'overpaid',
  'waived',
  'overdue',
] as const;
export const PAYMENT_METHODS = ['cash', 'bkash', 'nagad', 'rocket', 'other'] as const;

export type FeeStatus = (typeof FEE_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type StudentFee = {
  id: string;
  studentId: string;
  enrollmentId: string;
  feeMonth: string;
  expectedAmount: string;
  discountAmount: string;
  paidAmount: string;
  dueAmount: string;
  status: FeeStatus;
  dueDate: string;
  graceDate: string;
  student?: { id: string; fullName: string; studentCode: string; phone: string | null };
  batch?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export type FeeSummary = {
  totalExpected: string;
  totalCollected: string;
  totalOutstanding: string;
  totalOverdue: string;
};

export type FeeListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  summary?: FeeSummary;
};
export type FeeListParams = {
  feeMonth: string;
  status?: FeeStatus;
  search?: string;
  page?: number;
  limit?: number;
};
export type StudentFeeListParams = Omit<FeeListParams, 'search'>;

export type StudentPayment = {
  id: string;
  studentId: string;
  studentFeeId: string;
  amount: string;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  receiptNumber: string;
  note: string | null;
  recordedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecordPaymentInput = {
  amount: string;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  receiptNumber?: string;
  note?: string;
};
export type FeePaymentSnapshot = Pick<
  StudentFee,
  'id' | 'feeMonth' | 'expectedAmount' | 'discountAmount' | 'paidAmount' | 'dueAmount' | 'status'
>;
export type ReceiptStudent = Pick<
  NonNullable<StudentFee['student']>,
  'id' | 'fullName' | 'studentCode'
>;
export type RecordPaymentResult = {
  payment: StudentPayment;
  fee: FeePaymentSnapshot;
  student: ReceiptStudent;
};
export type ReceiptDetail = StudentPayment & {
  fee: FeePaymentSnapshot | null;
  student: ReceiptStudent | null;
};
export type BulkGenerateResult = {
  feeMonth: string;
  eligible: number;
  created: number;
  existing: number;
};

export type FeesPageProps = { workspaceId: string };
export type CollectPaymentSheetProps = {
  workspaceId: string;
  fee: StudentFee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReceipt: (receiptNumber: string, resultData?: RecordPaymentResult) => void;
};
export type FeePaymentFormProps = {
  workspaceId: string;
  fee: StudentFee;
  onClose: () => void;
  onViewReceipt: CollectPaymentSheetProps['onViewReceipt'];
};
export type FeePaymentHistoryItemProps = {
  payment: StudentPayment;
  onViewReceipt: (receiptNumber: string) => void;
};
export type FeePaymentsHistoryDialogProps = Omit<CollectPaymentSheetProps, 'onViewReceipt'> & {
  onViewReceipt: (receiptNumber: string) => void;
};
export type ReceiptDialogProps = {
  workspaceId: string;
  receiptNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ReceiptDetail | null;
};
export type BulkGenerateFeesDialogProps = {
  workspaceId: string;
  selectedMonth: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export type RecordPaymentMutationInput = { feeId: string; input: RecordPaymentInput };
