import {
  Employee,
  ClientSite,
  Deployment,
  AttendanceRecord,
  LeaveRequest,
  ClearanceRecord,
  Candidate,
  OnboardingChecklist,
  PayrollRecord,
  TransferPromotionRecord,
  WorkExperienceRecord,
  ManagementPerson,
  StockItem,
  StockTransaction
} from '../types/hrm';

export const INITIAL_CLIENT_SITES: ClientSite[] = [
  {
    id: 'site-1',
    siteCode: 'CBE-HQ-01',
    name: 'Commercial Bank of Ethiopia Tower (HQ)',
    clientOrganization: 'Commercial Bank of Ethiopia',
    subcity: 'Kirkos / Churchill Ave',
    address: 'Churchill Avenue, Financial District, Addis Ababa',
    servicesProvided: ['Security', 'Cleaning'],
    contractStartDate: '2024-01-01',
    contractEndDate: '2026-12-31',
    contactPerson: 'Ato Tadesse Wolde (Facility Director)',
    contactPhone: '+251 911 234 567',
    securityStaffRequired: 24,
    cleaningStaffRequired: 30,
    securityStaffDeployed: 24,
    cleaningStaffDeployed: 29,
    status: 'Active',
    posts: [
      'Main Pedestrian Turnstiles',
      'VIP Executive Suite (Floor 48-52)',
      'Underground Vault & Cash Handling Area',
      'Basement Level 1-4 Parking Security',
      'Banking Hall Custodial & Floor Care',
      'Restrooms & Sanity Station (Fl 1-20)',
      'Restrooms & Sanity Station (Fl 21-45)'
    ]
  },
  {
    id: 'site-2',
    siteCode: 'ET-CARGO-02',
    name: 'Ethiopian Airlines Cargo Terminal Hub',
    clientOrganization: 'Ethiopian Airlines Group',
    subcity: 'Bole',
    address: 'Bole International Airport Precinct, Gate 6',
    servicesProvided: ['Security', 'Cleaning'],
    contractStartDate: '2023-06-01',
    contractEndDate: '2027-05-31',
    contactPerson: 'W/ro Selamawit Girma (Security Operations Lead)',
    contactPhone: '+251 912 345 678',
    securityStaffRequired: 32,
    cleaningStaffRequired: 18,
    securityStaffDeployed: 31,
    cleaningStaffDeployed: 18,
    status: 'Active',
    posts: [
      'Airside Access Control Gate',
      'Cargo Bay Screening & Pallet Inspection',
      'High-Value Cold Chain Security Perimeter',
      'Terminal Hangar Sweeping & Waste Evacuation',
      'Operations Offices Sanitization'
    ]
  },
  {
    id: 'site-3',
    siteCode: 'HYATT-03',
    name: 'Hyatt Regency Addis Ababa',
    clientOrganization: 'Hyatt International Hotels',
    subcity: 'Kirkos',
    address: 'Meskel Square, Central Business District',
    servicesProvided: ['Security', 'Cleaning'],
    contractStartDate: '2024-03-15',
    contractEndDate: '2026-03-14',
    contactPerson: 'Ato Henok Berhanu (Safety & Hygiene Manager)',
    contactPhone: '+251 913 890 123',
    securityStaffRequired: 16,
    cleaningStaffRequired: 22,
    securityStaffDeployed: 16,
    cleaningStaffDeployed: 21,
    status: 'Active',
    posts: [
      'Main Porte Cochere & Vehicle Scanning',
      'Lobby Concierge Watch',
      'Service & Loading Bay Guard Post',
      'Banquet & Ballroom Deep Sanitation',
      'Back of House Kitchen & Steward Cleaning'
    ]
  },
  {
    id: 'site-4',
    siteCode: 'ST-PAUL-04',
    name: "St. Paul's Hospital Millennium Medical College",
    clientOrganization: 'Ministry of Health / St. Paul',
    subcity: 'Gullele',
    address: 'Swaziland Street, Addis Ababa',
    servicesProvided: ['Cleaning'],
    contractStartDate: '2023-09-01',
    contractEndDate: '2026-08-31',
    contactPerson: 'Dr. Yonas Mulugeta (Hospital Administrator)',
    contactPhone: '+251 911 556 789',
    securityStaffRequired: 0,
    cleaningStaffRequired: 36,
    securityStaffDeployed: 0,
    cleaningStaffDeployed: 34,
    status: 'Active',
    posts: [
      'Emergency Department Biohazard Sanitization',
      'Surgical Theater Sterile Cleaning Squad',
      'Outpatient Clinics & Corridor Maintenance',
      'Inpatient Wards Daily Disinfection'
    ]
  },
  {
    id: 'site-5',
    siteCode: 'BOLE-MALL-05',
    name: 'Bole Medhanialem Commercial Complex',
    clientOrganization: 'Bole Plaza Management Consortium',
    subcity: 'Bole',
    address: 'Cameroon Street, Opposite Medhanialem Cathedral',
    servicesProvided: ['Security', 'Cleaning'],
    contractStartDate: '2024-05-01',
    contractEndDate: '2027-04-30',
    contactPerson: 'W/ro Tigist Kebede (Property Manager)',
    contactPhone: '+251 922 456 789',
    securityStaffRequired: 14,
    cleaningStaffRequired: 12,
    securityStaffDeployed: 14,
    cleaningStaffDeployed: 12,
    status: 'Active',
    posts: [
      'Main Atrium Metal Detector Gate',
      'Rear Loading & Parking Lot Patrol',
      'Food Court Waste Station & Floor Care',
      'Escalator & Common Corridor Sanitization'
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    firstName: 'Abebe',
    lastName: 'Kassahun',
    amharicName: 'አበበ ካሳሁን',
    gender: 'Male',
    phone: '+251 911 200 101',
    email: 'abebe.kassahun@hab-business.com',
    dateOfBirth: '1992-04-12',
    hireDate: '2022-03-01',
    serviceType: 'Security',
    role: 'Security Supervisor',
    grade: 'Supervisor',
    status: 'Active',
    currentSiteId: 'site-1',
    currentSiteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    currentShift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Alpha',
    nationalId: 'ET-NID-9923841',
    kebele: 'Kebele 03',
    woreda: 'Woreda 04',
    subcity: 'Kirkos',
    emergencyContact: {
      name: 'Almaz Worku (Spouse)',
      phone: '+251 920 112 233',
      relation: 'Spouse'
    },
    guarantor: {
      name: 'Major Tefera Desta (Rtd.)',
      phone: '+251 911 778 899',
      organization: 'Addis Ababa Veterans Association',
      kebeleId: 'KB-10293',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000293847561'
    },
    salary: {
      baseSalary: 11500,
      siteAllowance: 2000,
      shiftAllowance: 1200,
      hazardAllowance: 1800
    },
    uniformSizes: {
      shirt: 'L',
      trousers: '34',
      boots: '43'
    }
  },
  {
    id: 'emp-102',
    employeeCode: 'HAB-SEC-0102',
    firstName: 'Dawit',
    lastName: 'Bekele',
    amharicName: 'ዳዊት በቀለ',
    gender: 'Male',
    phone: '+251 912 344 556',
    email: 'dawit.bekele@hab-business.com',
    dateOfBirth: '1996-08-20',
    hireDate: '2023-01-15',
    serviceType: 'Security',
    role: 'Security Guard',
    grade: 'L2',
    status: 'In Clearance',
    currentSiteId: 'site-1',
    currentSiteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    currentShift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Alpha',
    nationalId: 'ET-NID-8812399',
    kebele: 'Kebele 14',
    woreda: 'Woreda 07',
    subcity: 'Bole',
    emergencyContact: {
      name: 'Bekele Shiferaw (Father)',
      phone: '+251 911 887 766',
      relation: 'Father'
    },
    guarantor: {
      name: 'Ato Solomon Fikre',
      phone: '+251 921 556 677',
      organization: 'Bole Subcity Trade Office',
      kebeleId: 'KB-88271',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000384759201'
    },
    salary: {
      baseSalary: 7200,
      siteAllowance: 1500,
      shiftAllowance: 800,
      hazardAllowance: 1000
    },
    uniformSizes: {
      shirt: 'M',
      trousers: '32',
      boots: '42'
    }
  },
  {
    id: 'emp-103',
    employeeCode: 'HAB-CLN-0201',
    firstName: 'Tigist',
    lastName: 'Haile',
    amharicName: 'ትዕግስት ኃይሌ',
    gender: 'Female',
    phone: '+251 913 445 667',
    email: 'tigist.haile@hab-business.com',
    dateOfBirth: '1994-11-05',
    hireDate: '2022-09-10',
    serviceType: 'Cleaning',
    role: 'Cleaning Lead',
    grade: 'Senior',
    status: 'In Clearance',
    currentSiteId: 'site-4',
    currentSiteName: "St. Paul's Hospital Millennium Medical College",
    currentShift: 'Morning Shift (06:00 - 14:00)',
    cleaningShiftWeek: 'Week 1 (Morning)',
    nationalId: 'ET-NID-7721832',
    kebele: 'Kebele 08',
    woreda: 'Woreda 02',
    subcity: 'Gullele',
    emergencyContact: {
      name: 'Marta Haile (Sister)',
      phone: '+251 922 778 811',
      relation: 'Sister'
    },
    guarantor: {
      name: 'W/ro Aster Gebru',
      phone: '+251 911 443 322',
      organization: 'Gullele Administration Health Bureau',
      kebeleId: 'KB-55421',
      verified: true
    },
    bankAccount: {
      bankName: 'Awash Bank',
      accountNumber: '01429876543200'
    },
    salary: {
      baseSalary: 8500,
      siteAllowance: 1800,
      shiftAllowance: 600,
      hazardAllowance: 1400
    },
    uniformSizes: {
      shirt: 'M',
      trousers: '30',
      boots: '38'
    }
  },
  {
    id: 'emp-104',
    employeeCode: 'HAB-CLN-0202',
    firstName: 'Mulu',
    lastName: 'Tesfaye',
    amharicName: 'ሙሉ ተስፋዬ',
    gender: 'Female',
    phone: '+251 911 889 900',
    email: 'mulu.tesfaye@hab-business.com',
    dateOfBirth: '1998-02-18',
    hireDate: '2023-04-01',
    serviceType: 'Cleaning',
    role: 'Hospital Hygiene Cleaner',
    grade: 'L2',
    status: 'Active',
    currentSiteId: 'site-4',
    currentSiteName: "St. Paul's Hospital Millennium Medical College",
    currentShift: 'Morning Shift (06:00 - 14:00)',
    cleaningShiftWeek: 'Week 1 (Morning)',
    nationalId: 'ET-NID-6654219',
    kebele: 'Kebele 11',
    woreda: 'Woreda 05',
    subcity: 'Gullele',
    emergencyContact: {
      name: 'Tesfaye Alemu (Father)',
      phone: '+251 912 334 455',
      relation: 'Father'
    },
    guarantor: {
      name: 'Ato Getachew Zeleke',
      phone: '+251 913 221 100',
      organization: 'Addis Ababa Education Bureau',
      kebeleId: 'KB-33120',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000492837192'
    },
    salary: {
      baseSalary: 6800,
      siteAllowance: 1600,
      shiftAllowance: 500,
      hazardAllowance: 1500
    },
    uniformSizes: {
      shirt: 'S',
      trousers: '28',
      boots: '37'
    }
  },
  {
    id: 'emp-105',
    employeeCode: 'HAB-SEC-0105',
    firstName: 'Yohannes',
    lastName: 'Mekonnen',
    amharicName: 'ዮሐንስ መኮንን',
    gender: 'Male',
    phone: '+251 914 556 778',
    email: 'yohannes.mekonnen@hab-business.com',
    dateOfBirth: '1991-07-29',
    hireDate: '2021-11-15',
    serviceType: 'Security',
    role: 'Senior Airside Guard',
    grade: 'Senior',
    status: 'Active',
    currentSiteId: 'site-2',
    currentSiteName: 'Ethiopian Airlines Cargo Terminal Hub',
    currentShift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Bravo',
    nationalId: 'ET-NID-5519823',
    kebele: 'Kebele 06',
    woreda: 'Woreda 03',
    subcity: 'Bole',
    emergencyContact: {
      name: 'Hiwot Mekonnen (Sister)',
      phone: '+251 911 667 788',
      relation: 'Sister'
    },
    guarantor: {
      name: 'Commander Girma Tulu (Rtd.)',
      phone: '+251 912 119 900',
      organization: 'Federal Police Commission Welfare',
      kebeleId: 'KB-77192',
      verified: true
    },
    bankAccount: {
      bankName: 'Dashen Bank',
      accountNumber: '500192837461'
    },
    salary: {
      baseSalary: 9200,
      siteAllowance: 2200,
      shiftAllowance: 1600,
      hazardAllowance: 2000
    },
    uniformSizes: {
      shirt: 'XL',
      trousers: '36',
      boots: '44'
    }
  },
  {
    id: 'emp-106',
    employeeCode: 'HAB-CLN-0203',
    firstName: 'Meseret',
    lastName: 'Dagne',
    amharicName: 'መሠረት ዳኘ',
    gender: 'Female',
    phone: '+251 915 667 889',
    email: 'meseret.dagne@hab-business.com',
    dateOfBirth: '1997-09-14',
    hireDate: '2023-08-01',
    serviceType: 'Cleaning',
    role: 'Commercial Cleaner',
    grade: 'L1',
    status: 'Active',
    currentSiteId: 'site-3',
    currentSiteName: 'Hyatt Regency Addis Ababa',
    currentShift: 'Afternoon Shift (14:00 - 22:00)',
    cleaningShiftWeek: 'Week 2 (Afternoon)',
    nationalId: 'ET-NID-4428190',
    kebele: 'Kebele 09',
    woreda: 'Woreda 01',
    subcity: 'Kirkos',
    emergencyContact: {
      name: 'Dagne Kebede (Father)',
      phone: '+251 911 990 011',
      relation: 'Father'
    },
    guarantor: {
      name: 'W/ro Rahel Negash',
      phone: '+251 922 334 499',
      organization: 'Kirkos Subcity Revenues Branch',
      kebeleId: 'KB-22194',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000678912345'
    },
    salary: {
      baseSalary: 6500,
      siteAllowance: 1500,
      shiftAllowance: 700,
      hazardAllowance: 600
    },
    uniformSizes: {
      shirt: 'M',
      trousers: '30',
      boots: '38'
    }
  },
  {
    id: 'emp-107',
    employeeCode: 'HAB-SEC-0107',
    firstName: 'Biniyam',
    lastName: 'Assefa',
    amharicName: 'ቢንያም አሰፋ',
    gender: 'Male',
    phone: '+251 916 778 990',
    email: 'biniyam.assefa@hab-business.com',
    dateOfBirth: '1995-03-30',
    hireDate: '2024-02-15',
    serviceType: 'Security',
    role: 'Security Guard',
    grade: 'Probation',
    status: 'Probation',
    currentSiteId: 'site-5',
    currentSiteName: 'Bole Medhanialem Commercial Complex',
    currentShift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Charlie',
    nationalId: 'ET-NID-3391827',
    kebele: 'Kebele 04',
    woreda: 'Woreda 06',
    subcity: 'Bole',
    emergencyContact: {
      name: 'Eden Assefa (Sister)',
      phone: '+251 913 445 566',
      relation: 'Sister'
    },
    guarantor: {
      name: 'Ato Assefa Mengistu',
      phone: '+251 911 223 344',
      organization: 'Addis Ababa Water & Sewerage Authority',
      kebeleId: 'KB-99124',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000789012345'
    },
    salary: {
      baseSalary: 6800,
      siteAllowance: 1200,
      shiftAllowance: 600,
      hazardAllowance: 800
    },
    uniformSizes: {
      shirt: 'L',
      trousers: '32',
      boots: '42'
    }
  },
  {
    id: 'emp-108',
    employeeCode: 'HAB-SEC-0108',
    firstName: 'Tariku',
    lastName: 'Girma',
    amharicName: 'ታሪኩ ግርማ',
    gender: 'Male',
    phone: '+251 917 889 001',
    email: 'tariku.girma@hab-business.com',
    dateOfBirth: '1993-10-10',
    hireDate: '2023-05-10',
    serviceType: 'Security',
    role: 'Security Guard (Reserve Pool)',
    grade: 'L1',
    status: 'Active',
    currentShift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Bravo',
    nationalId: 'ET-NID-2281934',
    kebele: 'Kebele 01',
    woreda: 'Woreda 03',
    subcity: 'Yeka',
    emergencyContact: {
      name: 'Genet Girma (Sister)',
      phone: '+251 920 445 566',
      relation: 'Sister'
    },
    guarantor: {
      name: 'Ato Berhanu Tadesse',
      phone: '+251 911 889 911',
      organization: 'Yeka Subcity Micro Enterprise Bureau',
      kebeleId: 'KB-44120',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000890123456'
    },
    salary: {
      baseSalary: 6500,
      siteAllowance: 0,
      shiftAllowance: 0,
      hazardAllowance: 500
    },
    uniformSizes: {
      shirt: 'L',
      trousers: '34',
      boots: '43'
    }
  },
  {
    id: 'emp-109',
    employeeCode: 'HAB-PRP-0301',
    firstName: 'Robel',
    lastName: 'Tadesse',
    amharicName: 'ሮቤል ታደሰ',
    gender: 'Male',
    phone: '+251 911 554 321',
    email: 'robel.tadesse@hab-business.com',
    dateOfBirth: '1989-04-12',
    hireDate: '2024-03-01',
    serviceType: 'Property Management',
    role: 'Facility & Property Manager',
    grade: 'Supervisor',
    status: 'Active',
    currentSiteId: 'site-5',
    currentSiteName: 'Bole Medhanialem Commercial Complex',
    currentShift: 'Regular Office Hours (08:00 - 17:00)',
    nationalId: 'ET-NID-3391042',
    kebele: 'Kebele 04',
    woreda: 'Woreda 05',
    subcity: 'Bole',
    emergencyContact: {
      name: 'Meron Tadesse (Spouse)',
      phone: '+251 912 667 788',
      relation: 'Spouse'
    },
    guarantor: {
      name: 'Eng. Samuel Getachew',
      phone: '+251 911 223 344',
      organization: 'Addis Ababa Housing Development Corp',
      kebeleId: 'KB-55190',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000901234567'
    },
    salary: {
      baseSalary: 14500,
      siteAllowance: 1800,
      shiftAllowance: 600,
      hazardAllowance: 1500
    },
    uniformSizes: {
      shirt: 'L',
      trousers: '32',
      boots: '42'
    }
  },
  {
    id: 'emp-110',
    employeeCode: 'HAB-PRP-0302',
    firstName: 'Ephrem',
    lastName: 'Hailu',
    amharicName: 'ኤፍሬም ኃይሉ',
    gender: 'Male',
    phone: '+251 923 887 654',
    email: 'ephrem.hailu@hab-business.com',
    dateOfBirth: '1993-08-22',
    hireDate: '2024-06-15',
    serviceType: 'Property Management',
    role: 'Building Maintenance & HVAC Technician',
    grade: 'Senior',
    status: 'Active',
    currentSiteId: 'site-1',
    currentSiteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    currentShift: 'Regular Office Hours (08:00 - 17:00)',
    nationalId: 'ET-NID-4410298',
    kebele: 'Kebele 07',
    woreda: 'Woreda 08',
    subcity: 'Kirkos',
    emergencyContact: {
      name: 'Hailu Kebede (Father)',
      phone: '+251 911 339 900',
      relation: 'Father'
    },
    guarantor: {
      name: 'Ato Girmanega Teshome',
      phone: '+251 911 776 655',
      organization: 'Ethiopian Electric Utility (EEU)',
      kebeleId: 'KB-61209',
      verified: true
    },
    bankAccount: {
      bankName: 'Awash Bank',
      accountNumber: '01320984756100'
    },
    salary: {
      baseSalary: 10500,
      siteAllowance: 1200,
      shiftAllowance: 400,
      hazardAllowance: 1000
    },
    uniformSizes: {
      shirt: 'M',
      trousers: '32',
      boots: '41'
    }
  },
  {
    id: 'emp-111',
    employeeCode: 'HAB-HQ-0401',
    firstName: 'Kalkidan',
    lastName: 'Mulugeta',
    amharicName: 'ቃልኪዳን ሙሉጌታ',
    gender: 'Female',
    phone: '+251 911 998 877',
    email: 'kalkidan.mulugeta@hab-business.com',
    dateOfBirth: '1992-11-05',
    hireDate: '2023-10-01',
    serviceType: 'Head Office Staff',
    role: 'Senior Accountant & Payroll Specialist',
    grade: 'Senior',
    status: 'Active',
    currentSiteName: 'HAB Head Office (Bole)',
    currentShift: 'Regular Office Hours (08:00 - 17:00)',
    nationalId: 'ET-NID-5529104',
    kebele: 'Kebele 02',
    woreda: 'Woreda 03',
    subcity: 'Bole',
    emergencyContact: {
      name: 'Mulugeta Asfaw (Father)',
      phone: '+251 911 442 211',
      relation: 'Father'
    },
    guarantor: {
      name: 'W/ro Almaz Bekele',
      phone: '+251 911 665 544',
      organization: 'Ministry of Revenues',
      kebeleId: 'KB-77412',
      verified: true
    },
    bankAccount: {
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000334455667'
    },
    salary: {
      baseSalary: 16000,
      siteAllowance: 1500,
      shiftAllowance: 600,
      hazardAllowance: 2000
    },
    uniformSizes: {
      shirt: 'S',
      trousers: '28',
      boots: '38'
    }
  },
  {
    id: 'emp-112',
    employeeCode: 'HAB-HQ-0402',
    firstName: 'Bereket',
    lastName: 'Solomon',
    amharicName: 'በረከት ሰለሞን',
    gender: 'Male',
    phone: '+251 912 112 233',
    email: 'bereket.solomon@hab-business.com',
    dateOfBirth: '1995-02-19',
    hireDate: '2024-02-10',
    serviceType: 'Head Office Staff',
    role: 'HR & Administration Coordinator',
    grade: 'L3',
    status: 'Active',
    currentSiteName: 'HAB Head Office (Bole)',
    currentShift: 'Regular Office Hours (08:00 - 17:00)',
    nationalId: 'ET-NID-6618273',
    kebele: 'Kebele 05',
    woreda: 'Woreda 06',
    subcity: 'Yeka',
    emergencyContact: {
      name: 'Hanna Solomon (Sister)',
      phone: '+251 911 883 322',
      relation: 'Sister'
    },
    guarantor: {
      name: 'Ato Solomon Tadesse',
      phone: '+251 911 551 199',
      organization: 'Addis Ababa Trade Bureau',
      kebeleId: 'KB-88301',
      verified: true
    },
    bankAccount: {
      bankName: 'Dashen Bank',
      accountNumber: '500987654321'
    },
    salary: {
      baseSalary: 12500,
      siteAllowance: 1200,
      shiftAllowance: 500,
      hazardAllowance: 1500
    },
    uniformSizes: {
      shirt: 'M',
      trousers: '31',
      boots: '41'
    }
  }
];

export const INITIAL_DEPLOYMENTS: Deployment[] = [
  {
    id: 'dep-01',
    employeeId: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    employeeName: 'Abebe Kassahun',
    serviceType: 'Security',
    role: 'Security Supervisor',
    siteId: 'site-1',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    post: 'Main Pedestrian Turnstiles',
    shift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Alpha',
    assignedDate: '2024-01-05',
    status: 'Active',
    supervisorNotes: 'Team leader for CBE Tower day shift squad.'
  },
  {
    id: 'dep-02',
    employeeId: 'emp-102',
    employeeCode: 'HAB-SEC-0102',
    employeeName: 'Dawit Bekele',
    serviceType: 'Security',
    role: 'Security Guard',
    siteId: 'site-1',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    post: 'Underground Vault & Cash Handling Area',
    shift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Alpha',
    assignedDate: '2024-01-05',
    status: 'Relieved',
    supervisorNotes: 'Relieved on 2026-09-28 pending resignation clearance.'
  },
  {
    id: 'dep-03',
    employeeId: 'emp-103',
    employeeCode: 'HAB-CLN-0201',
    employeeName: 'Tigist Haile',
    serviceType: 'Cleaning',
    role: 'Cleaning Lead',
    siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College",
    post: 'Surgical Theater Sterile Cleaning Squad',
    shift: 'Morning Shift (06:00 - 14:00)',
    cleaningShiftWeek: 'Week 1 (Morning)',
    assignedDate: '2023-09-01',
    status: 'Relieved',
    supervisorNotes: 'Contract expiration clearance initiated.'
  },
  {
    id: 'dep-04',
    employeeId: 'emp-104',
    employeeCode: 'HAB-CLN-0202',
    employeeName: 'Mulu Tesfaye',
    serviceType: 'Cleaning',
    role: 'Hospital Hygiene Cleaner',
    siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College",
    post: 'Emergency Department Biohazard Sanitization',
    shift: 'Morning Shift (06:00 - 14:00)',
    cleaningShiftWeek: 'Week 1 (Morning)',
    assignedDate: '2023-09-01',
    status: 'Active',
    supervisorNotes: 'Certified in bio-hazard waste segregation & chemical autoclaving.'
  },
  {
    id: 'dep-05',
    employeeId: 'emp-105',
    employeeCode: 'HAB-SEC-0105',
    employeeName: 'Yohannes Mekonnen',
    serviceType: 'Security',
    role: 'Senior Airside Guard',
    siteId: 'site-2',
    siteName: 'Ethiopian Airlines Cargo Terminal Hub',
    post: 'Cargo Bay Screening & Pallet Inspection',
    shift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Bravo',
    assignedDate: '2023-06-15',
    status: 'Active',
    supervisorNotes: 'Authorized for ICAO airside security clearance.'
  },
  {
    id: 'dep-06',
    employeeId: 'emp-106',
    employeeCode: 'HAB-CLN-0203',
    employeeName: 'Meseret Dagne',
    serviceType: 'Cleaning',
    role: 'Commercial Cleaner',
    siteId: 'site-3',
    siteName: 'Hyatt Regency Addis Ababa',
    post: 'Lobby Concierge Watch',
    shift: 'Afternoon Shift (14:00 - 22:00)',
    cleaningShiftWeek: 'Week 2 (Afternoon)',
    assignedDate: '2024-03-20',
    status: 'Active'
  },
  {
    id: 'dep-07',
    employeeId: 'emp-107',
    employeeCode: 'HAB-SEC-0107',
    employeeName: 'Biniyam Assefa',
    serviceType: 'Security',
    role: 'Security Guard',
    siteId: 'site-5',
    siteName: 'Bole Medhanialem Commercial Complex',
    post: 'Main Atrium Metal Detector Gate',
    shift: '24h Duty (24hr ON / 48hr REST)',
    securityPlatoon: 'Platoon Charlie',
    assignedDate: '2024-05-05',
    status: 'Active'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    date: '2026-10-01',
    employeeId: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    employeeName: 'Abebe Kassahun',
    serviceType: 'Security',
    siteId: 'site-1',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    shift: '24h Duty (24hr ON / 48hr REST)',
    status: 'Present',
    checkInTime: '07:00 AM',
    checkOutTime: '07:00 AM (+1d)',
    overtimeHours: 0,
    markedBy: 'Ato Solomon (HR Site Inspector)',
    notes: 'Punctual, inspected all guards turnstiles.'
  },
  {
    id: 'emp-att-04',
    date: '2026-10-01',
    employeeId: 'emp-104',
    employeeCode: 'HAB-CLN-0202',
    employeeName: 'Mulu Tesfaye',
    serviceType: 'Cleaning',
    siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College",
    shift: 'Morning Shift (06:00 - 14:00)',
    status: 'Present',
    checkInTime: '05:55 AM',
    checkOutTime: '02:05 PM',
    overtimeHours: 0,
    markedBy: 'Sister Bethlehem (Hospital Ward Matron)'
  },
  {
    id: 'att-05',
    date: '2026-10-01',
    employeeId: 'emp-105',
    employeeCode: 'HAB-SEC-0105',
    employeeName: 'Yohannes Mekonnen',
    serviceType: 'Security',
    siteId: 'site-2',
    siteName: 'Ethiopian Airlines Cargo Terminal Hub',
    shift: '24h Duty (24hr ON / 48hr REST)',
    status: 'Present',
    checkInTime: '07:00 AM',
    checkOutTime: '07:00 AM (+1d)',
    overtimeHours: 2,
    markedBy: 'Ato Fekadu (Airlines Ops Base)',
    notes: 'Authorized 2 hours overtime for delayed cargo arrival flight ET-302.'
  },
  {
    id: 'att-06',
    date: '2026-10-01',
    employeeId: 'emp-106',
    employeeCode: 'HAB-CLN-0203',
    employeeName: 'Meseret Dagne',
    serviceType: 'Cleaning',
    siteId: 'site-3',
    siteName: 'Hyatt Regency Addis Ababa',
    shift: 'Afternoon Shift (14:00 - 22:00)',
    status: 'Late',
    checkInTime: '02:18 PM',
    checkOutTime: '10:05 PM',
    overtimeHours: 0,
    markedBy: 'W/ro Rahel (Executive Housekeeper)',
    notes: 'Traffic delay along Meskel Square construction corridor.'
  },
  {
    id: 'att-07',
    date: '2026-10-01',
    employeeId: 'emp-107',
    employeeCode: 'HAB-SEC-0107',
    employeeName: 'Biniyam Assefa',
    serviceType: 'Security',
    siteId: 'site-5',
    siteName: 'Bole Medhanialem Commercial Complex',
    shift: '24h Duty (24hr ON / 48hr REST)',
    status: 'Present',
    checkInTime: '07:00 AM',
    checkOutTime: '07:00 AM (+1d)',
    overtimeHours: 0,
    markedBy: 'Ato Daniel (Mall Security Supervisor)'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lve-01',
    employeeId: 'emp-105',
    employeeCode: 'HAB-SEC-0105',
    employeeName: 'Yohannes Mekonnen',
    serviceType: 'Security',
    siteId: 'site-2',
    siteName: 'Ethiopian Airlines Cargo Terminal Hub',
    leaveType: 'Annual Leave',
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    days: 6,
    reason: 'Family wedding ceremonies in Bahir Dar.',
    status: 'Approved',
    appliedDate: '2026-09-25',
    replacementEmployeeId: 'emp-108',
    replacementEmployeeName: 'Tariku Girma (Reserve Pool Guard)',
    reviewedBy: 'Kidus Worku (HR Operations Officer)'
  },
  {
    id: 'lve-02',
    employeeId: 'emp-104',
    employeeCode: 'HAB-CLN-0202',
    employeeName: 'Mulu Tesfaye',
    serviceType: 'Cleaning',
    siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College",
    leaveType: 'Sick Leave',
    startDate: '2026-10-05',
    endDate: '2026-10-07',
    days: 3,
    reason: 'Medical prescription and recovery rest for severe throat infection.',
    status: 'Pending',
    appliedDate: '2026-10-01',
    replacementEmployeeId: '',
    replacementEmployeeName: ''
  }
];

// CRITICAL CLEARANCE RECORDS: Highlighting HR-owned clearance, service-specific items (Security uniforms/batons vs Cleaning overalls/heavy gloves)
export const INITIAL_CLEARANCE_RECORDS: ClearanceRecord[] = [
  {
    id: 'clr-01',
    employeeId: 'emp-102',
    employeeCode: 'HAB-SEC-0102',
    employeeName: 'Dawit Bekele',
    serviceType: 'Security',
    role: 'Security Guard',
    siteId: 'site-1',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    exitReason: 'Resignation',
    initiationDate: '2026-09-20',
    targetExitDate: '2026-10-05',
    status: 'In Progress',
    issuedItems: [
      {
        id: 'sec-item-1',
        name: 'HAB Security Uniform Shirts (Navy Blue, Embroidered)',
        category: 'Uniform',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: '2x sets returned clean and pressed.'
      },
      {
        id: 'sec-item-2',
        name: 'HAB Security Trousers (Tactical Cargo Black)',
        category: 'Uniform',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: '2x sets returned with original buttons.'
      },
      {
        id: 'sec-item-3',
        name: 'Tactical Combat Boots (Size 42)',
        category: 'Uniform',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'In acceptable worn condition.'
      },
      {
        id: 'sec-item-4',
        name: 'Security Beret & HAB Brass Crest Pin',
        category: 'Uniform',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0
      },
      {
        id: 'sec-item-5',
        name: 'Tactical Duty Belt & Whistle with Lanyard',
        category: 'Equipment',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0
      },
      {
        id: 'sec-item-6',
        name: 'Rubberized Security Baton / Truncheon',
        category: 'Equipment',
        isReturned: false,
        condition: 'Missing',
        penaltyFee: 450,
        notes: 'Employee misplaced baton during last shift handoff. Deduction agreed in writing.'
      },
      {
        id: 'sec-item-7',
        name: 'Motorola Two-Way Walkie-Talkie Radio & Charging Dock',
        category: 'Equipment',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'Serial #MOT-HAB-8819 tested working.'
      },
      {
        id: 'sec-item-8',
        name: 'HAB Corporate RFID Smart Badge & CBE Site Pass',
        category: 'Credentials',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'Access card deactivated in CBE physical security database.'
      },
      {
        id: 'sec-item-9',
        name: 'Guard Daily Occurrence & Incident Logbook',
        category: 'Credentials',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'Archived into CBE site records file.'
      }
    ],
    siteSupervisorSignoff: {
      completed: true,
      signedBy: 'Abebe Kassahun (CBE Site Supervisor)',
      signedDate: '2026-09-28',
      remarks: 'All shifts covered; handover completed without disruption.'
    },
    storeAssetSignoff: {
      completed: true,
      signedBy: 'Ato Negussie Balcha (HAB Central Stores Manager)',
      signedDate: '2026-09-29',
      remarks: 'Baton missing; item fee ETB 450 forwarded to Finance for deduction.'
    },
    financeSignoff: {
      completed: true,
      signedBy: 'W/ro Aster Demissie (Finance Officer)',
      signedDate: '2026-09-30',
      salaryAdvanceDeduction: 500,
      unreturnedGearCost: 450,
      finalSeveranceSettlement: 5850,
      remarks: 'Net settlement ready for disbursement upon final HR release.'
    },
    hrClearanceSignoff: {
      completed: false,
      certificateIssued: false,
      remarks: 'Awaiting final signoff in HR portal by HR Director.'
    }
  },
  {
    id: 'clr-02',
    employeeId: 'emp-103',
    employeeCode: 'HAB-CLN-0201',
    employeeName: 'Tigist Haile',
    serviceType: 'Cleaning',
    role: 'Cleaning Lead',
    siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College",
    exitReason: 'End of Contract',
    initiationDate: '2026-09-15',
    targetExitDate: '2026-10-01',
    status: 'Cleared',
    issuedItems: [
      {
        id: 'cln-item-1',
        name: 'HAB Hospital Sanitization Overalls (Teal, Embroidered)',
        category: 'Uniform',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: '2x sets returned cleaned & disinfected.'
      },
      {
        id: 'cln-item-2',
        name: 'Heavy-Duty Industrial Cleaning Rubber Gloves (Pair)',
        category: 'Safety Gear',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'Verified intact without tears or chemical punctures.'
      },
      {
        id: 'cln-item-3',
        name: 'Chemical Splash Protective Face Visor & Goggles',
        category: 'Safety Gear',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0
      },
      {
        id: 'cln-item-4',
        name: 'Waterproof Non-Slip Safety Rubber Gumboots (Size 38)',
        category: 'Safety Gear',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0
      },
      {
        id: 'cln-item-5',
        name: 'Janitorial Chemical Dispensary & Locker Master Key',
        category: 'Equipment',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0,
        notes: 'St. Paul hospital storage padlock keys returned to Matron.'
      },
      {
        id: 'cln-item-6',
        name: 'HAB Cleaning Staff ID Card & Hospital Floor Badge',
        category: 'Credentials',
        isReturned: true,
        condition: 'Good',
        penaltyFee: 0
      }
    ],
    siteSupervisorSignoff: {
      completed: true,
      signedBy: 'Sister Bethlehem (Hospital Ward Matron)',
      signedDate: '2026-09-27',
      remarks: 'Clean handover of surgical suite chemicals inventory.'
    },
    storeAssetSignoff: {
      completed: true,
      signedBy: 'Ato Negussie Balcha (HAB Central Stores Manager)',
      signedDate: '2026-09-28',
      remarks: 'All 6 items received in good order. No deductions required.'
    },
    financeSignoff: {
      completed: true,
      signedBy: 'W/ro Aster Demissie (Finance Officer)',
      signedDate: '2026-09-29',
      salaryAdvanceDeduction: 0,
      unreturnedGearCost: 0,
      finalSeveranceSettlement: 9400,
      remarks: 'Final severance and accrued leave compensation cleared.'
    },
    hrClearanceSignoff: {
      completed: true,
      signedBy: 'Solomon Teshome (HR Director)',
      signedDate: '2026-10-01',
      certificateIssued: true,
      certificateNumber: 'HAB-CLR-2026-089',
      remarks: 'Clearance fully certified. Certificate of Service and settlement check issued.'
    }
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    candidateCode: 'REC-2026-041',
    fullName: 'Birhanu Zewdu',
    gender: 'Male',
    phone: '+251 923 112 233',
    targetService: 'Security',
    targetRole: 'Armed Security Officer',
    appliedDate: '2026-09-18',
    stage: 'Offer Issued',
    experienceYears: 4,
    hasMilitaryOrPoliceExp: true,
    kebeleCardProvided: true,
    guarantorProvided: true,
    medicalFit: true,
    interviewScore: 92,
    notes: 'Ex-Federal Police protection division. Excellent discipline and physical fitness scores.'
  },
  {
    id: 'cand-02',
    candidateCode: 'REC-2026-042',
    fullName: 'Bethlehem Mengistu',
    gender: 'Female',
    phone: '+251 934 223 344',
    targetService: 'Cleaning',
    targetRole: 'Hotel Housekeeping & Deep Cleaner',
    appliedDate: '2026-09-22',
    stage: 'Background Check',
    experienceYears: 3,
    hasHospitalCommercialCleaningExp: true,
    kebeleCardProvided: true,
    guarantorProvided: true,
    medicalFit: true,
    interviewScore: 88,
    notes: 'Previously worked at Skylight Hotel housekeeping. High standard for hygiene protocols.'
  },
  {
    id: 'cand-03',
    candidateCode: 'REC-2026-043',
    fullName: 'Tewodros Ayalew',
    gender: 'Male',
    phone: '+251 945 334 455',
    targetService: 'Security',
    targetRole: 'Commercial Security Guard',
    appliedDate: '2026-09-28',
    stage: 'Interview',
    experienceYears: 2,
    hasMilitaryOrPoliceExp: false,
    kebeleCardProvided: true,
    guarantorProvided: false,
    medicalFit: true,
    interviewScore: 78,
    notes: 'Undergoing second round panel interview with Security Operations Manager.'
  }
];

export const INITIAL_ONBOARDING: OnboardingChecklist[] = [
  {
    id: 'onb-01',
    candidateId: 'cand-01',
    employeeCode: 'HAB-SEC-0109',
    fullName: 'Birhanu Zewdu',
    serviceType: 'Security',
    role: 'Armed Security Officer',
    progressPercent: 80,
    tasks: [
      { id: 't1', title: 'National ID & Kebele Residence Verification', category: 'Verification', completed: true, completedAt: '2026-09-25' },
      { id: 't2', title: 'Police Character Clearance Certificate (Criminal Records Directorate)', category: 'Verification', completed: true, completedAt: '2026-09-26' },
      { id: 't3', title: 'Notarized Guarantor Undertaking Letter & Salary Guarantee', category: 'Verification', completed: true, completedAt: '2026-09-27' },
      { id: 't4', title: 'Standard Occupational Medical Fitness & Drug Screening (Bethezatha Clinic)', category: 'Medical', completed: true, completedAt: '2026-09-28' },
      { id: 't5', title: 'Biometric Enrollment & HAB RFID Smart Badge Issuance', category: 'Equipment', completed: true, completedAt: '2026-09-29' },
      { id: 't6', title: 'Security Uniform & Tactical Gear Issue (2x Sets, Boots, Belt, Beret)', category: 'Equipment', completed: false },
      { id: 't7', title: 'Standard Employment Contract Execution (Labor Law 1156/2019 Compliant)', category: 'Contract', completed: false }
    ],
    contractSigned: false,
    initialSiteAssigned: 'Commercial Bank of Ethiopia Tower (HQ)',
    targetStartDate: '2026-10-06'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-01',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    employeeName: 'Abebe Kassahun',
    serviceType: 'Security',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 11500,
    earnedBaseSalary: 11500,
    transportAllowance: 1800,
    mobileCardAllowance: 600,
    houseAllowance: 2600,
    overtimeHours: 6,
    overtimePay: 650,
    grossPay: 17150,
    pensionEmployer11Percent: 1265, // 11% of 11500 (Non-Deductible Employer Contribution)
    incomeTaxDeduction: 2890,
    pensionEmployeeDeduction: 805, // 7% of 11500
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 450,
    netPay: 13005,
    paymentStatus: 'Approved',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000293847561'
  },
  {
    id: 'pay-02',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-105',
    employeeCode: 'HAB-SEC-0105',
    employeeName: 'Yohannes Mekonnen',
    serviceType: 'Security',
    siteName: 'Ethiopian Airlines Cargo Terminal Hub',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 9200,
    earnedBaseSalary: 9200,
    transportAllowance: 1600,
    mobileCardAllowance: 400,
    houseAllowance: 2000,
    overtimeHours: 8,
    overtimePay: 740,
    grossPay: 13940,
    pensionEmployer11Percent: 1012, // 11% of 9200 (Non-Deductible)
    incomeTaxDeduction: 2150,
    pensionEmployeeDeduction: 644, // 7% of 9200
    penaltiesDeduction: 200,
    foodCostSharingDeduction: 400,
    netPay: 10546,
    paymentStatus: 'Approved',
    bankName: 'Dashen Bank',
    accountNumber: '500192837461'
  },
  {
    id: 'pay-03',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-104',
    employeeCode: 'HAB-CLN-0202',
    employeeName: 'Mulu Tesfaye',
    serviceType: 'Cleaning',
    siteName: "St. Paul's Hospital Millennium Medical College",
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 6800,
    earnedBaseSalary: 6800,
    transportAllowance: 1200,
    mobileCardAllowance: 300,
    houseAllowance: 1500,
    overtimeHours: 0,
    overtimePay: 0,
    grossPay: 9800,
    pensionEmployer11Percent: 748, // 11% of 6800 (Non-Deductible)
    incomeTaxDeduction: 1120,
    pensionEmployeeDeduction: 476, // 7% of 6800
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 350,
    netPay: 7854,
    paymentStatus: 'Approved',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000492837192'
  },
  {
    id: 'pay-04',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-106',
    employeeCode: 'HAB-CLN-0203',
    employeeName: 'Meseret Dagne',
    serviceType: 'Cleaning',
    siteName: 'Hyatt Regency Addis Ababa',
    workingDays: 28,
    fullWorkingDays: 30,
    baseSalary: 6600,
    earnedBaseSalary: 6160, // Pro-rated 28 / 30 days
    transportAllowance: 1200,
    mobileCardAllowance: 250,
    houseAllowance: 1400,
    overtimeHours: 4,
    overtimePay: 260,
    grossPay: 9270,
    pensionEmployer11Percent: 678, // 11% of 6160 (Non-Deductible)
    incomeTaxDeduction: 980,
    pensionEmployeeDeduction: 431, // 7% of 6160
    penaltiesDeduction: 150,
    foodCostSharingDeduction: 300,
    netPay: 7409,
    paymentStatus: 'Approved',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000678912345'
  },
  {
    id: 'pay-05',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-109',
    employeeCode: 'HAB-PRP-0301',
    employeeName: 'Robel Tadesse',
    serviceType: 'Property Management',
    siteName: 'Bole Medhanialem Commercial Complex',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 14500,
    earnedBaseSalary: 14500,
    transportAllowance: 2000,
    mobileCardAllowance: 800,
    houseAllowance: 3200,
    overtimeHours: 5,
    overtimePay: 600,
    grossPay: 21100,
    pensionEmployer11Percent: 1595, // 11% of 14500 (Non-Deductible)
    incomeTaxDeduction: 3920,
    pensionEmployeeDeduction: 1015, // 7% of 14500
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 500,
    netPay: 15665,
    paymentStatus: 'Approved',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000901234567'
  },
  {
    id: 'pay-06',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-110',
    employeeCode: 'HAB-PRP-0302',
    employeeName: 'Ephrem Hailu',
    serviceType: 'Property Management',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 10500,
    earnedBaseSalary: 10500,
    transportAllowance: 1500,
    mobileCardAllowance: 500,
    houseAllowance: 2200,
    overtimeHours: 4,
    overtimePay: 420,
    grossPay: 15120,
    pensionEmployer11Percent: 1155, // 11% of 10500 (Non-Deductible)
    incomeTaxDeduction: 2480,
    pensionEmployeeDeduction: 735, // 7% of 10500
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 400,
    netPay: 11505,
    paymentStatus: 'Approved',
    bankName: 'Awash Bank',
    accountNumber: '01320984756100'
  },
  {
    id: 'pay-07',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-111',
    employeeCode: 'HAB-HQ-0401',
    employeeName: 'Kalkidan Mulugeta',
    serviceType: 'Head Office Staff',
    siteName: 'HAB Head Office (Bole)',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 16000,
    earnedBaseSalary: 16000,
    transportAllowance: 2200,
    mobileCardAllowance: 1000,
    houseAllowance: 3500,
    overtimeHours: 0,
    overtimePay: 0,
    grossPay: 22700,
    pensionEmployer11Percent: 1760, // 11% of 16000 (Non-Deductible)
    incomeTaxDeduction: 4410,
    pensionEmployeeDeduction: 1120, // 7% of 16000
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 600,
    netPay: 16570,
    paymentStatus: 'Approved',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000334455667'
  },
  {
    id: 'pay-08',
    month: 'Meskerem 2019 / October 2026',
    employeeId: 'emp-112',
    employeeCode: 'HAB-HQ-0402',
    employeeName: 'Bereket Solomon',
    serviceType: 'Head Office Staff',
    siteName: 'HAB Head Office (Bole)',
    workingDays: 30,
    fullWorkingDays: 30,
    baseSalary: 12500,
    earnedBaseSalary: 12500,
    transportAllowance: 1800,
    mobileCardAllowance: 700,
    houseAllowance: 2800,
    overtimeHours: 0,
    overtimePay: 0,
    grossPay: 17800,
    pensionEmployer11Percent: 1375, // 11% of 12500 (Non-Deductible)
    incomeTaxDeduction: 3080,
    pensionEmployeeDeduction: 875, // 7% of 12500
    penaltiesDeduction: 0,
    foodCostSharingDeduction: 500,
    netPay: 13345,
    paymentStatus: 'Draft',
    bankName: 'Dashen Bank',
    accountNumber: '500987654321'
  }
];

export const INITIAL_TRANSFERS: TransferPromotionRecord[] = [
  {
    id: 'tr-01',
    employeeId: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    employeeName: 'Abebe Kassahun',
    serviceType: 'Security',
    type: 'Role Promotion',
    fromSite: 'Bole Medhanialem Commercial Complex',
    toSite: 'Commercial Bank of Ethiopia Tower (HQ)',
    fromRole: 'Senior Guard',
    toRole: 'Security Supervisor',
    fromShift: 'Day (06:00 - 18:00)',
    toShift: 'Day (06:00 - 18:00)',
    salaryChangeETB: 2300,
    effectiveDate: '2024-01-01',
    reason: 'Exceptional vigilance during incident handling; recommended by Operations Director.',
    approvedBy: 'Solomon Teshome (HR Director)',
    status: 'Executed'
  },
  {
    id: 'tr-02',
    employeeId: 'emp-106',
    employeeCode: 'HAB-CLN-0203',
    employeeName: 'Meseret Dagne',
    serviceType: 'Cleaning',
    type: 'Site Transfer',
    fromSite: "St. Paul's Hospital Millennium Medical College",
    toSite: 'Hyatt Regency Addis Ababa',
    fromRole: 'Commercial Cleaner',
    toRole: 'Commercial Cleaner',
    fromShift: 'Morning (07:00 - 15:00)',
    toShift: 'Evening (15:00 - 23:00)',
    salaryChangeETB: 400,
    effectiveDate: '2024-03-20',
    reason: 'Employee residence relocation closer to Meskel Square; operational vacancy filled.',
    approvedBy: 'Kidus Worku (HR Operations Officer)',
    status: 'Executed'
  }
];

export const INITIAL_WORK_EXPERIENCES: WorkExperienceRecord[] = [
  {
    id: 'wexp-01',
    employeeId: 'emp-103',
    employeeCode: 'HAB-CLN-0201',
    employeeName: 'Tigist Haile',
    serviceType: 'Cleaning',
    role: 'Cleaning Lead & Senior Sanitization Specialist',
    startDate: '2022-09-10',
    endDate: '2026-10-01',
    sitesServed: [
      "St. Paul's Hospital Millennium Medical College (Surgical & ICU Sanitization)",
      'Sunshine Real Estate Luxury Residences'
    ],
    certifications: [
      'Hospital Biohazard Waste Handling & Autoclave Protocol (Cert #MOH-ET-22)',
      'Industrial Floor Stripping, Buffing & Chemical Dilution Safety'
    ],
    conductRating: 'Exceptional',
    certificateNumber: 'HAB-EXP-2026-0182',
    issuedDate: '2026-10-01'
  },
  {
    id: 'wexp-02',
    employeeId: 'emp-101',
    employeeCode: 'HAB-SEC-0101',
    employeeName: 'Abebe Kassahun',
    serviceType: 'Security',
    role: 'Security Supervisor & Tactical Shift Commander',
    startDate: '2022-03-01',
    endDate: 'Present',
    sitesServed: [
      'Commercial Bank of Ethiopia Tower (HQ)',
      'Bole Medhanialem Commercial Complex'
    ],
    certifications: [
      'Corporate VIP Access Control & Metal Detector Calibration',
      'Advanced Crisis Management & Fire Evacuation Incident Command'
    ],
    conductRating: 'Exceptional',
    certificateNumber: 'HAB-EXP-2025-0094',
    issuedDate: '2025-12-31'
  }
];

export const INITIAL_MANAGEMENT_PERSONS: ManagementPerson[] = [
  {
    id: 'mgmt-ceo',
    name: 'Ato Hailemariam Bekele',
    amharicName: 'ኃይለማርያም በቀለ',
    title: 'Chief Executive Officer (CEO)',
    department: 'Executive Office',
    officeLocation: 'Head Office, 6th Floor, Bole, Addis Ababa',
    phone: '+251 911 200 100',
    email: 'ceo@hab-business.com',
    roleCategory: 'Executive',
    responsibilities: [
      'Overall corporate vision and strategic leadership of HAB Business PLC',
      'Client relationship oversight with major institutional partners (CBE, EAL, Hyatt)',
      'Final executive authorization for company-wide budgets and expansions',
      'Corporate governance and compliance with Ethiopian business regulations'
    ],
    permissions: {
      canApproveClearance: true,
      canApprovePayroll: true,
      canManageShiftsAndDeployments: true,
      canManageRecruitmentAndGuarantors: true,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: true,
      canEditEmployees: true
    },
    avatarColor: 'from-amber-600 to-amber-800'
  },
  {
    id: 'mgmt-legal',
    name: 'Adv. Tigist Worku',
    amharicName: 'ትዕግስት ወርቁ',
    title: 'Legal Advisor',
    department: 'Executive Advisory',
    reportsToTitle: 'Chief Executive Officer (CEO)',
    reportsToId: 'mgmt-ceo',
    officeLocation: 'Head Office, 6th Floor, Bole, Addis Ababa',
    phone: '+251 911 345 670',
    email: 'legal@hab-business.com',
    roleCategory: 'Executive',
    responsibilities: [
      'Legal advisory to CEO and HR on Ethiopian Labor Proclamation No. 1156/2019',
      'Review of employment contracts, non-disclosure agreements, and security indemnities',
      'Legal verification of employee disciplinary procedures and termination clearances',
      'Representation in client contractual negotiations and labor tribunal inquiries'
    ],
    permissions: {
      canApproveClearance: true,
      canApprovePayroll: false,
      canManageShiftsAndDeployments: false,
      canManageRecruitmentAndGuarantors: false,
      canVerifyInventoryReturn: false,
      canSignWorkExperience: true,
      canEditEmployees: false
    },
    avatarColor: 'from-purple-600 to-indigo-800'
  },
  {
    id: 'mgmt-ops-head',
    name: 'Ato Solomon Fikre',
    amharicName: 'ሰለሞን ፍቅሬ',
    title: 'Operations Department Head',
    department: 'Operations',
    reportsToTitle: 'Chief Executive Officer (CEO)',
    reportsToId: 'mgmt-ceo',
    officeLocation: 'Operations Command Center, 5th Floor, Bole, Addis Ababa',
    phone: '+251 911 456 780',
    email: 'operations.head@hab-business.com',
    roleCategory: 'Department Head',
    responsibilities: [
      'Executive director of all field operations across Security and Cleaning divisions',
      'Direct managerial oversight of Human Resource, Logistics & Transportation, and Site Supervisors',
      'Service Level Agreement (SLA) fulfillment and client facility security standards',
      'Review and sign-off on master deployment rosters and emergency incident escalations'
    ],
    permissions: {
      canApproveClearance: true,
      canApprovePayroll: true,
      canManageShiftsAndDeployments: true,
      canManageRecruitmentAndGuarantors: true,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: true,
      canEditEmployees: true
    },
    avatarColor: 'from-blue-600 to-cyan-800'
  },
  {
    id: 'mgmt-hr-head',
    name: 'Ato Dawit Yohannes',
    amharicName: 'ዳዊት ዮሐንስ',
    title: 'Head of Human Resource (HR Head)',
    department: 'Human Resource',
    reportsToTitle: 'Operations Department Head',
    reportsToId: 'mgmt-ops-head',
    officeLocation: 'HR Department, 5th Floor, Bole, Addis Ababa',
    phone: '+251 911 567 890',
    email: 'hr.head@hab-business.com',
    roleCategory: 'HR Management',
    responsibilities: [
      'Head of Human Resource operations reporting to Operations Department Head',
      'Final approval of exit clearances, severance calculations, and experience certificates',
      'Monthly payroll register validation and attendance reconciliation with site records',
      'Enforcement of Labor Proclamation No. 1156/2019, employee grievance management, and policy compliance',
      'Supervision of HR Operations Officer and Talent Acquisition & Records Officer'
    ],
    permissions: {
      canApproveClearance: true,
      canApprovePayroll: true,
      canManageShiftsAndDeployments: true,
      canManageRecruitmentAndGuarantors: true,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: true,
      canEditEmployees: true
    },
    avatarColor: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'mgmt-hr-ops',
    name: 'W/ro Selamawit Tadesse',
    amharicName: 'ሰላማዊት ታደሰ',
    title: 'HR Operations & Site Deployment Officer',
    department: 'Human Resource',
    reportsToTitle: 'Head of Human Resource (HR Head)',
    reportsToId: 'mgmt-hr-head',
    officeLocation: 'HR Department, 5th Floor, Bole, Addis Ababa',
    phone: '+251 911 678 901',
    email: 'hr.ops@hab-business.com',
    roleCategory: 'HR Management',
    responsibilities: [
      'Managing the 24h Duty / 48h Rest Security Platoons (Alpha, Bravo, Charlie) cyclic rosters',
      'Controlling the Cleaning Morning (06:00-14:00) ⇄ Afternoon (14:00-22:00) weekly rotation',
      'Deploying, relieving, and transferring field guards and cleaners to client facilities',
      'Daily roll-call attendance verification, tardiness logs, and billable overtime auditing',
      'Liaison with Site Supervisors and Shift Leaders for emergency relief dispatch'
    ],
    permissions: {
      canApproveClearance: false,
      canApprovePayroll: false,
      canManageShiftsAndDeployments: true,
      canManageRecruitmentAndGuarantors: false,
      canVerifyInventoryReturn: false,
      canSignWorkExperience: false,
      canEditEmployees: true
    },
    avatarColor: 'from-sky-600 to-blue-700'
  },
  {
    id: 'mgmt-hr-talent',
    name: 'Ato Henok Assefa',
    amharicName: 'ሄኖክ አሰፋ',
    title: 'Talent Acquisition, Onboarding & Records Officer',
    department: 'Human Resource',
    reportsToTitle: 'Head of Human Resource (HR Head)',
    reportsToId: 'mgmt-hr-head',
    officeLocation: 'HR Department, 5th Floor, Bole, Addis Ababa',
    phone: '+251 911 789 012',
    email: 'hr.talent@hab-business.com',
    roleCategory: 'HR Management',
    responsibilities: [
      'Candidate recruitment pipeline, screening interviews, and physical fitness vetting',
      'Legal Guarantor verification (Kebele ID, letter of guarantee, government office checks)',
      'Uniform sizing, safety shoe distribution, and ID badge issuance during onboarding',
      'Leave management intake and tenure validation (Annual, Sick, Compassionate)',
      'Drafting authenticated Work Experience certificates and managing personnel archives'
    ],
    permissions: {
      canApproveClearance: false,
      canApprovePayroll: false,
      canManageShiftsAndDeployments: false,
      canManageRecruitmentAndGuarantors: true,
      canVerifyInventoryReturn: false,
      canSignWorkExperience: true,
      canEditEmployees: true
    },
    avatarColor: 'from-teal-600 to-emerald-700'
  },
  {
    id: 'mgmt-fin-head',
    name: 'W/ro Meron Tadesse',
    amharicName: 'ሜሮን ታደሰ',
    title: 'Finance & Payroll Department Head',
    department: 'Finance',
    reportsToTitle: 'Chief Executive Officer (CEO)',
    reportsToId: 'mgmt-ceo',
    officeLocation: 'Finance & Accounting Suite, 6th Floor, Bole, Addis Ababa',
    phone: '+251 911 890 123',
    email: 'finance.head@hab-business.com',
    roleCategory: 'Finance & Stores',
    responsibilities: [
      'Preparation and disbursement of the 30-day standard monthly payroll across all 4 divisions',
      'Calculation of additions (transport, mobile card, house allowance, overtime) and statutory deductions (tax, 7% pension, penalties, food cost sharing)',
      'Accounting for the 11% non-deductible employer pension contribution and ERCA tax remittances',
      'Financial settlement of exit clearances, unreturned gear deductions, and store inventory valuation'
    ],
    permissions: {
      canApproveClearance: false,
      canApprovePayroll: true,
      canManageShiftsAndDeployments: false,
      canManageRecruitmentAndGuarantors: false,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: false,
      canEditEmployees: false
    },
    avatarColor: 'from-emerald-700 to-green-900'
  },
  {
    id: 'mgmt-storekeeper',
    name: 'Ato Girma Wolde',
    amharicName: 'ግርማ ወልዴ',
    title: 'Store Keeper & Equipment Controller',
    department: 'Finance',
    reportsToTitle: 'Finance & Payroll Department Head',
    reportsToId: 'mgmt-fin-head',
    officeLocation: 'Central Logistics & Uniform Store, Ground Floor, Bole, Addis Ababa',
    phone: '+251 912 345 678',
    email: 'stores@hab-business.com',
    roleCategory: 'Finance & Stores',
    responsibilities: [
      'Inventory control of uniforms (shirts, trousers, caps), steel-toe boots, and badges',
      'Physical inspection and sign-off on returned company property during exit clearance',
      'Issuance of cleaning chemicals, buffing machines, and PPE to site teams',
      'Reporting lost/damaged gear deductions to Finance and HR for final clearance accounting'
    ],
    permissions: {
      canApproveClearance: false,
      canApprovePayroll: false,
      canManageShiftsAndDeployments: false,
      canManageRecruitmentAndGuarantors: false,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: false,
      canEditEmployees: false
    },
    avatarColor: 'from-amber-700 to-orange-800'
  },
  {
    id: 'mgmt-supervisor-dan',
    name: 'Ato Daniel Kebede',
    amharicName: 'ዳንኤል ከበደ',
    title: 'Senior Field Site Supervisor',
    department: 'Operations',
    reportsToTitle: 'Operations Department Head',
    reportsToId: 'mgmt-ops-head',
    officeLocation: 'Field Operations Patrol, Addis Ababa',
    phone: '+251 913 456 789',
    email: 'supervisor.dan@hab-business.com',
    roleCategory: 'Operations & Field',
    responsibilities: [
      'Day & night site inspection of security posts (vigilance, perimeter checks, turnstile control)',
      'Monitoring cleaning crews on biohazard waste separation and hospital sanitization standards',
      'Liaison with client facility managers at CBE HQ, Ethiopian Airlines, and Hyatt Regency',
      'Direct coordination with HR Operations Officer on attendance disputes and shift turnovers'
    ],
    permissions: {
      canApproveClearance: false,
      canApprovePayroll: false,
      canManageShiftsAndDeployments: true,
      canManageRecruitmentAndGuarantors: false,
      canVerifyInventoryReturn: true,
      canSignWorkExperience: false,
      canEditEmployees: false
    },
    avatarColor: 'from-indigo-600 to-blue-800'
  }
];

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stk-01',
    itemCode: 'STK-SEC-001',
    name: 'Tactical Security Uniform Set (Shirt & Trousers)',
    amharicName: 'የጥበቃ ሙሉ ዩኒፎርም (ሸሚዝ እና ሱሪ)',
    category: 'Security Uniforms & Gear',
    division: 'Security',
    unit: 'Sets',
    quantityInStock: 42,
    minReorderLevel: 15,
    unitCostETB: 1850,
    isReturnable: true,
    storageLocation: 'Shelf A-01 (Central Store)',
    lastUpdated: '2026-10-15'
  },
  {
    id: 'stk-02',
    itemCode: 'STK-SEC-002',
    name: 'Heavy-Duty Steel-Toe Safety Boots (Size 40–44)',
    amharicName: 'የጥበቃ የብረት ጫፍ ቦቲ ጫማ',
    category: 'Security Uniforms & Gear',
    division: 'Security',
    unit: 'Pairs',
    quantityInStock: 18,
    minReorderLevel: 20,
    unitCostETB: 2400,
    isReturnable: true,
    storageLocation: 'Shelf A-04 (Central Store)',
    lastUpdated: '2026-10-14'
  },
  {
    id: 'stk-03',
    itemCode: 'STK-SEC-003',
    name: 'UHF Two-Way Walkie-Talkie Radio + Charger',
    amharicName: 'የጥበቃ መገናኛ ሬዲዮ (ዎኪ ቶኪ)',
    category: 'Security Uniforms & Gear',
    division: 'Security',
    unit: 'Pcs',
    quantityInStock: 14,
    minReorderLevel: 8,
    unitCostETB: 6500,
    isReturnable: true,
    storageLocation: 'Locked Cabinet B-01',
    lastUpdated: '2026-10-12'
  },
  {
    id: 'stk-04',
    itemCode: 'STK-CLN-001',
    name: 'Hospital-Grade Floor Disinfectant & Sanitizer (5L)',
    amharicName: 'የወለል ማጽጃ እና ዲስኢንፌክታንት (5 ሊትር)',
    category: 'Cleaning Supplies & Equipment',
    division: 'Cleaning',
    unit: 'Liters',
    quantityInStock: 65,
    minReorderLevel: 25,
    unitCostETB: 750,
    isReturnable: false,
    storageLocation: 'Chemical Bay C-02',
    lastUpdated: '2026-10-15'
  },
  {
    id: 'stk-05',
    itemCode: 'STK-CLN-002',
    name: 'Commercial Dual-Bucket Wringer Mop Trolley',
    amharicName: 'ባለ ጎማ የወለል መወልወያ ባልዲ',
    category: 'Cleaning Supplies & Equipment',
    division: 'Cleaning',
    unit: 'Pcs',
    quantityInStock: 6,
    minReorderLevel: 8,
    unitCostETB: 8200,
    isReturnable: true,
    storageLocation: 'Equipment Bay C-05',
    lastUpdated: '2026-10-10'
  },
  {
    id: 'stk-06',
    itemCode: 'STK-CLN-003',
    name: 'Cleaning Staff Work Smock & Apron Set',
    amharicName: 'የፅዳት ሠራተኞች ጋዋን እና ሽርጥ',
    category: 'Cleaning Supplies & Equipment',
    division: 'Cleaning',
    unit: 'Sets',
    quantityInStock: 55,
    minReorderLevel: 20,
    unitCostETB: 950,
    isReturnable: true,
    storageLocation: 'Shelf A-08 (Central Store)',
    lastUpdated: '2026-10-14'
  },
  {
    id: 'stk-07',
    itemCode: 'STK-PRP-001',
    name: 'Multi-Purpose Facility Maintenance Toolbox (68-Piece)',
    amharicName: 'የህንፃ ጥገና ሙሉ የመሳሪያ ሳጥን',
    category: 'Property Management & Maintenance',
    division: 'Property Management',
    unit: 'Sets',
    quantityInStock: 9,
    minReorderLevel: 5,
    unitCostETB: 12500,
    isReturnable: true,
    storageLocation: 'Maintenance Rack D-01',
    lastUpdated: '2026-10-11'
  },
  {
    id: 'stk-08',
    itemCode: 'STK-PRP-002',
    name: 'Commercial LED Panel Lights & Ballast Pack (Box of 10)',
    amharicName: 'የቢሮ ኤልኢዲ (LED) መብራቶች (ባለ 10 ካርቶን)',
    category: 'Property Management & Maintenance',
    division: 'Property Management',
    unit: 'Boxes',
    quantityInStock: 4,
    minReorderLevel: 6,
    unitCostETB: 4800,
    isReturnable: false,
    storageLocation: 'Electrical Rack D-04',
    lastUpdated: '2026-10-13'
  },
  {
    id: 'stk-09',
    itemCode: 'STK-HQ-001',
    name: 'A4 Copy Paper 80gsm (500 Sheets Ream)',
    amharicName: 'የፎቶ ኮፒ እና ፕሪንተር ወረቀት (A4)',
    category: 'Head Office & Stationery',
    division: 'Head Office Staff',
    unit: 'Reams',
    quantityInStock: 34,
    minReorderLevel: 15,
    unitCostETB: 1150,
    isReturnable: false,
    storageLocation: 'HQ Stationery Cabinet E-01',
    lastUpdated: '2026-10-15'
  },
  {
    id: 'stk-10',
    itemCode: 'STK-HQ-002',
    name: 'LaserJet Black Toner Cartridge (HP 85A / 26A)',
    amharicName: 'የፕሪንተር ቀለም (ቶነር)',
    category: 'Head Office & Stationery',
    division: 'Head Office Staff',
    unit: 'Pcs',
    quantityInStock: 3,
    minReorderLevel: 5,
    unitCostETB: 4200,
    isReturnable: false,
    storageLocation: 'HQ Stationery Cabinet E-02',
    lastUpdated: '2026-10-12'
  }
];

