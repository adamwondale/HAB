import React from 'react';
import { X, Building2, UserCheck, Calendar, Shield, Package } from 'lucide-react';
import { Employee, ServiceType } from '../../types/hrm';

export interface AssignedStaffItem {
  id: string;
  employeeCode: string;
  fullName: string;
  role: string;
  serviceType: ServiceType;
  currentSiteName?: string;
  hireDate?: string;
  phone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
}

interface AssignedEmployeeModalProps {
  employee: AssignedStaffItem | Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignedEmployeeModal: React.FC<AssignedEmployeeModalProps> = ({
  employee,
  isOpen,
  onClose
}) => {
  if (!isOpen || !employee) return null;

  const fullName = 'fullName' in employee 
    ? employee.fullName 
    : `${employee.firstName} ${employee.lastName}`;
  const siteName = employee.currentSiteName || 'Commercial Bank of Ethiopia Tower (HQ)';
  const supervisorName = 'supervisorName' in employee && employee.supervisorName 
    ? employee.supervisorName 
    : 'Ato Tadesse Wolde (Operations Lead)';
  const supervisorPhone = 'supervisorPhone' in employee && employee.supervisorPhone 
    ? employee.supervisorPhone 
    : '+251 91 144 8820';
  const deployDate = employee.hireDate || '2026-08-15';

  const assignmentRecords = [
    {
      id: 'asg-1',
      category: 'Primary Post / Role Duty',
      item: `${employee.role} Duty Post`,
      quantity: '1 Operational Post',
      location: siteName,
      status: 'Active Deployment'
    },
    {
      id: 'asg-2',
      category: 'Duty Uniform & Apparel',
      item: employee.serviceType === 'Security' ? 'Tactical Service Uniform & Patrol Boots' : 'Heavy-Duty Overall & Gumboots',
      quantity: '2 Complete Sets',
      location: `${siteName} (Locker Bay)`,
      status: 'Issued & Inspected'
    },
    {
      id: 'asg-3',
      category: 'Operational Gear / Asset',
      item: employee.serviceType === 'Security' ? 'Motorola VHF Radio & Security Baton' : 'Industrial Wet/Dry Floor Buffer Kit',
      quantity: '1 Assigned Unit',
      location: `${siteName} Station Post`,
      status: 'Logged in Central Ledger'
    },
    {
      id: 'asg-4',
      category: 'Access Credentials',
      item: 'HAB Encrypted RFID Proximity Smart Badge',
      quantity: '1 Card (ID: ' + employee.employeeCode + ')',
      location: siteName,
      status: 'Access Granted'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/60 dark:bg-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F2C46A] text-[#4C4541] font-bold text-sm flex items-center justify-center shrink-0 border border-[#4C4541]/10">
              {fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950 dark:text-white">{fullName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {employee.employeeCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{employee.serviceType} · {employee.role}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Site / Station</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-xs">{siteName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Site Supervisor</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-xs">{supervisorName}</span>
              <span className="text-[10px] text-slate-500 font-mono">{supervisorPhone}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Deployment Date</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block text-xs">{deployDate}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Active Sign-off</span>
            </div>
          </div>
        </div>

        {/* Assignment Table */}
        <div className="p-3.5 overflow-y-auto max-h-[320px]">
          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#4C4541] dark:text-[#F2C46A]" />
            <span>Assigned Operational Scope & Assets</span>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF0DA] text-[#4C4541] dark:bg-slate-800 dark:text-amber-200 border-b border-slate-200 dark:border-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2 px-3">Assignment (Role/Gear/Asset)</th>
                  <th className="py-2 px-3">Quantity</th>
                  <th className="py-2 px-3">Location / Site</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignmentRecords.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white block">{item.item}</span>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                    </td>
                    <td className="py-2 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">{item.quantity}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{item.location}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                        <Shield className="w-2.5 h-2.5" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
