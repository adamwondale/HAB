import React, { useState } from 'react';
import { CheckCircle2, XCircle, Users, AlertTriangle } from 'lucide-react';
import { LeaveRequest, Employee, EmployeeLeaveBalance } from '../../types/hrm';

interface LeaveRequestsTabProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  leaveBalances: Record<string, EmployeeLeaveBalance>;
  canApprove: boolean;
  onApprove: (requestId: string, replacementId: string, replacementName: string) => void;
  onReject: (requestId: string) => void;
}

export const LeaveRequestsTab: React.FC<LeaveRequestsTabProps> = ({
  leaveRequests,
  employees,
  leaveBalances,
  canApprove,
  onApprove,
  onReject
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedReplacementMap, setSelectedReplacementMap] = useState<Record<string, string>>({});

  const filteredRequests = leaveRequests.filter(r => {
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Leave Applications Queue ({filteredRequests.length})
        </h2>
        <div className="flex items-center gap-1.5">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-left text-xs min-w-[880px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-amber-200 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Division</th>
              <th className="py-3.5 px-4">Assigned Site</th>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Relief Coverage</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">No leave applications found for this filter.</td>
              </tr>
            ) : (
              filteredRequests.map(req => {
                const repId = selectedReplacementMap[req.id] || '';
                const availableReplacements = employees.filter(
                  e => e.serviceType === req.serviceType && e.id !== req.employeeId && e.status === 'Active'
                );

                const balance = leaveBalances[req.employeeId];
                let currentBal = 16;
                if (balance) {
                  if (req.leaveType === 'Annual Leave') currentBal = balance.annual;
                  else if (req.leaveType === 'Sick Leave') currentBal = balance.sick;
                  else if (req.leaveType === 'Compassionate') currentBal = balance.compassionate;
                  else currentBal = balance.totalRemaining;
                }
                const isOverdraft = req.days > currentBal && req.status === 'Pending';

                return (
                  <tr key={req.id} className="odd:bg-white even:bg-slate-50/70 hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-normal">
                      <div className="font-semibold text-slate-900">{req.employeeName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{req.employeeCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {req.serviceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{req.siteName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{req.leaveType}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{req.startDate} to {req.endDate}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-mono text-amber-800 font-bold">{req.days} Days</span>
                        {isOverdraft && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 font-semibold" title={`Exceeds ${currentBal} remaining days`}>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Exceeds bal ({currentBal}d left)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'Pending' ? (
                        <select
                          aria-label={`Select coverage replacement for ${req.employeeName}`}
                          value={repId}
                          onChange={e => setSelectedReplacementMap({ ...selectedReplacementMap, [req.id]: e.target.value })}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 max-w-[170px] focus:outline-none focus:border-amber-600"
                        >
                          <option value="">-- Assign Relief --</option>
                          {availableReplacements.map(rep => (
                            <option key={rep.id} value={rep.id}>
                              {rep.firstName} {rep.lastName} ({rep.currentSiteName ? 'Relief' : 'Standby'})
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
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'Pending' ? (
                        canApprove ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const repEmp = availableReplacements.find(e => e.id === repId);
                                const repName = repEmp ? `${repEmp.firstName} ${repEmp.lastName} (${repEmp.employeeCode})` : 'Standby Pool Officer';
                                onApprove(req.id, repId, repName);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => onReject(req.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">HR Ops</span>
                        )
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">{req.reviewedBy || 'HR Ops'}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
