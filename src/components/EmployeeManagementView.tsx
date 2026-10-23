import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  CheckCircle2, 
  X,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Download,
  Lock
} from 'lucide-react';
import { Employee, ServiceType, ClientSite, ManagementPerson } from '../types/hrm';
import { exportEmployeesToCsv } from '../utils/csvExport';

interface EmployeeManagementViewProps {
  employees: Employee[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  onAddEmployee: (newEmp: Employee) => void;
  onInitiateClearanceFromEmployee: (employeeId: string) => void;
  onDeployFromEmployee: (employeeId: string) => void;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  employees,
  sites,
  activeUser,
  onAddEmployee,
  onInitiateClearanceFromEmployee,
  onDeployFromEmployee
}) => {
  const isStorekeeperMode = activeUser?.id === 'mgmt-storekeeper';
  const isLegalMode = activeUser?.id === 'mgmt-legal';
  const canEditEmployees = activeUser ? activeUser.permissions.canEditEmployees : true;
  const [selectedService, setSelectedService] = useState<'All' | ServiceType>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectEmployee, setInspectEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Security');
  const [role, setRole] = useState('Security Guard');
  const [phone, setPhone] = useState('+251 9');
  const [subcity, setSubcity] = useState('Kirkos');
  const [kebele, setKebele] = useState('Kebele 02');
  const [baseSalary, setBaseSalary] = useState(7000);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorOrg, setGuarantorOrg] = useState('');

  const filteredEmployees = employees.filter(e => {
    if (selectedService !== 'All' && e.serviceType !== selectedService) return false;
    if (selectedStatus !== 'All' && e.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        (e.currentSiteName && e.currentSiteName.toLowerCase().includes(q)) ||
        e.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const nextIdNum = 100 + employees.length + 1;
    const code =
      serviceType === 'Security'
        ? `HAB-SEC-0${nextIdNum}`
        : serviceType === 'Cleaning'
        ? `HAB-CLN-0${nextIdNum}`
        : serviceType === 'Property Management'
        ? `HAB-PRP-0${nextIdNum}`
        : `HAB-HQ-0${nextIdNum}`;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: code,
      firstName,
      lastName,
      gender: 'Male',
      phone,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hab-business.com`,
      dateOfBirth: '1995-05-15',
      hireDate: new Date().toISOString().split('T')[0],
      serviceType,
      role,
      grade: 'L1',
      status: 'Probation',
      nationalId: `ET-NID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      kebele,
      woreda: 'Woreda 03',
      subcity,
      emergencyContact: {
        name: 'Family Contact',
        phone: phone,
        relation: 'Relative'
      },
      guarantor: {
        name: guarantorName || 'Ato Kassa Mulugeta',
        phone: phone,
        organization: guarantorOrg || 'Government Office',
        kebeleId: 'KB-88912',
        verified: true
      },
      bankAccount: {
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountNumber: '1000' + Math.floor(100000000 + Math.random() * 900000000)
      },
      salary: {
        baseSalary,
        siteAllowance: 1200,
        shiftAllowance: 600,
        hazardAllowance: serviceType === 'Security' ? 1200 : 800
      },
      currentShift:
        serviceType === 'Security'
          ? '24h Duty (24hr ON / 48hr REST)'
          : serviceType === 'Cleaning'
          ? 'Morning Shift (06:00 - 14:00)'
          : 'Regular Office Hours (08:00 - 17:00)',
      securityPlatoon: serviceType === 'Security' ? 'Platoon Alpha' : undefined,
      cleaningShiftWeek: serviceType === 'Cleaning' ? 'Week 1 (Morning)' : undefined,
      uniformSizes: {
        shirt: 'L',
        trousers: '32',
        boots: '42'
      }
    };

    onAddEmployee(newEmp);
    setIsAddModalOpen(false);
    setFirstName('');
    setLastName('');
  };

  const handleExportCsv = () => {
    const label = selectedService !== 'All' ? `${selectedService}_Division` : 'All_Divisions';
    exportEmployeesToCsv(filteredEmployees, label);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            {isStorekeeperMode
              ? 'Store & Equipment Controller View'
              : isLegalMode
              ? 'Legal Compliance & Guarantor Audit View'
              : 'Human Resources · All 4 Divisions'}
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            {isStorekeeperMode
              ? 'Employee Uniform & Boot Sizing Directory'
              : isLegalMode
              ? 'Employee Legal Contracts & Guarantor Dossiers'
              : 'Employee Master Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStorekeeperMode
              ? 'Scoped view for Store Keeper: Shirt/overall sizes, trousers sizes, and safety boot sizes for uniform issuance.'
              : isLegalMode
              ? 'Scoped view for Legal Advisor: National IDs, Kebele residences, and notarized legal guarantor verifications.'
              : 'Active roster across Security, Cleaning, Property Management & Head Office divisions.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200 shadow-xs"
            title="Download full CSV report of employee directory for internal audit and labor compliance"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV ({filteredEmployees.length})</span>
          </button>

          {canEditEmployees ? (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>{isStorekeeperMode ? 'Uniform Sizing Scope' : 'Legal Audit Scope'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            aria-label="Filter by division"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">All 4 Divisions ({employees.length})</option>
            <option value="Security">Security Division</option>
            <option value="Cleaning">Cleaning Division</option>
            <option value="Property Management">Property Management</option>
            <option value="Head Office Staff">Head Office Staff</option>
          </select>

          <select
            aria-label="Filter by lifecycle status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Deployed</option>
            <option value="Probation">On Probation</option>
            <option value="In Clearance">In Clearance</option>
            <option value="On Leave">On Leave</option>
            <option value="Exited">Exited</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, code, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-slate-100 text-slate-900 border-b-2 border-slate-200 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-4 px-5 font-bold text-slate-900">Employee</th>
              <th className="py-4 px-5 font-bold text-slate-900">Division</th>
              {isStorekeeperMode ? (
                <>
                  <th className="py-4 px-5 font-bold text-amber-900 bg-amber-50/60">Shirt / Smock Size</th>
                  <th className="py-4 px-5 font-bold text-amber-900 bg-amber-50/60">Trousers Size</th>
                  <th className="py-4 px-5 font-bold text-amber-900 bg-amber-50/60">Safety Boots Size</th>
                  <th className="py-4 px-5 font-bold text-slate-900">Assigned Site</th>
                </>
              ) : isLegalMode ? (
                <>
                  <th className="py-4 px-5 font-bold text-purple-900 bg-purple-50/60">National ID & Kebele</th>
                  <th className="py-4 px-5 font-bold text-purple-900 bg-purple-50/60">Legal Guarantor</th>
                  <th className="py-4 px-5 font-bold text-purple-900 bg-purple-50/60">Guarantor Org & ID</th>
                  <th className="py-4 px-5 font-bold text-slate-900">Status</th>
                </>
              ) : (
                <>
                  <th className="py-4 px-5 font-bold text-slate-900">Designation</th>
                  <th className="py-4 px-5 font-bold text-slate-900">Assigned Site</th>
                  <th className="py-4 px-5 font-bold text-slate-900">Guarantor</th>
                  <th className="py-4 px-5 font-bold text-slate-900">Status</th>
                </>
              )}
              <th className="py-4 px-5 font-bold text-slate-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="odd:bg-white even:bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
                <td className="py-4 px-5 font-normal">
                  <div className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</div>
                  <div className="text-[11px] font-mono text-slate-400 font-normal mt-0.5">{emp.employeeCode} · {emp.phone}</div>
                </td>
                <td className="py-4 px-5 font-normal">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                    emp.serviceType === 'Security'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : emp.serviceType === 'Cleaning'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : emp.serviceType === 'Property Management'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {emp.serviceType}
                  </span>
                </td>

                {isStorekeeperMode ? (
                  <>
                    <td className="py-4 px-5 font-mono font-bold text-slate-900 bg-amber-50/20">
                      Size {emp.uniformSizes.shirt}
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-slate-900 bg-amber-50/20">
                      Waist {emp.uniformSizes.trousers}
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-slate-900 bg-amber-50/20">
                      EU {emp.uniformSizes.boots}
                    </td>
                    <td className="py-4 px-5 text-slate-600 truncate max-w-xs">
                      {emp.currentSiteName || 'Reserve Pool'}
                    </td>
                  </>
                ) : isLegalMode ? (
                  <>
                    <td className="py-4 px-5 text-slate-700 bg-purple-50/20">
                      <div className="font-mono font-semibold text-slate-900">{emp.nationalId}</div>
                      <div className="text-[11px] text-slate-500">{emp.subcity}, {emp.kebele}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 bg-purple-50/20">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{emp.guarantor.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{emp.guarantor.phone}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 bg-purple-50/20">
                      <div className="font-medium text-slate-800">{emp.guarantor.organization}</div>
                      <div className="text-[11px] font-mono text-slate-500">ID: {emp.guarantor.kebeleId}</div>
                    </td>
                    <td className="py-4 px-5 font-normal">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {emp.status}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-5 text-slate-600 font-normal">
                      {emp.role}
                    </td>
                    <td className="py-4 px-5 text-slate-500 font-normal max-w-xs truncate">
                      {emp.currentSiteName ? (
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{emp.currentSiteName}</span>
                        </span>
                      ) : (
                        <span className="text-amber-800/80 italic text-[11px]">Reserve Pool</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-500 font-normal">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{emp.guarantor.name.split(' ')[0]}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 font-normal">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : emp.status === 'In Clearance'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 font-medium'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </>
                )}

                <td className="py-4 px-5 text-right font-normal">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInspectEmployee(emp)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium rounded transition-colors"
                    >
                      {isStorekeeperMode ? 'Gear Spec' : isLegalMode ? 'Legal File' : 'Profile'}
                    </button>
                    {canEditEmployees && emp.status !== 'In Clearance' && emp.status !== 'Exited' && (
                      <button
                        type="button"
                        onClick={() => onInitiateClearanceFromEmployee(emp.id)}
                        className="px-2 py-1 text-slate-400 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors text-[11px]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal: Inspect Employee Profile */}
      {inspectEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setInspectEmployee(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-3.5 border-b border-slate-100 pb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
                inspectEmployee.serviceType === 'Security'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {inspectEmployee.firstName.charAt(0)}{inspectEmployee.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {inspectEmployee.firstName} {inspectEmployee.lastName}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-slate-700">{inspectEmployee.employeeCode}</span>
                  <span>·</span>
                  <span>{inspectEmployee.serviceType}</span>
                  <span>·</span>
                  <span>{inspectEmployee.role}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Phone:</span>
                <span className="text-slate-900 font-mono">{inspectEmployee.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">National ID:</span>
                <span className="text-slate-900 font-mono">{inspectEmployee.nationalId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Shift & Policy:</span>
                <span className="text-slate-900 font-medium">
                  {inspectEmployee.serviceType === 'Security' 
                    ? `24h Duty / 48h Rest (${inspectEmployee.securityPlatoon || 'Platoon Alpha'})` 
                    : `${inspectEmployee.currentShift || 'Morning (06:00-14:00)'} · Weekly Swap`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Residence:</span>
                <span className="text-slate-900">{inspectEmployee.subcity}, {inspectEmployee.kebele}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Date Hired:</span>
                <span className="text-slate-900 font-mono">{inspectEmployee.hireDate}</span>
              </div>
            </div>

            {/* Guarantor Details */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legal Guarantor</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  Approved
                </span>
              </div>
              <div className="text-slate-700 pt-1">
                <strong>{inspectEmployee.guarantor.name}</strong> · {inspectEmployee.guarantor.organization}
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">Phone: {inspectEmployee.guarantor.phone}</div>
              </div>
            </div>

            {/* Salary Breakdown & Gear */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block pb-1 border-b border-slate-200">Monthly Compensation</span>
                <div className="flex justify-between text-slate-600">
                  <span>Base Pay:</span>
                  <span className="font-mono">ETB {inspectEmployee.salary.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Site Allowance:</span>
                  <span className="font-mono">ETB {inspectEmployee.salary.siteAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Gross:</span>
                  <span className="font-mono">
                    ETB {(
                      inspectEmployee.salary.baseSalary +
                      inspectEmployee.salary.siteAllowance +
                      inspectEmployee.salary.shiftAllowance +
                      inspectEmployee.salary.hazardAllowance
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block pb-1 border-b border-slate-200">Uniform & Gear Sizes</span>
                <div className="flex justify-between text-slate-600">
                  <span>Shirt / Overall:</span>
                  <span className="font-medium text-slate-800">{inspectEmployee.uniformSizes.shirt}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Boots Size:</span>
                  <span className="font-medium text-slate-800">{inspectEmployee.uniformSizes.boots}</span>
                </div>
                <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200 truncate">
                  Bank: {inspectEmployee.bankAccount.bankName}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Site: <strong className="text-slate-900">{inspectEmployee.currentSiteName || 'Reserve Pool'}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDeployFromEmployee(inspectEmployee.id);
                    setInspectEmployee(null);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  Deploy
                </button>
                {inspectEmployee.status !== 'In Clearance' && inspectEmployee.status !== 'Exited' && (
                  <button
                    type="button"
                    onClick={() => {
                      onInitiateClearanceFromEmployee(inspectEmployee.id);
                      setInspectEmployee(null);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg"
                  >
                    Clearance
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateEmployee} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Add New Employee</h2>
                <p className="text-xs text-slate-500">Register employee record in master HRM directory</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Division *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => {
                      const st = e.target.value as ServiceType;
                      setServiceType(st);
                      if (st === 'Security') setRole('Security Guard');
                      else if (st === 'Cleaning') setRole('Commercial Cleaner');
                      else if (st === 'Property Management') setRole('Facility Maintenance Technician');
                      else setRole('HR & Administrative Officer');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value="Security">Security Division</option>
                    <option value="Cleaning">Cleaning Division</option>
                    <option value="Property Management">Property Management</option>
                    <option value="Head Office Staff">Head Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subcity</label>
                  <select
                    value={subcity}
                    onChange={(e) => setSubcity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value="Kirkos">Kirkos</option>
                    <option value="Bole">Bole</option>
                    <option value="Yeka">Yeka</option>
                    <option value="Gullele">Gullele</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Base Salary (ETB)</label>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
