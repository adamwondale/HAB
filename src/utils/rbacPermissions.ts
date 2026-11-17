import { DepartmentRole, DepartmentalPermissions, ROLE_PERMISSIONS } from '../types/rbac';
import { ROLE_ALLOWED_TABS } from './roleTabs';

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

export function isTabAllowedForRole(roleOrId: string | undefined, tabId: string): boolean {
  if (tabId === 'overview') return true;
  const role = normalizeRole(roleOrId);
  const tabsRecord = ROLE_ALLOWED_TABS as Record<string, string[] | 'ALL'>;
  const allowed = tabsRecord[role] || (roleOrId ? tabsRecord[roleOrId] : undefined);
  if (allowed === 'ALL') return true;
  if (Array.isArray(allowed)) return allowed.includes(tabId);
  return false;
}
