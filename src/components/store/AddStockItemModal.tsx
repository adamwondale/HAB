import React, { useState } from 'react';
import { Package, X } from 'lucide-react';
import { StockItem, ServiceType, StockCategory } from '../../types/hrm';

interface AddStockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStockItem: (item: StockItem) => void;
}

export const AddStockItemModal: React.FC<AddStockItemModalProps> = ({
  isOpen,
  onClose,
  onAddStockItem
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [division, setDivision] = useState<ServiceType>('Security');
  const [category, setCategory] = useState<StockCategory>('Security Uniforms & Gear');
  const [unit, setUnit] = useState<StockItem['unit']>('Pcs');
  const [qty, setQty] = useState(25);
  const [minLevel, setMinLevel] = useState(10);
  const [cost, setCost] = useState(1200);
  const [location, setLocation] = useState('Central Store Shelf A');
  const [returnable, setReturnable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const prefix = division === 'Security' ? 'SEC' : division === 'Cleaning' ? 'CLN' : 'PRP';
    const newItem: StockItem = {
      id: `itm-${Date.now()}`,
      itemCode: `${prefix}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      division,
      unit,
      quantityInStock: qty,
      minReorderLevel: minLevel,
      unitCostETB: cost,
      isReturnable: returnable,
      storageLocation: location,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onAddStockItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4 text-[#F2C46A]" />
            <span>Add New Item to Store Catalog</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Tactical Security Boots (High Ankle)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Property Management">Property Management</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Security Uniforms & Gear">Security Uniforms & Gear</option>
                <option value="Cleaning Supplies & Equipment">Cleaning Supplies & Equipment</option>
                <option value="Property Management & Maintenance">Property Management & Maintenance</option>
                <option value="Head Office & Stationery">Head Office & Stationery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Stock</label>
              <input
                type="number"
                min={0}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min. Reorder</label>
              <input
                type="number"
                min={1}
                value={minLevel}
                onChange={(e) => setMinLevel(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Cost (ETB)</label>
              <input
                type="number"
                min={0}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Storage Shelf</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shelf B-2"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="item-returnable"
                checked={returnable}
                onChange={(e) => setReturnable(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="item-returnable" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Returnable on Exit Clearance
              </label>
            </div>
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
