import {
  AttendanceRecord,
  Candidate,
  ClearanceRecord,
  ClientSite,
  Deployment,
  Employee,
  LeaveRequest,
  ManagementPerson,
  OnboardingChecklist,
  PayrollRecord,
  StockItem,
  StockTransaction,
  TransferPromotionRecord,
  WorkExperienceRecord
} from '../../types/hrm';
import { SystemMasterConfig } from '../../types/masterConfig';

export type ModuleId =
  | 'org'
  | 'recruitment'
  | 'onboarding'
  | 'management'
  | 'deployment'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'store'
  | 'transfers'
  | 'experience'
  | 'clearance'
  | 'master-setup';

export type CellTone = 'good' | 'warn' | 'bad' | 'quiet';

export interface ModuleMetric {
  label: string;
  value: string;
}

export interface ModuleColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

export interface ModuleRow {
  id: string;
  searchText: string;
  values: Record<string, string>;
  tones?: Record<string, CellTone>;
}

export interface ModuleModel {
  title: string;
  description: string;
  reportName: string;
  searchLabel: string;
  metrics: [ModuleMetric, ModuleMetric, ModuleMetric];
  columns: ModuleColumn[];
  rows: ModuleRow[];
  emptyMessage: string;
  note?: string;
}

export interface WorkspaceData {
  employees: Employee[];
  sites: ClientSite[];
  deployments: Deployment[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  clearances: ClearanceRecord[];
  candidates: Candidate[];
  onboardingList: OnboardingChecklist[];
  payroll: PayrollRecord[];
  transfers: TransferPromotionRecord[];
  workExperiences: WorkExperienceRecord[];
  managementPersons: ManagementPerson[];
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  masterConfig: SystemMasterConfig;
}
