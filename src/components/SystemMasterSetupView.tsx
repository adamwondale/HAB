import React, { useState } from 'react';
import {
  Sliders,
  Calculator,
  RefreshCw,
  RotateCcw,
  Lock,
  CheckCircle2,
  Plus,
  Trash2,
  CreditCard,
  Clock,
  ShieldCheck,
  Package,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import {
  ClearanceRecord,
  Employee,
  ManagementPerson,
  PayrollRecord,
  ServiceType,
  StockItem
} from '../types/hrm';
import {
  SystemMasterConfig,
  TaxBracketRule
} from '../types/masterConfig';
import {
  DEFAULT_SYSTEM_MASTER_CONFIG,
  calculateIncomeTaxFromMaster,
  calculateOvertimePayFromMaster,
  findMatchingTaxBracket,
  isSuperAdminUser
} from '../utils/masterConfigEngine';

interface SystemMasterSetupViewProps {
  masterConfig: SystemMasterConfig;
  activeUser?: ManagementPerson;
  managementPersons?: ManagementPerson[];
  payrollRecords: PayrollRecord[];
  clearances: ClearanceRecord[];
  stockItems: StockItem[];
  employees: Employee[];
  onUpdateMasterConfig: (nextConfig: SystemMasterConfig, triggerSync?: boolean) => void;
  onForceSyncAllModules: (configToSync: SystemMasterConfig) => void;
  onSelectActiveUser?: (person: ManagementPerson) => void;
  onNavigateTab?: (tabId: string) => void;
}

type MasterSubTab = 'payroll_tax' | 'shifts_leave' | 'grades_penalties' | 'inventory_rules';

export const SystemMasterSetupView: React.FC<SystemMasterSetupViewProps> = ({
  masterConfig,
  activeUser,
  managementPersons = [],
  payrollRecords,
  clearances,
  stockItems,
  employees,
  onUpdateMasterConfig,
  onForceSyncAllModules,
  onSelectActiveUser,
  onNavigateTab
}) => {
  const canEditMaster = isSuperAdminUser(activeUser);
  const [activeSubTab, setActiveSubTab] = useState<MasterSubTab>('payroll_tax');
  const [syncSuccessBanner, setSyncSuccessBanner] = useState<string | null>(null);

  // Live Sandbox Simulator State
  const [simBaseSalary, setSimBaseSalary] = useState<number>(8500);
  const [simWorkingDays, setSimWorkingDays] = useState<number>(
    masterConfig.pensionAndPayroll.standardWorkingDays
  );
  const [simOvertimeHours, setSimOvertimeHours] = useState<number>(8);
  const [simOvertimeTier, setSimOvertimeTier] = useState<'regular' | 'night' | 'weekend' | 'holiday'>('regular');
  const [simIncludeAllowances, setSimIncludeAllowances] = useState<boolean>(true);

  const applyChange = (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => {
    if (!canEditMaster) return;
    const updated: SystemMasterConfig = {
      ...updater(masterConfig),
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdatedBy: activeUser ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})` : 'Super Admin'
    };
    onUpdateMasterConfig(updated, updated.autoRecalculateOnSave);
  };

  const handleManualSyncAll = () => {
    if (!canEditMaster) return;
    onForceSyncAllModules(masterConfig);
    const activePayrollCount = payrollRecords.filter(p => p.paymentStatus !== 'Disbursed').length;
    const activeClearanceCount = clearances.filter(c => c.status === 'In Progress').length;
    setSyncSuccessBanner(
      `Synchronized Master Setup v${masterConfig.version}: Recalculated ${activePayrollCount} active payroll sheets, ${activeClearanceCount} in-progress exit clearances, and ${stockItems.length} warehouse stock thresholds.`
    );
    setTimeout(() => setSyncSuccessBanner(null), 6000);
  };

  const handleResetDefaults = () => {
    if (!canEditMaster) return;
    const resetConfig: SystemMasterConfig = {
      ...DEFAULT_SYSTEM_MASTER_CONFIG,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdatedBy: activeUser ? `${activeUser.name} (Reset Statutory Baseline)` : 'Super Admin'
    };
    onUpdateMasterConfig(resetConfig, true);
    setSyncSuccessBanner('Restored statutory baseline defaults and recalculated all active ERP modules.');
    setTimeout(() => setSyncSuccessBanner(null), 5000);
  };

  // Live Sandbox Calculations using current masterConfig
  const stdDays = Math.max(1, masterConfig.pensionAndPayroll.standardWorkingDays);
  const clampedSimDays = Math.max(0, Math.min(stdDays, simWorkingDays));
  const simEarnedBase = Math.round((simBaseSalary / stdDays) * clampedSimDays);
  const simTransport = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultTransportAllowance : 0;
  const simMobile = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultMobileAllowance : 0;
  const simHousing = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultHousingAllowance : 0;
  const simFood = simIncludeAllowances ? masterConfig.pensionAndPayroll.defaultFoodCostSharing : 0;
  const simOtPay = calculateOvertimePayFromMaster(
    simBaseSalary,
    simOvertimeHours,
    masterConfig,
    simOvertimeTier
  );
  const simGross = simEarnedBase + simTransport + simMobile + simHousing + simOtPay;
  const simTaxableTransport = Math.max(
    0,
    simTransport - masterConfig.pensionAndPayroll.taxExemptTransportLimit
  );
  const simTaxableIncome = simEarnedBase + simHousing + simMobile + simOtPay + simTaxableTransport;
  const simMatchedBracket = findMatchingTaxBracket(simTaxableIncome, masterConfig.taxBrackets);
  const simIncomeTax = calculateIncomeTaxFromMaster(simTaxableIncome, masterConfig);
  const simEmpPension = Math.round(
    simEarnedBase * (masterConfig.pensionAndPayroll.employeePensionPercent / 100)
  );
  const simEmployerPension = Math.round(
    simEarnedBase * (masterConfig.pensionAndPayroll.employerPensionPercent / 100)
  );
  const simTotalDeductions = simIncomeTax + simEmpPension + simFood;
  const simNetPay = Math.max(0, simGross - simTotalDeductions);

  const superAdminPerson =
    managementPersons.find(p => p.id === 'mgmt-ceo' || p.id === 'mgmt-hr-head' || p.id === 'mgmt-gm') ||
    managementPersons[0];

  return (
    <div className="space-y-6">
      {/* Top Authority & Control Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-[#0E1525] dark:text-amber-300">
              System Master Setup & Calculation Engine
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">v{masterConfig.version}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {masterConfig.lastUpdatedAt} by {masterConfig.lastUpdatedBy}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0E1525] dark:text-slate-100 mt-1">
            Super Admin Statutory & Operational Master Parameters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Configure the single source of truth for progressive income tax brackets, employer/employee pension rates, standard monthly working days, overtime multipliers, leave quotas, division salary grades, and unreturned gear penalties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {canEditMaster ? (
            <>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFF9DB] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 text-xs font-semibold text-[#0E1525] dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={masterConfig.autoRecalculateOnSave}
                  onChange={(e) =>
                    applyChange(prev => ({
                      ...prev,
                      autoRecalculateOnSave: e.target.checked
                    }))
                  }
                  className="w-3.5 h-3.5 rounded text-[#0E1525] focus:ring-0 cursor-pointer"
                />
                <span>Auto-Recalculate Live ERP</span>
              </label>

              <button
                type="button"
                onClick={handleManualSyncAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#EBE834]" />
                <span>Recalculate & Sync All Modules</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Restore statutory defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Read-Only Audit Mode ({activeUser?.title.split('(')[0].trim()})</span>
              </div>
              {onSelectActiveUser && superAdminPerson && (
                <button
                  type="button"
                  onClick={() => onSelectActiveUser(superAdminPerson)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#EBE834]" />
                  <span>Switch to Super Admin to Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Banner after Sync */}
      {syncSuccessBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{syncSuccessBanner}</span>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('payroll')}
              className="inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 hover:underline shrink-0"
            >
              <span>Inspect Payroll Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 4 Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Standard Cycle & Pension</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">
            {masterConfig.pensionAndPayroll.standardWorkingDays}d · {masterConfig.pensionAndPayroll.employerPensionPercent}% / {masterConfig.pensionAndPayroll.employeePensionPercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Full month · Employer / Employee Pension
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Progressive Tax Tiers</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">
            {masterConfig.taxBrackets.length} Brackets (0%–{Math.max(...masterConfig.taxBrackets.map(b => b.ratePercent))}%)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Governs {payrollRecords.length} active workforce payslips
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Overtime Multipliers</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">
            {masterConfig.shiftsAndOvertime.regularOtMultiplier}x · {masterConfig.shiftsAndOvertime.nightOtMultiplier}x · {masterConfig.shiftsAndOvertime.holidayOtMultiplier}x
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Regular · Night · Public Holiday rates
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Salary Grades & Penalty Rules</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">
            {masterConfig.divisionGrades.length} Grades · {masterConfig.gearPenalties.length} Gear Rules
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Governs {employees.length} staff & {clearances.length} clearances
          </div>
        </div>
      </div>

      {/* Segmented Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FFF9DB] dark:bg-slate-900 border border-[#EFE1AA] dark:border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveSubTab('payroll_tax')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'payroll_tax'
              ? 'bg-[#0E1525] text-[#FFF9DB] shadow-xs'
              : 'text-[#0E1525]/80 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>1. Payroll, Tax & Pension</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shifts_leave')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'shifts_leave'
              ? 'bg-[#0E1525] text-[#FFF9DB] shadow-xs'
              : 'text-[#0E1525]/80 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>2. Shifts, Overtime & Leave Quotas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('grades_penalties')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'grades_penalties'
              ? 'bg-[#0E1525] text-[#FFF9DB] shadow-xs'
              : 'text-[#0E1525]/80 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Division Salary Grades & Gear Penalties</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('inventory_rules')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'inventory_rules'
              ? 'bg-[#0E1525] text-[#FFF9DB] shadow-xs'
              : 'text-[#0E1525]/80 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>4. Warehouse & System Thresholds</span>
        </button>
      </div>

      {/* Main Split Grid: Left (8 cols) Active Rule Editor + Right (4 cols) Live Formula Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Domain Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: PAYROLL, TAX & PENSION */}
          {activeSubTab === 'payroll_tax' && (
            <>
              {/* Pension, Working Days & Allowances Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
                      Statutory Pension, Working Days & Monthly Allowance Defaults
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Directly drives the 30-Day Payroll Sheet denominator, pension contributions, and new employee payroll entries.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Standard Full Working Days
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.standardWorkingDays}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            standardWorkingDays: Math.max(1, Number(e.target.value) || 30)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Employer Pension (%)
                    </label>
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
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            employerPensionPercent: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Employee Pension (%)
                    </label>
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
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            employeePensionPercent: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-rose-700 dark:text-rose-300 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tax-Exempt Transport Cap (ETB)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.taxExemptTransportLimit}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            taxExemptTransportLimit: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Transport Allowance (ETB)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.defaultTransportAllowance}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            defaultTransportAllowance: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Mobile Card (ETB)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.defaultMobileAllowance}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            defaultMobileAllowance: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Housing Allowance (ETB)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.defaultHousingAllowance}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            defaultHousingAllowance: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Food Cost Sharing (ETB)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      disabled={!canEditMaster}
                      value={masterConfig.pensionAndPayroll.defaultFoodCostSharing}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          pensionAndPayroll: {
                            ...prev.pensionAndPayroll,
                            defaultFoodCostSharing: Math.max(0, Number(e.target.value) || 0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums text-slate-900 dark:text-slate-100 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Progressive Income Tax Brackets Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
                      Ethiopian Progressive Income Tax Brackets (ETB)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Formula: <span className="font-mono">Tax = (Taxable Income × Rate%) − Deduction Constant</span>
                    </p>
                  </div>

                  {canEditMaster && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBracket: TaxBracketRule = {
                          id: `tax-${Date.now()}`,
                          label: `Bracket ${masterConfig.taxBrackets.length + 1}`,
                          minIncome: 15000,
                          maxIncome: null,
                          ratePercent: 35,
                          deductionConstant: 1500
                        };
                        applyChange(prev => ({
                          ...prev,
                          taxBrackets: [...prev.taxBrackets, newBracket]
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold hover:bg-[#19233C] transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBE834]" />
                      <span>Add Tax Bracket</span>
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead className="bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-slate-100 border-b border-amber-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Bracket Label</th>
                        <th className="py-3 px-3 text-right">Min Income (ETB)</th>
                        <th className="py-3 px-3 text-right">Max Income (ETB)</th>
                        <th className="py-3 px-3 text-right">Tax Rate (%)</th>
                        <th className="py-3 px-3 text-right">Deduction Constant (ETB)</th>
                        {canEditMaster && <th className="py-3 px-3 text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {masterConfig.taxBrackets.map((bracket, idx) => (
                        <tr key={bracket.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              disabled={!canEditMaster}
                              value={bracket.label}
                              onChange={(e) => {
                                const val = e.target.value;
                                applyChange(prev => ({
                                  ...prev,
                                  taxBrackets: prev.taxBrackets.map((b, i) =>
                                    i === idx ? { ...b, label: val } : b
                                  )
                                }));
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-medium text-slate-900 dark:text-slate-100 disabled:opacity-60"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              disabled={!canEditMaster}
                              value={bracket.minIncome}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  taxBrackets: prev.taxBrackets.map((b, i) =>
                                    i === idx ? { ...b, minIncome: val } : b
                                  )
                                }));
                              }}
                              className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              placeholder="No Limit"
                              disabled={!canEditMaster}
                              value={bracket.maxIncome === null ? '' : bracket.maxIncome}
                              onChange={(e) => {
                                const raw = e.target.value.trim();
                                const val = raw === '' ? null : Math.max(0, Number(raw) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  taxBrackets: prev.taxBrackets.map((b, i) =>
                                    i === idx ? { ...b, maxIncome: val } : b
                                  )
                                }));
                              }}
                              className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              disabled={!canEditMaster}
                              value={bracket.ratePercent}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                                applyChange(prev => ({
                                  ...prev,
                                  taxBrackets: prev.taxBrackets.map((b, i) =>
                                    i === idx ? { ...b, ratePercent: val } : b
                                  )
                                }));
                              }}
                              className="w-20 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono font-bold tabular-nums text-xs text-rose-700 dark:text-rose-300 disabled:opacity-60"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              step={0.5}
                              disabled={!canEditMaster}
                              value={bracket.deductionConstant}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  taxBrackets: prev.taxBrackets.map((b, i) =>
                                    i === idx ? { ...b, deductionConstant: val } : b
                                  )
                                }));
                              }}
                              className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                            />
                          </td>
                          {canEditMaster && (
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                disabled={masterConfig.taxBrackets.length <= 1}
                                onClick={() =>
                                  applyChange(prev => ({
                                    ...prev,
                                    taxBrackets: prev.taxBrackets.filter((_, i) => i !== idx)
                                  }))
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                                title="Delete tax bracket"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SHIFTS, OVERTIME & LEAVE QUOTAS */}
          {activeSubTab === 'shifts_leave' && (
            <>
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
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Standard Daily Hours
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.standardDailyHours}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            standardDailyHours: Math.max(1, Number(e.target.value) || 8)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Regular OT Multiplier (x)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.05}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.regularOtMultiplier}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            regularOtMultiplier: Math.max(1, Number(e.target.value) || 1.5)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Night OT Multiplier (x)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.05}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.nightOtMultiplier}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            nightOtMultiplier: Math.max(1, Number(e.target.value) || 1.75)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Public Holiday OT (x)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.holidayOtMultiplier}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            holidayOtMultiplier: Math.max(1, Number(e.target.value) || 2.5)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Weekend OT Multiplier (x)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.weekendOtMultiplier}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            weekendOtMultiplier: Math.max(1, Number(e.target.value) || 2.0)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Security Duty Watch (Hours)
                    </label>
                    <input
                      type="number"
                      min={8}
                      max={48}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.securityDutyHours}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            securityDutyHours: Math.max(8, Number(e.target.value) || 24)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Security Mandatory Rest (Hours)
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={72}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.securityRestHours}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            securityRestHours: Math.max(12, Number(e.target.value) || 48)
                          }
                        }))
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cleaning Shift Swap Cycle (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      disabled={!canEditMaster}
                      value={masterConfig.shiftsAndOvertime.cleaningRotationCycleDays}
                      onChange={(e) =>
                        applyChange(prev => ({
                          ...prev,
                          shiftsAndOvertime: {
                            ...prev.shiftsAndOvertime,
                            cleaningRotationCycleDays: Math.max(1, Number(e.target.value) || 7)
                          }
                        }))
                      }
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
                    <thead className="bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-slate-100 border-b border-amber-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
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
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            {quota.leaveType}
                          </td>
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
                                  leaveQuotas: prev.leaveQuotas.map((q, i) =>
                                    i === idx ? { ...q, maxDaysPerYear: val } : q
                                  )
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
                                  leaveQuotas: prev.leaveQuotas.map((q, i) =>
                                    i === idx ? { ...q, paidPercent: val } : q
                                  )
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
                                  leaveQuotas: prev.leaveQuotas.map((q, i) =>
                                    i === idx ? { ...q, requiresReliefAssignment: checked } : q
                                  )
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
            </>
          )}

          {/* TAB 3: SALARY GRADES & GEAR PENALTIES */}
          {activeSubTab === 'grades_penalties' && (
            <>
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
                    <thead className="bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-slate-100 border-b border-amber-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
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
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {dg.serviceType}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                            {dg.grade}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={1000}
                              step={100}
                              disabled={!canEditMaster}
                              value={dg.defaultBaseSalary}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  divisionGrades: prev.divisionGrades.map((item, i) =>
                                    i === idx ? { ...item, defaultBaseSalary: val } : item
                                  )
                                }));
                              }}
                              className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono font-bold tabular-nums text-xs"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              step={100}
                              disabled={!canEditMaster}
                              value={dg.defaultSiteAllowance}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  divisionGrades: prev.divisionGrades.map((item, i) =>
                                    i === idx ? { ...item, defaultSiteAllowance: val } : item
                                  )
                                }));
                              }}
                              className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              step={100}
                              disabled={!canEditMaster}
                              value={dg.defaultShiftAllowance}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  divisionGrades: prev.divisionGrades.map((item, i) =>
                                    i === idx ? { ...item, defaultShiftAllowance: val } : item
                                  )
                                }));
                              }}
                              className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              step={100}
                              disabled={!canEditMaster}
                              value={dg.defaultHazardAllowance}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  divisionGrades: prev.divisionGrades.map((item, i) =>
                                    i === idx ? { ...item, defaultHazardAllowance: val } : item
                                  )
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
                    <thead className="bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-slate-100 border-b border-amber-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
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
                          <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {gp.category}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                            {gp.itemPattern}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <input
                              type="number"
                              min={0}
                              step={25}
                              disabled={!canEditMaster}
                              value={gp.damagedFeeETB}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  gearPenalties: prev.gearPenalties.map((item, i) =>
                                    i === idx ? { ...item, damagedFeeETB: val } : item
                                  )
                                }));
                              }}
                              className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-amber-700 dark:text-amber-300 font-semibold text-xs"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <input
                              type="number"
                              min={0}
                              step={50}
                              disabled={!canEditMaster}
                              value={gp.missingFeeETB}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                applyChange(prev => ({
                                  ...prev,
                                  gearPenalties: prev.gearPenalties.map((item, i) =>
                                    i === idx ? { ...item, missingFeeETB: val } : item
                                  )
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
            </>
          )}

          {/* TAB 4: INVENTORY & SYSTEM THRESHOLDS */}
          {activeSubTab === 'inventory_rules' && (
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
                  <thead className="bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-slate-100 border-b border-amber-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
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
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {rule.category}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            min={1}
                            max={500}
                            disabled={!canEditMaster}
                            value={rule.defaultMinReorderLevel}
                            onChange={(e) => {
                              const val = Math.max(1, Number(e.target.value) || 10);
                              applyChange(prev => ({
                                ...prev,
                                inventoryThresholds: prev.inventoryThresholds.map((r, i) =>
                                  i === idx ? { ...r, defaultMinReorderLevel: val } : r
                                )
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
                            value={rule.safetyBufferPercent}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              applyChange(prev => ({
                                ...prev,
                                inventoryThresholds: prev.inventoryThresholds.map((r, i) =>
                                  i === idx ? { ...r, safetyBufferPercent: val } : r
                                )
                              }));
                            }}
                            className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 font-mono tabular-nums text-xs"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            min={7}
                            max={180}
                            disabled={!canEditMaster}
                            value={rule.contractWarningDays}
                            onChange={(e) => {
                              const val = Math.max(7, Number(e.target.value) || 30);
                              applyChange(prev => ({
                                ...prev,
                                inventoryThresholds: prev.inventoryThresholds.map((r, i) =>
                                  i === idx ? { ...r, contractWarningDays: val } : r
                                )
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
          )}
        </div>

        {/* Right Column (4 cols): Live Formula Sandbox & Real-Time Payslip Tester */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF9DB] border border-[#EFE1AA] flex items-center justify-center text-[#0E1525]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
                    Live Formula Sandbox
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Test how your Master Setup calculates pay
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono tabular-nums text-slate-500">
                {stdDays}d Cycle
              </span>
            </div>

            {/* Simulator Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Sample Base Salary (ETB)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={simBaseSalary}
                  onChange={(e) => setSimBaseSalary(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Attendance Days (of {stdDays})
                </label>
                <input
                  type="number"
                  min={0}
                  max={stdDays}
                  value={simWorkingDays}
                  onChange={(e) => setSimWorkingDays(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Overtime Hours
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={simOvertimeHours}
                  onChange={(e) => setSimOvertimeHours(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Overtime Rate Tier
                </label>
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
                type="checkbox"
                checked={simIncludeAllowances}
                onChange={(e) => setSimIncludeAllowances(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#0E1525]"
              />
              <span>Include Master Default Allowances & Food Sharing</span>
            </label>

            {/* Live Computed Breakdown */}
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
                <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  +ETB {simOtPay.toLocaleString()}
                </span>
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
        </div>
      </div>
    </div>
  );
};
