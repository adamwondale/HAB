import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor, Palette, Globe, Check, ShieldCheck } from 'lucide-react';
import { SystemAppearanceSettings, SystemThemeMode, SystemLanguage } from '../../types/systemSettings';
import { UserCredentialManager } from '../UserCredentialManager';

interface AppearanceSecurityTabProps {
  appearance: SystemAppearanceSettings;
  onChange: (updated: SystemAppearanceSettings) => void;
}

const PALETTE_OPTIONS = [
  { hex: '#F2C46A', name: 'Warm Gold', text: '#4C4541', desc: 'Primary Brand Tone' },
  { hex: '#4C4541', name: 'Deep Charcoal', text: '#FCF0DA', desc: 'Grounded Contrast' },
  { hex: '#FCF0DA', name: 'Soft Cream', text: '#4C4541', desc: 'Subtle Canvas' },
  { hex: '#AEAC78', name: 'Highland Olive', text: '#FFFFFF', desc: 'Nature Accent' },
  { hex: '#C86D51', name: 'Clay Terracotta', text: '#FFFFFF', desc: 'Earthy Warmth' },
  { hex: '#1E293B', name: 'Executive Slate', text: '#FFFFFF', desc: 'Corporate Tone' }
];

export const AppearanceSecurityTab: React.FC<AppearanceSecurityTabProps> = ({ appearance, onChange }) => {
  const { i18n } = useTranslation();

  const handleThemeChange = (mode: SystemThemeMode) => {
    onChange({ ...appearance, theme: mode });
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('hab_theme', mode);
  };

  const handleColorChange = (hex: string) => {
    onChange({ ...appearance, accentColor: hex });
  };

  const handleLanguageChange = (lang: SystemLanguage) => {
    onChange({ ...appearance, language: lang });
    i18n.changeLanguage(lang);
  };

  return (
    <div className="space-y-6">
      {/* Visual Presentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Theme Mode Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Sun className="w-4 h-4 text-[#F2C46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">Theme Mode</h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure visual lightness for all ERP screens.</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = appearance.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id as SystemThemeMode)}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#F2C46A] bg-[#FCF0DA] dark:bg-[#3D3633] text-[#4C4541] dark:text-[#F2C46A] shadow-xs ring-1 ring-[#F2C46A]'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Color Palette Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Palette className="w-4 h-4 text-[#F2C46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">Warm Earth Palette</h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Branded primary accents for buttons and badges.</p>
          <div className="grid grid-cols-3 gap-2">
            {PALETTE_OPTIONS.map((c) => {
              const isSelected = appearance.accentColor.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleColorChange(c.hex)}
                  title={`${c.name} (${c.desc})`}
                  className={`relative flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#4C4541] dark:border-white ring-2 ring-[#F2C46A] bg-slate-50 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-black/10 shrink-0 flex items-center justify-center" style={{ backgroundColor: c.hex }}>
                    {isSelected && <Check className="w-2.5 h-2.5" style={{ color: c.text }} />}
                  </span>
                  <span className="truncate text-slate-700 dark:text-slate-200 text-[10px]">{c.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Bilingual Interface Language */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Globe className="w-4 h-4 text-[#F2C46A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">Language / ቋንቋ</h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Toggle default system localization and reports.</p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {[
              { code: 'en', label: 'English', sub: 'Default' },
              { code: 'am', label: 'አማርኛ', sub: 'Ethiopian' }
            ].map((lang) => {
              const isSelected = appearance.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code as SystemLanguage)}
                  className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#F2C46A] bg-[#FCF0DA] dark:bg-[#3D3633] text-[#4C4541] dark:text-[#F2C46A] ring-1 ring-[#F2C46A] shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-bold">{lang.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">{lang.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Credentials Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-[#F2C46A]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            System Accounts & Role Credentials
          </h3>
        </div>
        <UserCredentialManager />
      </div>
    </div>
  );
};
