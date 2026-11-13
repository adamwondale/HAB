import React from 'react';
import { ClearanceRecord, Employee, PayrollRecord } from '../types/hrm';

interface SharedRecordsTableProps {
  employees: Employee[];
  payroll: PayrollRecord[];
  clearances: ClearanceRecord[];
  onNavigateTab: (tabId: string) => void;
}

type StatusTone = 'good' | 'warn' | 'quiet';

const statusStyles: Record<StatusTone, string> = {
  good: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  warn: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  quiet: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

function StatusBadge({ children, tone = 'quiet' }: { children: React.ReactNode; tone?: StatusTone }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[tone]}`}>
      {children}
    </span>
  );
}

export const SharedRecordsTable: React.FC<SharedRecordsTableProps> = ({
  employees,
  payroll,
  clearances,
  onNavigateTab
}) => {
  const sharedRecords = employees.slice(0, 6).map(employee => {
    const pay = payroll.find(record => record.employeeId === employee.id);
    const clearance = clearances.find(record => record.employeeId === employee.id && record.status !== 'Completed');

    return {
      employee,
      payStatus: pay?.paymentStatus || 'Not added',
      propertyStatus: clearance && !clearance.storeAssetSignoff.completed ? 'Return due' : 'Up to date'
    };
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] text-left text-xs">
          <thead>
            <tr className="bg-[#FCF0DA]/60 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3 text-[#4C4541] dark:text-slate-200 font-bold">Employee</th>
              <th className="px-4 py-3 text-[#4C4541] dark:text-slate-200 font-bold">HR record</th>
              <th className="px-4 py-3 text-[#4C4541] dark:text-slate-200 font-bold">Pay record</th>
              <th className="px-4 py-3 text-[#4C4541] dark:text-slate-200 font-bold">Store record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sharedRecords.map(({ employee, payStatus, propertyStatus }) => (
              <tr key={employee.id} className="hover:bg-[#FCF0DA]/20 dark:hover:bg-slate-800/60 transition-colors">
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('management')}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A]"
                  >
                    <span className="block font-semibold text-slate-950 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-slate-500">
                      {employee.employeeCode}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    tone={
                      employee.status === 'Active' || employee.status === 'Probation'
                        ? 'good'
                        : employee.status === 'In Clearance' || employee.status === 'Suspended'
                        ? 'warn'
                        : 'quiet'
                    }
                  >
                    {employee.status}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge tone={payStatus === 'Not added' ? 'warn' : 'good'}>
                    {payStatus}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge tone={propertyStatus === 'Return due' ? 'warn' : 'good'}>
                    {propertyStatus}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
