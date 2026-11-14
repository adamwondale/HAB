import React, { useState } from 'react';
import { Package, ArrowUpRight, ShieldCheck, Layers, Box } from 'lucide-react';
import { StockItem, StockTransaction, Employee, ClientSite, ManagementPerson } from '../types/hrm';
import { MinStockAlertBanner } from './store/MinStockAlertBanner';
import { DailyIssueReceiveLog } from './store/DailyIssueReceiveLog';
import { AssetControlRegister } from './store/AssetControlRegister';
import { StockCatalogTable } from './store/StockCatalogTable';
import { AddStockItemModal } from './store/AddStockItemModal';
import { StoreTransactionModal } from './store/StoreTransactionModal';
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
  const canManage = activeUser
    ? activeUser.id === 'mgmt-storekeeper' ||
      activeUser.role === 'store' ||
      activeUser.role === 'super_admin' ||
      activeUser.role === 'tech'
    : true;

  const [activeTab, setActiveTab] = useState<'movements' | 'assets' | 'catalog' | 'warehouse3d'>('movements');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txModalState, setTxModalState] = useState<{
    isOpen: boolean;
    item: StockItem | null;
    type: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)';
  }>({
    isOpen: false,
    item: null,
    type: 'Issued (Out)'
  });

  const handleOpenQuickTx = (item: StockItem, type: 'Issued (Out)' | 'Received (Restock)') => {
    setTxModalState({ isOpen: true, item, type });
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F2C46A]" />
            <h1 className="text-lg sm:text-xl font-bold text-[#4C4541] dark:text-slate-100">
              Store & Inventory Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daily issue/receive movements, company asset control register, and minimum stock threshold alerts
          </p>
        </div>
      </div>

      {/* Minimum Stock Alert Banner */}
      <MinStockAlertBanner
        stockItems={stockItems}
        onRestockClick={(item) => handleOpenQuickTx(item, 'Received (Restock)')}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'movements'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Daily Issue & Receive Log</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'assets'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Asset Control Register</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Stock Catalog & Levels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warehouse3d')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'warehouse3d'
              ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Spatial Warehouse</span>
        </button>
      </div>

      {/* Tab Views */}
      {activeTab === 'movements' && (
        <DailyIssueReceiveLog
          transactions={stockTransactions}
          stockItems={stockItems}
          employees={employees}
          sites={sites}
          canRecord={canManage}
          onRecordTransaction={onRecordTransaction}
        />
      )}

      {activeTab === 'assets' && (
        <AssetControlRegister sites={sites} employees={employees} />
      )}

      {activeTab === 'catalog' && (
        <StockCatalogTable
          stockItems={stockItems}
          canManage={canManage}
          onOpenAddItem={() => setIsAddModalOpen(true)}
          onOpenQuickTx={handleOpenQuickTx}
        />
      )}

      {activeTab === 'warehouse3d' && (
        <Warehouse3DView
          stockItems={stockItems}
          selectedDivision="All"
          canVerifyInventory={true}
          canManageCatalogAndRestock={canManage}
          onQuickTransaction={(item, type) => setTxModalState({ isOpen: true, item, type })}
        />
      )}

      {/* Modals */}
      <AddStockItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStockItem={onAddStockItem}
      />

      <StoreTransactionModal
        isOpen={txModalState.isOpen}
        item={txModalState.item}
        initialType={txModalState.type}
        employees={employees}
        sites={sites}
        onClose={() => setTxModalState({ isOpen: false, item: null, type: 'Issued (Out)' })}
        onRecord={onRecordTransaction}
      />
    </div>
  );
};
