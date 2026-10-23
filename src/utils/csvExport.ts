import { Employee, PayrollRecord } from '../types/hrm';

/**
 * Escapes a cell value for CSV formatting.
 */
function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers browser download of a CSV file.
 * Includes UTF-8 BOM (\uFEFF) to ensure Microsoft Excel and external accounting software
 * properly parse UTF-8 characters without garbling.
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void {
  const headerLine = headers.map(h => escapeCsvCell(h)).join(',');
  const rowLines = rows.map(row => row.map(cell => escapeCsvCell(cell)).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports employee master records to CSV for HR audits and regulatory reporting.
 */
export function exportEmployeesToCsv(employees: Employee[], filterLabel?: string): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const suffix = filterLabel ? `_${filterLabel.replace(/\s+/g, '_')}` : '';
  const filename = `HAB_Employee_Directory_Audit_${dateStr}${suffix}.csv`;

  const headers = [
    'Employee Code',
    'Full Name',
    'First Name',
    'Last Name',
    'Amharic Name',
    'Gender',
    'Service Division',
    'Designation / Role',
    'Grade',
    'Status',
    'Assigned Client Site',
    'Current Shift',
    'Phone Number',
    'Email Address',
    'Date of Birth',
    'Hire Date',
    'National ID / Kebele Card',
    'Kebele',
    'Woreda',
    'Subcity',
    'Guarantor Name',
    'Guarantor Phone',
    'Guarantor Organization',
    'Guarantor Kebele ID',
    'Guarantor Verified',
    'Bank Name',
    'Bank Account Number',
    'Base Salary (ETB)',
    'Site Allowance (ETB)',
    'Shift Allowance (ETB)',
    'Hazard Allowance (ETB)',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Emergency Contact Relation'
  ];

  const rows = employees.map(emp => [
    emp.employeeCode,
    `${emp.firstName} ${emp.lastName}`,
    emp.firstName,
    emp.lastName,
    emp.amharicName || '',
    emp.gender,
    emp.serviceType,
    emp.role,
    emp.grade,
    emp.status,
    emp.currentSiteName || 'Reserve Standby Pool',
    emp.currentShift || 'Unassigned',
    emp.phone,
    emp.email,
    emp.dateOfBirth,
    emp.hireDate,
    emp.nationalId,
    emp.kebele,
    emp.woreda,
    emp.subcity,
    emp.guarantor.name,
    emp.guarantor.phone,
    emp.guarantor.organization,
    emp.guarantor.kebeleId,
    emp.guarantor.verified ? 'Verified' : 'Pending',
    emp.bankAccount.bankName,
    emp.bankAccount.accountNumber,
    emp.salary.baseSalary,
    emp.salary.siteAllowance,
    emp.salary.shiftAllowance,
    emp.salary.hazardAllowance,
    emp.emergencyContact.name,
    emp.emergencyContact.phone,
    emp.emergencyContact.relation
  ]);

  downloadCsv(filename, headers, rows);
}

/**
 * Exports workforce payroll ledger to CSV for external accounting, audits, and tax authorities.
 */
export function exportPayrollToCsv(records: PayrollRecord[], filterLabel?: string): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const suffix = filterLabel ? `_${filterLabel.replace(/\s+/g, '_')}` : '';
  const filename = `HAB_Workforce_Payroll_Accounting_${dateStr}${suffix}.csv`;

  const headers = [
    'Payroll Month / Cycle',
    'Employee Code',
    'Employee Name',
    'Division',
    'Assigned Site / Office',
    'Working Days (Out of 30)',
    'Contract Basic Salary (ETB)',
    'Earned Basic Salary (ETB)',
    'Transport Allowance (ETB)',
    'Mobile Card Allowance (ETB)',
    'House Allowance (ETB)',
    'Overtime Hours',
    'Overtime Pay (ETB)',
    'Gross Pay (ETB)',
    '11% Employer Pension [Non-Deductible] (ETB)',
    'Income Tax (ETB)',
    '7% Employee Pension [Deductible] (ETB)',
    'Penalties (ETB)',
    'Food Cost Sharing (ETB)',
    'Total Deductions (ETB)',
    'Net Payable (ETB)',
    'Bank Name',
    'Account Number',
    'Disbursement Status'
  ];

  const rows = records.map(r => {
    const totalDeductions = r.incomeTaxDeduction + r.pensionEmployeeDeduction + r.penaltiesDeduction + r.foodCostSharingDeduction;
    return [
      r.month,
      r.employeeCode,
      r.employeeName,
      r.serviceType,
      r.siteName,
      `${r.workingDays} / ${r.fullWorkingDays || 30}`,
      r.baseSalary,
      r.earnedBaseSalary,
      r.transportAllowance,
      r.mobileCardAllowance,
      r.houseAllowance,
      r.overtimeHours,
      r.overtimePay,
      r.grossPay,
      r.pensionEmployer11Percent,
      r.incomeTaxDeduction,
      r.pensionEmployeeDeduction,
      r.penaltiesDeduction,
      r.foodCostSharingDeduction,
      totalDeductions,
      r.netPay,
      r.bankName,
      r.accountNumber,
      r.paymentStatus
    ];
  });

  downloadCsv(filename, headers, rows);
}

