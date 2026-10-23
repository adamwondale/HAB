import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Award, 
  Scale, 
  Package, 
  UserCheck, 
  Lock, 
  Unlock, 
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ManagementPerson } from '../types/hrm';

interface ManagementOrgViewProps {
  managementPersons: ManagementPerson[];
  activeUser: ManagementPerson;
  onSelectActiveUser: (person: ManagementPerson) => void;
  onNavigateTab: (tab: string) => void;
}

export const ManagementOrgView: React.FC<ManagementOrgViewProps> = ({
  managementPersons,
  activeUser,
  onSelectActiveUser,
  onNavigateTab
}) => {
  const [selectedPerson, setSelectedPerson] = useState<ManagementPerson | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<'All' | 'HR' | 'Operations' | 'Executive'>('All');

  const hrPersons = managementPersons.filter(p => p.department === 'Human Resource');
  const opsPersons = managementPersons.filter(p => p.department === 'Operations');
  const executivePersons = managementPersons.filter(p => p.department === 'Executive Office' || p.department === 'Executive Advisory');

  const displayedPersons = managementPersons.filter(p => {
    if (filterDepartment === 'HR') return p.department === 'Human Resource';
    if (filterDepartment === 'Operations') return p.department === 'Operations';
    if (filterDepartment === 'Executive') return p.department === 'Executive Office' || p.department === 'Executive Advisory';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                Company Hierarchy
              </span>
              <span className="text-xs text-slate-500 font-amharic">
                የሰው ኃይል እና የስራ አመራር መዋቅር
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              HAB Business PLC Organizational & HRM Structure
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Official corporate hierarchy for HAB Business PLC. Human Resource is integrated under the 
              <strong> Operations Department</strong>, working alongside Logistics, Site Supervisors, and Shift Leaders 
              to manage field security guards and cleaning personnel across Addis Ababa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-right">
              <span className="text-[11px] text-slate-500 block">Logged-in Active Role</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{activeUser.name}</span>
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium block">
                {activeUser.title}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter View:</span>
          {(['All', 'HR', 'Operations', 'Executive'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterDepartment(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterDepartment === tab
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {tab === 'All' && 'All Leadership (8)'}
              {tab === 'HR' && 'Human Resource Team (3)'}
              {tab === 'Operations' && 'Operations & Field (3)'}
              {tab === 'Executive' && 'Executive & Legal (2)'}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Organizational Hierarchy Tree Focused on HRM */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Operations & HRM Operational Reporting Tree</span>
            </h2>
            <p className="text-xs text-slate-500">Click any card to inspect role responsibilities or switch your active persona</p>
          </div>
          <span className="text-xs font-mono text-slate-400">HAB-ORG-CHART-2026</span>
        </div>

        {/* Tree Container */}
        <div className="min-w-[760px] flex flex-col items-center space-y-8 py-2">
          
          {/* Level 1: CEO & Legal Advisor */}
          <div className="flex items-start justify-center gap-12 relative">
            
            {/* CEO Card */}
            <div 
              onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-ceo') || null)}
              className="w-72 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-md border border-slate-700 cursor-pointer hover:scale-[1.02] transition-transform text-center relative group"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Chief Executive Officer</div>
              <div className="font-bold text-sm mt-0.5">Ato Hailemariam Bekele</div>
              <div className="text-[11px] text-slate-300 font-amharic">ኃይለማርያም በቀለ</div>
              <div className="mt-2 text-[10px] text-slate-400 bg-slate-800/80 py-1 px-2 rounded">
                Executive Leadership & Corporate Governance
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded">
                Inspect
              </div>
            </div>

            {/* Legal Advisor (Staff to CEO) */}
            <div 
              onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-legal') || null)}
              className="w-64 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 p-3.5 rounded-xl cursor-pointer hover:border-purple-400 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">Legal Advisor</span>
                <Scale className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Adv. Tigist Worku</div>
              <div className="text-[11px] text-slate-500 font-amharic">ትዕግስት ወርቁ</div>
              <p className="text-[10px] text-purple-900 dark:text-purple-300 mt-1.5 leading-tight">
                Labor Proclamation No. 1156/2019 legal compliance & termination review.
              </p>
            </div>

          </div>

          {/* Vertical Connecting Line */}
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>

          {/* Level 2: Operations Department Head */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-ops-head') || null)}
              className="w-80 bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-400 dark:border-blue-600 p-4 rounded-xl shadow-xs cursor-pointer hover:scale-[1.02] transition-transform text-center group"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Operations Department Head
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">Ato Solomon Fikre</div>
              <div className="text-[11px] text-slate-500 font-amharic">ሰለሞን ፍቅሬ</div>
              <div className="mt-2 text-[10px] text-blue-900 dark:text-blue-200 bg-blue-100/70 dark:bg-blue-900/60 py-1 px-2.5 rounded font-medium">
                Oversees: Human Resource · Logistics · Site Supervisors · Shift Leaders
              </div>
            </div>

            {/* Tree Branch Line to HR and Field Operations */}
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-[520px] h-0.5 bg-slate-300 dark:bg-slate-700"></div>
          </div>

          {/* Level 3: Dual Branches (HR Division vs Field Operations & Stores) */}
          <div className="w-full flex justify-between gap-8 pt-2">
            
            {/* Left Wing: Human Resource Department (3 HR Persons) */}
            <div className="flex-1 bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700/60 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-600 text-white">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">Human Resource Division</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300">Directly under Operations Head</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded">
                  3 Officers
                </span>
              </div>

              {/* Head of HR */}
              <div 
                onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-hr-head') || null)}
                className="p-3 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Head of HR (HR Head)</span>
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Ato Dawit Yohannes</div>
                <div className="text-[11px] text-slate-500 font-amharic">ዳዊት ዮሐንስ</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5">
                  Final clearance certificates, labor compliance, payroll authorization & employee discipline.
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Signatory: Clearances, Severance & Contracts</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Sub-Branch: 2 HR Specialists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                
                {/* HR Operations & Deployment Officer */}
                <div 
                  onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-hr-ops') || null)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-lg cursor-pointer transition-all group"
                >
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block">HR Operations Officer</span>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">W/ro Selamawit Tadesse</div>
                  <div className="text-[10px] text-slate-500 font-amharic">ሰላማዊት ታደሰ</div>
                  <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                    • 24h/48h Security Platoon Rosters<br />
                    • Weekly Cleaning Shift Rotation<br />
                    • Roll Call Attendance & Overtime
                  </div>
                </div>

                {/* Talent Acquisition & Records Officer */}
                <div 
                  onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-hr-talent') || null)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 rounded-lg cursor-pointer transition-all group"
                >
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 block">Talent & Records Officer</span>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">Ato Henok Assefa</div>
                  <div className="text-[10px] text-slate-500 font-amharic">ሄኖክ አሰፋ</div>
                  <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                    • Candidate Pipeline & Intake<br />
                    • Kebele Legal Guarantor Verification<br />
                    • Uniform Sizing & Onboarding Kits
                  </div>
                </div>

              </div>
            </div>

            {/* Right Wing: Field Supervisors & Connected Stores */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-700 text-white">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Operations Field Command & Stores</div>
                    <div className="text-[10px] text-slate-500">Supervision & Logistics Linkage</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded">
                  Field & Store
                </span>
              </div>

              {/* Senior Site Supervisor */}
              <div 
                onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-supervisor-dan') || null)}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 rounded-lg cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">Senior Field Site Supervisor</span>
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Ato Daniel Kebede</div>
                <div className="text-[11px] text-slate-500 font-amharic">ዳንኤል ከበደ</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5">
                  Day and night post inspections, security post vigilance audits, hospital cleaning standards.
                </p>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  Coordinates: CBE HQ, Ethiopian Airlines, Hyatt Regency
                </div>
              </div>

              {/* Store Keeper (Finance / Uniform & Gear Return Controller) */}
              <div 
                onClick={() => setSelectedPerson(managementPersons.find(p => p.id === 'mgmt-storekeeper') || null)}
                className="p-3 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/80 rounded-lg cursor-pointer hover:border-amber-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                    Store Keeper & Gear Controller (Finance)
                  </span>
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Ato Girma Wolde</div>
                <div className="text-[11px] text-slate-500 font-amharic">ግርማ ወልዴ</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5">
                  Physical warehouse intake: Signs off on returned boots, shirts, and ID badges during exit clearance.
                </p>
                <div className="mt-2 text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                  Required Sign-Off for Exit Clearance
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Leadership & Management Directory ({displayedPersons.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click 'Set as Active Role' to test permissions as that officer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPersons.map((person) => {
            const isCurrent = activeUser.id === person.id;

            return (
              <div
                key={person.id}
                className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                  isCurrent 
                    ? 'border-amber-500 ring-2 ring-amber-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${person.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}>
                        {person.name.split(' ')[1] ? person.name.split(' ')[1][0] : person.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{person.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        {person.amharicName && (
                          <div className="text-[11px] text-slate-500 font-amharic">{person.amharicName}</div>
                        )}
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                          {person.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{person.department}</span>
                    </div>
                    {person.reportsToTitle && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500">Reports To:</span>
                        <span className="text-slate-800 dark:text-slate-300 font-medium">{person.reportsToTitle}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-500 pt-1 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate font-mono">{person.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{person.phone}</span>
                    </div>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">Key Responsibilities:</div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                      {person.responsibilities.slice(0, 2).map((r, i) => (
                        <li key={i} className="line-clamp-1">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPerson(person)}
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 font-medium"
                  >
                    View Full Profile
                  </button>

                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => onSelectActiveUser(person)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    }`}
                  >
                    {isCurrent ? 'Current Persona' : 'Set as Active Role'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Person Inspection Drawer */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedPerson.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                  {selectedPerson.name.split(' ')[1] ? selectedPerson.name.split(' ')[1][0] : selectedPerson.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedPerson.name}
                  </h3>
                  {selectedPerson.amharicName && (
                    <div className="text-sm text-slate-500 font-amharic">{selectedPerson.amharicName}</div>
                  )}
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                    {selectedPerson.title} · {selectedPerson.department}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPerson(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5"
              >
                ✕
              </button>
            </div>

            {/* Position In Org Chart */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Position in HAB Business PLC Hierarchy
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Reports Directly To:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedPerson.reportsToTitle || 'Board of Directors / Shareholders'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Office Location:</span>
                  <span className="text-slate-900 dark:text-slate-100">{selectedPerson.officeLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Official Email:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{selectedPerson.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Phone:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{selectedPerson.phone}</span>
                </div>
              </div>
            </div>

            {/* Full Responsibilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Operational & Administrative Duties
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedPerson.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Permissions Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                System ERP Authorization Privileges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canApproveClearance 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Sign Final Exit Clearance</span>
                  {selectedPerson.permissions.canApproveClearance ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canApprovePayroll 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Approve & Lock Monthly Payroll</span>
                  {selectedPerson.permissions.canApprovePayroll ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canManageShiftsAndDeployments 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Manage Shifts & Post Deployments</span>
                  {selectedPerson.permissions.canManageShiftsAndDeployments ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canManageRecruitmentAndGuarantors 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Screen Candidates & Verify Guarantor</span>
                  {selectedPerson.permissions.canManageRecruitmentAndGuarantors ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canVerifyInventoryReturn 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Sign Uniform/Gear Inventory Return</span>
                  {selectedPerson.permissions.canVerifyInventoryReturn ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  selectedPerson.permissions.canSignWorkExperience 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>Sign Work Experience Certificates</span>
                  {selectedPerson.permissions.canSignWorkExperience ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPerson(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectActiveUser(selectedPerson);
                  setSelectedPerson(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Switch to this Role Persona</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
