import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowUpRight } from 'lucide-react';
import { StockItem, StockTransaction, Employee, ClientSite, ManagementPerson } from '../types/hrm';
import { InventoryDashboardKpis } from './store/InventoryDashboardKpis';
import { MinStockAlertBanner } from './store/MinStockAlertBanner';
import { DailyIssueReceiveLog } from './store/DailyIssueReceiveLog';
import { EmployeeEquipmentAllocations } from './store/EmployeeEquipmentAllocations';
import { AssetControlRegister } from './store/AssetControlRegister';
import { StockCatalogTable } from './store/StockCatalogTable';
import { AddStockItemModal } from './store/AddStockItemModal';
import { StoreTransactionModal } from './store/StoreTransactionModal';
import { Warehouse3DView } from './Warehouse3DView';
import { Division } from '../types/division';

interface StoreManagementViewProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  employees: Employee[];
  sites: ClientSite[];
  divisions?: Division[];
  activeUser?: ManagementPerson;
  onAddStockItem: (item: StockItem) => void;
  onRecordTransaction: (tx: StockTransaction) => void;
}

export const StoreManagementView: React.FC<StoreManagementViewProps> = ({
  stockItems,
  stockTransactions,
  employees,
  sites,
  divisions,
  activeUser,
  onAddStockItem,
  onRecordTransaction
}) => {
  const { t } = useTranslation();
  const canManage = activeUser
    ? activeUser.id === 'mgmt-storekeeper' || activeUser.role === 'store' || activeUser.role === 'super_admin' || activeUser.role === 'tech'
    : true;

  const [activeTab, setActiveTab] = useState<'movements' | 'allocations' | 'catalog' | 'assets' | 'warehouse3d'>('movements');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txModalState, setTxModalState] = useState<{
    isOpen: boolean;
    item: StockItem | null;
    type: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)' | 'Damaged / Lost (Write-off)';
  }>({ isOpen: false, item: null, type: 'Issued (Out)' });

  const handleOpenQuickTx = (item: StockItem, type: 'Issued (Out)' | 'Received (Restock)') => {
    setTxModalState({ isOpen: true, item, type });
  };

  const handleOpenGenericTx = (type: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)' | 'Damaged / Lost (Write-off)' = 'Issued (Out)') => {
    setTxModalState({ isOpen: true, item: stockItems[0] || null, type });
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-slate-100">
            {t('store.inventoryHub')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('store.inventorySubtitle')}
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('store.addItem')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenGenericTx('Issued (Out)')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t('store.recordTransaction')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Inventory Dashboard KPIs */}
      <InventoryDashboardKpis
        stockItems={stockItems}
        stockTransactions={stockTransactions}
      />

      {/* Minimum Stock Alert Banner */}
      <MinStockAlertBanner
        stockItems={stockItems}
        onRestockClick={(item) => handleOpenQuickTx(item, 'Received (Restock)')}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'movements'
              ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t('store.recordTransaction')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('allocations')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'allocations'
              ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t('store.equipmentAllocation')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'catalog'
              ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t('store.title')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'assets'
              ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t('store.assetRegister')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warehouse3d')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'warehouse3d'
              ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t('store.spatialWarehouse')}
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
          onOpenRecordModal={() => handleOpenGenericTx('Issued (Out)')}
          onRecordTransaction={onRecordTransaction}
        />
      )}

      {activeTab === 'allocations' && (
        <EmployeeEquipmentAllocations
          transactions={stockTransactions}
          stockItems={stockItems}
          employees={employees}
          canManage={canManage}
          onOpenAllocateModal={() => handleOpenGenericTx('Issued (Out)')}
          onRecordTransaction={onRecordTransaction}
        />
      )}

      {activeTab === 'catalog' && (
        <StockCatalogTable
          stockItems={stockItems}
          divisions={divisions}
          canManage={canManage}
          onOpenAddItem={() => setIsAddModalOpen(true)}
          onOpenQuickTx={handleOpenQuickTx}
        />
      )}

      {activeTab === 'assets' && (
        <AssetControlRegister sites={sites} employees={employees} />
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
        divisions={divisions}
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
