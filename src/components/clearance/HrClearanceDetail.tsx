import React from 'react';
import { CheckCircle2, XCircle, Printer, Package, ShieldCheck } from 'lucide-react';
import { ClearanceRecord, ManagementPerson } from '../../types/hrm';
import { SystemMasterConfig } from '../../types/masterConfig';
import { getGearPenaltyFromMaster } from '../../utils/masterConfigEngine';
import { logAuditEvent } from '../../utils/auditLogger';
import { HrDepartmentGates } from './HrDepartmentGates';

interface HrClearanceDetailProps {
  record: ClearanceRecord;
  activeUser?: ManagementPerson;
  masterConfig: SystemMasterConfig;
  onUpdateClearance: (updated: ClearanceRecord) => void;
  onOpenCertificate: () => void;
}

export const HrClearanceDetail: React.FC<HrClearanceDetailProps> = ({
  record,
  activeUser,
  masterConfig,
  onUpdateClearance,
  onOpenCertificate
}) => {
  const isSuperAdmin = activeUser?.role === 'super_admin' || activeUser?.id === 'mgmt-super-admin';
  const canVerifyInventory = activeUser ? activeUser.permissions.canVerifyInventoryReturn || isSuperAdmin : true;

  const handleToggleItemReturn = (itemId: string) => {
    if (!canVerifyInventory) return;
    const updatedItems = record.issuedItems.map((item) => {
      if (item.id === itemId) {
        const nextReturned = !item.isReturned;
        const newCondition: 'Good' | 'Damaged' | 'Missing' = nextReturned ? 'Good' : 'Missing';
        return {
          ...item,
          isReturned: nextReturned,
          condition: newCondition,
          penaltyFee: getGearPenaltyFromMaster(item.category, item.name, newCondition, masterConfig)
        };
      }
      return item;
    });
    onUpdateClearance({ ...record, issuedItems: updatedItems });
  };

  const handleChangeCondition = (itemId: string, condition: 'Good' | 'Damaged' | 'Missing') => {
    if (!canVerifyInventory) return;
    const updatedItems = record.issuedItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          condition,
          isReturned: condition !== 'Missing',
          penaltyFee: getGearPenaltyFromMaster(item.category, item.name, condition, masterConfig)
        };
      }
      return item;
    });
    onUpdateClearance({ ...record, issuedItems: updatedItems });
  };

  const handleSignoffDept = (dept: 'supervisor' | 'store' | 'finance' | 'hr') => {
    const nowStr = new Date().toISOString().split('T')[0];
    const signer = activeUser ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})` : 'Authorized Officer';
    const updated = { ...record };

    if (dept === 'supervisor') {
      updated.siteSupervisorSignoff = { completed: true, signedBy: signer, signedDate: nowStr, remarks: 'Verified post handover.' };
    } else if (dept === 'store') {
      updated.stage = 'finance_pending';
      updated.storeStatus = 'returned';
      updated.storeItemsReturned = true;
      updated.storeAssetSignoff = { completed: true, signedBy: signer, signedDate: nowStr, remarks: 'Store assets received.' };
    } else if (dept === 'finance') {
      updated.stage = 'admin_signoff';
      updated.financeStatus = 'liquidated';
      updated.financeSignoff = { completed: true, signedBy: signer, signedDate: nowStr, salaryAdvanceDeduction: 0, unreturnedGearCost: 0, finalSeveranceSettlement: 7500 };
    } else if (dept === 'hr') {
      updated.hrClearanceSignoff = { completed: true, signedBy: signer, signedDate: nowStr, certificateIssued: true, certificateNumber: `HAB-CLR-2026-${Math.floor(100 + Math.random() * 900)}` };
      updated.status = 'Cleared';
      updated.stage = 'completed';
    }
    onUpdateClearance(updated);
  };

  const handleSuperAdminFinalApproval = () => {
    const nowStr = new Date().toISOString().split('T')[0];
    onUpdateClearance({
      ...record,
      stage: 'completed',
      status: 'Cleared',
      superAdminApprovedAt: nowStr,
      hrClearanceSignoff: {
        completed: true,
        signedBy: activeUser?.name || 'Super Admin (Executive Sign-Off)',
        signedDate: nowStr,
        certificateIssued: true,
        certificateNumber: `HAB-CLR-2026-${Math.floor(100 + Math.random() * 900)}`,
        remarks: 'Executive Super Admin approval granted. Labor relationship finalized.'
      }
    });
    logAuditEvent({
      actorId: activeUser?.id || 'mgmt-super-admin',
      actorName: activeUser?.name || 'Super Admin',
      actorRole: activeUser?.role || 'super_admin',
      action: 'SUPER_ADMIN_CLEARANCE_APPROVAL',
      targetModule: 'Clearance',
      targetId: record.id,
      details: `Super Admin granted final exit clearance approval for ${record.employeeName}`
    });
  };

  const returnedCount = record.issuedItems.filter((i) => i.isReturned).length;
  const totalPenalties = record.issuedItems.reduce((sum, item) => sum + (item.isReturned ? 0 : item.penaltyFee), 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{record.employeeName}</h2>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {record.employeeCode}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-[#FCF0DA] text-[#4C4541]">{record.serviceType}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2">
            <span>Role: <strong>{record.role}</strong></span>
            <span>·</span>
            <span>Site: <strong>{record.siteName}</strong></span>
            <span>·</span>
            <span>Reason: <strong>{record.exitReason}</strong></span>
          </div>
        </div>

        {(record.status === 'Cleared' || record.stage === 'completed') && (
          <button type="button" onClick={onOpenCertificate} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        )}
      </div>

      {/* Super Admin Executive Final Sign-Off Banner */}
      {record.stage === 'admin_signoff' && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">Awaiting Super Admin Final Sign-Off</div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300">
                Store items returned and Finance liquidation settled. Authorize final separation certificate.
              </div>
            </div>
          </div>
          <button type="button" onClick={handleSuperAdminFinalApproval} className="px-4 py-2 bg-[#F2C46A] hover:bg-[#e0b459] text-[#4C4541] font-bold text-xs rounded-lg shadow-xs shrink-0">
            Grant Final Approval
          </button>
        </div>
      )}

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Items Surrendered</span>
          <span className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">{returnedCount} of {record.issuedItems.length}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Gear Penalty</span>
          <span className={`font-bold text-sm tabular-nums ${totalPenalties > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>ETB {totalPenalties.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Target Exit Date</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{record.targetExitDate}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Workflow Stage</span>
          <span className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase">{record.stage?.replace('_', ' ') || record.status}</span>
        </div>
      </div>

      {/* Item Return Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <span>Issued Items & Asset Verification</span>
        </h3>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF0DA]/60 dark:bg-slate-800 text-[#4C4541] dark:text-slate-200 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Recv</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3 text-right">Penalty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {record.issuedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3">
                    <input type="checkbox" checked={item.isReturned} disabled={!canVerifyInventory} onChange={() => handleToggleItemReturn(item.id)} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer" />
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {item.isReturned ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{item.category}</td>
                  <td className="py-2 px-3">
                    <select value={item.condition} disabled={!canVerifyInventory} onChange={(e) => handleChangeCondition(item.id, e.target.value as any)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs">
                      <option value="Good">Good</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {item.penaltyFee > 0 ? <span className="text-rose-600 font-medium">ETB {item.penaltyFee}</span> : <span className="text-slate-400">0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Department Gates Component */}
      <HrDepartmentGates record={record} activeUser={activeUser} isSuperAdmin={isSuperAdmin} onSignoffDept={handleSignoffDept} />
    </div>
  );
};
