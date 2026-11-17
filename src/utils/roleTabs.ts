import type { CoreRoleType } from '../types/hrm';

export const ROLE_ALLOWED_TABS: Record<CoreRoleType, string[] | 'ALL'> = {
  super_admin: 'ALL',
  executive: ['overview', 'management', 'deployment', 'attendance', 'leave', 'recruitment', 'onboarding', 'payroll', 'store', 'clearance', 'experience'],
  hr: ['overview', 'management', 'deployment', 'attendance', 'leave', 'recruitment', 'onboarding', 'clearance', 'experience'],
  finance: ['overview', 'payroll', 'store', 'clearance', 'attendance'],
  tech: ['overview', 'deployment', 'attendance', 'store', 'management'],
  store: ['overview', 'store', 'clearance', 'onboarding'],
};
