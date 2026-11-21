export type SystemThemeMode = 'light' | 'dark' | 'system';
export type SystemLanguage = 'en' | 'am';

export interface SystemAppearanceSettings {
  theme: SystemThemeMode;
  accentColor: string;
  language: SystemLanguage;
}

export type LeaveApprovalTier = 'HeadOfDept' | 'CEO';

export interface LeaveTypeRule {
  id: string;
  name: string;
  statutoryNote: string;
  paid: boolean;
  approvalTier: LeaveApprovalTier;
}

export interface HrLaborRulesSettings {
  probationDurationDays: number;
  baseLeaveDays: number;
  leaveYearsPerStep: number;
  leaveIncrementDays: number;
  leaveMaxDaysCap: number;
  standardDailyHours: number;
  workWeekDays: number;
  securityDutyHours: string;
  cleaningShiftHours: string;
  leaveTypes: LeaveTypeRule[];
}

export interface SystemSettings {
  appearance: SystemAppearanceSettings;
  hrLaborRules: HrLaborRulesSettings;
  version: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface StatutoryLeaveCalculation {
  tenureYears: number;
  statutoryDays: number;
  formulaDisplay: string;
}
