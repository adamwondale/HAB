import { UserAccount, ManagementPerson } from '../types/hrm';

export const ACCOUNTS_STORAGE_KEY = 'hab_erp_user_accounts';
export const SESSION_STORAGE_KEY = 'hab_erp_active_session';

const FULL_PERMS = {
  canApproveClearance: true, canApprovePayroll: true,
  canManageShiftsAndDeployments: true, canManageRecruitmentAndGuarantors: true,
  canVerifyInventoryReturn: true, canSignWorkExperience: true, canEditEmployees: true
};

const READ_ONLY_PERMS = {
  canApproveClearance: false, canApprovePayroll: false,
  canManageShiftsAndDeployments: false, canManageRecruitmentAndGuarantors: false,
  canVerifyInventoryReturn: false, canSignWorkExperience: false, canEditEmployees: false
};

export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'admin', username: 'admin', password: 'hab2026', email: 'admin@hab-business.com',
    fullName: 'Ato Hailemariam Bekele', name: 'Ato Hailemariam Bekele', amharicName: 'አቶ ኃይለማርያም በቀለ',
    role: 'super_admin', roleTitle: 'Super Admin & System Controller', roleAmharicTitle: 'የሲስተም ዋና አስተዳዳሪ',
    department: 'Executive Office', avatarColor: 'bg-slate-700 text-white', permissions: FULL_PERMS,
    responsibilities: ['System configuration', 'Master setup', 'Security & user credential management']
  },
  {
    id: 'ceo', username: 'ceo', password: 'hab2026', email: 'ceo@hab-business.com',
    fullName: 'Ato Hailemariam Bekele', name: 'Ato Hailemariam Bekele', amharicName: 'አቶ ኃይለማርያም በቀለ',
    role: 'executive', roleTitle: 'CEO & Managing Director', roleAmharicTitle: 'ዋና ሥራ አስፈፃሚ (ተቆጣጣሪ)',
    department: 'Executive Office', avatarColor: 'bg-amber-600 text-white', permissions: READ_ONLY_PERMS,
    responsibilities: ['Company-wide oversight', 'Operations inspection', 'Executive governance']
  },
  {
    id: 'hr', username: 'hr', password: 'hab2026', email: 'hr@hab-business.com',
    fullName: 'Ato Dawit Yohannes', name: 'Ato Dawit Yohannes', amharicName: 'አቶ ዳዊት ዮሐንስ',
    role: 'hr', roleTitle: 'Head of Human Resources', roleAmharicTitle: 'የሰው ኃይል አስተዳደር ኃላፊ',
    department: 'Human Resource', avatarColor: 'bg-teal-600 text-white',
    permissions: { ...FULL_PERMS, canApprovePayroll: false, canVerifyInventoryReturn: false },
    responsibilities: ['Workforce management', 'Recruitment & vetting', 'Shifts & deployments', 'Exit clearances']
  },
  {
    id: 'finance', username: 'finance', password: 'hab2026', email: 'finance@hab-business.com',
    fullName: 'W/ro Meron Tadesse', name: 'W/ro Meron Tadesse', amharicName: 'ወ/ሮ ሜሮን ታደሰ',
    role: 'finance', roleTitle: 'Finance & 30-Day Payroll Head', roleAmharicTitle: 'የፋይናንስና ደመወዝ ኃላፊ',
    department: 'Finance', avatarColor: 'bg-emerald-600 text-white',
    permissions: { ...READ_ONLY_PERMS, canApproveClearance: true, canApprovePayroll: true, canVerifyInventoryReturn: true },
    responsibilities: ['30-Day payroll sheets', 'Statutory taxes & pension', 'Clearance financial settlements', 'Store inventory valuation']
  },
  {
    id: 'tech', username: 'tech', password: 'hab2026', email: 'tech.ops@hab-business.com',
    fullName: 'Eng. Solomon Fikre', name: 'Eng. Solomon Fikre', amharicName: 'ኢ/ር ሰለሞን ፍቅሬ',
    role: 'tech', roleTitle: 'Technical Operations Manager', roleAmharicTitle: 'የቴክኒክ ስራዎች ኃላፊ',
    department: 'Operations', avatarColor: 'bg-blue-600 text-white',
    permissions: { ...READ_ONLY_PERMS, canManageShiftsAndDeployments: true, canVerifyInventoryReturn: true },
    responsibilities: ['Technical operations oversight', 'Project site deployments', 'Field workforce monitoring', 'Equipment coordination']
  },
  {
    id: 'store', username: 'store', password: 'hab2026', email: 'store@hab-business.com',
    fullName: 'Ato Girma Wolde', name: 'Ato Girma Wolde', amharicName: 'አቶ ግርማ ወልዴ',
    role: 'store', roleTitle: 'Store & Inventory Controller', roleAmharicTitle: 'የዕቃ ግምጃ ቤትና ንብረት ተቆጣጣሪ',
    department: 'Property Administration', avatarColor: 'bg-amber-700 text-white',
    permissions: { ...READ_ONLY_PERMS, canVerifyInventoryReturn: true },
    responsibilities: ['Store daily issue & receipt', 'Asset register maintenance', 'Minimum stock threshold alerts', 'Clearance property handovers']
  }
];

