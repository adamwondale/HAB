import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Award, Star, MessageSquare, AlertTriangle, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { Employee, EmployeeKpiRating, KpiActionFlag } from '../../types/hrm';

interface EmployeeKpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSaveKpi: (employeeId: string, kpi: EmployeeKpiRating) => void;
}

export const EmployeeKpiModal: React.FC<EmployeeKpiModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSaveKpi
}) => {
  const { t } = useTranslation();
  const [attendanceScore, setAttendanceScore] = useState<number>(95);
  const [customerScore, setCustomerScore] = useState<number>(5);
  const [comments, setComments] = useState<string>('');

  useEffect(() => {
    if (employee?.kpiRating) {
      setAttendanceScore(employee.kpiRating.attendanceScore);
      setCustomerScore(employee.kpiRating.customerScore);
      setComments(employee.kpiRating.evaluatorNotes || '');
    } else {
      setAttendanceScore(95);
      setCustomerScore(4.5);
      setComments('Client site supervisor praised punctual reporting and diligent asset protection.');
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  // Automated KPI formula: (0.5 * Attendance %) + (0.5 * (Customer Score / 5 * 100))
  const customerPct = (customerScore / 5) * 100;
  const compositeScore = Math.round((0.5 * attendanceScore) + (0.5 * customerPct));

  let flag: KpiActionFlag = 'On Track';
  if (compositeScore >= 90 && customerScore >= 4) {
    flag = 'Give Raise';
  } else if (compositeScore < 60 || customerScore <= 2) {
    flag = 'Warning';
  } else if (compositeScore < 75 || customerScore < 3.5) {
    flag = 'Assign Training';
  } else {
    flag = 'On Track';
  }

  const handleSave = () => {
    const updatedKpi: EmployeeKpiRating = {
      attendanceScore,
      customerScore,
      compositeScore,
      flag,
      lastEvaluated: new Date().toISOString().slice(0, 10),
      evaluatorNotes: comments
    };
    onSaveKpi(employee.id, updatedKpi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Employee KPI & Client Feedback Evaluation
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {employee.firstName} {employee.lastName} · {employee.employeeCode}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Live Outcome Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            flag === 'Give Raise'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : flag === 'Assign Training'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : flag === 'Warning'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
          }`}>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Automated Action Flag</span>
              <div className="text-lg font-bold flex items-center gap-2 mt-0.5">
                {flag === 'Give Raise' && <TrendingUp className="w-5 h-5 text-emerald-600" />}
                {flag === 'Assign Training' && <BookOpen className="w-5 h-5 text-amber-600" />}
                {flag === 'Warning' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                {flag === 'On Track' && <CheckCircle className="w-5 h-5 text-slate-600" />}
                <span>{flag}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Composite KPI</span>
              <div className="text-2xl font-mono font-bold">{compositeScore}%</div>
            </div>
          </div>

          {/* Metric 1: Attendance Score */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Attendance Rate (% of working days)</label>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{attendanceScore}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={attendanceScore}
              onChange={(e) => setAttendanceScore(Number(e.target.value))}
              className="w-full accent-[#F2C46A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>50% (Frequent Absences)</span>
              <span>100% (Perfect Record)</span>
            </div>
          </div>

          {/* Metric 2: Customer Rating (1-5) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Customer Comment / Site Feedback Score (1 - 5)</label>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {customerScore.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setCustomerScore(score)}
                  className={`py-2 text-center rounded-lg border font-bold cursor-pointer transition-all ${
                    customerScore === score
                      ? 'border-[#F2C46A] bg-[#FCF0DA] text-[#4C4541] shadow-xs dark:bg-slate-800 dark:text-[#F2C46A]'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {score} {score === 5 ? '★ (Top)' : score === 1 ? '★ (Poor)' : '★'}
                </button>
              ))}
            </div>
          </div>

          {/* Metric 3: Written Customer Comments */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Customer & Supervisor Feedback Notes
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record feedback from client facility manager or site inspection logs..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
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
            Save KPI & Apply Flag
          </button>
        </div>
      </div>
    </div>
  );
};
