import React, { useState, useEffect } from 'react';
import {
  Employee,
  ClientSite,
  Deployment,
  ClearanceRecord,
  AttendanceRecord,
  LeaveRequest,
  OnboardingChecklist,
  PayrollRecord,
  Candidate,
  TransferPromotionRecord,
  WorkExperienceRecord,
  StockItem,
  StockTransaction,
  ManagementPerson
} from '../../types/hrm';
import { Division } from '../../types/division';
import { logAuditEvent } from '../../utils/auditLogger';
import { AdminPerspectiveSwitcher, DashboardPerspective } from './AdminPerspectiveSwitcher';
import { AdminMasterDashboard } from './roles/AdminMasterDashboard';
import { HrDashboard } from './roles/HrDashboard';
import { FinanceDashboard } from './roles/FinanceDashboard';
import { StoreDashboard } from './roles/StoreDashboard';
import { OperationsDashboard } from './roles/OperationsDashboard';

export interface DashboardRouterProps {
  employees: Employee[];
  sites: ClientSite[];
  deployments: Deployment[];
  clearances: ClearanceRecord[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onboardingList: OnboardingChecklist[];
  payroll?: PayrollRecord[];
  candidates?: Candidate[];
  transfers?: TransferPromotionRecord[];
  workExperiences?: WorkExperienceRecord[];
  stockItems?: StockItem[];
  stockTransactions?: StockTransaction[];
  divisions?: Division[];
  activeUser?: ManagementPerson;
  onNavigateTab: (tabId: string) => void;
  onUpdateClearance?: (updated: ClearanceRecord) => void;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({
  employees,
  sites,
  deployments,
  clearances,
  attendance,
  leaveRequests,
  onboardingList,
  payroll = [],
  candidates = [],
  stockItems = [],
  stockTransactions = [],
  divisions,
  activeUser,
  onNavigateTab,
  onUpdateClearance
}) => {
  const isSuperOrExec =
    activeUser?.role === 'super_admin' ||
    activeUser?.role === 'executive' ||
    activeUser?.id === 'mgmt-super-admin' ||
    activeUser?.id === 'mgmt-executive-ceo';

  const getDefaultPerspective = (): DashboardPerspective => {
    if (isSuperOrExec) return 'master';
    if (activeUser?.role === 'hr' || activeUser?.id.includes('hr')) return 'hr';
    if (activeUser?.role === 'finance' || activeUser?.id.includes('finance')) return 'finance';
    if (activeUser?.role === 'store' || activeUser?.id.includes('store')) return 'store';
    if (activeUser?.role === 'operations' || activeUser?.role === 'tech' || activeUser?.id.includes('ops') || activeUser?.id.includes('tech')) {
      return 'operations';
    }
    return 'master';
  };

  const [activePerspective, setActivePerspective] = useState<DashboardPerspective>(getDefaultPerspective);

  useEffect(() => {
    setActivePerspective(getDefaultPerspective());
  }, [activeUser?.id, activeUser?.role]);

  const effectivePerspective: DashboardPerspective = isSuperOrExec ? activePerspective : getDefaultPerspective();

  const handleClearanceAdjustment = (updated: ClearanceRecord) => {
    onUpdateClearance?.(updated);
    if (isSuperOrExec) {
      logAuditEvent({
        actorId: activeUser?.id || 'mgmt-super-admin',
        actorName: activeUser?.name || 'Super Admin',
        actorRole: activeUser?.role || 'super_admin',
        action: 'CLEARANCE_STAGE_TRANSITION',
        targetModule: 'Clearance',
        targetId: updated.id,
        details: `Super Admin in-place clearance transition for ${updated.employeeName} to ${updated.stage || updated.status}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Perspective Switcher for Leadership */}
      {isSuperOrExec && (
        <AdminPerspectiveSwitcher
          activePerspective={effectivePerspective}
          onSelectPerspective={setActivePerspective}
        />
      )}

      {/* Role Cockpit Views */}
      {effectivePerspective === 'master' && (
        <AdminMasterDashboard
          employees={employees}
          sites={sites}
          payroll={payroll}
          stockItems={stockItems}
          clearances={clearances}
          leaveRequests={leaveRequests}
          onboardingList={onboardingList}
          divisions={divisions}
          candidates={candidates}
          onNavigateTab={onNavigateTab}
        />
      )}

      {effectivePerspective === 'hr' && (
        <HrDashboard
          employees={employees}
          candidates={candidates}
          leaveRequests={leaveRequests}
          clearances={clearances}
          onboardingList={onboardingList}
          payroll={payroll}
          divisions={divisions}
          onNavigateTab={onNavigateTab}
        />
      )}

      {effectivePerspective === 'finance' && (
        <FinanceDashboard
          payroll={payroll}
          employees={employees}
          stockItems={stockItems}
          onNavigateTab={onNavigateTab}
        />
      )}

      {effectivePerspective === 'store' && (
        <StoreDashboard
          stockItems={stockItems}
          stockTransactions={stockTransactions}
          sites={sites}
          employees={employees}
          onNavigateTab={onNavigateTab}
        />
      )}

      {effectivePerspective === 'operations' && (
        <OperationsDashboard
          sites={sites}
          deployments={deployments}
          attendance={attendance}
          employees={employees}
          stockItems={stockItems}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};
