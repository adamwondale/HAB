import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  Moon, 
  Sun, 
  Languages,
  Search,
  Bell,
  Power,
  ArrowRight,
  ChevronDown,
  Brain
} from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';

interface TopBarProps {
  activeTab: string;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  serviceFilter: 'All' | ServiceType;
  setServiceFilter: (filter: 'All' | ServiceType) => void;
  totalEmployees: number;
  securityCount: number;
  cleaningCount: number;
  onQuickAction: (action: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeUser?: ManagementPerson;
  managementPersons?: ManagementPerson[];
  onSelectActiveUser?: (user: ManagementPerson) => void;
  onNavigateTab?: (tabId: string) => void;
  onLogout?: () => void;
  pendingLeaveCount?: number;
  activeClearanceCount?: number;
  onOpenCopilot?: () => void;
}

const QUICK_SEARCH_MODULES = [
  { id: 'overview', label: 'Overview Dashboard', keywords: 'dashboard overview metrics kpi' },
  { id: 'management', label: 'Employee Directory', keywords: 'employees staff guards cleaners directory' },
  { id: 'recruitment', label: 'Recruitment Pipeline', keywords: 'recruitment candidates hiring applicants' },
  { id: 'onboarding', label: 'Onboarding Checklists', keywords: 'onboarding checklist guarantor uniform' },
  { id: 'deployment', label: 'Client Site Deployments', keywords: 'deployment sites cbe airlines hyatt hospital' },
  { id: 'attendance', label: 'Daily Shift Attendance', keywords: 'attendance roll call shift clock in overtime' },
  { id: 'leave', label: 'Leave Requests & Relief', keywords: 'leave vacation sick relief officer' },
  { id: 'payroll', label: '30-Day Payroll Sheet', keywords: 'payroll salary pension tax allowance' },
  { id: 'store', label: 'Store & Stock Control', keywords: 'store stock warehouse 3d uniform boots' },
  { id: 'transfers', label: 'Transfers & Promotions', keywords: 'transfer promotion site rotation' },
  { id: 'clearance', label: 'Exit Clearance', keywords: 'clearance exit termination handover' },
  { id: 'experience', label: 'Experience Certificates', keywords: 'experience certificate testimonial' },
  { id: 'org', label: 'Organization & Roles', keywords: 'organization hierarchy roles settings' },
  { id: 'master-setup', label: 'System Master Setup (Tax, Pension & Rules)', keywords: 'master setup super admin tax pension overtime salary grades penalty rules' }
];

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  darkMode,
  onToggleDarkMode,
  activeUser,
  managementPersons,
  onSelectActiveUser,
  onNavigateTab,
  onLogout,
  pendingLeaveCount = 0,
  activeClearanceCount = 0,
  onOpenCopilot
}) => {
  const { t, i18n } = useTranslation();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'am' ? 'en' : 'am';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('hab_language', nextLang);
  };

  const filteredModules = searchQuery.trim()
    ? QUICK_SEARCH_MODULES.filter(
        m =>
          m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalNotifications = pendingLeaveCount + activeClearanceCount;

  return (
    <header className="bg-[#FFF9DB] dark:bg-slate-900 border-b border-[#EFE1AA] dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Toggle (Mobile & Full-Screen Desktop) + Search Input */}
        <div className="flex items-center gap-2.5 flex-1 max-w-sm">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[#0E1525] hover:bg-black/5 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden w-7 h-7 rounded-md bg-[#EBE834] p-1 flex items-center justify-center border border-[#0E1525]/15 shrink-0">
            <HabMonogramIcon className="w-full h-full" forceBlack />
          </div>

          <div className="relative flex-1">
            <div className="flex items-center bg-[#FFFDE8] dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-[#EFE1AA] dark:border-slate-700">
              <Search className="w-3.5 h-3.5 text-[#0E1525]/60 dark:text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                placeholder={i18n.language === 'am' ? 'ፈልግ...' : 'Jump to module...'}
                className="w-full bg-transparent text-xs font-medium text-[#0E1525] dark:text-slate-100 placeholder-[#0E1525]/50 dark:placeholder-slate-400 focus:outline-none"
              />
            </div>

            {isSearchFocused && filteredModules.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
                {filteredModules.slice(0, 6).map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onMouseDown={() => {
                      if (onNavigateTab) onNavigateTab(mod.id);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-[#FFF9DB] dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>{mod.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Copilot Trigger, Language, Theme, Notifications & Active Role */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenCopilot && (
            <button
              type="button"
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-xs font-semibold transition-colors cursor-pointer"
              title="Open HAB Routine Copilot"
            >
              <Brain className="w-3.5 h-3.5 text-[#EBE834]" />
              <span className="hidden sm:inline">Routine Copilot</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-slate-800 text-xs font-semibold text-[#0E1525] dark:text-slate-200 transition-colors cursor-pointer"
            title={i18n.language === 'am' ? "Switch to English" : "ወደ አማርኛ ቀይር"}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{i18n.language === 'am' ? 'አማ' : 'EN'}</span>
          </button>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={darkMode ? "Switch to Day Mode" : "Switch to Low-Light Mode"}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-slate-800 text-[#0E1525] dark:text-amber-400 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-slate-800 text-[#0E1525] dark:text-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0E1525] dark:bg-amber-400" />
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                    Pending Actions ({totalNotifications})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('leave');
                      setIsNotifOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-300">Leave Requests</span>
                    <span className="font-mono font-bold tabular-nums text-[#0E1525] dark:text-white">{pendingLeaveCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('clearance');
                      setIsNotifOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-300">Exit Clearances</span>
                    <span className="font-mono font-bold tabular-nums text-[#0E1525] dark:text-white">{activeClearanceCount}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Role Switcher */}
          {activeUser && managementPersons && onSelectActiveUser && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FFFDE8] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 hover:border-[#0E1525]/30 transition-colors cursor-pointer text-left"
                title={`${activeUser.name} — ${activeUser.title}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#0E1525] text-[#FFF9DB] flex items-center justify-center font-bold text-[11px] shrink-0">
                  {activeUser.name.split(' ')[1] ? activeUser.name.split(' ')[1][0] : activeUser.name[0]}
                </div>
                <div className="hidden md:block min-w-0 max-w-[140px]">
                  <div className="text-xs font-semibold text-[#0E1525] dark:text-slate-100 truncate leading-tight">
                    {activeUser.name}
                  </div>
                  <div className="text-[10px] text-[#0E1525]/65 dark:text-slate-400 truncate leading-tight">
                    {activeUser.title}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#0E1525]/60 dark:text-slate-400 shrink-0" />
              </button>

              {isRoleMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsRoleMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t('topbar.switchPersona')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Select role view
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-1 space-y-0.5">
                      {managementPersons.map((p) => {
                        const isSelected = p.id === activeUser.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              onSelectActiveUser(p);
                              setIsRoleMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left text-xs transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-[#FFF9DB] dark:bg-slate-800 text-[#0E1525] dark:text-white font-semibold' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-[#0E1525] text-[#FFF9DB] flex items-center justify-center font-bold text-[11px] shrink-0">
                              {p.name.split(' ')[1] ? p.name.split(' ')[1][0] : p.name[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {i18n.language === 'am' && p.amharicName ? p.amharicName : p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {p.title}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {onLogout && (
                      <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md bg-[#0E1525] hover:bg-[#19233C] text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
