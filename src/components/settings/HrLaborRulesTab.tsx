import React, { useState } from 'react';
import { Clock, Calendar, Scale, Shield, Check, Info } from 'lucide-react';
import { HrLaborRulesSettings, LeaveTypeRule } from '../../types/systemSettings';

interface HrLaborRulesTabProps {
  rules: HrLaborRulesSettings;
  onChange: (updated: HrLaborRulesSettings) => void;
}

export const HrLaborRulesTab: React.FC<HrLaborRulesTabProps> = ({ rules, onChange }) => {
  const [simYears, setSimYears] = useState(3);

  const updateField = <K extends keyof HrLaborRulesSettings>(key: K, value: HrLaborRulesSettings[K]) => {
    onChange({ ...rules, [key]: value });
  };

  const handleTogglePaid = (typeId: string) => {
    const updated = rules.leaveTypes.map((t) => (t.id === typeId ? { ...t, paid: !t.paid } : t));
    updateField('leaveTypes', updated);
  };

  const handleToggleTier = (typeId: string) => {
    const updated = rules.leaveTypes.map((t) =>
      t.id === typeId
        ? { ...t, approvalTier: (t.approvalTier === 'CEO' ? 'HeadOfDept' : 'CEO') as 'HeadOfDept' | 'CEO' }
        : t
    );
    updateField('leaveTypes', updated);
  };

  // Live Formula Simulator Calculation
  const simSteps = Math.floor(simYears / Math.max(1, rules.leaveYearsPerStep));
  const simDays = Math.min(rules.leaveMaxDaysCap, rules.baseLeaveDays + simSteps * rules.leaveIncrementDays);

  return (
    <div className="space-y-5">
      {/* Top Row: Probation Clock + Work Shift Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Probation Duration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F2C46A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Probation Period (Screen 9)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] px-2 py-0.5 rounded border border-[#EFE7D8]">
              Proc. 1156/2019 Art. 11
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Mandatory evaluation days before candidate is flagged for 1-click permanent roster conversion.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="number"
              min={15}
              max={180}
              value={rules.probationDurationDays}
              onChange={(e) => updateField('probationDurationDays', Math.max(1, parseInt(e.target.value) || 60))}
              className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-center text-sm"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Calendar Days (Default: 60 Days / 2 Months)
            </span>
          </div>
        </div>

        {/* 2. Standard Shift & Duty Rotations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#F2C46A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Work Time & Duty Shifts
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Standard 48h/wk</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Security Duty Cycle</label>
              <input
                type="text"
                value={rules.securityDutyHours}
                onChange={(e) => updateField('securityDutyHours', e.target.value)}
                className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Cleaning Shift Schedule</label>
              <input
                type="text"
                value={rules.cleaningShiftHours}
                onChange={(e) => updateField('cleaningShiftHours', e.target.value)}
                className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Annual Leave Progression Formula Card + Simulator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F2C46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Statutory Annual Leave Progression Formula
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Labor Proc. 1156/2019: 16d base + 1d per 2 yrs (Max 30d)</span>
        </div>

        {/* Formula Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: '1. Base Days (Yr 1)', val: rules.baseLeaveDays, field: 'baseLeaveDays' as const, min: 1 },
            { label: '2. Years Per Step', val: rules.leaveYearsPerStep, field: 'leaveYearsPerStep' as const, min: 1 },
            { label: '3. Increment / Step', val: rules.leaveIncrementDays, field: 'leaveIncrementDays' as const, min: 1 },
            { label: '4. Statutory Max Cap', val: rules.leaveMaxDaysCap, field: 'leaveMaxDaysCap' as const, min: 1 }
          ].map((item) => (
            <div key={item.field} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">{item.label}</span>
              <input
                type="number"
                value={item.val}
                onChange={(e) => updateField(item.field, Math.max(item.min, parseInt(e.target.value) || 1))}
                className="mt-1 w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold text-center"
              />
            </div>
          ))}
        </div>

        {/* Interactive Simulator */}
        <div className="p-3 bg-[#FCF0DA]/40 dark:bg-[#2C2724]/40 border border-[#EFE7D8] dark:border-[#3D3633] rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4C4541] dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#F2C46A]" /> Interactive Leave Accrual Simulator
            </span>
            <span className="text-xs font-mono font-bold text-[#4C4541] dark:text-white bg-[#F2C46A] px-2.5 py-0.5 rounded">
              {simYears} Years Tenure = {simDays} Entitled Days
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[1, 2, 3, 5, 8, 10, 15, 20].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSimYears(yr)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  simYears === yr
                    ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Year {yr}
              </button>
            ))}
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Calculation: {rules.baseLeaveDays}d base + ({simSteps} steps × {rules.leaveIncrementDays}d) = {simDays}d (capped at {rules.leaveMaxDaysCap}d)
          </p>
        </div>
      </div>

      {/* Configurable Leave Categories List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F2C46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Statutory Leave Categories & Approval Hierarchy
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Click badges to toggle Paid status or Approval Tier</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {rules.leaveTypes.map((t) => (
            <div key={t.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{t.name}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.statutoryNote}</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleTogglePaid(t.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer border ${
                    t.paid
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {t.paid ? 'PAID' : 'UNPAID'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTier(t.id)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8] cursor-pointer"
                >
                  Tier: {t.approvalTier === 'CEO' ? 'CEO Approval' : 'Dept Head'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
