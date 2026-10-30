import {
  ClearanceRecord,
  IssuedClearanceItem,
  ManagementPerson,
  PayrollRecord,
  ServiceType,
  StockItem
} from '../types/hrm';
import {
  DivisionSalaryGradeRule,
  SystemMasterConfig,
  TaxBracketRule
} from '../types/masterConfig';

export const DEFAULT_SYSTEM_MASTER_CONFIG: SystemMasterConfig = {
  version: '2026.4',
  lastUpdatedAt: '2026-10-29 08:00',
  lastUpdatedBy: 'Super Admin (Statutory Baseline)',
  autoRecalculateOnSave: true,
  taxBrackets: [
    {
      id: 'tax-b1',
      label: 'Bracket 1 (Tax Exempt)',
      minIncome: 0,
      maxIncome: 600,
      ratePercent: 0,
      deductionConstant: 0
    },
    {
      id: 'tax-b2',
      label: 'Bracket 2 (10% Tier)',
      minIncome: 601,
      maxIncome: 1650,
      ratePercent: 10,
      deductionConstant: 60
    },
    {
      id: 'tax-b3',
      label: 'Bracket 3 (15% Tier)',
      minIncome: 1651,
      maxIncome: 3200,
      ratePercent: 15,
      deductionConstant: 142.5
    },
    {
      id: 'tax-b4',
      label: 'Bracket 4 (20% Tier)',
      minIncome: 3201,
      maxIncome: 5250,
      ratePercent: 20,
      deductionConstant: 302.5
    },
    {
      id: 'tax-b5',
      label: 'Bracket 5 (25% Tier)',
      minIncome: 5251,
      maxIncome: 7800,
      ratePercent: 25,
      deductionConstant: 565
    },
    {
      id: 'tax-b6',
      label: 'Bracket 6 (30% Tier)',
      minIncome: 7801,
      maxIncome: 10900,
      ratePercent: 30,
      deductionConstant: 955
    },
    {
      id: 'tax-b7',
      label: 'Bracket 7 (35% Top Tier)',
      minIncome: 10901,
      maxIncome: null,
      ratePercent: 35,
      deductionConstant: 1500
    }
  ],
  pensionAndPayroll: {
    employerPensionPercent: 11,
    employeePensionPercent: 7,
    standardWorkingDays: 30,
    defaultTransportAllowance: 1500,
    defaultMobileAllowance: 400,
    defaultHousingAllowance: 2000,
    defaultFoodCostSharing: 400,
    taxExemptTransportLimit: 2200
  },
  shiftsAndOvertime: {
    standardDailyHours: 8,
    regularOtMultiplier: 1.5,
    nightOtMultiplier: 1.75,
    weekendOtMultiplier: 2.0,
    holidayOtMultiplier: 2.5,
    securityDutyHours: 24,
    securityRestHours: 48,
    cleaningRotationCycleDays: 7
  },
  leaveQuotas: [
    {
      id: 'lq-annual',
      leaveType: 'Annual Leave',
      maxDaysPerYear: 16,
      paidPercent: 100,
      requiresReliefAssignment: true
    },
    {
      id: 'lq-sick',
      leaveType: 'Sick Leave',
      maxDaysPerYear: 30,
      paidPercent: 100,
      requiresReliefAssignment: true
    },
    {
      id: 'lq-maternity',
      leaveType: 'Maternity / Paternity',
      maxDaysPerYear: 120,
      paidPercent: 100,
      requiresReliefAssignment: true
    },
    {
      id: 'lq-compassionate',
      leaveType: 'Compassionate',
      maxDaysPerYear: 5,
      paidPercent: 100,
      requiresReliefAssignment: true
    },
    {
      id: 'lq-emergency',
      leaveType: 'Emergency',
      maxDaysPerYear: 7,
      paidPercent: 100,
      requiresReliefAssignment: true
    }
  ],
  gearPenalties: [
    {
      id: 'gp-radio',
      category: 'Equipment',
      itemPattern: 'Radio',
      damagedFeeETB: 1200,
      missingFeeETB: 3200
    },
    {
      id: 'gp-baton',
      category: 'Equipment',
      itemPattern: 'Baton',
      damagedFeeETB: 250,
      missingFeeETB: 450
    },
    {
      id: 'gp-boots',
      category: 'Uniform',
      itemPattern: 'Boots',
      damagedFeeETB: 350,
      missingFeeETB: 850
    },
    {
      id: 'gp-uniform',
      category: 'Uniform',
      itemPattern: 'Default Uniform & Apparel',
      damagedFeeETB: 220,
      missingFeeETB: 600
    },
    {
      id: 'gp-equip',
      category: 'Equipment',
      itemPattern: 'Default Tactical / Janitorial Equipment',
      damagedFeeETB: 250,
      missingFeeETB: 500
    },
    {
      id: 'gp-safety',
      category: 'Safety Gear',
      itemPattern: 'Default PPE & Safety Gear',
      damagedFeeETB: 120,
      missingFeeETB: 250
    },
    {
      id: 'gp-cred',
      category: 'Credentials',
      itemPattern: 'ID Badge, Logbook & Access Credentials',
      damagedFeeETB: 75,
      missingFeeETB: 150
    }
  ],
  divisionGrades: [
    {
      id: 'dg-sec-l1',
      serviceType: 'Security',
      grade: 'L1',
      defaultBaseSalary: 7000,
      defaultSiteAllowance: 1200,
      defaultShiftAllowance: 600,
      defaultHazardAllowance: 1200
    },
    {
      id: 'dg-sec-senior',
      serviceType: 'Security',
      grade: 'Senior',
      defaultBaseSalary: 9200,
      defaultSiteAllowance: 1500,
      defaultShiftAllowance: 800,
      defaultHazardAllowance: 1500
    },
    {
      id: 'dg-sec-sup',
      serviceType: 'Security',
      grade: 'Supervisor',
      defaultBaseSalary: 12500,
      defaultSiteAllowance: 2000,
      defaultShiftAllowance: 1000,
      defaultHazardAllowance: 1800
    },
    {
      id: 'dg-cln-l1',
      serviceType: 'Cleaning',
      grade: 'L1',
      defaultBaseSalary: 5800,
      defaultSiteAllowance: 1000,
      defaultShiftAllowance: 500,
      defaultHazardAllowance: 800
    },
    {
      id: 'dg-cln-senior',
      serviceType: 'Cleaning',
      grade: 'Senior',
      defaultBaseSalary: 7400,
      defaultSiteAllowance: 1200,
      defaultShiftAllowance: 600,
      defaultHazardAllowance: 1000
    },
    {
      id: 'dg-prp-l2',
      serviceType: 'Property Management',
      grade: 'L2',
      defaultBaseSalary: 14500,
      defaultSiteAllowance: 2000,
      defaultShiftAllowance: 800,
      defaultHazardAllowance: 1000
    },
    {
      id: 'dg-hq-sup',
      serviceType: 'Head Office Staff',
      grade: 'Supervisor',
      defaultBaseSalary: 18500,
      defaultSiteAllowance: 2500,
      defaultShiftAllowance: 0,
      defaultHazardAllowance: 0
    }
  ],
  inventoryThresholds: [
    {
      id: 'inv-sec',
      category: 'Security Uniforms & Gear',
      defaultMinReorderLevel: 25,
      safetyBufferPercent: 20,
      contractWarningDays: 30
    },
    {
      id: 'inv-cln',
      category: 'Cleaning Supplies & Equipment',
      defaultMinReorderLevel: 35,
      safetyBufferPercent: 25,
      contractWarningDays: 30
    },
    {
      id: 'inv-prp',
      category: 'Property Management & Maintenance',
      defaultMinReorderLevel: 15,
      safetyBufferPercent: 15,
      contractWarningDays: 45
    },
    {
      id: 'inv-hq',
      category: 'Head Office & Stationery',
      defaultMinReorderLevel: 20,
      safetyBufferPercent: 10,
      contractWarningDays: 30
    }
  ]
};

