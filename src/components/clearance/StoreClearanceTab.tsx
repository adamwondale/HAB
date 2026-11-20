import React, { useState } from 'react';
import { PackageCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ClearanceRecord, ManagementPerson } from '../../types/hrm';
import { logAuditEvent } from '../../utils/auditLogger';

interface StoreClearanceTabProps {
  clearances: ClearanceRecord[];
  onUpdateClearance: (updated: ClearanceRecord) => void;
  activeUser?: ManagementPerson;
  canEdit?: boolean;
}

export const StoreClearanceTab: React.FC<StoreClearanceTabProps> = ({
  clearances,
  onUpdateClearance,
  activeUser,
  canEdit = true
}) => {
  const [subTab, setSubTab] = useState<'waiting' | 'finished'>('waiting');

  const isStoreFinished = (c: ClearanceRecord) =>
    c.storeStatus === 'returned' ||
    c.storeItemsReturned === true ||
    ['finance_pending', 'admin_signoff', 'completed'].includes(c.stage || '');

  const waitingRecords = clearances.filter((c) => !isStoreFinished(c));
  const finishedRecords = clearances.filter(isStoreFinished);
  const displayedRecords = subTab === 'waiting' ? waitingRecords : finishedRecords;

  const handleToggleStoreItemsReturned = (record: ClearanceRecord) => {
    if (!canEdit) return;
    const nextReturned = !record.storeItemsReturned;
    onUpdateClearance({
      ...record,
      storeItemsReturned: nextReturned,
      storeStatus: nextReturned ? 'returned' : 'waiting'
    });
    logAuditEvent({
      actorId: activeUser?.id || 'mgmt-super-admin',
      actorName: activeUser?.name || 'Super Admin',
      actorRole: activeUser?.role || 'super_admin',
      action: 'CLEARANCE_ASSET_RETURN',
      targetModule: 'Clearance',
      targetId: record.id,
      details: `Toggled asset return status to ${nextReturned ? 'RETURNED' : 'PENDING'} for ${record.employeeName}`
    });
  };

  const handleConfirmStoreReturn = (record: ClearanceRecord) => {
    if (!canEdit) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const signer = activeUser ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})` : 'Central Store Keeper';
    onUpdateClearance({
      ...record,
      stage: 'finance_pending',
      storeStatus: 'returned',
      storeItemsReturned: true,
      storeVerifiedAt: nowStr,
      storeVerifiedBy: signer,
      storeAssetSignoff: {
        completed: true,
        signedBy: signer,
        signedDate: nowStr,
        remarks: 'Physical asset verification confirmed. Transitioned to Finance liquidation.'
      }
    });
    logAuditEvent({
      actorId: activeUser?.id || 'mgmt-super-admin',
      actorName: activeUser?.name || 'Super Admin',
      actorRole: activeUser?.role || 'super_admin',
      action: 'CLEARANCE_ASSET_RETURN',
      targetModule: 'Clearance',
      targetId: record.id,
      details: `Confirmed Store asset return & transitioned ${record.employeeName} to Finance Liquidation`
    });
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs: Waiting vs Finished */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('waiting')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'waiting'
                ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Waiting Store Clearance ({waitingRecords.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('finished')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'finished'
                ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finished Clearance ({finishedRecords.length})</span>
          </button>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          Wireframe Image 14 · Central Store Equipment Handover
        </div>
      </div>

      {/* Clearance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF0DA]/60 dark:bg-slate-800/80 text-[#4C4541] dark:text-slate-200 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Division & Role</th>
                <th className="py-3 px-4">Last Day</th>
                <th className="py-3 px-4 text-center">Store Items Returned</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No clearance records currently in {subTab} state.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((c) => {
                  const isReturned = c.storeItemsReturned ?? isStoreFinished(c);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <div>{c.employeeName}</div>
                        <div className="text-[11px] font-mono text-slate-500 font-normal">{c.employeeCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{c.serviceType}</span>
                        <div className="text-[11px] text-slate-500">{c.role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">{c.targetExitDate}</td>
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(isReturned)}
                            disabled={!canEdit || isStoreFinished(c)}
                            onChange={() => handleToggleStoreItemsReturned(c)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer disabled:opacity-60"
                          />
                          <span className={`text-[11px] font-medium ${isReturned ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>
                            {isReturned ? 'Returned' : 'Pending'}
                          </span>
                        </label>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isStoreFinished(c)
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                        }`}>
                          {isStoreFinished(c) ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isStoreFinished(c) ? 'Returned' : 'Waiting'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isStoreFinished(c) ? (
                          <button
                            type="button"
                            onClick={() => handleConfirmStoreReturn(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2C46A] hover:bg-[#e0b459] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Confirm Return</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">Verified {c.storeVerifiedAt || 'Done'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
