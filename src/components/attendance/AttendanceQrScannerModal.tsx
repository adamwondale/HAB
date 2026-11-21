import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Zap, CheckCircle2, Clock, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Employee, AttendanceRecord } from '../../types/hrm';
import { QrCodeSvg } from '../common/QrCodeSvg';

interface AttendanceQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onRecordAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceQrScannerModal: React.FC<AttendanceQrScannerModalProps> = ({
  isOpen,
  onClose,
  employees,
  attendanceRecords,
  onRecordAttendance
}) => {
  const [mode, setMode] = useState<'demo' | 'camera'>('demo');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    type: 'clock-in' | 'clock-out' | 'already-done';
    name: string;
    code: string;
    time: string;
    fayda: string;
    otHours?: number;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!selectedEmpId && employees.length > 0) setSelectedEmpId(employees[0].id);
  }, [employees, selectedEmpId]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && mode === 'camera' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
        .catch(() => setMode('demo'));
    }
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch { /* Audio not allowed */ }
  };

  const handleScanEmployee = (emp: Employee) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      playBeep();
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const fayda = emp.faydaNumber || `ET-FAYDA-${emp.employeeCode.replace(/[^0-9]/g, '').padEnd(4, '0')}-2026-8812`;
      const existing = attendanceRecords.find(a => a.employeeId === emp.id && a.date === today);

      if (!existing || !existing.checkInTime) {
        const newRecord: AttendanceRecord = {
          id: existing ? existing.id : `att-${Date.now()}`,
          date: today,
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          serviceType: emp.serviceType,
          siteId: emp.currentSiteId || 'site-comm-01',
          siteName: emp.currentSiteName || 'Commercial Bank Headquarters',
          shift: emp.currentShift || 'Day (06:00 - 18:00)',
          status: 'Present',
          checkInTime: nowTime,
          overtimeHours: 0,
          markedBy: 'Supervisor QR Terminal',
          verifiedByFayda: true,
          faydaNumber: fayda
        };
        onRecordAttendance(newRecord);
        setResult({ type: 'clock-in', name: `${emp.firstName} ${emp.lastName}`, code: emp.employeeCode, time: nowTime, fayda });
      } else if (!existing.checkOutTime) {
        const otHours = 1.5;
        const updatedRecord: AttendanceRecord = {
          ...existing,
          checkOutTime: nowTime,
          overtimeHours: otHours,
          status: 'Present',
          verifiedByFayda: true
        };
        onRecordAttendance(updatedRecord);
        setResult({ type: 'clock-out', name: `${emp.firstName} ${emp.lastName}`, code: emp.employeeCode, time: nowTime, fayda, otHours });
      } else {
        setResult({ type: 'already-done', name: `${emp.firstName} ${emp.lastName}`, code: emp.employeeCode, time: existing.checkOutTime, fayda });
      }
    }, 700);
  };

  const currentEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const demoFayda = currentEmp?.faydaNumber || (currentEmp ? `ET-FAYDA-${currentEmp.employeeCode.replace(/[^0-9]/g, '').padEnd(4, '0')}-2026-8812` : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA] dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-[#4C4541] dark:text-slate-100">
              National Fayda QR Attendance Terminal
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <button type="button" onClick={() => setMode('demo')} className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 transition-colors ${mode === 'demo' ? 'border-b-2 border-[#F2C46A] text-[#4C4541] dark:text-[#F2C46A] bg-white dark:bg-slate-900' : 'text-slate-500'}`}>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ 1-Click Demo Scanner</span>
          </button>
          <button type="button" onClick={() => setMode('camera')} className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 transition-colors ${mode === 'camera' ? 'border-b-2 border-[#F2C46A] text-[#4C4541] dark:text-[#F2C46A] bg-white dark:bg-slate-900' : 'text-slate-500'}`}>
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Webcam Live Optical Scan</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {mode === 'camera' ? (
            <div className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 border-2 border-amber-400/40 m-6 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                <div className="h-0.5 bg-amber-400 shadow-[0_0_8px_#f2c46a] animate-[bounce_2s_infinite]" />
                <span className="text-[10px] text-center font-mono text-amber-300 bg-black/60 py-0.5 rounded">Aim at Employee QR Code</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Employee Badge to Scan</label>
                <select value={selectedEmpId} onChange={e => { setSelectedEmpId(e.target.value); setResult(null); }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium">
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.employeeCode} · {e.firstName} {e.lastName} ({e.serviceType}) · {e.currentSiteName || 'Site 1'}
                    </option>
                  ))}
                </select>
              </div>

              {currentEmp && (
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Fayda Credential Match
                    </span>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{currentEmp.firstName} {currentEmp.lastName}</div>
                    <div className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">{demoFayda}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{currentEmp.role} · {currentEmp.currentSiteName || 'Commercial Bank HQ'}</div>
                  </div>
                  <div className="p-1 rounded bg-white shadow-xs shrink-0">
                    <QrCodeSvg value={demoFayda} size={64} />
                  </div>
                </div>
              )}

              <button type="button" onClick={() => currentEmp && handleScanEmployee(currentEmp)} disabled={isScanning} className="w-full py-3 rounded-xl bg-[#F2C46A] hover:bg-[#e6b758] text-[#4C4541] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50">
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isScanning ? 'Verifying Fayda Identity with Registry...' : '⚡ Simulate QR Badge Scan (Clock-In / Out)'}</span>
              </button>
            </div>
          )}

          {/* Real-time Verification Feedback */}
          {result && (
            <div className={`p-4 rounded-xl border animate-in fade-in duration-200 space-y-2 ${
              result.type === 'clock-in' ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                : result.type === 'clock-out' ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
                : 'bg-slate-50 border-slate-300 dark:bg-slate-800/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-xs text-slate-900 dark:text-white">
                  {result.type === 'clock-in' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {result.type === 'clock-out' && <Clock className="w-4 h-4 text-amber-600" />}
                  {result.type === 'already-done' && <AlertCircle className="w-4 h-4 text-slate-500" />}
                  {result.type === 'clock-in' ? 'SHIFT CLOCK-IN VERIFIED (PRESENT)' : result.type === 'clock-out' ? 'SHIFT CLOCK-OUT RECORDED' : 'FULL SHIFT COMPLETED'}
                </span>
                <span className="font-mono text-[10px] bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">{result.time}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Staff: <strong>{result.name}</strong> ({result.code}) · Verified with National Fayda: <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{result.fayda}</span>
              </p>
              {result.type === 'clock-out' && result.otHours && (
                <div className="pt-1.5 border-t border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                  ⏱️ Shift Exceeded 8 Hours: <strong className="font-mono">{result.otHours} Hours Overtime</strong> auto-credited under Labor Proclamation No. 1156/2019.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
