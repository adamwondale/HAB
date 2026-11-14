export interface MaterialAsset {
  id: string;
  item: string;
  productCode: string;
  category: 'Security Gear' | 'Cleaning Machines' | 'Head Office IT' | 'Vehicles';
  price: number; // Unit Acquisition Price in ETB
  quantity: number;
  totalCost: number;
  acquisitionDate: string;
  usefulLifeYears: number;
  depreciationRatePct: number; // Annual straight-line rate, e.g. 20%
  accumulatedDepreciation: number;
  currentBookValue: number;
  storeAvailability: number; // In stock / available in store
  status: 'Active' | 'Fully Depreciated' | 'Disposed';
}

export const INITIAL_MATERIALS: MaterialAsset[] = [
  {
    id: 'mat-001',
    item: 'Walkie-Talkie Motorola DP4801e',
    productCode: 'SEC-COM-01',
    category: 'Security Gear',
    price: 18500,
    quantity: 45,
    totalCost: 832500,
    acquisitionDate: '2024-01-15',
    usefulLifeYears: 4,
    depreciationRatePct: 25,
    accumulatedDepreciation: 416250,
    currentBookValue: 416250,
    storeAvailability: 12,
    status: 'Active'
  },
  {
    id: 'mat-002',
    item: 'Industrial Floor Scrubber Karcher BD 50',
    productCode: 'CLN-EQP-04',
    category: 'Cleaning Machines',
    price: 145000,
    quantity: 8,
    totalCost: 1160000,
    acquisitionDate: '2024-06-01',
    usefulLifeYears: 5,
    depreciationRatePct: 20,
    accumulatedDepreciation: 386667,
    currentBookValue: 773333,
    storeAvailability: 2,
    status: 'Active'
  },
  {
    id: 'mat-003',
    item: 'HP ProDesk 400 G7 Workstation',
    productCode: 'HO-IT-12',
    category: 'Head Office IT',
    price: 52000,
    quantity: 16,
    totalCost: 832000,
    acquisitionDate: '2023-09-10',
    usefulLifeYears: 3,
    depreciationRatePct: 33.3,
    accumulatedDepreciation: 647000,
    currentBookValue: 185000,
    storeAvailability: 3,
    status: 'Active'
  },
  {
    id: 'mat-004',
    item: 'Handheld Garrett Metal Detectors',
    productCode: 'SEC-MET-08',
    category: 'Security Gear',
    price: 8500,
    quantity: 60,
    totalCost: 510000,
    acquisitionDate: '2023-03-20',
    usefulLifeYears: 3,
    depreciationRatePct: 33.3,
    accumulatedDepreciation: 510000,
    currentBookValue: 0,
    storeAvailability: 18,
    status: 'Fully Depreciated'
  }
];
