import { ServiceType, LeaveType, StockCategory, IssuedClearanceItem } from './hrm';

export interface TaxBracketRule {
  id: string;
  label: string;
  minIncome: number;
  maxIncome: number | null; // null means no upper limit (e.g., > 10,900 ETB)
  ratePercent: number; // e.g. 0, 10, 15, 20, 25, 30, 35
  deductionConstant: number; // e.g. 0, 60, 142.5, 302.5, 565, 955, 1500
}

export interface PensionAndPayrollRules {
  employerPensionPercent: number; // Default 11%
  employeePensionPercent: number; // Default 7%
  standardWorkingDays: number; // Default 30 days
  defaultTransportAllowance: number; // Default 1500 ETB
  defaultMobileAllowance: number; // Default 400 ETB
  defaultHousingAllowance: number; // Default 2000 ETB
  defaultFoodCostSharing: number; // Default 400 ETB
  taxExemptTransportLimit: number; // Default 2200 ETB
}

export interface ShiftAndOvertimeRules {
  standardDailyHours: number; // Default 8 hours
  regularOtMultiplier: number; // Default 1.5x
  nightOtMultiplier: number; // Default 1.75x
  weekendOtMultiplier: number; // Default 2.0x
  holidayOtMultiplier: number; // Default 2.5x
  securityDutyHours: number; // Default 24h
  securityRestHours: number; // Default 48h
  cleaningRotationCycleDays: number; // Default 7 days (weekly)
}

export interface LeaveQuotaRule {
  id: string;
  leaveType: LeaveType;
  maxDaysPerYear: number;
  paidPercent: number; // e.g. 100%
  requiresReliefAssignment: boolean;
}

export interface GearPenaltyRule {
  id: string;
  category: IssuedClearanceItem['category'];
  itemPattern: string; // e.g. "Two-Way Walkie-Talkie Radio", "Tactical Combat Boots", "Default Equipment", etc.
  damagedFeeETB: number;
  missingFeeETB: number;
}

export interface DivisionSalaryGradeRule {
  id: string;
  serviceType: ServiceType;
  grade: string; // 'L1' | 'L2' | 'L3' | 'Senior' | 'Supervisor'
  defaultBaseSalary: number;
  defaultSiteAllowance: number;
  defaultShiftAllowance: number;
  defaultHazardAllowance: number;
}

export interface InventoryThresholdRule {
  id: string;
  category: StockCategory;
  defaultMinReorderLevel: number;
  safetyBufferPercent: number;
  contractWarningDays: number;
}

export interface SystemMasterConfig {
  version: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  autoRecalculateOnSave: boolean;
  taxBrackets: TaxBracketRule[];
  pensionAndPayroll: PensionAndPayrollRules;
  shiftsAndOvertime: ShiftAndOvertimeRules;
  leaveQuotas: LeaveQuotaRule[];
  gearPenalties: GearPenaltyRule[];
  divisionGrades: DivisionSalaryGradeRule[];
  inventoryThresholds: InventoryThresholdRule[];
}
