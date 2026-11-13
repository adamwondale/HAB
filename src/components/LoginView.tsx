import React, { useState } from 'react';
import { ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';
import { authenticate, accountToManagementPerson, setActiveSession } from '../utils/authStorage';
import { ShieldCheck, Eye, Users, DollarSign, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  managementPersons?: ManagementPerson[];
  onLogin: (user: ManagementPerson) => void;
}

interface QuickFillRole {
  roleId: string;
  label: string;
  username: string;
  icon: React.ComponentType<{ className?: string }>;
  roleHint: string;
}

const QUICK_FILL_ROLES: QuickFillRole[] = [
  { roleId: 'admin', label: 'Admin', username: 'admin', icon: ShieldCheck, roleHint: 'Super Admin' },
  { roleId: 'ceo', label: 'CEO', username: 'ceo', icon: Eye, roleHint: 'Executive' },
  { roleId: 'hr', label: 'HR', username: 'hr', icon: Users, roleHint: 'Operations' },
  { roleId: 'finance', label: 'Finance', username: 'finance', icon: DollarSign, roleHint: 'Payroll' }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState<string>('admin');
  const [password, setPassword] = useState<string>('hab2026');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError('Invalid username or password. Please verify your credentials.');
      return;
    }

    const matchedAccount = authenticate(cleanIdentifier, password);
    if (!matchedAccount) {
      setError('Invalid username or password. Please verify your credentials.');
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
      <div className="w-full lg:w-[44%] min-h-[540px] lg:min-h-screen bg-[#FCF0DA] flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 py-12 text-[#4C4541]">
        <div className="w-full max-w-[380px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#4C4541] tracking-tight">
              Sign in to HAB records
            </h1>
            <p className="text-xs text-[#4C4541]/70 mt-1.5">
              Enter your credentials to access company records
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="workspace-identifier"
                className="block text-xs font-bold text-[#4C4541] uppercase tracking-wider mb-1.5"
              >
                Username or Corporate Email
              </label>
              <input
                id="workspace-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin, ceo, hr, or finance"
                required
                className="w-full bg-white text-[#4C4541] placeholder-[#8C847E] rounded-lg px-3.5 py-2.5 text-sm border border-[#EFE7D8] focus:outline-none focus:ring-2 focus:ring-[#F2C46A] shadow-xs"
              />
            </div>

            <div>
              <label
                htmlFor="workspace-password"
                className="block text-xs font-bold text-[#4C4541] uppercase tracking-wider mb-1.5"
              >
                Password
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
              className="w-full bg-[#F2C46A] hover:bg-[#E5B558] active:scale-[0.99] text-[#4C4541] font-bold py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer border border-[#E5B558]"
            >
              Sign In
            </button>
          </form>

          {/* Quick-fill Helper Chips */}
          <div className="mt-8 pt-6 border-t border-[#EAE0CD]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4C4541]/75">
                Quick-fill helper chips
              </span>
              <span className="text-[10px] text-[#4C4541]/60 font-mono">
                default: hab2026
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_FILL_ROLES.map((r) => {
                const Icon = r.icon;
                const isCurrent = identifier.toLowerCase() === r.username;
                return (
                  <button
                    key={r.roleId}
                    type="button"
                    onClick={() => handleQuickFill(r.username)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all border text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-[#F2C46A] text-[#4C4541] border-[#E5B558] shadow-xs'
                        : 'bg-white/80 hover:bg-white text-[#4C4541] border-[#EFE7D8] hover:border-[#F2C46A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-[#4C4541]" />
                    <div className="min-w-0">
                      <div className="font-bold truncate leading-tight">{r.label}</div>
                      <div className="text-[10px] opacity-75 truncate leading-tight font-normal">{r.roleHint}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Split Panel - HAB identity & promise */}
      <div className="w-full lg:w-[56%] flex-1 bg-white flex flex-col items-center justify-center p-8 sm:p-16 relative overflow-hidden">
        <div className="w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-b from-[#F5F6F7]/90 via-white to-[#F5F6F7]/60 border border-slate-100 shadow-[0_8px_60px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-6 sm:p-10">
          <HabMonogramIcon className="w-36 h-36 sm:w-52 sm:h-52" forceBlack />
          <div className="mt-3 text-center">
            <div className="text-lg sm:text-[23px] font-black text-black tracking-tight leading-snug">
              ሀብ ቢዝነስ ኃላ/የተ/የግል/ማህበር
            </div>
            <div className="text-xl sm:text-[26px] font-black text-black tracking-wide leading-tight mt-0.5">
              HAB BUSINESS PLC
            </div>
            <p className="mx-auto mt-4 max-w-xs text-sm font-medium leading-6 text-slate-600">
              One place for employee, pay, and company property records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
