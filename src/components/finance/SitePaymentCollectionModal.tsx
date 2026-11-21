import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Building2, Receipt, AlertCircle, FileText } from 'lucide-react';
import { ClientInvoice, PaymentMethod } from '../../types/clientBilling';
import { recordInvoicePayment } from '../../utils/clientBillingStorage';

interface SitePaymentCollectionModalProps {
  invoice: ClientInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: (updated: ClientInvoice) => void;
}

export const SitePaymentCollectionModal: React.FC<SitePaymentCollectionModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPaymentRecorded
}) => {
  const [paymentDate, setPaymentDate] = useState('2026-11-21');
  const [amountPaidETB, setAmountPaidETB] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CBE');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [applyWht, setApplyWht] = useState(false);
  const [whtCertificateNumber, setWhtCertificateNumber] = useState('');
  const [whtAmountETB, setWhtAmountETB] = useState<number>(0);
  const [depositedBy, setDepositedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice) {
      setPaymentDate(new Date().toISOString().slice(0, 10));
      setAmountPaidETB(invoice.remainingBalanceETB);
      setPaymentMethod('CBE');
      setReferenceNumber('');
      setApplyWht(false);
      setWhtCertificateNumber('');
      setWhtAmountETB(Math.round(invoice.subtotalETB * 0.02));
      setDepositedBy('');
      setNotes('');
      setError(null);
    }
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleWhtToggle = (checked: boolean) => {
    setApplyWht(checked);
    if (checked) {
      const calculatedWht = Math.round(invoice.subtotalETB * 0.02);
      setWhtAmountETB(calculatedWht);
      if (amountPaidETB === invoice.remainingBalanceETB) {
        setAmountPaidETB(Math.max(0, invoice.remainingBalanceETB - calculatedWht));
      }
    } else {
      setWhtAmountETB(0);
      setAmountPaidETB(invoice.remainingBalanceETB);
    }
  };

  const effectiveWht = applyWht ? whtAmountETB : 0;
  const totalSettling = (amountPaidETB || 0) + effectiveWht;
  const newRemainingBalance = Math.max(0, invoice.remainingBalanceETB - totalSettling);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!amountPaidETB && !effectiveWht) {
      setError('Please specify a payment amount or withholding tax credit.');
      return;
    }
    if (!referenceNumber.trim()) {
      setError('Transaction slip or reference number is required for audit verification.');
      return;
    }
    if (applyWht && !whtCertificateNumber.trim()) {
      setError('Withholding tax certificate number is required when applying 2% WHT credit.');
      return;
    }
    if (totalSettling > invoice.remainingBalanceETB) {
      setError('Total settlement exceeds the remaining invoice balance.');
      return;
    }

    try {
      const updated = recordInvoicePayment(invoice.id, {
        invoiceId: invoice.id,
        siteId: invoice.siteId,
        siteName: invoice.siteName,
        paymentDate,
        amountPaidETB,
        paymentMethod,
        referenceNumber: referenceNumber.trim(),
        withholdingTaxCertificateNumber: applyWht ? whtCertificateNumber.trim() : undefined,
        withholdingTaxAmountETB: applyWht ? effectiveWht : undefined,
        depositedBy: depositedBy.trim() || 'Client Finance Dept',
        notes: notes.trim() || undefined
      });
      onPaymentRecorded(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#FCF0DA] dark:bg-slate-800/80 border-b border-[#EFE7D8] dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#4C4541] dark:text-[#F2C46A]" />
            <h2 className="text-sm font-bold text-[#4C4541] dark:text-white">Record Site Payment Collection</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Header Details */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {invoice.siteName}
            </span>
            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{invoice.invoiceNumber}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px]">
            <div><span className="text-slate-400 block">Total Invoiced</span><span className="font-mono font-bold tabular-nums">ETB {invoice.totalAmountETB.toLocaleString()}</span></div>
            <div><span className="text-slate-400 block">Prior Settled</span><span className="font-mono font-bold text-emerald-600 tabular-nums">ETB {(invoice.amountPaidETB + invoice.withholdingTaxCreditETB).toLocaleString()}</span></div>
            <div><span className="text-slate-400 block">Remaining Due</span><span className="font-mono font-bold text-rose-600 tabular-nums">ETB {invoice.remainingBalanceETB.toLocaleString()}</span></div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Channel</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-200">
                <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                <option value="Awash">Awash Bank</option>
                <option value="Abyssinia">Bank of Abyssinia</option>
                <option value="Telebirr">Telebirr SuperApp</option>
                <option value="Cheque">Cheque / Direct Draft</option>
                <option value="Cash Receipt">Cash Desk Receipt</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Collection Date</label>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200" required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Net Cash Received (ETB)</label>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setAmountPaidETB(invoice.remainingBalanceETB - effectiveWht)} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer">Full Balance</button>
                <button type="button" onClick={() => setAmountPaidETB(Math.round((invoice.remainingBalanceETB - effectiveWht) / 2))} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer">Half Balance</button>
              </div>
            </div>
            <input type="number" min={0} max={invoice.remainingBalanceETB} step="any" value={amountPaidETB || ''} onChange={(e) => setAmountPaidETB(Number(e.target.value))} placeholder="Amount in ETB" className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm tabular-nums" required />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reference / Slip Number *</label>
            <input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="e.g. CBE-FT-20261121-09412 or Cheque #12903" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs" required />
          </div>

          {/* 2% Withholding Tax Credit Accordion */}
          <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={applyWht} onChange={(e) => handleWhtToggle(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5" />
              <span className="font-semibold text-amber-900 dark:text-amber-200 text-xs">Apply 2% Ethiopian Withholding Tax (WHT) Credit</span>
            </label>
            {applyWht && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 block mb-0.5">WHT Credit (ETB)</span>
                  <input type="number" value={whtAmountETB} onChange={(e) => setWhtAmountETB(Number(e.target.value))} className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-amber-300 rounded font-mono text-xs" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 block mb-0.5">WHT Cert No. *</span>
                  <input type="text" value={whtCertificateNumber} onChange={(e) => setWhtCertificateNumber(e.target.value)} placeholder="e.g. ERCA-WHT-2026-904" className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-amber-300 rounded font-mono text-xs" required />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Deposited / Handled By</label>
              <input type="text" value={depositedBy} onChange={(e) => setDepositedBy(e.target.value)} placeholder="Payer representative name" className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 rounded text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Internal Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional ledger notes" className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 rounded text-xs" />
            </div>
          </div>

          {/* Live Balance Summary */}
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] flex items-center justify-between font-mono">
            <div><span className="text-slate-500">Total Settlement: </span><strong className="text-slate-900 dark:text-white tabular-nums">ETB {totalSettling.toLocaleString()}</strong></div>
            <div><span className="text-slate-500">Remaining Balance: </span><strong className={`tabular-nums ${newRemainingBalance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>ETB {newRemainingBalance.toLocaleString()}</strong></div>
          </div>

          {/* Action CTAs */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" /> <span>Confirm Payment Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
