import React, { useState } from 'react';
import { ArrowRightLeft, Check, Building2, User } from 'lucide-react';
import { ClientSite, Employee } from '../../types/hrm';

interface SiteTransferCardProps {
  sites: ClientSite[];
  employees: Employee[];
  onTransferSuccess?: (msg: string) => void;
}

export const SiteTransferCard: React.FC<SiteTransferCardProps> = ({
  sites,
  employees,
  onTransferSuccess
}) => {
  const deployedEmployees = employees.filter((e) => e.status === 'Active' && e.currentSiteName);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(deployedEmployees[0]?.id || '');
  const [targetSiteId, setTargetSiteId] = useState<string>(sites[1]?.id || sites[0]?.id || '');
  const [transferReason, setTransferReason] = useState<string>('Client rotation requirement');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const selectedEmp = employees.find((e) => e.id === selectedEmpId);
  const targetSite = sites.find((s) => s.id === targetSiteId);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !targetSite) return;

    const oldSite = selectedEmp.currentSiteName;
    selectedEmp.currentSiteId = targetSite.id;
    selectedEmp.currentSiteName = targetSite.name;

    const msg = `Transferred ${selectedEmp.firstName} ${selectedEmp.lastName} from ${oldSite} to ${targetSite.name}.`;
    setStatusMsg(msg);
    onTransferSuccess?.(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
          <ArrowRightLeft className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>Inter-Site Staff Transfer Module</span>
        </div>
        <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60">
          Site-to-Site Relocation
        </span>
      </div>

      {statusMsg && (
        <div className="p-2 rounded bg-emerald-100 text-emerald-900 font-semibold text-[11px] flex items-center gap-1.5 border border-emerald-300">
          <Check className="w-3.5 h-3.5 text-emerald-700" /> {statusMsg}
        </div>
      )}

      <form onSubmit={handleExecuteTransfer} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
        <div>
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
            1. Select Employee & Current Site
          </label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white"
          >
            {deployedEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.currentSiteName || 'Unassigned'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
            2. Destination Work Site
          </label>
          <select
            value={targetSiteId}
            onChange={(e) => setTargetSiteId(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white"
          >
            {sites
              .filter((s) => s.id !== selectedEmp?.currentSiteId)
              .map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.district})
                </option>
              ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-1.5 px-3 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Confirm Transfer
          </button>
        </div>
      </form>
    </div>
  );
};
