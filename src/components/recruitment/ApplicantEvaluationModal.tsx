import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, Star, Award, CheckCircle, FileText } from 'lucide-react';
import { Candidate } from '../../types/hrm';

interface ApplicantEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onSaveEvaluation: (candidateId: string, updates: Partial<Candidate>) => void;
}

export const ApplicantEvaluationModal: React.FC<ApplicantEvaluationModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSaveEvaluation
}) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [backgroundNotes, setBackgroundNotes] = useState('');
  const [recommendation, setRecommendation] = useState<'Offer Issued' | 'Interview' | 'Rejected'>('Offer Issued');

  const getQuestions = () => {
    if (!candidate) return [];
    if (candidate.targetService === 'Security') {
      return [
        { id: 'fitness', label: 'Physical Endurance & Tactical Stature', desc: 'Military drill posture, obstacle endurance, and body fitness' },
        { id: 'vigilance', label: 'Vigilance & Perimeter Alertness', desc: 'Situational awareness, gate access monitoring and patrol diligence' },
        { id: 'discipline', label: 'Disciplinary Record & Background', desc: 'Prior military/police clearance, clean conduct, and obedience' },
        { id: 'deescalation', label: 'Conflict De-escalation & Comms', desc: 'Public interaction diplomacy and incident reporting' }
      ];
    }
    if (candidate.targetService === 'Cleaning') {
      return [
        { id: 'sanitization', label: 'Hospital & Janitorial Sanitization', desc: 'Floor care, surface disinfection and sterile room cleaning' },
        { id: 'chemicals', label: 'Chemical Safety & Dilution Protocol', desc: 'Handling hazardous agents, detergents, and PPE compliance' },
        { id: 'speed', label: 'Execution Speed & Reliability', desc: 'Meeting strict commercial building cleaning SLAs and shift punctuality' },
        { id: 'thoroughness', label: 'Waste Handling & Deep Detailing', desc: 'Restroom deep scrubbing, glass washing, and safe trash disposal' }
      ];
    }
    return [
      { id: 'technical', label: 'Technical Facility Diagnostics', desc: 'HVAC, electrical breakers, backup generator, plumbing repairs' },
      { id: 'safety', label: 'Occupational Health & Safety', desc: 'Tool maintenance, fire safety guidelines, and emergency shutoff' },
      { id: 'tenant', label: 'Tenant SLA & Tenant Interaction', desc: 'Courteous customer service and resolution speed' },
      { id: 'initiative', label: 'Preventive Maintenance Routine', desc: 'Equipment logging, spare parts request, and regular inspections' }
    ];
  };

  const questions = getQuestions();

  useEffect(() => {
    if (candidate) {
      const initial: Record<string, number> = {};
      questions.forEach(q => { initial[q.id] = 4; });
      setScores(initial);
      setBackgroundNotes(candidate.backgroundHistory || candidate.notes || 'Vetted with Kebele residence certificate and police clearance.');
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const totalPossible = questions.length * 5;
  const currentTotal = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const percentageScore = totalPossible ? Math.round((currentTotal / totalPossible) * 100) : 80;

  const handleScoreChange = (qId: string, val: number) => {
    setScores(prev => ({ ...prev, [qId]: val }));
  };

  const handleSave = () => {
    onSaveEvaluation(candidate.id, {
      interviewScore: percentageScore,
      questionnaireScore: percentageScore,
      questionnaireAnswers: scores,
      backgroundHistory: backgroundNotes,
      stage: recommendation
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {candidate.targetService} Candidate Assessment
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {candidate.fullName} · {candidate.candidateCode} · {candidate.targetRole}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Candidate Suitability Score Banner */}
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                Evaluation Suitability Rating
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {percentageScore >= 80 ? 'Highly Recommended' : percentageScore >= 65 ? 'Qualified with Training' : 'Requires Review'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">{percentageScore}%</div>
              <span className="text-[10px] text-slate-500">{currentTotal} / {totalPossible} pts</span>
            </div>
          </div>

          {/* Division Specific Questions */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              {candidate.targetService} Standard Evaluation Matrix
            </h3>
            {questions.map((q) => (
              <div key={q.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">{q.label}</span>
                    <span className="text-[10px] text-slate-500">{q.desc}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs shrink-0 ml-2">
                    {scores[q.id] || 4} / 5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(q.id, val)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        (scores[q.id] || 4) === val
                          ? 'bg-[#4C4541] text-white dark:bg-[#F2C46A] dark:text-[#4C4541]'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {val}★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Background Check Notes */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Background Vetting & Guarantor Notes
            </label>
            <textarea
              rows={2}
              value={backgroundNotes}
              onChange={(e) => setBackgroundNotes(e.target.value)}
              placeholder="Record police clearance certificate ID, notarized guarantor check, residential history..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          {/* Stage Recommendation */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Hiring Stage Recommendation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Offer Issued', 'Interview', 'Rejected'] as const).map((stg) => (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setRecommendation(stg)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                    recommendation === stg
                      ? 'border-[#F2C46A] bg-[#FCF0DA] text-[#4C4541] font-bold dark:bg-slate-800 dark:text-[#F2C46A]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white dark:bg-[#F2C46A] dark:text-[#4C4541] dark:hover:opacity-90 shadow-xs cursor-pointer"
          >
            Submit Score & Update Stage
          </button>
        </div>
      </div>
    </div>
  );
};
