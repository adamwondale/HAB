---
name: pstack-unslop-code
description: Anti-slop engineering standards adapted from poteto/pstack. Use when writing, refactoring, or cleaning up code, comments, DTOs, commit messages, and documentation to eliminate AI tells, unnecessary wrappers, and cognitive bloat.
---

# Unslop Code & Architecture (pstack Edition)

AI tools frequently generate bloated, repetitive code and conversational artifacts. This skill enforces rigorous subtraction, lean design, and clean professional engineering.

---

## 1. Golden Rule: Subtract Before You Add

When modifying an existing system or implementing a new feature:
1. Identify and delete dead code, obsolete props, and unused endpoints first.
2. Refactor existing duplicate logic into a single cohesive structure before layering on new code.
3. Keep changes tight: a 50-line focused PR that removes 100 lines of cruft is superior to a 500-line addition.

---

## 2. Code Slop Patterns to Detect and Eliminate

| Anti-Pattern | Bad Example | Clean pstack Replacement |
|--------------|-------------|--------------------------|
| **Redundant Comments** | `// Set the farmer name`<br>`setFarmer(name);` | Remove comment. Let clear names speak for themselves. |
| **Pass-Through Wrappers** | `const getLot = (id: string) => fetchLot(id);` | Call `fetchLot(id)` directly. Delete useless indirection. |
| **Premature Generics** | `class BaseEntityCrudManagerFactory<T>` for 1 entity | Write simple, concrete functions. Abstract only when 3+ patterns emerge. |
| **Error Swallowing** | `catch (err) { console.log(err); }` | Throw typed domain errors or report via UI notification (`message.error`). |
| **Decorative Emoji Slop** | `<h1>🌿 Coffee Lots Management 🚀</h1>` | `<h1>Coffee Lot Management</h1>` — keep enterprise UI clean and functional. |
| **Boolean Accumulation** | Adding a 5th boolean flag to an existing hook | Refactor into an explicit discriminated union state machine. |

---

## 3. Written & Documentation Slop (No AI Tells)

When writing summaries, pull request descriptions, or commit messages:

1. **Banned AI Vocabulary**:
   - Delete: *crucial, delve, enhance, landscape, pivotal, showcase, tapestry, testament, underscore, seamless, robust, leverage*.
   - Replace with plain, direct English: *is, has, uses, prevents, verifies, builds*.
2. **No Superficial `-ing` Framing**:
   - ❌ "Optimized the system by streamlining and showcasing best practices..."
   - ✅ "Split `WarehouseZonesView` into three sub-components; cut render time by 40%."
3. **No Sycophantic Conversational Artifacts**:
   - ❌ "I hope this helps! Let me know if you would like me to delve deeper into anything!"
   - ✅ Provide the structured technical report and verification status directly.

---

## 4. Git Commit & PR Hygiene

Use concise Conventional Commits:

```
feat(traceability): add drying bed moisture validation before milling
fix(ledger): prevent negative stock balance during transit dispatch
refactor(frontend): split monolithic WarehouseZonesView into focused sub-components
test(mass-balance): verify 5:1 cherry-to-green yield ratio bounds
```

Commit descriptions must explain **why** and cite the verification evidence:
```
feat(traceability): enforce 9.5-11.5% moisture band on drying lots

Moisture content outside this band spoils coffee during transit or storage.
- Added validation guard in CoffeeLotLifecycle.
- Added unit tests in CoffeeLotLifecycleTraceabilityTests.
- Verification: dotnet test tests/AloCoffee.Backend.Tests/ passed (7/7).
```
