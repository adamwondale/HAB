import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Download, Table, ShieldCheck, Lock } from 'lucide-react';
import { Employee, ClientSite, ManagementPerson, LeaveRequest, AttendanceRecord } from '../types/hrm';
import { SystemMasterConfig } from '../types/masterConfig';
import { DEFAULT_SYSTEM_MASTER_CONFIG } from '../utils/masterConfigEngine';
import { exportEmployeesToCsv } from '../utils/csvExport';
import { SlideOneMasterTable } from './hr/SlideOneMasterTable';
import { SlideOneDrawer } from './hr/SlideOneDrawer';
import { AddEmployeeModal } from './hr/AddEmployeeModal';
import { LegacyEmployeeTable } from './hr/LegacyEmployeeTable';

interface EmployeeManagementViewProps {
  employees: Employee[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  masterConfig?: SystemMasterConfig;
  leaveRequests?: LeaveRequest[];
  attendance?: AttendanceRecord[];
  onAddEmployee: (newEmp: Employee) => void;
  onInitiateClearanceFromEmployee: (employeeId: string) => void;
  onDeployFromEmployee: (employeeId: string) => void;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  employees,
  activeUser,
  masterConfig = DEFAULT_SYSTEM_MASTER_CONFIG,
  leaveRequests = [],
  attendance = [],
  onAddEmployee,
  onInitiateClearanceFromEmployee
}) => {
  const { t } = useTranslation();
  const isStorekeeperMode = activeUser?.id === 'mgmt-storekeeper';
  const isLegalMode = activeUser?.id === 'mgmt-legal';
  const canEditEmployees = activeUser ? activeUser.permissions.canEditEmployees : true;

  const [viewMode, setViewMode] = useState<'slideOne' | 'compliance'>(
    isStorekeeperMode || isLegalMode ? 'compliance' : 'slideOne'
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectEmployee, setInspectEmployee] = useState<Employee | null>(null);

  const handleExportCsv = () => {
    exportEmployeesToCsv(employees, 'HAB_Employee_Master_Directory');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {employees.length} {t('hr.registeredStaff')}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-950 mt-1 dark:text-white">
            {t('hr.masterRecordLedger')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('hr.ledgerSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setViewMode('slideOne')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'slideOne'
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>{t('hr.slideOneLedger')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compliance')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'compliance'
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t('hr.complianceAndSizing')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('hr.exportCsv')}</span>
          </button>

          {canEditEmployees ? (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs dark:bg-slate-100 dark:text-slate-900"
            >
              <Plus className="w-4 h-4" />
              <span>{t('hr.addEmployee')}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('hr.readOnlyScope')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Primary Landing Content */}
      {viewMode === 'slideOne' ? (
        <SlideOneMasterTable
          employees={employees}
          leaveRequests={leaveRequests}
          attendance={attendance}
        />
      ) : (
        <LegacyEmployeeTable
          employees={employees}
          isStorekeeperMode={isStorekeeperMode}
          isLegalMode={isLegalMode}
          canEditEmployees={canEditEmployees}
          onInspect={setInspectEmployee}
          onClearance={onInitiateClearanceFromEmployee}
        />
      )}

      {/* Slide-over Inspection for Secondary Mode */}
      <SlideOneDrawer
        employee={inspectEmployee}
        category="profile"
        isOpen={Boolean(inspectEmployee)}
        onClose={() => setInspectEmployee(null)}
        onSelectCategory={() => {}}
        leaveRequests={leaveRequests}
        attendance={attendance}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={onAddEmployee}
        existingCount={employees.length}
        masterConfig={masterConfig}
      />
    </div>
  );
};
