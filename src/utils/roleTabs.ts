import type { CoreRoleType } from '../types/hrm';

export const ROLE_ALLOWED_TABS: Record<CoreRoleType, string[] | 'ALL'> = {
  super_admin: 'ALL',
  executive: ['overview', 'divisions', 'management', 'deployment', 'attendance', 'leave', 'recruitment', 'onboarding', 'payroll', 'store', 'clearance', 'experience', 'audit'],
  hr: ['overview', 'divisions', 'management', 'deployment', 'attendance', 'leave', 'recruitment', 'onboarding', 'clearance', 'experience'],
  finance: ['overview', 'payroll', 'store', 'clearance', 'attendance', 'audit'],
  operations: ['overview', 'deployment', 'attendance', 'store'],
  tech: ['overview', 'deployment', 'attendance', 'store'],
  store: ['overview', 'store', 'clearance', 'onboarding'],
};
