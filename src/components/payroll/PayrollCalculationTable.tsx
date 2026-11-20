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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left text-xs min-w-[1580px] border-collapse">
          {/* Eye-friendly, calm neutral table headers */}
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 z-20 font-semibold text-xs border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th rowSpan={2} className="py-2.5 px-3 sticky left-0 bg-slate-100 dark:bg-slate-800 z-20 border-r border-slate-200 dark:border-slate-700">
                {t('payroll.employeeCode') || 'ID'}
              </th>
              <th rowSpan={2} className="py-2.5 px-3 sticky left-16 bg-slate-100 dark:bg-slate-800 z-20 border-r border-slate-200 dark:border-slate-700">
                {t('payroll.employee')}
              </th>
              <th rowSpan={2} className="py-2.5 px-3">{t('recruitment.division')}</th>
              <th rowSpan={2} className="py-2.5 px-3 text-right">{t('payroll.basicSalary')}</th>
              <th rowSpan={2} className="py-2.5 px-2.5 text-center" title="Standard 30-day basis">{t('payroll.standardDays')}</th>
              <th rowSpan={2} className="py-2.5 px-2.5 text-center">{t('payroll.payableDays')}</th>
              <th colSpan={2} className="py-1.5 px-2 text-center bg-slate-200/50 dark:bg-slate-700/40 border-b border-slate-200 dark:border-slate-700 font-semibold">
                {t('payroll.allowance')}
              </th>
              <th rowSpan={2} className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">{t('payroll.grossEarnings')}</th>
              <th colSpan={3} className="py-1.5 px-2 text-center bg-slate-200/50 dark:bg-slate-700/40 border-b border-slate-200 dark:border-slate-700 font-semibold">
                {t('payroll.deductions')}
              </th>
              <th rowSpan={2} className="py-2.5 px-3 text-right font-bold text-slate-950 dark:text-white">{t('payroll.netSalary')}</th>
              <th rowSpan={2} className="py-2.5 px-3 text-right" title="Non-deductible employer contribution">
                {t('payroll.pensionEmployer')}
              </th>
              <th rowSpan={2} className="py-2.5 px-3 text-center">{t('common.actions')}</th>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[11px] font-medium border-b border-slate-200 dark:border-slate-700">
              <th className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-900">{t('payroll.nonTaxableAllowance')}</th>
              <th className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-900">{t('payroll.taxableAllowance')}</th>
              <th className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-900">{t('payroll.incomeTax')}</th>
              <th className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-900">{t('payroll.pensionEmployee')}</th>
              <th className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-900">{t('payroll.otherDeductions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-12 text-center text-slate-400 italic">
                  {t('payroll.noRecordsFound')}
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
                  <tr key={r.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors even:bg-slate-50/40 dark:even:bg-slate-800/20 group">
                    <td className="py-2.5 px-3 font-mono text-xs text-slate-500 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 font-medium">
                      {r.employeeCode}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 sticky left-16 bg-white dark:bg-slate-900 group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800">
                      {r.employeeName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getDivisionBadgeStyle(r.serviceType)}`}>
                        {r.serviceType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      ETB {r.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono tabular-nums text-slate-400">30</td>
                    <td className="py-2.5 px-2.5 text-center font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {r.workingDays}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      <AllowanceBreakdownPopover record={r}>
                        <span className="hover:underline cursor-pointer inline-flex items-center gap-1">
                          <span>{nonTax ? `ETB ${nonTax.toLocaleString()}` : '-'}</span>
                          <Info className="w-3 h-3 text-slate-400" />
                        </span>
                      </AllowanceBreakdownPopover>
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      <AllowanceBreakdownPopover record={r}>
                        <span className="hover:underline cursor-pointer inline-flex items-center gap-1">
                          <span>{taxAllow ? `ETB ${taxAllow.toLocaleString()}` : '-'}</span>
                          <Info className="w-3 h-3 text-slate-400" />
                        </span>
                      </AllowanceBreakdownPopover>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      ETB {r.grossPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      -ETB {r.incomeTaxDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      -ETB {r.pensionEmployeeDeduction.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {otherDed ? `-ETB ${otherDed.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-950 dark:text-white">
                      ETB {r.netPay.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      ETB {employer11.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenPayslip(r)}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                          title={t('payroll.viewPayslip')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onOpenEdit(r)}
                            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                            title={t('payroll.editRecord')}
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
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-semibold border-t-2 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
              <tr>
                <td colSpan={3} className="py-3 px-3">
                  {t('payroll.totalsLabel', { count: records.length })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">ETB {totals.basic.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-center text-slate-400 font-mono">30</td>
                <td className="py-3 px-2.5 text-center text-slate-400 font-mono">-</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">ETB {totals.nonTaxable.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">ETB {totals.taxable.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-bold">ETB {totals.gross.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">-ETB {totals.tax.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">-ETB {totals.pension7.toLocaleString()}</td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums">{totals.otherDeductions ? `-ETB ${totals.otherDeductions.toLocaleString()}` : '-'}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-sm">ETB {totals.net.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">ETB {totals.pension11.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
