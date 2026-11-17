import { AuditLogEntry } from '../types/audit';

const AUDIT_STORAGE_KEY = 'hab_audit_logs_v1';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-17T09:15:22.000Z',
    actorId: 'admin',
    actorName: 'Ato Hailemariam Bekele',
    actorRole: 'super_admin',
    action: 'CREATE_DIVISION',
    targetModule: 'Divisions',
    targetId: 'div-head-office',
    newValue: 'Head Office Staff (Active)',
    details: 'Created core organizational division Head Office Staff with code HOS',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-17T09:45:10.000Z',
    actorId: 'finance',
    actorName: 'W/ro Meron Tadesse',
    actorRole: 'finance',
    action: 'APPROVE_PAYROLL',
    targetModule: 'Payroll',
    targetId: 'batch-2026-10',
    previousValue: 'Draft (Pending)',
    newValue: 'Approved',
    details: 'Approved 30-day salary batch calculation with 11% non-deductible employer pension',
    status: 'SUCCESS'
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-17T10:12:04.000Z',
    actorId: 'store',
    actorName: 'Ato Girma Wolde',
    actorRole: 'store',
    action: 'RECORD_STOCK_MOVEMENT',
    targetModule: 'Store',
    targetId: 'STK-SEC-001',
    previousValue: '46 Sets',
    newValue: '42 Sets',
    details: 'Issued 4 sets Tactical Security Uniforms to CBE Tower Guard Squad',
    status: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-17T10:30:15.000Z',
    actorId: 'hr',
    actorName: 'Ato Dawit Yohannes',
    actorRole: 'hr',
    action: 'REASSIGN_EMPLOYEE_DIVISION',
    targetModule: 'Divisions',
    targetId: 'EMP-004',
    previousValue: 'Cleaning',
    newValue: 'Property Management',
    details: 'Transferred site maintenance technician to Property Management division',
    status: 'SUCCESS'
  }
];

export function getStoredAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined' || !window.localStorage) return INITIAL_AUDIT_LOGS;
  try {
    const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_AUDIT_LOGS;
  } catch (err) {
    console.error('Failed reading audit logs', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAuditEvent(
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString()
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existing = getStoredAuditLogs();
      const updated = [newEntry, ...existing].slice(0, 500); // keep last 500
      window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed appending audit log', err);
    }
  }

  return newEntry;
}
