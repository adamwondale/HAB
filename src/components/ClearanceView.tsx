import React, { useState } from 'react';
import { Plus, Search, Package, Users, Landmark, PackageCheck, Lock } from 'lucide-react';
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
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Exit Clearance Workflow</div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">Sequential 3-Stage Exit Cockpit</h1>
        </div>
        {canInitiate ? (
          <button
            type="button"
            onClick={() => setIsInitiatingModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2C46A] hover:bg-[#e0b459] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Exit Clearance</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Role: {activeUser?.title.split('(')[0]}</span>
          </span>
        )}
      </div>

      {/* Perspective Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'hr', label: 'Stage 1: HR Exit Operations', count: clearances.filter((c) => c.status === 'In Progress').length, icon: Users },
          { id: 'store', label: 'Stage 2: Store Asset Return (Image 14)', count: storePendingCount, icon: PackageCheck },
          { id: 'finance', label: 'Stage 3: Finance Liquidation (Image 15)', count: financePendingCount, icon: Landmark }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                isActive ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-900 dark:text-amber-200 font-mono">
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
                  placeholder="Search employee or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 flex-1"
                >
                  <option value="All">All Divisions</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Property Management">Property Management</option>
                  <option value="Head Office Staff">Head Office</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 flex-1"
                >
                  <option value="All">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Cleared">Cleared</option>
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
                      isSelected ? 'bg-[#FCF0DA]/40 border-amber-600 shadow-xs ring-1 ring-amber-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300'
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
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>Items: <strong className="text-slate-800 dark:text-slate-200">{returnedCount}/{c.issuedItems.length}</strong></span>
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
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-slate-500 text-xs">
                Select an employee clearance case from the list.
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
