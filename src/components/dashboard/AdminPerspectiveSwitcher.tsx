import React from 'react';
import { useTranslation } from 'react-i18next';

export type DashboardPerspective = 'master' | 'hr' | 'finance' | 'store' | 'operations';

interface AdminPerspectiveSwitcherProps {
  activePerspective: DashboardPerspective;
  onSelectPerspective: (perspective: DashboardPerspective) => void;
  roleTitle?: string;
}

const PERSPECTIVES: DashboardPerspective[] = [
  'master',
  'hr',
  'finance',
  'store',
  'operations'
];

export const AdminPerspectiveSwitcher: React.FC<AdminPerspectiveSwitcherProps> = ({
  activePerspective,
  onSelectPerspective
}) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label="Department view"
      className="rounded-xl border border-[#EFE7D8] bg-[#FCF0DA]/30 p-3.5 dark:border-[#3D3633] dark:bg-slate-900/40"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {t('dashboard.perspectiveSwitcher')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dashboard.previewNotice')}
          </p>
        </div>

        {activePerspective !== 'master' && (
          <button
            type="button"
            onClick={() => onSelectPerspective('master')}
            className="self-start sm:self-auto rounded-lg border border-[#EFE7D8] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            {t('dashboard.resetToMaster')}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[#EFE7D8] dark:border-slate-800">
        {PERSPECTIVES.map((id) => {
          const isSelected = activePerspective === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectPerspective(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#F2C46A] text-[#4C4541] font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t(`dashboard.perspectives.${id}` as any)}
            </button>
          );
        })}
      </div>
    </section>
  );
};