export function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      saveAccounts(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((a: UserAccount) => a.id));
      const missing = DEFAULT_ACCOUNTS.filter((def) => !existingIds.has(def.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        saveAccounts(merged);
        return merged;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed reading stored accounts', err);
  }
  saveAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed saving accounts', err);
  }
}

export function authenticate(loginIdentifier: string, password: string): UserAccount | null {
  const cleanId = loginIdentifier.trim().toLowerCase();
  const accounts = getStoredAccounts();
  return accounts.find(
    (acc) =>
      (acc.username.toLowerCase() === cleanId || acc.email.toLowerCase() === cleanId) &&
      acc.password === password
  ) || null;
}

export function updateAccount(
  id: string,
  updates: Partial<Pick<UserAccount, 'username' | 'password' | 'email' | 'fullName'>>
): boolean {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === id);
  if (index === -1) return false;

  const current = accounts[index];
  const updated: UserAccount = {
    ...current,
    ...updates,
    name: updates.fullName !== undefined ? updates.fullName : current.name
  };
  accounts[index] = updated;
  saveAccounts(accounts);

  const active = getActiveSession();
  if (active && active.id === id) {
    setActiveSession(updated);
  }
  return true;
}

export function resetToDefaults(): UserAccount[] {
  saveAccounts(DEFAULT_ACCOUNTS);
  const active = getActiveSession();
  if (active) {
    const resetUser = DEFAULT_ACCOUNTS.find((a) => a.id === active.id);
    if (resetUser) setActiveSession(resetUser);
  }
  return DEFAULT_ACCOUNTS;
}

export function getActiveSession(): UserAccount | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as UserAccount;
    const accounts = getStoredAccounts();
    return accounts.find((a) => a.id === session.id) || null;
  } catch {
    return null;
  }
}

export function setActiveSession(user: UserAccount | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!user) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed setting active session', err);
  }
}

export function accountToManagementPerson(account: UserAccount): ManagementPerson {
  return {
    id: account.id,
    name: account.fullName || account.name || account.username,
    fullName: account.fullName,
    username: account.username,
    password: account.password,
    amharicName: account.amharicName,
    title: account.roleTitle || account.title || '',
    role: account.role,
    roleTitle: account.roleTitle,
    roleAmharicTitle: account.roleAmharicTitle,
    department: (account.department as any) || 'Executive Office',
    email: account.email,
    phone: account.phone || '+251 91 123 4567',
    officeLocation: account.officeLocation || 'HAB Head Office, Bole',
    roleCategory: account.roleCategory || 'Executive',
    responsibilities: account.responsibilities || [],
    permissions: account.permissions || FULL_PERMS,
    avatarColor: account.avatarColor
  };
}
