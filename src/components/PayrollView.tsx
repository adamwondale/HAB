import React, { useState } from 'react';
import { CreditCard, Download, Plus, CheckCircle2, Paperclip, Sliders, DollarSign, TrendingDown } from 'lucide-react';
import { PayrollRecord, ServiceType, Employee, ManagementPerson } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../utils/masterConfigEngine';
import { exportPayrollToCsv } from '../utils/csvExport';
import { StatutorySummaryCards } from './payroll/StatutorySummaryCards';

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
import { PayrollCalculationTable } from './payroll/PayrollCalculationTable';
import { PayslipModal } from './payroll/PayslipModal';
import { EditPayrollModal } from './payroll/EditPayrollModal';
import { AddPayrollModal } from './payroll/AddPayrollModal';
import { ChequeCashControlCard } from './finance/ChequeCashControlCard';
import { MaterialDepreciationTable } from './finance/MaterialDepreciationTable';
import { AttendanceAttachmentModal } from './finance/AttendanceAttachmentModal';

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
  const [activeFinanceTab, setActiveFinanceTab] = useState<'payroll' | 'cheque_cash' | 'depreciation'>('payroll');
  const [filterService, setFilterService] = useState<'All' | ServiceType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);

  const filteredRecords = payrollRecords.filter((r) => {
    if (filterService !== 'All' && r.serviceType !== filterService) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.employeeName.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExportCsv = () => {
    exportPayrollToCsv(filteredRecords);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#F2C46A]" />
            <h1 className="text-lg sm:text-xl font-bold text-[#4C4541] dark:text-slate-100">
              Finance & 30-Day Payroll Sheet
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            9-Column salary calculations, tax compliance, cheque balances, and material depreciation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenMasterSetup && (
            <button
              type="button"
              onClick={onOpenMasterSetup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Master Setup</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAttendanceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Paperclip className="w-3.5 h-3.5 text-[#F2C46A]" />
            <span>Attendance & On-Leave</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {canApprovePayroll && onAddPayrollRecord && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* Finance Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveFinanceTab('payroll')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFinanceTab === 'payroll'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>9-Column Payroll Table</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('cheque_cash')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFinanceTab === 'cheque_cash'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Cheque & Petty Cash Control</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('depreciation')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFinanceTab === 'depreciation'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Material Depreciation & Stock</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeFinanceTab === 'payroll' && (
        <div className="space-y-4">
          <StatutorySummaryCards records={filteredRecords} />

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'] as const).map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setFilterService(div)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                    filterService === div
                      ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee name or code..."
              className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>

          <PayrollCalculationTable
            records={filteredRecords}
            canEdit={canApprovePayroll && !!onUpdatePayrollRecord}
            onOpenPayslip={(rec) => setSelectedPayslipRecord(rec)}
            onOpenEdit={(rec) => setEditingRecord(rec)}
          />

          {canApprovePayroll && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onApproveBatch}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Approve Monthly Payroll Batch
              </button>
              <button
                type="button"
                onClick={onDisburseBatch}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Disburse to Bank Accounts
              </button>
            </div>
          )}
        </div>
      )}

      {activeFinanceTab === 'cheque_cash' && <ChequeCashControlCard />}

      {activeFinanceTab === 'depreciation' && <MaterialDepreciationTable />}

      {/* Modals */}
      <PayslipModal record={selectedPayslipRecord} onClose={() => setSelectedPayslipRecord(null)} />
      <EditPayrollModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={(updated) => {
          if (onUpdatePayrollRecord) onUpdatePayrollRecord(updated);
          setEditingRecord(null);
        }}
      />
      <AddPayrollModal
        isOpen={isAddModalOpen}
        employees={employees}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newRec) => {
          if (onAddPayrollRecord) onAddPayrollRecord(newRec);
        }}
      />
      <AttendanceAttachmentModal
        isOpen={isAttendanceModalOpen}
        employees={employees}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
    </div>
  );
};
