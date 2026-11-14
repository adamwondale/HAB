import React, { useState } from 'react';
import { Plus, AlertCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { LeaveRequest, Employee, ClientSite, ManagementPerson, EmployeeLeaveBalance } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../utils/masterConfigEngine';
import { INITIAL_LEAVE_REQUESTS, INITIAL_EMPLOYEES, INITIAL_LEAVE_BALANCES } from '../data/mockData';
import { LeaveRequestsTab } from './leave/LeaveRequestsTab';
import { LeaveAvailableTab } from './leave/LeaveAvailableTab';
import { ApplyLeaveModal } from './leave/ApplyLeaveModal';

interface LeaveManagementViewProps {
  leaveRequests?: LeaveRequest[];
  employees?: Employee[];
  sites?: ClientSite[];
  activeUser?: ManagementPerson;
  masterConfig?: SystemMasterConfig;
  onApproveLeave?: (leaveId: string, replacementEmployeeId: string, replacementEmployeeName: string) => void;
  onRejectLeave?: (leaveId: string) => void;
  onAddLeaveRequest?: (newReq: LeaveRequest) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  leaveRequests = INITIAL_LEAVE_REQUESTS,
  employees = INITIAL_EMPLOYEES,
  activeUser,
  masterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  onApproveLeave,
  onRejectLeave,
  onAddLeaveRequest
}) => {
  const canApprove = activeUser
    ? activeUser.permissions.canManageShiftsAndDeployments || activeUser.permissions.canEditEmployees
    : true;

  const [activeTab, setActiveTab] = useState<'Request' | 'Available'>('Request');
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [balances, setBalances] = useState<Record<string, EmployeeLeaveBalance>>(() => {
    const initialMap: Record<string, EmployeeLeaveBalance> = {};
    INITIAL_LEAVE_BALANCES.forEach(b => { initialMap[b.employeeId] = b; });
    return initialMap;
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [preselectedEmpId, setPreselectedEmpId] = useState('');
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // Automated deduction logic upon leave request approval
  const handleApprove = (leaveId: string, replacementId: string, replacementName: string) => {
    const targetReq = requests.find(r => r.id === leaveId);
    if (!targetReq) return;

    const empId = targetReq.employeeId;
    const daysToDeduct = targetReq.days;
    const currentBal = balances[empId] || {
      employeeId: empId,
      employeeCode: targetReq.employeeCode,
      employeeName: targetReq.employeeName,
      serviceType: targetReq.serviceType,
      annual: 16,
      sick: 30,
      compassionate: 7,
      totalRemaining: 53
    };

    let field: 'annual' | 'sick' | 'compassionate' = 'annual';
    if (targetReq.leaveType === 'Sick Leave') field = 'sick';
    else if (targetReq.leaveType === 'Compassionate') field = 'compassionate';

    // Show warning if requested days exceed remaining balance
    if (daysToDeduct > currentBal[field]) {
      setWarningToast(`Automated deduction warning: ${targetReq.employeeName} requested ${daysToDeduct} days of ${targetReq.leaveType}, exceeding available balance of ${currentBal[field]} days.`);
    } else {
      setWarningToast(null);
    }

    // Immediately deduct approved days from employee's available leave balance in state
    const updatedField = Math.max(0, currentBal[field] - daysToDeduct);
    const updatedAnnual = field === 'annual' ? updatedField : currentBal.annual;
    const updatedSick = field === 'sick' ? updatedField : currentBal.sick;
    const updatedComp = field === 'compassionate' ? updatedField : currentBal.compassionate;

    setBalances(prev => ({
      ...prev,
      [empId]: {
        ...currentBal,
        annual: updatedAnnual,
        sick: updatedSick,
        compassionate: updatedComp,
        totalRemaining: updatedAnnual + updatedSick + updatedComp
      }
    }));

    setRequests(prev => prev.map(r => r.id === leaveId ? {
      ...r,
      status: 'Approved',
      replacementEmployeeId: replacementId,
      replacementEmployeeName: replacementName,
      reviewedBy: activeUser ? `${activeUser.name} (HR)` : 'Solomon Teshome (HR Director)'
    } : r));

    onApproveLeave?.(leaveId, replacementId, replacementName);
  };

  const handleReject = (leaveId: string) => {
    setRequests(prev => prev.map(r => r.id === leaveId ? {
      ...r,
      status: 'Rejected',
      reviewedBy: activeUser ? `Rejected by ${activeUser.name}` : 'Rejected by HR Operations'
    } : r));
    onRejectLeave?.(leaveId);
  };

  const handleAddRequest = (newReq: LeaveRequest) => {
    setRequests(prev => [newReq, ...prev]);
    onAddLeaveRequest?.(newReq);
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Workforce Attendance</div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Leave Management & Relief Coverage</h1>
          <p className="text-xs text-slate-500 mt-1">Review leave applications and inspect employee available leave day balances.</p>
        </div>
        <button
          type="button"
          onClick={() => { setPreselectedEmpId(''); setIsApplyModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F2C46A] hover:bg-amber-400 text-[#4C4541] font-bold text-xs rounded-xl transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Leave</span>
        </button>
      </div>

      {warningToast && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warningToast}</span>
          </div>
          <button type="button" onClick={() => setWarningToast(null)} className="font-bold hover:text-amber-700">✕</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase">Total Applications</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{requests.length}</div>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/30 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-800 uppercase">Pending Requests</div>
          <div className="text-xl font-bold text-amber-900 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 bg-emerald-50/30 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase">Approved Leaves</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase">Tracked Directory</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{employees.length} Staff</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('Request')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'Request'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Request Queue</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Available')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'Available'
                ? 'bg-[#4C4541] text-[#FCF0DA]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Available Balances Directory
          </button>
        </div>

        {activeTab === 'Request' ? (
          <LeaveRequestsTab
            leaveRequests={requests}
            employees={employees}
            leaveBalances={balances}
            canApprove={canApprove}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <LeaveAvailableTab
            employees={employees}
            leaveBalances={balances}
            onRequestLeaveForEmployee={(empId) => {
              setPreselectedEmpId(empId);
              setIsApplyModalOpen(true);
            }}
          />
        )}
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        employees={employees}
        leaveBalances={balances}
        preselectedEmployeeId={preselectedEmpId}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};
