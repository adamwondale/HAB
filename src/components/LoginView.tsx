import React, { useState } from 'react';
import { ManagementPerson } from '../types/hrm';
import { HabMonogramIcon } from './HabLogo';

interface LoginViewProps {
  managementPersons: ManagementPerson[];
  onLogin: (user: ManagementPerson) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  managementPersons,
  onLogin
}) => {
  const defaultUser = managementPersons.find(p => p.id === 'mgmt-hr-head') || managementPersons[0];
  const [email, setEmail] = useState<string>(defaultUser?.email || 'hr.head@hab-business.com');
  const [password, setPassword] = useState<string>('hab2026');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your workspace email address.');
      return;
    }

    // Match by email or by keywords
    const matchedByEmail = managementPersons.find(
      p => p.email.toLowerCase() === normalizedEmail
    );

    const matchedByKeyword = managementPersons.find(p => {
      if (normalizedEmail.includes('ceo') || normalizedEmail.includes('hailemariam')) return p.id === 'mgmt-ceo';
      if (normalizedEmail.includes('fin') || normalizedEmail.includes('meron') || normalizedEmail.includes('payroll')) return p.id === 'mgmt-fin-head';
      if (normalizedEmail.includes('store') || normalizedEmail.includes('stock') || normalizedEmail.includes('girma')) return p.id === 'mgmt-storekeeper';
      if (normalizedEmail.includes('talent') || normalizedEmail.includes('henok') || normalizedEmail.includes('recruit')) return p.id === 'mgmt-hr-talent';
      if (normalizedEmail.includes('hr.ops') || normalizedEmail.includes('selamawit')) return p.id === 'mgmt-hr-ops';
      if (normalizedEmail.includes('ops') || normalizedEmail.includes('solomon')) return p.id === 'mgmt-ops-head';
      if (normalizedEmail.includes('sup') || normalizedEmail.includes('daniel')) return p.id === 'mgmt-supervisor-dan';
      if (normalizedEmail.includes('legal') || normalizedEmail.includes('tigist')) return p.id === 'mgmt-legal';
      if (normalizedEmail.includes('hr') || normalizedEmail.includes('dawit')) return p.id === 'mgmt-hr-head';
      return false;
    });

    const selectedPerson =
      matchedByEmail ||
      matchedByKeyword ||
      defaultUser;

    onLogin(selectedPerson);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white select-none">
      {/* Left Split Panel - Warm Linen (#FCF0DA) */}
      <div className="w-full lg:w-[44%] min-h-[540px] lg:min-h-screen bg-[#FCF0DA] flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 py-12 text-[#4C4541]">
        <div className="w-full max-w-[360px]">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#4C4541] text-center mb-10 tracking-tight">
            Sign in to HAB records
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="workspace-email"
                className="block text-sm font-semibold text-[#4C4541] mb-2"
              >
                Email
              </label>
              <input
                id="workspace-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white text-[#4C4541] placeholder-[#8C847E] rounded-md px-3.5 py-2.5 text-sm border border-[#EFE7D8] focus:outline-none focus:ring-2 focus:ring-[#F2C46A]/50 shadow-xs"
              />
            </div>

            <div>
              <label
                htmlFor="workspace-password"
                className="block text-sm font-semibold text-[#4C4541] mb-2"
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
                className="w-full bg-white text-[#4C4541] placeholder-[#8C847E] rounded-md px-3.5 py-2.5 text-sm border border-[#EFE7D8] focus:outline-none focus:ring-2 focus:ring-[#F2C46A]/50 shadow-xs"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-700 bg-white/70 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#F2C46A] hover:bg-[#E5B558] active:scale-[0.99] text-[#4C4541] font-bold py-3 rounded-full text-sm transition-all shadow-md cursor-pointer"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Right Split Panel - HAB identity and a short product promise */}
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
