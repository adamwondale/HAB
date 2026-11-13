import React from 'react';
import { SystemMasterConfig } from '../../types/masterConfig';

interface MasterGradesPenaltiesTabProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterGradesPenaltiesTab: React.FC<MasterGradesPenaltiesTabProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  return (
    <div className="space-y-6">
      {/* Division Salary Grades Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
            Division Base Salary Grades & Allowance Matrix (ETB)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically populates base salary and site/hazard allowances when registering new employees in the Directory.
          </p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Division</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3 text-right">Base Salary (ETB)</th>
                <th className="py-3 px-3 text-right">Site Allow. (ETB)</th>
                <th className="py-3 px-3 text-right">Shift Allow. (ETB)</th>
                <th className="py-3 px-3 text-right">Hazard Allow. (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {masterConfig.divisionGrades.map((dg, idx) => (
                <tr key={dg.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{dg.serviceType}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{dg.grade}</td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number" min={1000} step={100} disabled={!canEditMaster}
                      value={dg.defaultBaseSalary}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          divisionGrades: prev.divisionGrades.map((item, i) => (i === idx ? { ...item, defaultBaseSalary: val } : item))
                        }));
                      }}
                      className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono font-bold tabular-nums text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number" min={0} step={100} disabled={!canEditMaster}
                      value={dg.defaultSiteAllowance}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          divisionGrades: prev.divisionGrades.map((item, i) => (i === idx ? { ...item, defaultSiteAllowance: val } : item))
                        }));
                      }}
                      className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number" min={0} step={100} disabled={!canEditMaster}
                      value={dg.defaultShiftAllowance}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          divisionGrades: prev.divisionGrades.map((item, i) => (i === idx ? { ...item, defaultShiftAllowance: val } : item))
                        }));
                      }}
                      className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number" min={0} step={100} disabled={!canEditMaster}
                      value={dg.defaultHazardAllowance}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          divisionGrades: prev.divisionGrades.map((item, i) => (i === idx ? { ...item, defaultHazardAllowance: val } : item))
                        }));
                      }}
                      className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clearance Gear Penalty Fee Schedule */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
            Clearance Unreturned / Damaged Gear Penalty Schedule (ETB)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Used by the 4-Gate Exit Clearance module to compute automatic salary deductions when issued equipment is marked Damaged or Missing.
          </p>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[580px]">
            <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Gear Category</th>
                <th className="py-3 px-4">Item Match / Rule Scope</th>
                <th className="py-3 px-4 text-right">Damaged Penalty (ETB)</th>
                <th className="py-3 px-4 text-right">Missing / Lost Penalty (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {masterConfig.gearPenalties.map((gp, idx) => (
                <tr key={gp.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{gp.category}</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{gp.itemPattern}</td>
                  <td className="py-2.5 px-4 text-right">
                    <input
                      type="number" min={0} step={25} disabled={!canEditMaster}
                      value={gp.damagedFeeETB}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          gearPenalties: prev.gearPenalties.map((item, i) => (i === idx ? { ...item, damagedFeeETB: val } : item))
                        }));
                      }}
                      className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-amber-700 dark:text-amber-300 font-semibold text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <input
                      type="number" min={0} step={50} disabled={!canEditMaster}
                      value={gp.missingFeeETB}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        applyChange(prev => ({
                          ...prev,
                          gearPenalties: prev.gearPenalties.map((item, i) => (i === idx ? { ...item, missingFeeETB: val } : item))
                        }));
                      }}
                      className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-rose-700 dark:text-rose-300 font-bold text-xs"
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
