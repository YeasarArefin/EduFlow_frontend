import { apiListRequest, apiRequest } from "@/lib/api/client";

export const FEE_STATUSES = [
  "unpaid",
  "partially_paid",
  "paid",
  "overpaid",
  "waived",
  "overdue",
] as const;
export type FeeStatus = (typeof FEE_STATUSES)[number];

export const PAYMENT_METHODS = [
  "cash",
  "bkash",
  "nagad",
  "rocket",
  "other",
] as const;
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
  student?: {
    id: string;
    fullName: string;
    studentCode: string;
    phone: string | null;
  };
  batch?: {
    id: string;
    name: string;
  };
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

export type RecordPaymentResult = {
  payment: StudentPayment;
  fee: {
    id: string;
    feeMonth: string;
    expectedAmount: string;
    discountAmount: string;
    paidAmount: string;
    dueAmount: string;
    status: FeeStatus;
  };
  student: {
    id: string;
    fullName: string;
    studentCode: string;
  };
};

export type ReceiptDetail = StudentPayment & {
  fee: {
    id: string;
    feeMonth: string;
    expectedAmount: string;
    discountAmount: string;
    paidAmount: string;
    dueAmount: string;
    status: FeeStatus;
  } | null;
  student: {
    id: string;
    fullName: string;
    studentCode: string;
  } | null;
};

export type BulkGenerateResult = {
  feeMonth: string;
  eligible: number;
  created: number;
  existing: number;
};

const headers = (workspaceId: string) => ({ "X-Workspace-Id": workspaceId });

export function getFees(
  workspaceId: string,
  params: FeeListParams,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    feeMonth: params.feeMonth,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);

  return apiListRequest<StudentFee[], FeeListMeta>(`/student-fees?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function getStudentFees(
  workspaceId: string,
  studentId: string,
  params?: { feeMonth?: string; status?: FeeStatus; page?: number; limit?: number },
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    limit: String(params?.limit ?? 50),
  });
  if (params?.feeMonth) query.set("feeMonth", params.feeMonth);
  if (params?.status) query.set("status", params.status);

  return apiListRequest<StudentFee[], FeeListMeta>(
    `/students/${studentId}/fees?${query}`,
    {
      headers: headers(workspaceId),
      signal,
    },
  );
}

export function getFeePayments(
  workspaceId: string,
  feeId: string,
  signal?: AbortSignal,
) {
  return apiRequest<StudentPayment[]>(`/student-fees/${feeId}/payments`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function recordFeePayment(
  workspaceId: string,
  feeId: string,
  input: RecordPaymentInput,
) {
  return apiRequest<RecordPaymentResult>(`/student-fees/${feeId}/payments`, {
    method: "POST",
    headers: headers(workspaceId),
    body: input,
  });
}

export function getReceiptByNumber(
  workspaceId: string,
  receiptNumber: string,
  signal?: AbortSignal,
) {
  return apiRequest<ReceiptDetail>(
    `/student-payments/receipts/${encodeURIComponent(receiptNumber)}`,
    {
      headers: headers(workspaceId),
      signal,
    },
  );
}

export function getPaymentById(
  workspaceId: string,
  paymentId: string,
  signal?: AbortSignal,
) {
  return apiRequest<ReceiptDetail>(`/student-payments/${paymentId}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function bulkGenerateFees(
  workspaceId: string,
  feeMonth: string,
) {
  return apiRequest<BulkGenerateResult>("/student-fees/generate", {
    method: "POST",
    headers: headers(workspaceId),
    body: { feeMonth },
  });
}
