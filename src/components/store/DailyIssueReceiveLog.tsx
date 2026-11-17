import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, RotateCcw, AlertTriangle, Plus, Search, FileSpreadsheet } from 'lucide-react';
import { StockTransaction, StockItem, Employee, ClientSite } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';

interface DailyIssueReceiveLogProps {
  transactions: StockTransaction[];
  stockItems: StockItem[];
  employees: Employee[];
  sites: ClientSite[];
  canRecord: boolean;
  onOpenRecordModal?: () => void;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const DailyIssueReceiveLog: React.FC<DailyIssueReceiveLogProps> = ({
  transactions,
  canRecord,
  onOpenRecordModal
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'All' && tx.transactionType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.itemName.toLowerCase().includes(q) ||
        tx.itemCode.toLowerCase().includes(q) ||
        tx.recipientOrSource.toLowerCase().includes(q) ||
        tx.handledBy.toLowerCase().includes(q) ||
        (tx.notes && tx.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const filename = `HAB_Store_Movements_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Date', 'Type', 'Item Code', 'Item Name', 'Quantity', 'Unit', 'Recipient/Supplier', 'Site/Notes', 'Condition', 'Handled By', 'Ref'];
    const rows = filtered.map((tx) => [
      tx.date,
      tx.transactionType,
      tx.itemCode,
      tx.itemName,
      tx.quantity,
      tx.unit,
      tx.recipientOrSource,
      tx.notes || 'Central Store',
      tx.condition || 'N/A',
      tx.handledBy,
      tx.referenceCode || 'N/A'
    ]);
    downloadCsv(filename, headers, rows);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-[#F2C46A]" />
            <span>Daily Store Issue & Receive Log</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit trail of stock movements: restocks, dispatches, handovers, and quarantine write-offs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Log</span>
          </button>
          {canRecord && onOpenRecordModal && (
            <button
              type="button"
              onClick={onOpenRecordModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Movement</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Issued (Out)', 'Received (Restock)', 'Returned (In)', 'Damaged / Lost (Write-off)'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                filterType === type
                  ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movement, item, recipient..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>
      </div>

      {/* Movements Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[820px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Movement Type</th>
              <th className="py-2.5 px-3">Item Details</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3">Recipient / Supplier</th>
              <th className="py-2.5 px-3">Site / Destination</th>
              <th className="py-2.5 px-3">Condition</th>
              <th className="py-2.5 px-3">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                  No inventory movements recorded for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">{tx.date}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.transactionType === 'Issued (Out)'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : tx.transactionType === 'Received (Restock)'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.transactionType === 'Returned (In)'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {tx.transactionType === 'Issued (Out)' && <ArrowUpRight className="w-3 h-3" />}
                      {tx.transactionType === 'Received (Restock)' && <ArrowDownLeft className="w-3 h-3" />}
                      {tx.transactionType === 'Returned (In)' && <RotateCcw className="w-3 h-3" />}
                      {tx.transactionType === 'Damaged / Lost (Write-off)' && <AlertTriangle className="w-3 h-3" />}
                      <span>{tx.transactionType}</span>
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{tx.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tx.itemCode} · Ref: {tx.referenceCode || 'N/A'}</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {tx.quantity} {tx.unit}
                  </td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-medium">{tx.recipientOrSource}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{tx.serviceLocation || tx.notes || 'Central Store'}</td>
                  <td className="py-2 px-3">
                    {tx.condition ? (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        tx.condition === 'Good' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {tx.condition}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{tx.handledBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
