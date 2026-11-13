import { ManagementPerson, CoreRoleType } from '../types/hrm';

export type RoleInterfaceType =
  | CoreRoleType
  | 'storekeeper'
  | 'site_supervisor'
  | 'hr_talent'
  | 'hr_ops'
  | 'legal';

export interface RoleConfig {
  type: RoleInterfaceType;
  title: string;
  amharicTitle: string;
  badge: string;
  badgeAmharic: string;
  badgeColor: string;
  defaultTab: string;
  allowedTabs: string[] | 'ALL';
  description: string;
  amharicDescription: string;
  readOnly?: boolean;
  primaryActions: {
    label: string;
    amharicLabel: string;
    tabId: string;
    icon: string;
  }[];
  capabilities: {
    label: string;
    allowed: boolean;
  }[];
}

export const ROLE_ALLOWED_TABS: Record<CoreRoleType, string[] | 'ALL'> = {
  super_admin: 'ALL',
  executive: [
    'overview',
    'management',
    'deployment',
    'attendance',
    'leave',
    'recruitment',
    'onboarding',
    'payroll',
    'store',
    'clearance',
    'experience'
  ],
  hr: [
    'overview',
    'management',
    'deployment',
    'attendance',
    'leave',
    'recruitment',
    'onboarding',
    'clearance',
    'experience',
    'store'
  ],
  finance: ['overview', 'payroll', 'store', 'clearance', 'attendance']
};

export function getRoleAllowedTabs(target?: string | ManagementPerson): string[] | 'ALL' {
  const id = typeof target === 'string' ? target : target?.role || target?.id;
  switch (id) {
    case 'super_admin':
    case 'admin':
    case 'mgmt-gm':
    case 'mgmt-ops-head':
      return ROLE_ALLOWED_TABS.super_admin;
    case 'executive':
    case 'ceo':
    case 'mgmt-ceo':
      return ROLE_ALLOWED_TABS.executive;
    case 'hr':
    case 'mgmt-hr-head':
    case 'mgmt-hr-ops':
    case 'mgmt-hr-talent':
      return ROLE_ALLOWED_TABS.hr;
    case 'finance':
    case 'mgmt-fin-head':
      return ROLE_ALLOWED_TABS.finance;
    case 'mgmt-storekeeper':
      return ['overview', 'store', 'clearance', 'onboarding', 'management'];
    case 'mgmt-supervisor-dan':
      return ['overview', 'attendance', 'deployment', 'leave', 'store', 'clearance'];
    case 'mgmt-legal':
      return ['overview', 'clearance', 'experience', 'management'];
    default:
      return 'ALL';
  }
}

