import React, { useState } from 'react';
import { Plus, ArrowRight, CheckCircle2, XCircle, Search } from 'lucide-react';
import { TransferPromotionRecord, Employee, ClientSite, ManagementPerson } from '../types/hrm';
import { INITIAL_TRANSFERS, INITIAL_EMPLOYEES, INITIAL_CLIENT_SITES } from '../data/mockData';
import { NewTransferModal } from './transfer/NewTransferModal';

interface TransferPromotionViewProps {
  transfers?: TransferPromotionRecord[];
  employees?: Employee[];
  sites?: ClientSite[];
  activeUser?: ManagementPerson;
  onExecuteTransfer?: (transferId: string) => void;
  onAddTransfer?: (record: TransferPromotionRecord) => void;
  onApproveTransfer?: (transferId: string) => void;
  onRejectTransfer?: (transferId: string) => void;
  onUpdateEmployeeSite?: (employeeId: string, newSiteName: string) => void;
}

export const TransferPromotionView: React.FC<TransferPromotionViewProps> = ({
  transfers = INITIAL_TRANSFERS,
  employees = INITIAL_EMPLOYEES,
  sites = INITIAL_CLIENT_SITES,
  activeUser,
  onExecuteTransfer,
  onAddTransfer,
  onApproveTransfer,
  onRejectTransfer,
  onUpdateEmployeeSite
}) => {
  const [transferList, setTransferList] = useState<TransferPromotionRecord[]>(transfers);
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeStatus = (status: TransferPromotionRecord['status']): 'pending' | 'approved' | 'rejected' => {
    if (status === 'approved' || status === 'Approved' || status === 'Executed') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  };

  const handleApprove = (record: TransferPromotionRecord) => {
    const approver = activeUser ? `${activeUser.name} (${activeUser.title})` : 'Solomon Teshome (HR Director)';
    const dest = record.destinationSite || record.toSite;

    setTransferList(prev => prev.map(t => t.id === record.id ? { ...t, status: 'approved', approvedBy: approver } : t));
    setEmployeeList(prev => prev.map(e => e.id === record.employeeId ? { ...e, currentSiteName: dest } : e));

    onApproveTransfer?.(record.id);
    onExecuteTransfer?.(record.id);
    onUpdateEmployeeSite?.(record.employeeId, dest);
  };

  const handleReject = (record: TransferPromotionRecord) => {
    const rejecter = activeUser ? `Rejected by ${activeUser.name}` : 'Rejected by HR Operations';
    setTransferList(prev => prev.map(t => t.id === record.id ? { ...t, status: 'rejected', approvedBy: rejecter } : t));
    onRejectTransfer?.(record.id);
  };

  const handleCreateTransfer = (newRec: TransferPromotionRecord) => {
    setTransferList(prev => [newRec, ...prev]);
    onAddTransfer?.(newRec);
  };

  const filteredTransfers = transferList.filter(tr => {
    const status = normalizeStatus(tr.status);
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = tr.employeeName.toLowerCase();
      const code = tr.employeeCode.toLowerCase();
      const current = (tr.currentSite || tr.fromSite).toLowerCase();
      const dest = (tr.destinationSite || tr.toSite).toLowerCase();
      return name.includes(q) || code.includes(q) || current.includes(q) || dest.includes(q);
    }
    return true;
  });

  const pendingCount = transferList.filter(t => normalizeStatus(t.status) === 'pending').length;
  const approvedCount = transferList.filter(t => normalizeStatus(t.status) === 'approved').length;
  const rejectedCount = transferList.filter(t => normalizeStatus(t.status) === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Workforce Relocation</div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Site Transfers & Operations Relocation</h1>
          <p className="text-xs text-slate-500 mt-1">Approve transfer workflows with source and destination site location tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F2C46A] hover:bg-amber-400 text-[#4C4541] font-bold text-xs rounded-xl transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase">Total Transfers</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{transferList.length}</div>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/30 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-800 uppercase">Pending Approval</div>
          <div className="text-xl font-bold text-amber-900 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 bg-emerald-50/30 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase">Approved Transfers</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-white border border-rose-200 bg-rose-50/30 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-800 uppercase">Rejected</div>
          <div className="text-xl font-bold text-rose-900 mt-1">{rejectedCount}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by employee, code, or facility site..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === tab
                    ? 'bg-[#4C4541] text-[#FCF0DA]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-amber-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Relocation Route</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Effective Date</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">No transfer records found matching the criteria.</td>
                </tr>
              ) : (
                filteredTransfers.map(tr => {
                  const status = normalizeStatus(tr.status);
                  const currentSite = tr.currentSite || tr.fromSite;
                  const destinationSite = tr.destinationSite || tr.toSite;

                  return (
                    <tr key={tr.id} className="odd:bg-white even:bg-slate-50/70 hover:bg-amber-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-normal">
                        <div className="font-semibold text-slate-900">{tr.employeeName}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tr.employeeCode} · {tr.serviceType}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="font-medium text-slate-600">{currentSite}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-bold text-amber-900">{destinationSite}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {tr.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{tr.effectiveDate}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={tr.reason}>{tr.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {status === 'pending' ? 'Pending Approval' : status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {status === 'pending' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApprove(tr)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Transfer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(tr)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject Transfer</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 font-medium">
                            {tr.approvedBy || (status === 'approved' ? 'Approved by HR' : 'Rejected')}
                          </div>
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

      <NewTransferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        employees={employeeList}
        sites={sites}
        onSubmit={handleCreateTransfer}
      />
    </div>
  );
};
