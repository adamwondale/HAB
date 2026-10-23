import React, { useState } from 'react';
import { 
  MapPin, 
  Shield, 
  Sparkles, 
  Users, 
  Clock, 
  Plus, 
  Search, 
  Building2,
  ArrowRight,
  RotateCw,
  Calendar,
  CheckCircle2,
  Sun,
  Moon,
  Info,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { ClientSite, Deployment, Employee, ServiceType, ShiftType, SecurityPlatoon } from '../types/hrm';

interface DeploymentViewProps {
  sites: ClientSite[];
  deployments: Deployment[];
  employees: Employee[];
  onDeployEmployee: (newDeployment: Deployment) => void;
  onRelieveDeployment: (deploymentId: string) => void;
}

export const DeploymentView: React.FC<DeploymentViewProps> = ({
  sites,
  deployments,
  employees,
  onDeployEmployee,
  onRelieveDeployment
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'shift-matrix'>('posts');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('All');
  const [filterService, setFilterService] = useState<'All' | ServiceType>('All');
  const [filterShift, setFilterShift] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Live state for weekly rotation and security platoon handover
  const [cleaningRotationWeek, setCleaningRotationWeek] = useState<'Week 1 (Morning)' | 'Week 2 (Afternoon)'>('Week 1 (Morning)');
  const [activeSecurityPlatoon, setActiveSecurityPlatoon] = useState<SecurityPlatoon>('Platoon Alpha');
  const [rotationMessage, setRotationMessage] = useState<string | null>(null);

  // Deploy modal form state
  const [deployEmployeeId, setDeployEmployeeId] = useState<string>('');
  const [deploySiteId, setDeploySiteId] = useState<string>(sites[0]?.id || '');
  const [deployPost, setDeployPost] = useState<string>('');
  const [deployShift, setDeployShift] = useState<ShiftType>('24h Duty (24hr ON / 48hr REST)');
  const [deployPlatoon, setDeployPlatoon] = useState<SecurityPlatoon>('Platoon Alpha');
  const [deployCleaningWeek, setDeployCleaningWeek] = useState<'Week 1 (Morning)' | 'Week 2 (Afternoon)'>('Week 1 (Morning)');
  const [supervisorNotes, setSupervisorNotes] = useState<string>('');

  const targetSite = sites.find(s => s.id === deploySiteId) || sites[0];
  const selectedEmp = employees.find(e => e.id === deployEmployeeId);

  // Handle employee change in modal to auto-set appropriate shift policy
  const handleSelectEmployee = (empId: string) => {
    setDeployEmployeeId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      if (emp.serviceType === 'Security') {
        setDeployShift('24h Duty (24hr ON / 48hr REST)');
        setDeployPlatoon(emp.securityPlatoon || 'Platoon Alpha');
      } else {
        setDeployShift('Morning Shift (06:00 - 14:00)');
        setDeployCleaningWeek(emp.cleaningShiftWeek || 'Week 1 (Morning)');
      }
    }
  };

  const filteredDeployments = deployments.filter(d => {
    if (selectedSiteId !== 'All' && d.siteId !== selectedSiteId) return false;
    if (filterService !== 'All' && d.serviceType !== filterService) return false;
    if (filterShift !== 'All' && d.shift !== filterShift) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.employeeName.toLowerCase().includes(q) ||
        d.employeeCode.toLowerCase().includes(q) ||
        d.post.toLowerCase().includes(q) ||
        d.siteName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenDeployModal = (siteId?: string) => {
    if (siteId) {
      setDeploySiteId(siteId);
      const site = sites.find(s => s.id === siteId);
      if (site && site.posts.length > 0) {
        setDeployPost(site.posts[0]);
      }
    } else if (targetSite && targetSite.posts.length > 0) {
      setDeployPost(targetSite.posts[0]);
    }
    setIsDeployModalOpen(true);
  };

  const handleConfirmDeploy = () => {
    if (!deployEmployeeId || !deploySiteId) return;
    const emp = employees.find(e => e.id === deployEmployeeId);
    const site = sites.find(s => s.id === deploySiteId);
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
      post: deployPost || site.posts[0] || 'Main Perimeter Gate',
      shift: deployShift,
      securityPlatoon: emp.serviceType === 'Security' ? deployPlatoon : undefined,
      cleaningShiftWeek: emp.serviceType === 'Cleaning' ? deployCleaningWeek : undefined,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      supervisorNotes: supervisorNotes || 'Assigned via HR Deployment Engine'
    };

    onDeployEmployee(newDep);
    setIsDeployModalOpen(false);
    setDeployEmployeeId('');
    setSupervisorNotes('');
  };

  // Cleaning shift rotation executor
  const handleRotateCleaningWeeklyShifts = () => {
    const nextWeek = cleaningRotationWeek === 'Week 1 (Morning)' ? 'Week 2 (Afternoon)' : 'Week 1 (Morning)';
    setCleaningRotationWeek(nextWeek);
    setRotationMessage(`Cleaning Shift Rotation Executed: Advanced to ${nextWeek}. Cleaners on Morning have switched to Afternoon Shift, and Afternoon to Morning Shift.`);
    setTimeout(() => setRotationMessage(null), 6000);
  };

  // Security 24h handover cycle executor
  const handleAdvanceSecurity24hHandover = () => {
    let nextPlatoon: SecurityPlatoon = 'Platoon Bravo';
    if (activeSecurityPlatoon === 'Platoon Alpha') nextPlatoon = 'Platoon Bravo';
    else if (activeSecurityPlatoon === 'Platoon Bravo') nextPlatoon = 'Platoon Charlie';
    else nextPlatoon = 'Platoon Alpha';

    setActiveSecurityPlatoon(nextPlatoon);
    setRotationMessage(`Security Handover Executed: ${nextPlatoon} is now on 24h Active Duty. Previous squad transitioned to 48-Hour Recovery Rest.`);
    setTimeout(() => setRotationMessage(null), 6000);
  };

  // Active cleaners and guards deployed
  const activeCleaners = deployments.filter(d => d.serviceType === 'Cleaning' && d.status === 'Active');
  const activeGuards = deployments.filter(d => d.serviceType === 'Security' && d.status === 'Active');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wide">
            Client Site Operations & Scheduling
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Workforce Deployment & Shift Rosters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <strong>Cleaning Policy:</strong> 2 shifts (Morning & Afternoon) alternating weekly · <strong>Security Policy:</strong> 24hr duty with 48hr recovery rest.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleOpenDeployModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Deployment</span>
          </button>
        </div>
      </div>

      {/* View Mode Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'posts'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Client Sites & Duty Posts ({deployments.filter(d => d.status === 'Active').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shift-matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'shift-matrix'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>Shift Rotation Matrix (Weekly & 24/48 Cycle)</span>
        </button>
      </div>

      {/* Rotation Status Alert Banner */}
      {rotationMessage && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 p-4 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{rotationMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setRotationMessage(null)}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* SUB-TAB 1: CLIENT SITES & POSTS */}
      {activeSubTab === 'posts' && (
        <div className="space-y-6">

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                aria-label="Filter deployments by division"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
              >
                <option value="All">All 4 Divisions</option>
                <option value="Security">Security Division (24h Duty)</option>
                <option value="Cleaning">Cleaning Division (Weekly Alternating)</option>
                <option value="Property Management">Property Management Division</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>

              <select
                aria-label="Filter by site"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
              >
                <option value="All">All Facilities</option>
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                aria-label="Filter by shift time"
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
              >
                <option value="All">All Shifts</option>
                <option value="24h Duty (24hr ON / 48hr REST)">24h Duty (24hr ON / 48hr REST)</option>
                <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                <option value="Afternoon Shift (14:00 - 22:00)">Afternoon Shift (14:00 - 22:00)</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search staff, code, or post..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>
          </div>

          {/* Active Deployments Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs min-w-[780px]">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5">Staff Member</th>
                  <th className="py-4 px-5">Division</th>
                  <th className="py-4 px-5">Client Site</th>
                  <th className="py-4 px-5">Assigned Post</th>
                  <th className="py-4 px-5">Shift & Operational Cycle</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {filteredDeployments.map((dep) => (
                  <tr key={dep.id} className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/80 even:dark:bg-slate-800/40 hover:bg-slate-100/70 hover:dark:bg-slate-800/70 transition-colors">
                    <td className="py-4 px-5 font-normal">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{dep.employeeName}</div>
                      <div className="text-[11px] font-mono text-slate-400 dark:text-slate-400 mt-0.5">{dep.employeeCode} · {dep.role}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-max ${
                        dep.serviceType === 'Security'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                      }`}>
                        {dep.serviceType === 'Security' ? <Shield className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        <span>{dep.serviceType}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {dep.siteName}
                    </td>
                    <td className="py-4 px-5">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px]">
                        {dep.post}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {dep.serviceType === 'Security' ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                            24h ON / 48h REST
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60">
                            {dep.securityPlatoon || 'Platoon Alpha'}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                            {dep.shift.includes('Morning') ? 'Morning (06:00 - 14:00)' : 'Afternoon (14:00 - 22:00)'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                            <ArrowRightLeft className="w-2.5 h-2.5" />
                            <span>Weekly Alternating</span>
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        dep.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-normal">
                      {dep.status === 'Active' && (
                        <button
                          type="button"
                          onClick={() => onRelieveDeployment(dep.id)}
                          className="px-2.5 py-1 text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors text-[11px] font-medium"
                        >
                          Relieve Post
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SHIFT ROTATION MATRIX (CLEANING & SECURITY) */}
      {activeSubTab === 'shift-matrix' && (
        <div className="space-y-8">
          
          {/* SECTION 1: CLEANING SERVICE WEEKLY SHIFT ROTATION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Cleaning Services: 2-Shift Weekly Rotation Schedule
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Policy:</strong> Two shifts — <strong className="text-slate-800 dark:text-slate-200">Morning (06:00 - 14:00)</strong> and <strong className="text-slate-800 dark:text-slate-200">Afternoon (14:00 - 22:00)</strong>. Personnel work in the morning for 1 week, then shift to afternoon next week.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Cycle</div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                    {cleaningRotationWeek}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRotateCleaningWeeklyShifts}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Execute Weekly Rotation</span>
                </button>
              </div>
            </div>

            {/* Shift Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Shift 1: Morning (06:00 - 14:00)</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    {activeCleaners.filter(c => c.shift.includes('Morning')).length} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Operates early facility opening, high-traffic morning lobby sanitation, and sanitary restroom readiness. Swaps to Afternoon next week.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Shift 2: Afternoon (14:00 - 22:00)</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    {activeCleaners.filter(c => c.shift.includes('Afternoon') || c.shift.includes('Evening')).length} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Operates mid-day refresh, evening waste disposal, floor polishing, and post-business closure cleaning. Swaps to Morning next week.
                </p>
              </div>
            </div>

            {/* Cleaners Weekly Rotation Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Cleaner</th>
                    <th className="py-3 px-4">Assigned Site & Post</th>
                    <th className="py-3 px-4">Current Shift (This Week)</th>
                    <th className="py-3 px-4">Next Week Shift (Auto-Swap)</th>
                    <th className="py-3 px-4 text-right">Cycle Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {activeCleaners.map(cleaner => {
                    const isMorning = cleaner.shift.includes('Morning');
                    const nextShiftLabel = isMorning ? 'Afternoon Shift (14:00 - 22:00)' : 'Morning Shift (06:00 - 14:00)';

                    return (
                      <tr key={cleaner.id} className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/80 even:dark:bg-slate-800/40 hover:bg-slate-100/70 hover:dark:bg-slate-800/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{cleaner.employeeName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{cleaner.employeeCode}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          <div>{cleaner.siteName}</div>
                          <div className="text-[11px] text-slate-400">{cleaner.post}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            isMorning 
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}>
                            {isMorning ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                            <span>{cleaner.shift}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 font-medium">
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <span>{nextShiftLabel}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Scheduled on Monday</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setRotationMessage(`Shift switched for ${cleaner.employeeName} to ${nextShiftLabel}`);
                              setTimeout(() => setRotationMessage(null), 5000);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800/40 transition-colors"
                          >
                            Swap Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: SECURITY SERVICE 24hr ON / 48hr REST CYCLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    <Shield className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Security Services: 24hr Duty / 48hr Mandatory Rest Platoon System
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Policy:</strong> Personnel work <strong>24 continuous hours</strong> on post, followed by <strong>48 hours recovery rest</strong> (3-Squad Cyclic Platoon: Alpha, Bravo, Charlie).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAdvanceSecurity24hHandover}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Advance 24h Shift Handover</span>
              </button>
            </div>

            {/* 3 Platoon Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Platoon Alpha */}
              <div className={`border rounded-xl p-4 space-y-2 transition-all ${
                activeSecurityPlatoon === 'Platoon Alpha'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Platoon Alpha</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeSecurityPlatoon === 'Platoon Alpha'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {activeSecurityPlatoon === 'Platoon Alpha' ? '🟢 ON DUTY 24H' : 'REST / OFF'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {activeSecurityPlatoon === 'Platoon Alpha' ? 'Active 24h Watch (07:00 - 07:00)' : 'Mandatory Recovery Rest Period'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeGuards.filter(g => g.securityPlatoon === 'Platoon Alpha' || !g.securityPlatoon).length} Guards Deployed across CBE Tower & Mall
                </div>
              </div>

              {/* Platoon Bravo */}
              <div className={`border rounded-xl p-4 space-y-2 transition-all ${
                activeSecurityPlatoon === 'Platoon Bravo'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Platoon Bravo</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeSecurityPlatoon === 'Platoon Bravo'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {activeSecurityPlatoon === 'Platoon Bravo' ? '🟢 ON DUTY 24H' : 'REST / OFF'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {activeSecurityPlatoon === 'Platoon Bravo' ? 'Active 24h Watch (07:00 - 07:00)' : 'Rest Day 1 (Post-Duty Recovery)'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeGuards.filter(g => g.securityPlatoon === 'Platoon Bravo').length} Guards Assigned · Cargo Hub Watch
                </div>
              </div>

              {/* Platoon Charlie */}
              <div className={`border rounded-xl p-4 space-y-2 transition-all ${
                activeSecurityPlatoon === 'Platoon Charlie'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Platoon Charlie</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeSecurityPlatoon === 'Platoon Charlie'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {activeSecurityPlatoon === 'Platoon Charlie' ? '🟢 ON DUTY 24H' : 'REST / OFF'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {activeSecurityPlatoon === 'Platoon Charlie' ? 'Active 24h Watch (07:00 - 07:00)' : 'Rest Day 2 (Standby / Next Shift)'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeGuards.filter(g => g.securityPlatoon === 'Platoon Charlie').length} Guards Assigned · Commercial Perimeter
                </div>
              </div>

            </div>

            {/* Guards Platoon Roster Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Guard Member</th>
                    <th className="py-3 px-4">Assigned Platoon Squad</th>
                    <th className="py-3 px-4">Facility & Post</th>
                    <th className="py-3 px-4">Current Cycle Status</th>
                    <th className="py-3 px-4">Next 24h Duty Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {activeGuards.map(guard => {
                    const platoon = guard.securityPlatoon || 'Platoon Alpha';
                    const isOnDuty = platoon === activeSecurityPlatoon;

                    return (
                      <tr key={guard.id} className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/80 even:dark:bg-slate-800/40 hover:bg-slate-100/70 hover:dark:bg-slate-800/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{guard.employeeName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{guard.employeeCode} · {guard.role}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            {platoon}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          <div>{guard.siteName}</div>
                          <div className="text-[11px] text-slate-400">{guard.post}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isOnDuty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>24h Active Post Duty</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <span>Mandatory 48h Recovery Rest</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          {isOnDuty ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Handover at 07:00 tomorrow</span>
                          ) : (
                            <span className="font-medium">Reports in 24-48 hrs</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Modal: New Site Assignment */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Deploy Staff to Client Site</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assign facility, duty post, and specific shift system</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Employee *</label>
                <select
                  value={deployEmployeeId}
                  onChange={(e) => handleSelectEmployee(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
                >
                  <option value="">-- Choose employee --</option>
                  {employees
                    .filter(e => e.status !== 'Exited' && e.status !== 'In Clearance')
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType} {e.currentSiteName ? `(At: ${e.currentSiteName})` : '(Reserve Pool)'}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Client Site *</label>
                <select
                  value={deploySiteId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setDeploySiteId(sid);
                    const s = sites.find(item => item.id === sid);
                    if (s && s.posts.length > 0) {
                      setDeployPost(s.posts[0]);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.siteCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Duty Post / Area *</label>
                <select
                  value={deployPost}
                  onChange={(e) => setDeployPost(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
                >
                  {targetSite?.posts.map((post, idx) => (
                    <option key={idx} value={post}>{post}</option>
                  ))}
                  <option value="Perimeter Roving Patrol">Perimeter Roving Patrol</option>
                  <option value="Common Corridor & Restroom Care">Common Corridor & Restroom Care</option>
                </select>
              </div>

              {/* Dynamic Shift Policy Configuration */}
              {selectedEmp?.serviceType === 'Security' ? (
                <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Security Shift Policy: 24hr Duty / 48hr Rest</span>
                  </div>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
                    Guards work 24 consecutive hours on post, then have 48 hours mandatory off-duty rest.
                  </p>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assign Platoon Squad</label>
                    <select
                      value={deployPlatoon}
                      onChange={(e) => setDeployPlatoon(e.target.value as SecurityPlatoon)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Platoon Alpha">Platoon Alpha (Active 24h Duty)</option>
                      <option value="Platoon Bravo">Platoon Bravo (Rest Day 1 - 24h)</option>
                      <option value="Platoon Charlie">Platoon Charlie (Rest Day 2 - 48h)</option>
                    </select>
                  </div>
                </div>
              ) : selectedEmp?.serviceType === 'Cleaning' ? (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Cleaning Shift Policy: 2 Shifts (Weekly Alternation)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                    Crew alternates between Morning (06:00 - 14:00) and Afternoon (14:00 - 22:00) every 1 week.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Initial Shift</label>
                      <select
                        value={deployShift}
                        onChange={(e) => setDeployShift(e.target.value as ShiftType)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Morning Shift (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                        <option value="Afternoon Shift (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Rotation Starting Week</label>
                      <select
                        value={deployCleaningWeek}
                        onChange={(e) => setDeployCleaningWeek(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Week 1 (Morning)">Week 1 (Morning)</option>
                        <option value="Week 2 (Afternoon)">Week 2 (Afternoon)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Shift Schedule *</label>
                  <select
                    value={deployShift}
                    onChange={(e) => setDeployShift(e.target.value as ShiftType)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
                  >
                    <option value="24h Duty (24hr ON / 48hr REST)">Security: 24h Duty (24hr ON / 48hr REST)</option>
                    <option value="Morning Shift (06:00 - 14:00)">Cleaning: Morning Shift (06:00 - 14:00)</option>
                    <option value="Afternoon Shift (14:00 - 22:00)">Cleaning: Afternoon Shift (14:00 - 22:00)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Supervisor Notes / Post Instructions</label>
                <textarea
                  rows={2}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="e.g., Specific security checkpoint protocol or chemical safety certification..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeployModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!deployEmployeeId}
                onClick={handleConfirmDeploy}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Confirm Deployment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
