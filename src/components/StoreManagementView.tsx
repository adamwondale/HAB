import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Download,
  Layers,
  History,
  CheckCircle2,
  X,
  Lock,
  Box
} from 'lucide-react';
import {
  StockItem,
  StockTransaction,
  StockCategory,
  ServiceType,
  Employee,
  ClientSite,
  ManagementPerson
} from '../types/hrm';
import { downloadCsv } from '../utils/csvExport';
import { getDivisionBadgeStyle } from './PayrollView';
import { Warehouse3DView } from './Warehouse3DView';

interface StoreManagementViewProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  employees: Employee[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  onAddStockItem: (item: StockItem) => void;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const StoreManagementView: React.FC<StoreManagementViewProps> = ({
  stockItems,
  stockTransactions,
  employees,
  sites,
  activeUser,
  onAddStockItem,
  onRecordTransaction
}) => {
  const canVerifyInventory = activeUser ? activeUser.permissions.canVerifyInventoryReturn : true;
  const canManageCatalogAndRestock = activeUser
    ? activeUser.id === 'mgmt-storekeeper' ||
      activeUser.id === 'mgmt-fin-head' ||
      activeUser.roleCategory === 'Executive' ||
      activeUser.roleCategory === 'Department Head' ||
      activeUser.id === 'mgmt-hr-head'
    : true;
  const [activeSubTab, setActiveSubTab] = useState<'warehouse3d' | 'inventory' | 'transactions'>('warehouse3d');
  const [selectedDivision, setSelectedDivision] = useState<'All' | ServiceType>('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);

  // Transaction Form State
  const [txItemId, setTxItemId] = useState<string>(stockItems[0]?.id || '');
  const [txType, setTxType] = useState<'Issued (Out)' | 'Received (Restock)' | 'Returned (In)'>('Issued (Out)');
  const [txQuantity, setTxQuantity] = useState<number>(1);
  const [txRecipient, setTxRecipient] = useState<string>('');
  const [txNotes, setTxNotes] = useState<string>('');

  // New Stock Item Form State
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemAmharic, setNewItemAmharic] = useState<string>('');
  const [newItemDivision, setNewItemDivision] = useState<ServiceType>('Security');
  const [newItemCategory, setNewItemCategory] = useState<StockCategory>('Security Uniforms & Gear');
  const [newItemUnit, setNewItemUnit] = useState<StockItem['unit']>('Pcs');
  const [newItemQty, setNewItemQty] = useState<number>(20);
  const [newItemMinLevel, setNewItemMinLevel] = useState<number>(10);
  const [newItemCost, setNewItemCost] = useState<number>(1000);
  const [newItemReturnable, setNewItemReturnable] = useState<boolean>(true);
  const [newItemLocation, setNewItemLocation] = useState<string>('Central Store Shelf A');

  const filteredItems = stockItems.filter(item => {
    if (selectedDivision !== 'All' && item.division !== selectedDivision) return false;
    if (showLowStockOnly && item.quantityInStock > item.minReorderLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.amharicName && item.amharicName.toLowerCase().includes(q)) ||
        item.storageLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredTransactions = stockTransactions.filter(tx => {
    if (selectedDivision !== 'All' && tx.division !== selectedDivision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.itemName.toLowerCase().includes(q) ||
        tx.itemCode.toLowerCase().includes(q) ||
        tx.recipientOrSource.toLowerCase().includes(q) ||
        (tx.referenceCode && tx.referenceCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPIs
  const lowStockCount = stockItems.filter(i => i.quantityInStock <= i.minReorderLevel).length;
  const totalStockValueETB = stockItems.reduce((sum, i) => sum + i.quantityInStock * i.unitCostETB, 0);
  const returnableItemsCount = stockItems.filter(i => i.isReturnable).length;

  const openQuickTransaction = (item: StockItem, defaultType: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)') => {
    setTxItemId(item.id);
    setTxType(defaultType);
    setTxQuantity(1);
    setTxRecipient('');
    setTxNotes('');
    setIsTxModalOpen(true);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = stockItems.find(i => i.id === txItemId);
    if (!targetItem || txQuantity <= 0) return;

    const prefix = txType === 'Issued (Out)' ? 'ISS' : txType === 'Received (Restock)' ? 'GRN' : 'RET';
    const newTx: StockTransaction = {
      id: `trx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      itemId: targetItem.id,
      itemCode: targetItem.itemCode,
      itemName: targetItem.name,
      division: targetItem.division,
      transactionType: txType,
      quantity: Number(txQuantity),
      unit: targetItem.unit,
      recipientOrSource: txRecipient.trim() || (txType === 'Received (Restock)' ? 'Main Supplier' : 'Field Operations Staff'),
      referenceCode: `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`,
      handledBy: activeUser ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})` : 'Ato Girma Wolde (Store Keeper)',
      notes: txNotes.trim() || `${txType} recorded via Store Management.`
    };

    onRecordTransaction(newTx);
    setIsTxModalOpen(false);
  };

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const divPrefix =
      newItemDivision === 'Security'
        ? 'SEC'
        : newItemDivision === 'Cleaning'
        ? 'CLN'
        : newItemDivision === 'Property Management'
        ? 'PRP'
        : 'HQ';

    const newItem: StockItem = {
      id: `stk-${Date.now()}`,
      itemCode: `STK-${divPrefix}-0${stockItems.length + 11}`,
      name: newItemName.trim(),
      amharicName: newItemAmharic.trim() || undefined,
      category: newItemCategory,
      division: newItemDivision,
      unit: newItemUnit,
      quantityInStock: Number(newItemQty) || 0,
      minReorderLevel: Number(newItemMinLevel) || 5,
      unitCostETB: Number(newItemCost) || 0,
      isReturnable: newItemReturnable,
      storageLocation: newItemLocation.trim() || 'Central Store',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onAddStockItem(newItem);
    setIsAddItemModalOpen(false);
    setNewItemName('');
    setNewItemAmharic('');
  };

  const handleExportStockCsv = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const headers = [
      'Item Code',
      'Item Name',
      'Amharic Name',
      'Division',
      'Category',
      'Quantity In Stock',
      'Unit',
      'Min Reorder Level',
      'Status',
      'Unit Cost (ETB)',
      'Total Value (ETB)',
      'Returnable Property',
      'Storage Location',
      'Last Updated'
    ];
    const rows = filteredItems.map(i => [
      i.itemCode,
      i.name,
      i.amharicName || '',
      i.division,
      i.category,
      i.quantityInStock,
      i.unit,
      i.minReorderLevel,
      i.quantityInStock <= i.minReorderLevel ? 'LOW STOCK - REORDER' : 'In Stock',
      i.unitCostETB,
      i.quantityInStock * i.unitCostETB,
      i.isReturnable ? 'Yes (Returnable on Clearance)' : 'No (Consumable)',
      i.storageLocation,
      i.lastUpdated
    ]);
    downloadCsv(`HAB_Store_Stock_Inventory_${dateStr}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wide">
            Central Store & Inventory Control · የንብረት እና ስቶክ አስተዳደር
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Store & Stock Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track uniforms, safety boots, radios, cleaning chemicals, property maintenance tools, and office stationery across all 4 divisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab(activeSubTab === 'warehouse3d' ? 'inventory' : 'warehouse3d')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-lg transition-colors border shadow-xs ${
              activeSubTab === 'warehouse3d'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{activeSubTab === 'warehouse3d' ? 'Viewing 3D Warehouse Twin' : 'Open 3D Warehouse'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportStockCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Export Stock CSV</span>
          </button>

          {canVerifyInventory ? (
            <button
              type="button"
              onClick={() => setIsTxModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>{canManageCatalogAndRestock ? 'Issue / Restock Item' : 'Request / Issue Site Gear'}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Stock Availability View ({activeUser?.title.split(' ')[0]})</span>
            </span>
          )}

          {canManageCatalogAndRestock && (
            <button
              type="button"
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Item</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Stock Lines</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {stockItems.length} Items
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Across all 4 divisions
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Low Stock Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className={`text-xl font-bold tabular-nums mt-1 ${lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('inventory');
              setShowLowStockOnly(!showLowStockOnly);
            }}
            className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold hover:underline"
          >
            {showLowStockOnly ? 'Showing low stock only (Reset)' : 'Click to filter low stock →'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Store Valuation</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-1">
            ETB {totalStockValueETB.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Current warehouse asset value
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Returnable Gear & Tools</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {returnableItemsCount} Categories
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Tracked on HR Exit Clearance
          </span>
        </div>
      </div>

      {/* Sub-Tabs & Division Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-Tab Switcher */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveSubTab('warehouse3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'warehouse3d'
                  ? 'bg-slate-900 text-amber-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-500" />
              <span>3D Physical Warehouse</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('inventory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'inventory'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Stock Inventory Table ({filteredItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transactions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'transactions'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>Issue / Restock Log ({filteredTransactions.length})</span>
            </button>
          </div>

          {/* Division Selector */}
          <select
            aria-label="Filter stock by division"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value as 'All' | ServiceType)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">All 4 Divisions</option>
            <option value="Security">Security Division</option>
            <option value="Cleaning">Cleaning Division</option>
            <option value="Property Management">Property Management</option>
            <option value="Head Office Staff">Head Office Staff</option>
          </select>

          {activeSubTab === 'inventory' && (
            <button
              type="button"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showLowStockOnly
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {showLowStockOnly ? '✓ Low Stock Only' : 'Low Stock Filter'}
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search item, code, shelf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      {/* TAB 0: 3D INTERACTIVE PHYSICAL WAREHOUSE */}
      {activeSubTab === 'warehouse3d' && (
        <Warehouse3DView
          stockItems={stockItems}
          selectedDivision={selectedDivision}
          canVerifyInventory={canVerifyInventory}
          canManageCatalogAndRestock={canManageCatalogAndRestock}
          onQuickTransaction={openQuickTransaction}
          onSelectDivision={(div) => setSelectedDivision(div)}
        />
      )}

      {/* TAB 1: STOCK INVENTORY TABLE */}
      {activeSubTab === 'inventory' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs min-w-[920px]">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Item & Code</th>
                <th className="py-3.5 px-4">Division</th>
                <th className="py-3.5 px-4">Storage Shelf</th>
                <th className="py-3.5 px-4 text-center">In Stock</th>
                <th className="py-3.5 px-4 text-right">Unit Cost</th>
                <th className="py-3.5 px-4 text-center">Type</th>
                <th className="py-3.5 px-4 text-center">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Quick Store Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const isLow = item.quantityInStock <= item.minReorderLevel;
                return (
                  <tr
                    key={item.id}
                    className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/70 even:dark:bg-slate-800/40 hover:bg-amber-50/30 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{item.itemCode}</span>
                        {item.amharicName && <span>· {item.amharicName}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDivisionBadgeStyle(item.division)}`}>
                        {item.division}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {item.storageLocation}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-sm ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {item.quantityInStock}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">{item.unit}</span>
                      <div className="text-[10px] text-slate-400">Min: {item.minReorderLevel}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      ETB {item.unitCostETB.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.isReturnable
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        {item.isReturnable ? 'Returnable Asset' : 'Consumable'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                          <span>Sufficient</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canVerifyInventory ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openQuickTransaction(item, 'Issued (Out)')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded text-[11px] font-semibold transition-colors"
                            title="Issue item to employee or client site"
                          >
                            Issue Out
                          </button>
                          {canManageCatalogAndRestock && (
                            <button
                              type="button"
                              onClick={() => openQuickTransaction(item, 'Received (Restock)')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded text-[11px] font-semibold transition-colors"
                              title="Receive new stock into store"
                            >
                              + Restock
                            </button>
                          )}
                          {item.isReturnable && (
                            <button
                              type="button"
                              onClick={() => openQuickTransaction(item, 'Returned (In)')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium transition-colors"
                              title="Log returned uniform/equipment from staff"
                            >
                              Return
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: STOCK TRANSACTIONS LOG */}
      {activeSubTab === 'transactions' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Date & Voucher</th>
                <th className="py-3.5 px-4">Movement Type</th>
                <th className="py-3.5 px-4">Stock Item</th>
                <th className="py-3.5 px-4">Division</th>
                <th className="py-3.5 px-4 text-center">Quantity</th>
                <th className="py-3.5 px-4">Recipient / Supplier</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/70 even:dark:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{tx.date}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tx.referenceCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      tx.transactionType === 'Issued (Out)'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        : tx.transactionType === 'Received (Restock)'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    }`}>
                      {tx.transactionType === 'Issued (Out)' && <ArrowUpRight className="w-3 h-3" />}
                      {tx.transactionType === 'Received (Restock)' && <ArrowDownLeft className="w-3 h-3" />}
                      {tx.transactionType === 'Returned (In)' && <RotateCcw className="w-3 h-3" />}
                      <span>{tx.transactionType}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{tx.itemName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tx.itemCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDivisionBadgeStyle(tx.division)}`}>
                      {tx.division}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                    {tx.transactionType === 'Issued (Out)' ? `-${tx.quantity}` : `+${tx.quantity}`} {tx.unit}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {tx.recipientOrSource}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {tx.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: ISSUE / RESTOCK / RETURN TRANSACTION */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitTransaction}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Record Store Movement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issue gear to staff/sites, restock supplies, or log returned items
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Issued (Out)', 'Received (Restock)', 'Returned (In)'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTxType(t)}
                      className={`py-2 px-2 rounded-lg font-semibold border text-center transition-all ${
                        txType === t
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Select Stock Item *
                </label>
                <select
                  value={txItemId}
                  onChange={(e) => setTxItemId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                >
                  {stockItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.division}] {item.name} ({item.quantityInStock} {item.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={txQuantity}
                    onChange={(e) => setTxQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Quick Pick Employee/Site
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setTxRecipient(e.target.value);
                    }}
                    defaultValue=""
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="">-- Choose or type below --</option>
                    <optgroup label="Client Sites">
                      {sites.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Employees">
                      {employees.map(emp => (
                        <option key={emp.id} value={`${emp.firstName} ${emp.lastName} (${emp.employeeCode})`}>
                          {emp.firstName} {emp.lastName} ({emp.serviceType})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {txType === 'Received (Restock)' ? 'Supplier / Vendor Name *' : 'Recipient Employee or Site *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={txType === 'Received (Restock)' ? 'e.g. Addis Garment & Safety PLC' : 'e.g. Abebe Kassahun / CBE Tower'}
                  value={txRecipient}
                  onChange={(e) => setTxRecipient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Store Keeper Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional remark or requisition reference..."
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsTxModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Save Store Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD NEW STOCK ITEM */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStockItem}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Add New Stock Item
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register new equipment, uniform, chemical, or office item in store
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Item Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Duty Raincoat, Floor Polish..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Amharic Name (የዕቃው ስም በአማርኛ)
                </label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፦ የዝናብ ልብስ"
                  value={newItemAmharic}
                  onChange={(e) => setNewItemAmharic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Division *
                  </label>
                  <select
                    value={newItemDivision}
                    onChange={(e) => {
                      const div = e.target.value as ServiceType;
                      setNewItemDivision(div);
                      if (div === 'Security') setNewItemCategory('Security Uniforms & Gear');
                      else if (div === 'Cleaning') setNewItemCategory('Cleaning Supplies & Equipment');
                      else if (div === 'Property Management') setNewItemCategory('Property Management & Maintenance');
                      else setNewItemCategory('Head Office & Stationery');
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Security">Security</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Property Management">Property Management</option>
                    <option value="Head Office Staff">Head Office Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as StockItem['unit'])}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Sets">Sets</option>
                    <option value="Pairs">Pairs</option>
                    <option value="Liters">Liters</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Reams">Reams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Opening Qty *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Min Reorder
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItemMinLevel}
                    onChange={(e) => setNewItemMinLevel(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Unit Cost (ETB)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Storage Shelf
                  </label>
                  <input
                    type="text"
                    value={newItemLocation}
                    onChange={(e) => setNewItemLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={newItemReturnable}
                    onChange={(e) => setNewItemReturnable(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Returnable on Clearance
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Register Stock Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
