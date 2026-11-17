import React, { useState } from 'react';
import { Building2, Plus, Search, Download } from 'lucide-react';
import { Division } from '../../types/division';
import { Employee, ServiceType } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';
import { AddEditDivisionModal } from './AddEditDivisionModal';
import { DivisionEmployeeRosterModal } from './DivisionEmployeeRosterModal';
import { DivisionKpiCards } from './DivisionKpiCards';
import { DivisionCard } from './DivisionCard';

interface DivisionManagementViewProps {
  divisions: Division[];
  employees: Employee[];
  onAddDivision: (division: Division) => void;
  onUpdateDivision: (division: Division) => void;
  onToggleStatus: (divisionId: string) => void;
  onReassignEmployee: (employeeId: string, targetDivisionName: ServiceType) => void;
}

export const DivisionManagementView: React.FC<DivisionManagementViewProps> = ({
  divisions,
  employees,
  onAddDivision,
  onUpdateDivision,
  onToggleStatus,
  onReassignEmployee
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [rosterDivision, setRosterDivision] = useState<Division | null>(null);

  const activeCount = divisions.filter((d) => d.status === 'Active').length;
  const totalAssigned = employees.length;

  const filteredDivisions = divisions.filter((d) => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      (d.headOfDivision && d.headOfDivision.toLowerCase().includes(q))
    );
  });

  const handleExport = () => {
    downloadCsv(
      `HAB_Divisions_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Code', 'Division Name', 'Amharic Name', 'Status', 'Head of Division', 'Assigned Staff', 'Target Headcount'],
      divisions.map((d) => [
        d.code,
        d.name,
        d.amharicName || '',
        d.status,
        d.headOfDivision || 'Unassigned',
        employees.filter((e) => e.serviceType === d.name).length,
        d.targetHeadcount || 0
      ])
    );
  };

  const handleConfirmToggleStatus = (div: Division) => {
    const staffCount = employees.filter((e) => e.serviceType === div.name).length;
    if (div.status === 'Active' && staffCount > 0) {
      if (!window.confirm(`Warning: ${div.name} currently has ${staffCount} assigned employee(s). Are you sure you want to deactivate it?`)) {
        return;
      }
    }
    onToggleStatus(div.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#4C4541] dark:text-[#F2C46A]" />
            Division Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure operational divisions, monitor workforce distribution, and reassign personnel across service units.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => { setEditingDivision(null); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#F2C46A] text-[#4C4541] hover:bg-[#e4b55b] shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Division
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <DivisionKpiCards
        divisions={divisions}
        activeCount={activeCount}
        totalAssigned={totalAssigned}
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FCF0DA]/40 dark:bg-[#2C2724]/40 p-3 rounded-xl border border-[#EFE7D8] dark:border-slate-800">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search division or head..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Active', 'Inactive'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#F2C46A] text-[#4C4541]'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Division Cards Grid */}
      {filteredDivisions.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Building2 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs text-slate-500 font-medium">No divisions found matching filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDivisions.map((div) => (
            <DivisionCard
              key={div.id}
              division={div}
              staffCount={employees.filter((e) => e.serviceType === div.name).length}
              onOpenRoster={(d) => setRosterDivision(d)}
              onEdit={(d) => { setEditingDivision(d); setIsAddModalOpen(true); }}
              onToggleStatus={handleConfirmToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddEditDivisionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(updated) => {
          if (editingDivision) onUpdateDivision(updated);
          else onAddDivision(updated);
        }}
        editingDivision={editingDivision}
        existingCodes={divisions.map((d) => d.code)}
      />

      <DivisionEmployeeRosterModal
        isOpen={!!rosterDivision}
        onClose={() => setRosterDivision(null)}
        division={rosterDivision}
        employees={employees}
        allDivisions={divisions}
        onReassignEmployee={onReassignEmployee}
      />
    </div>
  );
};
