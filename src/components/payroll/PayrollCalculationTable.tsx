import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Edit3, Info } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';
import { getDivisionBadgeStyle, calculateAllowanceSplit } from './payrollHelpers';
import { AllowanceBreakdownPopover } from './AllowanceBreakdownPopover';

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
  const { t } = useTranslation();
  const totals = records.reduce(
    (acc, r) => {
      const split = calculateAllowanceSplit(r.transportAllowance, r.mobileCardAllowance, r.houseAllowance);
      const nonTax = r.nonTaxableAllowance ?? split.nonTaxableAllowance;
      const taxAllow = r.taxableAllowance ?? split.taxableAllowance;
      const otherDed = (r.penaltiesDeduction || 0) + (r.foodCostSharingDeduction || 0) + (r.loanOrUniformDeduction || 0);
      const employer11 = r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11);
      return {
        basic: acc.basic + r.baseSalary,
        nonTaxable: acc.nonTaxable + nonTax,
        taxable: acc.taxable + taxAllow,
        gross: acc.gross + r.grossPay,
        tax: acc.tax + r.incomeTaxDeduction,
        pension7: acc.pension7 + r.pensionEmployeeDeduction,
        otherDeductions: acc.otherDeductions + otherDed,
        pension11: acc.pension11 + employer11,
        net: acc.net + r.netPay
      };
    },
    { basic: 0, nonTaxable: 0, taxable: 0, gross: 0, tax: 0, pension7: 0, otherDeductions: 0, pension11: 0, net: 0 }
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left text-xs min-w-[1580px] divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 sticky top-0 z-20 font-bold uppercase tracking-wider text-[10.5px]">
            <tr>
              <th rowSpan={2} className="py-3 px-2.5 sticky left-0 bg-[#FCF0DA] dark:bg-[#2C2724] z-20 shadow-xs border-r border-amber-200/50 dark:border-slate-700">ID</th>
              <th rowSpan={2} className="py-3 px-3 sticky left-14 bg-[#FCF0DA] dark:bg-[#2C2724] z-20 shadow-xs border-r border-amber-200/50 dark:border-slate-700">{t('payroll.employee')}</th>
              <th rowSpan={2} className="py-3 px-2.5">{t('recruitment.division')}</th>
              <th rowSpan={2} className="py-3 px-2.5 text-right">{t('payroll.basicSalary')}</th>
              <th rowSpan={2} className="py-3 px-2 text-center" title="Standard 30-day Ethiopian month basis">{t('payroll.standardDays') || 'Days (30)'}</th>
              <th rowSpan={2} className="py-3 px-2 text-center">{t('payroll.payableDays') || 'Payable Days'}</th>
              <th colSpan={2} className="py-1.5 px-2 text-center bg-[#F7E7C4] dark:bg-[#38312B] border-b border-amber-300 dark:border-slate-700 text-[#4C4541] dark:text-[#F2C46A]">
                {t('payroll.allowance') || 'Allowance'}
              </th>
              <th rowSpan={2} className="py-3 px-3 text-right font-black bg-amber-500/10 text-slate-900 dark:text-slate-100">{t('payroll.grossEarnings') || 'Gross'}</th>
              <th colSpan={3} className="py-1.5 px-2 text-center bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-slate-700 text-rose-900 dark:text-rose-300">
                {t('payroll.deductions') || 'Deductions'}
              </th>
              <th rowSpan={2} className="py-3 px-3 text-right font-black bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">{t('payroll.netSalary') || 'Net Salary'}</th>
              <th rowSpan={2} className="py-3 px-3 text-right bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black" title="Non-deductible employer contribution">
                {t('payroll.pensionEmployer') || 'Employer Pen(11%)'}
              </th>
              <th rowSpan={2} className="py-3 px-2.5 text-center">{t('common.actions') || 'Actions'}</th>
            </tr>
            <tr>
              <th className="py-1.5 px-2 text-right bg-[#FCF0DA] dark:bg-[#2C2724] text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border-b border-amber-200/50">Non-taxable</th>
              <th className="py-1.5 px-2 text-right bg-[#FCF0DA] dark:bg-[#2C2724] text-amber-900 dark:text-amber-200 font-semibold text-[10px] border-b border-amber-200/50">Taxable</th>
              <th className="py-1.5 px-2 text-right bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-semibold text-[10px] border-b border-rose-200/50">Income Tax</th>
              <th className="py-1.5 px-2 text-right bg-rose-50/70 dark:bg-rose-950/30 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] border-b border-rose-200/50">Pension (7%)</th>
              <th className="py-1.5 px-2 text-right bg-rose-50/70 dark:bg-rose-950/30 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border-b border-rose-200/50">Other/Pen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-12 text-center text-slate-400 italic">
                  No payroll records match the active division or filter.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const split = calculateAllowanceSplit(r.transportAllowance, r.mobileCardAllowance, r.houseAllowance);
                const nonTax = r.nonTaxableAllowance ?? split.nonTaxableAllowance;
                const taxAllow = r.taxableAllowance ?? split.taxableAllowance;
                const otherDed = (r.penaltiesDeduction || 0) + (r.foodCostSharingDeduction || 0) + (r.loanOrUniformDeduction || 0);
                const employer11 = r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11);
                return (
                  <tr key={r.id} className="hover:bg-amber-50/20 dark:hover:bg-slate-800/40 transition-colors odd:bg-white even:bg-slate-50/30 dark:odd:bg-slate-900 dark:even:bg-slate-800/20">
                    <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-500 sticky left-0 bg-inherit shadow-xs font-semibold border-r border-slate-100 dark:border-slate-800">
                      {r.employeeCode}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 sticky left-14 bg-inherit shadow-xs border-r border-slate-100 dark:border-slate-800">
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
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-800 dark:text-emerald-300">
                      <AllowanceBreakdownPopover record={r}>
                        <span className="hover:underline cursor-pointer font-medium inline-flex items-center gap-1 group/allow">
                          <span>{nonTax ? `ETB ${nonTax.toLocaleString()}` : '-'}</span>
                          <Info className="w-3 h-3 text-emerald-600/70 group-hover/allow:text-emerald-800" />
                        </span>
                      </AllowanceBreakdownPopover>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-amber-900 dark:text-amber-200">
                      <AllowanceBreakdownPopover record={r}>
                        <span className="hover:underline cursor-pointer font-medium inline-flex items-center gap-1 group/allow">
                          <span>{taxAllow ? `ETB ${taxAllow.toLocaleString()}` : '-'}</span>
                          <Info className="w-3 h-3 text-amber-600/70 group-hover/allow:text-amber-800" />
                        </span>
                      </AllowanceBreakdownPopover>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold bg-amber-500/5 text-slate-900 dark:text-slate-100">
                      ETB {r.grossPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      -ETB {r.incomeTaxDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-indigo-700 dark:text-indigo-300">
                      -ETB {r.pensionEmployeeDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {otherDed ? `-ETB ${otherDed.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 text-[13px]">
                      ETB {r.netPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300" title="Non-deductible employer contribution">
                      ETB {employer11.toLocaleString()}
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
            <tfoot className="bg-[#FCF0DA]/80 dark:bg-[#2C2724]/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-[11px]">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-slate-800 dark:text-slate-200">
                  TOTALS ({records.length} Employees)
                </td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">ETB {totals.basic.toLocaleString()}</td>
                <td className="py-3 px-2 text-center text-slate-400 font-mono">30</td>
                <td className="py-3 px-2 text-center text-slate-400">-</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-emerald-800 dark:text-emerald-300">ETB {totals.nonTaxable.toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-amber-900 dark:text-amber-200">ETB {totals.taxable.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">ETB {totals.gross.toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-rose-600">-ETB {totals.tax.toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-indigo-700">-ETB {totals.pension7.toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600">{totals.otherDeductions ? `-ETB ${totals.otherDeductions.toLocaleString()}` : '-'}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 text-sm">ETB {totals.net.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-indigo-800 dark:text-indigo-300">ETB {totals.pension11.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
