import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { percent, toneForStatus } from './modelHelpers';

export function buildOperationsModel(moduleId: ModuleId, data: WorkspaceData): ModuleModel | null {
  if (moduleId === 'deployment') {
    const active = data.deployments.filter(record => record.status === 'Active').length;
    const required = data.sites.reduce((sum, site) => sum + site.securityStaffRequired + site.cleaningStaffRequired, 0);
    const deployed = data.sites.reduce((sum, site) => sum + site.securityStaffDeployed + site.cleaningStaffDeployed, 0);

    return {
      title: 'Work sites',
      description: 'See who is working at each client site.',
      reportName: 'work_sites',
      searchLabel: 'Search employees or sites',
      metrics: [
        { label: 'Active assignments', value: String(active) },
        { label: 'Client sites', value: String(data.sites.length) },
        { label: 'Positions filled', value: percent(required ? (deployed / required) * 100 : 0) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'site', label: 'Work site' },
        { key: 'post', label: 'Work area' },
        { key: 'shift', label: 'Shift' },
        { key: 'status', label: 'Status' }
      ],
      rows: data.deployments.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.post}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          site: record.siteName,
          post: record.post,
          shift: record.shift,
          status: record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: 'No work assignments found.'
    };
  }

  if (moduleId === 'attendance') {
    const present = data.attendance.filter(record => record.status === 'Present' || record.status === 'Overtime').length;
    const absent = data.attendance.filter(record => record.status === 'Absent').length;
    const late = data.attendance.filter(record => record.status === 'Late').length;

    return {
      title: 'Attendance',
      description: 'See who came to work and who needs follow-up.',
      reportName: 'attendance',
      searchLabel: 'Search attendance',
      metrics: [
        { label: 'Present', value: String(present) },
        { label: 'Late', value: String(late) },
        { label: 'Absent', value: String(absent) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'date', label: 'Date' },
        { key: 'site', label: 'Work site' },
        { key: 'time', label: 'Check-in' },
        { key: 'status', label: 'Status' }
      ],
      rows: data.attendance.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.status}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          date: record.date,
          site: record.siteName,
          time: record.checkInTime || 'Not recorded',
          status: record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: 'No attendance records found.'
    };
  }

  if (moduleId === 'leave') {
    const pending = data.leaveRequests.filter(record => record.status === 'Pending').length;
    const approved = data.leaveRequests.filter(record => record.status === 'Approved').length;
    const days = data.leaveRequests.reduce((sum, record) => sum + record.days, 0);

    return {
      title: 'Leave requests',
      description: 'See leave dates, reasons, and approval status.',
      reportName: 'leave_requests',
      searchLabel: 'Search leave requests',
      metrics: [
        { label: 'Waiting', value: String(pending) },
        { label: 'Approved', value: String(approved) },
        { label: 'Total days', value: String(days) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'type', label: 'Leave type' },
        { key: 'dates', label: 'Dates' },
        { key: 'days', label: 'Days', numeric: true },
        { key: 'status', label: 'Status' }
      ],
      rows: data.leaveRequests.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.leaveType} ${record.status}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          type: record.leaveType,
          dates: `${record.startDate} to ${record.endDate}`,
          days: String(record.days),
          status: record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: 'No leave requests found.'
    };
  }

  if (moduleId === 'clearance') {
    const open = data.clearances.filter(record => record.status === 'In Progress' || record.status === 'On Hold').length;
    const cleared = data.clearances.filter(record => record.status === 'Cleared' || record.status === 'Completed').length;
    const propertyDue = data.clearances.filter(record => !record.storeAssetSignoff.completed).length;

    return {
      title: 'Employee exit',
      description: 'Check final pay, store items, and approvals before an employee leaves.',
      reportName: 'employee_exit',
      searchLabel: 'Search employee exit records',
      metrics: [
        { label: 'Waiting', value: String(open) },
        { label: 'Finished', value: String(cleared) },
        { label: 'Store due', value: String(propertyDue) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'lastDay', label: 'Last day' },
        { key: 'property', label: 'Store items' },
        { key: 'finance', label: 'Final pay' },
        { key: 'status', label: 'Status' }
      ],
      rows: data.clearances.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.status} ${record.exitReason}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          lastDay: record.targetExitDate,
          property: record.storeAssetSignoff.completed ? 'Finished' : 'Needs check',
          finance: record.financeSignoff.completed ? 'Finished' : 'Needs check',
          status: record.status === 'Completed' ? 'Finished' : record.status
        },
        tones: {
          property: record.storeAssetSignoff.completed ? 'good' : 'warn',
          finance: record.financeSignoff.completed ? 'good' : 'warn',
          status: toneForStatus(record.status)
        }
      })),
      emptyMessage: 'No employee exit records found.'
    };
  }

  return null;
}
