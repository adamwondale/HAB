import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { formatEtb, percent, toneForStatus } from './modelHelpers';

export function buildPeopleModel(moduleId: ModuleId, data: WorkspaceData): ModuleModel | null {
  if (moduleId === 'management') {
    const active = data.employees.filter(employee => employee.status === 'Active').length;
    const onLeave = data.employees.filter(employee => employee.status === 'On Leave').length;
    const assigned = data.employees.filter(employee => employee.currentSiteName).length;

    return {
      title: 'Employees',
      description: 'Find employee contact, job, work site, and status information.',
      reportName: 'employees',
      searchLabel: 'Search employees',
      metrics: [
        { label: 'All employees', value: String(data.employees.length) },
        { label: 'Active', value: String(active) },
        { label: 'On leave', value: String(onLeave) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'job', label: 'Job' },
        { key: 'site', label: 'Work site' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' }
      ],
      rows: data.employees.map(employee => ({
        id: employee.id,
        searchText: `${employee.firstName} ${employee.lastName} ${employee.employeeCode} ${employee.role} ${employee.currentSiteName || ''}`,
        values: {
          employee: `${employee.firstName} ${employee.lastName} · ${employee.employeeCode}`,
          job: employee.role,
          site: employee.currentSiteName || 'Not assigned',
          phone: employee.phone,
          status: employee.status
        },
        tones: { status: toneForStatus(employee.status) }
      })),
      emptyMessage: 'No employee records found.',
      note: `${assigned} employees have a work site.`
    };
  }

  if (moduleId === 'recruitment') {
    const inReview = data.candidates.filter(candidate => !['Onboarded', 'Rejected'].includes(candidate.stage)).length;
    const ready = data.candidates.filter(candidate => candidate.medicalFit && candidate.guarantorProvided).length;

    return {
      title: 'Job applicants',
      description: 'See each applicant and the next hiring step.',
      reportName: 'job_applicants',
      searchLabel: 'Search applicants',
      metrics: [
        { label: 'All applicants', value: String(data.candidates.length) },
        { label: 'In review', value: String(inReview) },
        { label: 'Ready', value: String(ready) }
      ],
      columns: [
        { key: 'name', label: 'Applicant' },
        { key: 'job', label: 'Job wanted' },
        { key: 'phone', label: 'Phone' },
        { key: 'stage', label: 'Hiring step' },
        { key: 'documents', label: 'Checks' }
      ],
      rows: data.candidates.map(candidate => ({
        id: candidate.id,
        searchText: `${candidate.fullName} ${candidate.candidateCode} ${candidate.targetRole} ${candidate.stage}`,
        values: {
          name: `${candidate.fullName} · ${candidate.candidateCode}`,
          job: candidate.targetRole,
          phone: candidate.phone,
          stage: candidate.stage,
          documents: candidate.guarantorProvided && candidate.medicalFit ? 'Ready' : 'Needs check'
        },
        tones: {
          stage: toneForStatus(candidate.stage),
          documents: candidate.guarantorProvided && candidate.medicalFit ? 'good' : 'warn'
        }
      })),
      emptyMessage: 'No job applicants found.'
    };
  }

  if (moduleId === 'onboarding') {
    const complete = data.onboardingList.filter(person => person.progressPercent === 100).length;
    const startingSoon = data.onboardingList.filter(person => person.progressPercent < 100).length;

    return {
      title: 'New employees',
      description: 'Check what each new employee still needs before starting work.',
      reportName: 'new_employees',
      searchLabel: 'Search new employees',
      metrics: [
        { label: 'All records', value: String(data.onboardingList.length) },
        { label: 'Ready', value: String(complete) },
        { label: 'Still working', value: String(startingSoon) }
      ],
      columns: [
        { key: 'name', label: 'Employee' },
        { key: 'job', label: 'Job' },
        { key: 'start', label: 'Start date' },
        { key: 'progress', label: 'Progress', numeric: true },
        { key: 'status', label: 'Status' }
      ],
      rows: data.onboardingList.map(person => ({
        id: person.id,
        searchText: `${person.fullName} ${person.employeeCode} ${person.role}`,
        values: {
          name: `${person.fullName} · ${person.employeeCode}`,
          job: person.role,
          start: person.targetStartDate,
          progress: percent(person.progressPercent),
          status: person.progressPercent === 100 ? 'Ready' : 'In progress'
        },
        tones: { status: person.progressPercent === 100 ? 'good' : 'warn' }
      })),
      emptyMessage: 'No new employee records found.'
    };
  }

  if (moduleId === 'org') {
    const departments = new Set(data.managementPersons.map(person => person.department)).size;
    const heads = data.managementPersons.filter(person => person.roleCategory === 'Department Head').length;

    return {
      title: 'Teams and roles',
      description: 'See who works in each team and who they report to.',
      reportName: 'teams_and_roles',
      searchLabel: 'Search people or teams',
      metrics: [
        { label: 'People', value: String(data.managementPersons.length) },
        { label: 'Teams', value: String(departments) },
        { label: 'Team heads', value: String(heads) }
      ],
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'title', label: 'Job title' },
        { key: 'team', label: 'Team' },
        { key: 'reportsTo', label: 'Reports to' },
        { key: 'phone', label: 'Phone' }
      ],
      rows: data.managementPersons.map(person => ({
        id: person.id,
        searchText: `${person.name} ${person.title} ${person.department}`,
        values: {
          name: person.name,
          title: person.title,
          team: person.department,
          reportsTo: person.reportsToTitle || 'Company leadership',
          phone: person.phone
        }
      })),
      emptyMessage: 'No team records found.'
    };
  }

  if (moduleId === 'transfers') {
    const pending = data.transfers.filter(record => record.status !== 'Executed').length;
    const payChanges = data.transfers.filter(record => record.salaryChangeETB !== 0).length;

    return {
      title: 'Transfers',
      description: 'See employee moves, job changes, and approval status.',
      reportName: 'employee_transfers',
      searchLabel: 'Search transfers',
      metrics: [
        { label: 'All transfers', value: String(data.transfers.length) },
        { label: 'Waiting', value: String(pending) },
        { label: 'Pay changes', value: String(payChanges) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'change', label: 'Change' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'status', label: 'Status' }
      ],
      rows: data.transfers.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.type} ${record.fromSite} ${record.toSite}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          change: record.type,
          from: record.fromSite,
          to: record.toSite,
          status: record.status
        },
        tones: { status: toneForStatus(record.status) }
      })),
      emptyMessage: 'No transfer records found.'
    };
  }

  if (moduleId === 'experience') {
    const thisYear = String(new Date().getFullYear());
    const recent = data.workExperiences.filter(record => record.issuedDate.startsWith(thisYear)).length;

    return {
      title: 'Work letters',
      description: 'Find work experience letters made for former employees.',
      reportName: 'work_letters',
      searchLabel: 'Search work letters',
      metrics: [
        { label: 'All letters', value: String(data.workExperiences.length) },
        { label: 'This year', value: String(recent) },
        { label: 'Employees', value: String(new Set(data.workExperiences.map(record => record.employeeId)).size) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'job', label: 'Job' },
        { key: 'period', label: 'Work period' },
        { key: 'letter', label: 'Letter number' },
        { key: 'date', label: 'Date made' }
      ],
      rows: data.workExperiences.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.role} ${record.certificateNumber}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          job: record.role,
          period: `${record.startDate} to ${record.endDate}`,
          letter: record.certificateNumber,
          date: record.issuedDate
        }
      })),
      emptyMessage: 'No work letters found.'
    };
  }

  return null;
}
