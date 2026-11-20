import React from 'react';
import { Printer, Info, X } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';
import { calculateAllowanceSplit } from './payrollHelpers';

interface PayslipModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const split = calculateAllowanceSplit(record.transportAllowance, record.mobileCardAllowance, record.houseAllowance);
  const nonTaxable = record.nonTaxableAllowance ?? split.nonTaxableAllowance;
  const taxable = record.taxableAllowance ?? split.taxableAllowance;
  const transportExempt = record.transportExempt ?? split.transportExempt;
  const mobileExempt = record.mobileExempt ?? split.mobileExempt;
  const transportTaxable = record.transportTaxable ?? split.transportTaxable;
  const mobileTaxable = record.mobileTaxable ?? split.mobileTaxable;

  const otherDeductions = record.penaltiesDeduction + record.foodCostSharingDeduction + (record.loanOrUniformDeduction || 0);
  const totalDeductions = record.incomeTaxDeduction + record.pensionEmployeeDeduction + otherDeductions;
  const employerPension = record.pensionEmployer11Percent || Math.round(record.earnedBaseSalary * 0.11);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative border border-slate-200 max-h-[95vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5">
          <div className="text-base font-black tracking-wider text-[#4C4541] uppercase">HAB Business PLC · ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር</div>
          <div className="text-xs font-semibold text-slate-600">Official Monthly Payroll & Earnings Statement (16-Column Specification)</div>
          <div className="text-[11px] font-mono text-slate-500">Period: {record.month} · Working Days: {record.workingDays} / 30 Standard Days</div>
        </div>

        {/* Employee Banner */}
        <div className="grid grid-cols-2 gap-2 bg-[#FCF0DA]/60 p-3 rounded-lg border border-[#EFE7D8] text-xs">
          <div><span className="text-slate-500 block text-[11px]">Employee Name:</span><span className="font-bold text-[#4C4541]">{record.employeeName}</span></div>
          <div><span className="text-slate-500 block text-[11px]">Division & ID:</span><span className="font-bold font-mono text-[#4C4541]">{record.serviceType} ({record.employeeCode})</span></div>
          <div><span className="text-slate-500 block text-[11px]">Payable Working Days:</span><span className="font-bold text-[#4C4541]">{record.workingDays} of 30 Full Working Days</span></div>
          <div><span className="text-slate-500 block text-[11px]">Bank Disbursement:</span><span className="font-mono text-slate-800">{record.bankName} · {record.accountNumber}</span></div>
        </div>

        {/* Earnings & Deductions Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Earnings (Additions) */}
          <div className="space-y-2 border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            <span className="font-bold text-emerald-800 block pb-1 border-b border-slate-200 uppercase text-[10px] tracking-wider">Earnings & Additions (ETB)</span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600"><span>Contracted Basic:</span><span className="font-mono tabular-nums">{record.baseSalary.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-900 font-semibold bg-emerald-50/80 px-1.5 py-0.5 rounded"><span>Earned Basic ({record.workingDays}/30d):</span><span className="font-mono tabular-nums">{record.earnedBaseSalary.toLocaleString()}</span></div>
            </div>

            <div className="pt-1 border-t border-slate-200 space-y-0.5">
              <div className="flex justify-between font-bold text-emerald-900 text-[11px]"><span>Non-Taxable Allowances:</span><span className="font-mono tabular-nums">{nonTaxable.toLocaleString()}</span></div>
              <div className="flex justify-between text-[11px] text-slate-500 pl-2"><span>• Transport Exempt (&le;1.6k):</span><span className="font-mono tabular-nums">{transportExempt.toLocaleString()}</span></div>
              <div className="flex justify-between text-[11px] text-slate-500 pl-2"><span>• Mobile Exempt (&le;2k):</span><span className="font-mono tabular-nums">{mobileExempt.toLocaleString()}</span></div>
            </div>

            <div className="pt-1 border-t border-slate-200 space-y-0.5">
              <div className="flex justify-between font-bold text-amber-900 text-[11px]"><span>Taxable Allowances:</span><span className="font-mono tabular-nums">{taxable.toLocaleString()}</span></div>
              <div className="flex justify-between text-[11px] text-slate-500 pl-2"><span>• Excess Transport/Mobile:</span><span className="font-mono tabular-nums">{(transportTaxable + mobileTaxable).toLocaleString()}</span></div>
              <div className="flex justify-between text-[11px] text-slate-500 pl-2"><span>• Housing Allowance:</span><span className="font-mono tabular-nums">{record.houseAllowance.toLocaleString()}</span></div>
            </div>

            {record.overtimePay > 0 && (
              <div className="flex justify-between text-blue-700 font-semibold pt-1 border-t border-slate-200">
                <span>Overtime ({record.overtimeHours || 0} hrs):</span>
                <span className="font-mono tabular-nums">+{record.overtimePay.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-slate-900">
              <span>Gross Pay:</span>
              <span className="font-mono tabular-nums text-emerald-800">ETB {record.grossPay.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2 border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            <span className="font-bold text-rose-800 block pb-1 border-b border-slate-200 uppercase text-[10px] tracking-wider">Statutory Deductions (ETB)</span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600"><span>Schedule 'A' Income Tax:</span><span className="font-mono tabular-nums text-rose-700">-{record.incomeTaxDeduction.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-600"><span>7% Employee Pension:</span><span className="font-mono tabular-nums text-rose-700">-{record.pensionEmployeeDeduction.toLocaleString()}</span></div>
            </div>

            <div className="pt-1.5 border-t border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block text-[11px]">Other Deductions:</span>
              <div className="flex justify-between text-slate-600 pl-2"><span>• Disciplinary Penalties:</span><span className="font-mono tabular-nums">-{record.penaltiesDeduction.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-600 pl-2"><span>• Food Cost Sharing:</span><span className="font-mono tabular-nums">-{record.foodCostSharingDeduction.toLocaleString()}</span></div>
              {record.loanOrUniformDeduction ? (
                <div className="flex justify-between text-slate-600 pl-2"><span>• Loan / Uniform:</span><span className="font-mono tabular-nums">-{record.loanOrUniformDeduction.toLocaleString()}</span></div>
              ) : null}
            </div>

            <div className="pt-8 border-t border-slate-300 flex justify-between font-bold text-rose-700">
              <span>Total Deductions:</span>
              <span className="font-mono tabular-nums">-ETB {totalDeductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 11% Employer Pension Callout */}
        <div className="bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-900">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="font-semibold">11% Employer Pension Contribution (Company Liability, Non-Deductible):</span>
          </div>
          <span className="font-mono font-bold text-amber-900 tabular-nums">ETB {employerPension.toLocaleString()}</span>
        </div>

        {/* Net Pay Callout */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-emerald-800 text-[11px] font-semibold uppercase tracking-wider block">Net Take-Home Pay</span>
            <span className="text-xs text-slate-600">Disbursed via {record.bankName}</span>
          </div>
          <div className="text-lg font-black font-mono text-emerald-800 tabular-nums">ETB {record.netPay.toLocaleString()}</div>
        </div>

        {/* Print Action */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 no-print">
          <button type="button" onClick={() => window.print()} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
