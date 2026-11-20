import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

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
  const { t } = useTranslation();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t('payroll.chequeTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('payroll.chequeSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('payroll.recordCheque')}</span>
        </button>
      </div>

      {/* Aggregate balance cards - Eye friendly neutral surfaces */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.chequeBalance')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            ETB {totalChequeBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">CBE & Awash</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.pettyCashBalance')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            ETB {totalPettyCashBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Cash on hand</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.totalDebited')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300 mt-1">
            ETB {totalDebited.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Supplier & expense</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.totalCredited')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            ETB {totalCredited.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Receipts in</span>
        </div>
      </div>

      {/* Ledger Table - Calm eye friendly header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px] border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold text-xs">
            <tr>
              <th className="py-2.5 px-3">{t('payroll.chequeNumber')}</th>
              <th className="py-2.5 px-3">{t('payroll.payee')}</th>
              <th className="py-2.5 px-3">{t('payroll.account')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.amount')}</th>
              <th className="py-2.5 px-3">{t('payroll.issueDate')}</th>
              <th className="py-2.5 px-3 text-center">{t('payroll.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">{r.chequeNumber}</td>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{r.payeeOrDrawer}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{r.accountType} · {r.bankName}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {r.type === 'credit' ? '+' : '-'}ETB {r.amount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{r.issueDate}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                    r.status === 'Cleared'
                      ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  }`}>
                    {r.status}
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
            <h3 className="text-sm font-semibold border-b border-slate-100 pb-2">{t('payroll.recordCheque')}</h3>
            <div>
              <label className="font-medium text-slate-700 block mb-1">{t('payroll.chequeNumber')}</label>
              <input type="text" value={formNumber} onChange={e => setFormNumber(e.target.value)} placeholder="e.g. CBE-98240 or PC-2026-090" required className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono" />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">{t('payroll.payee')}</label>
              <input type="text" value={formPayee} onChange={e => setFormPayee(e.target.value)} placeholder="e.g. Fuel Purchase or Client Receipt" required className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-slate-700 block mb-1">{t('common.actions')}</label>
                <select value={formType} onChange={e => setFormType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="debit">Debit (Out)</option>
                  <option value="credit">Credit (In)</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">{t('payroll.account')}</label>
                <select value={formAccountType} onChange={e => setFormAccountType(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="Cheque">Cheque</option>
                  <option value="Petty Cash">Petty Cash</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">{t('payroll.amount')}</label>
              <input type="number" min={1} value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} required className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer">{t('common.cancel')}</button>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer">{t('common.save')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
