import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { ManagementPerson } from '../../types/hrm';
import { getRoleAllowedTabs } from '../../utils/roleConfig';
import { logAuditEvent } from '../../utils/auditLogger';

interface AccessDeniedBarrierProps {
  activeUser?: ManagementPerson;
  attemptedTab: string;
  onReturnToOverview: () => void;
  onSignOut: () => void;
}

export const AccessDeniedBarrier: React.FC<AccessDeniedBarrierProps> = ({
  activeUser,
  attemptedTab,
  onReturnToOverview,
  onSignOut
}) => {
  const allowed = getRoleAllowedTabs(activeUser);
  const roleName = activeUser?.roleTitle || activeUser?.role || 'Departmental User';

  useEffect(() => {
    // Log unauthorized access attempt in persistent audit trail
    logAuditEvent({
      actorId: activeUser?.id || 'anonymous',
      actorName: activeUser?.name || activeUser?.fullName || 'Anonymous User',
      actorRole: activeUser?.role || 'unknown',
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      targetModule: 'RBAC',
      targetId: attemptedTab,
      details: `Attempted unauthorized navigation to restricted module: ${attemptedTab}`,
      status: 'SECURITY_ALERT'
    });
  }, [attemptedTab, activeUser]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 mb-2">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-xl font-black text-[#4C4541] dark:text-slate-100">
            Access Restricted by Policy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Your departmental role (<strong className="text-slate-700 dark:text-slate-200">{roleName}</strong>) does not have authorization to view or modify the <strong className="text-rose-600 capitalize">"{attemptedTab}"</strong> module.
          </p>
        </div>

        {/* Authorized Modules for this user */}
        <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/60 border border-[#EFE7D8] dark:border-slate-700 rounded-xl p-4 text-left">
          <span className="text-[11px] font-bold text-[#4C4541] dark:text-slate-200 block mb-2">
            Authorized Modules for Your Role:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allowed === 'ALL' ? (
              <span className="text-xs text-emerald-700 font-semibold">Full System Access</span>
            ) : (
              allowed.map((tab) => (
                <span
                  key={tab}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 capitalize"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{tab}</span>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onReturnToOverview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-xs shadow-xs cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
