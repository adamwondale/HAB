export type AuditActionType =
  | 'CREATE_DIVISION'
  | 'UPDATE_DIVISION'
  | 'TOGGLE_DIVISION_STATUS'
  | 'REASSIGN_EMPLOYEE_DIVISION'
  | 'APPROVE_PAYROLL'
  | 'DISBURSE_PAYROLL'
  | 'MODIFY_SALARY_RECORD'
  | 'RECORD_STOCK_MOVEMENT'
  | 'ALLOCATE_EQUIPMENT'
  | 'RETURN_EQUIPMENT'
  | 'WRITE_OFF_ITEM'
  | 'CREATE_USER_ACCOUNT'
  | 'ASSIGN_USER_ROLE'
  | 'RESET_USER_PASSWORD'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditActionType | string;
  targetModule: 'Divisions' | 'Payroll' | 'Store' | 'Employees' | 'RBAC' | 'Deployment' | 'System';
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'SECURITY_ALERT';
}
