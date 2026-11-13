import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Employee, ServiceType } from '../../types/hrm';
import { SystemMasterConfig } from '../../types/masterConfig';
import { getDivisionGradeDefaults } from '../../utils/masterConfigEngine';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (newEmp: Employee) => void;
  existingCount: number;
  masterConfig?: SystemMasterConfig;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  existingCount,
  masterConfig
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Security');
  const [role, setRole] = useState('Security Guard');
  const [phone, setPhone] = useState('+251 9');
  const [subcity, setSubcity] = useState('Kirkos');
  const [baseSalary, setBaseSalary] = useState(7000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const nextIdNum = 100 + existingCount + 1;
    const prefix =
      serviceType === 'Security' ? 'HAB-SEC' :
      serviceType === 'Cleaning' ? 'HAB-CLN' :
      serviceType === 'Property Management' ? 'HAB-PRP' : 'HAB-HQ';
    const code = `${prefix}-0${nextIdNum}`;

    const gradeDefaults = getDivisionGradeDefaults(serviceType, 'L1', masterConfig);

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
      kebele: 'Kebele 02',
      woreda: 'Woreda 03',
      subcity,
      emergencyContact: { name: 'Family Contact', phone, relation: 'Relative' },
      guarantor: { name: 'Ato Kassa Mulugeta', phone, organization: 'Government Office', kebeleId: 'KB-88912', verified: true },
      bankAccount: { bankName: 'Commercial Bank of Ethiopia (CBE)', accountNumber: '1000' + Math.floor(100000000 + Math.random() * 900000000) },
      salary: {
        baseSalary,
        siteAllowance: gradeDefaults.defaultSiteAllowance,
        shiftAllowance: gradeDefaults.defaultShiftAllowance,
        hazardAllowance: gradeDefaults.defaultHazardAllowance
      },
      currentShift: serviceType === 'Security' ? '24h Duty (24hr ON / 48hr REST)' : 'Regular Office Hours (08:00 - 17:00)',
      uniformSizes: { shirt: 'L', trousers: '32', boots: '42' }
    };

    onAddEmployee(newEmp);
    onClose();
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New Employee</h2>
            <p className="text-xs text-slate-500">Register employee record in master HRM directory</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">First Name *</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Last Name *</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Division *</label>
              <select
                value={serviceType}
                onChange={e => {
                  const st = e.target.value as ServiceType;
                  setServiceType(st);
                  if (st === 'Security') setRole('Security Guard');
                  else if (st === 'Cleaning') setRole('Commercial Cleaner');
                  else if (st === 'Property Management') setRole('Facility Maintenance Technician');
                  else setRole('HR & Administrative Officer');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700"
              >
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Property Management">Property Management</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Phone *</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Role Title</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Subcity</label>
              <select value={subcity} onChange={e => setSubcity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700">
                <option value="Kirkos">Kirkos</option>
                <option value="Bole">Bole</option>
                <option value="Yeka">Yeka</option>
                <option value="Gullele">Gullele</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">Base Salary (ETB)</label>
            <input type="number" value={baseSalary} onChange={e => setBaseSalary(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg dark:bg-slate-800 dark:text-slate-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-[#F2C46A] hover:bg-[#e2b356] text-[#4C4541] text-xs font-bold rounded-lg shadow-xs">Save Employee</button>
        </div>
      </form>
    </div>
  );
};
