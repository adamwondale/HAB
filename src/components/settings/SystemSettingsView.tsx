import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, RotateCcw, Save, Sliders, Scale, CheckCircle2 } from 'lucide-react';
import { SystemSettings } from '../../types/systemSettings';
import { loadSystemSettings, saveSystemSettings, DEFAULT_SYSTEM_SETTINGS } from '../../utils/systemSettingsStorage';
import { AppearanceSecurityTab } from './AppearanceSecurityTab';
import { HrLaborRulesTab } from './HrLaborRulesTab';
import { logAuditEvent } from '../../utils/auditLogger';

export const SystemSettingsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAmharic = i18n.language === 'am';

  const [settings, setSettings] = useState<SystemSettings>(() => loadSystemSettings());
  const [activeSubTab, setActiveSubTab] = useState<'appearance' | 'hr_rules'>('appearance');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSave = () => {
    const updated: SystemSettings = {
      ...settings,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lastUpdatedBy: 'Super Admin'
    };
    saveSystemSettings(updated);
    setSettings(updated);

    logAuditEvent({
      actorId: 'admin',
      actorName: 'Super Admin',
      actorRole: 'super_admin',
      action: 'SUPER_ADMIN_OVERRIDE',
      targetModule: 'System',
      targetId: 'system-settings',
      details: `Saved System Settings (Theme: ${updated.appearance.theme}, Probation: ${updated.hrLaborRules.probationDurationDays}d, Base Leave: ${updated.hrLaborRules.baseLeaveDays}d)`,
      status: 'SUCCESS'
    });

    showNotice(isAmharic ? 'የስርዓት ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል!' : 'System settings successfully saved and applied.');
  };

  const handleResetDefaults = () => {
    const resetConfig: SystemSettings = {
      ...DEFAULT_SYSTEM_SETTINGS,
      lastUpdatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lastUpdatedBy: 'Super Admin (Reset Baseline)'
    };
    saveSystemSettings(resetConfig);
    setSettings(resetConfig);

    logAuditEvent({
      actorId: 'admin',
      actorName: 'Super Admin',
      actorRole: 'super_admin',
      action: 'SUPER_ADMIN_OVERRIDE',
      targetModule: 'System',
      targetId: 'system-settings',
      details: 'Restored statutory baseline system settings (60d probation, 16d base leave).',
      status: 'SUCCESS'
    });

    showNotice(isAmharic ? 'የመነሻ ነባሪ ህጎች ተመልሰዋል!' : 'Restored system baseline defaults.');
  };

  return (
    <div className="space-y-6">
      {/* View Header with Super Admin Authority Badge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2C46A]" />
                Super Admin Exclusive
              </span>
              <span className="text-[11px] font-mono text-slate-500">v{settings.version}</span>
            </div>
            <h1 className="text-xl font-black text-[#0E1525] dark:text-white tracking-tight">
              {isAmharic ? 'የስርዓት ቅንብሮች እና የስራ ህጎች' : 'System Settings & Labor Governance'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAmharic
                ? 'የገጽታ ቀለም፣ ቋንቋ፣ የይለፍ ቃል፣ የሙከራ ጊዜ እና የዓመት ፈቃድ ቀመር መቆጣጠሪያ'
                : `Appearance, credentials, probation duration (${settings.hrLaborRules.probationDurationDays}d), and annual leave progression formulas.`}
              <span className="ml-2 font-mono text-[11px] text-slate-400">
                · Last updated: {settings.lastUpdatedAt} ({settings.lastUpdatedBy})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAmharic ? 'ነባሪ መልስ' : 'Reset Defaults'}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#e4b55b] text-[#4C4541] text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAmharic ? 'ለውጦችን መዝግብ' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-4 pt-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('appearance')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'appearance'
                ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAmharic ? '1. ገጽታ እና ደህንነት' : '1. Appearance & Security'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('hr_rules')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'hr_rules'
                ? 'bg-[#4C4541] text-[#FCF0DA] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isAmharic ? '2. የሰው ኃይል እና የሰራተኛ ህጎች' : '2. HR & Labor Rules'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'appearance' ? (
        <AppearanceSecurityTab
          appearance={settings.appearance}
          onChange={(appearance) => setSettings((prev) => ({ ...prev, appearance }))}
        />
      ) : (
        <HrLaborRulesTab
          rules={settings.hrLaborRules}
          onChange={(hrLaborRules) => setSettings((prev) => ({ ...prev, hrLaborRules }))}
        />
      )}
    </div>
  );
};
