import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { StockItem, StockTransaction, Employee, ClientSite, ServiceType } from '../../types/hrm';

interface StoreTransactionModalProps {
  isOpen: boolean;
  item: StockItem | null;
  initialType?: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)' | 'Damaged / Lost (Write-off)';
  employees: Employee[];
  sites: ClientSite[];
  onClose: () => void;
  onRecord: (tx: StockTransaction) => void;
}

export const StoreTransactionModal: React.FC<StoreTransactionModalProps> = ({
  isOpen, item, initialType = 'Issued (Out)', employees, sites, onClose, onRecord
}) => {
  if (!isOpen || !item) return null;

  const [type, setType] = useState<StockTransaction['transactionType']>(initialType);
  const [qty, setQty] = useState(1);
  const [recipient, setRecipient] = useState(employees[0]?.firstName ? `${employees[0].firstName} ${employees[0].lastName}` : 'Duty Guard');
  const [supplier, setSupplier] = useState('Addis Industrial Safety Supplies');
  const [division, setDivision] = useState<ServiceType>(item.division);
  const [siteLocation, setSiteLocation] = useState(sites[0]?.name || 'Head Office Central Store');
  const [condition, setCondition] = useState<'Good' | 'Damaged' | 'Lost' | 'Needs Repair'>('Good');
  const [unitCost, setUnitCost] = useState(item.unitCostETB);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [referenceCode, setReferenceCode] = useState(`REF-${Date.now().toString().slice(-5)}`);
  const [notes, setNotes] = useState('');

  const isIssueOut = type === 'Issued (Out)';
  const isRestock = type === 'Received (Restock)';
  const isReturn = type === 'Returned (In)';
  const isWriteOff = type === 'Damaged / Lost (Write-off)';
  const isOverStock = (isIssueOut || isWriteOff) && qty > item.quantityInStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0 || isOverStock) return;

    onRecord({
      id: `tx-${Date.now()}`,
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      division,
      transactionType: type,
      quantity: qty,
      unit: item.unit,
      date: new Date().toISOString().split('T')[0],
      handledBy: 'Store Officer (Ato Girma)',
      recipientOrSource: isRestock ? supplier : recipient,
      referenceCode,
      notes: `${siteLocation} · ${notes}`.trim(),
      unitCostETB: isRestock ? unitCost : undefined,
      expectedReturnDate: isIssueOut && item.isReturnable ? expectedReturnDate : undefined,
      condition: isReturn || isWriteOff ? condition : undefined,
      serviceLocation: siteLocation
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              {isIssueOut && <ArrowUpRight className="w-4 h-4 text-rose-600" />}
              {isRestock && <ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
              {isReturn && <RotateCcw className="w-4 h-4 text-blue-600" />}
              {isWriteOff && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              <span>Record Inventory Movement</span>
            </h3>
            <p className="text-[11px] text-slate-500">{item.name} ({item.itemCode}) · In Stock: {item.quantityInStock} {item.unit}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Movement Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
              <option value="Issued (Out)">Stock Out (Issue to Employee / Site)</option>
              <option value="Received (Restock)">Stock In (Receive from Supplier)</option>
              <option value="Returned (In)">Stock Return (Employee Handover)</option>
              <option value="Damaged / Lost (Write-off)">Damaged / Lost (Write-off)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantity ({item.unit})</label>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} required className={`w-full px-2.5 py-1.5 rounded-lg border font-mono font-bold ${isOverStock ? 'border-rose-500 text-rose-600' : 'border-slate-300 dark:border-slate-700'}`} />
              {isOverStock && <span className="text-[10px] text-rose-600 font-bold block mt-0.5">Exceeds stock! Max: {item.quantityInStock}</span>}
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Division</label>
              <select value={division} onChange={(e) => setDivision(e.target.value as ServiceType)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Property Management">Property Management</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>
            </div>
          </div>

          {isRestock && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Supplier Name</label>
                <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} required className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700" />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Cost (ETB)</label>
                <input type="number" min={0} value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono" />
              </div>
            </div>
          )}

          {(isIssueOut || isReturn) && (
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{isIssueOut ? 'Receiving Employee / Dept' : 'Returning Employee'}</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700" />
            </div>
          )}

          {(isReturn || isWriteOff) && (
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold">
                <option value="Good">Good (Restocks to inventory)</option>
                <option value="Damaged">Damaged (Quarantine - does not restock)</option>
                <option value="Needs Repair">Needs Repair (Quarantine)</option>
                <option value="Lost">Lost (Write-off)</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Site / Station</label>
              <select value={siteLocation} onChange={(e) => setSiteLocation(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                {sites.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                <option value="Head Office Central Store">Head Office Store</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ref / Voucher</label>
              <input type="text" value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono" />
            </div>
          </div>

          {isIssueOut && item.isReturnable && (
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Expected Return Date</label>
              <input type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700" />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Voucher Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Deployment allocation" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700" />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-300 font-semibold cursor-pointer">Cancel</button>
            <button type="submit" disabled={isOverStock} className="px-4 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] disabled:opacity-50 text-[#4C4541] font-bold shadow-xs cursor-pointer">Commit Movement</button>
          </div>
        </form>
      </div>
    </div>
  );
};
