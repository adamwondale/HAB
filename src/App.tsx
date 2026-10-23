import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { DeploymentView } from './components/DeploymentView';
import { ClearanceView } from './components/ClearanceView';
import { AttendanceView } from './components/AttendanceView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { RecruitmentView } from './components/RecruitmentView';
import { OnboardingView } from './components/OnboardingView';
import { PayrollView } from './components/PayrollView';
import { TransferPromotionView } from './components/TransferPromotionView';
import { WorkExperienceView } from './components/WorkExperienceView';
import { ManagementOrgView } from './components/ManagementOrgView';
import { StoreManagementView } from './components/StoreManagementView';
import { getRoleAllowedTabs } from './utils/roleConfig';
import { HabMonogramIcon } from './components/HabLogo';
import { LoginView } from './components/LoginView';

import {
  INITIAL_CLIENT_SITES,
  INITIAL_EMPLOYEES,
  INITIAL_DEPLOYMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_CLEARANCE_RECORDS,
  INITIAL_CANDIDATES,
  INITIAL_ONBOARDING,
  INITIAL_PAYROLL,
  INITIAL_TRANSFERS,
  INITIAL_WORK_EXPERIENCES,
  INITIAL_MANAGEMENT_PERSONS,
  INITIAL_STOCK_ITEMS,
  INITIAL_STOCK_TRANSACTIONS
} from './data/mockData';

import {
  Employee,
  ClientSite,
  Deployment,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  ClearanceRecord,
  Candidate,
  OnboardingChecklist,
  PayrollRecord,
  TransferPromotionRecord,
  WorkExperienceRecord,
  ServiceType,
  ShiftType,
  ManagementPerson,
  StockItem,
  StockTransaction
} from './types/hrm';

