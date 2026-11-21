import {
  SystemSettings,
  HrLaborRulesSettings,
  LeaveTypeRule,
  StatutoryLeaveCalculation
} from '../types/systemSettings';

export const SYSTEM_SETTINGS_STORAGE_KEY = 'hab_system_settings';

export const DEFAULT_LEAVE_TYPES: LeaveTypeRule[] = [
  {
    id: 'annual',
    name: 'Annual Leave',
    statutoryNote: '16d + 1d/2yrs (Labor Proc 1156/2019)',
    paid: true,
    approvalTier: 'HeadOfDept'
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    statutoryNote: 'Up to 30 days (Medical certification required)',
    paid: true,
    approvalTier: 'HeadOfDept'
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    statutoryNote: '120 consecutive calendar days (Fully paid)',
    paid: true,
    approvalTier: 'CEO'
  },
  {
    id: 'compassionate',
    name: 'Compassionate Leave',
    statutoryNote: '3 to 7 working days for family bereavement',
    paid: true,
    approvalTier: 'HeadOfDept'
  },
  {
    id: 'emergency',
    name: 'Emergency Family Leave',
    statutoryNote: '3 days paid special emergency leave',
    paid: true,
    approvalTier: 'HeadOfDept'
  },
  {
    id: 'unpaid',
    name: 'Unpaid Discretionary Leave',
    statutoryNote: 'Discretionary leave beyond statutory quotas',
    paid: false,
    approvalTier: 'CEO'
  }
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  appearance: {
    theme: 'light',
    accentColor: '#F2C46A',
    language: 'en'
  },
  hrLaborRules: {
    probationDurationDays: 60,
    baseLeaveDays: 16,
    leaveYearsPerStep: 2,
    leaveIncrementDays: 1,
    leaveMaxDaysCap: 30,
    standardDailyHours: 8,
    workWeekDays: 6,
    securityDutyHours: '24h ON / 48h REST',
    cleaningShiftHours: '06:00 - 14:00 / 14:00 - 22:00',
    leaveTypes: DEFAULT_LEAVE_TYPES
  },
  version: '1.0',
  lastUpdatedBy: 'Super Admin',
  lastUpdatedAt: '2026-11-21 09:00:00'
};

export function loadSystemSettings(): SystemSettings {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_SYSTEM_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SYSTEM_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      appearance: {
        ...DEFAULT_SYSTEM_SETTINGS.appearance,
        ...(parsed.appearance || {})
      },
      hrLaborRules: {
        ...DEFAULT_SYSTEM_SETTINGS.hrLaborRules,
        ...(parsed.hrLaborRules || {}),
        leaveTypes: Array.isArray(parsed.hrLaborRules?.leaveTypes) && parsed.hrLaborRules.leaveTypes.length > 0
          ? parsed.hrLaborRules.leaveTypes
          : DEFAULT_LEAVE_TYPES
      },
      version: parsed.version || DEFAULT_SYSTEM_SETTINGS.version,
      lastUpdatedBy: parsed.lastUpdatedBy || DEFAULT_SYSTEM_SETTINGS.lastUpdatedBy,
      lastUpdatedAt: parsed.lastUpdatedAt || DEFAULT_SYSTEM_SETTINGS.lastUpdatedAt
    };
  } catch (err) {
    console.error('Failed to load system settings from localStorage:', err);
    return DEFAULT_SYSTEM_SETTINGS;
  }
}

export function saveSystemSettings(settings: SystemSettings): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(SYSTEM_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('hab_system_settings_updated', { detail: settings }));
  } catch (err) {
    console.error('Failed to save system settings to localStorage:', err);
  }
}

export function calculateEmployeeStatutoryLeave(
  hireDate: string,
  rules: HrLaborRulesSettings
): StatutoryLeaveCalculation {
  const hire = new Date(hireDate);
  const now = new Date();
  let tenureYears = 0;

  if (!isNaN(hire.getTime())) {
    tenureYears = now.getFullYear() - hire.getFullYear();
    const m = now.getMonth() - hire.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < hire.getDate())) {
      tenureYears--;
    }
  }
  tenureYears = Math.max(0, tenureYears);

  const stepInterval = Math.max(1, rules.leaveYearsPerStep || 2);
  const steps = Math.floor(tenureYears / stepInterval);
  const incrementDays = rules.leaveIncrementDays ?? 1;
  const baseDays = rules.baseLeaveDays ?? 16;
  const cap = rules.leaveMaxDaysCap ?? 30;

  const totalCalculated = baseDays + (steps * incrementDays);
  const statutoryDays = Math.min(cap, Math.max(baseDays, totalCalculated));
  const formulaDisplay = `${baseDays}d base + (${steps} step${steps === 1 ? '' : 's'} × ${incrementDays}d) = ${statutoryDays}d (Cap: ${cap}d)`;

  return { tenureYears, statutoryDays, formulaDisplay };
}
