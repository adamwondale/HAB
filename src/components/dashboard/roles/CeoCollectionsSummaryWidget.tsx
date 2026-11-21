import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowRight, ShieldAlert, DollarSign } from 'lucide-react';
import { loadClientInvoices } from '../../../utils/clientBillingStorage';
import { computeCeoCollectionsTelemetry, OverdueRiskSite } from '../../../utils/ceoCollectionsAggregator';

interface CeoCollectionsSummaryWidgetProps {
  onOpenDrawer: () => void;
}

const RISK_BADGES: Record<OverdueRiskSite['riskLevel'], string> = {
  Critical: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  Moderate: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

export const CeoCollectionsSummaryWidget: React.FC<CeoCollectionsSummaryWidgetProps> = ({ onOpenDrawer }) => {
  const [invoices] = useState(() => loadClientInvoices());
  const telemetry = useMemo(() => computeCeoCollectionsTelemetry(invoices), [invoices]);

  const totalOutstanding = telemetry.totalOutstandingETB || 1;

  return (
    <div className="rounded-xl border border-[#EFE7D8] bg-[#FCF0DA]/40 p-5 dark:border-[#3D3633] dark:bg-[#24201E] space-y-4">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EFE7D8] dark:border-[#3D3633] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#4C4541] dark:text-[#F2C46A]" />
            <h2 className="text-sm font-bold text-[#4C4541] dark:text-white tracking-tight">
              Executive Accounts Receivable & Collections Telemetry
            </h2>
          </div>
          <p className="text-xs text-[#68615C] dark:text-[#8C847E] mt-0.5">
            Real-time billing, collection velocity, and overdue risk exposure across 14 client sites
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4C4541] hover:bg-[#383330] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#F2C46A]" />
          <span>Launch Collections Observatory</span>
          <ArrowRight className="w-3 h-3 text-[#F2C46A]" />
        </button>
      </div>

      {/* 4 Headline Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1C1816] p-3.5 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633]">
          <span className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E]">Total Billed Revenue</span>
          <div className="text-xl font-bold font-mono tabular-nums text-[#4C4541] dark:text-[#F7F4EE] mt-0.5">
            ETB {telemetry.totalInvoicedETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#A8A29E] mt-0.5 block">14 active commercial sites</span>
        </div>

        <div className="bg-white dark:bg-[#1C1816] p-3.5 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633]">
          <span className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E]">Cash Realized / Settled</span>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-0.5">
            ETB {telemetry.totalCollectedETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">Includes 2% WHT credits</span>
        </div>

        <div className="bg-white dark:bg-[#1C1816] p-3.5 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633]">
          <span className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E]">Outstanding AR Exposure</span>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400 mt-0.5">
            ETB {telemetry.totalOutstandingETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5 block">Net 30 receivable pool</span>
        </div>

        <div className="bg-white dark:bg-[#1C1816] p-3.5 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633]">
          <span className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E]">Collection Efficiency</span>
          <div className="text-xl font-bold font-mono tabular-nums text-[#4C4541] dark:text-white mt-0.5">
            {telemetry.collectionRate}%
          </div>
          <div className="w-full bg-[#EFE7D8] dark:bg-[#3D3633] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${Math.min(100, telemetry.collectionRate)}%` }} />
          </div>
        </div>
      </div>

      {/* 4-Tier Visual Aging Distribution Bar */}
      <div className="bg-white dark:bg-[#1C1816] p-4 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#4C4541] dark:text-white">
            AR Aging Analysis Distribution
          </span>
          <span className="text-[11px] font-mono text-[#78716C] dark:text-[#A8A29E]">
            Total AR: ETB {telemetry.totalOutstandingETB.toLocaleString()}
          </span>
        </div>

        {/* Segmented Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
          {telemetry.agingBuckets.map((bucket) => {
            const pct = (bucket.totalAmountETB / totalOutstanding) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={bucket.label}
                title={`${bucket.label}: ETB ${bucket.totalAmountETB.toLocaleString()} (${pct.toFixed(1)}%)`}
                style={{ width: `${pct}%`, backgroundColor: bucket.color }}
                className="h-full transition-all first:rounded-l-full last:rounded-r-full"
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          {telemetry.agingBuckets.map((bucket) => {
            const pct = totalOutstanding > 0 ? ((bucket.totalAmountETB / totalOutstanding) * 100).toFixed(1) : '0';
            return (
              <div key={bucket.label} className="flex items-start gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: bucket.color }} />
                <div>
                  <div className="font-semibold text-[#4C4541] dark:text-slate-200 text-[11px]">{bucket.label}</div>
                  <div className="font-mono tabular-nums text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                    ETB {bucket.totalAmountETB.toLocaleString()} <span className="opacity-75">({pct}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Risk Delinquency Alert Strip */}
      {telemetry.topOverdueRiskSites.length > 0 && (
        <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>High-Risk Delinquency Alert Rail ({telemetry.topOverdueRiskSites.length} Critical Accounts)</span>
            </div>
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Attention Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {telemetry.topOverdueRiskSites.map((site) => (
              <div
                key={site.siteId}
                onClick={onOpenDrawer}
                className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#24201E] border border-rose-200/80 dark:border-rose-900/40 cursor-pointer hover:border-rose-400 transition-colors shadow-2xs"
              >
                <div className="truncate pr-2">
                  <div className="text-xs font-bold text-[#4C4541] dark:text-white truncate">{site.siteName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{site.clientOrganization}</div>
                  <div className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                    ETB {site.outstandingBalanceETB.toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${RISK_BADGES[site.riskLevel]}`}>
                    {site.riskLevel}
                  </span>
                  <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold mt-1">
                    {site.daysOverdue}d overdue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