// Helper to calculate ISO calendar week number
function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [serviceFilter, setServiceFilter] = useState<'All' | ServiceType>('All');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Automated Cleaning Shift Weekly Rotation State
  const [autoRotationAlert, setAutoRotationAlert] = useState<string | null>(null);

  // Dark Mode / Low-light mode for security and night operations (defaults to false for the HAB yellow-green theme)
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hab_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Application Data States
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [sites, setSites] = useState<ClientSite[]>(INITIAL_CLIENT_SITES);
  const [deployments, setDeployments] = useState<Deployment[]>(INITIAL_DEPLOYMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [clearances, setClearances] = useState<ClearanceRecord[]>(INITIAL_CLEARANCE_RECORDS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [onboardingList, setOnboardingList] = useState<OnboardingChecklist[]>(INITIAL_ONBOARDING);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  const [transfers, setTransfers] = useState<TransferPromotionRecord[]>(INITIAL_TRANSFERS);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceRecord[]>(INITIAL_WORK_EXPERIENCES);
  const [managementPersons, setManagementPersons] = useState<ManagementPerson[]>(INITIAL_MANAGEMENT_PERSONS);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(INITIAL_STOCK_TRANSACTIONS);
  const [activeUser, setActiveUser] = useState<ManagementPerson>(() => {
    return INITIAL_MANAGEMENT_PERSONS.find(p => p.id === 'mgmt-hr-head') || INITIAL_MANAGEMENT_PERSONS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Switch role and automatically navigate to an authorized tab if needed
  const handleSelectActiveUser = (user: ManagementPerson) => {
    setActiveUser(user);
    const allowed = getRoleAllowedTabs(user.id);
    if (allowed !== 'ALL' && !allowed.includes(activeTab)) {
      setActiveTab('overview');
    }
  };

  const handleLogin = (user: ManagementPerson) => {
    handleSelectActiveUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Store & Stock handlers
  const handleAddStockItem = (newItem: StockItem) => {
    setStockItems(prev => [newItem, ...prev]);
  };

  const handleRecordStockTransaction = (tx: StockTransaction) => {
    setStockTransactions(prev => [tx, ...prev]);
    setStockItems(prev =>
      prev.map(item => {
        if (item.id !== tx.itemId) return item;
        const delta = tx.transactionType === 'Issued (Out)' ? -tx.quantity : tx.quantity;
        return {
          ...item,
          quantityInStock: Math.max(0, item.quantityInStock + delta),
          lastUpdated: tx.date
        };
      })
    );
  };

  // Counts for navbar badges
  const securityCount = employees.filter(e => e.serviceType === 'Security').length;
  const cleaningCount = employees.filter(e => e.serviceType === 'Cleaning').length;
  const activeClearances = clearances.filter(c => c.status === 'In Progress').length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const lowStockCount = stockItems.filter(i => i.quantityInStock <= i.minReorderLevel).length;

  // Automated shift rotation executor: calculates and updates cleaningShiftWeek for all cleaners
  const executeCleaningShiftRotation = (forceManual: boolean = false) => {
    const now = new Date();
    const weekNum = getISOWeekNumber(now);
    const weekKey = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

    setEmployees(prevEmployees => {
      return prevEmployees.map((emp) => {
        if (emp.serviceType !== 'Cleaning') return emp;

        // Calculate alternating shift: Morning (Week 1) <-> Afternoon (Week 2)
        const isCurrentlyMorning = 
          emp.cleaningShiftWeek === 'Week 1 (Morning)' || 
          (emp.currentShift && emp.currentShift.includes('Morning'));

        const nextWeekRotation: 'Week 1 (Morning)' | 'Week 2 (Afternoon)' = 
          isCurrentlyMorning ? 'Week 2 (Afternoon)' : 'Week 1 (Morning)';

        const nextShiftSchedule: ShiftType = 
          isCurrentlyMorning ? 'Afternoon Shift (14:00 - 22:00)' : 'Morning Shift (06:00 - 14:00)';

        return {
          ...emp,
          cleaningShiftWeek: nextWeekRotation,
          currentShift: nextShiftSchedule
        };
      });
    });

    // Synchronize active client site deployments for cleaners
    setDeployments(prevDeployments => {
      return prevDeployments.map(dep => {
        if (dep.serviceType !== 'Cleaning' || dep.status !== 'Active') return dep;
        const isCurrentlyMorning = 
          dep.cleaningShiftWeek === 'Week 1 (Morning)' || dep.shift.includes('Morning');

        return {
          ...dep,
          shift: isCurrentlyMorning ? 'Afternoon Shift (14:00 - 22:00)' : 'Morning Shift (06:00 - 14:00)',
          cleaningShiftWeek: isCurrentlyMorning ? 'Week 2 (Afternoon)' : 'Week 1 (Morning)'
        };
      });
    });

    localStorage.setItem('hab_cleaning_shift_last_rotated_week', weekKey);

    const notification = forceManual
      ? `Manual rotation triggered: Cleaning staff rotated between Morning and Afternoon shifts for Week ${weekNum} (${weekKey}).`
      : `All cleaning staff rotated between Morning and Afternoon shifts for Week ${weekNum} (${weekKey}).`;

    setAutoRotationAlert(notification);
  };

  // Automated Monday Morning Rotation Effect
  useEffect(() => {
    const checkAndExecuteMondayRotation = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
      const weekNum = getISOWeekNumber(now);
      const weekKey = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
      const lastRotatedWeek = localStorage.getItem('hab_cleaning_shift_last_rotated_week');

      // Check if it's Monday morning or a new weekly cycle that hasn't rotated yet
      const isMonday = dayOfWeek === 1;
      const isDue = lastRotatedWeek !== weekKey;

      if (isDue && (isMonday || !lastRotatedWeek)) {
        executeCleaningShiftRotation(false);
      }
    };

    checkAndExecuteMondayRotation();

    // Check periodically every minute for Monday arrival
    const interval = setInterval(checkAndExecuteMondayRotation, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);
  };

  const handleDeployEmployee = (newDep: Deployment) => {
    setDeployments(prev => [newDep, ...prev]);

    // Update employee current site
    setEmployees(prev => prev.map(e => {
      if (e.id === newDep.employeeId) {
        return {
          ...e,
          currentSiteId: newDep.siteId,
          currentSiteName: newDep.siteName,
          currentShift: newDep.shift,
          securityPlatoon: newDep.securityPlatoon || e.securityPlatoon,
          cleaningShiftWeek: newDep.cleaningShiftWeek || e.cleaningShiftWeek,
          status: 'Active'
        };
      }
      return e;
    }));

    // Update client site deployed count
    setSites(prev => prev.map(s => {
      if (s.id === newDep.siteId) {
        if (newDep.serviceType === 'Security') {
          return { ...s, securityStaffDeployed: s.securityStaffDeployed + 1 };
        } else {
          return { ...s, cleaningStaffDeployed: s.cleaningStaffDeployed + 1 };
        }
      }
      return s;
    }));
  };

  const handleRelieveDeployment = (deploymentId: string) => {
    setDeployments(prev => prev.map(d => {
      if (d.id === deploymentId) {
        return { ...d, status: 'Relieved' };
      }
      return d;
    }));
  };

  const handleUpdateAttendanceStatus = (recordId: string, newStatus: AttendanceStatus, overtimeHours?: number) => {
    setAttendance(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: newStatus,
          overtimeHours: overtimeHours !== undefined ? overtimeHours : (newStatus === 'Overtime' ? 2 : r.overtimeHours)
        };
      }
      return r;
    }));
  };

  const handleApproveLeave = (leaveId: string, replacementEmployeeId: string, replacementEmployeeName: string) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === leaveId) {
        return {
          ...req,
          status: 'Approved',
          replacementEmployeeId,
          replacementEmployeeName,
          reviewedBy: 'Solomon Teshome (HR Director)'
        };
      }
      return req;
    }));

    const targetLeave = leaveRequests.find(l => l.id === leaveId);
    if (targetLeave) {
      setEmployees(prev => prev.map(e => e.id === targetLeave.employeeId ? { ...e, status: 'On Leave' } : e));
    }
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === leaveId ? { ...req, status: 'Rejected' } : req));
  };

  const handleUpdateCandidateStage = (candidateId: string, nextStage: Candidate['stage']) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: nextStage } : c));
  };

  const handleSendToOnboarding = (candidate: Candidate) => {
    const nextCode = candidate.targetService === 'Security'
      ? `HAB-SEC-0${120 + onboardingList.length}`
      : `HAB-CLN-0${220 + onboardingList.length}`;

    const newOnb: OnboardingChecklist = {
      id: `onb-${Date.now()}`,
      candidateId: candidate.id,
      employeeCode: nextCode,
      fullName: candidate.fullName,
      serviceType: candidate.targetService,
      role: candidate.targetRole,
      progressPercent: 30,
      tasks: [
        { id: 't1', title: 'National ID & Kebele Residence Verification', category: 'Verification', completed: true, completedAt: '2026-10-01' },
        { id: 't2', title: 'Police Character Clearance Certificate (Criminal Directorate)', category: 'Verification', completed: true, completedAt: '2026-10-01' },
        { id: 't3', title: 'Notarized Guarantor Undertaking Agreement & ID copy', category: 'Verification', completed: false },
        { id: 't4', title: 'Occupational Medical Fitness & Drug Screening Exam', category: 'Medical', completed: false },
        { id: 't5', title: 'Biometric Enrollment & HAB RFID Smart Badge Issuance', category: 'Equipment', completed: false },
        { id: 't6', title: candidate.targetService === 'Security' ? 'Tactical Security Uniform, Boots, Beret & Belt Issuance' : 'Cleaning Overalls, Heavy-Duty Gloves & Gumboots Issuance', category: 'Equipment', completed: false },
        { id: 't7', title: 'Standard Employment Contract Execution (Proclamation 1156/2019)', category: 'Contract', completed: false }
      ],
      contractSigned: false,
      initialSiteAssigned: candidate.targetService === 'Security' ? 'Commercial Bank of Ethiopia Tower (HQ)' : "St. Paul's Hospital Millennium Medical College",
      targetStartDate: '2026-10-15'
    };

    setOnboardingList(prev => [newOnb, ...prev]);
    setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: 'Onboarded' } : c));
    setActiveTab('onboarding');
  };

  const handleToggleOnboardingTask = (checklistId: string, taskId: string) => {
    setOnboardingList(prev => prev.map(item => {
      if (item.id === checklistId) {
        const updatedTasks = item.tasks.map(t => {
          if (t.id === taskId) {
            const nextComp = !t.completed;
            return {
              ...t,
              completed: nextComp,
              completedAt: nextComp ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return t;
        });

        const completedCount = updatedTasks.filter(t => t.completed).length;
        const percent = Math.round((completedCount / updatedTasks.length) * 100);

        return {
          ...item,
          tasks: updatedTasks,
          progressPercent: percent
        };
      }
      return item;
    }));
  };

  const handleCompleteOnboarding = (checklistId: string) => {
    const item = onboardingList.find(o => o.id === checklistId);
    if (!item) return;

    const [firstName, ...rest] = item.fullName.split(' ');
    const lastName = rest.join(' ') || 'Worku';

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: item.employeeCode,
      firstName,
      lastName,
      gender: 'Male',
      phone: '+251 9' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hab-business.com`,
      dateOfBirth: '1996-03-20',
      hireDate: new Date().toISOString().split('T')[0],
      serviceType: item.serviceType,
      role: item.role,
      grade: 'L1',
      status: 'Active',
      currentSiteName: item.initialSiteAssigned,
      nationalId: `ET-NID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      kebele: 'Kebele 04',
      woreda: 'Woreda 02',
      subcity: 'Kirkos',
      emergencyContact: {
        name: 'Family Contact',
        phone: '+251 911 000 111',
        relation: 'Spouse'
      },
      guarantor: {
        name: 'Ato Tefera Alemu',
        phone: '+251 922 111 222',
        organization: 'Addis Ababa Transport Bureau',
        kebeleId: 'KB-77211',
        verified: true
      },
      bankAccount: {
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountNumber: '1000' + Math.floor(100000000 + Math.random() * 900000000)
      },
      salary: {
        baseSalary: item.serviceType === 'Security' ? 7500 : 7000,
        siteAllowance: 1500,
        shiftAllowance: 800,
        hazardAllowance: item.serviceType === 'Security' ? 1200 : 900
      },
      uniformSizes: {
        shirt: 'L',
        trousers: '32',
        boots: '42'
      }
    };

    setEmployees(prev => [newEmp, ...prev]);
    setOnboardingList(prev => prev.filter(o => o.id !== checklistId));
    setActiveTab('management');
  };

  const handleUpdateClearance = (updated: ClearanceRecord) => {
    setClearances(prev => prev.map(c => c.id === updated.id ? updated : c));

    if (updated.status === 'Cleared') {
      setEmployees(prev => prev.map(e => e.id === updated.employeeId ? { ...e, status: 'Exited' } : e));
    }
  };

  const handleInitiateClearance = (newRecord: ClearanceRecord) => {
    setClearances(prev => [newRecord, ...prev]);
    setEmployees(prev => prev.map(e => e.id === newRecord.employeeId ? { ...e, status: 'In Clearance' } : e));
  };

  const handleQuickAction = (action: string) => {
    if (action === 'deploy') {
      setActiveTab('deployment');
    } else if (action === 'clearance') {
      setActiveTab('clearance');
    } else if (action === 'attendance') {
      setActiveTab('attendance');
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        managementPersons={managementPersons}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0E1525] dark:text-slate-100 flex antialiased transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        totalEmployees={employees.length}
        securityCount={securityCount}
        cleaningCount={cleaningCount}
        activeClearanceCount={activeClearances}
        pendingLeaveCount={pendingLeaves}
        lowStockCount={lowStockCount}
        onQuickAction={handleQuickAction}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeUser={activeUser}
        onLogout={handleLogout}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        <TopBar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          serviceFilter={serviceFilter}
          setServiceFilter={setServiceFilter}
          totalEmployees={employees.length}
          securityCount={securityCount}
          cleaningCount={cleaningCount}
          onQuickAction={handleQuickAction}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          activeUser={activeUser}
          managementPersons={managementPersons}
          onSelectActiveUser={handleSelectActiveUser}
          onNavigateTab={setActiveTab}
          onLogout={handleLogout}
          pendingLeaveCount={pendingLeaves}
          activeClearanceCount={activeClearances}
        />


        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'overview' && (
          <DashboardOverview
            employees={employees}
            sites={sites}
            deployments={deployments}
            clearances={clearances}
            attendance={attendance}
            leaveRequests={leaveRequests}
            onboardingList={onboardingList}
            payroll={payroll}
            candidates={candidates}
            transfers={transfers}
            workExperiences={workExperiences}
            activeUser={activeUser}
            managementPersons={managementPersons}
            onSelectActiveUser={handleSelectActiveUser}
            onNavigateTab={setActiveTab}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeTab === 'org' && (
          <ManagementOrgView
            managementPersons={managementPersons}
            activeUser={activeUser}
            onSelectActiveUser={handleSelectActiveUser}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'recruitment' && (
          <RecruitmentView
            candidates={candidates}
            onUpdateCandidateStage={handleUpdateCandidateStage}
            onSendToOnboarding={handleSendToOnboarding}
            onAddCandidate={(c) => setCandidates(prev => [c, ...prev])}
          />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingView
            onboardingList={onboardingList}
            sites={sites}
            activeUser={activeUser}
            onToggleTask={handleToggleOnboardingTask}
            onCompleteOnboarding={handleCompleteOnboarding}
          />
        )}

        {activeTab === 'management' && (
          <EmployeeManagementView
            employees={employees}
            sites={sites}
            activeUser={activeUser}
            onAddEmployee={handleAddEmployee}
            onInitiateClearanceFromEmployee={() => {
              setActiveTab('clearance');
            }}
            onDeployFromEmployee={() => {
              setActiveTab('deployment');
            }}
          />
        )}

        {activeTab === 'deployment' && (
          <DeploymentView
            sites={sites}
            deployments={deployments}
            employees={employees}
            onDeployEmployee={handleDeployEmployee}
            onRelieveDeployment={handleRelieveDeployment}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            attendanceRecords={attendance}
            sites={sites}
            onUpdateAttendanceStatus={handleUpdateAttendanceStatus}
            onAddAttendanceRecord={(r) => setAttendance(prev => [r, ...prev])}
          />
        )}

        {activeTab === 'leave' && (
          <LeaveManagementView
            leaveRequests={leaveRequests}
            employees={employees}
            sites={sites}
            activeUser={activeUser}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            onAddLeaveRequest={(newReq) => setLeaveRequests(prev => [newReq, ...prev])}
          />
        )}

        {activeTab === 'payroll' && (
          <PayrollView
            payrollRecords={payroll}
            employees={employees}
            activeUser={activeUser}
            onApproveBatch={() => {
              setPayroll(prev => prev.map(p => ({ ...p, paymentStatus: 'Approved' })));
            }}
            onDisburseBatch={() => {
              setPayroll(prev => prev.map(p => ({ ...p, paymentStatus: 'Disbursed' })));
            }}
            onUpdatePayrollRecord={(updated) => {
              setPayroll(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            }}
            onAddPayrollRecord={(newRec) => {
              setPayroll(prev => [newRec, ...prev]);
            }}
          />
        )}

        {activeTab === 'store' && (
          <StoreManagementView
            stockItems={stockItems}
            stockTransactions={stockTransactions}
            employees={employees}
            sites={sites}
            activeUser={activeUser}
            onAddStockItem={handleAddStockItem}
            onRecordTransaction={handleRecordStockTransaction}
          />
        )}

        {activeTab === 'transfers' && (
          <TransferPromotionView
            transfers={transfers}
            employees={employees}
            sites={sites}
            onExecuteTransfer={(trId) => {
              setTransfers(prev => prev.map(t => t.id === trId ? { ...t, status: 'Executed' } : t));
            }}
            onAddTransfer={(rec) => setTransfers(prev => [rec, ...prev])}
          />
        )}

        {activeTab === 'experience' && (
          <WorkExperienceView
            records={workExperiences}
            employees={employees}
            onGenerateCertificate={(rec) => setWorkExperiences(prev => [rec, ...prev])}
          />
        )}

        {activeTab === 'clearance' && (
          <ClearanceView
            clearances={clearances}
            employees={employees}
            activeUser={activeUser}
            onUpdateClearance={handleUpdateClearance}
            onInitiateClearance={handleInitiateClearance}
          />
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-slate-950 dark:bg-slate-800 p-0.5 flex items-center justify-center shrink-0 border border-slate-800 dark:border-slate-700">
              <HabMonogramIcon className="w-full h-full text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">HAB Business PLC</span>
            <span className="text-slate-400 dark:text-slate-500">· ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500 flex flex-wrap items-center gap-2.5">
            <span>Security</span>
            <span>·</span>
            <span>Cleaning</span>
            <span>·</span>
            <span>Property Management</span>
            <span>·</span>
            <span>Head Office Staff</span>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
}
