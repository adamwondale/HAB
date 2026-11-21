import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, AlertCircle, ShieldCheck } from 'lucide-react';
import { LeaveRequest, Employee, ClientSite, ManagementPerson, EmployeeLeaveBalance } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { INITIAL_LEAVE_REQUESTS, INITIAL_EMPLOYEES, INITIAL_LEAVE_BALANCES } from '../data/mockData';
import { LeaveRequestsTab } from './leave/LeaveRequestsTab';
import { LeaveAvailableTab } from './leave/LeaveAvailableTab';
import { LeaveSummaryStats } from './leave/LeaveSummaryStats';
import { QuickLeaveRequestModal } from './leave/QuickLeaveRequestModal';
import { loadSystemSettings, calculateEmployeeStatutoryLeave } from '../utils/systemSettingsStorage';
import { SystemSettings } from '../types/systemSettings';

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
  onApproveLeave,
  onRejectLeave,
  onAddLeaveRequest
}) => {
  const { t } = useTranslation();
  const canApprove = activeUser
    ? activeUser.permissions.canManageShiftsAndDeployments || activeUser.permissions.canEditEmployees
    : true;

  const [settings, setSettings] = useState<SystemSettings>(() => loadSystemSettings());
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

  useEffect(() => {
    const handleSettingsUpdate = (e: Event) => {
      const custom = e as CustomEvent<SystemSettings>;
      if (custom.detail) {
        setSettings(custom.detail);
      }
    };
    window.addEventListener('hab_system_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('hab_system_settings_updated', handleSettingsUpdate);
  }, []);

  const handleApprove = (leaveId: string, replacementId: string, replacementName: string) => {
    const targetReq = requests.find(r => r.id === leaveId);
    if (!targetReq) return;

    const empId = targetReq.employeeId;
    const daysToDeduct = targetReq.days;
    const emp = employees.find(e => e.id === empId);
    const statutory = emp ? calculateEmployeeStatutoryLeave(emp.hireDate, settings.hrLaborRules) : null;
    const baseAnnual = statutory ? statutory.statutoryDays : settings.hrLaborRules.baseLeaveDays;

    const currentBal = balances[empId] || {
      employeeId: empId,
      employeeCode: targetReq.employeeCode,
      employeeName: targetReq.employeeName,
      serviceType: targetReq.serviceType,
      annual: baseAnnual,
      sick: 30,
      compassionate: 7,
      totalRemaining: baseAnnual + 37
    };

    let field: 'annual' | 'sick' | 'compassionate' = 'annual';
    if (targetReq.leaveType === 'Sick Leave') field = 'sick';
    else if (targetReq.leaveType === 'Compassionate') field = 'compassionate';

    if (daysToDeduct > currentBal[field]) {
      setWarningToast(`Warning: ${targetReq.employeeName} requested ${daysToDeduct} days (${targetReq.leaveType}), exceeding remaining balance of ${currentBal[field]} days.`);
    } else {
      setWarningToast(null);
    }

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
      reviewedBy: activeUser ? `${activeUser.name}` : 'HR'
    } : r));

    onApproveLeave?.(leaveId, replacementId, replacementName);
  };

  const handleReject = (leaveId: string) => {
    setRequests(prev => prev.map(r => r.id === leaveId ? {
      ...r,
      status: 'Rejected',
      reviewedBy: activeUser ? `Rejected by ${activeUser.name}` : 'Rejected by HR'
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white">{t('hr.leaveRequestsTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('hr.leaveRequestsDesc')}</p>
        </div>
        <button
          type="button"
          onClick={() => { setPreselectedEmpId(''); setIsApplyModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 dark:bg-slate-100 dark:text-slate-900"
        >
          <Plus className="w-4 h-4" />
          <span>{t('hr.leaveRequest')}</span>
        </button>
      </div>

      {warningToast && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warningToast}</span>
          </div>
          <button type="button" onClick={() => setWarningToast(null)} className="font-bold hover:text-amber-700">✕</button>
        </div>
      )}

      {/* Multi-Tier Approval Protocol & Statutory Progression Banner */}
      <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/40 p-2.5 rounded-lg border border-[#EFE7D8] dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between text-xs text-[#4C4541] dark:text-slate-300 gap-2">
        <span className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          Multi-Tier Approval Protocol: Requires Head of Department & CEO / Executive Sign-off
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold border border-slate-200 dark:border-slate-700 text-amber-800 dark:text-amber-300">
            Formula: {settings.hrLaborRules.baseLeaveDays}d + 1d/{settings.hrLaborRules.leaveYearsPerStep}y (Cap: {settings.hrLaborRules.leaveMaxDaysCap}d)
          </span>
          <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold border border-slate-200 dark:border-slate-700">
            Labor Proc 1156/2019
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <LeaveSummaryStats
        totalRequests={requests.length}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        totalEmployees={employees.length}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('Request')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'Request'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span>{t('hr.leaveRequestsTitle')}</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Available')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'Available'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {t('hr.leaveBalance')}
          </button>
        </div>

        {activeTab === 'Request' ? (
          <LeaveRequestsTab
            leaveRequests={requests}
            employees={employees}
            leaveBalances={balances}
            rules={settings.hrLaborRules}
            canApprove={canApprove}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <LeaveAvailableTab
            employees={employees}
            leaveBalances={balances}
            rules={settings.hrLaborRules}
            onRequestLeaveForEmployee={(empId) => {
              setPreselectedEmpId(empId);
              setIsApplyModalOpen(true);
            }}
          />
        )}
      </div>

      <QuickLeaveRequestModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        employees={employees}
        onSubmitLeave={handleAddRequest}
      />
    </div>
  );
};
