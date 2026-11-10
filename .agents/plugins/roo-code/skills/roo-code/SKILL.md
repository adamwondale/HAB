---
name: roo-code
description: Role-specialized autonomous prompting and mode boundaries: Architect (system-planner), Code (builder), Ask (inquiry), Debug (diagnostics), and Review (quality-reviewer). Use when switching modes or delegating across specialized agents.
---

# Roo Code — Multi-Mode Engineering Runbook

The Roo Code framework structures agent operations into five specialized modes. Switch into the appropriate mode depending on the task phase.

---

## 1. Mode Directory & Responsibilities

### 🏛️ Architect Mode (`system-planner`)
- **When to Use**: New feature design, API contract definition, database schema changes, refactoring multi-file architectures.
- **Workflow**:
  1. Inspect existing models (`Domain/Entities`, `frontend/src/types/`).
  2. Verify coffee domain rules (mass balance, traceability, audit logs).
  3. Define explicit C# records and TypeScript interfaces.
  4. Write the Blueprint artifact specifying every file to touch and file line budgets (<250 lines).

### 💻 Code Mode (`frontend-builder` / `coder`)
- **When to Use**: Implementing an approved architectural blueprint.
- **Workflow**:
  1. Read blueprint specs and contract definitions.
  2. Apply `pstack-typescript-rigor` (zero `any`, no unchecked `as`, branded IDs) and `pstack-frontend-craft` (Antd tokens, <250 lines).
  3. Subtract dead code before adding new logic.
  4. Verify compilation locally before concluding.

### ❓ Ask Mode (`research`)
- **When to Use**: Exploring the codebase, clarifying business workflows, checking current system data.
- **Workflow**:
  1. Read files and database schemas in read-only mode.
  2. Provide clear, direct answers with clickable links.
  3. Suggest next actions without mutating the codebase.

### 🩺 Debug Mode (`debugger`)
- **When to Use**: A command, build, or test fails with an error or exception.
- **Workflow**:
  1. **Reproduce**: Run the exact command that produced the error.
  2. **Isolate**: Inspect the stack trace, log line, or compiler error code.
  3. **Hypothesize**: Identify the root cause (e.g. stream disposed, missing column, unhandled null).
  4. **Targeted Fix**: Apply a minimal fix to address the root cause only.
  5. **Verify**: Re-run the command to confirm resolution.

### 🔍 Review Mode (`quality-reviewer`)
- **When to Use**: Post-implementation audit before shipping.
- **Workflow**:
  1. Review git diff for regressions, leaks, and anti-slop violations.
  2. Run automated test suites and linters.
  3. Render structured SHIP, FIX, or REJECT verdict.
