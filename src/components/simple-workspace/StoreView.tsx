import React, { useState } from 'react';
import { PackagePlus, Box, Layers } from 'lucide-react';
import { StockItem, StockTransaction, ServiceType } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';
import { formatEtb } from './modelHelpers';
import { StandardPageLayout } from './StandardPageLayout';
import { StoreAddItemForm } from './StoreAddItemForm';
import { Warehouse3DView } from '../Warehouse3DView';

interface StoreViewProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  onAddItem: (item: StockItem) => void;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  stockItems,
  onAddItem,
  onRecordTransaction
}) => {
  const [viewMode, setViewMode] = useState<'table' | '3d'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInlineFormOpen, setIsInlineFormOpen] = useState<boolean>(false);

  const totalValue = stockItems.reduce((sum, item) => sum + item.quantityInStock * item.unitCostETB, 0);
  const lowStockCount = stockItems.filter((item) => item.quantityInStock <= item.minReorderLevel).length;

  const filteredItems = stockItems.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        item.storageLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `HAB_Store_Inventory_${date}.csv`,
      ['Item Code', 'Name', 'Category', 'Division', 'Storage Bay', 'In Stock', 'Min Level', 'Unit Cost (ETB)', 'Status'],
      filteredItems.map((i) => [
        i.itemCode,
        i.name,
        i.category,
        i.division,
        i.storageLocation,
        i.quantityInStock,
        i.minReorderLevel,
        i.unitCostETB,
        i.quantityInStock <= i.minReorderLevel ? 'Low stock' : 'Enough stock'
      ])
    );
  };

  const handleQuickTransaction = (
    item: StockItem,
    type: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)'
  ) => {
    const qty = type === 'Issued (Out)' ? -1 : 1;
    const newQty = Math.max(0, item.quantityInStock + qty);
    item.quantityInStock = newQty;
    onRecordTransaction({
      id: `tx-${Date.now()}`,
      itemId: item.id,
      itemCode: item.itemCode,
      itemName: item.name,
      division: item.division,
      transactionType: type,
      quantity: 1,
      unit: item.unit,
      recipientOrSource: 'Frontline Staff',
      date: new Date().toISOString().slice(0, 10),
      handledBy: 'Store Keeper'
    });
  };

  const categories = Array.from(new Set(stockItems.map((i) => i.category)));

  return (
    <StandardPageLayout
      title="Store"
      description="Track company items, uniforms, chemicals, and equipment with 2D records and 3D spatial twin."
      guideKey="store"
      metrics={[
        { label: 'Total items', value: String(stockItems.length) },
        { label: 'Low stock', value: String(lowStockCount) },
        { label: 'Stock value', value: formatEtb(totalValue) }
      ]}
      mainAction={{
        label: 'Add item',
        isOpen: isInlineFormOpen,
        onClick: () => setIsInlineFormOpen((prev) => !prev),
        icon: <PackagePlus className="h-3.5 w-3.5" />
      }}
      search={{
        query: searchQuery,
        onChange: setSearchQuery,
        placeholder: 'Search store items by name, code, or bay...'
      }}
      filter={{
        label: 'Item Category Filter',
        value: categoryFilter,
        onChange: setCategoryFilter,
        options: [
          { value: 'All', label: 'All Categories' },
          ...categories.map((c) => ({ value: c, label: c }))
        ]
      }}
      pillToggle={{
        activeKey: viewMode,
        onChange: (key) => setViewMode(key as 'table' | '3d'),
        items: [
          { key: 'table', label: 'Records Table' },
          { key: '3d', label: '3D Store Map' }
        ]
      }}
      inlineForm={
        isInlineFormOpen && (
          <StoreAddItemForm
            onAddItem={(item) => {
              onAddItem(item);
              setIsInlineFormOpen(false);
            }}
            onCancel={() => setIsInlineFormOpen(false)}
          />
        )
      }
      columns={[
        { key: 'item', label: 'Item & Code' },
        { key: 'category', label: 'Category' },
        { key: 'location', label: 'Storage Bay' },
        { key: 'stock', label: 'In stock', numeric: true },
        { key: 'status', label: 'Status' }
      ]}
      rows={filteredItems.map((item) => {
        const isLow = item.quantityInStock <= item.minReorderLevel;
        return {
          id: item.id,
          searchText: `${item.name} ${item.itemCode} ${item.category} ${item.storageLocation}`,
          values: {
            item: `${item.name} · ${item.itemCode}`,
            category: item.category,
            location: item.storageLocation,
            stock: `${item.quantityInStock} ${item.unit}`,
            status: isLow ? 'Low stock' : 'Enough stock'
          },
          tones: { status: isLow ? 'warn' : 'good' }
        };
      })}
      emptyMessage="No store items match your filter."
      onDownloadReport={handleDownload}
    >
      {viewMode === '3d' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Box className="h-4 w-4 text-amber-400" /> Interactive 3D Central Warehouse
            </span>
            <span className="text-[11px] text-slate-400">Drag to rotate · Scroll to zoom</span>
          </div>
          <div className="h-[680px] w-full">
            <Warehouse3DView
              stockItems={filteredItems}
              selectedDivision="All"
              canVerifyInventory={true}
              canManageCatalogAndRestock={true}
              onQuickTransaction={handleQuickTransaction}
            />
          </div>
        </div>
      ) : undefined}
    </StandardPageLayout>
  );
};
