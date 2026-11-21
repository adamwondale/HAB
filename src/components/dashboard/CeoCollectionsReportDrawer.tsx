import React, { useState, useMemo } from 'react';
import { X, Search, Download, Printer, FileText, AlertTriangle } from 'lucide-react';
import { ClientInvoice, ClientDivision } from '../../types/clientBilling';
import { loadClientInvoices } from '../../utils/clientBillingStorage';
import { computeCeoCollectionsTelemetry, computeDaysOverdue } from '../../utils/ceoCollectionsAggregator';
import { printDemandLetter, exportCollectionsCsv } from '../../utils/demandLetterGenerator';

interface CeoCollectionsReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeoCollectionsReportDrawer: React.FC<CeoCollectionsReportDrawerProps> = ({ isOpen, onClose }) => {
  const [invoices] = useState<ClientInvoice[]>(() => loadClientInvoices());
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'All' | ClientDivision>('All');
  const [agingFilter, setAgingFilter] = useState<'All' | '0-30' | '31-60' | '61-90' | '90+'>('All');
  const [holdAlerts, setHoldAlerts] = useState<Record<string, boolean>>({});

  const telemetry = useMemo(() => computeCeoCollectionsTelemetry(invoices), [invoices]);

  if (!isOpen) return null;

  const handleToggleHold = (siteId: string, siteName: string) => {
    setHoldAlerts(prev => {
      const active = !prev[siteId];
      if (active) {
        alert(`⚠️ DEPLOYMENT REVIEW FLAGGED for "${siteName}". Operational roster review sent to Technical Manager.`);
      }
      return { ...prev, [siteId]: active };
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    if (divisionFilter !== 'All' && inv.division !== divisionFilter) return false;
    const days = computeDaysOverdue(inv.dueDate);
    if (agingFilter === '0-30' && (days < 0 || days > 30)) return false;
    if (agingFilter === '31-60' && (days <= 30 || days > 60)) return false;
    if (agingFilter === '61-90' && (days <= 60 || days > 90)) return false;
    if (agingFilter === '90+' && days <= 90) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return inv.siteName.toLowerCase().includes(q) || inv.clientOrganization.toLowerCase().includes(q) || inv.invoiceNumber.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-5xl bg-white dark:bg-[#1E1A18] h-full shadow-2xl flex flex-col border-l border-[#EFE7D8] dark:border-[#3D3633] text-[#4C4541] dark:text-[#F7F4EE]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7D8] dark:border-[#3D3633] flex items-center justify-between bg-[#FCF0DA]/30 dark:bg-[#24201E]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Executive Accounts Receivable & Collections Observatory</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold">
                Portfolio AR: ETB {telemetry.totalOutstandingETB.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5">
              Comprehensive site-by-site recovery status, division velocity, and legal recovery actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => exportCollectionsCsv(filteredInvoices)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Briefing
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Division Breakdown Strip */}
        <div className="p-4 border-b border-[#EFE7D8] dark:border-[#3D3633] grid grid-cols-1 md:grid-cols-2 gap-3 bg-white dark:bg-[#1E1A18]">
          {telemetry.divisionSummaries.map(div => (
            <div key={div.division} className="p-3.5 rounded-lg border border-[#EFE7D8] dark:border-[#3D3633] bg-[#FCF0DA]/20 dark:bg-[#25201D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">{div.division} Division</span>
                <div className="text-lg font-bold font-mono tabular-nums mt-0.5">ETB {div.collectedETB.toLocaleString()}</div>
                <div className="text-[11px] text-[#78716C]">Invoiced: ETB {div.invoicedETB.toLocaleString()} · Outstanding: ETB {div.outstandingETB.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{div.collectionRate}%</span>
                <div className="text-[10px] font-semibold text-slate-500">Collection Velocity</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-[#EFE7D8] dark:border-[#3D3633] flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 dark:bg-[#1C1816]">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input type="text" placeholder="Filter site, client or invoice..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#78716C] font-semibold mr-1">Division:</span>
            {(['All', 'Security', 'Cleaning', 'Combined'] as const).map(d => (
              <button key={d} type="button" onClick={() => setDivisionFilter(d)} className={`px-2 py-1 text-[11px] rounded font-medium cursor-pointer ${divisionFilter === d ? 'bg-[#4C4541] text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{d}</button>
            ))}
            <span className="text-[11px] text-[#78716C] font-semibold mx-1">Aging:</span>
            {(['All', '0-30', '31-60', '61-90', '90+'] as const).map(a => (
              <button key={a} type="button" onClick={() => setAgingFilter(a)} className={`px-2 py-1 text-[11px] rounded font-medium cursor-pointer ${agingFilter === a ? 'bg-[#4C4541] text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{a === 'All' ? 'All Days' : `${a}d`}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#FCF0DA] dark:bg-[#24201E] border-b border-[#EFE7D8] dark:border-[#3D3633] text-[10px] font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
              <tr>
                <th className="py-2.5 px-3">Site & Client Organization</th>
                <th className="py-2.5 px-2">Division</th>
                <th className="py-2.5 px-2 text-right">Invoiced (ETB)</th>
                <th className="py-2.5 px-2 text-right">Settled & WHT</th>
                <th className="py-2.5 px-2 text-right">Outstanding (ETB)</th>
                <th className="py-2.5 px-2 text-center">Aging Bracket</th>
                <th className="py-2.5 px-3 text-right">Remediation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map(inv => {
                const days = computeDaysOverdue(inv.dueDate);
                const isHold = holdAlerts[inv.siteId];
                return (
                  <tr key={inv.id} className="hover:bg-amber-50/30 dark:hover:bg-[#25201D] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {inv.siteName}
                        {isHold && <span className="text-[9px] bg-rose-600 text-white font-bold px-1 rounded">HOLD REVIEW</span>}
                      </div>
                      <div className="text-[11px] text-slate-500">{inv.clientOrganization} · <span className="font-mono">{inv.invoiceNumber}</span></div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">{inv.division}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">{inv.totalAmountETB.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {(inv.amountPaidETB + inv.withholdingTaxCreditETB).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums font-bold text-amber-700 dark:text-amber-400">
                      {inv.remainingBalanceETB.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${days > 60 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' : days > 30 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'}`}>
                        {days > 0 ? `${days}d overdue` : 'Current'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => printDemandLetter(inv)} title="Generate Legal Demand Letter" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                          <FileText className="w-3 h-3 text-amber-600" /> Demand Notice
                        </button>
                        <button type="button" onClick={() => handleToggleHold(inv.siteId, inv.siteName)} title="Review Deployment Roster with Tech Manager" className={`p-1 rounded cursor-pointer ${isHold ? 'bg-rose-600 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          <AlertTriangle className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
