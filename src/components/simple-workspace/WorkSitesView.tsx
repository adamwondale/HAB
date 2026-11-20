import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { ClientSite, Deployment, Employee } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';
import { StandardPageLayout } from './StandardPageLayout';
import { UnassignedDispatchDock } from './UnassignedDispatchDock';
import { WorkSiteAssignForm } from './WorkSiteAssignForm';
import { WorkSitesTable } from './WorkSitesTable';
import { SiteTransferCard } from './SiteTransferCard';

interface WorkSitesViewProps {
  sites: ClientSite[];
  employees: Employee[];
  deployments?: Deployment[];
  onDeployEmployee: (newDeployment: Deployment) => void;
  onRelieveDeployment?: (deploymentId: string) => void;
}

export const WorkSitesView: React.FC<WorkSitesViewProps> = ({
  sites,
  employees,
  onDeployEmployee
}) => {
  const { t } = useTranslation();
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [statusTab, setStatusTab] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInlineFormOpen, setIsInlineFormOpen] = useState<boolean>(false);

  // Drag & drop state
  const [draggedEmployee, setDraggedEmployee] = useState<Employee | null>(null);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  const unassignedEmployees = employees.filter(
    (e) => e.status === 'Active' && !e.currentSiteId && !e.currentSiteName
  );

  const activeSites = sites.filter((s) => s.status === 'Active');
  const inactiveSites = sites.filter((s) => s.status !== 'Active');
  const totalRequired = activeSites.reduce((s, x) => s + x.securityStaffRequired + x.cleaningStaffRequired, 0);
  const totalDeployed = activeSites.reduce((s, x) => s + x.securityStaffDeployed + x.cleaningStaffDeployed, 0);

  const filteredSites = sites.filter((site) => {
    const isActive = site.status === 'Active';
    if (statusTab === 'Active' && !isActive) return false;
    if (statusTab === 'Inactive' && isActive) return false;
    if (districtFilter !== 'All' && site.district !== districtFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        site.name.toLowerCase().includes(q) ||
        site.siteCode.toLowerCase().includes(q) ||
        site.clientOrganization.toLowerCase().includes(q) ||
        (site.district && site.district.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAssign = (empId: string, siteId: string, postName: string) => {
    const emp = employees.find((e) => e.id === empId);
    const site = sites.find((s) => s.id === siteId);
    if (!emp || !site) return;

    const newDep: Deployment = {
      id: `dep-${Date.now()}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      serviceType: emp.serviceType,
      role: emp.role,
      siteId: site.id,
      siteName: site.name,
      post: postName,
      shift: emp.serviceType === 'Security' ? '24h Duty (24hr ON / 48hr REST)' : 'Morning Shift (06:00 - 14:00)',
      assignedDate: new Date().toISOString().slice(0, 10),
      status: 'Active'
    };

    emp.currentSiteId = site.id;
    emp.currentSiteName = site.name;
    onDeployEmployee(newDep);
    setDraggedEmployee(null);
    setHoveredSiteId(null);
    setIsInlineFormOpen(false);
  };

  const handleDownload = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `HAB_Work_Sites_${date}.csv`,
      [
        t('deployment.siteCode'),
        t('deployment.siteName'),
        t('deployment.district'),
        t('deployment.client'),
        t('deployment.requiredStaff'),
        t('deployment.deployedStaff'),
        t('deployment.status')
      ],
      filteredSites.map((s) => [
        s.siteCode,
        s.name,
        s.district || t('deployment.unassigned'),
        s.clientOrganization,
        s.securityStaffRequired + s.cleaningStaffRequired,
        s.securityStaffDeployed + s.cleaningStaffDeployed,
        s.status
      ])
    );
  };

  return (
    <StandardPageLayout
      title={t('deployment.workSites')}
      description={t('deployment.workSitesDesc')}
      guideKey="work_sites"
      metrics={[
        { label: 'Active Sites', value: String(activeSites.length) },
        { label: 'Deployed Staff', value: String(totalDeployed) },
        { label: 'Need Deployment', value: String(Math.max(0, totalRequired - totalDeployed)) }
      ]}
      mainAction={{
        label: t('deployment.assignEmployee'),
        isOpen: isInlineFormOpen,
        onClick: () => setIsInlineFormOpen((prev) => !prev),
        icon: <UserPlus className="h-3.5 w-3.5" />
      }}
      search={{
        query: searchQuery,
        onChange: setSearchQuery,
        placeholder: t('deployment.searchPlaceholder')
      }}
      filter={{
        label: t('deployment.districtFilter'),
        value: districtFilter,
        onChange: setDistrictFilter,
        options: [
          { value: 'All', label: t('deployment.allDistricts') },
          { value: 'District 1 (South)', label: t('deployment.district1South') },
          { value: 'District 2 (Central)', label: t('deployment.district2Central') },
          { value: 'District 3 (North)', label: t('deployment.district3North') },
          { value: 'District 4 (East)', label: t('deployment.district4East') }
        ]
      }}
      pillToggle={{
        activeKey: statusTab,
        onChange: (key) => setStatusTab(key as 'Active' | 'Inactive'),
        items: [
          { key: 'Active', label: t('common.active'), count: activeSites.length },
          { key: 'Inactive', label: t('common.inactive'), count: inactiveSites.length }
        ]
      }}
      inlineForm={
        isInlineFormOpen && (
          <WorkSiteAssignForm
            unassignedEmployees={unassignedEmployees}
            sites={sites}
            filteredSites={filteredSites}
            onAssign={handleAssign}
            onCancel={() => setIsInlineFormOpen(false)}
          />
        )
      }
      extraWidget={
        <div className="space-y-4">
          <SiteTransferCard sites={sites} employees={employees} />
          <UnassignedDispatchDock
            unassignedEmployees={unassignedEmployees}
            sites={sites}
            draggedEmployee={draggedEmployee}
            onDragStart={(emp) => setDraggedEmployee(emp)}
            onDragEnd={() => {
              setDraggedEmployee(null);
              setHoveredSiteId(null);
            }}
            onAssign={handleAssign}
          />
        </div>
      }
      columns={[]}
      rows={[]}
      onDownloadReport={handleDownload}
    >
      <WorkSitesTable
        filteredSites={filteredSites}
        draggedEmployee={draggedEmployee}
        hoveredSiteId={hoveredSiteId}
        onHoverSite={setHoveredSiteId}
        onAssign={handleAssign}
      />
    </StandardPageLayout>
  );
};
