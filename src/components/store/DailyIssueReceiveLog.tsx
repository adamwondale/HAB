import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Search, Calendar, FileSpreadsheet } from 'lucide-react';
import { StockTransaction, StockItem, Employee, ClientSite } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';

interface DailyIssueReceiveLogProps {
  transactions: StockTransaction[];
  stockItems: StockItem[];
  employees: Employee[];
  sites: ClientSite[];
  canRecord: boolean;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const DailyIssueReceiveLog: React.FC<DailyIssueReceiveLogProps> = ({
  transactions,
  stockItems,
  employees,
  sites,
  canRecord,
  onRecordTransaction
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  // Quick form state
  const [selectedItemId, setSelectedItemId] = useState(stockItems[0]?.id || '');
  const [movementType, setMovementType] = useState<'Issued (Out)' | 'Received (Restock)' | 'Returned (In)'>('Issued (Out)');
  const [quantity, setQuantity] = useState(1);
  const [recipient, setRecipient] = useState(employees[0]?.firstName ? `${employees[0].firstName} ${employees[0].lastName}` : 'General Site Dispatch');
  const [siteLocation, setSiteLocation] = useState(sites[0]?.name || 'Head Office Central Store');
  const [notes, setNotes] = useState('');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'All' && tx.transactionType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.itemName.toLowerCase().includes(q) ||
        tx.itemCode.toLowerCase().includes(q) ||
        tx.recipientOrSource.toLowerCase().includes(q) ||
        tx.handledBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const filename = `HAB_Daily_Store_Movements_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Date', 'Type', 'Item Code', 'Item Name', 'Quantity', 'Recipient', 'Site', 'Handled By', 'Ref'];
    const rows = filtered.map((tx) => [
      tx.date, tx.transactionType, tx.itemCode, tx.itemName, tx.quantity,
      tx.recipientOrSource, tx.notes || 'Central Store', tx.handledBy, tx.referenceCode || 'N/A'
    ]);
    downloadCsv(filename, headers, rows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stockItems.find((i) => i.id === selectedItemId) || stockItems[0];
    if (!item || quantity <= 0) return;

    onRecordTransaction({
      id: `tx-${Date.now()}`,
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      division: item.division,
      transactionType: movementType,
      quantity,
      unit: item.unit,
      date: new Date().toISOString().split('T')[0],
      handledBy: 'Store Controller (Ato Girma)',
      recipientOrSource: recipient,
      notes: `${siteLocation} · ${notes}`.trim(),
      referenceCode: `MOV-${Date.now().toString().slice(-6)}`
    });
    setShowLogModal(false);
    setNotes('');
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
            Audit trail of daily gear dispatches, material returns, and restock receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Log</span>
          </button>
          {canRecord && (
            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Daily Movement</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Issued (Out)', 'Received (Restock)', 'Returned (In)'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                filterType === type
                  ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]'
                  : 'text-slate-500 hover:bg-slate-100'
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
        <table className="w-full text-left text-xs min-w-[780px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Movement Type</th>
              <th className="py-2.5 px-3">Item Details</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3">Recipient / Supplier</th>
              <th className="py-2.5 px-3">Site / Station</th>
              <th className="py-2.5 px-3">Authorized By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 italic">
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
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {tx.transactionType === 'Issued (Out)' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      <span>{tx.transactionType}</span>
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{tx.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tx.itemCode} · Ref: {tx.referenceCode || 'N/A'}</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {tx.quantity}
                  </td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-medium">{tx.recipientOrSource}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{tx.notes || 'Central Store'}</td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{tx.handledBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-sm font-bold border-b border-slate-100 pb-2">Record Daily Inventory Movement</h3>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Store Item</label>
              <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300">
                {stockItems.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.itemCode}) — In stock: {i.quantityInStock}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Movement Type</label>
                <select value={movementType} onChange={(e) => setMovementType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="Issued (Out)">Issue (Out to Site/Staff)</option>
                  <option value="Received (Restock)">Receive (Supplier In)</option>
                  <option value="Returned (In)">Return (Clearance/Defect)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold" />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Recipient / Deliverer</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required placeholder="Employee Name or Supplier" className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Destination Station / Site</label>
              <select value={siteLocation} onChange={(e) => setSiteLocation(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300">
                {sites.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="Head Office Central Store">Head Office Central Store</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Notes / Voucher Reference</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. S-Gate Post #3 replacement" className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowLogModal(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer">Record Movement</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
