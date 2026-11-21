import React from 'react';
import { useTranslation } from 'react-i18next';
import { getModuleModel } from './getModuleModel';
import { SimpleModulePage } from './SimpleModulePage';
import { WorkSitesView } from './WorkSitesView';
import { StoreManagementView } from '../StoreManagementView';
import { DivisionManagementView } from '../divisions/DivisionManagementView';
import { PayrollView } from '../PayrollView';
import { AuditTrailView } from '../rbac/AuditTrailView';
import { OnboardingView } from '../OnboardingView';
import { ClearanceView } from '../ClearanceView';
import { AttendanceView } from '../AttendanceView';
import { EmployeeManagementView } from '../EmployeeManagementView';
import { RecruitmentView } from '../RecruitmentView';
import { LeaveManagementView } from '../LeaveManagementView';
import { ModuleId, WorkspaceData } from './types';
import { Deployment, StockItem, StockTransaction, Division, ServiceType, PayrollRecord, Employee, Candidate, OnboardingChecklist, ClearanceRecord, AttendanceStatus, AttendanceRecord } from '../../types/hrm';

interface SimpleWorkspaceProps {
  activeTab: string;
  data: WorkspaceData;
  onDeployEmployee?: (newDeployment: Deployment) => void;
  onRelieveDeployment?: (deploymentId: string) => void;
  onAddStockItem?: (item: StockItem) => void;
  onRecordStockTransaction?: (tx: StockTransaction) => void;
  onAddDivision?: (division: Division) => void;
  onUpdateDivision?: (division: Division) => void;
  onToggleDivisionStatus?: (divisionId: string) => void;
  onReassignEmployeeDivision?: (employeeId: string, targetDivisionName: ServiceType) => void;
  onUpdatePayrollRecord?: (record: PayrollRecord) => void;
  onAddPayrollRecord?: (record: PayrollRecord) => void;
  onApprovePayrollBatch?: () => void;
  onDisbursePayrollBatch?: () => void;
  onAddEmployee?: (newEmp: Employee) => void;
  onAddCandidate?: (newCand: Candidate) => void;
  onToggleOnboardingTask?: (checklistId: string, taskId: string) => void;
  onCompleteOnboarding?: (checklistId: string) => void;
  onEnrollOnboardingChecklist?: (newOnb: OnboardingChecklist) => void;
  onUpdateClearance?: (updated: ClearanceRecord) => void;
  onInitiateClearance?: (newRecord: ClearanceRecord) => void;
  onUpdateAttendanceStatus?: (recordId: string, newStatus: AttendanceStatus, overtimeHours?: number) => void;
  onAddAttendanceRecord?: (record: AttendanceRecord) => void;
}

const VALID_MODULES = new Set(['org', 'divisions', 'recruitment', 'onboarding', 'management', 'deployment', 'attendance', 'leave', 'payroll', 'store', 'transfers', 'experience', 'clearance', 'master-setup', 'audit']);
const isModuleId = (value: string): value is ModuleId => VALID_MODULES.has(value);

