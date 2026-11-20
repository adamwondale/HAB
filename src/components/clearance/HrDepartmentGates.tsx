import React from 'react';
import { CheckCircle2, Lock, UserCheck } from 'lucide-react';
import { ClearanceRecord, ManagementPerson } from '../../types/hrm';

interface HrDepartmentGatesProps {
  record: ClearanceRecord;
  activeUser?: ManagementPerson;
  isSuperAdmin: boolean;
  onSignoffDept: (dept: 'supervisor' | 'store' | 'finance' | 'hr') => void;
}

export const HrDepartmentGates: React.FC<HrDepartmentGatesProps> = ({
  record,
  activeUser,
  isSuperAdmin,
  onSignoffDept
}) => {
  const canSignDept = (dept: string) => {
    if (isSuperAdmin) return true;
    if (!activeUser) return true;
    if (dept === 'supervisor') return activeUser.id.includes('supervisor') || activeUser.permissions.canApproveClearance;
    if (dept === 'store') return activeUser.permissions.canVerifyInventoryReturn;
    if (dept === 'finance') return activeUser.permissions.canApprovePayroll;
    return activeUser.permissions.canApproveClearance;
  };

  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
        <UserCheck className="w-3.5 h-3.5 text-amber-700" />
        <span>Sequential Cross-Department Sign-Off Gates</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Gate 1 */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">1. Site Supervisor Handover</span>
            {record.siteSupervisorSignoff.completed ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
            ) : canSignDept('supervisor') ? (
              <button type="button" onClick={() => onSignoffDept('supervisor')} className="px-2 py-1 bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] rounded">Sign Gate #1</button>
            ) : <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{record.siteSupervisorSignoff.signedBy || 'Pending shift handover.'}</p>
        </div>

        {/* Gate 2 */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">2. Central Store & Gear</span>
            {record.storeAssetSignoff.completed ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
            ) : canSignDept('store') ? (
              <button type="button" onClick={() => onSignoffDept('store')} className="px-2 py-1 bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] rounded">Sign Gate #2</button>
            ) : <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{record.storeAssetSignoff.signedBy || 'Physical audit of items.'}</p>
        </div>

        {/* Gate 3 */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">3. Finance Settlement</span>
            {record.financeSignoff.completed ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>
            ) : canSignDept('finance') ? (
              <button type="button" onClick={() => onSignoffDept('finance')} className="px-2 py-1 bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] rounded">Sign Gate #3</button>
            ) : <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{record.financeSignoff.signedBy || 'Settles advances & suspense.'}</p>
        </div>

        {/* Gate 4 */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">4. HR Director Final Certification</span>
            {record.hrClearanceSignoff.completed ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Certified</span>
            ) : canSignDept('hr') ? (
              <button type="button" onClick={() => onSignoffDept('hr')} className="px-2 py-1 bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] rounded">Certify Exit</button>
            ) : <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{record.hrClearanceSignoff.signedBy || 'Issues separation certificate.'}</p>
        </div>
      </div>
    </div>
  );
};