/**
 * Super Admin check: Executive roles and HR & Admin Head can edit master setup;
 * other managers have read-only audit visibility.
 */
export function isSuperAdminUser(user?: ManagementPerson): boolean {
  if (!user) return true;
  return (
    user.id === 'mgmt-ceo' ||
    user.id === 'mgmt-gm' ||
    user.id === 'mgmt-hr-head' ||
    user.roleCategory === 'Executive'
  );
}

/**
 * Find the matching tax bracket for a given taxable income.
 */
export function findMatchingTaxBracket(
  taxableIncome: number,
  brackets: TaxBracketRule[]
): TaxBracketRule {
  const sorted = [...brackets].sort((a, b) => a.minIncome - b.minIncome);
  for (const b of sorted) {
    if (b.maxIncome === null) {
      if (taxableIncome >= b.minIncome) return b;
    } else if (taxableIncome >= b.minIncome && taxableIncome <= b.maxIncome) {
      return b;
    }
  }
  return sorted[sorted.length - 1] || DEFAULT_SYSTEM_MASTER_CONFIG.taxBrackets[0];
}

/**
 * Calculate Ethiopian progressive income tax using the Master Setup tax brackets.
 */
export function calculateIncomeTaxFromMaster(
  taxableIncome: number,
  config: SystemMasterConfig = DEFAULT_SYSTEM_MASTER_CONFIG
): number {
  if (taxableIncome <= 0) return 0;
  const bracket = findMatchingTaxBracket(taxableIncome, config.taxBrackets);
  if (!bracket || bracket.ratePercent <= 0) return 0;
  const rawTax = taxableIncome * (bracket.ratePercent / 100) - bracket.deductionConstant;
  return Math.max(0, Math.round(rawTax));
}

