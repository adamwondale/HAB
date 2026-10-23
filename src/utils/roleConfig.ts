import { ManagementPerson } from '../types/hrm';

export type RoleInterfaceType = 
  | 'executive'
  | 'finance'
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

export function getRoleAllowedTabs(userId?: string): string[] | 'ALL' {
  switch (userId) {
    case 'mgmt-fin-head':
      return ['overview', 'payroll', 'store', 'clearance', 'attendance'];
    case 'mgmt-storekeeper':
      return ['overview', 'store', 'clearance', 'onboarding', 'management'];
    case 'mgmt-supervisor-dan':
      return ['overview', 'attendance', 'deployment', 'leave', 'store', 'clearance'];
    case 'mgmt-hr-talent':
      return ['overview', 'recruitment', 'onboarding', 'management', 'experience'];
    case 'mgmt-hr-ops':
      return ['overview', 'deployment', 'attendance', 'leave', 'transfers', 'store', 'management', 'payroll'];
    case 'mgmt-legal':
      return ['overview', 'clearance', 'experience', 'management'];
    case 'mgmt-ceo':
    case 'mgmt-ops-head':
    case 'mgmt-hr-head':
    default:
      return 'ALL';
  }
}

export function getRoleConfig(person?: ManagementPerson): RoleConfig {
  const id = person?.id || 'mgmt-hr-head';

  switch (id) {
    case 'mgmt-fin-head':
      return {
        type: 'finance',
        title: 'Finance, 30-Day Payroll & Store Valuation',
        amharicTitle: 'የፋይናንስ፣ የ30 ቀን ደመወዝ እና የስቶክ ሂሳብ ክፍል',
        badge: 'Finance & Payroll Head',
        badgeAmharic: 'የፋይናንስና ደመወዝ ኃላፊ',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
        defaultTab: 'payroll',
        allowedTabs: ['overview', 'payroll', 'store', 'clearance', 'attendance'],
        description: 'Authorized to edit the 30-day payroll sheet, additions/deductions, 11% non-deductible pension, bank disbursements, and clearance financial settlements.',
        amharicDescription: 'የ30 ቀን የደመወዝ ሉህ፣ አበሎችና ተቀናሾች፣ 11% የአሰሪ ጡረታ፣ የባንክ ክፍያ እና የስንብት ሂሳብ ማጽደቂያ።',
        primaryActions: [
          { label: '30-Day Payroll Sheet', amharicLabel: 'የ30 ቀን ደመወዝ መዝገብ', tabId: 'payroll', icon: 'CreditCard' },
          { label: 'Clearance Finance Sign-off', amharicLabel: 'የስንብት ሂሳብ አጽድቅ', tabId: 'clearance', icon: 'LogOut' },
          { label: 'Store Valuation Audit', amharicLabel: 'የስቶክ ዋጋ ኦዲት', tabId: 'store', icon: 'Package' }
        ],
        capabilities: [
          { label: 'Edit & Disburse 30-Day Payroll', allowed: true },
          { label: 'Clearance Gate #3 (Finance Pay)', allowed: true },
          { label: 'Store & Stock Valuation Control', allowed: true },
          { label: 'Edit Employee HR Dossiers', allowed: false },
          { label: 'Manage Shift Rosters', allowed: false }
        ]
      };

    case 'mgmt-storekeeper':
      return {
        type: 'storekeeper',
        title: 'Central Logistics & Store Stock Management',
        amharicTitle: 'የማዕከላዊ ንብረትና ስቶክ ቁጥጥር ክፍል',
        badge: 'Store & Equipment Controller',
        badgeAmharic: 'የዕቃና ስቶክ ተቆጣጣሪ',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
        defaultTab: 'store',
        allowedTabs: ['overview', 'store', 'clearance', 'onboarding', 'management'],
        description: 'Scoped to store/stock inventory across all 4 divisions, property handover sign-offs, uniform sizing directory, and unreturned gear deductions.',
        amharicDescription: 'የ4ቱም ዘርፎች የስቶክ ክምችት፣ የንብረት ርክክብ፣ የዩኒፎርም እደላ እና ያልተመለሱ ዕቃዎች ተቀናሽ ማረጋገጫ።',
        primaryActions: [
          { label: 'Store & Stock Ledger', amharicLabel: 'የስቶክ እና ንብረት መዝገብ', tabId: 'store', icon: 'Package' },
          { label: 'Verify Property Return', amharicLabel: 'የንብረት ርክክብ አረጋግጥ', tabId: 'clearance', icon: 'LogOut' },
          { label: 'Uniform Sizing Directory', amharicLabel: 'የሰራተኞች ልክ መዝገብ', tabId: 'management', icon: 'Users' }
        ],
        capabilities: [
          { label: 'Issue, Restock & Add Store Items', allowed: true },
          { label: 'Clearance Gate #2 (Store Return)', allowed: true },
          { label: 'Employee Uniform Sizing View', allowed: true },
          { label: 'Approve Payroll / Salaries', allowed: false },
          { label: 'Grant Final HR Release', allowed: false }
        ]
      };

    case 'mgmt-supervisor-dan':
      return {
        type: 'site_supervisor',
        title: 'Field Operations & Site Patrol',
        amharicTitle: 'የመስክ ቁጥጥር እና የጥበቃ ጣቢያዎች አመራር',
        badge: 'Field Site Supervisor',
        badgeAmharic: 'የመስክ ጣቢያዎች ሱፐርቫይዘር',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-700',
        defaultTab: 'attendance',
        allowedTabs: ['overview', 'attendance', 'deployment', 'leave', 'store', 'clearance'],
        description: 'Scoped to daily guard roll-call attendance, active post coverage, site requisitions, shift relief requests, and Site Supervisor clearance sign-offs.',
        amharicDescription: 'የዕለት የጥበቃ አባላት የተሟላ መገኘት ቁጥጥር፣ የጣቢያዎች ድልድል እና የአደጋ ጊዜ ተረኛ ቅያሬ።',
        primaryActions: [
          { label: 'Mark Shift Attendance', amharicLabel: 'የተረኛ አቴንዳንስ መዝግብ', tabId: 'attendance', icon: 'Clock' },
          { label: 'Review Post Allocations', amharicLabel: 'የጣቢያዎች ድልድል ተመልከት', tabId: 'deployment', icon: 'MapPin' },
          { label: 'Site Clearance Handover', amharicLabel: 'የጣቢያ ርክክብ አረጋግጥ', tabId: 'clearance', icon: 'LogOut' }
        ],
        capabilities: [
          { label: 'Mark Roll-Call & Overtime', allowed: true },
          { label: 'Clearance Gate #1 (Site Handover)', allowed: true },
          { label: 'Deploy & Rotate Site Posts', allowed: true },
          { label: 'Approve Payroll Ledger', allowed: false },
          { label: 'Edit Master Employee Salary', allowed: false }
        ]
      };

    case 'mgmt-hr-talent':
      return {
        type: 'hr_talent',
        title: 'Talent Acquisition & Employee Records',
        amharicTitle: 'የቅጥር፣ የዋስ ማረጋገጫና ሰነዶች ክፍል',
        badge: 'Talent Acquisition & Records',
        badgeAmharic: 'የቅጥርና ሰነድ ኃላፊ',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700',
        defaultTab: 'recruitment',
        allowedTabs: ['overview', 'recruitment', 'onboarding', 'management', 'experience'],
        description: 'Scoped to candidate recruitment pipeline, Kebele & Guarantor verifications, onboarding tasks, and work certificates.',
        amharicDescription: 'የእጩዎች ምልመላ፣ የነዋሪነትና የዋስትና ሰነዶች ማጣራት፣ አዳዲስ ቅጥሮች እና የስራ ልምድ ምስክር ወረቀት።',
        primaryActions: [
          { label: 'Review Candidates', amharicLabel: 'እጩዎችን መርምር', tabId: 'recruitment', icon: 'UserPlus' },
          { label: 'Verify Guarantors', amharicLabel: 'የዋስትና ሰነዶች አረጋግጥ', tabId: 'onboarding', icon: 'CheckSquare' },
          { label: 'Issue Experience Certificate', amharicLabel: 'የስራ ልምድ ሰርተፍኬት አውጣ', tabId: 'experience', icon: 'Award' }
        ],
        capabilities: [
          { label: 'Recruit & Vet Guarantors', allowed: true },
          { label: 'Register & Edit Employees', allowed: true },
          { label: 'Issue Experience Certificates', allowed: true },
          { label: 'Approve Payroll Disbursement', allowed: false },
          { label: 'Manage Store Inventory', allowed: false }
        ]
      };

    case 'mgmt-hr-ops':
      return {
        type: 'hr_ops',
        title: 'HR Operations & Cyclic Rosters',
        amharicTitle: 'የሰው ኃይል ኦፕሬሽንስና የሺፍት ሮስተር',
        badge: 'HR Operations Officer',
        badgeAmharic: 'የኤችአር ኦፕሬሽንስ ኃላፊ',
        badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-700',
        defaultTab: 'deployment',
        allowedTabs: ['overview', 'deployment', 'attendance', 'leave', 'transfers', 'store', 'management', 'payroll'],
        description: 'Scoped to 24h duty rosters (Platoons Alpha/Bravo/Charlie), Monday cleaning shift rotation, post reassignments, and attendance-to-payroll audit.',
        amharicDescription: 'የ24 ሰዓት ጥበቃ ፕላቶን ሮስተር፣ የሰኞ የፅዳት ሺፍት ቅያሬ እና የጣቢያዎች ሰራተኛ ዝውውር።',
        primaryActions: [
          { label: 'Manage Post Deployments', amharicLabel: 'የጣቢያዎች ድልድል አስተዳድር', tabId: 'deployment', icon: 'MapPin' },
          { label: 'Audit Attendance & Overtime', amharicLabel: 'አቴንዳንስና የትርፍ ሰዓት ኦዲት', tabId: 'attendance', icon: 'Clock' },
          { label: 'Process Site Transfers', amharicLabel: 'የሰራተኛ ዝውውር አከናውን', tabId: 'transfers', icon: 'ArrowRightLeft' }
        ],
        capabilities: [
          { label: 'Deploy Staff & Rotate Shifts', allowed: true },
          { label: 'Approve Leave & Transfers', allowed: true },
          { label: 'View-Only Payroll Audit', allowed: true },
          { label: 'Disburse Bank Payroll', allowed: false },
          { label: 'Grant Final Exit Clearance', allowed: false }
        ]
      };

    case 'mgmt-legal':
      return {
        type: 'legal',
        title: 'Legal Advisory & Labor Compliance',
        amharicTitle: 'የህግ አማካሪ እና የስራ ህግ ተገዢነት',
        badge: 'Legal Advisor',
        badgeAmharic: 'የህግ አማካሪ',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-700',
        defaultTab: 'clearance',
        allowedTabs: ['overview', 'clearance', 'experience', 'management'],
        description: 'Scoped to Labor Proclamation No. 1156/2019 legal compliance, guarantor legal dossiers, severance settlements, and contract termination sign-offs.',
        amharicDescription: 'በአሰሪና ሠራተኛ አዋጅ ቁ. 1156/2011 መሰረት የውል ማቋረጥ፣ የስንብት ክፍያ እና ህጋዊ የቅሬታ ኦዲት።',
        primaryActions: [
          { label: 'Audit Exit Clearances', amharicLabel: 'የስንብት ህጋዊነት መርምር', tabId: 'clearance', icon: 'LogOut' },
          { label: 'Authenticate Experience Records', amharicLabel: 'የስራ ልምድ ማስረጃ አረጋግጥ', tabId: 'experience', icon: 'Award' },
          { label: 'Guarantor Legal Dossiers', amharicLabel: 'የቅጥር ውሎችን ኦዲት አድርግ', tabId: 'management', icon: 'Users' }
        ],
        capabilities: [
          { label: 'Clearance Gate #4 (Legal/HR Release)', allowed: true },
          { label: 'Authenticate Work Certificates', allowed: true },
          { label: 'Guarantor Legal Compliance View', allowed: true },
          { label: 'Edit Payroll / Store Stock', allowed: false },
          { label: 'Manage Field Shift Rosters', allowed: false }
        ]
      };

    case 'mgmt-ceo':
    case 'mgmt-ops-head':
    case 'mgmt-hr-head':
    default:
      return {
        type: 'executive',
        title: 'Executive Corporate Governance (Full Access)',
        amharicTitle: 'የከፍተኛ አመራርና አስተዳደር ማዕከል (ሙሉ ፈቃድ)',
        badge: person?.title || 'Executive Leadership',
        badgeAmharic: person?.amharicName ? `${person.amharicName} (ከፍተኛ አመራር)` : 'ከፍተኛ አመራር',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
        defaultTab: 'overview',
        allowedTabs: 'ALL',
        description: 'Full corporate authority across all 4 divisions (Security, Cleaning, Property Management, Head Office), 30-day payroll sign-offs, store stock, and clearances.',
        amharicDescription: 'በ4ቱም ዘርፎች፣ በደመወዝ ክፍያ፣ በንብረት ስቶክ፣ በጣቢያ ውሎች እና በሰው ኃይል ላይ ሙሉ የውሳኔ ሰጪነት ስልጣን።',
        primaryActions: [
          { label: 'Corporate Overview', amharicLabel: 'አጠቃላይ ዳሽቦርድ', tabId: 'overview', icon: 'LayoutDashboard' },
          { label: '30-Day Payroll Sheet', amharicLabel: 'የደመወዝ መዝገብ አረጋግጥ', tabId: 'payroll', icon: 'CreditCard' },
          { label: 'Store & Stock Control', amharicLabel: 'የስቶክ ቁጥጥር', tabId: 'store', icon: 'Package' }
        ],
        capabilities: [
          { label: 'All 12 HRM & Store Modules', allowed: true },
          { label: 'Approve & Disburse 30-Day Payroll', allowed: true },
          { label: 'All 4 Clearance Sign-Off Gates', allowed: true },
          { label: 'Full Store & Stock Administration', allowed: true },
          { label: 'Deploy, Transfer & Edit Workforce', allowed: true }
        ]
      };
  }
}
