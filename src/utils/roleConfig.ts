import { ManagementPerson, CoreRoleType } from '../types/hrm';
import { CORE_ROLE_CONFIGS } from './roleDefinitions';

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
    'experience'
  ],
  finance: ['overview', 'payroll', 'store', 'clearance', 'attendance'],
  tech: ['overview', 'deployment', 'attendance', 'store', 'management'],
  store: ['overview', 'store', 'clearance', 'onboarding']
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
    case 'tech':
      return ROLE_ALLOWED_TABS.tech;
    case 'store':
    case 'mgmt-storekeeper':
      return ROLE_ALLOWED_TABS.store;
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
      return CORE_ROLE_CONFIGS.super_admin;

    case 'executive':
    case 'ceo':
    case 'mgmt-ceo':
    case 'mgmt-gm':
    case 'mgmt-ops-head':
      return CORE_ROLE_CONFIGS.executive;

    case 'hr':
    case 'mgmt-hr-head':
    case 'mgmt-hr-ops':
    case 'mgmt-hr-talent':
      return CORE_ROLE_CONFIGS.hr;

    case 'finance':
    case 'mgmt-fin-head':
      return CORE_ROLE_CONFIGS.finance;

    case 'tech':
      return CORE_ROLE_CONFIGS.tech;

    case 'store':
    case 'mgmt-storekeeper':
      return CORE_ROLE_CONFIGS.store;

    default:
      return {
        ...CORE_ROLE_CONFIGS.super_admin,
        badge: person?.title || 'Super Admin',
        badgeAmharic: person?.amharicName ? `${person.amharicName} (ዋና አስተዳዳሪ)` : 'ዋና አስተዳዳሪ'
      };
  }
}
