import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Download, Plus, CalendarCheck, Sliders, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { PayrollRecord, Employee, ManagementPerson, AttendanceRecord, LeaveRequest } from '../types/hrm';
import { Division } from '../types/division';
import { SystemMasterConfig } from '../types/masterConfig';
import { exportPayrollToCsv } from '../utils/csvExport';
import { StatutorySummaryCards } from './payroll/StatutorySummaryCards';
import { PayrollCalculationTable } from './payroll/PayrollCalculationTable';
import { PayslipModal } from './payroll/PayslipModal';
import { EditPayrollModal } from './payroll/EditPayrollModal';
import { AddPayrollModal } from './payroll/AddPayrollModal';
import { ImportAttendanceModal } from './payroll/ImportAttendanceModal';
import { ChequeCashControlCard } from './finance/ChequeCashControlCard';
import { MaterialDepreciationTable } from './finance/MaterialDepreciationTable';
import { SiteAccountsReceivableView } from './finance/SiteAccountsReceivableView';
export { getDivisionBadgeStyle } from './payroll/payrollHelpers';

interface PayrollViewProps {
  payrollRecords: PayrollRecord[];
  employees?: Employee[];
  divisions?: Division[];
  activeUser?: ManagementPerson;
  masterConfig?: SystemMasterConfig;
  attendance?: AttendanceRecord[];
  leaveRequests?: LeaveRequest[];
  onOpenMasterSetup?: () => void;
  onApproveBatch?: () => void;
  onDisburseBatch?: () => void;
  onUpdatePayrollRecord?: (updated: PayrollRecord) => void;
  onBatchUpdatePayroll?: (updatedRecords: PayrollRecord[]) => void;
  onAddPayrollRecord?: (newRecord: PayrollRecord) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrollRecords,
  employees = [],
  divisions = [],
  activeUser,
  attendance = [],
  leaveRequests = [],
  onOpenMasterSetup,
  onApproveBatch,
  onDisburseBatch,
  onUpdatePayrollRecord,
  onBatchUpdatePayroll,
  onAddPayrollRecord
}) => {
  const { t } = useTranslation();
  const canApprove = activeUser ? activeUser.permissions.canApprovePayroll : true;
  const [activeFinanceTab, setActiveFinanceTab] = useState<'payroll' | 'client_ar' | 'cheque_cash' | 'depreciation'>('payroll');
  const [filterService, setFilterService] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportAttendanceOpen, setIsImportAttendanceOpen] = useState(false);

  const divisionList = divisions.length > 0
    ? ['All', ...divisions.map((d) => d.name)]
    : ['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'];

  const handleApplyAttendance = (updatedRecords: PayrollRecord[]) => {
    if (onBatchUpdatePayroll) {
      onBatchUpdatePayroll(updatedRecords);
    } else if (onUpdatePayrollRecord) {
      updatedRecords.forEach((r) => onUpdatePayrollRecord(r));
    }
  };

  const handleConfirmDisburse = () => {
    if (window.confirm(t('payroll.confirmDisbursement')) && onDisburseBatch) onDisburseBatch();
  };

  const filteredRecords = payrollRecords.filter((r) => {
    if (filterService !== 'All' && r.serviceType !== filterService) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return r.employeeName.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('payroll.title')}</h1>
          <p className="text-xs text-slate-500 mt-1">{t('payroll.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenMasterSetup && (
            <button type="button" onClick={onOpenMasterSetup} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('nav.masterSetup')}</span>
            </button>
          )}
          <button type="button" onClick={() => setIsImportAttendanceOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
            <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('payroll.importAttendance')}</span>
          </button>
          <button type="button" onClick={() => exportPayrollToCsv(filteredRecords)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>{t('common.exportCsv')}</span>
          </button>
          {canApprove && onAddPayrollRecord && (
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>{t('payroll.addRecord')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Finance Navigation Tabs - Clean, eye-friendly tabs without icon noise */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveFinanceTab('payroll')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeFinanceTab === 'payroll'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t('payroll.sheetTitle')}
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('client_ar')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeFinanceTab === 'client_ar'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Client Site Invoices & AR
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('cheque_cash')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeFinanceTab === 'cheque_cash'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t('payroll.chequeCashControl')}
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('depreciation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeFinanceTab === 'depreciation'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t('payroll.materialDepreciation')}
        </button>
      </div>

      {/* Tab Panels */}
      {activeFinanceTab === 'payroll' && (
        <div className="space-y-4">
          <StatutorySummaryCards records={filteredRecords} />

          {/* Table Filters & Month Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="October 2026">Meskerem 2019 / October 2026</option>
                  <option value="November 2026">Tikimt 2019 / November 2026</option>
                  <option value="December 2026">Hidar 2019 / December 2026</option>
                </select>
              </div>

              {divisionList.map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setFilterService(div)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                    filterService === div ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8] font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              placeholder={t('payroll.searchPlaceholder')}
              className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <PayrollCalculationTable
            records={filteredRecords}
            canEdit={canApprove && !!onUpdatePayrollRecord}
            onOpenPayslip={(rec) => setSelectedPayslipRecord(rec)}
            onOpenEdit={(rec) => setEditingRecord(rec)}
          />

          {canApprove ? (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onApproveBatch} className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold text-xs shadow-2xs cursor-pointer transition-colors">
                {t('payroll.approveBatch')}
              </button>
              <button type="button" onClick={handleConfirmDisburse} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs cursor-pointer transition-colors">
                {t('payroll.disburseBank')}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs">
              {t('payroll.inputModeNotice')}
            </div>
          )}
        </div>
      )}

      {activeFinanceTab === 'client_ar' && <SiteAccountsReceivableView />}
      {activeFinanceTab === 'cheque_cash' && <ChequeCashControlCard />}
      {activeFinanceTab === 'depreciation' && <MaterialDepreciationTable />}

      {/* Modals */}
      <PayslipModal record={selectedPayslipRecord} onClose={() => setSelectedPayslipRecord(null)} />
      <EditPayrollModal record={editingRecord} onClose={() => setEditingRecord(null)} onSave={(u) => { if (onUpdatePayrollRecord) onUpdatePayrollRecord(u); setEditingRecord(null); }} />
      <AddPayrollModal isOpen={isAddModalOpen} employees={employees} onClose={() => setIsAddModalOpen(false)} onAdd={(r) => { if (onAddPayrollRecord) onAddPayrollRecord(r); }} />
      <ImportAttendanceModal isOpen={isImportAttendanceOpen} onClose={() => setIsImportAttendanceOpen(false)} payrollRecords={payrollRecords} attendanceRecords={attendance} leaveRequests={leaveRequests} onApplyAttendance={handleApplyAttendance} />
    </div>
  );
};
