import { DepartmentRole, DepartmentalPermissions, ROLE_PERMISSIONS } from '../types/rbac';
import { ManagementPerson } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { getEffectiveAllowedTabs } from './roleConfig';

export function normalizeRole(roleOrId?: string): DepartmentRole {
  if (!roleOrId) return 'super_admin';
  const lower = roleOrId.toLowerCase();
  if (lower.includes('admin')) return 'super_admin';
  if (lower.includes('hr')) return 'hr';
  if (lower.includes('fin')) return 'finance';
  if (lower.includes('store')) return 'store';
  if (lower.includes('op') || lower.includes('tech')) return 'operations';
  if (lower.includes('ceo') || lower.includes('exec')) return 'executive';
  return 'super_admin';
}

export function getPermissionsForRole(roleOrId?: string): DepartmentalPermissions {
  const normalized = normalizeRole(roleOrId);
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS.super_admin;
}

export function isTabAllowedForRole(
  roleOrPerson: string | ManagementPerson | undefined,
  tabId: string,
  masterConfig?: SystemMasterConfig
): boolean {
  if (tabId === 'overview') return true;
  const allowed = getEffectiveAllowedTabs(roleOrPerson, masterConfig);
  if (allowed === 'ALL') return true;
  return Array.isArray(allowed) && allowed.includes(tabId);
}