export const INITIAL_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'trx-01',
    date: '2026-10-15',
    itemId: 'stk-01',
    itemCode: 'STK-SEC-001',
    itemName: 'Tactical Security Uniform Set (Shirt & Trousers)',
    division: 'Security',
    transactionType: 'Issued (Out)',
    quantity: 4,
    unit: 'Sets',
    recipientOrSource: 'CBE Tower Guard Squad (Abebe Kassahun)',
    referenceCode: 'ISS-2026-104',
    handledBy: 'Ato Girma Wolde (Store Keeper)',
    notes: 'Issued 2 sets each for 2 new security guards deployed to CBE HQ.'
  },
  {
    id: 'trx-02',
    date: '2026-10-14',
    itemId: 'stk-04',
    itemCode: 'STK-CLN-001',
    itemName: 'Hospital-Grade Floor Disinfectant & Sanitizer (5L)',
    division: 'Cleaning',
    transactionType: 'Issued (Out)',
    quantity: 15,
    unit: 'Liters',
    recipientOrSource: "St. Paul's Hospital Cleaning Team (Mulu Tesfaye)",
    referenceCode: 'ISS-2026-103',
    handledBy: 'Ato Girma Wolde (Store Keeper)',
    notes: 'Monthly hospital sanitation chemical replenishment.'
  },
  {
    id: 'trx-03',
    date: '2026-10-13',
    itemId: 'stk-08',
    itemCode: 'STK-PRP-002',
    itemName: 'Commercial LED Panel Lights & Ballast Pack (Box of 10)',
    division: 'Property Management',
    transactionType: 'Issued (Out)',
    quantity: 2,
    unit: 'Boxes',
    recipientOrSource: 'Bole Medhanialem Commercial Complex (Robel Tadesse)',
    referenceCode: 'ISS-2026-102',
    handledBy: 'Ato Girma Wolde (Store Keeper)',
    notes: 'Corridor lighting replacement on 2nd and 3rd floors.'
  },
  {
    id: 'trx-04',
    date: '2026-10-11',
    itemId: 'stk-09',
    itemCode: 'STK-HQ-001',
    itemName: 'A4 Copy Paper 80gsm (500 Sheets Ream)',
    division: 'Head Office Staff',
    transactionType: 'Received (Restock)',
    quantity: 20,
    unit: 'Reams',
    recipientOrSource: 'Addis Stationery & Office Supplies PLC',
    referenceCode: 'GRN-2026-089',
    handledBy: 'Ato Girma Wolde (Store Keeper)',
    notes: 'Quarterly office stationery purchase order received.'
  }
];


