import React from 'react';
import { 
  Users, MapPin, Clock, Calendar, CreditCard, ArrowRightLeft, 
  Award, LogOut, CheckSquare, UserPlus, Package, Sliders,
  Briefcase, ShieldCheck, Wallet, Scale, Building2 
} from 'lucide-react';

import { ServiceType, ManagementPerson } from '../../types/hrm';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serviceFilter?: 'All' | ServiceType;
  setServiceFilter?: (filter: 'All' | ServiceType) => void;
  totalEmployees?: number;
  securityCount?: number;
  cleaningCount?: number;
  activeClearanceCount: number;
  pendingLeaveCount: number;
  lowStockCount?: number;
  onQuickAction?: (action: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeUser?: ManagementPerson;
  onLogout?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  fullName: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface NavCategory {
  id: string;
  label: string;
  fullName: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

interface NavCategoryParams {
  t: (key: any) => string;
  isAmharic: boolean;
  pendingLeaveCount: number;
  lowStockCount: number;
  activeClearanceCount: number;
}

export function buildNavCategories(params: NavCategoryParams): NavCategory[] {
  const { t, isAmharic, pendingLeaveCount, lowStockCount, activeClearanceCount } = params;

  return [
    {
      id: 'workforce',
      label: isAmharic ? 'የሰው ኃይል' : 'HR',
      fullName: isAmharic ? 'የሰው ኃይል፣ ምልመላ፣ ቅጥር እና ክሊራንስ' : 'Workforce, recruitment, and HR operations',
      icon: Briefcase,
      items: [
        {
          id: 'divisions',
          label: isAmharic ? 'ዲቪዥኖች' : 'Divisions',
          fullName: isAmharic ? 'የስራ ክፍሎች እና ዲቪዥን አስተዳደር' : 'Manage company divisions',
          icon: Building2
        },
        {
          id: 'management',
          label: isAmharic ? t('nav.employees') : 'Employees',
          fullName: isAmharic ? t('nav.employees') : 'Employee records',
          icon: Users
        },
        {
          id: 'recruitment',
          label: isAmharic ? t('nav.recruitment') : 'Recruitment',
          fullName: isAmharic ? t('nav.recruitment') : 'Job applicants',
          icon: UserPlus
        },
        {
          id: 'onboarding',
          label: isAmharic ? t('nav.onboarding') : 'New employees',
          fullName: isAmharic ? t('nav.onboarding') : 'Prepare employees for work',
          icon: CheckSquare
        },
        {
          id: 'transfers',
          label: isAmharic ? t('nav.transfers') : 'Transfers',
          fullName: isAmharic ? t('nav.transfers') : 'Track employee moves',
          icon: ArrowRightLeft
        },
        {
          id: 'clearance',
          label: isAmharic ? t('nav.clearance') : 'Employee exit',
          fullName: isAmharic ? t('nav.clearance') : 'Finish exit checks',
          icon: LogOut,
          badge: activeClearanceCount > 0 ? activeClearanceCount : undefined
        },
        {
          id: 'experience',
          label: isAmharic ? t('nav.experience') : 'Work letters',
          fullName: isAmharic ? t('nav.experience') : 'Document Writer & Certificates',
          icon: Award
        },
        {
          id: 'master-setup',
          label: isAmharic ? 'ማስተር ሴትአፕ' : 'Settings',
          fullName: isAmharic ? 'የሲስተም ማስተር ሴትአፕ እና የቀመር ህጎች' : 'View important system rules',
          icon: Sliders
        },
        {
          id: 'audit',
          label: isAmharic ? 'የስርዓት ኦዲት' : 'Audit Log',
          fullName: isAmharic ? 'የስርዓት ኦዲት እና የክስተቶች መዝገብ' : 'View sensitive activity audit trail',
          icon: ShieldCheck
        }
      ]
    },
    {
      id: 'operations',
      label: isAmharic ? 'የመስክ ስምሪት' : 'Operations',
      fullName: isAmharic ? 'የመስክ ስምሪት፣ አቴንዳንስ እና ፈቃድ' : 'Work sites, attendance, and leave',
      icon: ShieldCheck,
      items: [
        {
          id: 'deployment',
          label: isAmharic ? t('nav.deployment') : 'Work sites',
          fullName: isAmharic ? t('nav.deployment') : 'Work sites and employee posts',
          icon: MapPin
        },
        {
          id: 'attendance',
          label: isAmharic ? t('nav.attendance') : 'Attendance',
          fullName: isAmharic ? t('nav.attendance') : 'Record who came to work',
          icon: Clock
        },
        {
          id: 'leave',
          label: isAmharic ? t('nav.leave') : 'Leave',
          fullName: isAmharic ? t('nav.leave') : 'Review leave requests',
          icon: Calendar,
          badge: pendingLeaveCount > 0 ? pendingLeaveCount : undefined
        }
      ]
    },
    {
      id: 'finance_store',
      label: isAmharic ? 'ፋይናንስ እና እቃ ግምጃ ቤት' : 'Finance & Store',
      fullName: isAmharic ? 'የደመወዝ ክፍያ እና እቃ ግምጃ ቤት' : 'Payroll and store supplies',
      icon: Wallet,
      items: [
        {
          id: 'payroll',
          label: isAmharic ? t('nav.payroll') : 'Payroll',
          fullName: isAmharic ? t('nav.payroll') : 'Check monthly employee pay',
          icon: CreditCard
        },
        {
          id: 'store',
          label: isAmharic ? t('nav.store') : 'Store',
          fullName: isAmharic ? t('nav.store') : 'Track company items and equipment',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined
        }
      ]
    }
  ];
}
