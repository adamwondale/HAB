import React, { useState } from 'react';
import { X, Sliders, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export interface FinanceStatutorySettings {
  pensionEmployeePercent: number;
  pensionEmployerPercent: number;
  vatRatePercent: number;
  whtServicesThresholdETB: number;
  whtEquipmentThresholdETB: number;
  mobileExemptionThresholdETB: number;
  transportExemptionThresholdETB: number;
  maxTaxBracketPercent: number;
}

export interface FinanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: FinanceStatutorySettings) => void;
}

const DEFAULT_SETTINGS: FinanceStatutorySettings = {
  pensionEmployeePercent: 7,
  pensionEmployerPercent: 11,
  vatRatePercent: 15,
  whtServicesThresholdETB: 10000,
  whtEquipmentThresholdETB: 20000,
  mobileExemptionThresholdETB: 12000,
  transportExemptionThresholdETB: 1600,
  maxTaxBracketPercent: 35
};

export const FinanceSettingsModal: React.FC<FinanceSettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [settings, setSettings] = useState<FinanceStatutorySettings>(DEFAULT_SETTINGS);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    onSave?.(settings);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-5 space-y-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-[#4C4541] dark:text-slate-100">
              <Sliders className="w-4 h-4 text-[#F2C46A]" />
              <span>Statutory Tax & Financial Policy Settings</span>
            </h3>
            <p className="text-xs text-slate-500">Ethiopian statutory rates, tax brackets, and exemption thresholds (ERCA & POESSA)</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveToast && (
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Statutory policies updated and synced across payroll & invoices.</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          {/* Income Tax Schedule 'A' Brackets Reference */}
          <div className="p-2.5 rounded-lg bg-[#FCF0DA]/40 border border-[#EFE7D8] dark:bg-slate-800/40 dark:border-slate-700">
            <div className="flex items-center justify-between font-bold text-[#4C4541] dark:text-slate-200 mb-1.5">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#F2C46A]" /> Ethiopian Income Tax Brackets (Schedule 'A')</span>
              <span className="font-mono text-emerald-700 font-black">Top: {settings.maxTaxBracketPercent}%</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">0 - 600 ETB: <strong>0%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">601 - 1,650: <strong>10%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">1,651 - 3,200: <strong>15%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">3,201 - 5,250: <strong>20%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">5,251 - 7,800: <strong>25%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100">7,801 - 10,900: <strong>30%</strong></div>
              <div className="bg-white/80 dark:bg-slate-800 p-1 rounded border border-slate-100 col-span-2 text-rose-700 font-bold">&gt; 10,900 ETB: <strong>35% (-1,500)</strong></div>
            </div>
          </div>

          {/* Pension & VAT Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Employee Pension (%)</label>
              <input type="number" value={settings.pensionEmployeePercent} onChange={(e) => setSettings({ ...settings, pensionEmployeePercent: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">Mandatory POESSA 7%</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Employer Pension (%)</label>
              <input type="number" value={settings.pensionEmployerPercent} onChange={(e) => setSettings({ ...settings, pensionEmployerPercent: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">Non-deductible 11%</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Standard VAT Rate (%)</label>
              <input type="number" value={settings.vatRatePercent} onChange={(e) => setSettings({ ...settings, vatRatePercent: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">Standard rate 15%</span>
            </div>
          </div>

          {/* Withholding Tax (WHT) Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">WHT Services Threshold (ETB)</label>
              <input type="number" value={settings.whtServicesThresholdETB} onChange={(e) => setSettings({ ...settings, whtServicesThresholdETB: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">2% WHT applied above ETB 10,000</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">WHT Goods / Equipment (ETB)</label>
              <input type="number" value={settings.whtEquipmentThresholdETB} onChange={(e) => setSettings({ ...settings, whtEquipmentThresholdETB: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">2% WHT applied above ETB 20,000</span>
            </div>
          </div>

          {/* Other Income Tax Exemptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Mobile Allowance Exemption (ETB)</label>
              <input type="number" value={settings.mobileExemptionThresholdETB} onChange={(e) => setSettings({ ...settings, mobileExemptionThresholdETB: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">Annual threshold ETB 12,000</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Transport Allowance Exemption (ETB)</label>
              <input type="number" value={settings.transportExemptionThresholdETB} onChange={(e) => setSettings({ ...settings, transportExemptionThresholdETB: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono" />
              <span className="text-[10px] text-slate-400">Monthly cap ETB 1,600 / basic 1/4</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={() => setSettings(DEFAULT_SETTINGS)} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer">Cancel</button>
            <button type="button" onClick={handleSave} className="px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#e6b450] text-[#4C4541] font-bold text-xs cursor-pointer transition-colors shadow-xs">
              Save Statutory Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
