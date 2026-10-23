import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Sparkles, 
  FileText, 
  Printer, 
  UserCheck, 
  DollarSign, 
  Plus, 
  Check, 
  Search,
  Filter,
  Package,
  Calendar,
  Building2,
  Clock,
  Lock
} from 'lucide-react';
import { ClearanceRecord, IssuedClearanceItem, Employee, ServiceType, ManagementPerson } from '../types/hrm';

interface ClearanceViewProps {
  clearances: ClearanceRecord[];
  employees: Employee[];
  activeUser?: ManagementPerson;
  onUpdateClearance: (updated: ClearanceRecord) => void;
  onInitiateClearance: (newRecord: ClearanceRecord) => void;
}

export const ClearanceView: React.FC<ClearanceViewProps> = ({
  clearances,
  employees,
  activeUser,
  onUpdateClearance,
  onInitiateClearance
}) => {
  const canVerifyInventory = activeUser ? activeUser.permissions.canVerifyInventoryReturn : true;
  const canSignSupervisor = activeUser
    ? activeUser.id === 'mgmt-supervisor-dan' ||
      activeUser.id === 'mgmt-hr-ops' ||
      activeUser.permissions.canApproveClearance
    : true;
  const canSignStore = activeUser ? activeUser.permissions.canVerifyInventoryReturn : true;
  const canSignFinance = activeUser ? activeUser.permissions.canApprovePayroll : true;
  const canSignHrFinal = activeUser ? activeUser.permissions.canApproveClearance : true;
  const canInitiateClearance = activeUser
    ? activeUser.permissions.canApproveClearance || activeUser.permissions.canEditEmployees
    : true;
  const [selectedClearanceId, setSelectedClearanceId] = useState<string>(clearances[0]?.id || '');
  const [filterService, setFilterService] = useState<'All' | ServiceType>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInitiatingModalOpen, setIsInitiatingModalOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  // New clearance form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [exitReason, setExitReason] = useState<ClearanceRecord['exitReason']>('Resignation');
  const [targetDate, setTargetDate] = useState<string>('2026-10-15');

  const selectedClearance = clearances.find(c => c.id === selectedClearanceId) || clearances[0];

  const filteredClearances = clearances.filter(c => {
    if (filterService !== 'All' && c.serviceType !== filterService) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.employeeName.toLowerCase().includes(q) ||
        c.employeeCode.toLowerCase().includes(q) ||
        c.siteName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const calculateTotalPenalties = (items: IssuedClearanceItem[]) => {
    return items.reduce((sum, item) => sum + (item.isReturned ? 0 : item.penaltyFee), 0);
  };

  const handleToggleItemReturn = (itemId: string) => {
    if (!selectedClearance) return;
    const updatedItems = selectedClearance.issuedItems.map(item => {
      if (item.id === itemId) {
        const nextReturned = !item.isReturned;
        const newCondition: 'Good' | 'Damaged' | 'Missing' = nextReturned ? 'Good' : 'Missing';
        return {
          ...item,
          isReturned: nextReturned,
          condition: newCondition,
          penaltyFee: nextReturned ? 0 : (item.category === 'Equipment' ? 450 : 200)
        };
      }
      return item;
    });

    const updated = {
      ...selectedClearance,
      issuedItems: updatedItems
    };
    onUpdateClearance(updated);
  };

  const handleChangeItemCondition = (itemId: string, condition: 'Good' | 'Damaged' | 'Missing') => {
    if (!selectedClearance) return;
    const updatedItems = selectedClearance.issuedItems.map(item => {
      if (item.id === itemId) {
        let penalty = 0;
        if (condition === 'Missing') penalty = item.category === 'Equipment' ? 500 : 250;
        if (condition === 'Damaged') penalty = item.category === 'Equipment' ? 250 : 120;
        return {
          ...item,
          condition,
          isReturned: condition !== 'Missing',
          penaltyFee: penalty
        };
      }
      return item;
    });

    const updated = {
      ...selectedClearance,
      issuedItems: updatedItems
    };
    onUpdateClearance(updated);
  };

  const handleSignoffDepartment = (dept: 'supervisor' | 'store' | 'finance' | 'hr') => {
    if (!selectedClearance) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const signerLabel = activeUser
      ? `${activeUser.name} (${activeUser.title.split('(')[0].trim()})`
      : 'Authorized Officer';
    const updated = { ...selectedClearance };

    if (dept === 'supervisor') {
      updated.siteSupervisorSignoff = {
        completed: true,
        signedBy: signerLabel,
        signedDate: nowStr,
        remarks: 'Client post handover verified without disruption.'
      };
    } else if (dept === 'store') {
      updated.storeAssetSignoff = {
        completed: true,
        signedBy: signerLabel,
        signedDate: nowStr,
        remarks: 'Items physical check confirmed. Damaged/lost items verified.'
      };
    } else if (dept === 'finance') {
      const gearCost = calculateTotalPenalties(selectedClearance.issuedItems);
      updated.financeSignoff = {
        completed: true,
        signedBy: signerLabel,
        signedDate: nowStr,
        salaryAdvanceDeduction: 0,
        unreturnedGearCost: gearCost,
        finalSeveranceSettlement: 6500 - gearCost,
        remarks: `Final settlement computed with ETB ${gearCost} deductions.`
      };
    } else if (dept === 'hr') {
      updated.hrClearanceSignoff = {
        completed: true,
        signedBy: signerLabel,
        signedDate: nowStr,
        certificateIssued: true,
        certificateNumber: `HAB-CLR-2026-${Math.floor(100 + Math.random() * 900)}`,
        remarks: 'HR clearance certified. Labor contract terminated in good standing.'
      };
      updated.status = 'Cleared';
    }

    onUpdateClearance(updated);
  };

  const handleStartInitiation = () => {
    if (!selectedEmployeeId) return;
    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    const isSecurity = emp.serviceType === 'Security';
    const initialItems: IssuedClearanceItem[] = isSecurity
      ? [
          { id: `sec-${Date.now()}-1`, name: 'HAB Security Uniform Shirts (2x Sets)', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 600 },
          { id: `sec-${Date.now()}-2`, name: 'HAB Security Trousers (2x Sets)', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 600 },
          { id: `sec-${Date.now()}-3`, name: 'Tactical Combat Boots', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 850 },
          { id: `sec-${Date.now()}-4`, name: 'Beret & HAB Brass Crest Pin', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 250 },
          { id: `sec-${Date.now()}-5`, name: 'Tactical Duty Belt & Whistle', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 200 },
          { id: `sec-${Date.now()}-6`, name: 'Rubberized Security Baton / Truncheon', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 450 },
          { id: `sec-${Date.now()}-7`, name: 'Two-Way Walkie-Talkie Radio & Dock', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 3200 },
          { id: `sec-${Date.now()}-8`, name: 'Corporate Smart ID Badge & Client Site Pass', category: 'Credentials', isReturned: false, condition: 'Missing', penaltyFee: 150 },
          { id: `sec-${Date.now()}-9`, name: 'Guard Daily Occurrence & Incident Logbook', category: 'Credentials', isReturned: false, condition: 'Missing', penaltyFee: 100 }
        ]
      : [
          { id: `cln-${Date.now()}-1`, name: 'HAB Sanitization Overalls / Smocks (2x Sets)', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 500 },
          { id: `cln-${Date.now()}-2`, name: 'Heavy-Duty Industrial Cleaning Rubber Gloves (Pair)', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 180 },
          { id: `cln-${Date.now()}-3`, name: 'Chemical Splash Protective Face Visor & Goggles', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 220 },
          { id: `cln-${Date.now()}-4`, name: 'Waterproof Non-Slip Rubber Safety Gumboots', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 650 },
          { id: `cln-${Date.now()}-5`, name: 'Janitorial Dispensary Master Key & Locker Fob', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 300 },
          { id: `cln-${Date.now()}-6`, name: 'HAB Cleaning Staff ID Card & Floor Badge', category: 'Credentials', isReturned: false, condition: 'Missing', penaltyFee: 150 }
        ];

    const newClearance: ClearanceRecord = {
      id: `clr-${Date.now()}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      serviceType: emp.serviceType,
      role: emp.role,
      siteId: emp.currentSiteId || 'site-1',
      siteName: emp.currentSiteName || 'Commercial Bank of Ethiopia Tower (HQ)',
      exitReason,
      initiationDate: new Date().toISOString().split('T')[0],
      targetExitDate: targetDate,
      status: 'In Progress',
      issuedItems: initialItems,
      siteSupervisorSignoff: { completed: false },
      storeAssetSignoff: { completed: false },
      financeSignoff: {
        completed: false,
        salaryAdvanceDeduction: 0,
        unreturnedGearCost: 0,
        finalSeveranceSettlement: 0
      },
      hrClearanceSignoff: {
        completed: false,
        certificateIssued: false
      }
    };

    onInitiateClearance(newClearance);
    setSelectedClearanceId(newClearance.id);
    setIsInitiatingModalOpen(false);
    setSelectedEmployeeId('');
  };

  const returnedItemsCount = selectedClearance?.issuedItems.filter(i => i.isReturned).length || 0;
  const totalItemsCount = selectedClearance?.issuedItems.length || 0;
  const totalPenalties = selectedClearance ? calculateTotalPenalties(selectedClearance.issuedItems) : 0;

  return (
    <div className="space-y-6">
      
      {/* Light Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            HR-Owned Clearance Procedure
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Employee Exit & Company Item Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Before an employee exits, HR verifies return of all issued items (Security uniforms, batons, radios vs Cleaning overalls, gloves, keys) and coordinates department sign-offs.
          </p>
        </div>

        {canInitiateClearance ? (
          <button
            type="button"
            onClick={() => setIsInitiatingModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Clearance</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Role Mode: {activeUser?.title.split('(')[0]}</span>
          </span>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Clearance Records List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Search & Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search employee or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                aria-label="Filter by service type"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-600 flex-1"
              >
                <option value="All">All 4 Divisions</option>
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Property Management">Property Management</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>

              <select
                aria-label="Filter by clearance status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-600 flex-1"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Cleared">Cleared</option>
              </select>
            </div>
          </div>

          {/* List Cards */}
          <div className="space-y-2">
            {filteredClearances.map((c) => {
              const isSelected = selectedClearance?.id === c.id;
              const returnedCount = c.issuedItems.filter(i => i.isReturned).length;
              const totalItems = c.issuedItems.length;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClearanceId(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-50/40 border-amber-600 shadow-xs ring-1 ring-amber-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{c.employeeName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          c.serviceType === 'Security'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {c.serviceType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.employeeCode} · {c.role}</div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'Cleared'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>Items Verified: <strong className="text-slate-800">{returnedCount}/{totalItems}</strong></span>
                    </span>
                    <span>{c.exitReason}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Detailed Verification & Sign-offs (8 cols) */}
        <div className="lg:col-span-8">
          {selectedClearance ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedClearance.employeeName}</h2>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {selectedClearance.employeeCode}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      selectedClearance.serviceType === 'Security'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {selectedClearance.serviceType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2">
                    <span>Role: <strong className="text-slate-800">{selectedClearance.role}</strong></span>
                    <span>·</span>
                    <span>Site: <strong className="text-slate-800">{selectedClearance.siteName}</strong></span>
                    <span>·</span>
                    <span>Reason: <strong className="text-slate-800">{selectedClearance.exitReason}</strong></span>
                  </div>
                </div>

                {selectedClearance.status === 'Cleared' && (
                  <button
                    type="button"
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Clearance Certificate</span>
                  </button>
                )}
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Items Surrendered</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    {returnedItemsCount} of {totalItemsCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Missing Gear Penalty</span>
                  <span className={`font-bold text-sm tabular-nums ${totalPenalties > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ETB {totalPenalties.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Exit Date</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedClearance.targetExitDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status</span>
                  <span className={`font-bold text-xs ${selectedClearance.status === 'Cleared' ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {selectedClearance.status}
                  </span>
                </div>
              </div>

              {/* Item Return Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-700" />
                      <span>Company-Issued Items & Gear Return Verification</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedClearance.serviceType === 'Security'
                        ? 'Inspect tactical uniform, boots, beret, baton, two-way radio, and ID credentials.'
                        : 'Inspect sanitization overalls, heavy cleaning gloves, safety boots, and chemical dispensary keys.'}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">Check box to confirm receipt</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead className="bg-slate-100 text-slate-900 border-b-2 border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-4 px-5 font-bold text-slate-900">Received</th>
                        <th className="py-4 px-5 font-bold text-slate-900">Item Description</th>
                        <th className="py-4 px-5 font-bold text-slate-900">Category</th>
                        <th className="py-4 px-5 font-bold text-slate-900">Physical Condition</th>
                        <th className="py-4 px-5 font-bold text-slate-900 text-right">Deduction (ETB)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {selectedClearance.issuedItems.map((item) => (
                        <tr key={item.id} className="odd:bg-white even:bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
                          <td className="py-4 px-5 font-normal">
                            <input
                              type="checkbox"
                              disabled={!canVerifyInventory}
                              aria-label={`Toggle return status for ${item.name}`}
                              checked={item.isReturned}
                              onChange={() => handleToggleItemReturn(item.id)}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-4 px-5 font-normal text-slate-600">
                            <div className="flex items-center gap-2">
                              {item.isReturned ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                              <span className="font-medium text-slate-800">{item.name}</span>
                            </div>
                            {item.notes && (
                              <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.notes}</div>
                            )}
                          </td>
                          <td className="py-4 px-5 text-slate-500 font-normal text-[11px]">
                            {item.category}
                          </td>
                          <td className="py-4 px-5 font-normal">
                            <select
                              disabled={!canVerifyInventory}
                              aria-label={`Condition for ${item.name}`}
                              value={item.condition}
                              onChange={(e) => handleChangeItemCondition(item.id, e.target.value as any)}
                              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-600 disabled:opacity-60"
                            >
                              <option value="Good">Good Condition</option>
                              <option value="Damaged">Damaged / Tear</option>
                              <option value="Missing">Missing / Lost</option>
                            </select>
                          </td>
                          <td className="py-4 px-5 text-right font-mono tabular-nums font-normal">
                            {item.penaltyFee > 0 ? (
                              <span className="text-rose-600 font-medium">ETB {item.penaltyFee}</span>
                            ) : (
                              <span className="text-slate-400 font-normal">0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Department Sign-Off Gates */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Role-Based Department Sign-Off Gates</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Active Signer: <strong className="text-slate-800">{activeUser?.name || 'HR Head'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Gate 1: Site Supervisor */}
                  <div className={`p-3.5 rounded-lg border text-xs ${
                    selectedClearance.siteSupervisorSignoff.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : canSignSupervisor
                      ? 'bg-white border-indigo-200 ring-1 ring-indigo-500/10'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">1. Client Site Supervisor</span>
                      {selectedClearance.siteSupervisorSignoff.completed ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : canSignSupervisor ? (
                        <button
                          type="button"
                          onClick={() => handleSignoffDepartment('supervisor')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded"
                        >
                          Sign Off Gate #1
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3" /> Site Supervisor Role
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1 text-[11px]">
                      {selectedClearance.siteSupervisorSignoff.completed
                        ? `Signed by ${selectedClearance.siteSupervisorSignoff.signedBy}`
                        : 'Pending verification of shift handover & keys.'}
                    </p>
                  </div>

                  {/* Gate 2: Stores Manager */}
                  <div className={`p-3.5 rounded-lg border text-xs ${
                    selectedClearance.storeAssetSignoff.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : canSignStore
                      ? 'bg-white border-amber-300 ring-1 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">2. Central Stores & Gear</span>
                      {selectedClearance.storeAssetSignoff.completed ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : canSignStore ? (
                        <button
                          type="button"
                          onClick={() => handleSignoffDepartment('store')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded"
                        >
                          Sign Off Gate #2
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3" /> Store Keeper Role
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1 text-[11px]">
                      {selectedClearance.storeAssetSignoff.completed
                        ? `Signed by ${selectedClearance.storeAssetSignoff.signedBy}`
                        : 'Physical audit of returned uniform sets, radios, boots, and gear.'}
                    </p>
                  </div>

                  {/* Gate 3: Finance Settlement */}
                  <div className={`p-3.5 rounded-lg border text-xs ${
                    selectedClearance.financeSignoff.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : canSignFinance
                      ? 'bg-white border-emerald-300 ring-1 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">3. Finance & Final Pay</span>
                      {selectedClearance.financeSignoff.completed ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : canSignFinance ? (
                        <button
                          type="button"
                          onClick={() => handleSignoffDepartment('finance')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded"
                        >
                          Calculate & Clear (#3)
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3" /> Finance Head Role
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1 text-[11px]">
                      {selectedClearance.financeSignoff.completed
                        ? `Signed by ${selectedClearance.financeSignoff.signedBy}`
                        : 'Settles unreturned gear deductions and advances.'}
                    </p>
                  </div>

                  {/* Gate 4: Final HR Clearance */}
                  <div className={`p-3.5 rounded-lg border text-xs ${
                    selectedClearance.hrClearanceSignoff.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : canSignHrFinal
                      ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">4. HR / Legal Final Release</span>
                      {selectedClearance.hrClearanceSignoff.completed ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                        </span>
                      ) : canSignHrFinal ? (
                        <button
                          type="button"
                          onClick={() => handleSignoffDepartment('hr')}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded shadow-xs"
                        >
                          Grant Final Clearance
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3" /> HR Head / Legal Role
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1 text-[11px]">
                      {selectedClearance.hrClearanceSignoff.completed
                        ? `Certified by ${selectedClearance.hrClearanceSignoff.signedBy}`
                        : 'Authorizes formal exit certificate & legal separation.'}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs shadow-xs">
              Select an employee clearance case from the left list.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Initiate Employee Clearance */}
      {isInitiatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Initiate Employee Exit Clearance</h2>
                <p className="text-xs text-slate-500">Auto-generates item return checklist based on division</p>
              </div>
              <button
                type="button"
                onClick={() => setIsInitiatingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600 focus:bg-white"
                >
                  <option value="">-- Choose employee --</option>
                  {employees
                    .filter(e => e.status !== 'Exited')
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType} · {e.role}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Exit *</label>
                <select
                  value={exitReason}
                  onChange={(e) => setExitReason(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600 focus:bg-white"
                >
                  <option value="Resignation">Voluntary Resignation</option>
                  <option value="End of Contract">Contract Expiration</option>
                  <option value="Mutual Separation">Mutual Separation</option>
                  <option value="Termination">Administrative Termination</option>
                  <option value="Disciplinary">Disciplinary Action</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Exit Date *</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <strong>Automatic Gear Checklist Generation:</strong>
                <p className="mt-0.5 text-amber-800">
                  Selecting <strong>Security</strong> creates checklists for uniforms, boots, batons, and walkie-talkies.
                  Selecting <strong>Cleaning</strong> creates checklists for overalls, heavy rubber gloves, face shields, and dispensary keys.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsInitiatingModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedEmployeeId}
                onClick={handleStartInitiation}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Create Clearance Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable Certificate of Clearance */}
      {isCertificateModalOpen && selectedClearance && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              type="button"
              onClick={() => setIsCertificateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print"
            >
              ✕
            </button>

            {/* Official Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="text-xl font-black tracking-wider text-slate-900 uppercase">
                HAB Business PLC
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Corporate Cleaning & Security Operations Management
              </div>
              <div className="text-[11px] text-slate-500">
                Churchill Avenue, Financial District, P.O. Box 24901, Addis Ababa, Ethiopia · Tel: +251 115 500 000
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-4">
                Official HR Clearance Certificate
              </h2>
              <p className="text-xs font-mono text-slate-600">
                Ref: {selectedClearance.hrClearanceSignoff.certificateNumber || 'HAB-CLR-2026-CERT'}
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>
                This certifies that the employee identified below has completed all formal clearance procedures, surrendered all company-issued properties, uniforms, gear, and credentials, and has settled all accounts with HAB Business PLC.
              </p>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Employee Name:</span>
                  <span className="font-bold text-slate-900">{selectedClearance.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Employee Code:</span>
                  <span className="font-bold font-mono text-slate-900">{selectedClearance.employeeCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Service Division:</span>
                  <span className="font-bold text-slate-900">{selectedClearance.serviceType} Services</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Designation:</span>
                  <span className="font-bold text-slate-900">{selectedClearance.role}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Site:</span>
                  <span className="font-bold text-slate-900">{selectedClearance.siteName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Exit Date:</span>
                  <span className="font-bold text-slate-900">{selectedClearance.targetExitDate}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-300 text-center">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                    {selectedClearance.siteSupervisorSignoff.signedBy?.split(' ')[0] || 'A. Kassahun'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 font-semibold">Site Supervisor</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                    {selectedClearance.financeSignoff.signedBy?.split(' ')[0] || 'A. Demissie'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 font-semibold">Finance & Payroll</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic text-amber-800">
                    Solomon Teshome
                  </div>
                  <div className="text-[10px] text-slate-900 mt-1 font-bold">HR Director (Final Signoff)</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
