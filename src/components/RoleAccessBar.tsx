import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, UserCog } from 'lucide-react';
import { ManagementPerson } from '../types/hrm';
import { getRoleConfig } from '../utils/roleConfig';

interface RoleAccessBarProps {
  activeUser: ManagementPerson;
  managementPersons: ManagementPerson[];
  onSelectActiveUser: (user: ManagementPerson) => void;
}

const SHORT_ROLE_LABELS: Record<string, string> = {
  'mgmt-hr-head': 'HR Head (Full)',
  'mgmt-ceo': 'CEO (Full)',
  'mgmt-fin-head': 'Finance & Payroll',
  'mgmt-storekeeper': 'Store Keeper',
  'mgmt-hr-ops': 'HR Operations',
  'mgmt-hr-talent': 'Recruitment & Records',
  'mgmt-supervisor-dan': 'Site Supervisor',
  'mgmt-legal': 'Legal Advisor',
  'mgmt-ops-head': 'Operations Head'
};

export const RoleAccessBar: React.FC<RoleAccessBarProps> = ({
  activeUser,
  managementPersons,
  onSelectActiveUser
}) => {
  const roleConfig = getRoleConfig(activeUser);

  // Order key distinct roles for quick 1-click switching
  const orderedIds = [
    'mgmt-hr-head',
    'mgmt-fin-head',
    'mgmt-storekeeper',
    'mgmt-hr-ops',
    'mgmt-hr-talent',
    'mgmt-supervisor-dan',
    'mgmt-legal',
    'mgmt-ceo'
  ];

  const quickRoles = orderedIds
    .map(id => managementPersons.find(p => p.id === id))
    .filter((p): p is ManagementPerson => Boolean(p));

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 no-print transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        
        {/* Left: Quick 1-Click Role Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0 pr-1">
            <UserCog className="w-3.5 h-3.5 text-amber-600" />
            <span>Role View:</span>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {quickRoles.map((person) => {
              const isSelected = person.id === activeUser.id;
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => onSelectActiveUser(person)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60 font-medium'
                  }`}
                  title={`Switch to ${person.name} (${person.title})`}
                >
                  {SHORT_ROLE_LABELS[person.id] || person.title.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Role Capabilities Summary */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Permissions:</span>
          </span>
          {roleConfig.capabilities.map((cap, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300 dark:text-slate-700">·</span>}
              <span
                className={`inline-flex items-center gap-1 ${
                  cap.allowed
                    ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-slate-400 dark:text-slate-500 line-through'
                }`}
              >
                {cap.allowed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                )}
                <span>{cap.label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};
