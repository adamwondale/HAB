import React from 'react';
import { SystemMasterConfig } from '../../types/masterConfig';

interface MasterInventoryTabProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterInventoryTab: React.FC<MasterInventoryTabProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
          Warehouse Reorder Thresholds & Contract Alert Lead Times
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Determines when the Central Store and HAB Routine Copilot flag low-stock operational risks across divisions.
        </p>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[560px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Store Inventory Category</th>
              <th className="py-3 px-4 text-right">Min Reorder Threshold (Units)</th>
              <th className="py-3 px-4 text-right">Safety Buffer (%)</th>
              <th className="py-3 px-4 text-right">Contract Warning Lead (Days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {masterConfig.inventoryThresholds.map((rule, idx) => (
              <tr key={rule.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{rule.category}</td>
                <td className="py-3 px-4 text-right">
                  <input
                    type="number" min={1} max={500} disabled={!canEditMaster}
                    value={rule.defaultMinReorderLevel}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value) || 10);
                      applyChange(prev => ({
                        ...prev,
                        inventoryThresholds: prev.inventoryThresholds.map((r, i) => (i === idx ? { ...r, defaultMinReorderLevel: val } : r))
                      }));
                    }}
                    className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono font-bold tabular-nums text-xs"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <input
                    type="number" min={0} max={100} disabled={!canEditMaster}
                    value={rule.safetyBufferPercent}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      applyChange(prev => ({
                        ...prev,
                        inventoryThresholds: prev.inventoryThresholds.map((r, i) => (i === idx ? { ...r, safetyBufferPercent: val } : r))
                      }));
                    }}
                    className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-xs"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <input
                    type="number" min={7} max={180} disabled={!canEditMaster}
                    value={rule.contractWarningDays}
                    onChange={(e) => {
                      const val = Math.max(7, Number(e.target.value) || 30);
                      applyChange(prev => ({
                        ...prev,
                        inventoryThresholds: prev.inventoryThresholds.map((r, i) => (i === idx ? { ...r, contractWarningDays: val } : r))
                      }));
                    }}
                    className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
