import React from 'react';
import { SystemMasterConfig } from '../../types/masterConfig';
import { MasterPensionCard } from './MasterPensionCard';
import { MasterTaxBracketsTable } from './MasterTaxBracketsTable';

interface MasterPayrollTaxTabProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterPayrollTaxTab: React.FC<MasterPayrollTaxTabProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  return (
    <div className="space-y-6">
      <MasterPensionCard
        masterConfig={masterConfig}
        canEditMaster={canEditMaster}
        applyChange={applyChange}
      />
      <MasterTaxBracketsTable
        masterConfig={masterConfig}
        canEditMaster={canEditMaster}
        applyChange={applyChange}
      />
    </div>
  );
};
