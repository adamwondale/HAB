import React, { useState } from 'react';
import { ServiceType, StockCategory, StockItem } from '../../types/hrm';

interface StoreAddItemFormProps {
  onAddItem: (item: StockItem) => void;
  onCancel: () => void;
}

export const StoreAddItemForm: React.FC<StoreAddItemFormProps> = ({
  onAddItem,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [itemCode] = useState(`HAB-ITM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [division, setDivision] = useState<ServiceType>('Security');
  const [category, setCategory] = useState<StockCategory>('Security Uniforms & Gear');
  const [quantity, setQuantity] = useState(25);
  const [minLevel, setMinLevel] = useState(10);
  const [unitCost, setUnitCost] = useState(1200);
  const [location, setLocation] = useState('Central Store Shelf A-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: StockItem = {
      id: `stock-${Date.now()}`,
      itemCode,
      name: name.trim(),
      category,
      division,
      unit: 'Pcs',
      quantityInStock: quantity,
      minReorderLevel: minLevel,
      unitCostETB: unitCost,
      isReturnable: category.includes('Uniform') || category.includes('Gear'),
      storageLocation: location,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    onAddItem(newItem);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Add New Store Item
        </h3>
        <span className="text-[11px] text-slate-500">Inventory catalog addition</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Item Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Guard Beret Cap"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Division</label>
          <select
            value={division}
            onChange={(e) => {
              const div = e.target.value as ServiceType;
              setDivision(div);
              if (div === 'Security') setCategory('Security Uniforms & Gear');
              else if (div === 'Cleaning') setCategory('Cleaning Supplies & Equipment');
              else if (div === 'Property Management') setCategory('Property Management & Maintenance');
              else setCategory('Head Office & Stationery');
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="Security">Security</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Property Management">Property Management</option>
            <option value="Head Office Staff">Head Office</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Initial Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Storage Bay</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#0E1525] px-4 py-1.5 text-xs font-semibold text-[#FFF9DB] hover:bg-[#19233C] dark:bg-[#EBE834] dark:text-[#0E1525]"
        >
          Save item
        </button>
      </div>
    </form>
  );
};
