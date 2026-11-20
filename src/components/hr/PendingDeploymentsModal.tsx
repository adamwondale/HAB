import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, ShieldCheck, Clock, MapPin, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { DeploymentProposal } from '../../types/hrm';

interface PendingDeploymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: DeploymentProposal[];
  onConfirmProposal: (proposal: DeploymentProposal) => void;
  onRejectProposal?: (proposalId: string) => void;
}

export const PendingDeploymentsModal: React.FC<PendingDeploymentsModalProps> = ({
  isOpen,
  onClose,
  proposals,
  onConfirmProposal,
  onRejectProposal
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const pendingList = proposals.filter(p => p.status === 'Pending HR Acknowledgment');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Operations Site Deployments — Pending HR Acknowledgment
              </h2>
              <p className="text-xs text-slate-500">
                {pendingList.length} proposal(s) awaiting HR review and payroll/attendance binding
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {pendingList.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">All Operations Deployments Acknowledged</p>
              <p className="text-[11px] mt-1">No pending site transfer proposals from the Operations Manager.</p>
            </div>
          ) : (
            pendingList.map(prop => (
              <div
                key={prop.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {prop.employeeName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {prop.employeeCode} · {prop.serviceType}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                    {prop.fitScore}% Persona Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Client Site & Category:</span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-[#F2C46A]" />
                      <span>{prop.toSiteName} ({prop.siteCategory})</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Previous Location:</span>
                    <div className="font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                      {prop.fromSiteName || 'Reserve Pool'}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Operations Justification</span>
                  <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">{prop.hrNotes}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Proposed: {prop.proposedDate} by {prop.proposedBy}
                  </span>
                  <div className="flex items-center gap-2">
                    {onRejectProposal && (
                      <button
                        type="button"
                        onClick={() => onRejectProposal(prop.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Request Revision
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onConfirmProposal(prop)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white dark:bg-[#F2C46A] dark:text-[#4C4541] shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Acknowledge & Confirm Deployment</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
