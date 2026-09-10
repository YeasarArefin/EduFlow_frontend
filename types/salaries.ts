export const SALARY_STATUSES = ['pending', 'partially_paid', 'paid', 'overdue', 'waived'] as const;
export type SalaryStatus = (typeof SALARY_STATUSES)[number];

export type Salary = {
  id: string;
  teacherId: string;
  salaryMonth: string;
  expectedSalary: string;
  adjustmentAmount: string;
  paidAmount: string;
  dueAmount: string;
  status: SalaryStatus;
  paymentStartDate: string;
  teacher?: { id: string; name: string; teacherCode: string };
};

export type SalaryPayment = {
  id: string;
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  note: string | null;
  createdAt: string;
};

export type SalaryGenerationResult = {
  salaryMonth: string;
  eligible: number;
  created: number;
  existing: number;
};

export type SalaryListParams = {
  salaryMonth?: string;
  status?: SalaryStatus;
  page?: number;
  limit?: number;
  search?: string;
};

export type SalaryPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
export type RecordSalaryPaymentInput = {
  amount: string;
  paymentMethod: string;
  paymentDate?: string;
  note?: string;
};
export type RecordSalaryPaymentMutationInput = RecordSalaryPaymentInput & { id: string };
export type SalaryManagementPageProps = { workspaceId: string };
export type GenerateSalariesDialogProps = {
  workspaceId: string;
  salaryMonth: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export type SalaryPaymentSheetProps = {
  salary: Salary | null;
  workspaceId: string;
  onClose: () => void;
};
export type SalaryPaymentHistorySheetProps = SalaryPaymentSheetProps;
export type SalaryResultsProps = {
  rows: Salary[];
  onPay: (salary: Salary) => void;
  onHistory: (salary: Salary) => void;
};
