'use client';

import {
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  StatCard,
} from '@/components/dashboard-primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SALARY_STATUSES, type Salary, type SalaryStatus } from '../api/salaries';
import { useSalaries } from '../hooks/use-salaries';
import { GenerateSalariesDialog } from './generate-salaries-dialog';
import { formatSalaryMoney } from './salary-formatters';
import { SalaryPaymentHistorySheet } from './salary-payment-history-sheet';
import { SalaryPaymentSheet } from './salary-payment-sheet';
import { SalaryResults } from './salary-results';

const currentMonth = () =>
  `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

export function SalaryManagementPage({ workspaceId }: { workspaceId: string }) {
  const [salaryMonth, setSalaryMonth] = useState(currentMonth);
  const [status, setStatus] = useState<SalaryStatus>();
  const [search, setSearch] = useState('');
  const [paymentSalary, setPaymentSalary] = useState<Salary | null>(null);
  const [historySalary, setHistorySalary] = useState<Salary | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const salaries = useSalaries(workspaceId, { salaryMonth, status, page: 1, limit: 100, search });
  const rows = (salaries.data?.data ?? []).filter(
    (salary) =>
      !search ||
      salary.teacher?.name.toLowerCase().includes(search.toLowerCase()) ||
      salary.teacher?.teacherCode.toLowerCase().includes(search.toLowerCase())
  );
  const totals = useMemo(
    () =>
      rows.reduce(
        (total, salary) => ({
          expected:
            total.expected + Number(salary.expectedSalary) + Number(salary.adjustmentAmount),
          paid: total.paid + Number(salary.paidAmount),
          due: total.due + Number(salary.dueAmount),
          overdue: total.overdue + (salary.status === 'overdue' ? Number(salary.dueAmount) : 0),
        }),
        { expected: 0, paid: 0, due: 0, overdue: 0 }
      ),
    [rows]
  );
  const generateButton = (
    <Button className="rounded-full" onClick={() => setIsGenerateOpen(true)}>
      <CalendarPlus data-icon="inline-start" />
      Generate monthly salaries
    </Button>
  );
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Teacher salaries"
        description="Track monthly salary dues and record immutable payouts."
        actions={generateButton}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total salary" value={formatSalaryMoney(totals.expected)} />
        <StatCard label="Paid" value={formatSalaryMoney(totals.paid)} status="success" />
        <StatCard label="Outstanding" value={formatSalaryMoney(totals.due)} status="warning" />
        <StatCard label="Overdue" value={formatSalaryMoney(totals.overdue)} status="danger" />
      </div>
      <FilterToolbar
        placeholder="Search teacher name or code"
        searchValue={search}
        onSearch={setSearch}
      >
        <Input
          className="w-40"
          type="month"
          aria-label="Salary month"
          value={salaryMonth.slice(0, 7)}
          onChange={(event) => setSalaryMonth(`${event.target.value}-01`)}
        />
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            setStatus(value === 'all' ? undefined : (value as SalaryStatus))
          }
        >
          <SelectTrigger className="w-40" aria-label="Salary status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {SALARY_STATUSES.map((salaryStatus) => (
                <SelectItem key={salaryStatus} value={salaryStatus}>
                  {salaryStatus.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>
      {salaries.isPending ? (
        <LoadingState />
      ) : salaries.isError ? (
        <ErrorState message="Could not load salaries." onRetry={() => salaries.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No salary ledgers"
          description="Generate salary ledgers before recording payouts."
          action={generateButton}
        />
      ) : (
        <SalaryResults rows={rows} onPay={setPaymentSalary} onHistory={setHistorySalary} />
      )}
      <GenerateSalariesDialog
        workspaceId={workspaceId}
        salaryMonth={salaryMonth}
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
      />
      <SalaryPaymentSheet
        salary={paymentSalary}
        workspaceId={workspaceId}
        onClose={() => setPaymentSalary(null)}
      />
      <SalaryPaymentHistorySheet
        salary={historySalary}
        workspaceId={workspaceId}
        onClose={() => setHistorySalary(null)}
      />
    </div>
  );
}
