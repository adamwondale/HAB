import React, { useState } from 'react';
import { Package, ChevronRight, Search, Filter } from 'lucide-react';

export interface InventoryTrackingRow {
  id: string;
  siteName: string;
  itemRequested: string;
  requestingEmployee: string;
  lowStockItems: string;
  lowStockStatus: 'Critical' | 'Low' | 'Adequate';
  issuedType: 'Temporary Custody' | 'Permanent Issue' | 'Consumable';
  returned: string;
  damaged: number;
}

const INITIAL_INVENTORY_TRACKERS: InventoryTrackingRow[] = [
  {
    id: 'sit-1',
    siteName: 'Bole Medhanialem Tower',
    itemRequested: 'Motorola Handheld Radios (x4)',
    requestingEmployee: 'Sup. Yared K.',
    lowStockItems: 'Radios (2 left)',
    lowStockStatus: 'Critical',
    issuedType: 'Temporary Custody',
    returned: '3 / 4',
    damaged: 1
  },
  {
    id: 'sit-2',
    siteName: 'Kazanchis Business Center',
    itemRequested: 'Industrial Floor Scrubbers (x2)',
    requestingEmployee: 'Lead Aster G.',
    lowStockItems: 'Pads & Brushes',
    lowStockStatus: 'Low',
    issuedType: 'Permanent Issue',
    returned: '2 / 2',
    damaged: 0
  },
  {
    id: 'sit-3',
    siteName: 'CMC Residential Complex',
    itemRequested: 'Heavy Duty Guard Batons (x12)',
    requestingEmployee: 'Sgt. Mulugeta',
    lowStockItems: 'Flashlights',
    lowStockStatus: 'Adequate',
    issuedType: 'Consumable',
    returned: '12 / 12',
    damaged: 0
  },
  {
    id: 'sit-4',
    siteName: 'Sarbet Substation Hub',
    itemRequested: 'High-Voltage Insulated Boots (x2)',
    requestingEmployee: 'Eng. Bekele T.',
    lowStockItems: 'Safety Gloves',
    lowStockStatus: 'Critical',
    issuedType: 'Temporary Custody',
    returned: '0 / 2',
    damaged: 0
  },
  {
    id: 'sit-5',
    siteName: 'Ethiopian Airlines Cargo',
    itemRequested: 'Reflective Security Parkas (x8)',
    requestingEmployee: 'Officer Tigist H.',
    lowStockItems: 'Hi-Vis Vests',
    lowStockStatus: 'Low',
    issuedType: 'Permanent Issue',
    returned: '8 / 8',
    damaged: 0
  },
  {
    id: 'sit-6',
    siteName: 'St. Paul Hospital Campus',
    itemRequested: 'Sanitizer Spray Backpacks (x3)',
    requestingEmployee: 'Sup. Almaz W.',
    lowStockItems: 'Chemical Cartridges',
    lowStockStatus: 'Critical',
    issuedType: 'Temporary Custody',
    returned: '2 / 3',
    damaged: 1
  }
];

interface TechnicalInventoryTrackerProps {
  onNavigateTab: (tabId: string) => void;
}

export const TechnicalInventoryTracker: React.FC<TechnicalInventoryTrackerProps> = ({
  onNavigateTab
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = INITIAL_INVENTORY_TRACKERS.filter((item) => {
    const matchesSearch =
      item.siteName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemRequested.toLowerCase().includes(search.toLowerCase()) ||
      item.requestingEmployee.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'critical' && item.lowStockStatus === 'Critical') ||
      (filterType === 'damaged' && item.damaged > 0) ||
      (filterType === 'pending_return' && item.returned !== '4 / 4' && item.returned !== '2 / 2' && item.returned !== '12 / 12' && item.returned !== '8 / 8');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 text-xs shadow-xs">
      {/* Header bar */}
      <div className="bg-[#FCF0DA] dark:bg-slate-800/80 text-[#4C4541] dark:text-slate-100 font-bold px-3 py-2 border-b border-[#EFE7D8] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#F2C46A]" />
          <span className="uppercase tracking-wider text-[11px]">Finance & Store Inventory Tracking Grid (7-Column)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search site, item, staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-2 py-0.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F2C46A]"
            />
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('store')}
            className="text-amber-800 dark:text-[#F2C46A] hover:underline flex items-center gap-0.5 font-bold text-[11px] cursor-pointer"
          >
            Store Requisitions <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick filter pills */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px]">
        <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'critical', label: 'Critical Stock' },
          { key: 'damaged', label: 'Has Damaged' },
          { key: 'pending_return', label: 'Pending Return' }
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilterType(f.key)}
            className={`px-2 py-0.5 rounded cursor-pointer font-medium transition-colors ${
              filterType === f.key
                ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 7-Column Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2 px-3 font-bold">1. Site</th>
              <th className="py-2 px-3 font-bold">2. Item Requested</th>
              <th className="py-2 px-3 font-bold">3. Requested Employee</th>
              <th className="py-2 px-3 font-bold">4. Low Stock Items</th>
              <th className="py-2 px-3 font-bold">5. Issued Type</th>
              <th className="py-2 px-3 font-bold">6. Returned</th>
              <th className="py-2 px-3 font-bold text-right">7. Damaged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{t.siteName}</td>
                <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{t.itemRequested}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{t.requestingEmployee}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                        t.lowStockStatus === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : t.lowStockStatus === 'Low'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {t.lowStockStatus}
                    </span>
                    <span className="text-[10px] text-slate-500">{t.lowStockItems}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-700">
                    {t.issuedType}
                  </span>
                </td>
                <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {t.returned}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                  <span className={t.damaged > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}>
                    {t.damaged}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
