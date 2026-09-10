import { DataTable } from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, History } from 'lucide-react';
import type { SalaryResultsProps } from '@/types/salaries';
import { formatSalaryMoney, salaryStatusVisual } from '@/utils/salary-formatters';

export function SalaryResults({ rows, onPay, onHistory }: SalaryResultsProps) {
  return (
    <>
      <div className="hidden md:block">
        <DataTable>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Adjustment</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell>
                  {salary.teacher?.name}
                  <p className="font-mono text-xs text-muted-foreground">
                    {salary.teacher?.teacherCode}
                  </p>
                </TableCell>
                <TableCell>{salary.salaryMonth}</TableCell>
                <TableCell>{formatSalaryMoney(salary.expectedSalary)}</TableCell>
                <TableCell>{formatSalaryMoney(salary.adjustmentAmount)}</TableCell>
                <TableCell>{formatSalaryMoney(salary.paidAmount)}</TableCell>
                <TableCell>{formatSalaryMoney(salary.dueAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={salaryStatusVisual[salary.status]}>
                    {salary.status.replace('_', ' ')}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => onPay(salary)}
                      disabled={Number(salary.dueAmount) <= 0}
                    >
                      <CreditCard data-icon="inline-start" />
                      Pay salary
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View ${salary.teacher?.name ?? 'teacher'} payment history`}
                      onClick={() => onHistory(salary)}
                    >
                      <History />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.map((salary) => (
          <div className="rounded-xl border border-border bg-card p-4" key={salary.id}>
            <div className="flex justify-between gap-3">
              <b>{salary.teacher?.name}</b>
              <StatusBadge status={salaryStatusVisual[salary.status]}>
                {salary.status.replace('_', ' ')}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              {salary.teacher?.teacherCode} · {salary.salaryMonth}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <span>
                Expected
                <br />
                <b>{formatSalaryMoney(salary.expectedSalary)}</b>
              </span>
              <span>
                Paid
                <br />
                <b>{formatSalaryMoney(salary.paidAmount)}</b>
              </span>
              <span>
                Due
                <br />
                <b>{formatSalaryMoney(salary.dueAmount)}</b>
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => onPay(salary)}
                disabled={Number(salary.dueAmount) <= 0}
              >
                Pay salary
              </Button>
              <Button size="sm" variant="outline" onClick={() => onHistory(salary)}>
                History
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
