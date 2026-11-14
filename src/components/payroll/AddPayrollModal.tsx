import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Employee, PayrollRecord } from '../../types/hrm';
import { calculatePayrollRecordWithMaster } from '../../utils/masterConfigEngine';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../../utils/masterConfigEngine';

interface AddPayrollModalProps {
  isOpen: boolean;
  employees: Employee[];
  onClose: () => void;
  onAdd: (record: PayrollRecord) => void;
}

export const AddPayrollModal: React.FC<AddPayrollModalProps> = ({
  isOpen,
  employees,
  onClose,
  onAdd
}) => {
  if (!isOpen) return null;

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [workingDays, setWorkingDays] = useState<number>(30);
  const [baseSalary, setBaseSalary] = useState<number>(employees[0]?.salary.baseSalary || 8500);
  const [transport, setTransport] = useState<number>(1000);
  const [mobileCard, setMobileCard] = useState<number>(500);
  const [house, setHouse] = useState<number>(1200);
  const [overtimePay, setOvertimePay] = useState<number>(0);
  const [penalties, setPenalties] = useState<number>(0);
  const [foodCostSharing, setFoodCostSharing] = useState<number>(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === selectedEmpId) || employees[0];
    if (!emp) return;

    const baseRecord: PayrollRecord = {
      id: `pr-${Date.now()}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      employeeCode: emp.employeeCode,
      serviceType: emp.serviceType,
      siteName: emp.currentSiteName || 'Head Office',
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      workingDays,
      fullWorkingDays: 30,
      baseSalary,
      earnedBaseSalary: Math.round((baseSalary / 30) * workingDays),
      transportAllowance: transport,
      mobileCardAllowance: mobileCard,
      houseAllowance: house,
      overtimeHours: 0,
      overtimePay,
      grossPay: 0,
      pensionEmployer11Percent: 0,
      incomeTaxDeduction: 0,
      pensionEmployeeDeduction: 0,
      penaltiesDeduction: penalties,
      foodCostSharingDeduction: foodCostSharing,
      netPay: 0,
      paymentStatus: 'Draft',
      bankName: emp.bankAccount?.bankName || 'Commercial Bank of Ethiopia',
      accountNumber: emp.bankAccount?.accountNumber || '1000123456789'
    };

    const finalRecord = calculatePayrollRecordWithMaster(
      baseRecord,
      DEFAULT_SYSTEM_MASTER_CONFIG,
      false
    );

    onAdd(finalRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#F2C46A]" />
              <span>Add Employee to Payroll Sheet</span>
            </h3>
            <p className="text-xs text-slate-500">
              Uses 30 Working Days as full working month standard
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Select Employee
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  const found = employees.find((x) => x.id === e.target.value);
                  if (found) setBaseSalary(found.salary.baseSalary);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode} - {emp.serviceType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Working Days (of 30)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Base Salary (30d)</label>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Transport</label>
              <input
                type="number"
                value={transport}
                onChange={(e) => setTransport(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Mobile Card</label>
              <input
                type="number"
                value={mobileCard}
                onChange={(e) => setMobileCard(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">House Allowance</label>
              <input
                type="number"
                value={house}
                onChange={(e) => setHouse(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Overtime Pay</label>
              <input
                type="number"
                value={overtimePay}
                onChange={(e) => setOvertimePay(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Food Cost Sharing</label>
              <input
                type="number"
                value={foodCostSharing}
                onChange={(e) => setFoodCostSharing(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold shadow-xs cursor-pointer"
            >
              Add to Payroll Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
