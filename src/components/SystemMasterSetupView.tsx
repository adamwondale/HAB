import React, { useState } from 'react';
import { RefreshCw, RotateCcw, Lock, CheckCircle2, CreditCard, Clock, ShieldCheck, Package, ArrowRight, UserCheck, KeyRound, Sliders } from 'lucide-react';
import { ClearanceRecord, Employee, ManagementPerson, PayrollRecord, StockItem } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { DEFAULT_SYSTEM_MASTER_CONFIG, isSuperAdminUser } from '../utils/masterConfigEngine';
import { MasterPayrollTaxTab } from './master-setup/MasterPayrollTaxTab';
import { MasterShiftsLeaveTab } from './master-setup/MasterShiftsLeaveTab';
import { MasterGradesPenaltiesTab } from './master-setup/MasterGradesPenaltiesTab';
import { MasterInventoryTab } from './master-setup/MasterInventoryTab';
import { MasterFormulaSandbox } from './master-setup/MasterFormulaSandbox';
import { UserCredentialManager } from './UserCredentialManager';
import { HrRulesConfigCard } from './hr/HrRulesConfigCard';

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

type MasterSubTab = 'payroll_tax' | 'shifts_leave' | 'grades_penalties' | 'inventory_rules' | 'user_credentials' | 'hr_rules';

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
    const activePayroll = payrollRecords.filter(p => p.paymentStatus !== 'Disbursed').length;
    const activeClearance = clearances.filter(c => c.status === 'In Progress').length;
    setSyncSuccessBanner(`Synchronized Master Setup v${masterConfig.version}: Recalculated ${activePayroll} active payroll sheets, ${activeClearance} in-progress clearances, and ${stockItems.length} warehouse thresholds.`);
    setTimeout(() => setSyncSuccessBanner(null), 6000);
  };

  const handleResetDefaults = () => {
    if (!canEditMaster) return;
    const resetConfig: SystemMasterConfig = {
      ...DEFAULT_SYSTEM_MASTER_CONFIG,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdatedBy: activeUser ? `${activeUser.name} (Reset Baseline)` : 'Super Admin'
    };
    onUpdateMasterConfig(resetConfig, true);
    setSyncSuccessBanner('Restored statutory baseline defaults and recalculated active ERP modules.');
    setTimeout(() => setSyncSuccessBanner(null), 5000);
  };

  const superAdminPerson = managementPersons.find(p => p.id === 'admin' || p.role === 'super_admin' || p.id === 'mgmt-ceo') || managementPersons[0];

  return (
    <div className="space-y-6">
      {/* Top Authority & Control Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-[#0E1525] dark:text-amber-300">System Master Setup & Calculation Engine</span>
            <span>·</span>
            <span className="font-mono tabular-nums">v{masterConfig.version}</span>
            <span>·</span>
            <span>Updated {masterConfig.lastUpdatedAt} by {masterConfig.lastUpdatedBy}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0E1525] dark:text-slate-100 mt-1">Super Admin Statutory & Operational Master Parameters</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">Configure single source of truth for progressive income tax, pension rates, working days, overtime, salary grades, and user credentials.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {canEditMaster ? (
            <>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFF9DB] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 text-xs font-semibold text-[#0E1525] dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox" checked={masterConfig.autoRecalculateOnSave}
                  onChange={(e) => applyChange(prev => ({ ...prev, autoRecalculateOnSave: e.target.checked }))}
                  className="w-3.5 h-3.5 rounded text-[#0E1525] cursor-pointer"
                />
                <span>Auto-Recalculate Live ERP</span>
              </label>
              <button type="button" onClick={handleManualSyncAll} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-xs font-semibold transition-colors cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5 text-[#EBE834]" />
                <span>Recalculate & Sync All Modules</span>
              </button>
              <button type="button" onClick={handleResetDefaults} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer" title="Restore statutory defaults">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Read-Only Audit Mode ({activeUser?.title.split('(')[0].trim()})</span>
              </div>
              {onSelectActiveUser && superAdminPerson && (
                <button type="button" onClick={() => onSelectActiveUser(superAdminPerson)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-xs font-semibold transition-colors cursor-pointer">
                  <UserCheck className="w-3.5 h-3.5 text-[#EBE834]" />
                  <span>Switch to Super Admin to Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {syncSuccessBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{syncSuccessBanner}</span>
          </div>
          {onNavigateTab && (
            <button type="button" onClick={() => onNavigateTab('payroll')} className="inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 hover:underline shrink-0">
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
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">{masterConfig.pensionAndPayroll.standardWorkingDays}d · {masterConfig.pensionAndPayroll.employerPensionPercent}% / {masterConfig.pensionAndPayroll.employeePensionPercent}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Full month · Employer / Employee Pension</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Progressive Tax Tiers</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">{masterConfig.taxBrackets.length} Brackets (0%–{Math.max(...masterConfig.taxBrackets.map(b => b.ratePercent))}%)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Governs {payrollRecords.length} active workforce payslips</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Overtime Multipliers</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">{masterConfig.shiftsAndOvertime.regularOtMultiplier}x · {masterConfig.shiftsAndOvertime.nightOtMultiplier}x · {masterConfig.shiftsAndOvertime.holidayOtMultiplier}x</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Regular · Night · Public Holiday rates</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Salary Grades & Penalties</div>
          <div className="text-lg font-bold font-mono tabular-nums text-[#0E1525] dark:text-slate-100 mt-1">{masterConfig.divisionGrades.length} Grades · {masterConfig.gearPenalties.length} Gear Rules</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Governs {employees.length} staff & {clearances.length} clearances</div>
        </div>
      </div>

      {/* Segmented Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FCF0DA] dark:bg-[#2C2724] border border-[#EFE7D8] dark:border-[#3D3633] rounded-xl">
        <button type="button" onClick={() => setActiveSubTab('payroll_tax')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'payroll_tax' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
          <CreditCard className="w-3.5 h-3.5" />
          <span>1. Payroll, Tax & Pension</span>
        </button>
        <button type="button" onClick={() => setActiveSubTab('shifts_leave')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'shifts_leave' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>2. Shifts, Overtime & Leave Quotas</span>
        </button>
        <button type="button" onClick={() => setActiveSubTab('grades_penalties')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'grades_penalties' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Division Salary Grades & Penalties</span>
        </button>
        <button type="button" onClick={() => setActiveSubTab('inventory_rules')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'inventory_rules' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
          <Package className="w-3.5 h-3.5" />
          <span>4. Warehouse & System Thresholds</span>
        </button>
        {canEditMaster && (
          <button type="button" onClick={() => setActiveSubTab('user_credentials')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'user_credentials' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
            <KeyRound className="w-3.5 h-3.5" />
            <span>5. User Credentials</span>
          </button>
        )}
        <button type="button" onClick={() => setActiveSubTab('hr_rules')} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === 'hr_rules' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A]/20'}`}>
          <Sliders className="w-3.5 h-3.5" />
          <span>6. HR System Rules</span>
        </button>
      </div>

      {/* Main Split Grid: Left (8 cols) Active Editor + Right (4 cols) Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === 'payroll_tax' && (
            <MasterPayrollTaxTab masterConfig={masterConfig} canEditMaster={canEditMaster} applyChange={applyChange} />
          )}
          {activeSubTab === 'shifts_leave' && (
            <MasterShiftsLeaveTab masterConfig={masterConfig} canEditMaster={canEditMaster} applyChange={applyChange} />
          )}
          {activeSubTab === 'grades_penalties' && (
            <MasterGradesPenaltiesTab masterConfig={masterConfig} canEditMaster={canEditMaster} applyChange={applyChange} />
          )}
          {activeSubTab === 'inventory_rules' && (
            <MasterInventoryTab masterConfig={masterConfig} canEditMaster={canEditMaster} applyChange={applyChange} />
          )}
          {activeSubTab === 'user_credentials' && canEditMaster && (
            <UserCredentialManager />
          )}
          {activeSubTab === 'hr_rules' && (
            <HrRulesConfigCard />
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <MasterFormulaSandbox masterConfig={masterConfig} />
        </div>
      </div>
    </div>
  );
};
