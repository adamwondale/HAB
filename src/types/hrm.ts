export type ServiceType = 'Security' | 'Cleaning' | 'Property Management' | 'Head Office Staff';

export type EmployeeStatus = 
  | 'Active' 
  | 'Probation' 
  | 'On Leave' 
  | 'Suspended' 
  | 'In Clearance' 
  | 'Exited';

export type ShiftType = 
  // Cleaning Service: 2 shifts with weekly rotation
  | 'Morning Shift (06:00 - 14:00)' 
  | 'Afternoon Shift (14:00 - 22:00)'
  // Security Service: 24hr Work / 48hr Rest
  | '24h Duty (24hr ON / 48hr REST)'
  // Property Management & Head Office
  | 'Regular Office Hours (08:00 - 17:00)'
  // Legacy / compatible representations
  | 'Morning (07:00 - 15:00)' 
  | 'Evening (15:00 - 23:00)'
  | 'Day (06:00 - 18:00)' 
  | 'Night (18:00 - 06:00)';

export type SecurityPlatoon = 'Platoon Alpha' | 'Platoon Bravo' | 'Platoon Charlie';
export type SecurityDutyCycle = 'Active 24h Duty' | 'Rest Period (Day 1 - 24h)' | 'Standby Rest (Day 2 - 48h)';

export interface Employee {
  id: string;
  employeeCode: string; // e.g. HAB-SEC-0104, HAB-CLN-0205
  firstName: string;
  lastName: string;
  amharicName?: string;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  dateOfBirth: string;
  hireDate: string;
  serviceType: ServiceType;
  role: string; // Guard, Senior Guard, Security Supervisor, Cleaner, Senior Cleaner, Cleaning Lead, Operations Inspector
  grade: string; // L1, L2, L3, Senior, Supervisor
  status: EmployeeStatus;
  currentSiteId?: string;
  currentSiteName?: string;
  currentShift?: ShiftType;
  securityPlatoon?: SecurityPlatoon;
  cleaningShiftWeek?: 'Week 1 (Morning)' | 'Week 2 (Afternoon)';
  nationalId: string;
  kebele: string;
  woreda: string;
  subcity: string; // Bole, Kirkos, Yeka, Nifas Silk, Lideta, Arada
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  guarantor: {
    name: string;
    phone: string;
    organization: string;
    kebeleId: string;
    verified: boolean;
  };
  bankAccount: {
    bankName: string; // Commercial Bank of Ethiopia (CBE), Awash Bank, Dashen Bank
    accountNumber: string;
  };
  salary: {
    baseSalary: number; // In ETB (Ethiopian Birr)
    siteAllowance: number;
    shiftAllowance: number;
    hazardAllowance: number;
  };
  uniformSizes: {
    shirt: string;
    trousers: string;
    boots: string;
  };
}

export interface ClientSite {
  id: string;
  siteCode: string;
  name: string;
  clientOrganization: string;
  subcity: string;
  address: string;
  servicesProvided: ServiceType[];
  contractStartDate: string;
  contractEndDate: string;
  contactPerson: string;
  contactPhone: string;
  securityStaffRequired: number;
  cleaningStaffRequired: number;
  securityStaffDeployed: number;
  cleaningStaffDeployed: number;
  status: 'Active' | 'Renewal Pending' | 'Terminated';
  posts: string[]; // e.g., "Main Gate Entry", "Cash Desk Corridor", "Executive Wing", "Basement Parking"
}

export interface Deployment {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  role: string;
  siteId: string;
  siteName: string;
  post: string;
  shift: ShiftType;
  securityPlatoon?: SecurityPlatoon;
  cleaningShiftWeek?: 'Week 1 (Morning)' | 'Week 2 (Afternoon)';
  assignedDate: string;
  status: 'Active' | 'Relieved' | 'Transferred' | 'Temporary';
  supervisorNotes?: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused' | 'Overtime';

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  siteId: string;
  siteName: string;
  shift: ShiftType;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  overtimeHours: number;
  markedBy: string;
  notes?: string;
}

export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Maternity / Paternity' | 'Compassionate' | 'Emergency';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  siteId: string;
  siteName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  replacementEmployeeId?: string;
  replacementEmployeeName?: string;
  reviewedBy?: string;
}

export interface IssuedClearanceItem {
  id: string;
  name: string;
  category: 'Uniform' | 'Equipment' | 'Safety Gear' | 'Credentials';
  isReturned: boolean;
  condition: 'Good' | 'Damaged' | 'Missing';
  penaltyFee: number; // in ETB
  notes?: string;
}

export interface ClearanceRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  role: string;
  siteId: string;
  siteName: string;
  exitReason: 'Resignation' | 'End of Contract' | 'Termination' | 'Mutual Separation' | 'Disciplinary';
  initiationDate: string;
  targetExitDate: string;
  status: 'In Progress' | 'Cleared' | 'On Hold' | 'Completed';
  
  // Custom issued items list by service type (Uniforms, gloves, batons, radios, etc.)
  issuedItems: IssuedClearanceItem[];
  
  // Department approvals
  siteSupervisorSignoff: {
    completed: boolean;
    signedBy?: string;
    signedDate?: string;
    remarks?: string;
  };
  storeAssetSignoff: {
    completed: boolean;
    signedBy?: string;
    signedDate?: string;
    remarks?: string;
  };
  financeSignoff: {
    completed: boolean;
    signedBy?: string;
    signedDate?: string;
    salaryAdvanceDeduction: number;
    unreturnedGearCost: number;
    finalSeveranceSettlement: number;
    remarks?: string;
  };
  hrClearanceSignoff: {
    completed: boolean;
    signedBy?: string;
    signedDate?: string;
    certificateIssued: boolean;
    certificateNumber?: string;
    remarks?: string;
  };
}

