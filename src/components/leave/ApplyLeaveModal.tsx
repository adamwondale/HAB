import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';
import { LeaveRequest, Employee, LeaveType, EmployeeLeaveBalance } from '../../types/hrm';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  leaveBalances: Record<string, EmployeeLeaveBalance>;
  preselectedEmployeeId?: string;
  onSubmit: (newRequest: LeaveRequest) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  employees,
  leaveBalances,
  preselectedEmployeeId = '',
  onSubmit
}) => {
  const [employeeId, setEmployeeId] = useState(preselectedEmployeeId);
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(3);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (preselectedEmployeeId) {
      setEmployeeId(preselectedEmployeeId);
    }
  }, [preselectedEmployeeId]);

  if (!isOpen) return null;

  const emp = employees.find(e => e.id === employeeId);
  const balance = employeeId ? leaveBalances[employeeId] : undefined;

  let currentCategoryBalance = 16;
  if (balance) {
    if (leaveType === 'Annual Leave') currentCategoryBalance = balance.annual;
    else if (leaveType === 'Sick Leave') currentCategoryBalance = balance.sick;
    else if (leaveType === 'Compassionate') currentCategoryBalance = balance.compassionate;
    else currentCategoryBalance = balance.totalRemaining;
  }

  const isExceeded = days > currentCategoryBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emp) return;

    const newReq: LeaveRequest = {
      id: `lve-${Date.now()}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      serviceType: emp.serviceType,
      siteId: emp.currentSiteId || 'site-1',
      siteName: emp.currentSiteName || 'Commercial Bank of Ethiopia Tower (HQ)',
      leaveType,
      startDate,
      endDate,
      days,
      reason: reason || 'Scheduled personal leave request.',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    onSubmit(newReq);
    onClose();
    setEmployeeId('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Workforce Operations</div>
            <h2 className="text-base font-bold text-slate-900">Submit Leave Application</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1 rounded bg-slate-100">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            >
              <option value="">-- Choose employee --</option>
              {employees
                .filter(e => e.status === 'Active' || e.status === 'Probation')
                .map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Leave Classification *</label>
              <select
                value={leaveType}
                onChange={e => setLeaveType(e.target.value as LeaveType)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Compassionate">Compassionate</option>
                <option value="Maternity / Paternity">Maternity / Paternity</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Days *</label>
              <input
                type="number"
                min={1}
                max={90}
                value={days}
                onChange={e => setDays(Math.max(1, Number(e.target.value)))}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {employeeId && balance && (
            <div className={`p-3 rounded-xl border text-xs ${
              isExceeded
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span>Available {leaveType} Balance:</span>
                <span className="font-mono text-sm font-bold">{currentCategoryBalance} Days</span>
              </div>
              {isExceeded && (
                <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-800 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>Warning: Requested {days} days exceed remaining balance of {currentCategoryBalance} days!</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Application Reason</label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Scheduled annual home visit or medical recovery."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!employeeId}
            className="px-5 py-2 bg-[#F2C46A] hover:bg-amber-400 text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};
