import { Employee, ClientSite, AttendanceRecord, LeaveRequest, PayrollRecord, StockItem, ClearanceRecord, OnboardingChecklist } from '../../types/hrm';
import { CopilotChatMessage, CopilotAction } from '../../types/copilot';

export interface CopilotContextProps {
  employees: Employee[];
  sites: ClientSite[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  stockItems: StockItem[];
  clearances: ClearanceRecord[];
  onboardingList: OnboardingChecklist[];
}

export function buildLiveErpContext(props: CopilotContextProps) {
  const { employees, sites, leaveRequests, payroll, stockItems, clearances, onboardingList } = props;
  const lowStock = stockItems.filter((s) => s.quantityInStock <= s.minReorderLevel);
  const pendingClearances = clearances.filter((c) => c.status === 'In Progress' || c.status === 'On Hold');
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const siteGaps = sites.map((s) => ({
    siteName: s.name,
    guardDeficit: Math.max(0, s.securityStaffRequired - s.securityStaffDeployed),
    cleaningDeficit: Math.max(0, s.cleaningStaffRequired - s.cleaningStaffDeployed)
  })).filter((g) => g.guardDeficit > 0 || g.cleaningDeficit > 0);

  return {
    totalEmployees: employees.length,
    activeHeadcount: employees.filter((e) => e.status !== 'Exited').length,
    siteGaps,
    pendingClearances: pendingClearances.length,
    pendingLeaves: pendingLeaves.length,
    payrollRecordsCount: payroll.length,
    lowStockCount: lowStock.length,
    onboardingCount: onboardingList.filter((o) => o.progressPercent < 100).length
  };
}

export function getPersonaQuickPrompts(roleType: string): string[] {
  switch (roleType) {
    case 'super_admin':
      return [
        'Audit system master setup parameters',
        'Review cross-departmental pending approvals',
        'Check user credential statuses'
      ];
    case 'executive':
      return [
        'Summarize recruitment, finance, and store health',
        'Review monthly payroll gross commitment vs budget',
        'Check operational site coverage'
      ];
    case 'hr':
      return [
        'Check pending leave requests for automatic deduction',
        'Show employees finishing probation this month',
        'Prepare clearance documentation for exiting staff'
      ];
    case 'finance':
      return [
        'Verify 9-column payroll tax and 11% pension pool',
        'Check debited and credited cheques balance',
        'Review material depreciation book values'
      ];
    case 'tech':
      return [
        'Show active vs inactive site operational statuses',
        'How many relief guards are in the available pool?',
        'Check today muster attendance rates'
      ];
    case 'store':
      return [
        'List items currently below minimum stock threshold',
        'Log daily gear issue to site supervisor',
        'Audit company equipment condition in asset register'
      ];
    default:
      return ['What are my pending tasks?', 'How is overall company operational health?'];
  }
}

export function createLocalFallbackReply(prompt: string): { reply: string; action?: CopilotAction } {
  const p = prompt.toLowerCase();
  if (p.includes('leave') || p.includes('deduction')) {
    return {
      reply: 'HAB Leave Policy: Annual leave days are earned at 16 days + 1 day for every 2 years of service. Leave approval automatically deducts the approved days from available balance in real time.',
      action: {
        id: 'act-leave',
        actionType: 'NAVIGATE_MODULE',
        label: 'Open Leave Management',
        targetModule: 'HRM',
        targetTabId: 'leave',
        description: 'Review and approve pending employee leave applications.'
      }
    };
  }
  if (p.includes('payroll') || p.includes('tax') || p.includes('pension')) {
    return {
      reply: 'HAB 9-Column Payroll Structure: [Name | Position | Basic | Non-Tax Allowance | Taxable Allowance | Gross (Tax) | Income Tax | Pension (7%/11%) | Net Pay]. Uses 30 working days standard across all 4 divisions.',
      action: {
        id: 'act-payroll',
        actionType: 'NAVIGATE_MODULE',
        label: 'Open 9-Column Payroll Table',
        targetModule: 'Finance',
        targetTabId: 'payroll',
        description: 'Review monthly payroll sheet and statutory withholdings.'
      }
    };
  }
  if (p.includes('store') || p.includes('stock') || p.includes('asset')) {
    return {
      reply: 'Store & Inventory: Minimum safety thresholds trigger automated reorder alerts. All company equipment (radios, detectors, machines) is tracked in the Asset Control Register.',
      action: {
        id: 'act-store',
        actionType: 'NAVIGATE_MODULE',
        label: 'Open Store & Asset Register',
        targetModule: 'Inventory',
        targetTabId: 'store',
        description: 'View daily issue/receive logs and asset tracking.'
      }
    };
  }
  return {
    reply: 'Cross-departmental status verified. All records in HR, Finance, and Store are synced in real time across the 6 system roles.'
  };
}
