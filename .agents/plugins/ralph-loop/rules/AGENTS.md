# Ralph Loop — Autonomous Verification & Self-Healing Rules

The **Ralph Loop** enforces relentless verification and self-healing. Agents must never declare success on unverified code.

---

## 1. Non-Negotiable Exit Criteria

An engineering task is considered complete **ONLY** when:
1. **Backend Build & Tests Pass**:
   ```powershell
   dotnet build backend/AloCoffee.Backend.csproj
   dotnet test tests/AloCoffee.Backend.Tests/AloCoffee.Backend.Tests.csproj
   ```
   Both commands must exit with code `0` and 0 failures.
2. **Frontend Linter & Types Pass**:
   ```powershell
   cd frontend; npm run lint
   npx tsc --noEmit
   ```
   Zero errors, zero warnings treated as errors.
3. **Automated Docker Update & Container Health**:
   ```powershell
   docker compose build
   docker compose up -d
   docker compose ps
   ```
   All containers (`alocoffee-backend`, `alocoffee-frontend`, `alocoffee-db`) must rebuild cleanly, restart, and report healthy.
4. **Domain Integrity & Traceability**:
   - Traceability (unbroken farmer, batch, and lot references).
   - Audit trail recorded for all state mutations.

---

## 2. Autonomous Self-Healing Protocol

When a test, build, or lint check fails:
1. **Do NOT punt to the user**: Do not ask "would you like me to fix this?" or say "you can test this yourself".
2. **Execute Repair Cycle**:
   - Extract the failing assertion or stack trace.
   - Read the relevant file at the exact failure line.
   - Apply a surgical fix.
   - Re-run the verification command immediately.
3. **Cycle Guard**:
   - Up to 3 autonomous fix attempts are permitted per failure.
   - If after 3 attempts the failure persists, halt and escalate to the user with full diagnostic evidence and clear options.
