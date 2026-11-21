import { ManagementPerson, CoreRoleType } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { CORE_ROLE_CONFIGS } from './roleDefinitions';
import { ROLE_ALLOWED_TABS } from './roleTabs';
export { ROLE_ALLOWED_TABS } from './roleTabs';

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

export function getRoleAllowedTabs(target?: string | ManagementPerson): string[] | 'ALL' {
  const id = typeof target === 'string' ? target : target?.role || target?.id;
  switch (id) {
    case 'super_admin':
    case 'admin':
    case 'mgmt-gm':
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
    case 'operations':
    case 'mgmt-ops-head':
      return ROLE_ALLOWED_TABS.operations;
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

export function getEffectiveAllowedTabs(
  personOrRole?: string | ManagementPerson,
  masterConfig?: SystemMasterConfig
): string[] | 'ALL' {
  const roleOrId = typeof personOrRole === 'string' ? personOrRole : personOrRole?.role || personOrRole?.id || 'admin';
  const userId = typeof personOrRole === 'object' ? personOrRole.id : personOrRole;
  const role = typeof personOrRole === 'object' ? personOrRole.role || personOrRole.id : personOrRole;

  if (roleOrId === 'super_admin' || roleOrId === 'admin' || role === 'super_admin' || role === 'admin') {
    return 'ALL';
  }

  const lower = (role || roleOrId || '').toLowerCase();
  let normalizedKey = 'operations';
  if (lower.includes('admin')) return 'ALL';
  if (lower.includes('hr')) normalizedKey = 'hr';
  else if (lower.includes('fin')) normalizedKey = 'finance';
  else if (lower.includes('store')) normalizedKey = 'store';
  else if (lower.includes('ceo') || lower.includes('exec')) normalizedKey = 'executive';
  else if (lower.includes('tech')) normalizedKey = 'tech';
  else if (lower.includes('op')) normalizedKey = 'operations';

  let baseline: string[] | 'ALL' = 'ALL';
  if (masterConfig?.roleTabPermissions && masterConfig.roleTabPermissions[normalizedKey]) {
    baseline = masterConfig.roleTabPermissions[normalizedKey];
  } else {
    baseline = ROLE_ALLOWED_TABS[normalizedKey as CoreRoleType] || getRoleAllowedTabs(personOrRole);
  }

  if (baseline === 'ALL') {
    return 'ALL';
  }

  const effective = new Set<string>(baseline);

  if (userId && masterConfig?.userTabOverrides) {
    const userOverride = masterConfig.userTabOverrides[userId] ||
      (typeof personOrRole === 'object' && personOrRole.username ? masterConfig.userTabOverrides[personOrRole.username] : undefined);

    if (userOverride) {
      if (Array.isArray(userOverride.grantedTabs)) {
        userOverride.grantedTabs.forEach(t => effective.add(t));
      }
      if (Array.isArray(userOverride.revokedTabs)) {
        userOverride.revokedTabs.forEach(t => effective.delete(t));
      }
    }
  }

  effective.add('overview');
  return Array.from(effective);
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
