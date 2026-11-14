import React, { useState } from 'react';
import { Paperclip, UploadCloud, Calendar, UserCheck, X, FileText, CheckCircle2 } from 'lucide-react';
import { Employee } from '../../types/hrm';

interface AttendanceAttachmentModalProps {
  isOpen: boolean;
  employees: Employee[];
  onClose: () => void;
}

interface AttachedFile {
  name: string;
  size: string;
  uploadedAt: string;
  source: string;
}

export const AttendanceAttachmentModal: React.FC<AttendanceAttachmentModalProps> = ({
  isOpen,
  employees,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'attachment' | 'on_leave'>('attachment');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    {
      name: 'HR_Biometric_Attendance_Tikimt_2019.xlsx',
      size: '2.4 MB',
      uploadedAt: '2026-11-12 09:40 AM',
      source: 'HR Operations (Ato Yohannes)'
    },
    {
      name: 'Shift_Deployment_Exceptions_AddisAbaba.pdf',
      size: '1.1 MB',
      uploadedAt: '2026-11-14 08:15 AM',
      source: 'Site Supervisor Desk'
    }
  ]);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Simulated employees currently on approved leave
  const onLeaveEmployees = employees.slice(0, 3).map((emp, idx) => ({
    ...emp,
    leaveType: idx === 0 ? 'Annual Leave' : idx === 1 ? 'Sick Leave' : 'Maternity / Paternity',
    startDate: '2026-11-01',
    endDate: '2026-11-18',
    approvedDays: idx === 0 ? 14 : 7,
    payrollImpact: idx === 1 ? 'Full Base (Covered)' : 'Standard Monthly'
  }));

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile: AttachedFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Finance Attachment Desk'
      };
      setAttachedFiles([newFile, ...attachedFiles]);
      setUploadNotice(`Successfully attached ${file.name} for payroll auditing.`);
      setTimeout(() => setUploadNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#F2C46A]" />
              <span>HR Attendance & On-Leave Employee Integration</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cross-verify monthly attendance sheets and approved leave deductions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('attachment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'attachment'
                ? 'bg-[#F2C46A] text-[#4C4541]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Attendance Attachments ({attachedFiles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('on_leave')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'on_leave'
                ? 'bg-[#F2C46A] text-[#4C4541]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Employees on Leave ({onLeaveEmployees.length})
          </button>
        </div>

        {activeTab === 'attachment' ? (
          <div className="space-y-3 text-xs">
            {uploadNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{uploadNotice}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-[#EFE7D8] dark:border-slate-700 rounded-xl p-5 text-center bg-[#FCF0DA]/30 dark:bg-slate-800/40">
              <UploadCloud className="w-8 h-8 text-[#4C4541]/70 mx-auto mb-2" />
              <label className="cursor-pointer font-bold text-[#4C4541] hover:underline">
                <span>Upload HR Attendance Roster (Excel / PDF / CSV)</span>
                <input type="file" className="hidden" onChange={handleSimulateUpload} />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports biometric attendance logs, overtime slips, and site attendance sheets
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 block text-xs">Attached HR Rosters:</span>
              {attachedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{f.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {f.size} · From {f.source}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{f.uploadedAt}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500 text-[11px]">
              Employees on active approved leave during this payroll cycle. Use this to verify deduction accuracy.
            </p>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF0DA] text-[#4C4541] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Employee</th>
                    <th className="py-2 px-3">Leave Type</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Days</th>
                    <th className="py-2 px-3">Payroll Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {onLeaveEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {emp.firstName} {emp.lastName}
                        <div className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</div>
                      </td>
                      <td className="py-2 px-3 text-slate-700">{emp.leaveType}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                        {emp.startDate} to {emp.endDate}
                      </td>
                      <td className="py-2 px-3 font-bold font-mono text-amber-700">{emp.approvedDays}d</td>
                      <td className="py-2 px-3 text-emerald-700 font-semibold">{emp.payrollImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
