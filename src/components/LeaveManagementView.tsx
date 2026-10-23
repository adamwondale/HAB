import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Users,
  Lock
} from 'lucide-react';
import { LeaveRequest, Employee, LeaveType, ClientSite, ManagementPerson } from '../types/hrm';

interface LeaveManagementViewProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  onApproveLeave: (leaveId: string, replacementEmployeeId: string, replacementEmployeeName: string) => void;
  onRejectLeave: (leaveId: string) => void;
  onAddLeaveRequest: (newReq: LeaveRequest) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  leaveRequests,
  employees,
  activeUser,
  onApproveLeave,
  onRejectLeave,
  onAddLeaveRequest
}) => {
  const canApproveLeave = activeUser
    ? activeUser.permissions.canManageShiftsAndDeployments || activeUser.permissions.canEditEmployees
    : true;
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [selectedReplacementMap, setSelectedReplacementMap] = useState<Record<string, string>>({});

  // Apply modal form
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [days, setDays] = useState(5);
  const [reason, setReason] = useState('');

  const filteredRequests = leaveRequests.filter(r => {
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const newLeave: LeaveRequest = {
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
      reason: reason || 'Personal family matters',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    onAddLeaveRequest(newLeave);
    setIsApplyModalOpen(false);
    setEmployeeId('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Leave & Relief Coverage
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Leave Applications & Site Coverage
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Approve leaves and assign relief personnel to prevent unstaffed posts at client sites.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Leave</span>
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Active Leave Applications ({filteredRequests.length})
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <select
              aria-label="Filter by approval status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-100 text-slate-900 border-b-2 border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-5 font-bold text-slate-900">Employee</th>
                <th className="py-4 px-5 font-bold text-slate-900">Division</th>
                <th className="py-4 px-5 font-bold text-slate-900">Assigned Site</th>
                <th className="py-4 px-5 font-bold text-slate-900">Leave Type</th>
                <th className="py-4 px-5 font-bold text-slate-900">Duration</th>
                <th className="py-4 px-5 font-bold text-slate-900">Designated Post Relief</th>
                <th className="py-4 px-5 font-bold text-slate-900">Status</th>
                <th className="py-4 px-5 font-bold text-slate-900 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredRequests.map((req) => {
                const selectedReplacementId = selectedReplacementMap[req.id] || '';
                const availableReplacements = employees.filter(
                  e => e.serviceType === req.serviceType && e.id !== req.employeeId && e.status === 'Active'
                );

                return (
                  <tr key={req.id} className="odd:bg-white even:bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
                    <td className="py-4 px-5 font-normal">
                      <div className="font-medium text-slate-800">{req.employeeName}</div>
                      <div className="text-[11px] font-mono text-slate-400 font-normal mt-0.5">{req.employeeCode}</div>
                    </td>
                    <td className="py-4 px-5 font-normal">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${
                        req.serviceType === 'Security'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : req.serviceType === 'Cleaning'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.serviceType === 'Property Management'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {req.serviceType}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-normal max-w-xs truncate">
                      {req.siteName}
                    </td>
                    <td className="py-4 px-5 font-normal">
                      <span className="text-amber-800 font-medium">{req.leaveType}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-normal">
                      <div>{req.startDate} to {req.endDate}</div>
                      <span className="text-[11px] text-slate-400 font-mono font-normal">{req.days} Days</span>
                    </td>
                    <td className="py-4 px-5 font-normal">
                      {req.status === 'Pending' ? (
                        <select
                          aria-label={`Select coverage replacement for ${req.employeeName}`}
                          value={selectedReplacementId}
                          onChange={(e) => setSelectedReplacementMap({
                            ...selectedReplacementMap,
                            [req.id]: e.target.value
                          })}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded px-2.5 py-1.5 max-w-[180px] focus:outline-none focus:border-amber-600"
                        >
                          <option value="">-- Assign Relief Guard --</option>
                          {availableReplacements.map(rep => (
                            <option key={rep.id} value={rep.id}>
                              {rep.firstName} {rep.lastName} ({rep.currentSiteName ? 'Relief' : 'Standby Pool'})
                            </option>
                          ))}
                        </select>
                      ) : req.replacementEmployeeName ? (
                        <div className="text-slate-800 flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{req.replacementEmployeeName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">None assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-5 font-normal">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-normal">
                      {req.status === 'Pending' ? (
                        canApproveLeave ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const repEmp = availableReplacements.find(e => e.id === selectedReplacementId);
                                const repName = repEmp ? `${repEmp.firstName} ${repEmp.lastName} (${repEmp.employeeCode})` : 'Standby Pool Officer';
                                onApproveLeave(req.id, selectedReplacementId, repName);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectLeave(req.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] rounded transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                            <Lock className="w-3 h-3" />
                            HR / Ops Approval
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 font-normal text-[11px]">
                          {req.reviewedBy || 'HR Ops'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Submit Leave Request */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleApplyLeave} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Apply for Employee Leave</h2>
                <p className="text-xs text-slate-500">Plan coverage relief for client site post</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
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

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Classification *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                  <option value="Compassionate">Compassionate</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Days</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Scheduled annual holiday visit."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!employeeId}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
