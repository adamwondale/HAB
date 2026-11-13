import React from 'react';
import { SystemMasterConfig } from '../../types/masterConfig';

interface MasterShiftsLeaveTabProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterShiftsLeaveTab: React.FC<MasterShiftsLeaveTabProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  return (
    <div className="space-y-6">
      {/* Overtime & Shift Cycle Rules */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
            Overtime Hourly Multipliers & Shift Cycle Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hourly OT Pay = <span className="font-mono">(Base Salary ÷ (Standard Working Days × Daily Hours)) × OT Hours × Multiplier</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Daily Hours</label>
            <input
              type="number" min={1} max={24} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.standardDailyHours}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, standardDailyHours: Math.max(1, Number(e.target.value) || 8) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Regular OT Multiplier (x)</label>
            <input
              type="number" min={1} max={5} step={0.05} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.regularOtMultiplier}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, regularOtMultiplier: Math.max(1, Number(e.target.value) || 1.5) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Night OT Multiplier (x)</label>
            <input
              type="number" min={1} max={5} step={0.05} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.nightOtMultiplier}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, nightOtMultiplier: Math.max(1, Number(e.target.value) || 1.75) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Public Holiday OT (x)</label>
            <input
              type="number" min={1} max={5} step={0.1} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.holidayOtMultiplier}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, holidayOtMultiplier: Math.max(1, Number(e.target.value) || 2.5) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Weekend OT Multiplier (x)</label>
            <input
              type="number" min={1} max={5} step={0.1} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.weekendOtMultiplier}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, weekendOtMultiplier: Math.max(1, Number(e.target.value) || 2.0) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Security Duty Watch (Hours)</label>
            <input
              type="number" min={8} max={48} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.securityDutyHours}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, securityDutyHours: Math.max(8, Number(e.target.value) || 24) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Security Mandatory Rest (Hours)</label>
            <input
              type="number" min={12} max={72} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.securityRestHours}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, securityRestHours: Math.max(12, Number(e.target.value) || 48) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cleaning Swap Cycle (Days)</label>
            <input
              type="number" min={1} max={30} disabled={!canEditMaster}
              value={masterConfig.shiftsAndOvertime.cleaningRotationCycleDays}
              onChange={(e) => applyChange(prev => ({ ...prev, shiftsAndOvertime: { ...prev.shiftsAndOvertime, cleaningRotationCycleDays: Math.max(1, Number(e.target.value) || 7) } }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Leave Entitlement Quotas Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
            Statutory Leave Quotas & Post-Relief Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Controls maximum annual leave days and mandatory relief guard/cleaner assignment in Leave Management.
          </p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[540px]">
            <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4 text-right">Max Allowed Days / Year</th>
                <th className="py-3 px-4 text-right">Paid Salary Rate (%)</th>
                <th className="py-3 px-4 text-center">Requires Relief Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {masterConfig.leaveQuotas.map((quota, idx) => (
                <tr key={quota.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{quota.leaveType}</td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min={1}
                      max={365}
                      disabled={!canEditMaster}
                      value={quota.maxDaysPerYear}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value) || 1);
                        applyChange(prev => ({
                          ...prev,
                          leaveQuotas: prev.leaveQuotas.map((q, i) => (i === idx ? { ...q, maxDaysPerYear: val } : q))
                        }));
                      }}
                      className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono font-bold tabular-nums text-xs"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={!canEditMaster}
                      value={quota.paidPercent}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        applyChange(prev => ({
                          ...prev,
                          leaveQuotas: prev.leaveQuotas.map((q, i) => (i === idx ? { ...q, paidPercent: val } : q))
                        }));
                      }}
                      className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-xs"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      disabled={!canEditMaster}
                      checked={quota.requiresReliefAssignment}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        applyChange(prev => ({
                          ...prev,
                          leaveQuotas: prev.leaveQuotas.map((q, i) => (i === idx ? { ...q, requiresReliefAssignment: checked } : q))
                        }));
                      }}
                      className="w-4 h-4 rounded text-[#0E1525] cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
