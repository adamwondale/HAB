import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { getRoleAllowedTabs } from '../utils/roleConfig';
import { HabMonogramIcon } from './HabLogo';
import { buildNavCategories, NavCategory, SidebarProps } from './sidebar/sidebarNavigationData';
import { SidebarUserFooter } from './sidebar/SidebarUserFooter';
import { SidebarCategorySection } from './sidebar/SidebarCategorySection';

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
        className={`fixed lg:sticky top-0 bottom-0 lg:bottom-auto left-0 z-40 bg-[#FCF0DA] dark:bg-[#24201E] border-r border-[#EFE7D8] dark:border-[#3D3633] transition-all duration-200 ease-out flex flex-col lg:h-screen lg:shrink-0 ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-60'}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3'} border-b border-[#EFE7D8] dark:border-[#3D3633] shrink-0`}>
          {isCollapsed ? (
            <div className="hidden lg:flex items-center justify-center w-full">
              <button
                type="button"
                onClick={() => { hideTooltip(); onToggleCollapse?.(); }}
                onMouseEnter={(e) => showTooltip(e, 'Expand Sidebar')}
                onMouseLeave={hideTooltip}
                className="w-10 h-10 rounded-lg text-[#4C4541] hover:bg-[#F2C46A]/25 dark:text-[#F2C46A] dark:hover:bg-[#3D3633] transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => { setActiveTab('overview'); onCloseMobile(); }}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
              >
                <HabMonogramIcon className="w-9 h-9 shrink-0" forceBlack />
                <div className="min-w-0">
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
                  onMouseEnter={(e) => showTooltip(e, 'Collapse Sidebar')}
                  onMouseLeave={hideTooltip}
                  className="p-2 rounded-lg text-[#4C4541]/80 hover:bg-[#F2C46A]/20 dark:text-slate-300 dark:hover:bg-[#3D3633] transition-colors cursor-pointer shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Mobile Drawer Header */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); onCloseMobile(); }}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
            >
              <HabMonogramIcon className="w-9 h-9 shrink-0" forceBlack />
              <div className="min-w-0">
                <div className="text-sm font-black text-[#4C4541] dark:text-[#F2C46A] truncate tracking-tight">
                  HAB BUSINESS
                </div>
                <div className="text-[11px] text-[#4C4541]/70 dark:text-[#8C847E] truncate">
                  Integrated Operations
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#4C4541]/70 hover:bg-black/5 dark:text-slate-300"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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

          {visibleCategories.map((category) => (
            <SidebarCategorySection
              key={category.id}
              category={category}
              isOpen={openCategoryId === category.id}
              onToggle={() => toggleCategory(category.id)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCloseMobile={onCloseMobile}
              isCollapsed={isCollapsed}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          ))}
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
