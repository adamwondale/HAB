import React from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';
import { getDivisionBadgeStyle } from './payrollHelpers';

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
  const totals = records.reduce(
    (acc, r) => ({
      basic: acc.basic + r.baseSalary,
      gross: acc.gross + r.grossPay,
      tax: acc.tax + r.incomeTaxDeduction,
      pension7: acc.pension7 + r.pensionEmployeeDeduction,
      penalties: acc.penalties + r.penaltiesDeduction,
      food: acc.food + r.foodCostSharingDeduction,
      pension11: acc.pension11 + (r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11)),
      net: acc.net + r.netPay
    }),
    { basic: 0, gross: 0, tax: 0, pension7: 0, penalties: 0, food: 0, pension11: 0, net: 0 }
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left text-xs min-w-[1720px] divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 sticky top-0 z-20 font-bold uppercase tracking-wider text-[10.5px]">
            <tr>
              <th className="py-3 px-2.5 sticky left-0 bg-[#FCF0DA] dark:bg-[#2C2724] z-20 shadow-xs">ID</th>
              <th className="py-3 px-3 sticky left-14 bg-[#FCF0DA] dark:bg-[#2C2724] z-20 shadow-xs">Employee Name</th>
              <th className="py-3 px-2.5">Division</th>
              <th className="py-3 px-2.5 text-right">Basic Salary</th>
              <th className="py-3 px-2 text-center" title="Standard monthly basis: 30 days">Standard Days</th>
              <th className="py-3 px-2 text-center">Payable Days</th>
              <th className="py-3 px-2.5 text-right">Transport</th>
              <th className="py-3 px-2.5 text-right">Mobile Card</th>
              <th className="py-3 px-2.5 text-right">House Allow.</th>
              <th className="py-3 px-2.5 text-right">Overtime</th>
              <th className="py-3 px-3 text-right font-black bg-amber-500/10 text-slate-900 dark:text-slate-100">Gross Earnings</th>
              <th className="py-3 px-2.5 text-right text-rose-700 dark:text-rose-400">Income Tax</th>
              <th className="py-3 px-2.5 text-right text-indigo-700 dark:text-indigo-300">Pension (7%)</th>
              <th className="py-3 px-2.5 text-right text-rose-600">Penalties</th>
              <th className="py-3 px-2.5 text-right text-amber-700">Food Cost</th>
              <th className="py-3 px-3 text-right bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black" title="Non-deductible employer contribution">
                Employer 11%
              </th>
              <th className="py-3 px-3 text-right font-black bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">Net Salary</th>
              <th className="py-3 px-2.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-12 text-center text-slate-400 italic">
                  No payroll records match the active division or filter.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const employer11 = r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11);
                return (
                  <tr key={r.id} className="hover:bg-amber-50/20 dark:hover:bg-slate-800/40 transition-colors odd:bg-white even:bg-slate-50/30 dark:odd:bg-slate-900 dark:even:bg-slate-800/20">
                    <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-500 sticky left-0 bg-inherit shadow-xs font-semibold">
                      {r.employeeCode}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 sticky left-14 bg-inherit shadow-xs">
                      {r.employeeName}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${getDivisionBadgeStyle(r.serviceType)}`}>
                        {r.serviceType}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums font-medium text-slate-700 dark:text-slate-300">
                      ETB {r.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono tabular-nums text-slate-400">30</td>
                    <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {r.workingDays}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {r.transportAllowance ? `ETB ${r.transportAllowance.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {r.mobileCardAllowance ? `ETB ${r.mobileCardAllowance.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {r.houseAllowance ? `ETB ${r.houseAllowance.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {r.overtimePay ? `ETB ${r.overtimePay.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold bg-amber-500/5 text-slate-900 dark:text-slate-100">
                      ETB {r.grossPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      -ETB {r.incomeTaxDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-indigo-700 dark:text-indigo-300">
                      -ETB {r.pensionEmployeeDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-rose-600">
                      {r.penaltiesDeduction ? `-ETB ${r.penaltiesDeduction.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-amber-700">
                      {r.foodCostSharingDeduction ? `-ETB ${r.foodCostSharingDeduction.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300" title="Non-deductible employer contribution">
                      ETB {employer11.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 text-[13px]">
                      ETB {r.netPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenPayslip(r)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="View Official Payslip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onOpenEdit(r)}
                            className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Edit Payroll Entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {records.length > 0 && (
            <tfoot className="bg-[#FCF0DA]/70 dark:bg-[#2C2724]/70 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-[11px]">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-slate-800 dark:text-slate-200">
                  TOTALS ({records.length} Employees)
                </td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">ETB {totals.basic.toLocaleString()}</td>
                <td colSpan={6} className="py-3 px-2 text-center text-slate-400">30-Day Basis Standard</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">ETB {totals.gross.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600">-ETB {totals.tax.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-indigo-700">-ETB {totals.pension7.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600">{totals.penalties ? `-ETB ${totals.penalties.toLocaleString()}` : '-'}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-amber-700">{totals.food ? `-ETB ${totals.food.toLocaleString()}` : '-'}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-indigo-800 dark:text-indigo-300">ETB {totals.pension11.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 text-sm">ETB {totals.net.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
