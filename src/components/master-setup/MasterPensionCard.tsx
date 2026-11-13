import React from 'react';
import { SystemMasterConfig } from '../../types/masterConfig';

interface MasterPensionCardProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterPensionCard: React.FC<MasterPensionCardProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
          Statutory Pension, Working Days & Monthly Allowance Defaults
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Directly drives the 30-Day Payroll Sheet denominator, pension contributions, and new employee payroll entries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Full Working Days</label>
          <input
            type="number"
            min={1}
            max={31}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.standardWorkingDays}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, standardWorkingDays: Math.max(1, Number(e.target.value) || 30) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Employer Pension (%)</label>
          <input
            type="number"
            min={0}
            max={30}
            step={0.5}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.employerPensionPercent}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, employerPensionPercent: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee Pension (%)</label>
          <input
            type="number"
            min={0}
            max={25}
            step={0.5}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.employeePensionPercent}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, employeePensionPercent: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-rose-700 dark:text-rose-300 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax-Exempt Transport Cap (ETB)</label>
          <input
            type="number"
            min={0}
            step={100}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.taxExemptTransportLimit}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, taxExemptTransportLimit: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Transport Allowance (ETB)</label>
          <input
            type="number"
            min={0}
            step={100}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.defaultTransportAllowance}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, defaultTransportAllowance: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Mobile Card (ETB)</label>
          <input
            type="number"
            min={0}
            step={50}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.defaultMobileAllowance}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, defaultMobileAllowance: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Housing Allowance (ETB)</label>
          <input
            type="number"
            min={0}
            step={100}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.defaultHousingAllowance}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, defaultHousingAllowance: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Food Cost Sharing (ETB)</label>
          <input
            type="number"
            min={0}
            step={50}
            disabled={!canEditMaster}
            value={masterConfig.pensionAndPayroll.defaultFoodCostSharing}
            onChange={(e) =>
              applyChange(prev => ({
                ...prev,
                pensionAndPayroll: { ...prev.pensionAndPayroll, defaultFoodCostSharing: Math.max(0, Number(e.target.value) || 0) }
              }))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
};
