import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle } from 'lucide-react';
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
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Security');
  const [role, setRole] = useState('Security Guard');
  const [phone, setPhone] = useState('+251 9');
  const [subcity, setSubcity] = useState('Kirkos');
  const [baseSalary, setBaseSalary] = useState(7000);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (fieldValues = { firstName, lastName, phone, role, baseSalary }) => {
    const errs: Record<string, string> = {};
    const nameRegex = /^[A-Za-z\u1200-\u137F\s'-]{2,}$/;
    const phoneClean = fieldValues.phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+251[79]\d{8}|0[79]\d{8})$/;

    if (!fieldValues.firstName.trim()) {
      errs.firstName = 'First name is required.';
    } else if (!nameRegex.test(fieldValues.firstName.trim())) {
      errs.firstName = 'At least 2 characters (letters only).';
    }

    if (!fieldValues.lastName.trim()) {
      errs.lastName = 'Last name is required.';
    } else if (!nameRegex.test(fieldValues.lastName.trim())) {
      errs.lastName = 'At least 2 characters (letters only).';
    }

    if (!phoneClean) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(phoneClean)) {
      errs.phone = 'Use valid Ethiopian mobile (+251 9/7... or 09/07...).';
    }

    if (!fieldValues.role.trim()) {
      errs.role = 'Role title is required.';
    }

    if (!fieldValues.baseSalary || fieldValues.baseSalary < 1000) {
      errs.baseSalary = 'Minimum salary is 1,000 ETB.';
    } else if (fieldValues.baseSalary > 500000) {
      errs.baseSalary = 'Salary cannot exceed 500,000 ETB.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, phone: true, role: true, baseSalary: true });

    if (!validate()) return;

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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender: 'Male',
      phone: phone.trim(),
      email: `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}@hab-business.com`,
      dateOfBirth: '1995-05-15',
      hireDate: new Date().toISOString().split('T')[0],
      serviceType,
      role: role.trim(),
      grade: 'L1',
      status: 'Probation',
      nationalId: `ET-NID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      kebele: 'Kebele 02',
      woreda: 'Woreda 03',
      subcity,
      emergencyContact: { name: 'Family Contact', phone: phone.trim(), relation: 'Relative' },
      guarantor: { name: 'Ato Kassa Mulugeta', phone: phone.trim(), organization: 'Government Office', kebeleId: 'KB-88912', verified: true },
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
    setTouched({});
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full bg-slate-50 border rounded p-2 text-slate-800 focus:outline-none transition-colors dark:bg-slate-800 dark:text-white ${
      touched[field] && errors[field]
        ? 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20'
        : 'border-slate-200 dark:border-slate-700 focus:border-[#F2C46A]'
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('hr.addNewStaffRecord')}</h2>
            <p className="text-xs text-slate-500">{t('hr.subtitle')}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('hr.firstName')} *</label>
              <input type="text" value={firstName} onChange={e => { setFirstName(e.target.value); if (touched.firstName) validate({ ... { firstName: e.target.value, lastName, phone, role, baseSalary } }); }} onBlur={() => handleBlur('firstName')} className={inputClass('firstName')} placeholder="e.g. Abebe" />
              {touched.firstName && errors.firstName && <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-2.5 h-2.5" />{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('hr.lastName')} *</label>
              <input type="text" value={lastName} onChange={e => { setLastName(e.target.value); if (touched.lastName) validate({ ... { firstName, lastName: e.target.value, phone, role, baseSalary } }); }} onBlur={() => handleBlur('lastName')} className={inputClass('lastName')} placeholder="e.g. Kebede" />
              {touched.lastName && errors.lastName && <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-2.5 h-2.5" />{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('recruitment.division')} *</label>
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
                <option value="Security">{t('common.security')}</option>
                <option value="Cleaning">{t('common.cleaning')}</option>
                <option value="Property Management">{t('common.propertyManagement')}</option>
                <option value="Head Office Staff">{t('common.headOfficeStaff')}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('common.phone')} *</label>
              <input type="text" value={phone} onChange={e => { setPhone(e.target.value); if (touched.phone) validate({ ... { firstName, lastName, phone: e.target.value, role, baseSalary } }); }} onBlur={() => handleBlur('phone')} className={inputClass('phone')} placeholder="+251 9..." />
              {touched.phone && errors.phone && <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-2.5 h-2.5" />{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('hr.roleTitle')} *</label>
              <input type="text" value={role} onChange={e => { setRole(e.target.value); if (touched.role) validate({ ... { firstName, lastName, phone, role: e.target.value, baseSalary } }); }} onBlur={() => handleBlur('role')} className={inputClass('role')} />
              {touched.role && errors.role && <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-2.5 h-2.5" />{errors.role}</p>}
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('hr.subcity')}</label>
              <select value={subcity} onChange={e => setSubcity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-white dark:border-slate-700">
                <option value="Kirkos">Kirkos</option>
                <option value="Bole">Bole</option>
                <option value="Yeka">Yeka</option>
                <option value="Gullele">Gullele</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 dark:text-slate-300">{t('common.baseSalary')} (ETB) *</label>
            <input type="number" min={1000} max={500000} step={100} value={baseSalary} onChange={e => { const val = Number(e.target.value); setBaseSalary(val); if (touched.baseSalary) validate({ ... { firstName, lastName, phone, role, baseSalary: val } }); }} onBlur={() => handleBlur('baseSalary')} className={inputClass('baseSalary')} />
            {touched.baseSalary && errors.baseSalary && <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-2.5 h-2.5" />{errors.baseSalary}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg dark:bg-slate-800 dark:text-slate-300">{t('common.cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-[#F2C46A] hover:bg-[#e2b356] text-[#4C4541] text-xs font-bold rounded-lg shadow-xs">{t('common.save')}</button>
        </div>
      </form>
    </div>
  );
};
