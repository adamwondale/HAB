import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { percent, toneForStatus } from './modelHelpers';

type TFn = (key: string, options?: any) => string;

export function buildPeopleModel(moduleId: ModuleId, data: WorkspaceData, t: TFn): ModuleModel | null {
  if (moduleId === 'management') {
    const active = data.employees.filter(e => e.status === 'Active').length;
    const onLeave = data.employees.filter(e => e.status === 'On Leave').length;
    const assigned = data.employees.filter(e => e.currentSiteName).length;

    return {
      title: t('hr.employeesTitle'),
      description: t('hr.employeesDesc'),
      reportName: 'employees',
      searchLabel: t('hr.searchEmployees'),
      metrics: [
        { label: t('hr.allEmployees'), value: String(data.employees.length) },
        { label: t('hr.active'), value: String(active) },
        { label: t('hr.onLeave'), value: String(onLeave) }
      ],
      columns: [
        { key: 'employee', label: t('hr.employee') },
        { key: 'job', label: t('hr.job') },
        { key: 'site', label: t('hr.workSite') },
        { key: 'phone', label: t('hr.phone') },
        { key: 'status', label: t('hr.status') }
      ],
      rows: data.employees.map(employee => ({
        id: employee.id,
        searchText: `${employee.firstName} ${employee.lastName} ${employee.employeeCode} ${employee.role} ${employee.currentSiteName || ''}`,
        values: {
          employee: `${employee.firstName} ${employee.lastName} · ${employee.employeeCode}`,
          job: employee.role,
          site: employee.currentSiteName || t('hr.notAssigned'),
          phone: employee.phone,
          status: employee.status === 'Active' ? t('common.active') : employee.status === 'On Leave' ? t('common.onLeave') : employee.status
        },
        tones: { status: toneForStatus(employee.status) }
      })),
      emptyMessage: t('hr.noEmployeesFound'),
      note: `${assigned} ${t('hr.assignedWorkSiteNote')}`
    };
  }

  if (moduleId === 'recruitment') {
    const inReview = data.candidates.filter(c => !['Onboarded', 'Rejected'].includes(c.stage)).length;
    const ready = data.candidates.filter(c => c.medicalFit && c.guarantorProvided).length;

    return {
      title: t('recruitment.applicantsTitle', { defaultValue: 'Job applicants' }),
      description: t('recruitment.applicantsDesc', { defaultValue: 'See each applicant and the next hiring step.' }),
      reportName: 'job_applicants',
      searchLabel: t('recruitment.searchApplicants', { defaultValue: 'Search applicants' }),
      metrics: [
        { label: t('recruitment.allApplicants', { defaultValue: 'All applicants' }), value: String(data.candidates.length) },
        { label: t('recruitment.inReview', { defaultValue: 'In review' }), value: String(inReview) },
        { label: t('recruitment.ready', { defaultValue: 'Ready' }), value: String(ready) }
      ],
      columns: [
        { key: 'name', label: t('recruitment.fullName') },
        { key: 'job', label: t('recruitment.targetRole') },
        { key: 'phone', label: t('common.phone') },
        { key: 'stage', label: t('recruitment.probationStage') },
        { key: 'documents', label: t('common.verified') }
      ],
      rows: data.candidates.map(candidate => {
        const isReady = candidate.guarantorProvided && candidate.medicalFit;
        return {
          id: candidate.id,
          searchText: `${candidate.fullName} ${candidate.candidateCode} ${candidate.targetRole} ${candidate.stage}`,
          values: {
            name: `${candidate.fullName} · ${candidate.candidateCode}`,
            job: candidate.targetRole,
            phone: candidate.phone,
            stage: candidate.stage,
            documents: isReady ? t('common.verified') : t('common.unverified')
          },
          tones: {
            stage: toneForStatus(candidate.stage),
            documents: isReady ? 'good' : 'warn'
          }
        };
      }),
      emptyMessage: t('common.noRecordsFound')
    };
  }

  if (moduleId === 'onboarding') {
    const complete = data.onboardingList.filter(p => p.progressPercent === 100).length;
    const startingSoon = data.onboardingList.filter(p => p.progressPercent < 100).length;

    return {
      title: t('hr.newEmployeesTitle'),
      description: t('hr.newEmployeesDesc'),
      reportName: 'new_employees',
      searchLabel: t('hr.searchNewEmployees'),
      metrics: [
        { label: t('hr.allRecords'), value: String(data.onboardingList.length) },
        { label: t('hr.ready'), value: String(complete) },
        { label: t('hr.stillWorking'), value: String(startingSoon) }
      ],
      columns: [
        { key: 'name', label: t('hr.employee') },
        { key: 'job', label: t('hr.job') },
        { key: 'start', label: t('hr.startDate') },
        { key: 'progress', label: t('hr.progress'), numeric: true },
        { key: 'status', label: t('hr.status') }
      ],
      rows: data.onboardingList.map(person => {
        const isReady = person.progressPercent === 100;
        return {
          id: person.id,
          searchText: `${person.fullName} ${person.employeeCode} ${person.role}`,
          values: {
            name: `${person.fullName} · ${person.employeeCode}`,
            job: person.role,
            start: person.targetStartDate,
            progress: percent(person.progressPercent),
            status: isReady ? t('hr.ready') : t('hr.inProgress')
          },
          tones: { status: isReady ? 'good' : 'warn' }
        };
      }),
      emptyMessage: t('hr.noNewEmployeesFound')
    };
  }

  if (moduleId === 'org') {
    const departments = new Set(data.managementPersons.map(p => p.department)).size;
    const heads = data.managementPersons.filter(p => p.roleCategory === 'Department Head').length;

    return {
      title: t('hr.teamsAndRolesTitle'),
      description: t('hr.teamsAndRolesDesc'),
      reportName: 'teams_and_roles',
      searchLabel: t('hr.searchTeams'),
      metrics: [
        { label: t('hr.people'), value: String(data.managementPersons.length) },
        { label: t('hr.teams'), value: String(departments) },
        { label: t('hr.teamHeads'), value: String(heads) }
      ],
      columns: [
        { key: 'name', label: t('hr.name') },
        { key: 'title', label: t('hr.jobTitle') },
        { key: 'team', label: t('hr.team') },
        { key: 'reportsTo', label: t('hr.reportsTo') },
        { key: 'phone', label: t('hr.phone') }
      ],
      rows: data.managementPersons.map(person => ({
        id: person.id,
        searchText: `${person.name} ${person.title} ${person.department}`,
        values: {
          name: person.name,
          title: person.title,
          team: person.department,
          reportsTo: person.reportsToTitle || t('hr.companyLeadership'),
          phone: person.phone
        }
      })),
      emptyMessage: t('hr.noTeamsFound')
    };
  }

  if (moduleId === 'transfers') {
    const pending = data.transfers.filter(r => r.status !== 'Executed').length;
    const payChanges = data.transfers.filter(r => r.salaryChangeETB !== 0).length;

    return {
      title: t('hr.transfersTitle'),
      description: t('hr.transfersDesc'),
      reportName: 'employee_transfers',
      searchLabel: t('hr.searchTransfers'),
      metrics: [
        { label: t('hr.allTransfers'), value: String(data.transfers.length) },
        { label: t('hr.waiting'), value: String(pending) },
        { label: t('hr.payChanges'), value: String(payChanges) }
      ],
      columns: [
        { key: 'employee', label: t('hr.employee') },
        { key: 'change', label: t('hr.change') },
        { key: 'from', label: t('hr.from') },
        { key: 'to', label: t('hr.to') },
        { key: 'status', label: t('hr.status') }
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
      emptyMessage: t('hr.noTransfersFound')
    };
  }

  if (moduleId === 'experience') {
    const thisYear = String(new Date().getFullYear());
    const recent = data.workExperiences.filter(r => r.issuedDate.startsWith(thisYear)).length;

    return {
      title: t('hr.workLettersTitle'),
      description: t('hr.workLettersDesc'),
      reportName: 'work_letters',
      searchLabel: t('hr.searchWorkLetters'),
      metrics: [
        { label: t('hr.allLetters'), value: String(data.workExperiences.length) },
        { label: t('hr.thisYear'), value: String(recent) },
        { label: t('hr.allEmployees'), value: String(new Set(data.workExperiences.map(r => r.employeeId)).size) }
      ],
      columns: [
        { key: 'employee', label: t('hr.employee') },
        { key: 'job', label: t('hr.job') },
        { key: 'period', label: t('hr.workPeriod') },
        { key: 'letter', label: t('hr.letterNumber') },
        { key: 'date', label: t('hr.dateMade') }
      ],
      rows: data.workExperiences.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.role} ${record.certificateNumber}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          job: record.role,
          period: `${record.startDate} - ${record.endDate}`,
          letter: record.certificateNumber,
          date: record.issuedDate
        }
      })),
      emptyMessage: t('hr.noWorkLettersFound')
    };
  }

  return null;
}
