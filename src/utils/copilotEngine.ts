import {
  Employee,
  ClientSite,
  Deployment,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  StockItem,
  ClearanceRecord,
  OnboardingChecklist,
  ManagementPerson,
} from '../types/hrm';
import {
  ErpModuleName,
  LearnedHabit,
  ProactiveNudge,
  RippleSimulationScenario,
} from '../types/copilot';
import { getRoleConfig } from './roleConfig';

export function mapTabToErpModule(tabId: string): ErpModuleName {
  switch (tabId) {
    case 'management':
    case 'recruitment':
    case 'onboarding':
    case 'attendance':
    case 'leave':
    case 'transfers':
    case 'experience':
      return 'HRM';
    case 'payroll':
      return 'Finance';
    case 'store':
      return 'Inventory';
    case 'clearance':
      return 'Asset Management';
    case 'deployment':
      return 'Property/Sales';
    case 'overview':
    case 'org':
    default:
      return 'Management Dashboard';
  }
}

export const INITIAL_LEARNED_HABITS: LearnedHabit[] = [
  {
    id: 'habit-mon-attendance-payroll',
    name: 'Monday 08:30 AM Attendance-to-Payroll Reconciliation',
    category: 'Time-Based Routine',
    confidence: 96,
    occurrences: 18,
    lastTriggered: 'Today, 08:30 AM',
    patternDescription:
      'Every Monday morning at 08:30 AM, user checks Bole Medhanialem & CBE Tower security shift attendance before approving the 30-day payroll sheet.',
    promptRule:
      'Since you usually reconcile Bole Tower and CBE security attendance before approving payroll on Mondays, I have prepared both views for you.',
    personaIds: ['mgmt-gm', 'mgmt-ceo', 'mgmt-hr-head', 'mgmt-fin-head', 'mgmt-hr-ops'],
    linkedModules: ['HRM', 'Property/Sales', 'Finance', 'Management Dashboard'],
    defaultActions: [
      {
        id: 'act-habit-reconcile',
        actionType: 'RECONCILE_BOLE_ATTENDANCE',
        label: 'Reconcile Attendance & Sync Payroll',
        targetModule: 'HRM',
        targetTabId: 'attendance',
        description: 'Verify shift attendance roll-call and sync working days to the 30-day payroll sheet.',
      },
      {
        id: 'act-habit-approve-voucher',
        actionType: 'APPROVE_PAYROLL_VOUCHER',
        label: 'Approve Payroll Voucher',
        targetModule: 'Finance',
        targetTabId: 'payroll',
        description: 'Approve pending 30-day salary vouchers for CBE bulk transfer.',
      },
    ],
  },
  {
    id: 'habit-onboard-uniform-payroll-chain',
    name: 'Guard Onboarding → Uniform Issuance → Payroll Queue Loop',
    category: 'Sequential Chain (Habit Loop)',
    confidence: 94,
    occurrences: 24,
    lastTriggered: '2 hours ago',
    patternDescription:
      'Whenever a guard or cleaner is onboarded in HRM, the next steps within 15 minutes are issuing uniform/boots in Inventory and queuing their 30-day salary record in Finance.',
    promptRule:
      'Following your standard 3-step onboarding loop (HRM → Inventory → Finance), I queued uniform issuance and initial payroll setup for newly vetted recruits.',
    personaIds: ['mgmt-gm', 'mgmt-hr-head', 'mgmt-hr-talent', 'mgmt-storekeeper', 'mgmt-fin-head'],
    linkedModules: ['HRM', 'Inventory', 'Asset Management', 'Finance'],
    defaultActions: [
      {
        id: 'act-habit-onboard-chain',
        actionType: 'ISSUE_UNIFORM_QUEUE_PAYROLL',
        label: 'Issue Uniform & Queue Payroll',
        targetModule: 'Inventory',
        targetTabId: 'onboarding',
        description: 'Issue uniform/PPE kit from Central Store and initialize 30-day salary entry in Finance.',
      },
    ],
  },
  {
    id: 'habit-eom-lease-sla-audit',
    name: 'End-of-Month Client SLA & Property Lease Collection Audit',
    category: 'Time-Based Routine',
    confidence: 91,
    occurrences: 11,
    lastTriggered: 'Yesterday, 04:45 PM',
    patternDescription:
      'During the final week of the month, user cross-checks deployed headcount at CBE Tower, EAL Cargo, and Hyatt Regency against Finance client billing and property maintenance expenses.',
    promptRule:
      'Based on your end-of-month billing routine, I cross-checked Property/Sales SLA fulfillment against Finance client invoices.',
    personaIds: ['mgmt-gm', 'mgmt-ceo', 'mgmt-ops-head', 'mgmt-fin-head'],
    linkedModules: ['Property/Sales', 'Finance', 'Management Dashboard'],
    defaultActions: [
      {
        id: 'act-habit-open-dep',
        actionType: 'NAVIGATE_MODULE',
        label: 'Inspect SLA Site Coverage',
        targetModule: 'Property/Sales',
        targetTabId: 'deployment',
        description: 'Open Client Site Deployments and Drag & Drop Scheduler.',
      },
    ],
  },
  {
    id: 'habit-leave-relief-dispatch',
    name: 'Leave Approval → Standby Relief Guard Dispatch Chain',
    category: 'Sequential Chain (Habit Loop)',
    confidence: 89,
    occurrences: 15,
    lastTriggered: 'Today, 07:50 AM',
    patternDescription:
      'Approving a leave request in HRM is immediately followed by assigning a Platoon Standby Relief Officer in Property/Operations so zero client posts remain unguarded.',
    promptRule:
      'Whenever you review pending leave requests, you immediately assign a standby relief officer to protect site SLA coverage.',
    personaIds: ['mgmt-supervisor-dan', 'mgmt-hr-ops', 'mgmt-ops-head', 'mgmt-gm'],
    linkedModules: ['HRM', 'Property/Sales', 'Finance'],
    defaultActions: [
      {
        id: 'act-habit-assign-relief',
        actionType: 'ASSIGN_RELIEF_GUARD',
        label: 'Assign Relief Guard',
        targetModule: 'Property/Sales',
        targetTabId: 'leave',
        description: 'Approve pending leave request and assign standby relief officer to the client post.',
      },
    ],
  },
  {
    id: 'habit-pref-critical-stock-first',
    name: 'First-Login Security & Cleaning Critical Stock Buffer Check',
    category: 'Preference Memory',
    confidence: 92,
    occurrences: 31,
    lastTriggered: 'Session Start',
    patternDescription:
      'Upon logging in, user checks Central Store minimum stock thresholds for Cleaning Sanitizer Drums and Security Tactical Boots before reviewing site deployments.',
    promptRule:
      'Remembering your preference to audit critical store buffers first upon login, I flagged low-stock consumables and prepared auto-restock orders.',
    personaIds: ['mgmt-storekeeper', 'mgmt-gm', 'mgmt-ops-head', 'mgmt-supervisor-dan'],
    linkedModules: ['Inventory', 'Asset Management', 'Finance', 'Property/Sales'],
    defaultActions: [
      {
        id: 'act-habit-restock-sanitizer',
        actionType: 'AUTO_RESTOCK_SANITIZER',
        label: 'Auto-Restock 20 Drums',
        targetModule: 'Inventory',
        targetTabId: 'store',
        description: 'Restock 20 Drums/Liters of Heavy-Duty Sanitizer and queue Finance PO.',
      },
    ],
  },
];

