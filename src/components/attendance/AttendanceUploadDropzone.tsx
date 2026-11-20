import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';

interface AttendanceUploadDropzoneProps {
  onUploadComplete?: (fileName: string) => void;
}

export const AttendanceUploadDropzone: React.FC<AttendanceUploadDropzoneProps> = ({
  onUploadComplete
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; timestamp: string }>
  >([
    { name: 'Scan_Bole_Attendance_Sheet_2026-11-20.pdf', size: '1.2 MB', timestamp: '2026-11-20 08:30' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      setUploadedFiles((prev) => [newFile, ...prev]);
      setIsUploading(false);
      onUploadComplete?.(file.name);
    }, 700);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-900/40 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200">
          <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Attachment of Attendance &mdash; Physical Scan Dropzone</span>
        </div>
        <span className="text-[10px] text-blue-700 dark:text-blue-300 font-mono">
          Accepts Scanned Sheets (PDF / JPG / PNG)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Upload box */}
        <label className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition-colors">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleSimulateUpload}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 font-bold">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Scanning physical logsheet...</span>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Click or drag scanned sheet here
              </p>
              <p className="text-[9.5px] text-slate-500">Auto-links to daily attendance verification record</p>
            </div>
          )}
        </label>

        {/* Uploaded attachments list */}
        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
          {uploadedFiles.map((f, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-white block truncate text-[11px]">
                    {f.name}
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-400">
                    {f.size} · Uploaded {f.timestamp}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
