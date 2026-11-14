import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { StockItem, StockTransaction, Employee, ClientSite } from '../../types/hrm';

interface StoreTransactionModalProps {
  isOpen: boolean;
  item: StockItem | null;
  initialType?: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)';
  employees: Employee[];
  sites: ClientSite[];
  onClose: () => void;
  onRecord: (tx: StockTransaction) => void;
}

export const StoreTransactionModal: React.FC<StoreTransactionModalProps> = ({
  isOpen,
  item,
  initialType = 'Issued (Out)',
  employees,
  sites,
  onClose,
  onRecord
}) => {
  if (!isOpen || !item) return null;

  const [type, setType] = useState(initialType);
  const [qty, setQty] = useState(1);
  const [recipient, setRecipient] = useState(employees[0]?.firstName ? `${employees[0].firstName} ${employees[0].lastName}` : 'Duty Guard');
  const [siteLocation, setSiteLocation] = useState(sites[0]?.name || 'Head Office Central Store');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;

    const tx: StockTransaction = {
      id: `tx-${Date.now()}`,
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      division: item.division,
      transactionType: type,
      quantity: qty,
      unit: item.unit,
      date: new Date().toISOString().split('T')[0],
      handledBy: 'Store Keeper (Ato Girma)',
      recipientOrSource: recipient,
      notes: `${siteLocation} · ${notes}`.trim(),
      referenceCode: `MOV-${Date.now().toString().slice(-6)}`
    };

    onRecord(tx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              {type === 'Issued (Out)' ? (
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
              ) : (
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              )}
              <span>Record Inventory Movement</span>
            </h3>
            <p className="text-xs text-slate-500">{item.name} ({item.itemCode})</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Movement Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Issued (Out)">Issue (Out to Site / Personnel)</option>
              <option value="Received (Restock)">Receive (Supplier Restock In)</option>
              <option value="Returned (In)">Return (Employee Clearance / Handover)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Quantity ({item.unit})
              </label>
              <input
                type="number"
                min={1}
                max={type === 'Issued (Out)' ? item.quantityInStock : 9999}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                required
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Current in stock: {item.quantityInStock}
              </span>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Destination Site</label>
              <select
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="Head Office Central Store">Head Office Store</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Recipient Employee / Supplier
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Voucher / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Scheduled guard uniform issuance"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold shadow-xs cursor-pointer"
            >
              Commit Movement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
