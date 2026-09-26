export const EXPENSE_PAYMENT_METHODS = [
  'cash',
  'bkash',
  'nagad',
  'rocket',
  'bank_transfer',
  'card',
  'other',
] as const;
export type ExpensePaymentMethod = (typeof EXPENSE_PAYMENT_METHODS)[number];
export type ExpenseStatus = 'active' | 'reversed';
export type ExpenseCategory = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Expense = {
  id: string;
  categoryId: string;
  title: string;
  amount: string;
  expenseDate: string;
  paymentMethod: ExpensePaymentMethod;
  description: string | null;
  recordedByUserId: string;
  status: ExpenseStatus;
  reversedAt: string | null;
  reversedByUserId: string | null;
  reversalReason: string | null;
  createdAt: string;
  updatedAt: string;
  category: Pick<ExpenseCategory, 'id' | 'name'>;
};
export type ExpenseListParams = {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  status?: ExpenseStatus;
  page?: number;
  limit?: number;
};
export type ExpenseListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  activeTotal: string;
};
export type CreateExpenseInput = {
  categoryId: string;
  title: string;
  amount: string;
  expenseDate: string;
  paymentMethod: ExpensePaymentMethod;
  description?: string;
};
export type UpdateExpenseInput = Partial<CreateExpenseInput>;
export type FinancialOverview = {
  period: { startDate: string; endDate: string };
  collectedFees: string;
  paidTeacherSalaries: string;
  otherExpenses: string;
  totalExpenditure: string;
  netIncome: string;
  categoryBreakdown: { name: string; amount: string }[];
  monthly: { month: string; income: string; salaries: string; otherExpenses: string }[];
};
export type WorkspacePageProps = { workspaceId: string };
export type ExpenseSheetProps = {
  workspaceId: string;
  categories: ExpenseCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
};