export const RIPPLE_SIMULATION_SCENARIOS: RippleSimulationScenario[] = [
  {
    id: 'sim-hrm-kazanchis-onboard',
    category: 'HRM Event',
    title: 'HRM Event: 3 Guards Onboarded for Kazanchis / CBE Center',
    triggerDescription:
      'HR Talent just completed guarantor verification for 3 new security guards assigned to Commercial Bank & Kazanchis posts.',
    tier: 2,
    tierLabel: 'Tier 2 — Workflow Handoff',
    outcomeValue: 'Harmony',
    observation:
      'HR just onboarded 3 vetted guards for Kazanchis & CBE Center—matching your 94%-confidence HRM → Inventory → Finance habit loop.',
    crossModuleImpact: [
      {
        module: 'HRM',
        impact: '3 recruits cleared medical & Kebele guarantor vetting; awaiting final deployment activation.',
      },
      {
        module: 'Inventory',
        impact: 'Requires 3 Security Uniform Sets and 3 Pairs of Tactical Boots (Size 42) from Central Store.',
      },
      {
        module: 'Property/Sales',
        impact: 'Closes the active staffing gap at CBE Headquarters & EAL Cargo Hub to reach 100% SLA compliance.',
      },
      {
        module: 'Finance',
        impact: 'Adds ETB 22,500 monthly base payroll + 11% employer pension (ETB 2,475) to the 30-day ledger.',
      },
    ],
    actions: [
      {
        id: 'sim-act-onboard-1',
        actionType: 'ISSUE_UNIFORM_QUEUE_PAYROLL',
        label: 'Issue Uniform & Queue Payroll',
        targetModule: 'Inventory',
        targetTabId: 'onboarding',
        description: 'Complete store equipment issuance and register recruits in the 30-day payroll sheet.',
      },
      {
        id: 'sim-act-onboard-2',
        actionType: 'ASSIGN_RELIEF_GUARD',
        label: 'Deploy to Open Site Posts',
        targetModule: 'Property/Sales',
        targetTabId: 'deployment',
        description: 'Assign newly onboarded officers to unfilled client posts immediately.',
      },
    ],
  },
  {
    id: 'sim-ops-property-maintenance',
    category: 'Operations / Property Event',
    title: 'Operations / Property Event: Bole Complex Generator & Scrubber Service',
    triggerDescription:
      'Tenant facility ticket logged at Bole Medhanialem Mixed-Use Complex for backup generator servicing and floor scrubber brush replacement.',
    tier: 3,
    tierLabel: 'Tier 3 — Operational Risk',
    outcomeValue: 'Security',
    observation:
      'Urgent property maintenance ticket logged at Bole Medhanialem Complex; standby generator & heavy floor scrubber require immediate servicing.',
    crossModuleImpact: [
      {
        module: 'Property/Sales',
        impact: 'Bole Medhanialem Mixed-Use Complex SLA requires <4hr maintenance response for common-area power.',
      },
      {
        module: 'Asset Management',
        impact: 'Heavy-Duty Rotary Scrubber #2 and 250kVA Standby Generator flagged for preventive service.',
      },
      {
        module: 'Inventory',
        impact: 'Reserves 2 replacement rotary brushes and 15L industrial lubricant from Bay C (Property Maintenance).',
      },
      {
        module: 'Finance',
        impact: 'Queues ETB 14,500 maintenance expense voucher and billable tenant service charge invoice.',
      },
    ],
    actions: [
      {
        id: 'sim-act-maint-1',
        actionType: 'SCHEDULE_GENERATOR_MAINTENANCE',
        label: 'Dispatch Technician & Reserve Parts',
        targetModule: 'Asset Management',
        targetTabId: 'store',
        description: 'Reserve maintenance parts in Store and log preventive asset service order.',
      },
      {
        id: 'sim-act-maint-2',
        actionType: 'APPROVE_PAYROLL_VOUCHER',
        label: 'Approve Maintenance Voucher',
        targetModule: 'Finance',
        targetTabId: 'payroll',
        description: 'Approve expense voucher in Finance for immediate technician dispatch.',
      },
    ],
  },
  {
    id: 'sim-inv-sanitizer-shortage',
    category: 'Inventory / Asset Event',
    title: 'Inventory Event: Cleaning Sanitizer & Boots Below Minimum Threshold',
    triggerDescription:
      'Central Store telemetry detects hospital-grade floor disinfectant and tactical boots have dropped below safe reorder buffers.',
    tier: 3,
    tierLabel: 'Tier 3 — Operational Risk',
    outcomeValue: 'Security',
    observation:
      'Cleaning sanitizer stock and tactical boots are below minimum threshold while 2 finance vouchers have been pending for 48 hours.',
    crossModuleImpact: [
      {
        module: 'Inventory',
        impact: 'Hospital-grade sanitizer and tactical boots are below reorder buffer ahead of Monday shift rotation.',
      },
      {
        module: 'Property/Sales',
        impact: "Risks custodial SLA disruption at St. Paul's Millennium Hospital and Hyatt Regency.",
      },
      {
        module: 'Finance',
        impact: 'Emergency purchase requisition (ETB 48,000) prepared for immediate Finance voucher approval.',
      },
      {
        module: 'Management Dashboard',
        impact: 'Updates Executive Store Safety Buffer KPI from Warning back to 100% Nominal.',
      },
    ],
    actions: [
      {
        id: 'sim-act-restock-1',
        actionType: 'AUTO_RESTOCK_SANITIZER',
        label: 'Auto-Restock 20 Drums',
        targetModule: 'Inventory',
        targetTabId: 'store',
        description: 'Immediately restock 20 drums of sanitizer and log incoming warehouse transaction.',
      },
      {
        id: 'sim-act-restock-2',
        actionType: 'AUTO_RESTOCK_BOOTS',
        label: 'Auto-Restock 25 Pairs Boots',
        targetModule: 'Inventory',
        targetTabId: 'store',
        description: 'Restock 25 pairs of tactical boots for incoming security recruits.',
      },
    ],
  },
  {
    id: 'sim-fin-voucher-clearance',
    category: 'Finance Event',
    title: 'Finance Event: 30-Day Payroll & Exit Clearance Voucher Approval',
    triggerDescription:
      'Finance department processes pending 30-day salary disbursement and Gate #3 unreturned property deductions.',
    tier: 2,
    tierLabel: 'Tier 2 — Workflow Handoff',
    outcomeValue: 'Oneness',
    observation:
      'Finance has 30-day payroll vouchers and exit clearance settlements ready—approving now closes pending handoffs for HRM and Store.',
    crossModuleImpact: [
      {
        module: 'Finance',
        impact: 'Finalizes 30-day net bank transfer sheet and deducts unreturned store gear from final severance.',
      },
      {
        module: 'HRM',
        impact: 'Notifies HR Administration of task closure so authenticated Work Experience Certificates can be issued.',
      },
      {
        module: 'Asset Management',
        impact: 'Reconciles Gate #2 & Gate #3 property ledger with 100% cost recovery.',
      },
      {
        module: 'Management Dashboard',
        impact: 'Locks monthly gross operating margin and updates executive cashflow metrics.',
      },
    ],
    actions: [
      {
        id: 'sim-act-fin-1',
        actionType: 'APPROVE_PAYROLL_VOUCHER',
        label: 'Approve Voucher & Disburse',
        targetModule: 'Finance',
        targetTabId: 'payroll',
        description: 'Mark all pending 30-day payroll records as Approved/Disbursed.',
      },
      {
        id: 'sim-act-fin-2',
        actionType: 'APPROVE_CLEARANCE_SETTLEMENT',
        label: 'Sign Off Clearance Gate #3',
        targetModule: 'Asset Management',
        targetTabId: 'clearance',
        description: 'Complete Finance & HR clearance sign-offs for pending exit records.',
      },
    ],
  },
];

