export type DepartmentRole =
  | 'super_admin'
  | 'hr'
  | 'finance'
  | 'store'
  | 'operations'
  | 'executive';

export interface DepartmentalPermissions {
  // Module access flags
  canAccessAllModules: boolean;
  canAccessPayroll: boolean;
  canAccessStore: boolean;
  canAccessHr: boolean;
  canAccessOperations: boolean;
  canAccessDivisions: boolean;

  // Operational action permissions
  canManageUsersAndRoles: boolean;
  canModifyHrRecords: boolean;
  canManageDivisions: boolean;
  canManageDeployments: boolean;
  canApproveFinalPayroll: boolean;
  canModifySalaryRules: boolean;
  canManageInventory: boolean;
  canAuthorizeStockOut: boolean;
  canSubmitEquipmentRequests: boolean;
  canViewAuditTrail: boolean;
}

export const ROLE_PERMISSIONS: Record<DepartmentRole, DepartmentalPermissions> = {
  super_admin: {
    canAccessAllModules: true,
    canAccessPayroll: true,
    canAccessStore: true,
    canAccessHr: true,
    canAccessOperations: true,
    canAccessDivisions: true,
    canManageUsersAndRoles: true,
    canModifyHrRecords: true,
    canManageDivisions: true,
    canManageDeployments: true,
    canApproveFinalPayroll: true,
    canModifySalaryRules: true,
    canManageInventory: true,
    canAuthorizeStockOut: true,
    canSubmitEquipmentRequests: true,
    canViewAuditTrail: true
  },
  hr: {
    canAccessAllModules: false,
    canAccessPayroll: false, // Preparation inputs only, cannot access full finance payroll ledger
    canAccessStore: false,
    canAccessHr: true,
    canAccessOperations: true,
    canAccessDivisions: true,
    canManageUsersAndRoles: false,
    canModifyHrRecords: true,
    canManageDivisions: true,
    canManageDeployments: true,
    canApproveFinalPayroll: false, // Client rule: No permission to authorize final payroll payments
    canModifySalaryRules: false,
    canManageInventory: false,
    canAuthorizeStockOut: false,
    canSubmitEquipmentRequests: true,
    canViewAuditTrail: false
  },
  finance: {
    canAccessAllModules: false,
    canAccessPayroll: true,
    canAccessStore: true, // For asset valuation
    canAccessHr: false,
    canAccessOperations: false,
    canAccessDivisions: false,
    canManageUsersAndRoles: false,
    canModifyHrRecords: false, // Client rule: No permission to modify confidential HR employment records
    canManageDivisions: false,
    canManageDeployments: false,
    canApproveFinalPayroll: true,
    canModifySalaryRules: true,
    canManageInventory: false,
    canAuthorizeStockOut: false,
    canSubmitEquipmentRequests: true,
    canViewAuditTrail: true
  },
  store: {
    canAccessAllModules: false,
    canAccessPayroll: false, // Client rule: No permission to access payroll
    canAccessStore: true,
    canAccessHr: false,
    canAccessOperations: false,
    canAccessDivisions: false,
    canManageUsersAndRoles: false,
    canModifyHrRecords: false,
    canManageDivisions: false,
    canManageDeployments: false,
    canApproveFinalPayroll: false,
    canModifySalaryRules: false,
    canManageInventory: true,
    canAuthorizeStockOut: true,
    canSubmitEquipmentRequests: true,
    canViewAuditTrail: false
  },
  operations: {
    canAccessAllModules: false,
    canAccessPayroll: false, // Client rule: No access to confidential payroll information
    canAccessStore: true, // To view equipment status & submit requests
    canAccessHr: false,
    canAccessOperations: true,
    canAccessDivisions: false,
    canManageUsersAndRoles: false,
    canModifyHrRecords: false,
    canManageDivisions: false,
    canManageDeployments: true,
    canApproveFinalPayroll: false,
    canModifySalaryRules: false,
    canManageInventory: false,
    canAuthorizeStockOut: false,
    canSubmitEquipmentRequests: true,
    canViewAuditTrail: false
  },
  executive: {
    canAccessAllModules: true,
    canAccessPayroll: true,
    canAccessStore: true,
    canAccessHr: true,
    canAccessOperations: true,
    canAccessDivisions: true,
    canManageUsersAndRoles: false,
    canModifyHrRecords: false,
    canManageDivisions: false,
    canManageDeployments: false,
    canApproveFinalPayroll: false,
    canModifySalaryRules: false,
    canManageInventory: false,
    canAuthorizeStockOut: false,
    canSubmitEquipmentRequests: false,
    canViewAuditTrail: true
  }
};
