import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavCategory } from './sidebarNavigationData';

interface SidebarCategorySectionProps {
  category: NavCategory;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  showTooltip: (e: React.MouseEvent<HTMLElement>, text: string) => void;
  hideTooltip: () => void;
}

export const SidebarCategorySection: React.FC<SidebarCategorySectionProps> = ({
  category,
  isOpen,
  onToggle,
  activeTab,
  setActiveTab,
  onCloseMobile,
  isCollapsed,
  showTooltip,
  hideTooltip
}) => {
  const CatIcon = category.icon;
  const hasActiveChild = category.items.some((item) => item.id === activeTab);
  const totalCatBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onToggle}
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
};
