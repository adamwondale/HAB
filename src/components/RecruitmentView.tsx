import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { Candidate, Employee } from '../types/hrm';
import { INITIAL_EMPLOYEES } from '../data/mockData';
import { AssignedEmployeeModal } from './recruitment/AssignedEmployeeModal';
import { DocumentGeneratorModal } from './recruitment/DocumentGeneratorModal';
import { NewApplicantModal } from './recruitment/NewApplicantModal';
import { ApplicantDossierModal } from './recruitment/ApplicantDossierModal';
import { CandidateIntakeGrid } from './recruitment/CandidateIntakeGrid';
import { ProbationRosterTables } from './recruitment/ProbationRosterTables';

interface RecruitmentViewProps {
  candidates: Candidate[];
  employees?: Employee[];
  onUpdateCandidateStage: (candidateId: string, nextStage: Candidate['stage']) => void;
  onSendToOnboarding: (candidate: Candidate) => void;
  onAddCandidate: (newCandidate: Candidate) => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({
  candidates,
  employees = INITIAL_EMPLOYEES,
  onUpdateCandidateStage,
  onSendToOnboarding,
  onAddCandidate
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'intake' | 'probation' | 'finished'>('intake');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<Candidate | null>(null);
  const [selectedAssignedEmp, setSelectedAssignedEmp] = useState<Employee | null>(null);
  const [selectedDocEmp, setSelectedDocEmp] = useState<Employee | null>(null);

  const probationCount = employees.filter(e => e.status === 'Probation' || e.grade === 'L1').length;
  const finishedCount = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FCF0DA] text-[#4C4541] border border-[#F2C46A]/50 dark:bg-slate-800 dark:text-[#F2C46A]">
              {t('recruitment.talentAcquisition')}
            </span>
            <span className="text-xs text-slate-500">{t('recruitment.universalIntake')}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white mt-1">
            {t('recruitment.hubTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('recruitment.hubSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('recruitment.newApplicant')}</span>
        </button>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('intake')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
            activeTab === 'intake' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
          }`}
        >
          {t('recruitment.applicantIntake')} ({candidates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('probation')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
            activeTab === 'probation' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
          }`}
        >
          {t('recruitment.probationStage')} ({probationCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('finished')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
            activeTab === 'finished' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
          }`}
        >
          {t('recruitment.finishedProbation')} ({finishedCount} {t('recruitment.confirmed')})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'intake' && (
        <CandidateIntakeGrid
          candidates={candidates}
          onAdvanceStage={onUpdateCandidateStage}
          onSendToOnboarding={onSendToOnboarding}
          onPreviewDossier={setSelectedDossier}
        />
      )}

      {(activeTab === 'probation' || activeTab === 'finished') && (
        <ProbationRosterTables
          mode={activeTab}
          employees={employees}
          onInspectAssignment={setSelectedAssignedEmp}
          onGenerateDoc={setSelectedDocEmp}
        />
      )}

      {/* Modals */}
      <NewApplicantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCandidate={onAddCandidate}
        existingCount={candidates.length}
      />

      <ApplicantDossierModal
        candidate={selectedDossier}
        isOpen={Boolean(selectedDossier)}
        onClose={() => setSelectedDossier(null)}
      />

      <AssignedEmployeeModal
        employee={selectedAssignedEmp}
        isOpen={Boolean(selectedAssignedEmp)}
        onClose={() => setSelectedAssignedEmp(null)}
      />

      <DocumentGeneratorModal
        employee={selectedDocEmp}
        isOpen={Boolean(selectedDocEmp)}
        onClose={() => setSelectedDocEmp(null)}
      />
    </div>
  );
};
