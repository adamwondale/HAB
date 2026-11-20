import React, { useState } from 'react';
import { X, Moon, Sun, Palette, Globe, KeyRound, User, Check } from 'lucide-react';

interface CeoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const CeoSettingsModal: React.FC<CeoSettingsModalProps> = ({
  isOpen,
  onClose,
  activeLanguage = 'en',
  onLanguageChange,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'color' | 'language' | 'password' | 'profile'>('theme');
  const [accentColor, setAccentColor] = useState('#F2C46A');
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Form states
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [ceoName, setCeoName] = useState('Kidist Bekele');
  const [ceoEmail, setCeoEmail] = useState('ceo@hab-business.com');
  const [ceoPhone, setCeoPhone] = useState('+251 91 123 4567');

  if (!isOpen) return null;

  const showSaveNotice = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) return;
    showSaveNotice('Executive password updated.');
    setCurrentPw('');
    setNewPw('');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSaveNotice('CEO Profile information updated.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#24201E] border border-[#EFE7D8] dark:border-[#3D3633] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#FCF0DA] dark:bg-slate-800 px-5 py-3.5 border-b border-[#EFE7D8] dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#4C4541] dark:text-white uppercase tracking-wider">
              Executive Settings (CEO Preferences)
            </h3>
            <p className="text-[11px] text-slate-500">Theme, Brand Palette, Language, Password & Profile</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Category Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-3 bg-slate-50 dark:bg-slate-900/50 text-xs overflow-x-auto">
          {[
            { id: 'theme', label: 'Theme', icon: Sun },
            { id: 'color', label: 'Color', icon: Palette },
            { id: 'language', label: 'Language', icon: Globe },
            { id: 'password', label: 'Password', icon: KeyRound },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2.5 font-bold cursor-pointer border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#F2C46A] text-[#4C4541] dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 text-xs space-y-4 min-h-[220px]">
          {savedMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> {savedMsg}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-3">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Appearance Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { if (darkMode) onToggleDarkMode?.(); showSaveNotice('Light theme enabled'); }}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                    !darkMode ? 'border-[#F2C46A] bg-[#FCF0DA]/40 text-[#4C4541] font-bold' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-600" /> Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => { if (!darkMode) onToggleDarkMode?.(); showSaveNotice('Dark mode enabled'); }}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                    darkMode ? 'border-[#F2C46A] bg-[#2C2724] text-white font-bold' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-[#F2C46A]" /> Dark Mode
                </button>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-3">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Accent / Brand Color</label>
              <div className="flex items-center gap-3">
                {[
                  { color: '#F2C46A', name: 'Golden Honey' },
                  { color: '#AEAC78', name: 'Sage Green' },
                  { color: '#4C4541', name: 'Deep Espresso' },
                  { color: '#B45309', name: 'Warm Amber' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => { setAccentColor(c.color); showSaveNotice(`Color set to ${c.name}`); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-2 transition-transform ${
                      accentColor === c.color ? 'scale-110 border-slate-900 dark:border-white shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.color }}
                  >
                    {accentColor === c.color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-3">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Interface Language</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { onLanguageChange?.('en'); showSaveNotice('English language selected'); }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    activeLanguage === 'en' ? 'border-[#F2C46A] bg-[#FCF0DA]/40 text-[#4C4541] font-bold' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>English (International)</span>
                  {activeLanguage === 'en' && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
                <button
                  type="button"
                  onClick={() => { onLanguageChange?.('am'); showSaveNotice('Amharic language selected'); }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    activeLanguage === 'am' ? 'border-[#F2C46A] bg-[#FCF0DA]/40 text-[#4C4541] font-bold' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>አማርኛ (Amharic)</span>
                  {activeLanguage === 'am' && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#F2C46A] text-[#4C4541] font-bold rounded-lg hover:bg-[#E5B558] cursor-pointer mt-1"
              >
                Update Password
              </button>
            </form>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-2">
              {[
                { label: 'Full Name', val: ceoName, set: setCeoName, type: 'text' },
                { label: 'Email', val: ceoEmail, set: setCeoEmail, type: 'email' },
                { label: 'Phone', val: ceoPhone, set: setCeoPhone, type: 'tel' }
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 bg-[#F2C46A] text-[#4C4541] font-bold rounded-lg hover:bg-[#E5B558] cursor-pointer mt-2"
              >
                Save Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
