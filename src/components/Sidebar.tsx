import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  CreditCard, 
  ArrowRightLeft, 
  Award, 
  LogOut, 
  CheckSquare, 
  UserPlus,
  LayoutDashboard,
  X,
  Package,
  Power,
  ChevronDown,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  Wallet,
  Scale
} from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { getRoleAllowedTabs } from '../utils/roleConfig';
import { HabMonogramIcon } from './HabLogo';

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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serviceFilter: 'All' | ServiceType;
  setServiceFilter: (filter: 'All' | ServiceType) => void;
  totalEmployees: number;
  securityCount: number;
  cleaningCount: number;
  activeClearanceCount: number;
  pendingLeaveCount: number;
  lowStockCount?: number;
  onQuickAction: (action: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeUser?: ManagementPerson;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeClearanceCount,
  pendingLeaveCount,
  lowStockCount = 0,
  isOpenMobile,
  onCloseMobile,
  activeUser,
  onLogout
}) => {
  const { t, i18n } = useTranslation();
  const allowedTabs = getRoleAllowedTabs(activeUser?.id);

  // Floating tooltip state for sidebar links
  const [tooltip, setTooltip] = useState<{ text: string; top: number } | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      top: rect.top + rect.height / 2
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  const rawCategories: NavCategory[] = [
    {
      id: 'workforce',
      label: i18n.language === 'am' ? 'የሰው ኃይል እና ምልመላ' : 'Workforce & Talent',
      fullName: i18n.language === 'am' ? 'የሰው ኃይል፣ ምልመላ እና ቅጥር አስተዳደር' : 'Workforce Directory, Recruitment & Onboarding',
      icon: Briefcase,
      items: [
        {
          id: 'management',
          label: i18n.language === 'am' ? t('nav.employees') : 'Employees',
          fullName: i18n.language === 'am' ? t('nav.employees') : 'Employee Master Directory (All 4 Divisions)',
          icon: Users
        },
        {
          id: 'recruitment',
          label: i18n.language === 'am' ? t('nav.recruitment') : 'Recruitment',
          fullName: i18n.language === 'am' ? t('nav.recruitment') : 'Recruitment & Applicant Screening Pipeline',
          icon: UserPlus
        },
        {
          id: 'onboarding',
          label: t('nav.onboarding'),
          fullName: i18n.language === 'am' ? t('nav.onboarding') : 'New Hire Onboarding & Guarantor Verification',
          icon: CheckSquare
        },
        {
          id: 'transfers',
          label: t('nav.transfers'),
          fullName: i18n.language === 'am' ? t('nav.transfers') : 'Client Site Transfers & Rank Promotions',
          icon: ArrowRightLeft
        }
      ]
    },
    {
      id: 'operations',
      label: i18n.language === 'am' ? 'የመስክ ስምሪት እና ክትትል' : 'Field Operations',
      fullName: i18n.language === 'am' ? 'የመስክ ስምሪት፣ አቴንዳንስ እና ፈቃድ' : 'Client Site Deployment, Shift Roll Call & Leave Relief',
      icon: ShieldCheck,
      items: [
        {
          id: 'deployment',
          label: t('nav.deployment'),
          fullName: i18n.language === 'am' ? t('nav.deployment') : 'Client Site Deployment & Shift Rosters',
          icon: MapPin
        },
        {
          id: 'attendance',
          label: i18n.language === 'am' ? t('nav.attendance') : 'Attendance',
          fullName: i18n.language === 'am' ? t('nav.attendance') : 'Daily Shift Roll Call & Overtime Attendance',
          icon: Clock
        },
        {
          id: 'leave',
          label: t('nav.leave'),
          fullName: i18n.language === 'am' ? t('nav.leave') : 'Leave Requests & Post Relief Coverage',
          icon: Calendar,
          badge: pendingLeaveCount > 0 ? pendingLeaveCount : undefined
        }
      ]
    },
    {
      id: 'finance_store',
      label: i18n.language === 'am' ? 'ፋይናንስ እና ንብረት ክፍል' : 'Finance & Store',
      fullName: i18n.language === 'am' ? 'የደመወዝ ክፍያ እና 3D መጋዘን ቁጥጥር' : '30-Day Workforce Payroll & 3D Physical Warehouse',
      icon: Wallet,
      items: [
        {
          id: 'payroll',
          label: i18n.language === 'am' ? t('nav.payroll') : 'Payroll',
          fullName: i18n.language === 'am' ? t('nav.payroll') : '30-Day Standard Workforce Payroll & Pension Sheet',
          icon: CreditCard
        },
        {
          id: 'store',
          label: t('nav.store'),
          fullName: i18n.language === 'am' ? t('nav.store') : '3D Physical Warehouse, Uniforms & Stock Control',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined
        }
      ]
    },
    {
      id: 'legal_exit',
      label: i18n.language === 'am' ? 'ህግ እና ክሊራንስ' : 'Legal & Exit',
      fullName: i18n.language === 'am' ? 'የመልቀቂያ ክሊራንስ እና የስራ ልምድ ምስክር ወረቀት' : 'HR Exit Clearance & Work Experience Certificates',
      icon: Scale,
      items: [
        {
          id: 'clearance',
          label: t('nav.clearance'),
          fullName: i18n.language === 'am' ? t('nav.clearance') : 'HR Exit Clearance & Property Return Verification',
          icon: LogOut,
          badge: activeClearanceCount > 0 ? activeClearanceCount : undefined
        },
        {
          id: 'experience',
          label: t('nav.experience'),
          fullName: i18n.language === 'am' ? t('nav.experience') : 'Authenticated Work Experience Certificates',
          icon: Award
        }
      ]
    }
  ];

  // Filter categories and items based on the active user's role permissions
  const visibleCategories: NavCategory[] = rawCategories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => allowedTabs === 'ALL' || allowedTabs.includes(item.id))
    }))
    .filter(cat => cat.items.length > 0);

  // Accordion state: only one category open at a time
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(() => {
    const matchingCat = rawCategories.find(c => c.items.some(i => i.id === activeTab));
    return matchingCat ? matchingCat.id : null;
  });

  // Auto-sync open category when activeTab changes (e.g. clicking an overview card or search result)
  useEffect(() => {
    if (activeTab === 'overview') {
      setOpenCategoryId(null);
      return;
    }
    const matchingCat = rawCategories.find(c => c.items.some(i => i.id === activeTab));
    if (matchingCat) {
      setOpenCategoryId(matchingCat.id);
    }
  }, [activeTab]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  const isOverviewActive = activeTab === 'overview';
  const overviewFullName = i18n.language === 'am'
    ? t('nav.dashboard')
    : 'Operations Overview & Executive KPI Dashboard';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Floating Full-Module-Name Tooltip on Hover (Desktop) */}
      {tooltip && (
        <div
          style={{ top: `${tooltip.top}px` }}
          className="hidden lg:flex fixed left-[262px] -translate-y-1/2 z-50 pointer-events-none items-center bg-[#0E1525] text-[#FFF500] border border-[#FFF500]/30 px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap transition-opacity duration-150"
          role="tooltip"
        >
          <span className="w-2 h-2 rotate-45 bg-[#0E1525] border-l border-b border-[#FFF500]/30 -ml-4 mr-2" />
          <span>{tooltip.text}</span>
        </div>
      )}

      {/* Sidebar Container - Solid Yellow-Green (#DFE16A) & Sticky on Desktop */}
      <aside
        onMouseLeave={hideTooltip}
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#DFE16A] border-r border-[#C8CB54] flex flex-col justify-between
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30 shrink-0 select-none
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
        `}
      >
        {/* Top Centered HB Brand Icon (Smaller & Compact) */}
        <div className="pt-4 pb-3 px-5 flex items-center justify-center relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              onCloseMobile();
            }}
            onMouseEnter={(e) => showTooltip(e, 'HAB Business PLC — Operations Overview')}
            onMouseLeave={hideTooltip}
            className="flex flex-col items-center justify-center focus:outline-none group cursor-pointer"
            title="HAB Business PLC — Operations Overview"
          >
            <HabMonogramIcon className="w-10 h-10 group-hover:scale-105 transition-transform" forceBlack />
          </button>

          {/* Close Button on Mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden absolute right-4 top-4 p-1.5 rounded-lg text-[#0E1525]/70 hover:text-[#0E1525] hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items & Collapsible Accordion Categories */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-thin">
          {/* Standalone Overview Item */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              onCloseMobile();
            }}
            onMouseEnter={(e) => showTooltip(e, overviewFullName)}
            onMouseLeave={hideTooltip}
            title={overviewFullName}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] border-l-4 transition-all duration-200 ease-in-out text-left cursor-pointer ${
              isOverviewActive
                ? 'bg-[#0E1525] text-[#FFF500] border-[#FFF500] font-bold shadow-sm'
                : 'border-transparent text-[#0E1525] hover:bg-slate-100 hover:border-[#0E1525]/60 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LayoutDashboard
                className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                  isOverviewActive ? 'text-[#FFF500]' : 'text-[#0E1525]'
                }`}
              />
              <span className="truncate">{i18n.language === 'am' ? t('nav.dashboard') : 'Overview'}</span>
            </div>
          </button>

          {/* Collapsible Category Dropdowns */}
          {visibleCategories.map((category) => {
            const CatIcon = category.icon;
            const isOpen = openCategoryId === category.id;
            const hasActiveChild = category.items.some(item => item.id === activeTab);
            const totalCatBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  onMouseEnter={(e) => showTooltip(e, category.fullName)}
                  onMouseLeave={hideTooltip}
                  title={category.fullName}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] border-l-4 transition-all duration-200 ease-in-out text-left cursor-pointer ${
                    hasActiveChild && !isOpen
                      ? 'bg-[#0E1525] text-[#FFF500] border-[#FFF500] font-bold shadow-xs'
                      : isOpen
                      ? 'bg-black/12 text-[#0E1525] border-[#0E1525] font-bold hover:bg-slate-100'
                      : 'border-transparent text-[#0E1525] hover:bg-slate-100 hover:border-[#0E1525]/60 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CatIcon
                      className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                        hasActiveChild && !isOpen ? 'text-[#FFF500]' : 'text-[#0E1525]'
                      }`}
                    />
                    <span className="truncate">{category.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalCatBadges > 0 && !isOpen && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                          hasActiveChild
                            ? 'bg-[#FFF500] text-[#0E1525]'
                            : 'bg-[#0E1525] text-[#FFF500]'
                        }`}
                      >
                        {totalCatBadges}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Dropdown Nested Items */}
                {isOpen && (
                  <div className="pl-3.5 pr-1 py-1 space-y-1 border-l-2 border-[#0E1525]/20 ml-4">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            onCloseMobile();
                          }}
                          onMouseEnter={(e) => showTooltip(e, item.fullName)}
                          onMouseLeave={hideTooltip}
                          title={item.fullName}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] border-l-4 transition-all duration-200 ease-in-out text-left cursor-pointer ${
                            isActive
                              ? 'bg-[#0E1525] text-[#FFF500] border-[#FFF500] font-bold shadow-xs'
                              : 'border-transparent text-[#0E1525]/90 hover:text-[#0E1525] hover:bg-slate-100 hover:border-[#0E1525]/60 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon
                              className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                                isActive ? 'text-[#FFF500]' : 'text-[#0E1525]'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                                isActive
                                  ? 'bg-[#FFF500] text-[#0E1525]'
                                  : 'bg-[#0E1525] text-[#FFF500]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Sign Out Button */}
        {onLogout && (
          <div className="p-4 border-t border-[#0E1525]/15 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              onMouseEnter={(e) => showTooltip(e, 'Sign Out to Workspace Login Screen')}
              onMouseLeave={hideTooltip}
              title="Sign Out to Workspace Login Screen"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-[#0E1525] hover:bg-[#0E1525] hover:text-white transition-all duration-200 cursor-pointer"
            >
              <Power className="w-4 h-4 shrink-0" />
              <span>{i18n.language === 'am' ? 'ውጣ (Sign Out)' : 'Sign Out'}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
