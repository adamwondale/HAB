import React, { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { getModuleModel } from './getModuleModel';
import { SimpleModulePage } from './SimpleModulePage';
import { WorkSitesView } from './WorkSitesView';
import { StoreManagementView } from '../StoreManagementView';
import { DivisionManagementView } from '../divisions/DivisionManagementView';
import { PayrollView } from '../PayrollView';
import { AuditTrailView } from '../rbac/AuditTrailView';
import { OnboardingView } from '../OnboardingView';
import { AddEmployeeModal } from '../hr/AddEmployeeModal';
import { NewApplicantModal } from '../recruitment/NewApplicantModal';
import { ModuleId, WorkspaceData } from './types';
import { Deployment, StockItem, StockTransaction, Division, ServiceType, PayrollRecord, Employee, Candidate, OnboardingChecklist } from '../../types/hrm';

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
}

function isModuleId(value: string): value is ModuleId {
  return [
    'org',
    'divisions',
    'recruitment',
    'onboarding',
    'management',
    'deployment',
    'attendance',
    'leave',
    'payroll',
    'store',
    'transfers',
    'experience',
    'clearance',
    'master-setup',
    'audit'
  ].includes(value);
}

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
  onEnrollOnboardingChecklist
}: SimpleWorkspaceProps) {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

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

  const mainAction =
    activeTab === 'management' && onAddEmployee
      ? {
          label: 'Add Employee',
          onClick: () => setIsAddEmployeeOpen(true),
          icon: <Plus className="h-4 w-4" />
        }
      : activeTab === 'recruitment' && onAddCandidate
      ? {
          label: 'New Applicant',
          onClick: () => setIsAddCandidateOpen(true),
          icon: <UserPlus className="h-4 w-4" />
        }
      : undefined;

  return (
    <>
      <SimpleModulePage
        model={getModuleModel(activeTab, data)}
        mainAction={mainAction}
      />

      {isAddEmployeeOpen && onAddEmployee && (
        <AddEmployeeModal
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
          onAddEmployee={onAddEmployee}
          existingCount={data.employees.length}
          masterConfig={data.masterConfig}
        />
      )}

      {isAddCandidateOpen && onAddCandidate && (
        <NewApplicantModal
          isOpen={isAddCandidateOpen}
          onClose={() => setIsAddCandidateOpen(false)}
          onAddCandidate={onAddCandidate}
          existingCount={data.candidates.length}
        />
      )}
    </>
  );
}
