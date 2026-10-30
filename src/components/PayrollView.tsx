import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Printer, 
  CheckCircle2, 
  Eye,
  Edit3,
  Plus,
  Calculator,
  Info,
  Lock,
  Sliders
} from 'lucide-react';
import { PayrollRecord, ServiceType, Employee, ManagementPerson } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import {
  DEFAULT_SYSTEM_MASTER_CONFIG,
  calculateIncomeTaxFromMaster,
  calculatePayrollRecordWithMaster
} from '../utils/masterConfigEngine';
import { exportPayrollToCsv, downloadCsv } from '../utils/csvExport';

interface PayrollViewProps {
  payrollRecords: PayrollRecord[];
  employees?: Employee[];
  activeUser?: ManagementPerson;
  masterConfig?: SystemMasterConfig;
  onOpenMasterSetup?: () => void;
  onApproveBatch: () => void;
  onDisburseBatch: () => void;
  onUpdatePayrollRecord?: (updated: PayrollRecord) => void;
  onAddPayrollRecord?: (newRecord: PayrollRecord) => void;
}

export const getDivisionBadgeStyle = (division: ServiceType): string => {
  switch (division) {
    case 'Security':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'Cleaning':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'Property Management':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'Head Office Staff':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// Ethiopian progressive income tax helper based on taxable earnings
function calculateEthiopianIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 600) return 0;
  if (taxableIncome <= 1650) return Math.round(taxableIncome * 0.10 - 60);
  if (taxableIncome <= 3200) return Math.round(taxableIncome * 0.15 - 142.5);
  if (taxableIncome <= 5250) return Math.round(taxableIncome * 0.20 - 302.5);
  if (taxableIncome <= 7800) return Math.round(taxableIncome * 0.25 - 565);
  if (taxableIncome <= 10900) return Math.round(taxableIncome * 0.30 - 955);
  return Math.round(taxableIncome * 0.35 - 1500);
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrollRecords,
  employees = [],
  activeUser,
  masterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  onOpenMasterSetup,
  onApproveBatch,
  onDisburseBatch,
  onUpdatePayrollRecord,
  onAddPayrollRecord
}) => {
  const canApprovePayroll = activeUser ? activeUser.permissions.canApprovePayroll : true;
  const stdWorkingDays = masterConfig.pensionAndPayroll.standardWorkingDays;
  const employerPensionPct = masterConfig.pensionAndPayroll.employerPensionPercent;
  const employeePensionPct = masterConfig.pensionAndPayroll.employeePensionPercent;

  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [filterService, setFilterService] = useState<'All' | ServiceType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states for adding a new payroll entry (seeded from System Master Setup)
  const [newEmpId, setNewEmpId] = useState<string>(employees[0]?.id || '');
  const [newWorkingDays, setNewWorkingDays] = useState<number>(stdWorkingDays);
  const [newBaseSalary, setNewBaseSalary] = useState<number>(employees[0]?.salary.baseSalary || 8500);
  const [newTransport, setNewTransport] = useState<number>(masterConfig.pensionAndPayroll.defaultTransportAllowance);
  const [newMobileCard, setNewMobileCard] = useState<number>(masterConfig.pensionAndPayroll.defaultMobileAllowance);
  const [newHouse, setNewHouse] = useState<number>(masterConfig.pensionAndPayroll.defaultHousingAllowance);
  const [newOvertimePay, setNewOvertimePay] = useState<number>(0);
  const [newPenalties, setNewPenalties] = useState<number>(0);
  const [newFoodCostSharing, setNewFoodCostSharing] = useState<number>(masterConfig.pensionAndPayroll.defaultFoodCostSharing);

  const filteredRecords = payrollRecords.filter(r => {
    if (filterService !== 'All' && r.serviceType !== filterService) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeCode.toLowerCase().includes(q) ||
        r.siteName.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGross = filteredRecords.reduce((acc, r) => acc + r.grossPay, 0);
  const totalNet = filteredRecords.reduce((acc, r) => acc + r.netPay, 0);
  const totalEmployerPension11 = filteredRecords.reduce(
    (acc, r) => acc + (r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * (employerPensionPct / 100))),
    0
  );
  const totalEmployeeDeductions = filteredRecords.reduce(
    (acc, r) => acc + r.incomeTaxDeduction + r.pensionEmployeeDeduction + r.penaltiesDeduction + r.foodCostSharingDeduction,
    0
  );

  const handleOpenPayslip = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setIsPayslipModalOpen(true);
  };

  const handleOpenEdit = (record: PayrollRecord) => {
    setEditingRecord({ ...record });
  };

  const handleRecalculateEditing = (updated: PayrollRecord, recalculateTax: boolean = true): PayrollRecord => {
    return calculatePayrollRecordWithMaster(updated, masterConfig, recalculateTax);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !onUpdatePayrollRecord) return;
    const finalRecord = handleRecalculateEditing(editingRecord, false);
    onUpdatePayrollRecord(finalRecord);
    setEditingRecord(null);
  };

  const handleCreatePayrollEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddPayrollRecord) return;
    const emp = employees.find(x => x.id === newEmpId);
    const days = Math.max(0, Math.min(stdWorkingDays, newWorkingDays));
    const earnedBase = Math.round((newBaseSalary / stdWorkingDays) * days);
    const gross = earnedBase + newTransport + newMobileCard + newHouse + newOvertimePay;
    const pension11 = Math.round(earnedBase * (employerPensionPct / 100));
    const pension7 = Math.round(earnedBase * (employeePensionPct / 100));
    const taxableTransport = Math.max(
      0,
      newTransport - masterConfig.pensionAndPayroll.taxExemptTransportLimit
    );
    const tax = calculateIncomeTaxFromMaster(
      earnedBase + newHouse + newMobileCard + newOvertimePay + taxableTransport,
      masterConfig
    );
    const totalDed = tax + pension7 + newPenalties + newFoodCostSharing;
    const net = Math.max(0, gross - totalDed);

    const record: PayrollRecord = {
      id: `pay-${Date.now()}`,
      month: 'Meskerem 2019 / October 2026',
      employeeId: emp?.id || `emp-${Date.now()}`,
      employeeCode: emp?.employeeCode || 'HAB-STF-0999',
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'New Staff Member',
      serviceType: emp?.serviceType || 'Security',
      siteName: emp?.currentSiteName || 'HAB Head Office (Bole)',
      workingDays: days,
      fullWorkingDays: stdWorkingDays,
      baseSalary: newBaseSalary,
      earnedBaseSalary: earnedBase,
      transportAllowance: newTransport,
      mobileCardAllowance: newMobileCard,
      houseAllowance: newHouse,
      overtimeHours: 0,
      overtimePay: newOvertimePay,
      grossPay: gross,
      pensionEmployer11Percent: pension11,
      incomeTaxDeduction: tax,
      pensionEmployeeDeduction: pension7,
      penaltiesDeduction: newPenalties,
      foodCostSharingDeduction: newFoodCostSharing,
      netPay: net,
      paymentStatus: 'Draft',
      bankName: emp?.bankAccount.bankName || 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: emp?.bankAccount.accountNumber || '1000000000000'
    };

    onAddPayrollRecord(record);
    setIsAddModalOpen(false);
  };

  const handleExportAccountingCsv = () => {
    const label = filterService !== 'All' ? `${filterService}_Division` : 'All_Divisions';
    exportPayrollToCsv(filteredRecords, label);
  };

  const handleExportBankFile = () => {
    const headers = ['Employee Code', 'Employee Name', 'Division', 'Working Days (of 30)', 'Bank Name', 'Account Number', 'Net Pay (ETB)'];
    const rows = filteredRecords.map(r => [
      r.employeeCode,
      r.employeeName,
      r.serviceType,
      `${r.workingDays}/30`,
      r.bankName,
      r.accountNumber,
      r.netPay
    ]);
    downloadCsv('HAB_Payroll_CBE_Disbursement.csv', headers, rows);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            Standard {stdWorkingDays}-Day Payroll Sheet · All 4 Divisions
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Workforce Payroll Sheet & Statutory Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Full Working Days: <strong className="text-slate-800 dark:text-slate-200">{stdWorkingDays} Days</strong> across all divisions. Additions: Basic, Transport, Mobile Card, House & Overtime. Includes <strong className="text-indigo-700 dark:text-indigo-400">{employerPensionPct}% Employer Pension (Non-Deductible)</strong> and Deductions (Tax, {employeePensionPct}% Employee Pension, Penalties, Food Cost Sharing).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-auto">
          {onOpenMasterSetup && (
            <button
              type="button"
              onClick={onOpenMasterSetup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9DB] hover:bg-[#FFF5B8] text-[#0E1525] border border-[#EFE1AA] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Master Rules ({stdWorkingDays}d · {employerPensionPct}%/{employeePensionPct}%)</span>
            </button>
          )}
          {canApprovePayroll && onAddPayrollRecord && (
            <button
              type="button"
              onClick={() => {
                setNewWorkingDays(stdWorkingDays);
                setNewTransport(masterConfig.pensionAndPayroll.defaultTransportAllowance);
                setNewMobileCard(masterConfig.pensionAndPayroll.defaultMobileAllowance);
                setNewHouse(masterConfig.pensionAndPayroll.defaultHousingAllowance);
                setNewFoodCostSharing(masterConfig.pensionAndPayroll.defaultFoodCostSharing);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payroll Row</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExportAccountingCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Export Payroll CSV</span>
          </button>
          {canApprovePayroll ? (
            <>
              <button
                type="button"
                onClick={handleExportBankFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span>Bank File (CBE)</span>
              </button>
              <button
                type="button"
                onClick={onApproveBatch}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Batch</span>
              </button>
              <button
                type="button"
                onClick={onDisburseBatch}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Disburse</span>
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>View-Only Audit Mode ({activeUser?.title.split(' ')[0]})</span>
            </span>
          )}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Gross Pay (Additions)</div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
            ETB {totalGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Basic + Transport + Mobile + House + OT</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">{employerPensionPct}% Pension (Non-Deductible)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              Non-Deductible
            </span>
          </div>
          <div className="text-lg font-bold text-indigo-700 dark:text-indigo-400 tabular-nums mt-0.5">
            ETB {totalEmployerPension11.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Employer contribution (not deducted from Net)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Total Deductions</div>
          <div className="text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
            -ETB {totalEmployeeDeductions.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Tax + {employeePensionPct}% Pension + Penalties + Food Cost</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Total Net Payable</div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
            ETB {totalNet.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Final take-home bank disbursement</span>
        </div>
      </div>

      {/* Payroll Sheet Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Master Payroll Sheet ({filteredRecords.length} Staff)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              Base Standard: {stdWorkingDays} Working Days
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              aria-label="Filter payroll by division"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
            >
              <option value="All">All 4 Divisions</option>
              <option value="Security">Security Division</option>
              <option value="Cleaning">Cleaning Division</option>
              <option value="Property Management">Property Management</option>
              <option value="Head Office Staff">Head Office Staff</option>
            </select>

            <input
              type="text"
              placeholder="Search name, code, division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs min-w-[1380px]">
            <thead>
              {/* Group Header Row */}
              <tr className="bg-[#FFF9DB] dark:bg-slate-900 text-[#0E1525] dark:text-slate-100 text-[11px] uppercase tracking-wider font-extrabold border-b border-amber-300 dark:border-slate-700">
                <th colSpan={3} className="py-2.5 px-3 bg-[#FFF5B8] dark:bg-slate-900 text-[#0E1525] dark:text-slate-100 border-r border-amber-300 dark:border-slate-700">Employee & Working Days ({stdWorkingDays} Days Full)</th>
                <th colSpan={6} className="py-2.5 px-3 text-center bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-r border-amber-300 dark:border-slate-700">Additions (Earnings in ETB)</th>
                <th colSpan={1} className="py-2.5 px-3 text-center bg-indigo-100 dark:bg-indigo-950/90 text-indigo-950 dark:text-indigo-200 border-r border-amber-300 dark:border-slate-700">Non-Deductible ({employerPensionPct}%)</th>
                <th colSpan={5} className="py-2.5 px-3 text-center bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-r border-amber-300 dark:border-slate-700">Deductions (ETB)</th>
                <th colSpan={2} className="py-2.5 px-3 text-right bg-[#FFF5B8] dark:bg-slate-900 text-[#0E1525] dark:text-slate-100">Net & Actions</th>
              </tr>
              {/* Column Sub-Headers */}
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b-2 border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Division</th>
                <th className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-700">Working Days</th>
                {/* Additions */}
                <th className="py-3 px-2.5 text-right">Basic Salary</th>
                <th className="py-3 px-2.5 text-right">Transport</th>
                <th className="py-3 px-2.5 text-right">Mobile Card</th>
                <th className="py-3 px-2.5 text-right">House</th>
                <th className="py-3 px-2.5 text-right">Overtime</th>
                <th className="py-3 px-3 text-right bg-emerald-50/70 dark:bg-emerald-950/30 border-r border-slate-200 dark:border-slate-700">Gross Pay</th>
                {/* Non-Deductible Employer Pension */}
                <th className="py-3 px-3 text-right bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-700">
                  {employerPensionPct}% Pension
                  <span className="block text-[9px] font-normal text-indigo-600 dark:text-indigo-400 normal-case">Non-Deductible</span>
                </th>
                {/* Deductions */}
                <th className="py-3 px-2.5 text-right">Tax</th>
                <th className="py-3 px-2.5 text-right">{employeePensionPct}% Pension</th>
                <th className="py-3 px-2.5 text-right">Penalties</th>
                <th className="py-3 px-2.5 text-right">Food Cost</th>
                <th className="py-3 px-3 text-right bg-rose-50/70 dark:bg-rose-950/30 border-r border-slate-200 dark:border-slate-700">Total Ded.</th>
                {/* Net & Actions */}
                <th className="py-3 px-3 text-right">Net Pay</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredRecords.map((r) => {
                const totalDeductions = r.incomeTaxDeduction + r.pensionEmployeeDeduction + r.penaltiesDeduction + r.foodCostSharingDeduction;
                const employerPension11 = r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11);

                return (
                  <tr key={r.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40 hover:bg-amber-50/40 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{r.employeeCode} · {r.siteName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDivisionBadgeStyle(r.serviceType)}`}>
                        {r.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        r.workingDays === 30
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                      }`}>
                        {r.workingDays} / {r.fullWorkingDays || 30}
                      </span>
                    </td>

                    {/* Additions */}
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {r.earnedBaseSalary.toLocaleString()}
                      {r.workingDays < 30 && (
                        <span className="block text-[9px] text-slate-400">of {r.baseSalary.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {r.transportAllowance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {r.mobileCardAllowance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {r.houseAllowance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-blue-700 dark:text-blue-400">
                      {r.overtimePay > 0 ? `+${r.overtimePay.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 bg-emerald-50/40 dark:bg-emerald-950/20 border-r border-slate-200 dark:border-slate-800">
                      {r.grossPay.toLocaleString()}
                    </td>

                    {/* Non-Deductible 11% Employer Pension */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20 border-r border-slate-200 dark:border-slate-800">
                      {employerPension11.toLocaleString()}
                    </td>

                    {/* Deductions */}
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      -{r.incomeTaxDeduction.toLocaleString()}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      -{r.pensionEmployeeDeduction.toLocaleString()}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      {r.penaltiesDeduction > 0 ? `-${r.penaltiesDeduction.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                      {r.foodCostSharingDeduction > 0 ? `-${r.foodCostSharingDeduction.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-rose-700 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20 border-r border-slate-200 dark:border-slate-800">
                      -{totalDeductions.toLocaleString()}
                    </td>

                    {/* Net Pay & Actions */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-black text-emerald-700 dark:text-emerald-400 text-xs">
                      ETB {r.netPay.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {canApprovePayroll && onUpdatePayrollRecord && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(r)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[11px] font-semibold rounded inline-flex items-center gap-1 transition-colors border border-amber-200 dark:border-amber-800"
                            title="Edit working days, allowances, or deductions"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenPayslip(r)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium rounded inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Slip</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Payroll Row */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Edit Payroll Sheet Entry — {editingRecord.employeeName}</span>
                </h3>
                <p className="text-xs text-slate-500">{editingRecord.employeeCode} · {editingRecord.serviceType} · Standard Full Month = 30 Days</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Working Days (Full = 30 Days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={editingRecord.workingDays}
                    onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, workingDays: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Monthly Basic Salary (30 Days ETB)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingRecord.baseSalary}
                    onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, baseSalary: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                    Earned Basic ({editingRecord.workingDays}/30): ETB {editingRecord.earnedBaseSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Additions */}
              <div>
                <div className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[11px] mb-2">
                  Additions (Allowances & Overtime)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Transport (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.transportAllowance}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, transportAllowance: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Mobile Card (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.mobileCardAllowance}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, mobileCardAllowance: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">House Allow. (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.houseAllowance}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, houseAllowance: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Overtime (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.overtimePay}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, overtimePay: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[11px] mb-2">
                  Deductions (Tax, 7% Pension, Penalties & Food Cost Sharing)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Income Tax (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.incomeTaxDeduction}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, incomeTaxDeduction: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">7% Pension (Auto)</label>
                    <input
                      type="number"
                      disabled
                      value={editingRecord.pensionEmployeeDeduction}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Penalties (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.penaltiesDeduction}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, penaltiesDeduction: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Food Cost Sharing</label>
                    <input
                      type="number"
                      min={0}
                      value={editingRecord.foodCostSharingDeduction}
                      onChange={(e) => setEditingRecord(handleRecalculateEditing({ ...editingRecord, foodCostSharingDeduction: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Preview Bar */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">Gross Pay</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">ETB {editingRecord.grossPay.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">11% Pension (Non-Deductible)</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">ETB {editingRecord.pensionEmployer11Percent.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">Final Net Pay</span>
                  <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">ETB {editingRecord.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  Save Payroll Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Payroll Sheet Entry */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold">Add Employee to Payroll Sheet</h3>
                <p className="text-xs text-slate-500">Uses 30 Working Days as full working month across all 4 divisions</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayrollEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Employee</label>
                  <select
                    value={newEmpId}
                    onChange={(e) => {
                      setNewEmpId(e.target.value);
                      const found = employees.find(x => x.id === e.target.value);
                      if (found) setNewBaseSalary(found.salary.baseSalary);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeCode} - {emp.serviceType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Working Days (of 30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newWorkingDays}
                    onChange={(e) => setNewWorkingDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Basic Salary (30 Days)</label>
                  <input
                    type="number"
                    value={newBaseSalary}
                    onChange={(e) => setNewBaseSalary(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Transport Allowance</label>
                  <input
                    type="number"
                    value={newTransport}
                    onChange={(e) => setNewTransport(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Mobile Card Allowance</label>
                  <input
                    type="number"
                    value={newMobileCard}
                    onChange={(e) => setNewMobileCard(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">House Allowance</label>
                  <input
                    type="number"
                    value={newHouse}
                    onChange={(e) => setNewHouse(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Overtime Pay</label>
                  <input
                    type="number"
                    value={newOvertimePay}
                    onChange={(e) => setNewOvertimePay(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Penalties</label>
                  <input
                    type="number"
                    value={newPenalties}
                    onChange={(e) => setNewPenalties(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Food Cost Sharing</label>
                  <input
                    type="number"
                    value={newFoodCostSharing}
                    onChange={(e) => setNewFoodCostSharing(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  Add to Payroll Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Payslip Document */}
      {isPayslipModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full p-7 space-y-4 shadow-2xl relative border border-slate-200">
            <button
              type="button"
              onClick={() => setIsPayslipModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print"
            >
              ✕
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
                Period: {selectedRecord.month} · Working Days: {selectedRecord.workingDays} / 30 Days
              </div>
            </div>

            {/* Employee Banner */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Employee:</span>
                <span className="font-bold text-slate-900">{selectedRecord.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Division & ID:</span>
                <span className="font-bold font-mono text-slate-900">{selectedRecord.serviceType} ({selectedRecord.employeeCode})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Working Days:</span>
                <span className="font-bold text-slate-900">{selectedRecord.workingDays} of 30 Full Working Days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bank Account:</span>
                <span className="font-mono text-slate-800">{selectedRecord.bankName} · {selectedRecord.accountNumber}</span>
              </div>
            </div>

            {/* Additions & Deductions Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5 border border-slate-200 p-3 rounded-lg">
                <span className="font-bold text-emerald-800 block pb-1 border-b border-slate-200 uppercase text-[10px]">
                  Additions (ETB)
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Basic Salary ({selectedRecord.workingDays}/30d):</span>
                  <span className="font-mono font-semibold">{selectedRecord.earnedBaseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transport Allowance:</span>
                  <span className="font-mono">{selectedRecord.transportAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mobile Card Allowance:</span>
                  <span className="font-mono">{selectedRecord.mobileCardAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>House Allowance:</span>
                  <span className="font-mono">{selectedRecord.houseAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Overtime:</span>
                  <span className="font-mono text-blue-700">+{selectedRecord.overtimePay.toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Pay:</span>
                  <span className="font-mono">ETB {selectedRecord.grossPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5 border border-slate-200 p-3 rounded-lg">
                <span className="font-bold text-rose-800 block pb-1 border-b border-slate-200 uppercase text-[10px]">
                  Deductions (ETB)
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Income Tax:</span>
                  <span className="font-mono">-{selectedRecord.incomeTaxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>7% Employee Pension:</span>
                  <span className="font-mono">-{selectedRecord.pensionEmployeeDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Penalties:</span>
                  <span className="font-mono">-{selectedRecord.penaltiesDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Food Cost Sharing:</span>
                  <span className="font-mono">-{selectedRecord.foodCostSharingDeduction.toLocaleString()}</span>
                </div>
                <div className="pt-5 border-t border-slate-200 flex justify-between font-bold text-rose-700">
                  <span>Total Deductions:</span>
                  <span className="font-mono">
                    -ETB {(selectedRecord.incomeTaxDeduction + selectedRecord.pensionEmployeeDeduction + selectedRecord.penaltiesDeduction + selectedRecord.foodCostSharingDeduction).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Non-Deductible 11% Employer Pension Callout */}
            <div className="bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-indigo-900">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-semibold">11% Employer Pension Contribution (Non-Deductible):</span>
              </div>
              <span className="font-mono font-bold text-indigo-800">
                ETB {(selectedRecord.pensionEmployer11Percent || Math.round(selectedRecord.earnedBaseSalary * 0.11)).toLocaleString()}
              </span>
            </div>

            {/* Net Pay Callout */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-emerald-800 text-[11px] font-semibold uppercase tracking-wider block">Net Take-Home Pay</span>
                <span className="text-xs text-slate-600">Disbursed via {selectedRecord.bankName}</span>
              </div>
              <div className="text-lg font-black font-mono text-emerald-800">
                ETB {selectedRecord.netPay.toLocaleString()}
              </div>
            </div>

            {/* Print Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
