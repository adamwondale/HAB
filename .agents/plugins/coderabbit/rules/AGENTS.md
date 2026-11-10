# CodeRabbit — Code Review & Quality Gate Rules

The **CodeRabbit** protocol acts as the automated pull-request reviewer and gatekeeper for all code changes in the ALO Coffee ERP.

---

## 1. Automated Review Rubric

Every code modification must be evaluated against this 5-point rubric:

### 1. Coffee Domain Integrity (Critical)
- **Traceability**: Outgrower farmer ID -> Washing station batch -> Drying bed lot -> Dry mill lot -> Export lot trace chain cannot be broken.
- **Inventory & Ledger Integrity**: Batch movements, milling runs, and warehouse balances must be accurately maintained without orphaned records.
- **Audit Trail**: Every inventory mutation or batch commit must record actor ID, timestamp, and previous/new values.

### 2. High-Severity Bugs & Leaks (Critical)
- **Resource Leaks**: Streams, database connections, and HTTP clients must be properly disposed (e.g. `using` statements).
- **Null Safety**: Avoid unchecked null access; leverage C# nullable reference types and TypeScript optional chaining.
- **Async Hygiene**: Use `async`/`await` properly; pass `CancellationToken` through backend asynchronous calls.

### 3. Type Rigor & Contracts (High)
- **TypeScript**: Zero explicit `any`, zero unchecked `as` type assertions. Use discriminated unions and branded types.
- **C#**: Strong typing for DTOs; avoid raw `object` or untyped dictionaries for API payloads.

### 4. File Budget & Architectural Cleanliness (High)
- **250-Line Budget**: No component or file should exceed 250 lines. Large files must be decomposed into focused submodules.
- **Anti-Slop**: Reject redundant comments that merely narrate what code does, excessive decorative emojis, and speculative wrapper abstractions.

### 5. UI/UX Consistency (Medium)
- Frontend must use Ant Design 5 token styling via `theme.useToken()`. Hardcoded hex colors are prohibited.

### 6. Docker Container Parity & Health (Critical)
- **Container Build & Deploy**: Code modifications must rebuild cleanly via `docker compose build` without caching stale artifacts.
- **Runtime Health**: Containers (`alocoffee-backend`, `alocoffee-frontend`, `alocoffee-db`) must be up and healthy after deployment.

---

## 2. Verdict Standards

Every CodeRabbit review must conclude with one of three explicit verdicts:
- **SHIP**: All criteria satisfied, tests pass, Docker containers build and run healthy, zero architectural violations.
- **FIX**: Minor issues detected (e.g. file slightly over budget, missing null check, minor lint issue); lists exact file links and fixes.
- **REJECT**: Broken traceability, container build/health failure, severe memory/resource leak, or fundamental architecture flaw.
