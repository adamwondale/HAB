import React from 'react';
import { getModuleModel } from './getModuleModel';
import { SimpleModulePage } from './SimpleModulePage';
import { WorkSitesView } from './WorkSitesView';
import { StoreView } from './StoreView';
import { ModuleId, WorkspaceData } from './types';
import { Deployment, StockItem, StockTransaction } from '../../types/hrm';

interface SimpleWorkspaceProps {
  activeTab: string;
  data: WorkspaceData;
  onDeployEmployee?: (newDeployment: Deployment) => void;
  onRelieveDeployment?: (deploymentId: string) => void;
  onAddStockItem?: (item: StockItem) => void;
  onRecordStockTransaction?: (tx: StockTransaction) => void;
}

function isModuleId(value: string): value is ModuleId {
  return [
    'org',
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
    'master-setup'
  ].includes(value);
}

export function SimpleWorkspace({
  activeTab,
  data,
  onDeployEmployee,
  onRelieveDeployment,
  onAddStockItem,
  onRecordStockTransaction
}: SimpleWorkspaceProps) {
  if (!isModuleId(activeTab)) {
    return null;
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
      <StoreView
        stockItems={data.stockItems}
        stockTransactions={data.stockTransactions}
        onAddItem={onAddStockItem || (() => {})}
        onRecordTransaction={onRecordStockTransaction || (() => {})}
      />
    );
  }

  return <SimpleModulePage model={getModuleModel(activeTab, data)} />;
}