export function getRoleConfig(person?: ManagementPerson): RoleConfig {
  const key = person?.role || person?.id || 'admin';

  switch (key) {
    case 'super_admin':
    case 'admin':
      return {
        type: 'super_admin',
        title: 'Super Admin & System Controller',
        amharicTitle: 'የሲስተም ዋና አስተዳዳሪ (ሙሉ ፈቃድ)',
        badge: 'Super Admin',
        badgeAmharic: 'ዋና አስተዳዳሪ',
        badgeColor: 'bg-slate-800 text-white border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        defaultTab: 'overview',
        allowedTabs: 'ALL',
        description: 'Full system authority: master setups, system parameters, credential administration, and all functional modules.',
        amharicDescription: 'የሲስተም ማስተር ሴትአፕ፣ የተጠቃሚዎች መለያ አስተዳደር እና ሁሉንም ሞጁሎች የመቆጣጠር ሙሉ ስልጣን።',
        readOnly: false,
        primaryActions: [
          { label: 'System Master Setup', amharicLabel: 'ማስተር ሴትአፕ', tabId: 'master-setup', icon: 'Sliders' },
          { label: 'Corporate Overview', amharicLabel: 'አጠቃላይ ዳሽቦርድ', tabId: 'overview', icon: 'LayoutDashboard' },
          { label: '30-Day Payroll Sheet', amharicLabel: 'የደመወዝ መዝገብ', tabId: 'payroll', icon: 'CreditCard' }
        ],
        capabilities: [
          { label: 'System Master Setup & Accounts', allowed: true },
          { label: 'All 12 HRM & Operations Modules', allowed: true },
          { label: '30-Day Payroll Sheet & Disbursement', allowed: true },
          { label: 'All Exit Clearance Sign-offs', allowed: true },
          { label: 'Staff Roster & Deployments', allowed: true }
        ]
      };

    case 'executive':
    case 'ceo':
    case 'mgmt-ceo':
    case 'mgmt-gm':
    case 'mgmt-ops-head':
      return {
        type: 'executive',
        title: 'CEO Executive Oversight (Read-Only)',
        amharicTitle: 'ዋና ሥራ አስፈፃሚ (ተቆጣጣሪ — የንባብ ብቻ)',
        badge: 'CEO Overview',
        badgeAmharic: 'ዋና ሥራ አስፈፃሚ',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
        defaultTab: 'overview',
        allowedTabs: ROLE_ALLOWED_TABS.executive,
        description: 'Executive read-only visibility into company-wide operational health, headcount, payroll costs, and divisional dashboards.',
        amharicDescription: 'በ4ቱም ዘርፎች፣ በሰው ኃይል፣ በስራ ክንውን እና በፋይናንስ ወጪዎች ላይ አጠቃላይ የተቆጣጣሪነት እይታ።',
        readOnly: true,
        primaryActions: [
          { label: 'Corporate Overview', amharicLabel: 'አጠቃላይ ዳሽቦርድ', tabId: 'overview', icon: 'LayoutDashboard' },
          { label: 'Review Payroll Costs', amharicLabel: 'የደመወዝ ወጪዎች', tabId: 'payroll', icon: 'CreditCard' },
          { label: 'Workforce Deployment', amharicLabel: 'የጣቢያዎች ድልድል', tabId: 'deployment', icon: 'MapPin' }
        ],
        capabilities: [
          { label: 'Company-Wide Dashboard Oversight', allowed: true },
          { label: 'Read-Only Payroll & Cost Review', allowed: true },
          { label: 'Read-Only Shift & Deployment View', allowed: true },
          { label: 'Direct Record Mutation / Edits', allowed: false },
          { label: 'System Master Setup Access', allowed: false }
        ]
      };

    case 'hr':
    case 'mgmt-hr-head':
    case 'mgmt-hr-ops':
    case 'mgmt-hr-talent':
      return {
        type: 'hr',
        title: 'Human Resource & Workforce Operations',
        amharicTitle: 'የሰው ኃይል እና ሰራተኞች አስተዳደር',
        badge: 'HR Head',
        badgeAmharic: 'የሰው ኃይል ኃላፊ',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700',
        defaultTab: 'management',
        allowedTabs: ROLE_ALLOWED_TABS.hr,
        description: 'Authorized to manage employee lifecycle: dossiers, recruitment, shifts, attendance, leaves, transfers, and clearances.',
        amharicDescription: 'የሰራተኞች መዝገብ፣ ምልመላ፣ የሺፍት ድልድል፣ አቴንዳንስ፣ ፈቃዶች እና የስንብት ክሊራንስ አስተዳደር።',
        readOnly: false,
        primaryActions: [
          { label: 'Employee Dossiers', amharicLabel: 'የሰራተኞች መዝገብ', tabId: 'management', icon: 'Users' },
          { label: 'Shift Deployments', amharicLabel: 'የጣቢያዎች ድልድል', tabId: 'deployment', icon: 'MapPin' },
          { label: 'Clearance HR Gates', amharicLabel: 'የስንብት ክሊራንስ', tabId: 'clearance', icon: 'LogOut' }
        ],
        capabilities: [
          { label: 'Manage Employee Dossiers & Intake', allowed: true },
          { label: 'Configure Shifts & Deployments', allowed: true },
          { label: 'Clearance Gates #1, #2 & #4', allowed: true },
          { label: 'Edit 30-Day Payroll Sheet', allowed: false },
          { label: 'System Master Setup Access', allowed: false }
        ]
      };

    case 'finance':
    case 'mgmt-fin-head':
      return {
        type: 'finance',
        title: 'Finance, 30-Day Payroll & Store Valuation',
        amharicTitle: 'የፋይናንስ፣ የ30 ቀን ደመወዝ እና የስቶክ ሂሳብ ክፍል',
        badge: 'Finance & Payroll Head',
        badgeAmharic: 'የፋይናንስና ደመወዝ ኃላፊ',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
        defaultTab: 'payroll',
        allowedTabs: ROLE_ALLOWED_TABS.finance,
        description: 'Authorized to edit 30-day payroll sheets, additions/deductions, 11% pension, bank disbursements, and clearance finance sign-off.',
        amharicDescription: 'የ30 ቀን የደመወዝ ሉህ፣ አበሎችና ተቀናሾች፣ 11% የአሰሪ ጡረታ፣ የባንክ ክፍያ እና የስንብት ሂሳብ ማጽደቂያ።',
        readOnly: false,
        primaryActions: [
          { label: '30-Day Payroll Sheet', amharicLabel: 'የ30 ቀን ደመወዝ መዝገብ', tabId: 'payroll', icon: 'CreditCard' },
          { label: 'Clearance Finance Sign-off', amharicLabel: 'የስንብት ሂሳብ አጽድቅ', tabId: 'clearance', icon: 'LogOut' },
          { label: 'Store Valuation Audit', amharicLabel: 'የስቶክ ዋጋ ኦዲት', tabId: 'store', icon: 'Package' }
        ],
        capabilities: [
          { label: 'Edit & Disburse 30-Day Payroll', allowed: true },
          { label: 'Clearance Gate #3 (Finance Pay)', allowed: true },
          { label: 'Store Valuation & Inventory Audit', allowed: true },
          { label: 'Edit Employee HR Dossiers', allowed: false },
          { label: 'Manage Shift Rosters', allowed: false }
        ]
      };

    default:
      return {
        type: 'super_admin',
        title: 'Super Admin & System Controller',
        amharicTitle: 'የሲስተም ዋና አስተዳዳሪ (ሙሉ ፈቃድ)',
        badge: person?.title || 'Super Admin',
        badgeAmharic: person?.amharicName ? `${person.amharicName} (ዋና አስተዳዳሪ)` : 'ዋና አስተዳዳሪ',
        badgeColor: 'bg-slate-800 text-white border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        defaultTab: 'overview',
        allowedTabs: 'ALL',
        description: 'Full system authority across all modules.',
        amharicDescription: 'በሁሉም ዘርፎችና ሞጁሎች ላይ ሙሉ ስልጣን።',
        readOnly: false,
        primaryActions: [
          { label: 'System Master Setup', amharicLabel: 'ማስተር ሴትአፕ', tabId: 'master-setup', icon: 'Sliders' },
          { label: 'Corporate Overview', amharicLabel: 'አጠቃላይ ዳሽቦርድ', tabId: 'overview', icon: 'LayoutDashboard' }
        ],
        capabilities: [
          { label: 'All Modules & System Setup', allowed: true }
        ]
      };
  }
}
