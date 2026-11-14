import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClientSite, Employee } from '../../types/hrm';

export interface CompanyAsset {
  id: string;
  assetTag: string;
  name: string;
  category: 'Security Gear' | 'Cleaning Machines' | 'Communication' | 'IT & Office';
  serialNumber: string;
  assignedSite: string;
  custodian: string;
  condition: 'Excellent' | 'Good' | 'Needs Repair' | 'Decommissioned';
  valueETB: number;
  deployedDate: string;
}

const INITIAL_ASSETS: CompanyAsset[] = [
  { id: 'ast-01', assetTag: 'HAB-AST-0101', name: 'Garrett Super Scanner V', category: 'Security Gear', serialNumber: 'SN-GR-88421', assignedSite: 'United Nations ECA Site', custodian: 'Dan Hailu (Lead Guard)', condition: 'Good', valueETB: 12500, deployedDate: '2024-03-10' },
  { id: 'ast-02', assetTag: 'HAB-AST-0102', name: 'Motorola DP4801e VHF Radio', category: 'Communication', serialNumber: 'MOT-77821-X', assignedSite: 'Commercial Bank Site #4', custodian: 'Tewodros Kassaye', condition: 'Excellent', valueETB: 18500, deployedDate: '2024-05-12' },
  { id: 'ast-03', assetTag: 'HAB-AST-0201', name: 'Karcher BD 50/50 Floor Scrubber', category: 'Cleaning Machines', serialNumber: 'KCH-99230', assignedSite: 'Bole Medhanialem Mall', custodian: 'Cleaning Crew Leader Sara', condition: 'Needs Repair', valueETB: 145000, deployedDate: '2023-11-20' },
  { id: 'ast-04', assetTag: 'HAB-AST-0103', name: 'Handheld Under-Vehicle Mirror', category: 'Security Gear', serialNumber: 'UVM-4410', assignedSite: 'Ethio Telecom Head Office', custodian: 'Security Post #1', condition: 'Good', valueETB: 6500, deployedDate: '2024-01-18' }
];

interface AssetControlRegisterProps {
  sites: ClientSite[];
  employees: Employee[];
}

export const AssetControlRegister: React.FC<AssetControlRegisterProps> = ({ sites, employees }) => {
  const [assets, setAssets] = useState<CompanyAsset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CompanyAsset['category']>('Security Gear');
  const [formSerial, setFormSerial] = useState('');
  const [formSite, setFormSite] = useState(sites[0]?.name || 'Head Office');
  const [formCustodian, setFormCustodian] = useState('');
  const [formValue, setFormValue] = useState<number>(10000);

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assignedSite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.custodian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAssetValue = assets.reduce((sum, a) => sum + a.valueETB, 0);
  const assetsNeedingRepair = assets.filter((a) => a.condition === 'Needs Repair').length;

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const newAsset: CompanyAsset = {
      id: `ast-${Date.now()}`,
      assetTag: `HAB-AST-0${assets.length + 105}`,
      name: formName.trim(),
      category: formCategory,
      serialNumber: formSerial.trim() || `SN-${Date.now().toString().slice(-5)}`,
      assignedSite: formSite,
      custodian: formCustodian.trim() || 'Central Store Reserve',
      condition: 'Excellent',
      valueETB: formValue,
      deployedDate: new Date().toISOString().split('T')[0]
    };
    setAssets([newAsset, ...assets]);
    setShowAddModal(false);
    setFormName('');
    setFormSerial('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F2C46A]" />
            <span>Asset Control & Equipment Register</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring company high-value capital assets, operational condition, and field deployments
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FCF0DA]/60 dark:bg-slate-800 p-3 rounded-lg border border-[#EFE7D8]">
          <span className="text-[11px] font-bold text-[#4C4541]/70 block">Registered Assets</span>
          <div className="text-lg font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-0.5">
            {assets.length} Units
          </div>
        </div>
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/80">
          <span className="text-[11px] font-bold text-emerald-800 block">Total Insured Value</span>
          <div className="text-lg font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-300 mt-0.5">
            ETB {totalAssetValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/80">
          <span className="text-[11px] font-bold text-amber-900 block">Needs Maintenance</span>
          <div className="text-lg font-black font-mono tabular-nums text-amber-900 dark:text-amber-300 mt-0.5">
            {assetsNeedingRepair} Units
          </div>
        </div>
        <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200/80">
          <span className="text-[11px] font-bold text-blue-900 block">Operational Readiness</span>
          <div className="text-lg font-black font-mono tabular-nums text-blue-900 dark:text-blue-300 mt-0.5">
            {Math.round(((assets.length - assetsNeedingRepair) / assets.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by asset tag, equipment name, site, or custodian..."
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
        />
      </div>

      {/* Asset Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Asset Tag</th>
              <th className="py-2.5 px-3">Equipment Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Assigned Site</th>
              <th className="py-2.5 px-3">Current Custodian</th>
              <th className="py-2.5 px-3 text-right">Value (ETB)</th>
              <th className="py-2.5 px-3 text-center">Condition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-mono font-bold text-[#4C4541] dark:text-slate-200">{a.assetTag}</td>
                <td className="py-2 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{a.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{a.serialNumber}</div>
                </td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{a.category}</td>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{a.assignedSite}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{a.custodian}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">ETB {a.valueETB.toLocaleString()}</td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      a.condition === 'Excellent' || a.condition === 'Good'
                        ? 'bg-emerald-100 text-emerald-800'
                        : a.condition === 'Needs Repair'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {a.condition === 'Needs Repair' ? <Wrench className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>{a.condition}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddAsset} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-sm font-bold border-b border-slate-100 pb-2">Register Company Equipment Asset</h3>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Equipment Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="e.g. Motorola DP4801e Radio" className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <option value="Security Gear">Security Gear</option>
                  <option value="Cleaning Machines">Cleaning Machines</option>
                  <option value="Communication">Communication</option>
                  <option value="IT & Office">IT & Office</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Serial Number</label>
                <input type="text" value={formSerial} onChange={(e) => setFormSerial(e.target.value)} placeholder="e.g. SN-8821" className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Site</label>
                <select value={formSite} onChange={(e) => setFormSite(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
                  {sites.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Head Office">Head Office</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Value (ETB)</label>
                <input type="number" min={1} value={formValue} onChange={(e) => setFormValue(Number(e.target.value))} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold" />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Custodian / Staff</label>
              <input type="text" value={formCustodian} onChange={(e) => setFormCustodian(e.target.value)} placeholder="e.g. Lead Guard Dan Hailu" className="w-full px-3 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer">Register Asset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
