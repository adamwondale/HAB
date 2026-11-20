import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Package, Lock } from 'lucide-react';
import { ClearanceRecord, Employee, ServiceType, ManagementPerson } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../utils/masterConfigEngine';
import { StoreClearanceTab } from './clearance/StoreClearanceTab';
import { FinanceClearanceTab } from './clearance/FinanceClearanceTab';
import { HrClearanceDetail } from './clearance/HrClearanceDetail';
import { ClearanceInitiationModal } from './clearance/ClearanceInitiationModal';
import { ClearanceCertificateModal } from './clearance/ClearanceCertificateModal';

interface ClearanceViewProps {
  clearances: ClearanceRecord[];
  employees: Employee[];
  activeUser?: ManagementPerson;
  masterConfig?: SystemMasterConfig;
  onUpdateClearance: (updated: ClearanceRecord) => void;
  onInitiateClearance: (newRecord: ClearanceRecord) => void;
}

export const ClearanceView: React.FC<ClearanceViewProps> = ({
  clearances,
  employees,
  activeUser,
  masterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  onUpdateClearance,
  onInitiateClearance
}) => {
  const { t } = useTranslation();
  const isSuperAdmin = activeUser?.role === 'super_admin' || activeUser?.id === 'mgmt-super-admin';
  const canInitiate = activeUser ? activeUser.permissions.canApproveClearance || isSuperAdmin : true;

  const [activeTab, setActiveTab] = useState<'hr' | 'store' | 'finance'>('hr');
  const [selectedClearanceId, setSelectedClearanceId] = useState<string>(clearances[0]?.id || '');
  const [filterService, setFilterService] = useState<'All' | ServiceType>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInitiatingModalOpen, setIsInitiatingModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const selectedClearance = clearances.find((c) => c.id === selectedClearanceId) || clearances[0];
  const storePendingCount = clearances.filter((c) => !c.storeItemsReturned && c.storeStatus !== 'returned' && c.stage !== 'completed').length;
  const financePendingCount = clearances.filter((c) => c.stage === 'finance_pending' || (c.storeItemsReturned && c.financeStatus !== 'liquidated')).length;

  const filteredClearances = clearances.filter((c) => {
    if (filterService !== 'All' && c.serviceType !== filterService) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.employeeName.toLowerCase().includes(q) || c.employeeCode.toLowerCase().includes(q) || c.siteName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('clearance.cockpitTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('clearance.cockpitSubtitle')}</p>
        </div>
        {canInitiate ? (
          <button
            type="button"
            onClick={() => setIsInitiatingModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs dark:bg-slate-100 dark:text-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>{t('clearance.initiateClearance')}</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeUser?.title.split('(')[0]}</span>
          </span>
        )}
      </div>

      {/* Perspective Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'hr', label: t('clearance.stage1Hr'), count: clearances.filter((c) => c.status === 'In Progress').length },
          { id: 'store', label: t('clearance.stage2Store'), count: storePendingCount },
          { id: 'finance', label: t('clearance.stage3Finance'), count: financePendingCount }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Perspective Views */}
      {activeTab === 'store' && (
        <StoreClearanceTab
          clearances={clearances}
          onUpdateClearance={onUpdateClearance}
          activeUser={activeUser}
          canEdit={isSuperAdmin || (activeUser ? activeUser.permissions.canVerifyInventoryReturn : true)}
        />
      )}

      {activeTab === 'finance' && (
        <FinanceClearanceTab
          clearances={clearances}
          onUpdateClearance={onUpdateClearance}
          activeUser={activeUser}
          canEdit={isSuperAdmin || (activeUser ? activeUser.permissions.canApprovePayroll : true)}
        />
      )}

      {activeTab === 'hr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={t('clearance.searchEmployeePlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 flex-1 text-slate-900 dark:text-white"
                >
                  <option value="All">{t('clearance.allDivisions')}</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Property Management">Property Management</option>
                  <option value="Head Office Staff">Head Office</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 flex-1 text-slate-900 dark:text-white"
                >
                  <option value="All">{t('clearance.allStatus')}</option>
                  <option value="In Progress">{t('clearance.inProgress')}</option>
                  <option value="Cleared">{t('clearance.cleared')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredClearances.map((c) => {
                const isSelected = selectedClearance?.id === c.id;
                const returnedCount = c.issuedItems.filter((i) => i.isReturned).length;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClearanceId(c.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 shadow-xs' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{c.employeeName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{c.serviceType}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.employeeCode} · {c.role}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('clearance.items')}: <strong className="text-slate-800 dark:text-slate-200">{returnedCount}/{c.issuedItems.length}</strong></span>
                      </span>
                      <span>{c.stage?.replace('_', ' ') || c.exitReason}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detail */}
          <div className="lg:col-span-8">
            {selectedClearance ? (
              <HrClearanceDetail
                record={selectedClearance}
                activeUser={activeUser}
                masterConfig={masterConfig}
                onUpdateClearance={onUpdateClearance}
                onOpenCertificate={() => setIsCertificateModalOpen(true)}
              />
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs">
                {t('clearance.selectClearancePrompt')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ClearanceInitiationModal
        isOpen={isInitiatingModalOpen}
        onClose={() => setIsInitiatingModalOpen(false)}
        employees={employees}
        onInitiate={(newRec) => { onInitiateClearance(newRec); setSelectedClearanceId(newRec.id); }}
      />

      {selectedClearance && (
        <ClearanceCertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          record={selectedClearance}
        />
      )}
    </div>
  );
};