export interface Candidate {
  id: string;
  candidateCode: string;
  fullName: string;
  gender: 'Male' | 'Female';
  phone: string;
  targetService: ServiceType;
  targetRole: string;
  appliedDate: string;
  stage: 'Applied' | 'Screened' | 'Interview' | 'Background Check' | 'Offer Issued' | 'Onboarded' | 'Rejected';
  experienceYears: number;
  hasMilitaryOrPoliceExp?: boolean; // For security
  hasHospitalCommercialCleaningExp?: boolean; // For cleaning
  kebeleCardProvided: boolean;
  guarantorProvided: boolean;
  medicalFit: boolean;
  interviewScore?: number; // 0-100
  notes: string;
}

export interface OnboardingChecklist {
  id: string;
  candidateId: string;
  employeeCode: string;
  fullName: string;
  serviceType: ServiceType;
  role: string;
  progressPercent: number;
  tasks: {
    id: string;
    title: string;
    category: 'Verification' | 'Medical' | 'Contract' | 'Equipment' | 'Training';
    completed: boolean;
    completedAt?: string;
  }[];
  contractSigned: boolean;
  initialSiteAssigned?: string;
  targetStartDate: string;
  completedDate?: string;
}

export interface PayrollRecord {
  id: string;
  month: string; // e.g. "Meskerem 2019 / October 2026"
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  siteName: string;
  workingDays: number; // Out of 30 full working days
  fullWorkingDays: number; // 30 days standard across all divisions
  baseSalary: number; // Monthly 30-day contracted basic salary
  earnedBaseSalary: number; // (baseSalary / 30) * workingDays
  // Additions
  transportAllowance: number;
  mobileCardAllowance: number;
  houseAllowance: number;
  overtimeHours: number;
  overtimePay: number;
  // Legacy optional fields
  siteAllowance?: number;
  shiftAllowance?: number;
  hazardAllowance?: number;
  grossPay: number;
  // Non-Deductible Employer Contribution (11% of earned basic salary)
  pensionEmployer11Percent: number;
  // Deductions
  incomeTaxDeduction: number; // Tax
  pensionEmployeeDeduction: number; // 7% Employee Pension
  penaltiesDeduction: number; // Penalties
  foodCostSharingDeduction: number; // Food cost sharing
  loanOrUniformDeduction?: number;
  netPay: number;
  paymentStatus: 'Draft' | 'Approved' | 'Disbursed';
  bankName: string;
  accountNumber: string;
}

export type StockCategory = 
  | 'Security Uniforms & Gear' 
  | 'Cleaning Supplies & Equipment' 
  | 'Property Management & Maintenance' 
  | 'Head Office & Stationery';

export interface StockItem {
  id: string;
  itemCode: string;
  name: string;
  amharicName?: string;
  category: StockCategory;
  division: ServiceType;
  unit: 'Pcs' | 'Pairs' | 'Sets' | 'Liters' | 'Boxes' | 'Reams';
  quantityInStock: number;
  minReorderLevel: number;
  unitCostETB: number;
  isReturnable: boolean; // True for uniforms, boots, radios, tools; False for detergents, stationery
  storageLocation: string;
  lastUpdated: string;
}

export interface StockTransaction {
  id: string;
  date: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  division: ServiceType;
  transactionType: 'Received (Restock)' | 'Issued (Out)' | 'Returned (In)';
  quantity: number;
  unit: string;
  recipientOrSource: string; // Employee Name, Client Site, or Supplier
  referenceCode?: string;
  handledBy: string;
  notes?: string;
}

export interface TransferPromotionRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  type: 'Site Transfer' | 'Role Promotion' | 'Shift Change';
  fromSite: string;
  toSite: string;
  fromRole: string;
  toRole: string;
  fromShift: ShiftType;
  toShift: ShiftType;
  salaryChangeETB: number;
  effectiveDate: string;
  reason: string;
  approvedBy: string;
  status: 'Pending HR Approval' | 'Approved' | 'Executed';
}

export interface WorkExperienceRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  serviceType: ServiceType;
  role: string;
  startDate: string;
  endDate: string;
  sitesServed: string[];
  certifications: string[];
  conductRating: 'Exceptional' | 'Very Good' | 'Satisfactory';
  certificateNumber: string;
  issuedDate: string;
}

export type ManagementDepartment = 
  | 'Executive Office'
  | 'Executive Advisory'
  | 'Operations'
  | 'Human Resource'
  | 'Finance'
  | 'Property Administration'
  | 'Marketing';

export interface ManagementPerson {
  id: string;
  name: string;
  amharicName?: string;
  title: string;
  department: ManagementDepartment;
  reportsToTitle?: string;
  reportsToId?: string;
  email: string;
  phone: string;
  officeLocation: string;
  roleCategory: 'Executive' | 'Department Head' | 'HR Management' | 'Operations & Field' | 'Finance & Stores';
  responsibilities: string[];
  permissions: {
    canApproveClearance: boolean;
    canApprovePayroll: boolean;
    canManageShiftsAndDeployments: boolean;
    canManageRecruitmentAndGuarantors: boolean;
    canVerifyInventoryReturn: boolean;
    canSignWorkExperience: boolean;
    canEditEmployees: boolean;
  };
  avatarColor: string;
}


