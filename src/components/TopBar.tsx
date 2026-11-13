import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, Languages, Search, Bell, LogOut, ArrowRight } from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';
import { getRoleConfig } from '../utils/roleConfig';

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
  onSignOut?: () => void;
  pendingLeaveCount?: number;
  activeClearanceCount?: number;
}

const QUICK_SEARCH_MODULES = [
  { id: 'overview', label: 'Company summary', keywords: 'dashboard overview summary report' },
  { id: 'management', label: 'Employees', keywords: 'employees staff guards cleaners directory' },
  { id: 'recruitment', label: 'Job applicants', keywords: 'recruitment candidates hiring applicants' },
  { id: 'onboarding', label: 'New employees', keywords: 'onboarding checklist guarantor uniform' },
  { id: 'deployment', label: 'Work sites', keywords: 'deployment sites cbe airlines hyatt hospital' },
  { id: 'attendance', label: 'Attendance', keywords: 'attendance roll call shift clock in overtime' },
  { id: 'leave', label: 'Leave requests', keywords: 'leave vacation sick relief officer' },
  { id: 'payroll', label: 'Payroll', keywords: 'payroll salary pension tax allowance' },
  { id: 'store', label: 'Company property', keywords: 'store stock warehouse uniform boots property' },
  { id: 'transfers', label: 'Transfers', keywords: 'transfer promotion site rotation' },
  { id: 'clearance', label: 'Employee exit', keywords: 'clearance exit termination handover' },
  { id: 'experience', label: 'Work letters', keywords: 'experience certificate testimonial' },
  { id: 'master-setup', label: 'Settings', keywords: 'settings tax pension overtime salary grades penalty rules credentials' }
];

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
  darkMode,
  onToggleDarkMode,
  activeUser,
  onNavigateTab,
  onLogout,
  onSignOut,
  pendingLeaveCount = 0,
  activeClearanceCount = 0
}) => {
  const { i18n } = useTranslation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSignOut = onSignOut || onLogout;
  const roleConfig = activeUser ? getRoleConfig(activeUser) : null;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'am' ? 'en' : 'am';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('hab_language', nextLang);
  };

  const filteredModules = searchQuery.trim()
    ? QUICK_SEARCH_MODULES.filter(m =>
        m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalNotifications = pendingLeaveCount + activeClearanceCount;

  return (
    <header className="bg-[#FCF0DA] dark:bg-[#2C2724] border-b border-[#EFE7D8] dark:border-[#3D3633] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle + Quick Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-sm">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[#4C4541] hover:bg-black/5 dark:text-slate-200 dark:hover:bg-[#3D3633]"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden w-7 h-7 rounded-md bg-[#F2C46A] p-1 flex items-center justify-center border border-[#4C4541]/15 shrink-0">
            <HabMonogramIcon className="w-full h-full" forceBlack />
          </div>

          <div className="relative flex-1">
            <div className="flex items-center bg-white dark:bg-[#1E1B19] rounded-lg px-3 py-1.5 border border-[#EFE7D8] dark:border-[#3D3633]">
              <Search className="w-3.5 h-3.5 text-[#4C4541]/60 dark:text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                placeholder={i18n.language === 'am' ? 'ፈልግ...' : 'Find a page...'}
                className="w-full bg-transparent text-xs font-medium text-[#4C4541] dark:text-[#F7F4EE] placeholder-[#4C4541]/50 dark:placeholder-slate-400 focus:outline-none"
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
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-[#FCF0DA] dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>{mod.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Language, Theme, Notifications & Active Role Badge with Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-[#3D3633] text-xs font-semibold text-[#4C4541] dark:text-slate-200 transition-colors cursor-pointer"
            title={i18n.language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{i18n.language === 'am' ? 'አማ' : 'EN'}</span>
          </button>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Day Mode' : 'Switch to Low-Light Mode'}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-[#3D3633] text-[#4C4541] dark:text-[#F2C46A] transition-colors cursor-pointer"
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
              className="relative p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-[#3D3633] text-[#4C4541] dark:text-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F2C46A]" />
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                    Needs attention ({totalNotifications})
                  </div>
                  <button
                    type="button"
                    onClick={() => { if (onNavigateTab) onNavigateTab('leave'); setIsNotifOpen(false); }}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-300">Leave Requests</span>
                    <span className="font-mono font-bold tabular-nums text-[#4C4541] dark:text-white">{pendingLeaveCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (onNavigateTab) onNavigateTab('clearance'); setIsNotifOpen(false); }}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-300">Exit Clearances</span>
                    <span className="font-mono font-bold tabular-nums text-[#4C4541] dark:text-white">{activeClearanceCount}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Active User Role Badge & Sign Out Button */}
          {activeUser && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1B19] border border-[#EFE7D8] dark:border-[#3D3633]">
                <div className="w-6 h-6 rounded-full bg-[#F2C46A] text-[#4C4541] flex items-center justify-center font-bold text-[11px] shrink-0">
                  {activeUser.name.split(' ')[1] ? activeUser.name.split(' ')[1][0] : activeUser.name[0]}
                </div>
                <div className="min-w-0 max-w-[130px]">
                  <div className="text-xs font-semibold text-[#4C4541] dark:text-[#F7F4EE] truncate leading-tight">
                    {activeUser.name}
                  </div>
                  <div className="text-[10px] text-[#4C4541]/70 dark:text-slate-400 truncate leading-tight font-medium">
                    {roleConfig?.badge || activeUser.roleTitle || activeUser.title}
                  </div>
                </div>
                {roleConfig && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${roleConfig.badgeColor}`}>
                    {roleConfig.type === 'super_admin' ? 'Admin' : roleConfig.type === 'executive' ? 'CEO' : roleConfig.type === 'hr' ? 'HR' : 'Finance'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Sign Out of active session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
