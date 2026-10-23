import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      common: {
        appName: 'HAB Business PLC',
        companyFullName: 'HAB Business PLC - Security & Cleaning Outsourcing',
        searchPlaceholder: 'Search by name, ID code, site, or role...',
        all: 'All',
        security: 'Security',
        cleaning: 'Cleaning',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        approve: 'Approve',
        reject: 'Reject',
        active: 'Active',
        probation: 'Probation',
        onLeave: 'On Leave',
        suspended: 'Suspended',
        inClearance: 'In Clearance',
        exited: 'Exited',
        pending: 'Pending',
        completed: 'Completed',
        phone: 'Phone',
        email: 'Email',
        location: 'Location',
        subcity: 'Subcity',
        kebele: 'Kebele',
        woreda: 'Woreda',
        nationalId: 'National ID',
        guarantor: 'Guarantor',
        verified: 'Verified',
        unverified: 'Unverified',
        salary: 'Salary',
        baseSalary: 'Base Salary',
        siteAllowance: 'Site Allowance',
        shiftAllowance: 'Shift Allowance',
        hazardAllowance: 'Hazard Allowance',
        grossPay: 'Gross Pay',
        netPay: 'Net Pay',
        actions: 'Actions',
        filter: 'Filter',
        export: 'Export',
        print: 'Print',
        details: 'Details',
        close: 'Close',
        back: 'Back',
        submit: 'Submit',
        language: 'Language',
        english: 'English',
        amharic: 'አማርኛ'
      },
      nav: {
        core: 'Core & Governance',
        dashboard: 'Dashboard',
        org: 'Org & Management',
        talentAcquisition: 'Talent Acquisition',
        recruitment: 'Recruitment',
        onboarding: 'Onboarding',
        employees: 'Employees Directory',
        operations: 'Operations & Sites',
        deployment: 'Site Deployment',
        attendance: 'Shift Attendance',
        leave: 'Leave Management',
        payroll: 'Payroll Ledger',
        store: 'Store & Stock Management',
        transfers: 'Transfers & Rotation',
        legal: 'Separation & Legal',
        clearance: 'Clearance & Exit',
        experience: 'Work Experience'
      },
      topbar: {
        divisionFilter: 'Service Division',
        activePersona: 'Active Role',
        switchPersona: 'Switch Leadership Persona',
        startClearance: 'Start Clearance',
        deployStaff: 'Deploy Staff',
        toggleNightMode: 'Toggle Low-light / Night Shift Mode',
        currentRole: 'Current Persona'
      },
      shifts: {
        morningShift: 'Morning Shift (06:00 - 14:00)',
        afternoonShift: 'Afternoon Shift (14:00 - 22:00)',
        securityDuty: '24h Duty (24hr ON / 48hr REST)',
        week1Morning: 'Week 1 (Morning)',
        week2Afternoon: 'Week 2 (Afternoon)',
        platoonAlpha: 'Platoon Alpha',
        platoonBravo: 'Platoon Bravo',
        platoonCharlie: 'Platoon Charlie'
      },
      rotation: {
        badge: 'Monday Shift Rotation Engine',
        rerunBtn: 'Re-run Rotation',
        rotateNow: 'Rotate Now'
      },
      dashboard: {
        overviewTitle: 'Operations Dashboard',
        overviewDesc: 'Managing workforce across cleaning and security service lines in Addis Ababa.',
        manageDeployments: 'Manage Deployments',
        clearanceHub: 'Clearance Hub',
        orgStructure: 'Org Structure',
        totalStaff: 'Total Employees',
        securityStaff: 'Security Guards',
        cleaningStaff: 'Cleaning Staff',
        activeClearances: 'Active Clearances',
        quickActions: 'Quick Actions',
        recentDeployments: 'Active Post Deployments',
        quickStats: 'Operational Summary'
      },
      clearance: {
        title: 'HR Exit Clearance & Item Verification',
        subtitle: 'Labor Proclamation No. 1156/2019 legal exit and uniform return protocol.',
        initiateBtn: 'Initiate Exit Clearance',
        pendingFilter: 'In Progress Clearances',
        completedFilter: 'Cleared & Handed Over',
        returnedUniform: 'Uniform Returned',
        returnedBoots: 'Safety Boots Returned',
        returnedBadge: 'ID Badge Returned',
        storekeeperSign: 'Store Keeper Sign-off',
        hrHeadSign: 'HR Head Sign-off',
        certificateBtn: 'Print Clearance Certificate'
      },
      payroll: {
        title: 'Monthly Payroll Register',
        subtitle: 'Commercial Bank of Ethiopia (CBE) & Awash Bank disbursement register.',
        disburseAll: 'Approve & Disburse Payroll',
        downloadBankList: 'Export Bank Transfer List'
      },
      orgView: {
        badge: 'Company Hierarchy',
        title: 'HAB Business PLC Organizational & HRM Structure',
        desc: 'Official corporate hierarchy for HAB Business PLC. Human Resource is integrated under the Operations Department, working alongside Logistics, Site Supervisors, and Shift Leaders to manage field security guards and cleaning personnel across Addis Ababa.',
        filterAll: 'All Leadership',
        filterHR: 'Human Resource Team',
        filterOps: 'Operations & Field',
        filterExec: 'Executive & Legal',
        inspect: 'Inspect Dossier',
        setRole: 'Set as Active Role'
      }
    }
  },
  am: {
    translation: {
      common: {
        appName: 'ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር',
        companyFullName: 'ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር - የጥበቃ እና የፅዳት አገልግሎት',
        searchPlaceholder: 'በስም፣ በመለያ ቁጥር፣ በቦታ ወይም በስራ መደብ ፈልግ...',
        all: 'ሁሉም',
        security: 'ጥበቃ',
        cleaning: 'ፅዳት',
        save: 'አስቀምጥ',
        cancel: 'ሰርዝ',
        edit: 'አስተካክል',
        delete: 'አስወግድ',
        approve: 'አጽድቅ',
        reject: 'ውድቅ አድርግ',
        active: 'በስራ ላይ',
        probation: 'በሙከራ ላይ',
        onLeave: 'በፈቃድ ላይ',
        suspended: 'የታገደ',
        inClearance: 'በስንብት ሂደት ላይ',
        exited: 'የተሰናበተ',
        pending: 'በመጠባበቅ ላይ',
        completed: 'የተጠናቀቀ',
        phone: 'ስልክ ቁጥር',
        email: 'ኢሜይል',
        location: 'አድራሻ / ቦታ',
        subcity: 'ክፍለ ከተማ',
        kebele: 'ቀበሌ',
        woreda: 'ወረዳ',
        nationalId: 'ብሔራዊ መታወቂያ',
        guarantor: 'ዋስ / ዋስትና',
        verified: 'የተረጋገጠ',
        unverified: 'ያልተረጋገጠ',
        salary: 'ደመወዝ',
        baseSalary: 'መሰረታዊ ደመወዝ',
        siteAllowance: 'የቦታ አበል',
        shiftAllowance: 'የፈረቃ አበል',
        hazardAllowance: 'የስራ አስጊነት አበል',
        grossPay: 'ጠቅላላ ክፍያ',
        netPay: 'የተጣራ ደመወዝ',
        actions: 'ተግባራት',
        filter: 'አጣራ',
        export: 'አውርድ (ኤክስፖርት)',
        print: 'አትም',
        details: 'ዝርዝር መረጃ',
        close: 'ዝጋ',
        back: 'ተመለስ',
        submit: 'አስገባ',
        language: 'ቋንቋ',
        english: 'English',
        amharic: 'አማርኛ'
      },
      nav: {
        core: 'ዋና እና አመራር',
        dashboard: 'ዳሽቦርድ',
        org: 'የአመራር መዋቅር',
        talentAcquisition: 'ቅጥር እና አቀባበል',
        recruitment: 'ቅጥር እና ማጣሪያ',
        onboarding: 'አዲስ ሠራተኞች ዝግጅት',
        employees: 'የሠራተኞች ዝርዝር',
        operations: 'ስምሪት እና ስራዎች',
        deployment: 'የስራ ቦታ ምደባ',
        attendance: 'የፈረቃ መገኘት (አቴንዳንስ)',
        leave: 'የፈቃድ አስተዳደር',
        payroll: 'የደመወዝ መዝገብ',
        store: 'የንብረት እና ስቶክ ቁጥጥር',
        transfers: 'ዝውውር እና ፈረቃ ቅያሬ',
        legal: 'ስንብት እና ህግ ነክ',
        clearance: 'ስንብት እና ንብረት ርክክብ',
        experience: 'የስራ ልምድ ማስረጃ'
      },
      topbar: {
        divisionFilter: 'የአገልግሎት ዘርፍ',
        activePersona: 'የአሁን የስራ ሚና',
        switchPersona: 'የአመራር ሚና ቀይር',
        startClearance: 'ስንብት ጀምር',
        deployStaff: 'ሠራተኛ መድብ',
        toggleNightMode: 'የማታ / ዝቅተኛ ብርሃን እይታ',
        currentRole: 'የአሁን ሚና'
      },
      shifts: {
        morningShift: 'የጠዋት ፈረቃ (06:00 - 14:00)',
        afternoonShift: 'የከሰዓት ፈረቃ (14:00 - 22:00)',
        securityDuty: 'የ24 ሰዓት ጥበቃ (24 ሰዓት ስራ / 48 ሰዓት እረፍት)',
        week1Morning: 'ሳምንት 1 (የጠዋት ፈረቃ)',
        week2Afternoon: 'ሳምንት 2 (የከሰዓት ፈረቃ)',
        platoonAlpha: 'ፕላቱን አልፋ',
        platoonBravo: 'ፕላቱን ብራቮ',
        platoonCharlie: 'ፕላቱን ቻርሊ'
      },
      rotation: {
        badge: 'የሰኞ ፈረቃ ቅያሬ ስርዓት',
        rerunBtn: 'ድጋሚ ቀይር',
        rotateNow: 'አሁን ቀይር'
      },
      dashboard: {
        overviewTitle: 'የስራዎች አጠቃላይ ዳሽቦርድ',
        overviewDesc: 'በአዲስ አበባ ከተማ ውስጥ የጥበቃ እና የፅዳት ሠራተኞችን ስምሪት እና አሰራር መቆጣጠሪያ።',
        manageDeployments: 'ምደባዎችን አስተዳድር',
        clearanceHub: 'የስንብት ማዕከል',
        orgStructure: 'የአመራር መዋቅር',
        totalStaff: 'ጠቅላላ ሠራተኞች',
        securityStaff: 'የጥበቃ ሠራተኞች',
        cleaningStaff: 'የፅዳት ሠራተኞች',
        activeClearances: 'በስንብት ላይ ያሉ',
        quickActions: 'ፈጣን ተግባራት',
        recentDeployments: 'በስራ ላይ ያሉ ምደባዎች',
        quickStats: 'አጠቃላይ ማጠቃለያ'
      },
      clearance: {
        title: 'የሠራተኛ ስንብት እና የንብረት ርክክብ',
        subtitle: 'በአሰሪና ሠራተኛ አዋጅ ቁጥር 1156/2011 መሰረት የደንብ ልብስ እና ንብረት ማስረከቢያ።',
        initiateBtn: 'አዲስ ስንብት ጀምር',
        pendingFilter: 'በሂደት ላይ ያሉ',
        completedFilter: 'የተጠናቀቁ ስንብቶች',
        returnedUniform: 'የደንብ ልብስ አስረክቧል',
        returnedBoots: 'የደህንነት ጫማ አስረክቧል',
        returnedBadge: 'መታወቂያ አስረክቧል',
        storekeeperSign: 'የስቶር ኃላፊ ማረጋገጫ',
        hrHeadSign: 'የሰው ኃይል ኃላፊ ፊርማ',
        certificateBtn: 'የስንብት ሰርተፍኬት አትም'
      },
      payroll: {
        title: 'የወር ደመወዝ መክፈያ መዝገብ',
        subtitle: 'በኢትዮጵያ ንግድ ባንክ እና አዋሽ ባንክ በኩል የሚተላለፍ የደመወዝ ክፍያ።',
        disburseAll: 'ደመወዝ አጽድቅ እና ክፈል',
        downloadBankList: 'የባንክ ዝርዝር አውርድ'
      },
      orgView: {
        badge: 'የድርጅቱ መዋቅር',
        title: 'የሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር የስራ አመራር እና የሰው ኃይል መዋቅር',
        desc: 'የሀብ ቢዝነስ ይፋዊ የስራ አመራር ተዋረድ። የሰው ኃይል ክፍል በቀጥታ በኦፕሬሽንስ መምሪያ ስር የተዋቀረ ሲሆን ከሎጅስቲክስ፣ ከሳይት ተቆጣጣሪዎች እና ከፈረቃ መሪዎች ጋር በመቀናጀት የጥበቃ እና የፅዳት ሠራተኞችን ስራ ይመራል።',
        filterAll: 'ሁሉም አመራሮች',
        filterHR: 'የሰው ኃይል ቡድን',
        filterOps: 'የኦፕሬሽንስ እና የመስክ ቡድን',
        filterExec: 'የበላይ አመራር እና ህግ',
        inspect: 'ሙሉ መረጃ ተመልከት',
        setRole: 'ይህን ሚና ምረጥ'
      }
    }
  }
};

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('hab_language') || 'am' : 'am';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // default to Amharic as requested!
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