export function SimpleWorkspace({
  activeTab,
  data,
  onDeployEmployee,
  onRelieveDeployment,
  onAddStockItem,
  onRecordStockTransaction,
  onAddDivision,
  onUpdateDivision,
  onToggleDivisionStatus,
  onReassignEmployeeDivision,
  onUpdatePayrollRecord,
  onAddPayrollRecord,
  onApprovePayrollBatch,
  onDisbursePayrollBatch,
  onAddEmployee,
  onAddCandidate,
  onToggleOnboardingTask,
  onCompleteOnboarding,
  onEnrollOnboardingChecklist,
  onUpdateClearance,
  onInitiateClearance,
  onUpdateAttendanceStatus,
  onAddAttendanceRecord
}: SimpleWorkspaceProps) {
  const { t } = useTranslation();

  if (!isModuleId(activeTab)) {
    return null;
  }

  if (activeTab === 'payroll') {
    return (
      <PayrollView
        payrollRecords={data.payroll}
        employees={data.employees}
        divisions={data.divisions}
        masterConfig={data.masterConfig}
        attendance={data.attendance}
        leaveRequests={data.leaveRequests}
        onUpdatePayrollRecord={onUpdatePayrollRecord}
        onAddPayrollRecord={onAddPayrollRecord}
        onApproveBatch={onApprovePayrollBatch}
        onDisburseBatch={onDisbursePayrollBatch}
      />
    );
  }

  if (activeTab === 'divisions') {
    return (
      <DivisionManagementView
        divisions={data.divisions || []}
        employees={data.employees}
        onAddDivision={onAddDivision || (() => {})}
        onUpdateDivision={onUpdateDivision || (() => {})}
        onToggleStatus={onToggleDivisionStatus || (() => {})}
        onReassignEmployee={onReassignEmployeeDivision || (() => {})}
      />
    );
  }

  if (activeTab === 'deployment') {
    return (
      <WorkSitesView
        sites={data.sites}
        employees={data.employees}
        deployments={data.deployments}
        onDeployEmployee={onDeployEmployee || (() => {})}
        onRelieveDeployment={onRelieveDeployment}
      />
    );
  }

  if (activeTab === 'store') {
    return (
      <StoreManagementView
        stockItems={data.stockItems}
        stockTransactions={data.stockTransactions}
        employees={data.employees}
        sites={data.sites}
        divisions={data.divisions}
        onAddStockItem={onAddStockItem || (() => {})}
        onRecordTransaction={onRecordStockTransaction || (() => {})}
      />
    );
  }

  if (activeTab === 'onboarding') {
    return (
      <OnboardingView
        onboardingList={data.onboardingList}
        sites={data.sites}
        activeUser={data.managementPersons?.find(p => p.id === 'mgmt-hr-head')}
        candidates={data.candidates}
        onToggleTask={onToggleOnboardingTask || (() => {})}
        onCompleteOnboarding={onCompleteOnboarding || (() => {})}
        onEnrollChecklist={onEnrollOnboardingChecklist}
      />
    );
  }

  if (activeTab === 'audit') {
    return <AuditTrailView />;
  }

  if (activeTab === 'clearance' || activeTab === 'experience') {
    return (
      <ClearanceView
        clearances={data.clearances}
        employees={data.employees}
        activeUser={data.managementPersons?.find(p => p.id === 'mgmt-super-admin')}
        masterConfig={data.masterConfig}
        onUpdateClearance={onUpdateClearance || (() => {})}
        onInitiateClearance={onInitiateClearance || (() => {})}
      />
    );
  }

  if (activeTab === 'attendance') {
    return (
      <AttendanceView
        attendanceRecords={data.attendance}
        sites={data.sites}
        employees={data.employees}
        onUpdateAttendanceStatus={onUpdateAttendanceStatus || (() => {})}
        onAddAttendanceRecord={onAddAttendanceRecord}
      />
    );
  }

  if (activeTab === 'management') {
    return (
      <EmployeeManagementView
        employees={data.employees}
        sites={data.sites}
        activeUser={data.managementPersons?.find(p => p.id === 'mgmt-hr-head')}
        masterConfig={data.masterConfig}
        leaveRequests={data.leaveRequests}
        attendance={data.attendance}
        onAddEmployee={onAddEmployee || (() => {})}
        onInitiateClearanceFromEmployee={() => {}}
        onDeployFromEmployee={() => {}}
      />
    );
  }

  if (activeTab === 'recruitment') {
    return (
      <RecruitmentView
        candidates={data.candidates}
        employees={data.employees}
        onUpdateCandidateStage={(cId, st) => {
          const c = data.candidates.find(x => x.id === cId);
          if (c) c.stage = st;
        }}
        onSendToOnboarding={(cand) => onEnrollOnboardingChecklist?.({
          id: `onb-${Date.now()}`,
          candidateId: cand.id,
          employeeCode: `HAB-NEW-${Date.now().toString().slice(-4)}`,
          fullName: cand.fullName,
          role: cand.targetRole,
          serviceType: cand.targetService,
          progressPercent: 0,
          contractSigned: false,
          targetStartDate: new Date().toISOString().slice(0, 10),
          tasks: []
        })}
        onAddCandidate={onAddCandidate || (() => {})}
      />
    );
  }

  if (activeTab === 'leave') {
    return (
      <LeaveManagementView
        leaveRequests={data.leaveRequests || []}
        employees={data.employees}
        sites={data.sites}
        activeUser={data.managementPersons?.find(p => p.id === 'mgmt-hr-head')}
        onAddLeaveRequest={(req) => data.leaveRequests?.unshift(req)}
        onApproveLeave={(reqId: string) => {
          const req = data.leaveRequests?.find(l => l.id === reqId);
          if (req) req.status = 'Approved';
        }}
        onRejectLeave={(reqId: string) => {
          const req = data.leaveRequests?.find(l => l.id === reqId);
          if (req) req.status = 'Rejected';
        }}
      />
    );
  }

  return (
    <SimpleModulePage
      model={getModuleModel(activeTab, data, t as any)}
    />
  );
}
