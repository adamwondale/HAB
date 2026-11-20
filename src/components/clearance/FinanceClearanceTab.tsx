import React, { useState } from 'react';
import { Landmark, Clock, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { ClearanceRecord, ManagementPerson } from '../../types/hrm';
import { logAuditEvent } from '../../utils/auditLogger';

interface FinanceClearanceTabProps {
  clearances: ClearanceRecord[];
  onUpdateClearance: (updated: ClearanceRecord) => void;
  activeUser?: ManagementPerson;
  canEdit?: boolean;
}

export const FinanceClearanceTab: React.FC<FinanceClearanceTabProps> = ({
  clearances,
  onUpdateClearance,
  activeUser,
  canEdit = true
}) => {
  const [subTab, setSubTab] = useState<'waiting' | 'finished'>('waiting');

  const isFinanceFinished = (c: ClearanceRecord) =>
    c.stage === 'admin_signoff' || c.stage === 'completed' || c.financeStatus === 'liquidated';

  const isStoreLocked = (c: ClearanceRecord) =>
    !c.storeItemsReturned && c.storeStatus !== 'returned' && !['finance_pending', 'admin_signoff', 'completed'].includes(c.stage || '');

  const waitingRecords = clearances.filter((c) => !isFinanceFinished(c));
  const finishedRecords = clearances.filter(isFinanceFinished);
  const displayedRecords = subTab === 'waiting' ? waitingRecords : finishedRecords;

  const handleConfirmSettlement = (record: ClearanceRecord) => {
    if (!canEdit || isStoreLocked(record)) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const signer = activeUser ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})` : 'Finance Officer';
    const gearDeductions = record.issuedItems.reduce((sum, item) => sum + (item.isReturned ? 0 : item.penaltyFee), 0);
    const severance = Math.max(0, 8500 - (record.suspenseAmount || 0) - gearDeductions);

    onUpdateClearance({
      ...record,
      stage: 'admin_signoff',
      financeStatus: 'liquidated',
      liquidationDate: record.liquidationDate || record.targetExitDate || nowStr,
      financeSettledAt: nowStr,
      financeSettledBy: signer,
      financeSignoff: {
        completed: true,
        signedBy: signer,
        signedDate: nowStr,
        salaryAdvanceDeduction: 0,
        unreturnedGearCost: gearDeductions,
        finalSeveranceSettlement: severance,
        remarks: `Liquidation confirmed with ETB ${record.suspenseAmount || 0} suspense deduction. Synced to HR.`
      }
    });

    logAuditEvent({
      actorId: activeUser?.id || 'mgmt-super-admin',
      actorName: activeUser?.name || 'Super Admin',
      actorRole: activeUser?.role || 'super_admin',
      action: 'CLEARANCE_FINANCE_SETTLED',
      targetModule: 'Clearance',
      targetId: record.id,
      details: `Settled finance liquidation for ${record.employeeName}; transitioned to Admin Sign-Off`
    });
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('waiting')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'waiting' ? 'bg-[#4C4541] text-[#FCF0DA]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Waiting Finance Settlement ({waitingRecords.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('finished')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'finished' ? 'bg-[#4C4541] text-[#FCF0DA]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finished Liquidation ({finishedRecords.length})</span>
          </button>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">Wireframe Image 15 · Finance Exit & Suspense</div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF0DA]/60 dark:bg-slate-800/80 text-[#4C4541] dark:text-slate-200 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Store Gate</th>
                <th className="py-3 px-4">Liquidation Date</th>
                <th className="py-3 px-4">Suspense / Settlement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">No records in {subTab} state.</td>
                </tr>
              ) : (
                displayedRecords.map((c) => {
                  const locked = isStoreLocked(c);
                  return (
                    <tr key={c.id} className={`transition-colors ${locked ? 'bg-amber-50/20 dark:bg-amber-950/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <div>{c.employeeName}</div>
                        <div className="text-[11px] font-mono text-slate-500 font-normal">{c.employeeCode} · {c.serviceType}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          locked ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {locked ? <Lock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {locked ? 'Store Pending' : 'Store Verified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {locked ? (
                          <span className="text-slate-400 text-xs">{c.targetExitDate}</span>
                        ) : (
                          <input
                            type="date"
                            value={c.liquidationDate || c.targetExitDate || ''}
                            disabled={!canEdit || isFinanceFinished(c)}
                            onChange={(e) => onUpdateClearance({ ...c, liquidationDate: e.target.value })}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {locked ? (
                          <span className="text-slate-400 italic text-[11px]">Locked (Store First)</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-500">ETB</span>
                            <input
                              type="number"
                              value={c.suspenseAmount ?? 0}
                              disabled={!canEdit || isFinanceFinished(c)}
                              onChange={(e) => onUpdateClearance({ ...c, suspenseAmount: Number(e.target.value) || 0 })}
                              className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono"
                            />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          locked ? 'bg-slate-100 text-slate-600 border-slate-200' : isFinanceFinished(c) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-900 border-blue-200'
                        }`}>
                          {locked ? 'Locked' : isFinanceFinished(c) ? 'Liquidated' : 'Ready'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {locked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs rounded font-medium">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        ) : !isFinanceFinished(c) ? (
                          <button
                            type="button"
                            onClick={() => handleConfirmSettlement(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2C46A] hover:bg-[#e0b459] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs"
                          >
                            <Landmark className="w-3.5 h-3.5" />
                            <span>Confirm Settlement</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">Settled {c.financeSettledAt}</span>
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
