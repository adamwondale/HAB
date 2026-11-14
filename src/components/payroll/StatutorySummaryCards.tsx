import React from 'react';
import { PayrollRecord } from '../../types/hrm';
import { DollarSign, ShieldAlert, Receipt, Wallet, Percent } from 'lucide-react';

interface StatutorySummaryCardsProps {
  records: PayrollRecord[];
}

export const StatutorySummaryCards: React.FC<StatutorySummaryCardsProps> = ({ records }) => {
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
      <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/80 p-3.5 rounded-xl border border-[#EFE7D8] dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-[#4C4541]/70 dark:text-slate-400 font-bold mb-1">
          <span>Gross Pay (Taxable)</span>
          <DollarSign className="w-4 h-4 text-[#F2C46A]" />
        </div>
        <div className="text-base sm:text-lg font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100">
          ETB {totalGross.toLocaleString()}
        </div>
        <span className="text-[10px] text-[#4C4541]/60 dark:text-slate-400 block mt-0.5">
          {records.length} active employee payrolls
        </span>
      </div>

      {/* Income Tax Withheld */}
      <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/60">
        <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold mb-1">
          <span>Income Tax (Gov't)</span>
          <Receipt className="w-4 h-4 text-rose-600 shrink-0" />
        </div>
        <div className="text-base sm:text-lg font-black font-mono tabular-nums text-rose-800 dark:text-rose-200">
          ETB {totalIncomeTax.toLocaleString()}
        </div>
        <span className="text-[10px] text-rose-600/80 dark:text-rose-400 block mt-0.5">
          Progressive Ethiopian tax schedule
        </span>
      </div>

      {/* Pension 7% / 11% Pool */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60">
        <div className="flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-300 font-bold mb-1">
          <span>Pension (7% / 11%)</span>
          <Percent className="w-4 h-4 text-indigo-600 shrink-0" />
        </div>
        <div className="text-base sm:text-lg font-black font-mono tabular-nums text-indigo-800 dark:text-indigo-200">
          ETB {totalPensionPool.toLocaleString()}
        </div>
        <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400 block mt-0.5">
          Emp: {totalEmployeePension.toLocaleString()} | Co: {totalEmployerPension.toLocaleString()}
        </span>
      </div>

      {/* Statutory Withholding & VAT Control */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60">
        <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-bold mb-1">
          <span>VAT & WHT Control</span>
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        </div>
        <div className="text-base sm:text-lg font-black font-mono tabular-nums text-amber-900 dark:text-amber-200">
          ETB {(estimatedWithholding + estimatedVatPool).toLocaleString()}
        </div>
        <span className="text-[10px] text-amber-700/80 dark:text-amber-400 block mt-0.5">
          2% WHT: {estimatedWithholding.toLocaleString()} | 15% VAT: {estimatedVatPool.toLocaleString()}
        </span>
      </div>

      {/* Total Net Take-Home */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold mb-1">
          <span>Net Take-Home Pay</span>
          <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
        <div className="text-base sm:text-lg font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-200">
          ETB {totalNet.toLocaleString()}
        </div>
        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 block mt-0.5">
          Disbursed through CBE / Awash bank
        </span>
      </div>
    </div>
  );
};
