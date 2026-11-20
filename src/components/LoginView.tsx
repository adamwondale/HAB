import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';
import { authenticate, accountToManagementPerson, setActiveSession } from '../utils/authStorage';
import { AlertCircle, Languages } from 'lucide-react';

interface LoginViewProps {
  managementPersons?: ManagementPerson[];
  onLogin: (user: ManagementPerson) => void;
}

interface QuickFillRole {
  roleId: string;
  labelKey: string;
  username: string;
  hint: string;
}

const QUICK_FILL_ROLES: QuickFillRole[] = [
  { roleId: 'admin', labelKey: 'masterSetup.superAdmin', username: 'admin', hint: 'All access' },
  { roleId: 'hr', labelKey: 'masterSetup.hrOfficer', username: 'hr', hint: 'Staff & hiring' },
  { roleId: 'finance', labelKey: 'masterSetup.financeOfficer', username: 'finance', hint: 'Payroll & tax' },
  { roleId: 'store', labelKey: 'masterSetup.storekeeper', username: 'store', hint: 'Supplies & gear' },
  { roleId: 'operations', labelKey: 'masterSetup.operationsOfficer', username: 'operations', hint: 'Work sites' },
  { roleId: 'ceo', labelKey: 'masterSetup.ceoRole', username: 'ceo', hint: 'Overview' }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t, i18n } = useTranslation();
  const [identifier, setIdentifier] = useState<string>('admin');
  const [password, setPassword] = useState<string>('hab2026');
  const [error, setError] = useState<string | null>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'am' ? 'en' : 'am';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('hab_language', nextLang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError(t('masterSetup.invalidCredentials'));
      return;
    }

    const matchedAccount = authenticate(cleanIdentifier, password);
    if (!matchedAccount) {
      setError(t('masterSetup.invalidCredentials'));
      return;
    }

    setActiveSession(matchedAccount);
    onLogin(accountToManagementPerson(matchedAccount));
  };

  const handleQuickFill = (username: string) => {
    setIdentifier(username);
    setPassword('hab2026');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white select-none">
      {/* Left Split Panel - Warm Linen (#FCF0DA) */}
      <div className="w-full lg:w-[44%] min-h-[540px] lg:min-h-screen bg-[#FCF0DA] flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 py-12 text-[#4C4541] relative">
        {/* Language switch */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-xs font-semibold text-[#4C4541] border border-[#EFE7D8] shadow-2xs transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{i18n.language === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>
        </div>

        <div className="w-full max-w-[380px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#4C4541] tracking-tight">
              {t('masterSetup.loginTitle')}
            </h1>
            <p className="text-xs text-[#4C4541]/70 mt-1.5">
              {t('masterSetup.loginSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="workspace-identifier"
                className="block text-xs font-semibold text-[#4C4541] mb-1.5"
              >
                {t('masterSetup.username')}
              </label>
              <input
                id="workspace-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('masterSetup.usernamePlaceholder')}
                required
                className="w-full bg-white text-[#4C4541] placeholder-[#8C847E] rounded-lg px-3.5 py-2.5 text-sm border border-[#EFE7D8] focus:outline-none focus:ring-2 focus:ring-[#F2C46A] shadow-xs"
              />
            </div>

            <div>
              <label
                htmlFor="workspace-password"
                className="block text-xs font-semibold text-[#4C4541] mb-1.5"
              >
                {t('masterSetup.password')}
              </label>
              <input
                id="workspace-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white text-[#4C4541] placeholder-[#8C847E] rounded-lg px-3.5 py-2.5 text-sm border border-[#EFE7D8] focus:outline-none focus:ring-2 focus:ring-[#F2C46A] shadow-xs"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#F2C46A] hover:bg-[#E5B558] active:scale-[0.99] text-[#4C4541] font-bold py-2.5 rounded-lg text-sm transition-all shadow-xs cursor-pointer border border-[#E5B558]"
            >
              {t('masterSetup.signIn')}
            </button>
          </form>

          {/* Quick-fill Helper */}
          <div className="mt-8 pt-6 border-t border-[#EAE0CD]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#4C4541]">
                {t('masterSetup.quickRoleFill')}
              </span>
              <span className="text-[11px] text-[#4C4541]/70 font-mono">
                {t('masterSetup.defaultPasswordHint')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_FILL_ROLES.map((r) => {
                const isCurrent = identifier.toLowerCase() === r.username;
                return (
                  <button
                    key={r.roleId}
                    type="button"
                    onClick={() => handleQuickFill(r.username)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-[#F2C46A] text-[#4C4541] border-[#E5B558] font-semibold'
                        : 'bg-white/80 hover:bg-white text-[#4C4541] border-[#EFE7D8]'
                    }`}
                  >
                    <div className="truncate leading-tight font-semibold">{t(r.labelKey as any)}</div>
                    <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{r.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Split Panel - Clean HAB identity */}
      <div className="w-full lg:w-[56%] flex-1 bg-white flex flex-col items-center justify-center p-8 sm:p-16 relative overflow-hidden">
        <div className="w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] rounded-full bg-[#FDFBF7] border border-[#EFE7D8] flex flex-col items-center justify-center p-6 sm:p-10">
          <HabMonogramIcon className="w-36 h-36 sm:w-52 sm:h-52" forceBlack />
          <div className="mt-3 text-center">
            <div className="text-lg sm:text-[23px] font-bold text-[#4C4541] tracking-tight leading-snug">
              ሀብ ቢዝነስ ኃላ/የተ/የግል/ማህበር
            </div>
            <div className="text-xl sm:text-[24px] font-bold text-[#4C4541] tracking-wide leading-tight mt-0.5">
              HAB BUSINESS PLC
            </div>
            <p className="mx-auto mt-3 max-w-xs text-xs font-medium leading-5 text-slate-500">
              Staff, payroll, and company supplies management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
