import React from 'react';
import { getModuleModel } from './getModuleModel';
import { SimpleModulePage } from './SimpleModulePage';
import { WorkSitesView } from './WorkSitesView';
import { StoreManagementView } from '../StoreManagementView';
import { DivisionManagementView } from '../divisions/DivisionManagementView';
import { PayrollView } from '../PayrollView';
import { AuditTrailView } from '../rbac/AuditTrailView';
import { ModuleId, WorkspaceData } from './types';
import { Deployment, StockItem, StockTransaction, Division, ServiceType, PayrollRecord } from '../../types/hrm';

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
  onDisbursePayrollBatch
}: SimpleWorkspaceProps) {
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

  if (activeTab === 'audit') {
    return <AuditTrailView />;
  }

  return <SimpleModulePage model={getModuleModel(activeTab, data)} />;
}
