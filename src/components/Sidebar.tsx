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
      label: i18n.language === 'am' ? 'የሰው ኃይል' : 'HR',
      fullName: i18n.language === 'am' ? 'የሰው ኃይል፣ ምልመላ እና ቅጥር አስተዳደር' : 'Employee records and hiring',
      icon: Briefcase,
      items: [
        {
          id: 'management',
          label: i18n.language === 'am' ? t('nav.employees') : 'Employees',
          fullName: i18n.language === 'am' ? t('nav.employees') : 'Employee records',
          icon: Users
        },
        {
          id: 'recruitment',
          label: i18n.language === 'am' ? t('nav.recruitment') : 'Recruitment',
          fullName: i18n.language === 'am' ? t('nav.recruitment') : 'Job applicants',
          icon: UserPlus
        },
        {
          id: 'onboarding',
          label: i18n.language === 'am' ? t('nav.onboarding') : 'New employees',
          fullName: i18n.language === 'am' ? t('nav.onboarding') : 'Prepare employees for work',
          icon: CheckSquare
        },
        {
          id: 'transfers',
          label: i18n.language === 'am' ? t('nav.transfers') : 'Transfers',
          fullName: i18n.language === 'am' ? t('nav.transfers') : 'Track employee moves',
          icon: ArrowRightLeft
        }
      ]
    },
    {
      id: 'operations',
      label: i18n.language === 'am' ? 'የመስክ ስምሪት' : 'Operations',
      fullName: i18n.language === 'am' ? 'የመስክ ስምሪት፣ አቴንዳንስ እና ፈቃድ' : 'Work sites, attendance, and leave',
      icon: ShieldCheck,
      items: [
        {
          id: 'deployment',
          label: i18n.language === 'am' ? t('nav.deployment') : 'Work sites',
          fullName: i18n.language === 'am' ? t('nav.deployment') : 'Work sites and employee posts',
          icon: MapPin
        },
        {
          id: 'attendance',
          label: i18n.language === 'am' ? t('nav.attendance') : 'Attendance',
          fullName: i18n.language === 'am' ? t('nav.attendance') : 'Record who came to work',
          icon: Clock
        },
        {
          id: 'leave',
          label: i18n.language === 'am' ? t('nav.leave') : 'Leave',
          fullName: i18n.language === 'am' ? t('nav.leave') : 'Review leave requests',
          icon: Calendar,
          badge: pendingLeaveCount > 0 ? pendingLeaveCount : undefined
        }
      ]
    },
    {
      id: 'finance_store',
      label: i18n.language === 'am' ? 'ፋይናንስ እና እቃ ግምጃ ቤት' : 'Finance & Store',
      fullName: i18n.language === 'am' ? 'የደመወዝ ክፍያ እና እቃ ግምጃ ቤት' : 'Payroll and store supplies',
      icon: Wallet,
      items: [
        {
          id: 'payroll',
          label: i18n.language === 'am' ? t('nav.payroll') : 'Payroll',
          fullName: i18n.language === 'am' ? t('nav.payroll') : 'Check monthly employee pay',
          icon: CreditCard
        },
        {
          id: 'store',
          label: i18n.language === 'am' ? t('nav.store') : 'Store',
          fullName: i18n.language === 'am' ? t('nav.store') : 'Track company items and equipment',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined
        }
      ]
    },
    {
      id: 'legal_exit',
      label: i18n.language === 'am' ? 'ህግ እና ክሊራንስ' : 'Other',
      fullName: i18n.language === 'am' ? 'የመልቀቂያ ክሊራንስ እና የስራ ልምድ' : 'Employee exit and settings',
      icon: Scale,
      items: [
        {
          id: 'clearance',
          label: i18n.language === 'am' ? t('nav.clearance') : 'Employee exit',
          fullName: i18n.language === 'am' ? t('nav.clearance') : 'Finish exit checks',
          icon: LogOut,
          badge: activeClearanceCount > 0 ? activeClearanceCount : undefined
        },
        {
          id: 'experience',
          label: i18n.language === 'am' ? t('nav.experience') : 'Work letters',
          fullName: i18n.language === 'am' ? t('nav.experience') : 'Find employee letters',
          icon: Award
        },
        {
          id: 'master-setup',
          label: i18n.language === 'am' ? 'ማስተር ሴትአፕ' : 'Settings',
          fullName: i18n.language === 'am' ? 'የሲስተም ማስተር ሴትአፕ እና የቀመር ህጎች' : 'View important system rules',
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
    : 'Company summary';

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
          } -translate-y-1/2 z-50 pointer-events-none items-center bg-[#4C4541] text-[#FCF0DA] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-md`}
          role="tooltip"
        >
          <span>{tooltip.text}</span>
        </div>
      )}

      {/* Sidebar Container - Warm Linen (#FCF0DA) with Full-Screen Collapser */}
      <aside
        onMouseLeave={hideTooltip}
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-60 ${
            isCollapsed ? 'lg:w-16' : 'lg:w-60'
          } bg-[#FCF0DA] dark:bg-[#2C2724] border-r border-[#EFE7D8] dark:border-[#3D3633] flex flex-col justify-between
          transition-all duration-200 ease-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30 shrink-0 select-none
          ${isOpenMobile ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:shadow-none'}
        `}
      >
        {/* Top Brand Header + Full-Screen Collapse Toggle */}
        <div
          className={`pt-4 pb-3.5 ${
            isCollapsed ? 'lg:px-2 lg:justify-center' : 'px-4 justify-between'
          } px-4 flex items-center border-b border-[#EFE7D8] dark:border-[#3D3633] shrink-0 gap-2`}
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
              <div className="text-sm font-bold text-[#4C4541] dark:text-[#F7F4EE] leading-tight truncate">
                HAB ERP
              </div>
              <div className="text-[11px] text-[#4C4541]/70 dark:text-[#8C847E] truncate">
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
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-[#4C4541]/80 hover:text-[#4C4541] hover:bg-[#F2C46A]/20 dark:text-slate-300 dark:hover:bg-[#3D3633] transition-colors cursor-pointer shrink-0"
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
            className="lg:hidden p-1.5 rounded-lg text-[#4C4541]/70 hover:text-[#4C4541] hover:bg-black/5 dark:text-slate-300 dark:hover:bg-[#3D3633]"
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
                ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs'
                : 'text-[#4C4541] dark:text-slate-200 hover:bg-[#F2C46A]/15 dark:hover:bg-[#3D3633] font-medium'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-2.5'} min-w-0`}>
              <LayoutDashboard
                className={`w-4 h-4 shrink-0 ${
                  isOverviewActive ? 'text-[#4C4541]' : 'text-[#4C4541]/75 dark:text-slate-400'
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
                      ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs'
                      : isOpen
                      ? 'bg-[#F2C46A]/20 dark:bg-[#3D3633] text-[#4C4541] dark:text-white font-semibold'
                      : 'text-[#4C4541] dark:text-slate-200 hover:bg-[#F2C46A]/15 dark:hover:bg-[#3D3633] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CatIcon
                      className={`w-4 h-4 shrink-0 ${
                        hasActiveChild && !isOpen ? 'text-[#4C4541]' : 'text-[#4C4541]/75 dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{category.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalCatBadges > 0 && !isOpen && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                          hasActiveChild
                            ? 'bg-[#4C4541] text-[#F2C46A]'
                            : 'bg-[#4C4541]/10 text-[#4C4541] dark:bg-slate-700 dark:text-slate-200'
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
                    className={`pl-3.5 pr-1 py-1 mt-0.5 space-y-0.5 border-l border-[#AEAC78]/50 dark:border-[#3D3633] ml-4 ${
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
                              ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs'
                              : 'text-[#4C4541]/85 dark:text-slate-300 hover:text-[#4C4541] dark:hover:text-white hover:bg-[#F2C46A]/15 dark:hover:bg-[#3D3633] font-normal'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-[#4C4541]' : 'text-[#4C4541]/65 dark:text-slate-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                                isActive
                                  ? 'bg-[#4C4541] text-[#F2C46A]'
                                  : 'bg-[#4C4541]/10 text-[#4C4541] dark:bg-slate-700 dark:text-slate-200'
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
                  <div className="hidden lg:flex flex-col items-center space-y-1 pt-1 border-t border-[#EFE7D8] dark:border-[#3D3633]">
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
                              ? 'bg-[#F2C46A] text-[#4C4541]'
                              : 'text-[#4C4541]/75 dark:text-slate-300 hover:bg-[#F2C46A]/20 dark:hover:bg-[#3D3633] hover:text-[#4C4541]'
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
          <div className="p-2.5 border-t border-[#EFE7D8] dark:border-[#3D3633] shrink-0">
            <button
              type="button"
              onClick={onLogout}
              onMouseEnter={(e) => showTooltip(e, i18n.language === 'am' ? 'ውጣ (Sign Out)' : 'Sign Out')}
              onMouseLeave={hideTooltip}
              className={`w-full flex items-center ${
                isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-2.5 px-3'
              } py-2 rounded-lg text-xs font-semibold text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A] hover:text-[#4C4541] dark:hover:bg-[#3D3633] transition-colors cursor-pointer`}
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
