import React from 'react';
import { Printer, Info, X } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';

interface PayslipModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const totalDeductions =
    record.incomeTaxDeduction +
    record.pensionEmployeeDeduction +
    record.penaltiesDeduction +
    record.foodCostSharingDeduction;

  const employerPension =
    record.pensionEmployer11Percent || Math.round(record.earnedBaseSalary * 0.11);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full p-7 space-y-4 shadow-2xl relative border border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5">
          <div className="text-base font-black tracking-wider text-slate-900 uppercase">
            HAB Business PLC · ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር
          </div>
          <div className="text-xs font-semibold text-slate-600">
            Official Monthly Payroll & Earnings Statement
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Period: {record.month} · Working Days: {record.workingDays} / 30 Days
          </div>
        </div>

        {/* Employee Banner */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Employee:</span>
            <span className="font-bold text-slate-900">{record.employeeName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Division & ID:</span>
            <span className="font-bold font-mono text-slate-900">
              {record.serviceType} ({record.employeeCode})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Working Days:</span>
            <span className="font-bold text-slate-900">{record.workingDays} of 30 Full Working Days</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Bank Account:</span>
            <span className="font-mono text-slate-800">{record.bankName} · {record.accountNumber}</span>
          </div>
        </div>

        {/* Additions & Deductions Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5 border border-slate-200 p-3 rounded-lg">
            <span className="font-bold text-emerald-800 block pb-1 border-b border-slate-200 uppercase text-[10px]">
              Additions (ETB)
            </span>
            <div className="flex justify-between text-slate-600">
              <span>Basic Salary ({record.workingDays}/30d):</span>
              <span className="font-mono font-semibold tabular-nums">{record.earnedBaseSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Transport:</span>
              <span className="font-mono tabular-nums">{record.transportAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mobile Card:</span>
              <span className="font-mono tabular-nums">{record.mobileCardAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Housing:</span>
              <span className="font-mono tabular-nums">{record.houseAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Overtime:</span>
              <span className="font-mono text-blue-700 tabular-nums">+{record.overtimePay.toLocaleString()}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Gross Pay:</span>
              <span className="font-mono tabular-nums">ETB {record.grossPay.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-1.5 border border-slate-200 p-3 rounded-lg">
            <span className="font-bold text-rose-800 block pb-1 border-b border-slate-200 uppercase text-[10px]">
              Deductions (ETB)
            </span>
            <div className="flex justify-between text-slate-600">
              <span>Income Tax:</span>
              <span className="font-mono tabular-nums">-{record.incomeTaxDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>7% Employee Pension:</span>
              <span className="font-mono tabular-nums">-{record.pensionEmployeeDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Penalties:</span>
              <span className="font-mono tabular-nums">-{record.penaltiesDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Food Cost Sharing:</span>
              <span className="font-mono tabular-nums">-{record.foodCostSharingDeduction.toLocaleString()}</span>
            </div>
            <div className="pt-5 border-t border-slate-200 flex justify-between font-bold text-rose-700">
              <span>Total Deductions:</span>
              <span className="font-mono tabular-nums">-ETB {totalDeductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 11% Employer Pension Callout */}
        <div className="bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-indigo-900">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-semibold">11% Employer Pension Contribution (Non-Deductible):</span>
          </div>
          <span className="font-mono font-bold text-indigo-800 tabular-nums">
            ETB {employerPension.toLocaleString()}
          </span>
        </div>

        {/* Net Pay Callout */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-emerald-800 text-[11px] font-semibold uppercase tracking-wider block">
              Net Take-Home Pay
            </span>
            <span className="text-xs text-slate-600">Disbursed via {record.bankName}</span>
          </div>
          <div className="text-lg font-black font-mono text-emerald-800 tabular-nums">
            ETB {record.netPay.toLocaleString()}
          </div>
        </div>

        {/* Print Action */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
