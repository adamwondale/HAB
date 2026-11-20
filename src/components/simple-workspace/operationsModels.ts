import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { percent, toneForStatus } from './modelHelpers';

type TFn = (key: string, options?: any) => string;

export function buildOperationsModel(moduleId: ModuleId, data: WorkspaceData, t: TFn): ModuleModel | null {
  if (moduleId === 'deployment') {
    const active = data.deployments.filter(r => r.status === 'Active').length;
    const required = data.sites.reduce((s, x) => s + x.securityStaffRequired + x.cleaningStaffRequired, 0);
    const deployed = data.sites.reduce((s, x) => s + x.securityStaffDeployed + x.cleaningStaffDeployed, 0);

    return {
      title: t('deployment.workSitesTitle'),
      description: t('deployment.workSitesDesc'),
      reportName: 'work_sites',
      searchLabel: t('deployment.searchAssignments'),
      metrics: [
        { label: t('deployment.activeAssignments'), value: String(active) },
        { label: t('deployment.clientSites'), value: String(data.sites.length) },
        { label: t('deployment.positionsFilled'), value: percent(required ? (deployed / required) * 100 : 0) }
      ],
      columns: [
        { key: 'employee', label: t('attendance.employee') },
        { key: 'site', label: t('deployment.workSitesTitle') },
        { key: 'post', label: t('deployment.workArea') },
        { key: 'shift', label: t('deployment.shift') },
        { key: 'status', label: t('deployment.status') }
      ],
      rows: data.deployments.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.post}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          site: record.siteName,
          post: record.post,
          shift: record.shift,
          status: record.status === 'Active' ? t('deployment.active') : record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: t('deployment.noAssignmentsFound')
    };
  }

  if (moduleId === 'attendance') {
    const present = data.attendance.filter(r => r.status === 'Present' || r.status === 'Overtime').length;
    const absent = data.attendance.filter(r => r.status === 'Absent').length;
    const late = data.attendance.filter(r => r.status === 'Late').length;

    return {
      title: t('attendance.attendanceTitle'),
      description: t('attendance.attendanceDesc'),
      reportName: 'attendance',
      searchLabel: t('attendance.searchAttendance'),
      metrics: [
        { label: t('attendance.present'), value: String(present) },
        { label: t('attendance.late'), value: String(late) },
        { label: t('attendance.absent'), value: String(absent) }
      ],
      columns: [
        { key: 'employee', label: t('attendance.employee') },
        { key: 'date', label: t('attendance.date') },
        { key: 'site', label: t('attendance.workSite') },
        { key: 'time', label: t('attendance.checkIn') },
        { key: 'status', label: t('attendance.status') }
      ],
      rows: data.attendance.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.status}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          date: record.date,
          site: record.siteName,
          time: record.checkInTime || t('attendance.notRecorded'),
          status: record.status === 'Present' ? t('attendance.present') : record.status === 'Late' ? t('attendance.late') : record.status === 'Absent' ? t('attendance.absent') : record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: t('attendance.noAttendanceFound')
    };
  }

  if (moduleId === 'leave') {
    const pending = data.leaveRequests.filter(r => r.status === 'Pending').length;
    const approved = data.leaveRequests.filter(r => r.status === 'Approved').length;
    const days = data.leaveRequests.reduce((sum, r) => sum + r.days, 0);

    return {
      title: t('hr.leaveRequestsTitle'),
      description: t('hr.leaveRequestsDesc'),
      reportName: 'leave_requests',
      searchLabel: t('hr.searchLeave'),
      metrics: [
        { label: t('hr.waiting'), value: String(pending) },
        { label: t('hr.approved'), value: String(approved) },
        { label: t('hr.totalDays'), value: String(days) }
      ],
      columns: [
        { key: 'employee', label: t('hr.employee') },
        { key: 'type', label: t('hr.leaveType') },
        { key: 'dates', label: t('hr.dates') },
        { key: 'days', label: t('hr.days'), numeric: true },
        { key: 'status', label: t('hr.status') }
      ],
      rows: data.leaveRequests.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.leaveType} ${record.status}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          type: record.leaveType,
          dates: `${record.startDate} - ${record.endDate}`,
          days: String(record.days),
          status: record.status === 'Pending' ? t('hr.waiting') : record.status === 'Approved' ? t('hr.approved') : record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: t('hr.noLeaveFound')
    };
  }

  if (moduleId === 'clearance') {
    const open = data.clearances.filter(r => r.status === 'In Progress' || r.status === 'On Hold').length;
    const cleared = data.clearances.filter(r => r.status === 'Cleared' || r.status === 'Completed').length;
    const propertyDue = data.clearances.filter(r => !r.storeAssetSignoff.completed).length;

    return {
      title: t('clearance.exitTitle'),
      description: t('clearance.exitDesc'),
      reportName: 'employee_exit',
      searchLabel: t('clearance.searchExit'),
      metrics: [
        { label: t('clearance.waiting'), value: String(open) },
        { label: t('clearance.finishedCheck'), value: String(cleared) },
        { label: t('clearance.storeDue'), value: String(propertyDue) }
      ],
      columns: [
        { key: 'employee', label: t('clearance.employee', { defaultValue: 'Employee' }) },
        { key: 'lastDay', label: t('clearance.lastDay') },
        { key: 'property', label: t('clearance.storeItems') },
        { key: 'finance', label: t('clearance.finalPay') },
        { key: 'status', label: t('common.status', { defaultValue: 'Status' }) }
      ],
      rows: data.clearances.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.status} ${record.exitReason}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          lastDay: record.targetExitDate,
          property: record.storeAssetSignoff.completed ? t('clearance.finishedCheck') : t('clearance.needsCheck'),
          finance: record.financeSignoff.completed ? t('clearance.finishedCheck') : t('clearance.needsCheck'),
          status: record.status === 'Completed' || record.status === 'Cleared' ? t('clearance.finishedCheck') : record.status === 'In Progress' ? t('clearance.inProgress') : record.status
        },
        tones: {
          property: record.storeAssetSignoff.completed ? 'good' : 'warn',
          finance: record.financeSignoff.completed ? 'good' : 'warn',
          status: toneForStatus(record.status)
        }
      })),
      emptyMessage: t('clearance.noExitFound')
    };
  }

  return null;
}
