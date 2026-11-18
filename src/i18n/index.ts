import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { commonEn, commonAm } from './modules/common';
import { navEn, navAm } from './modules/nav';
import { dashboardEn, dashboardAm } from './modules/dashboard';
import { deploymentEn, deploymentAm } from './modules/deployment';
import { attendanceEn, attendanceAm } from './modules/attendance';
import { clearanceEn, clearanceAm } from './modules/clearance';
import { recruitmentEn, recruitmentAm } from './modules/recruitment';
import { hrEn, hrAm } from './modules/hr';
import { payrollEn, payrollAm } from './modules/payroll';
import { storeEn, storeAm } from './modules/store';
import { masterSetupEn, masterSetupAm } from './modules/masterSetup';

export const resources = {
  en: {
    common: commonEn,
    nav: navEn,
    dashboard: dashboardEn,
    deployment: deploymentEn,
    attendance: attendanceEn,
    clearance: clearanceEn,
    recruitment: recruitmentEn,
    hr: hrEn,
    payroll: payrollEn,
    store: storeEn,
    masterSetup: masterSetupEn,
    translation: {
      common: commonEn,
      nav: navEn,
      dashboard: dashboardEn,
      deployment: deploymentEn,
      attendance: attendanceEn,
      clearance: clearanceEn,
      recruitment: recruitmentEn,
      hr: hrEn,
      payroll: payrollEn,
      store: storeEn,
      masterSetup: masterSetupEn
    }
  },
  am: {
    common: commonAm,
    nav: navAm,
    dashboard: dashboardAm,
    deployment: deploymentAm,
    attendance: attendanceAm,
    clearance: clearanceAm,
    recruitment: recruitmentAm,
    hr: hrAm,
    payroll: payrollAm,
    store: storeAm,
    masterSetup: masterSetupAm,
    translation: {
      common: commonAm,
      nav: navAm,
      dashboard: dashboardAm,
      deployment: deploymentAm,
      attendance: attendanceAm,
      clearance: clearanceAm,
      recruitment: recruitmentAm,
      hr: hrAm,
      payroll: payrollAm,
      store: storeAm,
      masterSetup: masterSetupAm
    }
  }
} as const;

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('hab_language') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  defaultNS: 'translation',
  ns: [
    'translation',
    'common',
    'nav',
    'dashboard',
    'deployment',
    'attendance',
    'clearance',
    'recruitment',
    'hr',
    'payroll',
    'store',
    'masterSetup'
  ],
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
