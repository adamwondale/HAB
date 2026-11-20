import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Award, Printer, Copy, Check, FileText, Languages, RefreshCw } from 'lucide-react';
import { Employee } from '../../types/hrm';

interface WorkLetterDocumentWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  initialEmployee?: Employee | null;
}

type LetterType = 'experience' | 'clearance' | 'recommendation';
type LangMode = 'en' | 'am';

export const WorkLetterDocumentWriterModal: React.FC<WorkLetterDocumentWriterModalProps> = ({
  isOpen,
  onClose,
  employees,
  initialEmployee
}) => {
  const { t } = useTranslation();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployee?.id || employees[0]?.id || '');
  const [letterType, setLetterType] = useState<LetterType>('experience');
  const [lang, setLang] = useState<LangMode>('en');
  const [letterContent, setLetterContent] = useState('');
  const [refNumber, setRefNumber] = useState(`HAB/HR/${new Date().getFullYear()}/0482`);
  const [copied, setCopied] = useState(false);

  const activeEmp = employees.find(e => e.id === selectedEmpId) || initialEmployee || employees[0];

  const generateTemplateText = (emp: Employee, type: LetterType, l: LangMode) => {
    const today = new Date().toLocaleDateString('en-GB');
    const fayda = emp.faydaNumber || `ET-FAYDA-${emp.employeeCode.replace(/[^0-9]/g, '').padEnd(4, '0')}-2026-8812`;
    const exitDate = emp.exitDetails?.exitDate || today;
    const exitReason = emp.exitDetails?.reason || 'Mutual Separation';

    if (l === 'am') {
      if (type === 'experience') {
        return `ቀን፡ ${today}
የደብዳቤ ቁጥር፡ ${refNumber}

ለሚመለከተው ሁሉ

ጉዳዩ፡ የስራ ልምድ ማስረጃ መስጠትን ይመለከታል

አቶ/ወ/ሮ ${emp.firstName} ${emp.lastName} (የፋይዳ መለያ ቁጥር፡ ${fayda}) በድርጅታችን በኤች.ኤ.ቢ ቢዝነስ ኃ/የተ/የግ/ማህበር (HAB Business PLC) ውስጥ በ${emp.serviceType} የስራ ክፍል በ${emp.role} የስራ መደብ ላይ ከ${emp.hireDate} ጀምሮ እስከ ${exitDate} ድረስ በሙሉ ጊዜ ሰራተኝነት ሲያገለግሉ ቆይተዋል።

በቆይታቸውም የተሰጣቸውን የስራ ኃላፊነት በታማኝነት፣ በትጋትና በጥሩ ስነ-ምግባር አከናውነዋል። አጠቃላይ የወር ደመወዛቸውም ብር ${emp.salary.baseSalary.toLocaleString()} (የኢትዮጵያ ብር) የነበረ ሲሆን፣ የገቢ ግብርና የጡረታ መዋጮ በህጉ መሰረት ተቀናሽ ተደርጎ ገቢ ተደርጓል።

ይህ ማስረጃ የተሰጠው ሰራተኛው በጠየቁት መሰረት ለሚመለከተው አካል እንዲያቀርቡ ነው።

ከሰላምታ ጋር፣
ዳዊት ዮሐንስ
የሰው ኃይል አስተዳደር መምሪያ ኃላፊ
HAB Business PLC`;
      }
      return `ቀን፡ ${today}
የደብዳቤ ቁጥር፡ ${refNumber}

የክሊራንስና የመልቀቂያ ማረጋገጫ የምስክር ወረቀት

ሰራተኛው አቶ/ወ/ሮ ${emp.firstName} ${emp.lastName} (መለያ ቁጥር፡ ${emp.employeeCode}) ከድርጅታችን ጋር የነበራቸውን የስራ ውል በ${exitReason} ምክንያት በማጠናቀቃቸው ምክንያት ከዚህ በታች ከተዘረዘሩት የድርጅቱ የስራ ክፍሎች ሙሉ ክሊራንስ አጠናቀዋል፡
1. የሰው ኃይል መምሪያ (HR Directorate): የተረጋገጠ
2. የእቃ ግምጃ ቤት (Central Store - ዩኒፎርምና መሳሪያዎች): ሙሉ በሙሉ የተመለሰ
3. የፋይናንስና ሂሳብ መምሪያ (Finance - የብድርና የቅድመ ክፍያ ማጣሪያ): የተወራረደ

በመሆኑም ሰራተኛው ከድርጅታችን ጋር ምንም አይነት የንብረትም ሆነ የገንዘብ እዳ የሌለባቸው መሆኑን እናረጋግጣለን።

ከሰላምታ ጋር፣
HAB Business PLC — የሰው ኃይል አስተዳደር`;
    }

    // English
    if (type === 'experience') {
      return `Date: ${today}
Ref: ${refNumber}

TO WHOM IT MAY CONCERN

Subject: Certificate of Service & Work Experience

This is to certify that Ato/W/ro ${emp.firstName} ${emp.lastName} (National Fayda ID: ${fayda}, Staff ID: ${emp.employeeCode}) has been employed with HAB Business PLC serving in the ${emp.serviceType} Division as a full-time ${emp.role} from ${emp.hireDate} to ${exitDate}.

During their period of service, they executed their assigned duties with professional dedication, high vigilance, and strict compliance with our corporate code of conduct. Their last contracted monthly basic salary was ETB ${emp.salary.baseSalary.toLocaleString()}, from which statutory income tax and pension contributions (7%/11%) were remitted in accordance with Ethiopian Labor Proclamation No. 1156/2019.

This certificate of service is issued upon the employee's formal request without any liability on the part of HAB Business PLC.

Sincerely,
Ato Dawit Yohannes
Head of Human Resources & Corporate Compliance
HAB Business PLC`;
    }

    return `Date: ${today}
Ref: ${refNumber}

OFFICIAL EXIT CLEARANCE CERTIFICATE

This is to confirm that ${emp.firstName} ${emp.lastName} (Staff Code: ${emp.employeeCode}, Division: ${emp.serviceType}) has completed all mandatory exit clearances across HAB Business PLC operational departments due to ${exitReason}:
1. HR Records & Personnel Dossier: Cleared
2. Central Store & Tactical Equipment Custody: Uniforms and gear returned in full
3. Finance & Accounts Settlement: Suspense cleared, final severance finalized

The company certifies that the aforementioned employee bears no outstanding financial liabilities or asset obligations toward HAB Business PLC.

Authorized by:
Human Resource Administration Directorate
HAB Business PLC, Addis Ababa, Ethiopia`;
  };

  useEffect(() => {
    if (activeEmp) {
      setLetterContent(generateTemplateText(activeEmp, letterType, lang));
    }
  }, [selectedEmpId, letterType, lang]);

  if (!isOpen || !activeEmp) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>${refNumber}</title><style>body { font-family: sans-serif; white-space: pre-wrap; padding: 40px; font-size: 14px; line-height: 1.6; }</style></head><body>${letterContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Work Letter & Certificate Document Writer
              </h2>
              <p className="text-xs text-slate-500">
                Pre-filled bilingual templates with 100% in-place live editable text and official export
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
              ))}
            </select>

            <select
              value={letterType}
              onChange={e => setLetterType(e.target.value as LetterType)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="experience">Certificate of Service (የስራ ልምድ ማስረጃ)</option>
              <option value="clearance">Exit Clearance Certificate (የክሊራንስ ማስረጃ)</option>
            </select>

            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'en' ? 'English (Switch to አማርኛ)' : 'አማርኛ (Switch to English)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white dark:bg-[#F2C46A] dark:text-[#4C4541] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
          </div>
        </div>

        {/* Live Editable Editor */}
        <div className="p-5 flex-1 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono">Reference: {refNumber}</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">100% In-Place Editable — Click anywhere to customize</span>
          </div>
          <textarea
            rows={15}
            value={letterContent}
            onChange={e => setLetterContent(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-[#F2C46A]/50 focus:border-[#F2C46A] outline-none shadow-inner"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
