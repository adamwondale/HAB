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
  Scale,
  PanelLeftClose,
  PanelLeftOpen,
  Sliders
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  isCollapsed = false,
  onToggleCollapse,
  activeUser,
  onLogout
}) => {
  const { t, i18n } = useTranslation();
  const allowedTabs = getRoleAllowedTabs(activeUser?.id);

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
      label: i18n.language === 'am' ? 'የሰው ኃይል' : 'Workforce',
      fullName: i18n.language === 'am' ? 'የሰው ኃይል፣ ምልመላ እና ቅጥር አስተዳደር' : 'Workforce Directory, Recruitment & Onboarding',
      icon: Briefcase,
      items: [
        {
          id: 'management',
          label: i18n.language === 'am' ? t('nav.employees') : 'Directory',
          fullName: i18n.language === 'am' ? t('nav.employees') : 'Employee Master Directory',
          icon: Users
        },
        {
          id: 'recruitment',
          label: i18n.language === 'am' ? t('nav.recruitment') : 'Recruitment',
          fullName: i18n.language === 'am' ? t('nav.recruitment') : 'Applicant Screening Pipeline',
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
          fullName: i18n.language === 'am' ? t('nav.transfers') : 'Site Transfers & Promotions',
          icon: ArrowRightLeft
        }
      ]
    },
    {
      id: 'operations',
      label: i18n.language === 'am' ? 'የመስክ ስምሪት' : 'Operations',
      fullName: i18n.language === 'am' ? 'የመስክ ስምሪት፣ አቴንዳንስ እና ፈቃድ' : 'Site Deployment, Shift Roll Call & Leave Relief',
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
          fullName: i18n.language === 'am' ? t('nav.attendance') : 'Daily Shift Roll Call & Overtime',
          icon: Clock
        },
        {
          id: 'leave',
          label: t('nav.leave'),
          fullName: i18n.language === 'am' ? t('nav.leave') : 'Leave Requests & Post Relief',
          icon: Calendar,
          badge: pendingLeaveCount > 0 ? pendingLeaveCount : undefined
        }
      ]
    },
    {
      id: 'finance_store',
      label: i18n.language === 'am' ? 'ፋይናንስ እና ንብረት' : 'Finance & Store',
      fullName: i18n.language === 'am' ? 'የደመወዝ ክፍያ እና መጋዘን ቁጥጥር' : '30-Day Payroll & Central Warehouse',
      icon: Wallet,
      items: [
        {
          id: 'payroll',
          label: i18n.language === 'am' ? t('nav.payroll') : 'Payroll',
          fullName: i18n.language === 'am' ? t('nav.payroll') : '30-Day Workforce Payroll & Pension Sheet',
          icon: CreditCard
        },
        {
          id: 'store',
          label: t('nav.store'),
          fullName: i18n.language === 'am' ? t('nav.store') : 'Warehouse, Uniforms & Stock Control',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined
        }
      ]
    },
    {
      id: 'legal_exit',
      label: i18n.language === 'am' ? 'ህግ እና ክሊራንስ' : 'Legal & Exit',
      fullName: i18n.language === 'am' ? 'የመልቀቂያ ክሊራንስ እና የስራ ልምድ' : 'Exit Clearance & Work Certificates',
      icon: Scale,
      items: [
        {
          id: 'clearance',
          label: t('nav.clearance'),
          fullName: i18n.language === 'am' ? t('nav.clearance') : '4-Gate Exit Clearance & Property Return',
          icon: LogOut,
          badge: activeClearanceCount > 0 ? activeClearanceCount : undefined
        },
        {
          id: 'experience',
          label: t('nav.experience'),
          fullName: i18n.language === 'am' ? t('nav.experience') : 'Authenticated Work Experience Certificates',
          icon: Award
        },
        {
          id: 'master-setup',
          label: i18n.language === 'am' ? 'ማስተር ሴትአፕ' : 'Master Setup',
          fullName: i18n.language === 'am' ? 'የሲስተም ማስተር ሴትአፕ እና የቀመር ህጎች' : 'System Master Setup & Statutory Calculation Rules',
          icon: Sliders
        }
      ]
    }
  ];

  const visibleCategories: NavCategory[] = rawCategories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => allowedTabs === 'ALL' || allowedTabs.includes(item.id))
    }))
    .filter(cat => cat.items.length > 0);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(() => {
    const matchingCat = rawCategories.find(c => c.items.some(i => i.id === activeTab));
    return matchingCat ? matchingCat.id : 'workforce';
  });

  useEffect(() => {
    if (activeTab === 'overview') {
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Floating Tooltip on Hover (Desktop) */}
      {tooltip && (
        <div
          style={{ top: `${tooltip.top}px` }}
          className={`hidden lg:flex fixed ${
            isCollapsed ? 'left-[72px]' : 'left-[248px]'
          } -translate-y-1/2 z-50 pointer-events-none items-center bg-[#0E1525] text-[#FFF9DB] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-md`}
          role="tooltip"
        >
          <span>{tooltip.text}</span>
        </div>
      )}

      {/* Sidebar Container - Very Light Golden Yellow (#FFFDE8) with Full-Screen Collapser */}
      <aside
        onMouseLeave={hideTooltip}
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-60 ${
            isCollapsed ? 'lg:w-16' : 'lg:w-60'
          } bg-[#FFFDE8] dark:bg-slate-900 border-r border-[#EFE1AA] dark:border-slate-800 flex flex-col justify-between
          transition-all duration-200 ease-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30 shrink-0 select-none
          ${isOpenMobile ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:shadow-none'}
        `}
      >
        {/* Top Brand Header + Full-Screen Collapse Toggle */}
        <div
          className={`pt-4 pb-3.5 ${
            isCollapsed ? 'lg:px-2 lg:justify-center' : 'px-4 justify-between'
          } px-4 flex items-center border-b border-[#EFE1AA]/60 dark:border-slate-800 shrink-0 gap-2`}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              onCloseMobile();
            }}
            onMouseEnter={(e) => showTooltip(e, 'HAB ERP — Integrated Operations Overview')}
            onMouseLeave={hideTooltip}
            className={`flex items-center gap-2.5 focus:outline-none group cursor-pointer text-left min-w-0 ${
              isCollapsed ? 'lg:hidden' : ''
            }`}
          >
            <HabMonogramIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform" forceBlack />
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#0E1525] dark:text-slate-100 leading-tight truncate">
                HAB ERP
              </div>
              <div className="text-[11px] text-[#0E1525]/65 dark:text-slate-400 truncate">
                Integrated Operations
              </div>
            </div>
          </button>

          {/* Desktop Full-Screen Collapse / Expand Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={() => {
                hideTooltip();
                onToggleCollapse();
              }}
              onMouseEnter={(e) =>
                showTooltip(e, isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')
              }
              onMouseLeave={hideTooltip}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-[#0E1525]/75 hover:text-[#0E1525] hover:bg-[#F5EAB8]/70 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#0E1525]/70 hover:text-[#0E1525] hover:bg-black/5 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {/* Overview Item */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              onCloseMobile();
            }}
            onMouseEnter={(e) => showTooltip(e, overviewFullName)}
            onMouseLeave={hideTooltip}
            className={`w-full flex items-center ${
              isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between px-3'
            } py-2 rounded-lg text-[13px] transition-colors text-left cursor-pointer ${
              isOverviewActive
                ? 'bg-[#0E1525] text-[#FFF9DB] font-semibold'
                : 'text-[#0E1525] dark:text-slate-200 hover:bg-[#F5EAB8]/60 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-2.5'} min-w-0`}>
              <LayoutDashboard
                className={`w-4 h-4 shrink-0 ${
                  isOverviewActive ? 'text-[#EBE834]' : 'text-[#0E1525]/75 dark:text-slate-400'
                }`}
              />
              <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                {i18n.language === 'am' ? t('nav.dashboard') : 'Overview'}
              </span>
            </div>
          </button>

          {/* Category Groups */}
          {visibleCategories.map((category) => {
            const CatIcon = category.icon;
            const isOpen = openCategoryId === category.id;
            const hasActiveChild = category.items.some(item => item.id === activeTab);
            const totalCatBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <div key={category.id} className="pt-1">
                {/* Expanded / Mobile Accordion Category Button */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  onMouseEnter={(e) => showTooltip(e, category.fullName)}
                  onMouseLeave={hideTooltip}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors text-left cursor-pointer ${
                    isCollapsed ? 'lg:hidden' : ''
                  } ${
                    hasActiveChild && !isOpen
                      ? 'bg-[#0E1525] text-[#FFF9DB] font-semibold'
                      : isOpen
                      ? 'bg-[#F5EAB8]/45 dark:bg-slate-800/70 text-[#0E1525] dark:text-white font-semibold'
                      : 'text-[#0E1525] dark:text-slate-200 hover:bg-[#F5EAB8]/60 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CatIcon
                      className={`w-4 h-4 shrink-0 ${
                        hasActiveChild && !isOpen ? 'text-[#EBE834]' : 'text-[#0E1525]/75 dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{category.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalCatBadges > 0 && !isOpen && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                          hasActiveChild
                            ? 'bg-[#EBE834] text-[#0E1525]'
                            : 'bg-[#0E1525]/10 text-[#0E1525] dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {totalCatBadges}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    )}
                  </div>
                </button>

                {/* Expanded Sub-items */}
                {isOpen && (
                  <div
                    className={`pl-3.5 pr-1 py-1 mt-0.5 space-y-0.5 border-l border-[#D4AF37]/40 dark:border-slate-700 ml-4 ${
                      isCollapsed ? 'lg:hidden' : ''
                    }`}
                  >
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors text-left cursor-pointer ${
                            isActive
                              ? 'bg-[#0E1525] text-[#FFF9DB] font-semibold'
                              : 'text-[#0E1525]/85 dark:text-slate-300 hover:text-[#0E1525] dark:hover:text-white hover:bg-[#F5EAB8]/50 dark:hover:bg-slate-800 font-normal'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-[#EBE834]' : 'text-[#0E1525]/65 dark:text-slate-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                                isActive
                                  ? 'bg-[#EBE834] text-[#0E1525]'
                                  : 'bg-[#0E1525]/10 text-[#0E1525] dark:bg-slate-700 dark:text-slate-200'
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

                {/* Collapsed Rail Mode Icons (Desktop Only) */}
                {isCollapsed && (
                  <div className="hidden lg:flex flex-col items-center space-y-1 pt-1 border-t border-[#EFE1AA]/50 dark:border-slate-800/80">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          onMouseEnter={(e) => showTooltip(e, `${item.label} — ${item.fullName}`)}
                          onMouseLeave={hideTooltip}
                          className={`relative w-10 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#0E1525] text-[#EBE834]'
                              : 'text-[#0E1525]/75 dark:text-slate-300 hover:bg-[#F5EAB8]/60 dark:hover:bg-slate-800 hover:text-[#0E1525]'
                          }`}
                          aria-label={item.label}
                        >
                          <ItemIcon className="w-4 h-4 shrink-0" />
                          {item.badge !== undefined && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
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
          <div className="p-2.5 border-t border-[#EFE1AA] dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              onMouseEnter={(e) => showTooltip(e, i18n.language === 'am' ? 'ውጣ (Sign Out)' : 'Sign Out')}
              onMouseLeave={hideTooltip}
              className={`w-full flex items-center ${
                isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-2.5 px-3'
              } py-2 rounded-lg text-xs font-semibold text-[#0E1525]/80 dark:text-slate-300 hover:bg-[#0E1525] hover:text-[#FFF9DB] dark:hover:bg-slate-800 transition-colors cursor-pointer`}
            >
              <Power className="w-4 h-4 shrink-0" />
              <span className={isCollapsed ? 'lg:hidden' : ''}>
                {i18n.language === 'am' ? 'ውጣ (Sign Out)' : 'Sign Out'}
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
