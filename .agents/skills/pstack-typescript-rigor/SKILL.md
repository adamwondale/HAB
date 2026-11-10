---
name: pstack-typescript-rigor
description: Type system discipline and TypeScript best practices adapted from poteto/pstack. Use when defining types, writing API contracts, parsing incoming data, or reviewing any .ts or .tsx files in the frontend or backend integration layers.
---

# TypeScript Rigor (pstack Edition)

The type checker is a proof assistant. Use it to eliminate impossible states, mismatched primitives, and unhandled variants at compile time.

---

## 1. Summary of Rules

| Rule | Summary |
|------|---------|
| **Discriminated Unions** | Model variants with a `status` or `kind` literal discriminant so impossible states cannot compile. Never use optional-field bags. |
| **Branded Types** | Brand semantic ID primitives (`FarmerId`, `BatchId`, `LotId`) so they cannot be accidentally swapped. |
| **Constructive Modeling** | Build types so illegal values cannot be constructed. `[T, ...T[]]` for non-empty lists; start + duration for ranges. |
| **Zero `any`** | External and untrusted data is `unknown`. Validate with schemas before assigning types. |
| **No Unchecked `as` Casts** | Every `as` is a potential runtime crash. Validate first; cast only inside proven type guards. |
| **Parse at the Boundary** | Parse API and Excel data from `unknown` with typed `parseX` functions before use. No schema library is installed; do not import Zod. |
| **Exhaustive Narrowing** | Always handle every branch of a discriminated union. Use `assertNever(val: never)` in the `default` case. |

---

## 2. Branded Types for ALO Coffee Domain Primitives

Primitives like `string` and `number` are too loose for entity identifiers. An agent or developer can easily pass a `stationId` where a `lotId` is expected.

```typescript
declare const brand: unique symbol;
export type Brand<T, B> = T & { readonly [brand]: B };

export type FarmerId = Brand<string, 'FarmerId'>;
export type CherryBatchId = Brand<string, 'CherryBatchId'>;
export type DryingLotId = Brand<string, 'DryingLotId'>;
export type DryMillLotId = Brand<string, 'DryMillLotId'>;
export type ExportLotId = Brand<string, 'ExportLotId'>;
export type WarehouseZoneId = Brand<string, 'WarehouseZoneId'>;
export type TransitManifestNumber = Brand<string, 'TransitManifestNumber'>;

// Factory / validator helper
export function toFarmerId(id: string): FarmerId {
  if (!id.trim()) throw new Error('Invalid FarmerId: cannot be empty');
  return id as FarmerId;
}
```

---

## 3. Discriminated Unions for Coffee Workflows

### ❌ Anti-Pattern (Optional Field Bag):
```typescript
// Fragile: allows contradictory combinations like isCherry=true and cuppingScore=88
interface CoffeeLot {
  id: string;
  isCherry?: boolean;
  isDrying?: boolean;
  isMilled?: boolean;
  moisturePercentage?: number;
  cuppingScore?: number;
  exportContractId?: string;
}
```

### ✅ Clean pstack Pattern (Strict Lifecycle Unions):
```typescript
export type CoffeeLot =
  | {
      stage: 'CHERRY_INTAKE';
      id: CherryBatchId;
      farmerId: FarmerId;
      stationId: string;
      cherryWeightKg: number;
      intakeDate: string;
    }
  | {
      stage: 'PARCHMENT_DRYING';
      id: DryingLotId;
      sourceBatchId: CherryBatchId;
      bedNumber: string;
      parchmentWeightKg: number;
      moisturePercentage: number; // Invariant: must reach 9.5% - 11.5%
      daysOnBed: number;
    }
  | {
      stage: 'DRY_MILLED_GREEN';
      id: DryMillLotId;
      sourceDryingLotId: DryingLotId;
      greenWeightKg: number;
      screenSize: 'Grade1' | 'Grade2';
      cuppingScore: number;
      moisturePercentage: number;
    }
  | {
      stage: 'EXPORT_PACKED';
      id: ExportLotId;
      sourceGreenLotId: DryMillLotId;
      exportWeightBags: number; // 60kg bags
      contractNumber: string;
      icoNumber: string;
    };
```

---

## 4. Constructive Modeling

Build shapes that guarantee invariants syntactically:

1. **Non-Empty Arrays (e.g., merging batches)**:
   ```typescript
   export type NonEmptyArray<T> = [T, ...T[]];

   export function blendLots(lots: NonEmptyArray<DryMillLotId>): BlendSpecification {
     // Guaranteed to have at least one lot; no need for `if (lots.length === 0)`
   }
   ```
2. **Moisture & Yield Bands**:
   ```typescript
   export type Percentage = Brand<number, 'Percentage'>;
   export function parseMoisture(val: number): Percentage {
     if (val < 0 || val > 100) throw new RangeError('Moisture out of bounds');
     return val as Percentage;
   }
   ```

---

## 5. Validation at System Boundaries

Never trust external data (REST API, WebSocket telemetry, Excel uploads). Parse from `unknown` at the perimeter:

```typescript
export interface CherryIntakePayload {
  farmerId: FarmerId;
  cherryWeightKg: number;
  stationId: string;
  unitPriceBirr: number;
  moisturePercentage?: number;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const positive = (v: unknown, field: string): number => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
    throw new TypeError(`${field} must be a positive number`);
  }
  return v;
};

export function parseCherryIntake(raw: unknown): CherryIntakePayload {
  if (!isRecord(raw)) throw new TypeError('Cherry intake must be an object');
  const { farmerId, stationId, moisturePercentage } = raw;
  if (typeof farmerId !== 'string' || typeof stationId !== 'string' || !stationId.trim()) {
    throw new TypeError('farmerId and stationId are required');
  }
  if (moisturePercentage !== undefined &&
      (typeof moisturePercentage !== 'number' || moisturePercentage < 8 || moisturePercentage > 65)) {
    throw new RangeError('moisturePercentage must be between 8 and 65');
  }
  return {
    farmerId: toFarmerId(farmerId),
    stationId,
    cherryWeightKg: positive(raw.cherryWeightKg, 'cherryWeightKg'),
    unitPriceBirr: positive(raw.unitPriceBirr, 'unitPriceBirr'),
    moisturePercentage,
  };
}
```

---

## 6. Exhaustive Narrowing Helper

Ensure every branch of a union is handled. If a new stage or status is added, TypeScript will fail compilation until the case is handled:

```typescript
export function assertNever(x: never, message = 'Unexpected union variant'): never {
  throw new Error(`${message}: ${JSON.stringify(x)}`);
}

// In a component or reducer:
switch (lot.stage) {
  case 'CHERRY_INTAKE':
    return <CherryCard lot={lot} />;
  case 'PARCHMENT_DRYING':
    return <DryingCard lot={lot} />;
  case 'DRY_MILLED_GREEN':
    return <GreenCoffeeCard lot={lot} />;
  case 'EXPORT_PACKED':
    return <ExportCard lot={lot} />;
  default:
    return assertNever(lot);
}
```
