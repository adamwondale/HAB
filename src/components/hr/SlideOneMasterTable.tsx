import React, { useState } from 'react';
import { Search, Filter, UserCheck } from 'lucide-react';
import { Employee, LeaveRequest, AttendanceRecord, ServiceType, EmployeeKpiRating, DeploymentProposal } from '../../types/hrm';
import { SlideOneDrawer, DrawerCategory } from './SlideOneDrawer';
import { EmployeeKpiModal } from './EmployeeKpiModal';
import { SlideOneTableRow } from './SlideOneTableRow';
import { PendingDeploymentsModal } from './PendingDeploymentsModal';

interface SlideOneMasterTableProps {
  employees: Employee[];
  leaveRequests?: LeaveRequest[];
  attendance?: AttendanceRecord[];
  onUpdateEmployee?: (updated: Employee) => void;
}

export const SlideOneMasterTable: React.FC<SlideOneMasterTableProps> = ({
  employees,
  leaveRequests = [],
  attendance = [],
  onUpdateEmployee
}) => {
  const [selectedDept, setSelectedDept] = useState<'All' | ServiceType | 'Previous Employees'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectEmployee, setInspectEmployee] = useState<Employee | null>(null);
  const [activeCategory, setActiveCategory] = useState<DrawerCategory>('profile');
  const [kpiModalEmployee, setKpiModalEmployee] = useState<Employee | null>(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [proposals, setProposals] = useState<DeploymentProposal[]>([
    {
      id: 'prop-sample-1',
      employeeId: employees[0]?.id || 'emp-1',
      employeeCode: employees[0]?.employeeCode || 'HAB-SEC-001',
      employeeName: `${employees[0]?.firstName || 'Abebe'} ${employees[0]?.lastName || 'Bekele'}`,
      serviceType: 'Security',
      toSiteId: 'site-1',
      toSiteName: 'Commercial Bank of Ethiopia Tower (HQ)',
      siteCategory: 'Bank',
      proposedBy: 'Operations Manager',
      proposedDate: new Date().toISOString().slice(0, 10),
      fitScore: 95,
      fitDetails: {
        fitnessMatch: true,
        healthClear: true,
        proximityMatch: true,
        backgroundClear: true
      },
      status: 'Pending HR Acknowledgment',
      hrNotes: 'Operations assessment recommends deployment to CBE Tower based on 95% Persona Match.'
    }
  ]);

  const handleConfirmProposal = (proposal: DeploymentProposal) => {
    setProposals(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'Approved' } : p));
    const target = employees.find(e => e.id === proposal.employeeId);
    if (target && onUpdateEmployee) {
      onUpdateEmployee({
        ...target,
        currentSiteId: proposal.toSiteId,
        currentSiteName: proposal.toSiteName
      });
    }
  };

  const filtered = employees.filter(emp => {
    if (selectedDept === 'Previous Employees') {
      if (emp.status !== 'Exited' && !emp.exitDetails) return false;
    } else {
      if (emp.status === 'Exited' && selectedDept !== 'All') return false;
      if (selectedDept !== 'All' && emp.serviceType !== selectedDept) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        (emp.currentSiteName && emp.currentSiteName.toLowerCase().includes(q)) ||
        emp.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCellClick = (emp: Employee, cat: DrawerCategory) => {
    setInspectEmployee(emp);
    setActiveCategory(cat);
  };

  const handleSaveKpi = (empId: string, kpi: EmployeeKpiRating) => {
    const target = employees.find(e => e.id === empId);
    if (target && onUpdateEmployee) {
      onUpdateEmployee({ ...target, kpiRating: kpi });
    }
  };

  const isPreviousView = selectedDept === 'Previous Employees';

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4C4541] dark:text-[#F2C46A]" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          >
            <option value="All">All Active Divisions</option>
            <option value="Security">Security Division (60%)</option>
            <option value="Cleaning">Cleaning Division (28%)</option>
            <option value="Property Management">Property Management (10%)</option>
            <option value="Head Office Staff">Head Office Staff (2%)</option>
            <option value="Previous Employees">Previous / Exited Staff (Alumni)</option>
          </select>
          <span className="text-xs text-slate-500 font-mono">Showing {filtered.length} staff</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPendingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Pending Deployments</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold">
              {proposals.filter(p => p.status === 'Pending HR Acknowledgment').length}
            </span>
          </button>
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee, ID, site, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:border-[#F2C46A] focus:bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* 7-Column Master Ledger Table */}
      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <table className="w-full text-left text-xs min-w-[960px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] dark:bg-slate-800/90 dark:text-amber-200 dark:border-slate-700">
            <tr>
              <th className="py-3.5 px-4 font-bold">Employee</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Division & Role' : 'HR Profile'}</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Exit Date' : 'Pay Record'}</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Exit Reason' : 'Leave Days'}</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Rehire Status' : 'Overtime Record'}</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Last Work Site' : 'Site'}</th>
              <th className="py-3.5 px-4 font-bold">{isPreviousView ? 'Documentation' : 'KPI & Flag'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(emp => (
              <SlideOneTableRow
                key={emp.id}
                emp={emp}
                isPreviousView={isPreviousView}
                leaveRequests={leaveRequests}
                onCellClick={handleCellClick}
                onKpiClick={(e) => setKpiModalEmployee(e)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Inspection Drawer */}
      <SlideOneDrawer
        employee={inspectEmployee}
        category={activeCategory}
        isOpen={Boolean(inspectEmployee)}
        onClose={() => setInspectEmployee(null)}
        onSelectCategory={setActiveCategory}
        leaveRequests={leaveRequests}
        attendance={attendance}
        onOpenKpiModal={(emp) => setKpiModalEmployee(emp)}
      />

      {/* KPI Evaluation Modal */}
      <EmployeeKpiModal
        isOpen={Boolean(kpiModalEmployee)}
        onClose={() => setKpiModalEmployee(null)}
        employee={kpiModalEmployee}
        onSaveKpi={handleSaveKpi}
      />

      {/* Operations Deployments Gate Modal */}
      <PendingDeploymentsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        proposals={proposals}
        onConfirmProposal={handleConfirmProposal}
      />
    </div>
  );
};
