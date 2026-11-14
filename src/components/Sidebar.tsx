import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, X, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { getRoleAllowedTabs } from '../utils/roleConfig';
import { HabMonogramIcon } from './HabLogo';
import { buildNavCategories, NavCategory, SidebarProps } from './sidebar/sidebarNavigationData';
import { SidebarUserFooter } from './sidebar/SidebarUserFooter';

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
  const allowedTabs = getRoleAllowedTabs(activeUser?.role || activeUser?.id);
  const isAmharic = i18n.language === 'am';

  const [tooltip, setTooltip] = useState<{ text: string; top: number } | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ text, top: rect.top + rect.height / 2 });
  };
  const hideTooltip = () => setTooltip(null);

  const rawCategories = buildNavCategories({
    t,
    isAmharic,
    pendingLeaveCount,
    lowStockCount,
    activeClearanceCount
  });

  const visibleCategories: NavCategory[] = rawCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => allowedTabs === 'ALL' || allowedTabs.includes(item.id))
    }))
    .filter((cat) => cat.items.length > 0);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(() => {
    const matchingCat = rawCategories.find((c) => c.items.some((i) => i.id === activeTab));
    return matchingCat ? matchingCat.id : 'workforce';
  });

  const toggleCategory = (catId: string) => {
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  const isOverviewActive = activeTab === 'overview';
  const overviewFullName = isAmharic ? 'የስራ ክንውን አጠቃላይ እይታ' : 'Company operational overview and status';

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none hidden lg:block px-2.5 py-1 text-xs font-semibold rounded-md shadow-md bg-[#4C4541] text-[#FCF0DA] border border-[#EFE7D8]/30 max-w-xs transition-opacity duration-150"
          style={{ top: tooltip.top, left: isCollapsed ? 76 : 246, transform: 'translateY(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FCF0DA] dark:bg-[#24201E] border-r border-[#EFE7D8] dark:border-[#3D3633] transition-all duration-200 ease-out flex flex-col ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-60'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-[#EFE7D8] dark:border-[#3D3633] shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab('overview'); onCloseMobile(); }}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
          >
            <HabMonogramIcon className="w-9 h-9 shrink-0" forceBlack />
            <div className={`min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <div className="text-sm font-black text-[#4C4541] dark:text-[#F2C46A] truncate tracking-tight">
                HAB BUSINESS
              </div>
              <div className="text-[11px] text-[#4C4541]/70 dark:text-[#8C847E] truncate">
                Integrated Operations
              </div>
            </div>
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={() => { hideTooltip(); onToggleCollapse(); }}
              onMouseEnter={(e) => showTooltip(e, isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')}
              onMouseLeave={hideTooltip}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-[#4C4541]/80 hover:bg-[#F2C46A]/20 dark:text-slate-300 dark:hover:bg-[#3D3633] transition-colors cursor-pointer shrink-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#4C4541]/70 hover:bg-black/5 dark:text-slate-300"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {(allowedTabs === 'ALL' || allowedTabs.includes('overview')) && (
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); onCloseMobile(); }}
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
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${isOverviewActive ? 'text-[#4C4541]' : 'text-[#4C4541]/75 dark:text-slate-400'}`} />
                <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                  {isAmharic ? t('nav.dashboard') : 'Overview'}
                </span>
              </div>
            </button>
          )}

          {visibleCategories.map((category) => {
            const CatIcon = category.icon;
            const isOpen = openCategoryId === category.id;
            const hasActiveChild = category.items.some((item) => item.id === activeTab);
            const totalCatBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <div key={category.id} className="pt-1">
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
                    <CatIcon className={`w-4 h-4 shrink-0 ${hasActiveChild && !isOpen ? 'text-[#4C4541]' : 'text-[#4C4541]/75 dark:text-slate-400'}`} />
                    <span className="truncate">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalCatBadges > 0 && !isOpen && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${hasActiveChild ? 'bg-[#4C4541] text-[#F2C46A]' : 'bg-[#4C4541]/10 text-[#4C4541]'}`}>
                        {totalCatBadges}
                      </span>
                    )}
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </div>
                </button>

                {isOpen && (
                  <div className={`pl-3.5 pr-1 py-1 mt-0.5 space-y-0.5 border-l border-[#AEAC78]/50 ml-4 ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => { setActiveTab(item.id); onCloseMobile(); }}
                          onMouseEnter={(e) => showTooltip(e, item.fullName)}
                          onMouseLeave={hideTooltip}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] text-left cursor-pointer ${
                            isActive ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-[#4C4541]/85 dark:text-slate-300 hover:bg-[#F2C46A]/15 font-normal'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#4C4541]' : 'text-[#4C4541]/65 dark:text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${isActive ? 'bg-[#4C4541] text-[#F2C46A]' : 'bg-[#4C4541]/10 text-[#4C4541]'}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

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
                          className={`relative w-10 h-9 flex items-center justify-center rounded-lg cursor-pointer ${
                            isActive ? 'bg-[#F2C46A] text-[#4C4541]' : 'text-[#4C4541]/75 hover:bg-[#F2C46A]/20'
                          }`}
                          aria-label={item.label}
                        >
                          <ItemIcon className="w-4 h-4 shrink-0" />
                          {item.badge !== undefined && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <SidebarUserFooter
          activeUser={activeUser}
          isCollapsed={isCollapsed}
          isAmharic={isAmharic}
          onLogout={onLogout}
          onMouseEnter={(e) => showTooltip(e, isAmharic ? 'ውጣ (Sign Out)' : 'Sign Out')}
          onMouseLeave={hideTooltip}
        />
      </aside>
    </>
  );
};
