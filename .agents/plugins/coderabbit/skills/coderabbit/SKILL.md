---
name: coderabbit
description: Automated AI code review, diff audit checklist, anti-slop enforcement, security analysis, and coffee domain quality gate. Use when conducting pull-request style code reviews or issuing final SHIP/FIX/REJECT verdicts.
---

# CodeRabbit — Automated Code Review Runbook

Use this runbook to conduct systematic code reviews on modified files, diffs, and pull requests.

---

## 1. Review Procedure

### Step 1: Inspect Changes
Run git diff or view changed files:
```powershell
git diff --stat
git diff
```

### Step 2: Evaluate Against Rubric
Check each change against the 6 rubric dimensions:
1. **Coffee Domain Integrity**: Farmer traceability, batch lineage, accurate inventory ledger, audit logging.
2. **Resource & Bug Safety**: Disposed streams, null checks, proper async/await with cancellation tokens.
3. **Type Rigor**: Zero `any`, zero unchecked `as`, branded types for IDs.
4. **File Budget & Anti-Slop**: Under 250 lines, no narrative commentary, no emoji spam.
5. **UI & Tokens**: Ant Design 5 tokens (`theme.useToken()`), responsive layouts.
6. **Docker Container Health**: `docker compose build` succeeds, all containers (`alocoffee-backend`, `alocoffee-frontend`, `alocoffee-db`) healthy.

---

## 2. Standard Review Report Template

```markdown
# 🐰 CodeRabbit Review Report

## Summary of Changes
- **Target Area**: [Frontend / Backend / Domain / Config]
- **Files Changed**: [Count] files modified, [Count] added, [Count] removed.

## Assessment Matrix
| Dimension | Status | Notes |
|---|---|---|
| Coffee Domain Integrity | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |
| Bug Safety & Resource Hygiene | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |
| Type System Rigor | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |
| File Budget (<250 lines) | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |
| Anti-Slop Discipline | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |
| Docker Container Health | ✅ PASS / ⚠️ WARN / ❌ FAIL | [Details] |

## Findings & Recommendations
- **[File.cs#L45](file:///...)** - *Severity: High*
  - **Issue**: [Description]
  - **Remediation**: [Exact code fix or refactor]

## Verdict
**[ SHIP | FIX | REJECT ]**
```
