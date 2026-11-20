import React from 'react';
import { useTranslation } from 'react-i18next';
import { PayrollRecord } from '../../types/hrm';

interface StatutorySummaryCardsProps {
  records: PayrollRecord[];
}

export const StatutorySummaryCards: React.FC<StatutorySummaryCardsProps> = ({ records }) => {
  const { t } = useTranslation();
  const totalGross = records.reduce((sum, r) => sum + r.grossPay, 0);
  const totalNet = records.reduce((sum, r) => sum + r.netPay, 0);
  const totalIncomeTax = records.reduce((sum, r) => sum + r.incomeTaxDeduction, 0);
  const totalEmployeePension = records.reduce((sum, r) => sum + r.pensionEmployeeDeduction, 0);
  const totalEmployerPension = records.reduce(
    (sum, r) => sum + (r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11)),
    0
  );
  const totalPensionPool = totalEmployeePension + totalEmployerPension;
  const estimatedWithholding = Math.round(totalGross * 0.02); // 2% statutory business withholding
  const estimatedVatPool = Math.round(totalGross * 0.15); // 15% standard VAT pool

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Gross Pay Total */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          {t('payroll.grossPayTaxable')}
        </span>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          ETB {totalGross.toLocaleString()}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
          {t('payroll.activeStaffNote', { count: records.length })}
        </span>
      </div>

      {/* Income Tax Withheld */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          {t('payroll.incomeTaxGovt')}
        </span>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          ETB {totalIncomeTax.toLocaleString()}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
          {t('payroll.taxScheduleNote')}
        </span>
      </div>

      {/* Pension 7% / 11% Pool */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          {t('payroll.pensionPool')}
        </span>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          ETB {totalPensionPool.toLocaleString()}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
          {t('payroll.pensionBreakdown', { emp: totalEmployeePension.toLocaleString(), comp: totalEmployerPension.toLocaleString() })}
        </span>
      </div>

      {/* Statutory Withholding & VAT Control */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          {t('payroll.vatWhtControl')}
        </span>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          ETB {(estimatedWithholding + estimatedVatPool).toLocaleString()}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
          {t('payroll.statutoryWhtVatNote')}
        </span>
      </div>

      {/* Total Net Take-Home */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs col-span-2 lg:col-span-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          {t('payroll.netTakeHomePay')}
        </span>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
          ETB {totalNet.toLocaleString()}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
          {t('payroll.bankDisburseNote')}
        </span>
      </div>
    </div>
  );
};
