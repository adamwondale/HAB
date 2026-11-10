import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { formatEtb, toneForStatus } from './modelHelpers';

export function buildFinanceModel(moduleId: ModuleId, data: WorkspaceData): ModuleModel | null {
  if (moduleId === 'payroll') {
    const netPay = data.payroll.reduce((sum, record) => sum + record.netPay, 0);
    const waiting = data.payroll.filter(record => record.paymentStatus !== 'Disbursed').length;
    const paid = data.payroll.filter(record => record.paymentStatus === 'Disbursed').length;

    return {
      title: 'Payroll',
      description: 'Check employee pay and payment status for this month.',
      reportName: 'payroll',
      searchLabel: 'Search payroll',
      metrics: [
        { label: 'Net pay', value: formatEtb(netPay) },
        { label: 'Paid', value: String(paid) },
        { label: 'Waiting', value: String(waiting) }
      ],
      columns: [
        { key: 'employee', label: 'Employee' },
        { key: 'site', label: 'Work site' },
        { key: 'days', label: 'Days worked', numeric: true },
        { key: 'netPay', label: 'Net pay', numeric: true },
        { key: 'status', label: 'Status' }
      ],
      rows: data.payroll.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.paymentStatus}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          site: record.siteName,
          days: `${record.workingDays} of ${record.fullWorkingDays}`,
          netPay: formatEtb(record.netPay),
          status: record.paymentStatus
        },
        tones: { status: toneForStatus(record.paymentStatus) }
      })),
      emptyMessage: 'No payroll records found.'
    };
  }

  if (moduleId === 'store') {
    const value = data.stockItems.reduce((sum, item) => sum + item.quantityInStock * item.unitCostETB, 0);
    const low = data.stockItems.filter(item => item.quantityInStock <= item.minReorderLevel).length;
    const returnable = data.stockItems.filter(item => item.isReturnable).length;

    return {
      title: 'Store',
      description: 'Track company items, uniforms, chemicals, and equipment.',
      reportName: 'store_inventory',
      searchLabel: 'Search store items',
      metrics: [
        { label: 'Stock value', value: formatEtb(value) },
        { label: 'Low stock', value: String(low) },
        { label: 'Returnable items', value: String(returnable) }
      ],
      columns: [
        { key: 'item', label: 'Item' },
        { key: 'category', label: 'Category' },
        { key: 'location', label: 'Storage bay' },
        { key: 'stock', label: 'In stock', numeric: true },
        { key: 'status', label: 'Status' }
      ],
      rows: data.stockItems.map(item => {
        const isLow = item.quantityInStock <= item.minReorderLevel;
        return {
          id: item.id,
          searchText: `${item.name} ${item.itemCode} ${item.category} ${item.storageLocation}`,
          values: {
            item: `${item.name} · ${item.itemCode}`,
            category: item.category,
            location: item.storageLocation,
            stock: `${item.quantityInStock} ${item.unit}`,
            status: isLow ? 'Low stock' : 'Enough stock'
          },
          tones: { status: isLow ? 'warn' : 'good' }
        };
      }),
      emptyMessage: 'No store items found.'
    };
  }

  if (moduleId === 'master-setup') {
    const rules = data.masterConfig;
    const lastUpdated = rules.lastUpdatedAt.split('T')[0];

    return {
      title: 'Settings',
      description: 'See the main rules used for payroll, leave, shifts, and stock.',
      reportName: 'system_settings',
      searchLabel: 'Search settings',
      metrics: [
        { label: 'Version', value: rules.version },
        { label: 'Last updated', value: lastUpdated },
        { label: 'Updated by', value: rules.lastUpdatedBy }
      ],
      columns: [
        { key: 'area', label: 'Area' },
        { key: 'setting', label: 'Setting' },
        { key: 'value', label: 'Value' },
        { key: 'usedFor', label: 'Used for' }
      ],
      rows: [
        {
          id: 'working-days',
          searchText: 'working days payroll',
          values: { area: 'Payroll', setting: 'Working days', value: String(rules.pensionAndPayroll.standardWorkingDays), usedFor: 'Monthly pay' }
        },
        {
          id: 'employee-pension',
          searchText: 'employee pension payroll',
          values: { area: 'Payroll', setting: 'Employee pension', value: `${rules.pensionAndPayroll.employeePensionPercent}%`, usedFor: 'Pay deductions' }
        },
        {
          id: 'employer-pension',
          searchText: 'employer pension payroll',
          values: { area: 'Payroll', setting: 'Company pension', value: `${rules.pensionAndPayroll.employerPensionPercent}%`, usedFor: 'Company costs' }
        },
        {
          id: 'daily-hours',
          searchText: 'daily hours shift',
          values: { area: 'Work time', setting: 'Daily hours', value: String(rules.shiftsAndOvertime.standardDailyHours), usedFor: 'Attendance' }
        },
        {
          id: 'overtime',
          searchText: 'overtime multiplier pay',
          values: { area: 'Work time', setting: 'Normal overtime rate', value: `${rules.shiftsAndOvertime.regularOtMultiplier}×`, usedFor: 'Overtime pay' }
        },
        {
          id: 'leave-rules',
          searchText: 'leave rules',
          values: { area: 'Leave', setting: 'Leave types', value: String(rules.leaveQuotas.length), usedFor: 'Leave requests' }
        },
        {
          id: 'stock-rules',
          searchText: 'stock rules property',
          values: { area: 'Property', setting: 'Stock rules', value: String(rules.inventoryThresholds.length), usedFor: 'Low stock warnings' }
        }
      ],
      emptyMessage: 'No settings found.',
      note: 'This prototype shows settings as read-only to keep the page simple.'
    };
  }

  return null;
}
