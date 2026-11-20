import { ModuleId, ModuleModel, WorkspaceData } from './types';
import { formatEtb, toneForStatus } from './modelHelpers';

type TFn = (key: string, options?: any) => string;

export function buildFinanceModel(moduleId: ModuleId, data: WorkspaceData, t: TFn): ModuleModel | null {
  if (moduleId === 'payroll') {
    const netPay = data.payroll.reduce((sum, r) => sum + r.netPay, 0);
    const waiting = data.payroll.filter(r => r.paymentStatus !== 'Disbursed').length;
    const paid = data.payroll.filter(r => r.paymentStatus === 'Disbursed').length;

    return {
      title: t('payroll.title'),
      description: t('payroll.subtitle'),
      reportName: 'payroll',
      searchLabel: t('payroll.searchPlaceholder'),
      metrics: [
        { label: t('payroll.netPayable'), value: formatEtb(netPay) },
        { label: t('payroll.paid'), value: String(paid) },
        { label: t('payroll.unpaidDraft'), value: String(waiting) }
      ],
      columns: [
        { key: 'employee', label: t('payroll.employee') },
        { key: 'site', label: t('payroll.site') },
        { key: 'days', label: t('payroll.daysWorked'), numeric: true },
        { key: 'netPay', label: t('payroll.netPay'), numeric: true },
        { key: 'status', label: t('payroll.paymentStatus') }
      ],
      rows: data.payroll.map(record => ({
        id: record.id,
        searchText: `${record.employeeName} ${record.employeeCode} ${record.siteName} ${record.paymentStatus}`,
        values: {
          employee: `${record.employeeName} · ${record.employeeCode}`,
          site: record.siteName,
          days: `${record.workingDays} / ${record.fullWorkingDays}`,
          netPay: formatEtb(record.netPay),
          status: record.paymentStatus === 'Disbursed' ? t('payroll.paid') : t('payroll.unpaidDraft')
        },
        tones: { status: toneForStatus(record.paymentStatus) }
      })),
      emptyMessage: t('payroll.noRecordsFound')
    };
  }

  if (moduleId === 'store') {
    const value = data.stockItems.reduce((sum, item) => sum + item.quantityInStock * item.unitCostETB, 0);
    const low = data.stockItems.filter(item => item.quantityInStock <= item.minReorderLevel).length;
    const returnable = data.stockItems.filter(item => item.isReturnable).length;

    return {
      title: t('store.title'),
      description: t('store.subtitle'),
      reportName: 'store_inventory',
      searchLabel: t('store.searchItems'),
      metrics: [
        { label: t('store.totalValuation'), value: formatEtb(value) },
        { label: t('store.lowStockAlerts'), value: String(low) },
        { label: t('store.equipmentAllocation'), value: String(returnable) }
      ],
      columns: [
        { key: 'item', label: t('store.itemName') },
        { key: 'category', label: t('store.category') },
        { key: 'location', label: t('store.storageLocation') },
        { key: 'stock', label: t('store.stockBalance'), numeric: true },
        { key: 'status', label: t('common.actions') }
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
            status: isLow ? t('store.lowStockAlerts') : t('common.active')
          },
          tones: { status: isLow ? 'warn' : 'good' }
        };
      }),
      emptyMessage: t('common.noRecordsFound')
    };
  }

  if (moduleId === 'master-setup') {
    const rules = data.masterConfig;
    const lastUpdated = rules.lastUpdatedAt.split('T')[0];

    return {
      title: t('masterSetup.title'),
      description: t('masterSetup.subtitle'),
      reportName: 'system_settings',
      searchLabel: t('common.findPage'),
      metrics: [
        { label: t('masterSetup.systemVersion'), value: rules.version },
        { label: t('masterSetup.lastUpdated'), value: lastUpdated },
        { label: t('masterSetup.updatedBy'), value: rules.lastUpdatedBy }
      ],
      columns: [
        { key: 'area', label: t('common.details') },
        { key: 'setting', label: t('masterSetup.settings') },
        { key: 'value', label: t('masterSetup.rateEtb') },
        { key: 'usedFor', label: t('masterSetup.description') }
      ],
      rows: [
        {
          id: 'working-days',
          searchText: 'working days payroll',
          values: { area: t('payroll.title'), setting: t('masterSetup.standardDays'), value: String(rules.pensionAndPayroll.standardWorkingDays), usedFor: t('payroll.title') }
        },
        {
          id: 'employee-pension',
          searchText: 'employee pension payroll',
          values: { area: t('payroll.title'), setting: t('masterSetup.employeePensionRate'), value: `${rules.pensionAndPayroll.employeePensionPercent}%`, usedFor: t('payroll.deductions') }
        },
        {
          id: 'employer-pension',
          searchText: 'employer pension payroll',
          values: { area: t('payroll.title'), setting: t('masterSetup.companyPensionRate'), value: `${rules.pensionAndPayroll.employerPensionPercent}%`, usedFor: t('masterSetup.statutoryRate') }
        },
        {
          id: 'daily-hours',
          searchText: 'daily hours shift',
          values: { area: t('attendance.title'), setting: t('attendance.scheduledShift'), value: String(rules.shiftsAndOvertime.standardDailyHours), usedFor: t('attendance.title') }
        },
        {
          id: 'overtime',
          searchText: 'overtime multiplier pay',
          values: { area: t('attendance.title'), setting: t('payroll.overtime'), value: `${rules.shiftsAndOvertime.regularOtMultiplier}×`, usedFor: t('payroll.title') }
        },
        {
          id: 'leave-rules',
          searchText: 'leave rules',
          values: { area: t('hr.leaveBalance'), setting: t('hr.leaveRequest'), value: String(rules.leaveQuotas.length), usedFor: t('hr.leaveRequest') }
        },
        {
          id: 'stock-rules',
          searchText: 'stock rules property',
          values: { area: t('store.title'), setting: t('store.minReorderLevel'), value: String(rules.inventoryThresholds.length), usedFor: t('store.lowStockAlerts') }
        }
      ],
      emptyMessage: t('common.noRecordsFound'),
      note: t('masterSetup.statutoryPensionRule')
    };
  }

  return null;
}
