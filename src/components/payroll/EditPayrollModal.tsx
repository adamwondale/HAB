import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { PayrollRecord } from '../../types/hrm';
import { calculatePayrollRecordWithMaster } from '../../utils/masterConfigEngine';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../../utils/masterConfigEngine';

interface EditPayrollModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
  onSave: (record: PayrollRecord) => void;
}

export const EditPayrollModal: React.FC<EditPayrollModalProps> = ({ record, onClose, onSave }) => {
  if (!record) return null;

  const [formRecord, setFormRecord] = useState<PayrollRecord>({ ...record });

  const handleRecalculate = (target: PayrollRecord): PayrollRecord => {
    return calculatePayrollRecordWithMaster(
      target,
      DEFAULT_SYSTEM_MASTER_CONFIG,
      false
    );
  };

  const handleFieldChange = (field: keyof PayrollRecord, value: number) => {
    const updated = { ...formRecord, [field]: value };
    setFormRecord(handleRecalculate(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Edit Payroll Entry — {formRecord.employeeName}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {formRecord.employeeCode} · {formRecord.serviceType} · 30 Days Standard Month
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Working Days (of 30)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={formRecord.workingDays}
                onChange={(e) => handleFieldChange('workingDays', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Base Salary (30d)
              </label>
              <input
                type="number"
                min={0}
                value={formRecord.baseSalary}
                onChange={(e) => handleFieldChange('baseSalary', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
              />
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1 tabular-nums">
                Earned: ETB {formRecord.earnedBaseSalary.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Transport</label>
              <input
                type="number"
                min={0}
                value={formRecord.transportAllowance}
                onChange={(e) => handleFieldChange('transportAllowance', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Mobile Card</label>
              <input
                type="number"
                min={0}
                value={formRecord.mobileCardAllowance}
                onChange={(e) => handleFieldChange('mobileCardAllowance', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">House Allowance</label>
              <input
                type="number"
                min={0}
                value={formRecord.houseAllowance}
                onChange={(e) => handleFieldChange('houseAllowance', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Overtime Pay</label>
              <input
                type="number"
                min={0}
                value={formRecord.overtimePay}
                onChange={(e) => handleFieldChange('overtimePay', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-blue-700"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Penalties</label>
              <input
                type="number"
                min={0}
                value={formRecord.penaltiesDeduction}
                onChange={(e) => handleFieldChange('penaltiesDeduction', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-rose-700"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Food Sharing</label>
              <input
                type="number"
                min={0}
                value={formRecord.foodCostSharingDeduction}
                onChange={(e) => handleFieldChange('foodCostSharingDeduction', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-rose-700"
              />
            </div>
          </div>

          <div className="bg-[#FCF0DA]/60 dark:bg-slate-800 p-3 rounded-lg border border-[#EFE7D8] flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Gross:</span>
              <span className="font-bold tabular-nums">ETB {formRecord.grossPay.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-rose-600 block">Tax:</span>
              <span className="font-bold tabular-nums">-ETB {formRecord.incomeTaxDeduction.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-indigo-600 block">Pension 7%:</span>
              <span className="font-bold tabular-nums">-ETB {formRecord.pensionEmployeeDeduction.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 block font-bold">Net Pay:</span>
              <span className="font-black text-sm text-emerald-800 dark:text-emerald-300 tabular-nums">
                ETB {formRecord.netPay.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
