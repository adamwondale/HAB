import React from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';

interface PayrollCalculationTableProps {
  records: PayrollRecord[];
  canEdit: boolean;
  onOpenPayslip: (record: PayrollRecord) => void;
  onOpenEdit: (record: PayrollRecord) => void;
}

export const PayrollCalculationTable: React.FC<PayrollCalculationTableProps> = ({
  records,
  canEdit,
  onOpenPayslip,
  onOpenEdit
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[980px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Position</th>
              <th className="py-3 px-3 text-right">Basic</th>
              <th className="py-3 px-3 text-right">Non-Taxable Allowance</th>
              <th className="py-3 px-3 text-right">Taxable Allowance</th>
              <th className="py-3 px-3 text-right">Gross (Tax)</th>
              <th className="py-3 px-3 text-right text-rose-700 dark:text-rose-400">Income Tax</th>
              <th className="py-3 px-3 text-right text-indigo-700 dark:text-indigo-400">Pension (7% / 11%)</th>
              <th className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-400">Net</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 italic">
                  No payroll records match the active filter.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                // Non-taxable allowance: statutory non-tax transport (up to limit) or non-taxable portion
                const nonTaxableAllowance = Math.min(record.transportAllowance, 600);
                // Taxable allowance: excess transport + mobile card + housing + overtime
                const taxableAllowance =
                  Math.max(0, record.transportAllowance - 600) +
                  record.mobileCardAllowance +
                  record.houseAllowance +
                  record.overtimePay;
                const employer11 =
                  record.pensionEmployer11Percent || Math.round(record.earnedBaseSalary * 0.11);

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors odd:bg-white even:bg-slate-50/40 dark:odd:bg-slate-900 dark:even:bg-slate-800/20"
                  >
                    {/* 1. Name */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{record.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{record.employeeCode}</div>
                    </td>

                    {/* 2. Position */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{record.serviceType}</div>
                      <div className="text-[10px] text-slate-400">{record.workingDays}/30 Days</div>
                    </td>

                    {/* 3. Basic */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      ETB {record.earnedBaseSalary.toLocaleString()}
                    </td>

                    {/* 4. Non-Taxable Allowance */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      ETB {nonTaxableAllowance.toLocaleString()}
                    </td>

                    {/* 5. Taxable Allowance */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      ETB {taxableAllowance.toLocaleString()}
                    </td>

                    {/* 6. Gross (Tax) */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      ETB {record.grossPay.toLocaleString()}
                    </td>

                    {/* 7. Income Tax */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400 font-semibold">
                      -ETB {record.incomeTaxDeduction.toLocaleString()}
                    </td>

                    {/* 8. Pension (7% / 11%) */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-indigo-700 dark:text-indigo-300">
                      <div>-ETB {record.pensionEmployeeDeduction.toLocaleString()} (7%)</div>
                      <div className="text-[10px] text-indigo-500">+{employer11.toLocaleString()} (11%)</div>
                    </td>

                    {/* 9. Net */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      ETB {record.netPay.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPayslip(record)}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
                          title="View Official Payslip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onOpenEdit(record)}
                            className="p-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 cursor-pointer"
                            title="Edit Payroll Entry"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
