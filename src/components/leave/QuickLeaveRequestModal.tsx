import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Search, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Employee, LeaveRequest, LeaveType } from '../../types/hrm';
import { calculateEmployeeStatutoryLeave, loadSystemSettings } from '../../utils/systemSettingsStorage';

interface QuickLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSubmitLeave: (newLeave: LeaveRequest) => void;
}

export const QuickLeaveRequestModal: React.FC<QuickLeaveRequestModalProps> = ({
  isOpen,
  onClose,
  employees,
  onSubmitLeave
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const activeEmployees = employees.filter(e => e.status !== 'Exited');
  const matchingEmployees = activeEmployees.filter(e => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.employeeCode.toLowerCase().includes(q)
    );
  });

  const selectedEmp = employees.find(e => e.id === selectedEmployeeId);

  // Calculate day difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeCode: selectedEmp.employeeCode,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      serviceType: selectedEmp.serviceType,
      siteId: selectedEmp.currentSiteId || 'site-bole',
      siteName: selectedEmp.currentSiteName || 'Head Office',
      leaveType,
      startDate,
      endDate,
      days: calculatedDays,
      reason: reason.trim() || `${leaveType} requested through HR central portal.`,
      status: 'Approved',
      reviewedBy: 'HR Operations Lead',
      appliedDate: new Date().toISOString().slice(0, 10)
    };

    onSubmitLeave(newRequest);
    onClose();
    setSearchTerm('');
    setSelectedEmployeeId('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Book Employee Leave Request
              </h2>
              <p className="text-xs text-slate-500">
                Search employee, assign leave type and automatically deduct active balance
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Employee Search Autocomplete */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Search Employee (Name or Code) *
            </label>
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by first name, father name, or HAB code..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <select
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              required
            >
              <option value="">-- Choose Matching Employee ({matchingEmployees.length}) --</option>
              {matchingEmployees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Employee Snapshot & Dynamic Statutory Formula */}
          {selectedEmp && (() => {
            const rules = loadSystemSettings().hrLaborRules;
            const statutory = calculateEmployeeStatutoryLeave(selectedEmp.hireDate, rules);
            const bonus = statutory.statutoryDays - rules.baseLeaveDays;
            return (
              <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{selectedEmp.firstName} {selectedEmp.lastName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedEmp.serviceType} · Site: {selectedEmp.currentSiteName || 'Reserve Pool'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Statutory Entitlement</span>
                  <span className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    {statutory.statutoryDays} Days
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    ({rules.baseLeaveDays} Base{bonus > 0 ? ` + ${bonus}d for ${statutory.tenureYears}y service` : ' · Year 1'})
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Leave Type with Approval Tier Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Statutory Leave Type *</label>
              {leaveType.includes('Maternity') || leaveType.includes('Unpaid') ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                  Tier 2: CEO Sign-off
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  Tier 1: Head of Dept
                </span>
              )}
            </div>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as LeaveType)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
            >
              <option value="Annual Leave">Annual Paid Leave (የዓመት ፈቃድ)</option>
              <option value="Sick Leave">Sick Leave with Medical Proof (የህመም ፈቃድ)</option>
              <option value="Compassionate Leave">Compassionate / Mourning (የሀዘን ፈቃድ)</option>
              <option value="Maternity Leave">Maternity Leave (የወሊድ ፈቃድ)</option>
              <option value="Paternity Leave">Paternity Leave (የአባትነት ፈቃድ)</option>
              <option value="Unpaid Leave">Unpaid Special Permission (ያለ ክፍያ ፈቃድ)</option>
            </select>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span>Total Payable Days to Deduct:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">{calculatedDays} Day(s)</span>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Request Reason / Remarks</label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Approved medical leave with certificate from St. Paul Hospital."
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!selectedEmp}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white dark:bg-[#F2C46A] dark:text-[#4C4541] shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit & Deduct Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
