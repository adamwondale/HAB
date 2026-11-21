import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Zap, AlertCircle, Calendar } from 'lucide-react';
import { OnboardingChecklist, ManagementPerson } from '../../types/hrm';
import { loadSystemSettings } from '../../utils/systemSettingsStorage';
import { SystemSettings } from '../../types/systemSettings';
import { logAuditEvent } from '../../utils/auditLogger';

export interface OnboardingProbationCardProps {
  item: OnboardingChecklist;
  onConfirmPermanent?: (checklistId: string) => void;
  activeUser?: ManagementPerson;
  className?: string;
}

export const OnboardingProbationCard: React.FC<OnboardingProbationCardProps> = ({
  item,
  onConfirmPermanent,
  activeUser,
  className = ''
}) => {
  const [configuredDays, setConfiguredDays] = useState<number>(() => {
    return loadSystemSettings().hrLaborRules.probationDurationDays || 60;
  });

  useEffect(() => {
    const handleSettingsUpdated = (e: Event) => {
      const custom = e as CustomEvent<SystemSettings>;
      if (custom.detail?.hrLaborRules?.probationDurationDays) {
        setConfiguredDays(custom.detail.hrLaborRules.probationDurationDays);
      }
    };
    window.addEventListener('hab_system_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('hab_system_settings_updated', handleSettingsUpdated);
  }, []);

  const startDateStr = item.joinedDate || item.targetStartDate || '2026-10-01';
  const startDate = new Date(startDateStr);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - startDate.getTime());
  const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, configuredDays - daysElapsed);
  const progressPercent = Math.min(100, Math.round((daysElapsed / configuredDays) * 100));

  const isConfirmedPermanent = item.probationStatus === 'Completed' || item.contractType === 'Permanent';
  const isDueForPermanent =
    !isConfirmedPermanent &&
    (daysElapsed >= configuredDays || item.probationStatus === 'Due for Permanent Confirmation');

  const handleConfirmPermanent = (e: React.MouseEvent) => {
    e.stopPropagation();
    logAuditEvent({
      actorId: activeUser?.id || 'mgmt-hr-head',
      actorName: activeUser?.name || 'Solomon Teshome (HR Director)',
      actorRole: activeUser?.role || 'hr',
      action: 'CONFIRM_PERMANENT_STATUS',
      targetModule: 'Onboarding',
      targetId: item.employeeCode,
      previousValue: item.contractType || 'Probationary',
      newValue: 'Permanent',
      details: `1-Click Permanent Status Confirmed for ${item.fullName} (${item.employeeCode}) following completion of ${configuredDays}-day probation (${daysElapsed} days elapsed).`,
      status: 'SUCCESS'
    });

    onConfirmPermanent?.(item.id);
  };

  if (isConfirmedPermanent) {
    return (
      <div className={`p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Permanent Employment Confirmed
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Contract: Permanent · Standard Benefits & Statutory Entitlements Active
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
          Permanent Roster
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isDueForPermanent
        ? 'border-amber-400 dark:border-amber-600 bg-gradient-to-r from-amber-50/90 via-[#FCF0DA]/60 to-amber-50/90 dark:from-amber-950/40 dark:to-slate-900 shadow-xs'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
    } ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isDueForPermanent
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {configuredDays}-Day Statutory Probation Clock
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDueForPermanent
                  ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {isDueForPermanent ? 'Due for Permanent Confirmation' : 'In Probation'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Started: {startDateStr}
              </span>
              <span>·</span>
              <span className="font-mono">Day {daysElapsed} of {configuredDays}</span>
            </div>
          </div>
        </div>

        {isDueForPermanent && (
          <button
            type="button"
            onClick={handleConfirmPermanent}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer hover:shadow-md shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Confirm Permanent Status</span>
          </button>
        )}
      </div>

      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            {isDueForPermanent ? (
              <strong className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Statutory probation threshold met ({daysElapsed}d elapsed)
              </strong>
            ) : (
              <span>Probation Elapsed: <strong className="text-slate-900 dark:text-slate-200">{daysElapsed} Days</strong></span>
            )}
          </span>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            {isDueForPermanent ? 'Ready for Promotion' : `${daysRemaining} Days Remaining`}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isDueForPermanent
                ? 'bg-gradient-to-r from-[#F2C46A] to-emerald-500'
                : 'bg-slate-900 dark:bg-slate-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>Day 0 (Hire)</span>
          <span>50% Mid-Point</span>
          <span>Day {configuredDays} (Permanent)</span>
        </div>
      </div>
    </div>
  );
};
