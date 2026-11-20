import React, { useState, useRef } from 'react';
import { Coins, X, ShieldCheck } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';
import { calculateAllowanceSplit } from './payrollHelpers';

interface AllowanceBreakdownPopoverProps {
  record: PayrollRecord;
  children: React.ReactNode;
}

export const AllowanceBreakdownPopover: React.FC<AllowanceBreakdownPopoverProps> = ({ record, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const transport = record.transportAllowance || 0;
  const mobile = record.mobileCardAllowance || 0;
  const housing = record.houseAllowance || 0;
  const overtime = record.overtimePay || 0;

  const split = calculateAllowanceSplit(transport, mobile, housing);
  const nonTaxable = record.nonTaxableAllowance ?? split.nonTaxableAllowance;
  const taxable = record.taxableAllowance ?? split.taxableAllowance;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: Math.min(window.innerHeight - 360, Math.max(10, rect.bottom + 6)),
        left: Math.max(10, Math.min(window.innerWidth - 330, rect.right - 280))
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center text-inherit bg-transparent border-0 p-0 cursor-pointer focus:outline-hidden"
        title="View Allowance & Statutory Audit"
      >
        {children}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-2xs" onClick={() => setIsOpen(false)} />
          <div
            style={{ top: coords?.top, left: coords?.left }}
            className="fixed z-50 w-80 bg-white dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 rounded-xl shadow-xl border border-amber-200/80 dark:border-slate-700 p-3.5 space-y-3 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-200/50 dark:border-slate-700 pb-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Coins className="w-4 h-4 text-[#F2C46A]" />
                <span className="text-[#4C4541] dark:text-[#F2C46A]">Allowance Audit Breakdown</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 -mt-1">
              {record.employeeName} · <span className="font-mono">{record.employeeCode}</span>
            </div>

            {/* Itemized List */}
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Transport Allowance</span>
                  <span className="font-mono">ETB {transport.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-[#AEAC78] dark:text-[#AEAC78] font-medium">Exempt (≤ 1,600)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">ETB {split.transportExempt.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Taxable Excess</span>
                  <span className="font-mono text-amber-800 dark:text-amber-300">ETB {split.transportTaxable.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Mobile Card Allowance</span>
                  <span className="font-mono">ETB {mobile.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-[#AEAC78] dark:text-[#AEAC78] font-medium">Exempt (≤ 2,000)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">ETB {split.mobileExempt.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Taxable Excess</span>
                  <span className="font-mono text-amber-800 dark:text-amber-300">ETB {split.mobileTaxable.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center px-2 py-1 text-[11px] rounded bg-slate-50 dark:bg-slate-800/30">
                <span className="font-medium">Housing (100% Taxable)</span>
                <span className="font-mono font-semibold">ETB {housing.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center px-2 py-1 text-[11px] rounded bg-slate-50 dark:bg-slate-800/30">
                <span className="font-medium">Overtime ({record.overtimeHours || 0} hrs, Taxable)</span>
                <span className="font-mono font-semibold">ETB {overtime.toLocaleString()}</span>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="p-2 rounded-lg bg-[#FCF0DA] dark:bg-[#38312B] text-[#4C4541] dark:text-slate-100 border border-[#F2C46A]/40 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span>Non-Taxable Portion:</span>
                <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold">ETB {nonTaxable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold">
                <span>Taxable Allowance Portion:</span>
                <span className="font-mono text-amber-900 dark:text-amber-200 font-bold">ETB {taxable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
