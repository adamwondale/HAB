import React, { useState } from 'react';
import {
  Employee,
  ClientSite,
  PayrollRecord,
  StockItem,
  ClearanceRecord,
  LeaveRequest,
  OnboardingChecklist,
  Candidate
} from '../../../types/hrm';
import { Division } from '../../../types/division';
import { CeoWorkDistributionSection } from './CeoWorkDistributionSection';
import { CeoAttentionRail } from './CeoAttentionRail';
import { CeoSummaryGrid } from './CeoSummaryGrid';
import { CeoDepartmentKpiCards } from './CeoDepartmentKpiCards';
import { CeoCollectionsSummaryWidget } from './CeoCollectionsSummaryWidget';
import { CeoCollectionsReportDrawer } from '../CeoCollectionsReportDrawer';
import { CeoSettingsModal } from '../CeoSettingsModal';
import { Sliders } from 'lucide-react';

interface CeoDashboardProps {
  employees: Employee[];
  sites: ClientSite[];
  payroll?: PayrollRecord[];
  stockItems?: StockItem[];
  clearances?: ClearanceRecord[];
  leaveRequests?: LeaveRequest[];
  onboardingList?: OnboardingChecklist[];
  candidates?: Candidate[];
  divisions?: Division[];
  onNavigateTab: (tabId: string) => void;
}

export const CeoDashboard: React.FC<CeoDashboardProps> = ({
  employees,
  sites = [],
  payroll = [],
  stockItems = [],
  clearances = [],
  leaveRequests = [],
  onboardingList = [],
  candidates = [],
  divisions,
  onNavigateTab
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollectionsDrawerOpen, setIsCollectionsDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* CEO Executive Header with Settings Trigger */}
      <section className="flex items-center justify-between border-b border-[#EFE7D8] pb-4 dark:border-[#3D3633]">
        <div>
          <h1 className="text-xl font-bold text-[#4C4541] dark:text-[#F7F4EE] tracking-tight">
            CEO & Executive Operations Dashboard
          </h1>
          <p className="text-xs text-[#68615C] dark:text-[#8C847E] mt-0.5">
            Real-time executive oversight, 36 KPI matrix, and workforce telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#4C4541] dark:text-[#F2C46A] bg-[#FCF0DA] px-2.5 py-1 rounded-md border border-[#EFE7D8]">
            Currency: ETB
          </span>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold text-[#4C4541] dark:text-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-[#F2C46A]" /> Settings
          </button>
        </div>
      </section>

      {/* Executive Accounts Receivable & Collections Telemetry */}
      <CeoCollectionsSummaryWidget onOpenDrawer={() => setIsCollectionsDrawerOpen(true)} />

      {/* Top Row: Work Distribution Donut (Left) + Need Attention Triage Rail (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CeoWorkDistributionSection onNavigateTab={onNavigateTab} />
        </div>
        <div className="lg:col-span-5">
          <CeoAttentionRail onNavigateTab={onNavigateTab} />
        </div>
      </section>

      {/* Middle Row: Employees Summary Table with Grouped Deduction/Increment */}
      <CeoSummaryGrid employees={employees} />

      {/* Bottom Row: Open a Team Workspace (Screen 1 Blueprint Parity) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'HR Workspace', tab: 'management', code: 'HR', color: '#4C4541', desc: 'Workforce, recruitment & clearance' },
          { label: 'Finance Workspace', tab: 'payroll', code: 'FIN', color: '#AEAC78', desc: 'Payroll calculation & compliance' },
          { label: 'Property & Store Workspace', tab: 'store', code: 'PROP', color: '#F2C46A', desc: '3D warehouse & stock control' }
        ].map((ws) => (
          <div
            key={ws.label}
            onClick={() => onNavigateTab(ws.tab)}
            className="rounded-xl border border-[#EFE7D8] bg-[#FCF0DA] p-4 cursor-pointer hover:bg-[#F5E6CA] transition-colors dark:border-[#3D3633] dark:bg-[#2C2724] dark:hover:bg-[#3D3633]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#4C4541] dark:text-white px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-800">
                {ws.code}
              </span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ws.color }} />
            </div>
            <h3 className="text-sm font-bold text-[#4C4541] dark:text-white">{ws.label}</h3>
            <p className="text-[10px] text-[#68615C] dark:text-[#8C847E] mt-0.5">{ws.desc}</p>
          </div>
        ))}
      </section>

      {/* 36-KPI Performance Measurement Matrix (Document 1 Parity) */}
      <CeoDepartmentKpiCards
        employees={employees}
        payroll={payroll}
        stockItems={stockItems}
        onNavigateTab={onNavigateTab}
      />

      {/* CEO Settings Modal */}
      <CeoSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* CEO Collections Observatory Report Drawer */}
      <CeoCollectionsReportDrawer
        isOpen={isCollectionsDrawerOpen}
        onClose={() => setIsCollectionsDrawerOpen(false)}
      />
    </div>
  );
};
