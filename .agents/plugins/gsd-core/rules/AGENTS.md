# GSD Core — Execution & Delivery Rules

The **GSD Core** (Get Shit Done) protocol enforces deterministic milestone progression and anti-drift discipline across all engineering tasks.

---

## 1. Five-Phase State Machine

Every task must progress through these five explicit states without skipping:

```
[ DISCOVERY ] -> [ BLUEPRINT ] -> [ EXECUTE ] -> [ VERIFY ] -> [ SHIP ]
```

1. **DISCOVERY**:
   - Inspect existing files, database models, and types before writing a single line of code.
   - Identify domain constraints (mass balance, traceability, multi-facility ledgers, audit trail).
   - If user requirements are ambiguous, clarify before coding.
2. **BLUEPRINT**:
   - Define exact file paths to create or modify.
   - Outline DTOs, API contracts, and database schema impacts.
   - Check file budgets: Ensure every new/modified component stays strictly under **250 lines**.
3. **EXECUTE**:
   - Surgical, minimal-diff implementation.
   - Subtract dead code or legacy baggage before adding new abstractions.
   - Zero placeholders: Never commit `// TODO: implement later` or stubbed empty handlers.
4. **VERIFY**:
   - Run compilation and tests directly (`dotnet test`, `npm run lint`, `npx tsc --noEmit`).
   - **Automated Docker Sync**: Rebuild containers (`docker compose build`) and restart them (`docker compose up -d`) to verify live container health.
   - Self-diagnose failures: Do not ask the user to test broken code.
5. **SHIP**:
   - Confirm all Docker containers (`alocoffee-backend`, `alocoffee-frontend`, `alocoffee-db`) are healthy.
   - Produce a concise summary of changes, verified command outputs, container status, and file links.

---

## 2. Core Guardrails

- **No Wandering**: Never touch files outside the scope of the active task.
- **Budget Discipline**: If a file approaches 250 lines, split it into composable child components or utility modules.
- **No Speculative Abstractions**: Do not build generic frameworks for one-off features.
- **Atomic Commits/Changes**: Every change must leave the repository in a compilable, healthy state.
