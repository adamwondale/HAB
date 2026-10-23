import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  Moon, 
  Sun, 
  Languages,
  Search,
  Bell,
  User,
  Power,
  ArrowRight
} from 'lucide-react';
import { ServiceType, ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';

interface TopBarProps {
  activeTab: string;
  onOpenMobileSidebar: () => void;
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
}

const QUICK_SEARCH_MODULES = [
  { id: 'overview', label: 'Overview Dashboard', keywords: 'dashboard overview metrics kpi' },
  { id: 'management', label: 'Employees Directory', keywords: 'employees staff guards cleaners directory' },
  { id: 'recruitment', label: 'Recruitment Pipeline', keywords: 'recruitment candidates hiring applicants' },
  { id: 'onboarding', label: 'Onboarding Checklists', keywords: 'onboarding checklist guarantor uniform' },
  { id: 'deployment', label: 'Client Site Deployments', keywords: 'deployment sites cbe airlines hyatt hospital' },
  { id: 'attendance', label: 'Daily Shift Attendance', keywords: 'attendance roll call shift clock in overtime' },
  { id: 'leave', label: 'Leave Requests & Relief', keywords: 'leave vacation sick relief officer' },
  { id: 'payroll', label: '30-Day Payroll Sheet', keywords: 'payroll salary pension tax allowance' },
  { id: 'store', label: '3D Store & Stock Control', keywords: 'store stock warehouse 3d uniform boots' },
  { id: 'transfers', label: 'Transfers & Promotions', keywords: 'transfer promotion site rotation' },
  { id: 'clearance', label: 'HR Exit Clearance', keywords: 'clearance exit termination handover' },
  { id: 'experience', label: 'Work Experience Certificates', keywords: 'experience certificate testimonial' },
  { id: 'org', label: 'Organization & Roles', keywords: 'organization hierarchy roles settings' }
];

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
  darkMode,
  onToggleDarkMode,
  activeUser,
  managementPersons,
  onSelectActiveUser,
  onNavigateTab,
  onLogout,
  pendingLeaveCount = 0,
  activeClearanceCount = 0
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

  const totalNotifications = pendingLeaveCount + activeClearanceCount + 1;

  return (
    <header className="bg-[#FFF9DB] dark:bg-slate-900 border-b border-[#F3E5AB] dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="bg-[#FFF9DB] dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Rounded Grey Search Pill (matching Image 2) */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-[#0E1525] hover:bg-black/10 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Brand Monogram */}
          <div className="lg:hidden w-8 h-8 rounded-lg bg-[#E2E47A] p-1 flex items-center justify-center border border-[#0E1525]/20 shrink-0">
            <HabMonogramIcon className="w-full h-full" forceBlack />
          </div>

          {/* Search Pill Bar */}
          <div className="relative flex-1">
            <div className="flex items-center bg-[#E4E6EB] dark:bg-slate-800 rounded-full px-3.5 py-2 shadow-inner border border-black/5 dark:border-slate-700">
              <Search className="w-4 h-4 text-[#0E1525] dark:text-slate-300 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                placeholder={i18n.language === 'am' ? 'ፈልግ (ሰራተኞች፣ ክፍሎች)...' : 'Search modules, staff, sites...'}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#0E1525] dark:text-slate-100 placeholder-[#0E1525]/55 dark:placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Live Quick-Jump Search Dropdown */}
            {isSearchFocused && filteredModules.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                {filteredModules.slice(0, 6).map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onMouseDown={() => {
                      if (onNavigateTab) onNavigateTab(mod.id);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#DFE16A]/40 flex items-center justify-between"
                  >
                    <span>{mod.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Language Toggle, Dark Mode, Notification Bell & User Avatar (matching Image 2) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Amharic / English Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-slate-800 text-xs font-bold text-[#0E1525] dark:text-slate-200 transition-colors cursor-pointer"
            title={i18n.language === 'am' ? "Switch to English" : "ወደ አማርኛ ቀይር"}
          >
            <Languages className="w-3.5 h-3.5 text-[#0E1525] dark:text-amber-400" />
            <span>{i18n.language === 'am' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Quick Low-Light / Night Shift Mode Toggle */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={darkMode ? "Switch to Day Mode" : "Switch to Night Shift / Low-Light Mode"}
              className="p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-slate-800 text-[#0E1525] dark:text-amber-400 transition-colors cursor-pointer"
              aria-label="Toggle Night Shift Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0E1525]" />}
            </button>
          )}

          {/* Notification Bell Icon (matching Image 2) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-black/10 dark:hover:bg-slate-800 text-[#0E1525] dark:text-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#0E1525] dark:bg-amber-400 ring-2 ring-[#FFF9DB] dark:ring-slate-900" />
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                    Workspace Notifications ({totalNotifications})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('leave');
                      setIsNotifOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#DFE16A]/30 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">Pending Leave Requests</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EBE834] text-[#0E1525] font-bold">{pendingLeaveCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('clearance');
                      setIsNotifOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#DFE16A]/30 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">Active Exit Clearances</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EBE834] text-[#0E1525] font-bold">{activeClearanceCount}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Circular User Profile Avatar & Role Switcher (matching Image 2's lilac/purple circular avatar) */}
          {activeUser && managementPersons && onSelectActiveUser && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-[#0E1525]/40 transition-all cursor-pointer"
                title={`${activeUser.name} — ${activeUser.title}`}
              >
                <div className="w-9 h-9 rounded-full bg-[#D8B4E2] border-2 border-[#0E1525] text-[#0E1525] flex items-center justify-center font-bold text-xs shadow-xs">
                  <User className="w-5 h-5 stroke-[2]" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isRoleMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsRoleMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
                    {/* Signed-in User Header */}
                    <div className="px-3.5 py-2.5 bg-[#DFE16A]/40 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-extrabold text-[#0E1525] dark:text-white">
                        {i18n.language === 'am' && activeUser.amharicName ? activeUser.amharicName : activeUser.name}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {activeUser.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {activeUser.email}
                      </div>
                    </div>

                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          {t('topbar.switchPersona')}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#EBE834] text-[#0E1525] font-bold rounded">
                          {i18n.language === 'am' ? 'ሚና-ተኮር ገጽታ' : 'Role-Based ERP'}
                        </span>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
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
                            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-[#DFE16A] text-[#0E1525] font-bold border border-[#0E1525]/20' 
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-full bg-[#0E1525] text-[#FFF500] flex items-center justify-center font-bold text-xs shrink-0">
                              {p.name.split(' ')[1] ? p.name.split(' ')[1][0] : p.name[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {i18n.language === 'am' && p.amharicName ? p.amharicName : p.name}
                                </span>
                                <span className="text-[9px] text-slate-500 shrink-0 font-medium">
                                  {p.department.split(' ')[0]}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">
                                {p.title}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {onLogout && (
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0E1525] hover:bg-[#19233C] text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>Sign Out to Login Screen</span>
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
