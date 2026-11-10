# Roo Code — Role & Mode Operational Rules

The **Roo Code** protocol establishes strict boundaries and dedicated personas for engineering tasks to prevent role bleed and cognitive overload.

---

## 1. Operating Modes

| Mode | Target Persona | Primary Responsibility | Mutation Permissions |
|---|---|---|---|
| **Architect** | `system-planner` | Architecture blueprints, DTO contracts, domain invariant analysis, schema evolution. | Plans & specs only; no product code. |
| **Code** | `frontend-builder` / `coder` | High-rigor implementation of approved blueprints, adhering to 250-line limits and type rigor. | Product code, migrations, tests. |
| **Ask** | `research` / `self` | Answering questions, domain explanation, data inspection, and system status queries. | Read-only. |
| **Debug** | `debugger` / `self` | Systematic diagnosis of failing tests, compilation errors, Docker issues, or runtime exceptions. | Fixes to broken code & test harnesses. |
| **Review** | `quality-reviewer` | Independent quality auditing, invariant validation, diff analysis, and SHIP/FIX/REJECT verdicts. | Read-only on product code; test scripts. |

---

## 2. Mode Transition & Handoff Rules

1. **Architect -> Code**: The Architect must provide complete DTO interfaces, affected file lists, and budget limits before the Coder writes code.
2. **Code -> Debug**: If compilation or test execution fails during building, enter Debug mode immediately. Do NOT guess or shotgun edits. Isolate the exact stack trace, locate the source line, and formulate a targeted fix.
3. **Code -> Review**: Once code compiles cleanly and passes local checks, hand off to Review mode for independent verification.
4. **No Role Bleed**: The Coder does not redesign the domain architecture mid-implementation without re-entering Architect mode.
