import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Plus,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { WorkExperienceRecord, Employee } from '../types/hrm';

interface WorkExperienceViewProps {
  records: WorkExperienceRecord[];
  employees: Employee[];
  onGenerateCertificate: (record: WorkExperienceRecord) => void;
}

export const WorkExperienceView: React.FC<WorkExperienceViewProps> = ({
  records,
  employees,
  onGenerateCertificate
}) => {
  const [selectedRecord, setSelectedRecord] = useState<WorkExperienceRecord | null>(records[0] || null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // New Certificate Form
  const [employeeId, setEmployeeId] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Security Guard');
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState('2026-10-01');
  const [sitesServed, setSitesServed] = useState('Commercial Bank of Ethiopia Tower (HQ), Bole Medhanialem Commercial Complex');
  const [certifications, setCertifications] = useState('Basic Fire Safety & Evacuation Protocol, Corporate Access Control');
  const [conduct, setConduct] = useState<'Exceptional' | 'Very Good' | 'Satisfactory'>('Exceptional');

  const selectedEmp = employees.find(e => e.id === employeeId);

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const newRecord: WorkExperienceRecord = {
      id: `wexp-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeCode: selectedEmp.employeeCode,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      serviceType: selectedEmp.serviceType,
      role: roleTitle || selectedEmp.role,
      startDate,
      endDate,
      sitesServed: sitesServed.split(',').map(s => s.trim()),
      certifications: certifications.split(',').map(c => c.trim()),
      conductRating: conduct,
      certificateNumber: `HAB-EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      issuedDate: new Date().toISOString().split('T')[0]
    };

    onGenerateCertificate(newRecord);
    setSelectedRecord(newRecord);
    setIsNewModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Service Credentials
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Work Experience Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official verifiable employment testimonials under Ethiopian Labor Law for active and exiting personnel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Certificate</span>
        </button>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <div key={rec.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {rec.certificateNumber}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    rec.serviceType === 'Security'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
                      : rec.serviceType === 'Cleaning'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                      : 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900'
                  }`}>
                    {rec.serviceType}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    {rec.conductRating}
                  </span>
                </div>
              </div>

              {/* Employee & Role Information */}
              <div>
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">{rec.employeeName}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{rec.role}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{rec.employeeCode}</span>
                </div>
              </div>

              {/* Service Period Timeline */}
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Period: {rec.startDate} → {rec.endDate}</span>
              </div>

              {/* Deployed Facilities */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Deployed Facilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rec.sitesServed.map((site, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{site}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Issued: {rec.issuedDate}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(rec);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#4C4541]" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Official Certificate Document */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print"
            >
              ✕
            </button>

            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="text-xl font-black tracking-wider text-slate-900 uppercase">
                HAB Business PLC
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Corporate Cleaning & Security Operations Management
              </div>
              <div className="text-[11px] text-slate-500">
                Churchill Avenue, Financial District, P.O. Box 24901, Addis Ababa, Ethiopia · Tel: +251 115 500 000
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-4">
                Certificate of Work Experience
              </h2>
              <p className="text-xs font-mono text-slate-500">
                Ref: {selectedRecord.certificateNumber}
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <p className="text-justify indent-6">
                This certifies that <strong className="text-slate-900">{selectedRecord.employeeName}</strong> (Employee ID: <strong className="font-mono text-slate-900">{selectedRecord.employeeCode}</strong>) has been employed by HAB Business PLC in our <strong>{selectedRecord.serviceType} Services Division</strong> from <strong className="font-mono text-slate-900">{selectedRecord.startDate}</strong> to <strong className="font-mono text-slate-900">{selectedRecord.endDate}</strong>.
              </p>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Designation:</span>
                  <span className="font-bold text-slate-900">{selectedRecord.role}</span>
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block mb-0.5">Deployed Client Facilities:</span>
                  <span className="text-slate-800">{selectedRecord.sitesServed.join('; ')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-semibold">Discipline & Conduct:</span>
                  <span className="font-bold text-emerald-800">{selectedRecord.conductRating}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-8 border-t border-slate-300">
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                    Solomon Teshome
                  </div>
                  <div className="text-[11px] text-slate-900 font-bold mt-1">HR Operations Director</div>
                </div>

                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                    Managing Director Seal
                  </div>
                  <div className="text-[11px] text-slate-900 font-bold mt-1">Managing Director</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue New Experience Record */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCertificate} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Generate Service Certificate</h2>
                <p className="text-xs text-slate-500">Formal employment & conduct testimony</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
                <select
                  value={employeeId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setEmployeeId(id);
                    const emp = employees.find(item => item.id === id);
                    if (emp) {
                      setRoleTitle(emp.role);
                      setStartDate(emp.hireDate);
                    }
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                >
                  <option value="">-- Choose employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role Title *</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Sites Served</label>
                <textarea
                  rows={2}
                  value={sitesServed}
                  onChange={(e) => setSitesServed(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!employeeId}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Generate Certificate
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
