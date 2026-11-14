import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowDownRight, ArrowUpRight, Plus, CheckCircle2, Clock } from 'lucide-react';

export interface ChequeRecord {
  id: string;
  chequeNumber: string;
  type: 'debit' | 'credit';
  payeeOrDrawer: string;
  bankName: string;
  amount: number;
  issueDate: string;
  status: 'Cleared' | 'Pending' | 'Bounced';
  accountType: 'Cheque' | 'Petty Cash';
}

const INITIAL_CHEQUES: ChequeRecord[] = [
  { id: 'chq-1', chequeNumber: 'CBE-98231', type: 'debit', payeeOrDrawer: 'TotalEnergies Ethiopia (Fuel)', bankName: 'Commercial Bank of Ethiopia', amount: 48500, issueDate: '2026-11-10', status: 'Cleared', accountType: 'Cheque' },
  { id: 'chq-2', chequeNumber: 'AW-44120', type: 'credit', payeeOrDrawer: 'Client Settlement: Ethio Telecom Site Guarding', bankName: 'Awash Bank', amount: 320000, issueDate: '2026-11-12', status: 'Cleared', accountType: 'Cheque' },
  { id: 'chq-3', chequeNumber: 'CBE-98232', type: 'debit', payeeOrDrawer: 'Al-Sam Building Maintenance Supplies', bankName: 'Commercial Bank of Ethiopia', amount: 15400, issueDate: '2026-11-13', status: 'Pending', accountType: 'Cheque' },
  { id: 'pc-1', chequeNumber: 'PC-2026-088', type: 'debit', payeeOrDrawer: 'Office Refreshments & Courier Stamps', bankName: 'Petty Cash Box #1', amount: 3200, issueDate: '2026-11-14', status: 'Cleared', accountType: 'Petty Cash' },
  { id: 'pc-2', chequeNumber: 'PC-2026-089', type: 'credit', payeeOrDrawer: 'Replenishment from Main Cheque Account', bankName: 'Petty Cash Box #1', amount: 25000, issueDate: '2026-11-11', status: 'Cleared', accountType: 'Petty Cash' }
];

export const ChequeCashControlCard: React.FC = () => {
  const [records, setRecords] = useState<ChequeRecord[]>(INITIAL_CHEQUES);
  const [filterAccount, setFilterAccount] = useState<'All' | 'Cheque' | 'Petty Cash'>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formNumber, setFormNumber] = useState('');
  const [formPayee, setFormPayee] = useState('');
  const [formBank, setFormBank] = useState('Commercial Bank of Ethiopia');
  const [formAmount, setFormAmount] = useState<number>(10000);
  const [formType, setFormType] = useState<'debit' | 'credit'>('debit');
  const [formAccountType, setFormAccountType] = useState<'Cheque' | 'Petty Cash'>('Cheque');

  const filtered = records.filter(r => filterAccount === 'All' || r.accountType === filterAccount);

  const totalChequeBalance = records
    .filter(r => r.accountType === 'Cheque')
    .reduce((sum, r) => sum + (r.type === 'credit' ? r.amount : -r.amount), 450000);

  const totalPettyCashBalance = records
    .filter(r => r.accountType === 'Petty Cash')
    .reduce((sum, r) => sum + (r.type === 'credit' ? r.amount : -r.amount), 35000);

  const totalDebited = records.filter(r => r.type === 'debit').reduce((sum, r) => sum + r.amount, 0);
  const totalCredited = records.filter(r => r.type === 'credit').reduce((sum, r) => sum + r.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNumber.trim() || !formPayee.trim() || formAmount <= 0) return;
    const newRecord: ChequeRecord = {
      id: `chq-${Date.now()}`,
      chequeNumber: formNumber.trim(),
      type: formType,
      payeeOrDrawer: formPayee.trim(),
      bankName: formBank,
      amount: formAmount,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      accountType: formAccountType
    };
    setRecords([newRecord, ...records]);
    setFormNumber('');
    setFormPayee('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F2C46A]" />
            <span>Cheque Debited & Credit Control (Cash & Bank)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time balance controls across Cheque accounts and Petty Cash drawers
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Cheque / Movement</span>
        </button>
      </div>

      {/* Aggregate balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#FCF0DA]/70 dark:bg-slate-800/60 p-3 rounded-lg border border-[#EFE7D8] dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-[#4C4541]/70 dark:text-slate-400 font-bold">
            <span>Cheque Accounts</span>
            <CreditCard className="w-4 h-4 text-[#F2C46A]" />
          </div>
          <div className="text-base font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-1">
            ETB {totalChequeBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">CBE & Awash Operating</span>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/60">
          <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-bold">
            <span>Petty Cash Box</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-black font-mono tabular-nums text-amber-900 dark:text-amber-200 mt-1">
            ETB {totalPettyCashBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-700">Daily float & cash on hand</span>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold">
            <span>Cheques Debited (Out)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-black font-mono tabular-nums text-rose-800 dark:text-rose-200 mt-1">
            -ETB {totalDebited.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-600">Supplier & operational payments</span>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
            <span>Cheques Credited (In)</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-200 mt-1">
            +ETB {totalCredited.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600">Client contract receipts</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Cheque / Ref #</th>
              <th className="py-2.5 px-3">Payee / Issuer</th>
              <th className="py-2.5 px-3">Account / Bank</th>
              <th className="py-2.5 px-3 text-right">Amount (ETB)</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{r.chequeNumber}</td>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{r.payeeOrDrawer}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{r.accountType} · {r.bankName}</td>
                <td className={`py-2 px-3 text-right font-mono tabular-nums font-bold ${r.type === 'credit' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  {r.type === 'credit' ? '+' : '-'}ETB {r.amount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{r.issueDate}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                    {r.status === 'Cleared' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{r.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-sm font-bold border-b border-slate-100 pb-2">Record Cheque or Cash Movement</h3>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Cheque / Voucher Number</label>
              <input type="text" value={formNumber} onChange={e => setFormNumber(e.target.value)} placeholder="e.g. CBE-98240 or PC-2026-090" required className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Payee / Description</label>
              <input type="text" value={formPayee} onChange={e => setFormPayee(e.target.value)} placeholder="e.g. Fuel Purchase or Client Receipt" required className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Movement Type</label>
                <select value={formType} onChange={e => setFormType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="debit">Debit (Payment Out)</option>
                  <option value="credit">Credit (Receipt In)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Category</label>
                <select value={formAccountType} onChange={e => setFormAccountType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="Cheque">Cheque Account</option>
                  <option value="Petty Cash">Petty Cash</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Amount (ETB)</label>
              <input type="number" min={1} value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} required className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer">Save Movement</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