/**
 * Calculate hourly overtime pay from base salary, hours, and master setup multiplier.
 */
export function calculateOvertimePayFromMaster(
  baseSalary: number,
  overtimeHours: number,
  config: SystemMasterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  tier: 'regular' | 'night' | 'weekend' | 'holiday' = 'regular'
): number {
  if (overtimeHours <= 0) return 0;
  const standardDays = Math.max(1, config.pensionAndPayroll.standardWorkingDays);
  const dailyHours = Math.max(1, config.shiftsAndOvertime.standardDailyHours);
  const hourlyRate = baseSalary / (standardDays * dailyHours);
  const multiplier =
    tier === 'night'
      ? config.shiftsAndOvertime.nightOtMultiplier
      : tier === 'weekend'
      ? config.shiftsAndOvertime.weekendOtMultiplier
      : tier === 'holiday'
      ? config.shiftsAndOvertime.holidayOtMultiplier
      : config.shiftsAndOvertime.regularOtMultiplier;

  return Math.round(hourlyRate * overtimeHours * multiplier);
}

/**
 * Recalculate a single PayrollRecord using the System Master Setup rules.
 */
export function calculatePayrollRecordWithMaster(
  record: PayrollRecord,
  config: SystemMasterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  recalculateTaxFromBrackets: boolean = true
): PayrollRecord {
  const fullDays = Math.max(1, config.pensionAndPayroll.standardWorkingDays);
  const days = Math.max(0, Math.min(fullDays, Number(record.workingDays) || 0));
  const baseSalary = Number(record.baseSalary) || 0;
  const earnedBase = Math.round((baseSalary / fullDays) * days);

  const transport = Number(record.transportAllowance) || 0;
  const mobile = Number(record.mobileCardAllowance) || 0;
  const house = Number(record.houseAllowance) || 0;

  // If record has overtimeHours > 0 and overtimePay was derived from hours, or use existing overtimePay
  const otHours = Number(record.overtimeHours) || 0;
  const otPay =
    otHours > 0 && (!record.overtimePay || recalculateTaxFromBrackets)
      ? calculateOvertimePayFromMaster(baseSalary, otHours, config, 'regular')
      : Number(record.overtimePay) || 0;

  const gross = earnedBase + transport + mobile + house + otPay;

  const employerPension = Math.round(
    earnedBase * (config.pensionAndPayroll.employerPensionPercent / 100)
  );
  const employeePension = Math.round(
    earnedBase * (config.pensionAndPayroll.employeePensionPercent / 100)
  );

  // Taxable transport is any transport allowance above taxExemptTransportLimit
  const taxableTransport = Math.max(
    0,
    transport - config.pensionAndPayroll.taxExemptTransportLimit
  );
  const taxableIncome = earnedBase + house + mobile + otPay + taxableTransport;

  const incomeTax = recalculateTaxFromBrackets
    ? calculateIncomeTaxFromMaster(taxableIncome, config)
    : Number(record.incomeTaxDeduction) || 0;

  const penalties = Number(record.penaltiesDeduction) || 0;
  const food = Number(record.foodCostSharingDeduction) || 0;

  const totalDeductions = incomeTax + employeePension + penalties + food;
  const netPay = Math.max(0, gross - totalDeductions);

  return {
    ...record,
    workingDays: days,
    fullWorkingDays: fullDays,
    earnedBaseSalary: earnedBase,
    overtimePay: otPay,
    grossPay: gross,
    pensionEmployer11Percent: employerPension,
    pensionEmployeeDeduction: employeePension,
    incomeTaxDeduction: incomeTax,
    netPay
  };
}

