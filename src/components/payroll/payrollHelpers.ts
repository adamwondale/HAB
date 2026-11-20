import { ServiceType, PayrollRecord } from '../../types/hrm';

export const getDivisionBadgeStyle = (division: ServiceType): string => {
  switch (division) {
    case 'Security':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'Cleaning':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'Property Management':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'Head Office Staff':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export interface AllowanceSplitResult {
  nonTaxableAllowance: number;
  taxableAllowance: number;
  transportExempt: number;
  transportTaxable: number;
  mobileExempt: number;
  mobileTaxable: number;
}

/**
 * Calculates statutory allowance split:
 * - Transport: Exempt up to ETB 1,600 (excess is taxable)
 * - Mobile: Exempt up to ETB 2,000 (excess is taxable)
 * - Housing: 100% Taxable
 */
export const calculateAllowanceSplit = (
  transport: number = 0,
  mobile: number = 0,
  housing: number = 0,
  transportThreshold: number = 1600,
  mobileThreshold: number = 2000
): AllowanceSplitResult => {
  const safeTransport = Math.max(0, transport || 0);
  const safeMobile = Math.max(0, mobile || 0);
  const safeHousing = Math.max(0, housing || 0);

  const transportExempt = Math.min(safeTransport, transportThreshold);
  const transportTaxable = Math.max(0, safeTransport - transportThreshold);
  const mobileExempt = Math.min(safeMobile, mobileThreshold);
  const mobileTaxable = Math.max(0, safeMobile - mobileThreshold);

  return {
    nonTaxableAllowance: transportExempt + mobileExempt,
    taxableAllowance: transportTaxable + mobileTaxable + safeHousing,
    transportExempt,
    transportTaxable,
    mobileExempt,
    mobileTaxable
  };
};

/**
 * Computes Ethiopian Schedule 'A' progressive income tax on monthly taxable income.
 */
export const calculateIncomeTax = (taxableIncome: number): number => {
  if (taxableIncome <= 600) return 0;
  if (taxableIncome <= 1650) return Math.max(0, Math.round(taxableIncome * 0.1 - 60));
  if (taxableIncome <= 3200) return Math.max(0, Math.round(taxableIncome * 0.15 - 142.5));
  if (taxableIncome <= 5250) return Math.max(0, Math.round(taxableIncome * 0.2 - 302.5));
  if (taxableIncome <= 7800) return Math.max(0, Math.round(taxableIncome * 0.25 - 565));
  if (taxableIncome <= 10900) return Math.max(0, Math.round(taxableIncome * 0.3 - 955));
  return Math.max(0, Math.round(taxableIncome * 0.35 - 1500));
};

export interface PayrollCalculationInput {
  baseSalary: number;
  workingDays: number;
  standardDays?: number;
  transportAllowance?: number;
  mobileCardAllowance?: number;
  houseAllowance?: number;
  overtimePay?: number;
  penaltiesDeduction?: number;
  foodCostSharingDeduction?: number;
  loanOrUniformDeduction?: number;
  transportThreshold?: number;
  mobileThreshold?: number;
}

/**
 * Calculates net salary and all statutory payroll components using:
 * Taxable Base = Earned Basic + Taxable Allowance + Overtime
 */
export const calculateNetSalary = (input: PayrollCalculationInput) => {
  const stdDays = input.standardDays || 30;
  const days = Math.max(0, Math.min(stdDays, input.workingDays ?? stdDays));
  const earnedBaseSalary = Math.round((input.baseSalary / stdDays) * days);

  const allowanceSplit = calculateAllowanceSplit(
    input.transportAllowance,
    input.mobileCardAllowance,
    input.houseAllowance,
    input.transportThreshold ?? 1600,
    input.mobileThreshold ?? 2000
  );

  const ot = Math.max(0, input.overtimePay || 0);
  const taxableIncome = earnedBaseSalary + allowanceSplit.taxableAllowance + ot;
  const incomeTax = calculateIncomeTax(taxableIncome);
  const pension7 = Math.round(earnedBaseSalary * 0.07);
  const pension11 = Math.round(earnedBaseSalary * 0.11);
  const otherDeductions =
    Math.max(0, input.penaltiesDeduction || 0) +
    Math.max(0, input.foodCostSharingDeduction || 0) +
    Math.max(0, input.loanOrUniformDeduction || 0);

  const grossPay = earnedBaseSalary + allowanceSplit.nonTaxableAllowance + allowanceSplit.taxableAllowance + ot;
  const totalDeductions = incomeTax + pension7 + otherDeductions;
  const netPay = Math.max(0, grossPay - totalDeductions);

  return {
    earnedBaseSalary,
    grossPay,
    taxableIncome,
    incomeTax,
    pension7,
    pension11,
    totalDeductions,
    netPay,
    allowanceSplit
  };
};

/**
 * Enriches a PayrollRecord with statutory allowance split and recalculates tax & net pay.
 */
export const enrichPayrollRecord = (
  record: PayrollRecord,
  transportThreshold = 1600,
  mobileThreshold = 2000
): PayrollRecord => {
  const res = calculateNetSalary({
    baseSalary: record.baseSalary,
    workingDays: record.workingDays,
    standardDays: record.standardDays || record.fullWorkingDays || 30,
    transportAllowance: record.transportAllowance,
    mobileCardAllowance: record.mobileCardAllowance,
    houseAllowance: record.houseAllowance,
    overtimePay: record.overtimePay,
    penaltiesDeduction: record.penaltiesDeduction,
    foodCostSharingDeduction: record.foodCostSharingDeduction,
    loanOrUniformDeduction: record.loanOrUniformDeduction,
    transportThreshold,
    mobileThreshold
  });

  return {
    ...record,
    standardDays: record.standardDays || 30,
    earnedBaseSalary: res.earnedBaseSalary,
    grossPay: res.grossPay,
    nonTaxableAllowance: res.allowanceSplit.nonTaxableAllowance,
    taxableAllowance: res.allowanceSplit.taxableAllowance,
    transportExempt: res.allowanceSplit.transportExempt,
    transportTaxable: res.allowanceSplit.transportTaxable,
    mobileExempt: res.allowanceSplit.mobileExempt,
    mobileTaxable: res.allowanceSplit.mobileTaxable,
    incomeTaxDeduction: res.incomeTax,
    pensionEmployeeDeduction: res.pension7,
    pensionEmployer11Percent: res.pension11,
    netPay: res.netPay
  };
};