export function computeProactiveNudges(params: {
  employees: Employee[];
  sites: ClientSite[];
  deployments: Deployment[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  stockItems: StockItem[];
  clearances: ClearanceRecord[];
  onboardingList: OnboardingChecklist[];
  activeUser: ManagementPerson;
}): ProactiveNudge[] {
  const {
    sites,
    attendance,
    leaveRequests,
    payroll,
    stockItems,
    clearances,
    onboardingList,
    activeUser,
  } = params;

  const roleConfig = getRoleConfig(activeUser);
  const lowStockItems = stockItems.filter((item) => item.quantityInStock <= item.minReorderLevel);
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');
  const pendingPayrolls = payroll.filter((p) => p.paymentStatus !== 'Disbursed');
  const incompleteOnboarding = onboardingList.filter((o) => o.progressPercent < 100);
  const pendingClearances = clearances.filter((c) => c.status === 'In Progress');
  const understaffedSites = sites.filter(
    (s) =>
      s.securityStaffDeployed < s.securityStaffRequired ||
      s.cleaningStaffDeployed < s.cleaningStaffRequired
  );
  const absentOrLateCount = attendance.filter(
    (a) => a.status === 'Absent' || a.status === 'Late'
  ).length;

  const nudges: ProactiveNudge[] = [];

  // Tier 3 — Operational Risk (Security): Low Stock & Pending Finance Vouchers
  if (lowStockItems.length > 0 || pendingPayrolls.length > 0) {
    const lowNames = lowStockItems.map((i) => `${i.name} (${i.quantityInStock} ${i.unit})`).join(', ');
    nudges.push({
      id: 'nudge-tier3-stock-voucher',
      tier: 3,
      tierLabel: 'Tier 3 — Operational Risk',
      outcomeValue: 'Security',
      personaTarget: ['executive', 'storekeeper', 'finance', 'site_supervisor'],
      routineReason:
        'Triggered by Preference Memory (92% confidence) + Live Inventory/Finance threshold monitor.',
      observation:
        lowStockItems.length > 0
          ? `Critical inventory buffer alert: ${lowNames} is at or below minimum threshold while ${pendingPayrolls.length} payroll/finance vouchers await final disbursement.`
          : `${pendingPayrolls.length} finance payroll vouchers are awaiting final sign-off for CBE bank transfer.`,
      crossModuleImpact: [
        {
          module: 'Inventory',
          impact:
            lowStockItems.length > 0
              ? `${lowStockItems.length} item(s) require immediate restock to protect weekly shift rotation.`
              : 'All central warehouse bays are above minimum safety stock.',
        },
        {
          module: 'Property/Sales',
          impact: `Prevents equipment and sanitizer shortages across ${sites.length} active client facilities.`,
        },
        {
          module: 'Finance',
          impact: `${pendingPayrolls.length} voucher record(s) queued for approval and CBE bulk disbursement.`,
        },
        {
          module: 'Management Dashboard',
          impact: 'Protects 98%+ SLA contract fulfillment and monthly operating margin.',
        },
      ],
      actions: [
        ...(lowStockItems.length > 0
          ? [
              {
                id: 'nudge-act-restock-san',
                actionType: 'AUTO_RESTOCK_SANITIZER' as const,
                label: 'Auto-Restock 20 Drums',
                targetModule: 'Inventory' as const,
                targetTabId: 'store',
                description: 'Restock 20 Drums/Units of low-buffer cleaning & tactical supplies in Central Store.',
              },
            ]
          : []),
        ...(pendingPayrolls.length > 0
          ? [
              {
                id: 'nudge-act-approve-pay',
                actionType: 'APPROVE_PAYROLL_VOUCHER' as const,
                label: 'Approve Voucher',
                targetModule: 'Finance' as const,
                targetTabId: 'payroll',
                description: 'Approve pending 30-day payroll vouchers for immediate bank disbursement.',
              },
            ]
          : []),
      ],
      timestamp: 'Live Telemetry',
    });
  }

  // Tier 2 — Workflow Handoff (Harmony): Onboarding -> Store Uniform -> Payroll Queue
  if (incompleteOnboarding.length > 0 || understaffedSites.length > 0) {
    const recruitNames = incompleteOnboarding.map((o) => o.fullName).join(', ');
    nudges.push({
      id: 'nudge-tier2-onboarding-handoff',
      tier: 2,
      tierLabel: 'Tier 2 — Workflow Handoff',
      outcomeValue: 'Harmony',
      personaTarget: ['executive', 'hr_talent', 'storekeeper', 'finance', 'hr_ops'],
      routineReason:
        'Sequential Chain (94% confidence): HRM Onboarding → Inventory Uniform Issue → Finance Payroll Setup.',
      observation:
        incompleteOnboarding.length > 0
          ? `HR has ${incompleteOnboarding.length} recruit(s) (${recruitNames}) in onboarding—approve their uniform issuance and 30-day payroll setup to close ${understaffedSites.length} site coverage gap(s)?`
          : `${understaffedSites.length} client site(s) have open posts ready for immediate relief guard assignment.`,
      crossModuleImpact: [
        {
          module: 'HRM',
          impact: `${incompleteOnboarding.length} recruit checklist(s) ready for equipment & contract completion.`,
        },
        {
          module: 'Inventory',
          impact: 'Deducts issued uniform shirts, trousers, and boots from Central Store.',
        },
        {
          module: 'Finance',
          impact: 'Initializes 30-day salary + 11% employer pension ledger entry.',
        },
        {
          module: 'Property/Sales',
          impact: `Fills open posts at ${understaffedSites.map((s) => s.name).join(' & ') || 'client sites'}.`,
        },
      ],
      actions: [
        ...(incompleteOnboarding.length > 0
          ? [
              {
                id: 'nudge-act-onboard-chain',
                actionType: 'ISSUE_UNIFORM_QUEUE_PAYROLL' as const,
                label: 'Issue Uniform & Queue Payroll',
                targetModule: 'Inventory' as const,
                targetTabId: 'onboarding',
                description: 'Complete uniform kit issuance in Store and queue recruits in 30-Day Payroll.',
              },
            ]
          : []),
        ...(pendingLeaves.length > 0 || understaffedSites.length > 0
          ? [
              {
                id: 'nudge-act-assign-relief',
                actionType: 'ASSIGN_RELIEF_GUARD' as const,
                label: 'Assign Relief Guard',
                targetModule: 'Property/Sales' as const,
                targetTabId: 'deployment',
                description: 'Approve leave cover and dispatch standby relief guard to understaffed site posts.',
              },
            ]
          : []),
      ],
      timestamp: 'Habit Loop Detected',
    });
  }

  // Tier 1 — Habit Shortcut (Convenience): Morning Shift & Attendance-to-Payroll Check
  nudges.push({
    id: 'nudge-tier1-morning-routine',
    tier: 1,
    tierLabel: 'Tier 1 — Habit Shortcut',
    outcomeValue: 'Accomplishment',
    personaTarget: ['executive', 'site_supervisor', 'hr_ops', 'finance', 'legal'],
    routineReason:
      'Time-Based Routine (96% confidence): Since you usually reconcile Bole & CBE attendance before reviewing payroll or clearances, both workflows are staged.',
    observation: `Since you usually run your shift attendance and clearance check at this hour (${absentOrLateCount} attendance anomalies, ${pendingClearances.length} active clearances), I have prepared 1-click reconciliation for you.`,
    crossModuleImpact: [
      {
        module: 'HRM',
        impact: `Verifies ${attendance.length} daily shift roll-call logs across Security & Cleaning divisions.`,
      },
      {
        module: 'Asset Management',
        impact: `${pendingClearances.length} exit clearance record(s) awaiting property & severance sign-off.`,
      },
      {
        module: 'Finance',
        impact: 'Syncs verified working days (out of 30) directly to the monthly payroll sheet.',
      },
    ],
    actions: [
      {
        id: 'nudge-act-reconcile-att',
        actionType: 'RECONCILE_BOLE_ATTENDANCE',
        label: 'Reconcile Morning Attendance',
        targetModule: 'HRM',
        targetTabId: 'attendance',
        description: 'Mark pending roll-call anomalies resolved and sync working days with Payroll.',
      },
      ...(pendingClearances.length > 0
        ? [
            {
              id: 'nudge-act-clear-settle',
              actionType: 'APPROVE_CLEARANCE_SETTLEMENT' as const,
              label: 'Sign Off Exit Clearance',
              targetModule: 'Asset Management' as const,
              targetTabId: 'clearance',
              description: 'Verify returned store gear and finalize clearance sign-off gates.',
            },
          ]
        : []),
    ],
    timestamp: 'Routine Shortcut',
  });

  // Sort so nudges matching the active user's role type come first, then by highest urgency tier (3 -> 2 -> 1)
  return nudges.sort((a, b) => {
    const aMatch = a.personaTarget.includes(roleConfig.type) ? 1 : 0;
    const bMatch = b.personaTarget.includes(roleConfig.type) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return b.tier - a.tier;
  });
}