/**
 * Recalculate all active (or all) payroll records using the Master Setup.
 */
export function recalculateAllPayrollWithMaster(
  records: PayrollRecord[],
  config: SystemMasterConfig,
  includeDisbursed: boolean = false
): PayrollRecord[] {
  return records.map(r => {
    if (!includeDisbursed && r.paymentStatus === 'Disbursed') {
      return r;
    }
    return calculatePayrollRecordWithMaster(r, config, true);
  });
}

/**
 * Lookup penalty fee for a clearance item based on category, name, and condition.
 */
export function getGearPenaltyFromMaster(
  category: IssuedClearanceItem['category'],
  itemName: string,
  condition: 'Good' | 'Damaged' | 'Missing',
  config: SystemMasterConfig = DEFAULT_SYSTEM_MASTER_CONFIG
): number {
  if (condition === 'Good') return 0;

  const lowerName = itemName.toLowerCase();
  const specificMatch = config.gearPenalties.find(
    g =>
      !g.itemPattern.toLowerCase().startsWith('default') &&
      lowerName.includes(g.itemPattern.toLowerCase())
  );

  const categoryFallback = config.gearPenalties.find(g => g.category === category);
  const rule = specificMatch || categoryFallback;

  if (!rule) {
    return condition === 'Missing' ? 300 : 150;
  }

  return condition === 'Missing' ? rule.missingFeeETB : rule.damagedFeeETB;
}

/**
 * Recalculate all active clearance records with the master gear penalty fee table.
 */
export function recalculateAllClearancesWithMaster(
  clearances: ClearanceRecord[],
  config: SystemMasterConfig
): ClearanceRecord[] {
  return clearances.map(c => {
    if (c.status === 'Cleared' || c.status === 'Completed') {
      return c;
    }
    const updatedItems: IssuedClearanceItem[] = c.issuedItems.map(item => {
      const nextCondition: IssuedClearanceItem['condition'] = item.isReturned
        ? item.condition === 'Missing'
          ? 'Good'
          : item.condition
        : 'Missing';
      const fee = getGearPenaltyFromMaster(
        item.category,
        item.name,
        nextCondition,
        config
      );
      return {
        ...item,
        condition: nextCondition,
        penaltyFee: item.isReturned && nextCondition === 'Good' ? 0 : fee
      };
    });

    const totalGearPenalty = updatedItems.reduce(
      (sum, i) => sum + (i.isReturned && i.condition === 'Good' ? 0 : i.penaltyFee),
      0
    );

    return {
      ...c,
      issuedItems: updatedItems,
      financeSignoff: {
        ...c.financeSignoff,
        unreturnedGearCost: totalGearPenalty,
        finalSeveranceSettlement: Math.max(0, 6500 - totalGearPenalty)
      }
    };
  });
}

/**
 * Sync warehouse stock items' minimum reorder thresholds from the Master Setup.
 */
export function recalculateStockThresholdsWithMaster(
  stockItems: StockItem[],
  config: SystemMasterConfig
): StockItem[] {
  return stockItems.map(item => {
    const rule = config.inventoryThresholds.find(t => t.category === item.category);
    if (!rule) return item;
    return {
      ...item,
      minReorderLevel: rule.defaultMinReorderLevel
    };
  });
}

/**
 * Lookup default salary & allowances for a Division + Grade combination.
 */
export function getDivisionGradeDefaults(
  serviceType: ServiceType,
  grade: string,
  config: SystemMasterConfig = DEFAULT_SYSTEM_MASTER_CONFIG
): DivisionSalaryGradeRule {
  const exact = config.divisionGrades.find(
    d => d.serviceType === serviceType && d.grade === grade
  );
  if (exact) return exact;

  const byService = config.divisionGrades.find(d => d.serviceType === serviceType);
  if (byService) return byService;

  return (
    config.divisionGrades[0] || {
      id: 'fallback',
      serviceType,
      grade,
      defaultBaseSalary: 7000,
      defaultSiteAllowance: 1200,
      defaultShiftAllowance: 600,
      defaultHazardAllowance: 1000
    }
  );
}
