import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SystemMasterConfig } from '../../types/masterConfig';
import {
  calculateIncomeTaxFromMaster,
  calculateOvertimePayFromMaster,
  findMatchingTaxBracket
} from '../../utils/masterConfigEngine';

interface MasterFormulaSandboxProps {
  masterConfig: SystemMasterConfig;
}

export const MasterFormulaSandbox: React.FC<MasterFormulaSandboxProps> = ({ masterConfig }) => {
  const [simBaseSalary, setSimBaseSalary] = useState<number>(8500);
  const [simWorkingDays, setSimWorkingDays] = useState<number>(masterConfig.pensionAndPayroll.standardWorkingDays);
  const [simOvertimeHours, setSimOvertimeHours] = useState<number>(8);
  const [simOvertimeTier, setSimOvertimeTier] = useState<'regular' | 'night' | 'weekend' | 'holiday'>('regular');
  const [simIncludeAllowances, setSimIncludeAllowances] = useState<boolean>(true);

  const stdDays = Math.max(1, masterConfig.pensionAndPayroll.standardWorkingDays);
  const clampedSimDays = Math.max(0, Math.min(stdDays, simWorkingDays));
  const simEarnedBase = Math.round((simBaseSalary / stdDays) * clampedSimDays);
  const simTransport = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultTransportAllowance : 0;
  const simMobile = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultMobileAllowance : 0;
  const simHousing = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultHousingAllowance : 0;
  const simFood = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultFoodCostSharing : 0;
  const simOtPay = calculateOvertimePayFromMaster(simBaseSalary, simOvertimeHours, masterConfig, simOvertimeTier);
  const simGross = simEarnedBase + simTransport + simMobile + simHousing + simOtPay;
  const simTaxableTransport = Math.max(0, simTransport - masterConfig.pensionAndPayroll.taxExemptTransportLimit);
  const simTaxableIncome = simEarnedBase + simHousing + simMobile + simOtPay + simTaxableTransport;
  const simMatchedBracket = findMatchingTaxBracket(simTaxableIncome, masterConfig.taxBrackets);
  const simIncomeTax = calculateIncomeTaxFromMaster(simTaxableIncome, masterConfig);
  const simEmpPension = Math.round(simEarnedBase * (masterConfig.pensionAndPayroll.employeePensionPercent / 100));
  const simEmployerPension = Math.round(simEarnedBase * (masterConfig.pensionAndPayroll.employerPensionPercent / 100));
  const simTotalDeductions = simIncomeTax + simEmpPension + simFood;
  const simNetPay = Math.max(0, simGross - simTotalDeductions);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 sticky top-20">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFF9DB] border border-[#EFE1AA] flex items-center justify-center text-[#0E1525]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">Live Formula Sandbox</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Test how your Master Setup calculates pay</p>
          </div>
        </div>
        <span className="text-[11px] font-mono tabular-nums text-slate-500">{stdDays}d Cycle</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Sample Base Salary (ETB)</label>
          <input
            type="number" min={1000} step={500} value={simBaseSalary}
            onChange={(e) => setSimBaseSalary(Math.max(0, Number(e.target.value) || 0))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Attendance Days (of {stdDays})</label>
          <input
            type="number" min={0} max={stdDays} value={simWorkingDays}
            onChange={(e) => setSimWorkingDays(Math.max(0, Number(e.target.value) || 0))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Overtime Hours</label>
          <input
            type="number" min={0} max={120} value={simOvertimeHours}
            onChange={(e) => setSimOvertimeHours(Math.max(0, Number(e.target.value) || 0))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono tabular-nums text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Overtime Rate Tier</label>
          <select
            value={simOvertimeTier}
            onChange={(e) => setSimOvertimeTier(e.target.value as any)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value="regular">Regular ({masterConfig.shiftsAndOvertime.regularOtMultiplier}x)</option>
            <option value="night">Night ({masterConfig.shiftsAndOvertime.nightOtMultiplier}x)</option>
            <option value="weekend">Weekend ({masterConfig.shiftsAndOvertime.weekendOtMultiplier}x)</option>
            <option value="holiday">Holiday ({masterConfig.shiftsAndOvertime.holidayOtMultiplier}x)</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
        <input
          type="checkbox" checked={simIncludeAllowances}
          onChange={(e) => setSimIncludeAllowances(e.target.checked)}
          className="w-3.5 h-3.5 rounded text-[#0E1525]"
        />
        <span>Include Master Default Allowances & Food Sharing</span>
      </label>

      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Earned Basic ({clampedSimDays}/{stdDays}d)</span>
          <span className="font-mono font-semibold tabular-nums">ETB {simEarnedBase.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Default Allowances (T+M+H)</span>
          <span className="font-mono tabular-nums">ETB {(simTransport + simMobile + simHousing).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Overtime Pay ({simOvertimeHours}h)</span>
          <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">+ETB {simOtPay.toLocaleString()}</span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
          <span>Gross Earnings</span>
          <span className="font-mono tabular-nums">ETB {simGross.toLocaleString()}</span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1.5">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300">
            <span>Employer Pension ({masterConfig.pensionAndPayroll.employerPensionPercent}% Non-Ded.)</span>
            <span className="font-mono font-semibold tabular-nums">ETB {simEmployerPension.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Matched Tax Bracket ({simMatchedBracket.ratePercent}%)</span>
            <span className="font-mono tabular-nums">{simMatchedBracket.label}</span>
          </div>
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span>Income Tax Deduction</span>
            <span className="font-mono tabular-nums">-ETB {simIncomeTax.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span>Employee Pension ({masterConfig.pensionAndPayroll.employeePensionPercent}%)</span>
            <span className="font-mono tabular-nums">-ETB {simEmpPension.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span>Food Cost Sharing</span>
            <span className="font-mono tabular-nums">-ETB {simFood.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-slate-300 dark:border-slate-600 pt-2.5 flex items-center justify-between text-sm font-bold text-[#0E1525] dark:text-amber-300">
          <span>Computed Net Pay</span>
          <span className="font-mono tabular-nums">ETB {simNetPay.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
