import React, { useState } from 'react';
import { StockTransaction } from '../../types/hrm';

interface EquipmentReturnModalProps {
  isOpen: boolean;
  tx: StockTransaction | null;
  onClose: () => void;
  onConfirmReturn: (tx: StockTransaction, condition: 'Good' | 'Damaged' | 'Lost' | 'Needs Repair', notes: string) => void;
}

export const EquipmentReturnModal: React.FC<EquipmentReturnModalProps> = ({
  isOpen,
  tx,
  onClose,
  onConfirmReturn
}) => {
  if (!isOpen || !tx) return null;

  const [condition, setCondition] = useState<'Good' | 'Damaged' | 'Lost' | 'Needs Repair'>('Good');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(tx, condition, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <h3 className="text-sm font-bold border-b pb-2">Process Equipment Return</h3>
        <p className="text-slate-500">
          Returning <strong>{tx.itemName}</strong> from <strong>{tx.recipientOrSource}</strong>
        </p>
        <div>
          <label className="font-bold text-slate-700 block mb-1">Return Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          >
            <option value="Good">Good (Restocks back to inventory)</option>
            <option value="Damaged">Damaged (Quarantined - not restocked)</option>
            <option value="Needs Repair">Needs Repair (Quarantined)</option>
            <option value="Lost">Lost (Marked write-off)</option>
          </select>
        </div>
        <div>
          <label className="font-bold text-slate-700 block mb-1">Return Notes / Inspection</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Standard exit return, inspected OK"
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer"
          >
            Confirm Return
          </button>
        </div>
      </form>
    </div>
  );
};
