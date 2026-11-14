import React from 'react';
import { Power } from 'lucide-react';
import { ManagementPerson } from '../../types/hrm';

interface SidebarUserFooterProps {
  activeUser?: ManagementPerson;
  isCollapsed: boolean;
  isAmharic: boolean;
  onLogout?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: () => void;
}

export const SidebarUserFooter: React.FC<SidebarUserFooterProps> = ({
  activeUser,
  isCollapsed,
  isAmharic,
  onLogout,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!onLogout) return null;

  return (
    <div className="p-2.5 border-t border-[#EFE7D8] dark:border-[#3D3633] shrink-0">
      <button
        type="button"
        onClick={onLogout}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full flex items-center ${
          isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-2.5 px-3'
        } py-2 rounded-lg text-xs font-semibold text-[#4C4541]/80 dark:text-slate-300 hover:bg-[#F2C46A] hover:text-[#4C4541] dark:hover:bg-[#3D3633] transition-colors cursor-pointer`}
      >
        <Power className="w-4 h-4 shrink-0" />
        <span className={isCollapsed ? 'lg:hidden' : ''}>
          {isAmharic ? 'ውጣ (Sign Out)' : 'Sign Out'}
        </span>
      </button>
    </div>
  );
};
