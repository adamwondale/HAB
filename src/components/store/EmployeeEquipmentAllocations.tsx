import React, { useState } from 'react';
import { UserCheck, Search, Download, Plus, CheckCircle, Clock } from 'lucide-react';
import { StockTransaction, StockItem, Employee } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';
import { EquipmentReturnModal } from './EquipmentReturnModal';

interface EmployeeEquipmentAllocationsProps {
  transactions: StockTransaction[];
  stockItems: StockItem[];
  employees: Employee[];
  canManage: boolean;
  onOpenAllocateModal: () => void;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const EmployeeEquipmentAllocations: React.FC<EmployeeEquipmentAllocationsProps> = ({
  transactions,
  canManage,
  onOpenAllocateModal,
  onRecordTransaction
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Returned'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [returnModalTx, setReturnModalTx] = useState<StockTransaction | null>(null);

  const issueTransactions = transactions.filter((tx) => tx.transactionType === 'Issued (Out)');

  const allocations = issueTransactions.map((issue) => {
    const returnTx = transactions.find(
      (tx) =>
        tx.transactionType === 'Returned (In)' &&
        tx.itemId === issue.itemId &&
        tx.recipientOrSource === issue.recipientOrSource &&
        tx.date >= issue.date
    );

    const isReturned = !!returnTx;
    const isOverdue = !isReturned && issue.expectedReturnDate && new Date(issue.expectedReturnDate) < new Date();

    return { issue, returnTx, isReturned, isOverdue };
  });

  const filtered = allocations.filter(({ issue, isReturned }) => {
    if (filterStatus === 'Active' && isReturned) return false;
    if (filterStatus === 'Returned' && !isReturned) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.itemName.toLowerCase().includes(q) ||
        issue.itemCode.toLowerCase().includes(q) ||
        issue.recipientOrSource.toLowerCase().includes(q) ||
        issue.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const filename = `HAB_Equipment_Allocations_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Ref', 'Employee', 'Division', 'Item Name', 'Qty', 'Issued Date', 'Expected Return', 'Actual Return', 'Condition', 'Status'];
    const rows = filtered.map(({ issue, returnTx, isReturned }) => [
      issue.referenceCode || issue.id,
      issue.recipientOrSource,
      issue.division,
      issue.itemName,
      `${issue.quantity} ${issue.unit}`,
      issue.date,
      issue.expectedReturnDate || 'N/A',
      returnTx ? returnTx.date : 'Pending',
      returnTx ? returnTx.condition || 'Good' : 'In Field',
      isReturned ? 'Returned' : 'Active'
    ]);
    downloadCsv(filename, headers, rows);
  };

  const handleConfirmReturn = (baseTx: StockTransaction, condition: any, notes: string) => {
    const returnTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      itemId: baseTx.itemId,
      itemCode: baseTx.itemCode,
      itemName: baseTx.itemName,
      division: baseTx.division,
      transactionType: 'Returned (In)',
      quantity: baseTx.quantity,
      unit: baseTx.unit,
      date: new Date().toISOString().split('T')[0],
      handledBy: 'Store Officer (Ato Girma)',
      recipientOrSource: baseTx.recipientOrSource,
      referenceCode: `RET-${Date.now().toString().slice(-5)}`,
      condition,
      notes: notes.trim() || `Returned from ${baseTx.recipientOrSource}`
    };
    onRecordTransaction(returnTx);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#F2C46A]" />
            <span>Employee Equipment & Uniform Allocations</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track gear assigned to employees, expected return dates, clearance returns, and equipment condition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {canManage && (
            <button
              type="button"
              onClick={onOpenAllocateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Equipment</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {(['All', 'Active', 'Returned'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, item, division..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Employee</th>
              <th className="py-2.5 px-3">Division</th>
              <th className="py-2.5 px-3">Allocated Item</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3">Issue Date</th>
              <th className="py-2.5 px-3">Expected Return</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                  No equipment allocations found matching filter.
                </td>
              </tr>
            ) : (
              filtered.map(({ issue, returnTx, isReturned, isOverdue }) => (
                <tr key={issue.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{issue.recipientOrSource}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{issue.division}</td>
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{issue.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{issue.itemCode}</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {issue.quantity} {issue.unit}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">{issue.date}</td>
                  <td className="py-2 px-3 font-mono text-[11px]">
                    {issue.expectedReturnDate ? (
                      <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {issue.expectedReturnDate} {isOverdue && '(Overdue)'}
                      </span>
                    ) : (
                      <span className="text-slate-400">Permanent/Open</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {isReturned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>Returned ({returnTx?.condition || 'Good'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>In Field</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {!isReturned && canManage ? (
                      <button
                        type="button"
                        onClick={() => setReturnModalTx(issue)}
                        className="px-2.5 py-1 rounded-md bg-[#FCF0DA] hover:bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] cursor-pointer"
                      >
                        Process Return
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EquipmentReturnModal
        isOpen={!!returnModalTx}
        tx={returnModalTx}
        onClose={() => setReturnModalTx(null)}
        onConfirmReturn={handleConfirmReturn}
      />
    </div>
  );
};
