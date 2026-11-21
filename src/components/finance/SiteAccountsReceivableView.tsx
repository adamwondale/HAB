import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Building2, CreditCard, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ClientInvoice, InvoiceStatus, ClientDivision } from '../../types/clientBilling';
import { loadClientInvoices, calculateARMetrics, resetClientInvoicesToDefault } from '../../utils/clientBillingStorage';
import { SitePaymentCollectionModal } from './SitePaymentCollectionModal';

interface SiteAccountsReceivableViewProps {
  onBack?: () => void;
}

function getAgingBadge(dueDateStr: string, isPaid: boolean) {
  if (isPaid) return { label: 'Settled', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' };
  const diffDays = Math.ceil((new Date('2026-11-21').getTime() - new Date(dueDateStr).getTime()) / 86400000);
  if (diffDays <= 0) return { label: 'On Time', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
  if (diffDays <= 15) return { label: 'Due Soon', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' };
  if (diffDays <= 45) return { label: 'Overdue 30d', bg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300' };
  return { label: `Overdue ${diffDays}d`, bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' };
}

export const SiteAccountsReceivableView: React.FC<SiteAccountsReceivableViewProps> = ({ onBack }) => {
  const [invoices, setInvoices] = useState<ClientInvoice[]>(() => loadClientInvoices());
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'All' | ClientDivision>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<ClientInvoice | null>(null);

  const metrics = calculateARMetrics(invoices);

  const handlePaymentRecorded = (updated: ClientInvoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
  };

  const handleReset = () => {
    if (window.confirm('Reset all commercial client site invoices to initial demonstration data?')) {
      const reset = resetClientInvoicesToDefault();
      setInvoices(reset);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (divisionFilter !== 'All' && inv.division !== divisionFilter) return false;
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return inv.siteName.toLowerCase().includes(q) ||
           inv.clientOrganization.toLowerCase().includes(q) ||
           inv.invoiceNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <button type="button" onClick={onBack} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Commercial Client Site Invoicing & AR Ledger
            </h1>
            <p className="text-xs text-slate-500">14 commercial client facilities · Multi-bank collections · 2% withholding credit</p>
          </div>
        </div>
        <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Ledger Demo</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Total Billed Revenue</span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
            ETB {metrics.totalBilledETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{invoices.length} commercial site contracts</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Total Collections & WHT</span>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
            ETB {metrics.totalCollectedETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">{metrics.collectionEfficiencyRate}% collection efficiency</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Outstanding AR Balance</span>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
            ETB {metrics.totalOutstandingETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Net 30 receivable pool</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Overdue Risk Balance</span>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
            ETB {metrics.totalOverdueETB.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{metrics.overdueInvoicesCount} delinquent client accounts</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search by site, client, or invoice #..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select value={divisionFilter} onChange={e => setDivisionFilter(e.target.value as 'All' | ClientDivision)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
              <option value="All">All Divisions</option>
              <option value="Security">Security Services</option>
              <option value="Cleaning">Cleaning Services</option>
              <option value="Combined">Combined Services</option>
            </select>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'All' | InvoiceStatus)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* High-Density Accounts Receivable Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF0DA] dark:bg-slate-800/80 text-[#4C4541] dark:text-slate-300 border-b border-[#EFE7D8] dark:border-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">Site & Client Organization</th>
                <th className="py-2.5 px-3">Invoice & Period</th>
                <th className="py-2.5 px-3 font-mono text-right">Invoiced (ETB)</th>
                <th className="py-2.5 px-3 font-mono text-right">Collected / WHT</th>
                <th className="py-2.5 px-3 font-mono text-right">Outstanding</th>
                <th className="py-2.5 px-3 text-center">Status & Aging</th>
                <th className="py-2.5 px-3 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map(inv => {
                const aging = getAgingBadge(inv.dueDate, inv.remainingBalanceETB === 0);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate max-w-[200px]" title={inv.siteName}>{inv.siteName}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate max-w-[200px]">{inv.clientOrganization}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-semibold text-slate-700 dark:text-slate-300">{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right font-medium text-slate-800 dark:text-slate-200">
                      ETB {inv.totalAmountETB.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right text-emerald-600 dark:text-emerald-400">
                      ETB {(inv.amountPaidETB + inv.withholdingTaxCreditETB).toLocaleString()}
                      {inv.withholdingTaxCreditETB > 0 && (
                        <span className="block text-[9.5px] text-amber-600">WHT: ETB {inv.withholdingTaxCreditETB.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-right font-bold">
                      <span className={inv.remainingBalanceETB === 0 ? 'text-emerald-600' : inv.status === 'Overdue' ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'}>
                        ETB {inv.remainingBalanceETB.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${aging.bg}`}>
                        {inv.status} · {aging.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {inv.remainingBalanceETB > 0 ? (
                        <button type="button" onClick={() => setSelectedInvoiceForPayment(inv)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-[11px] shadow-2xs cursor-pointer">
                          <CreditCard className="w-3 h-3" />
                          <span>Record Payment</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SitePaymentCollectionModal
        invoice={selectedInvoiceForPayment}
        isOpen={Boolean(selectedInvoiceForPayment)}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </div>
  );
};
