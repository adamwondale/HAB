import { RoleConfig } from './roleConfig';
import { ROLE_ALLOWED_TABS } from './roleConfig';

export const CORE_ROLE_CONFIGS: Record<string, RoleConfig> = {
  super_admin: {
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
  },
  executive: {
    type: 'executive',
    title: 'CEO Executive Oversight (Read-Only)',
    amharicTitle: 'ዋና ሥራ አስፈፃሚ (ተቆጣጣሪ — የንባብ ብቻ)',
    badge: 'CEO Overview',
    badgeAmharic: 'ዋና ሥራ አስፈፃሚ',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    defaultTab: 'overview',
    allowedTabs: ROLE_ALLOWED_TABS.executive,
    description: 'Executive read-only visibility into company-wide operational health, recruitment, finance, and store summaries.',
    amharicDescription: 'በምልመላ፣ በፋይናንስና በዕቃ ግምጃ ቤት አጠቃላይ የስራ ክንውኖች ላይ የተቆጣጣሪነት እይታ።',
    readOnly: true,
    primaryActions: [
      { label: 'CEO Dashboard Summary', amharicLabel: 'ዋና ዳሽቦርድ', tabId: 'overview', icon: 'LayoutDashboard' },
      { label: 'Finance Operations', amharicLabel: 'የፋይናንስ እንቅስቃሴ', tabId: 'payroll', icon: 'CreditCard' },
      { label: 'Store Overview', amharicLabel: 'የስቶክ ሁኔታ', tabId: 'store', icon: 'Package' }
    ],
    capabilities: [
      { label: 'CEO High-Level Summary Oversight', allowed: true },
      { label: 'Recruitment & Headcount Monitoring', allowed: true },
      { label: 'Finance & Store General Overview', allowed: true },
      { label: 'Direct Record Mutation / Edits', allowed: false },
      { label: 'System Master Setup Access', allowed: false }
    ]
  },
  hr: {
    type: 'hr',
    title: 'Human Resource & Workforce Operations',
    amharicTitle: 'የሰው ኃይል እና ሰራተኞች አስተዳደር',
    badge: 'HR Head',
    badgeAmharic: 'የሰው ኃይል ኃላፊ',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700',
    defaultTab: 'management',
    allowedTabs: ROLE_ALLOWED_TABS.hr,
    description: 'Authorized to manage employee lifecycle: Slide One master table, recruitment, onboarding, transfers, and leave.',
    amharicDescription: 'የሰራተኞች ዋና ሰንጠረዥ፣ ምልመላ፣ አዳዲስ ቅጥር፣ ዝውውር እና የፈቃድ አያያዝ አስተዳደር።',
    readOnly: false,
    primaryActions: [
      { label: 'Employee Master Table', amharicLabel: 'የሰራተኞች መዝገብ', tabId: 'management', icon: 'Users' },
      { label: 'Recruitment & Onboarding', amharicLabel: 'ምልመላና ቅጥር', tabId: 'recruitment', icon: 'UserPlus' },
      { label: 'Leave Requests & Balances', amharicLabel: 'የፈቃድ አስተዳደር', tabId: 'leave', icon: 'Calendar' }
    ],
    capabilities: [
      { label: 'Slide One Employee Master Record', allowed: true },
      { label: 'Recruitment & Onboarding Lifecycle', allowed: true },
      { label: 'Performance Evaluations & Transfers', allowed: true },
      { label: 'Automated Leave Deductions', allowed: true },
      { label: 'Access to Store Inventory Module', allowed: false }
    ]
  },
  finance: {
    type: 'finance',
    title: 'Finance, Payroll & Material Depreciation',
    amharicTitle: 'የፋይናንስ፣ የደመወዝ እና የዕቃዎች እርጅና ሂሳብ',
    badge: 'Finance Head',
    badgeAmharic: 'የፋይናንስ ኃላፊ',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
    defaultTab: 'payroll',
    allowedTabs: ROLE_ALLOWED_TABS.finance,
    description: 'Authorized to manage 9-column payroll, statutory taxes, cheque/petty cash controls, and material depreciation.',
    amharicDescription: 'ባለ 9-ዓምድ የደመወዝ ሉህ፣ ግብርና ፔንሽን፣ የቼክና ፔቲ ካሽ ቁጥጥር እና የዕቃዎች እርጅና ስሌት።',
    readOnly: false,
    primaryActions: [
      { label: '9-Column Payroll Table', amharicLabel: 'የደመወዝ ሰንጠረዥ', tabId: 'payroll', icon: 'CreditCard' },
      { label: 'Cheque & Petty Cash Control', amharicLabel: 'የቼክና ካሽ ቁጥጥር', tabId: 'payroll', icon: 'DollarSign' },
      { label: 'Material Depreciation', amharicLabel: 'የዕቃዎች እርጅና', tabId: 'payroll', icon: 'TrendingDown' }
    ],
    capabilities: [
      { label: '9-Column Payroll Calculation', allowed: true },
      { label: 'Statutory Taxes & Pension (7%/11%)', allowed: true },
      { label: 'Cheque Debited & Credit Controls', allowed: true },
      { label: 'Material Depreciation Tracking', allowed: true },
      { label: 'HR Attendance & On-Leave Visibility', allowed: true }
    ]
  },
  tech: {
    type: 'tech',
    title: 'Technical Operations & Site Management',
    amharicTitle: 'የቴክኒክ ስራዎችና የጣቢያዎች አስተዳደር',
    badge: 'Technical Manager',
    badgeAmharic: 'የቴክኒክ ኃላፊ',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700',
    defaultTab: 'overview',
    allowedTabs: ROLE_ALLOWED_TABS.tech,
    description: 'Oversees operational site statuses (active/inactive), available workforce, attendance overview, and store stock.',
    amharicDescription: 'የስራ ጣቢያዎች ሁኔታ (ንቁ/ዝግ)፣ ዝግጁ ሰራተኞች፣ አቴንዳንስ እና በስቶክ ያሉ ዕቃዎች ክትትል።',
    readOnly: false,
    primaryActions: [
      { label: 'Site Status Overview', amharicLabel: 'የጣቢያዎች ሁኔታ', tabId: 'overview', icon: 'Activity' },
      { label: 'Shift Deployments', amharicLabel: 'የጣቢያዎች ድልድል', tabId: 'deployment', icon: 'MapPin' },
      { label: 'Store Available Stock', amharicLabel: 'የስቶክ ክምችት', tabId: 'store', icon: 'Package' }
    ],
    capabilities: [
      { label: 'Site Status Tracking (Active/Inactive)', allowed: true },
      { label: 'Available Employees Visibility', allowed: true },
      { label: 'Workforce Attendance Overview', allowed: true },
      { label: 'Store Available Stock Visibility', allowed: true },
      { label: 'Payroll & Salary Management', allowed: false }
    ]
  },
  store: {
    type: 'store',
    title: 'Store Keeping & Asset Control',
    amharicTitle: 'የዕቃ ግምጃ ቤትና ንብረት አስተዳደር',
    badge: 'Store Keeper',
    badgeAmharic: 'የዕቃ ግምጃ ቤት ኃላፊ',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    defaultTab: 'store',
    allowedTabs: ROLE_ALLOWED_TABS.store,
    description: 'Authorized to record daily issue/receive, control company assets, monitor minimum stock thresholds, and handle returns.',
    amharicDescription: 'ዕለታዊ የዕቃ ገቢ/ወጪ፣ የንብረት ቁጥጥር፣ አነስተኛ የስቶክ መጠን ማስጠንቀቂያ እና የስንብት ንብረት ርክክብ።',
    readOnly: false,
    primaryActions: [
      { label: 'Daily Issue / Receive Log', amharicLabel: 'የዕቃ እንቅስቃሴዎች', tabId: 'store', icon: 'Package' },
      { label: 'Asset Control Register', amharicLabel: 'የንብረት መዝገብ', tabId: 'store', icon: 'ShieldCheck' },
      { label: 'Clearance Property Return', amharicLabel: 'የንብረት ርክክብ', tabId: 'clearance', icon: 'LogOut' }
    ],
    capabilities: [
      { label: 'Daily Issue / Receive Recording', allowed: true },
      { label: 'Asset Register & Tracking', allowed: true },
      { label: 'Minimum Store Stock Alerts', allowed: true },
      { label: 'Clearance Property Handovers', allowed: true },
      { label: 'Payroll Sheet Access', allowed: false }
    ]
  }
};
