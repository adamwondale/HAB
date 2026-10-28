# HAB Routine Copilot — Proactive Operational Intelligence & Multi-Turn Gemini Assistant

The **HAB Routine Copilot** transforms the HAB Business PLC Integrated ERP System from a reactive system of record into a proactive operational brain spanning **Security Services**, **Cleaning Services**, and **Property Management** across all six core modules (**HRM, Finance, Inventory, Asset Management, Property/Sales, and Management Dashboard**). It continuously observes user habits, traces cross-departmental ripples, adapts to the active persona, and delivers structured multi-turn Gemini conversations with 1-click operational execution.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions incorporate your confirmed selections and define how the Copilot operates across the ERP workspace:

- **Confirmed Decision 1 — Floating Slide-Over Drawer + Top Smart Nudge Bar**: A persistent, low-profile **Top Smart Nudge Bar** sits directly beneath the main header to surface the highest-priority routine or cross-departmental alert (Tier 1, Tier 2, or Tier 3) with immediate 1-click action buttons. Clicking *"Open Copilot"* or the floating Copilot launcher opens the **Floating Slide-Over Drawer** containing the full multi-turn Gemini chat thread, learned habit registry, and ripple inspector.
- **Confirmed Decision 2 — Direct 1-Click Live State Execution + Toast Feedback**: Every suggested action (e.g., *"Approve Voucher"*, *"Auto-Restock 20 Drums"*, *"Assign Relief Guard"*, *"Issue Uniform & Queue Payroll"*) mutates the live React ERP state immediately upon click, logs the completed step into the habit history, and displays a confirmation toast with a quick link to view the updated record.
- **Confirmed Decision 3 — Live Action Tracking + Pre-Loaded Role Habits & Event Simulator**: The Copilot records real-time user navigation and mutations during the session, ships with realistic pre-calibrated habits per persona (e.g., Monday morning Bole/CBE attendance-to-payroll reconciliation, end-of-month lease and SLA billing review, onboarding-to-store-to-payroll chains), and includes an interactive **Event & Routine Simulator** inside the drawer to trigger cross-module events on demand.

---

## 1. Overview & Core Concept

- **What It Does**: Acts as an always-on operational partner that learns recurring time-based routines, sequential multi-module habit chains, and division preferences; evaluates how events in one department ripple across all six ERP modules; and provides a multi-turn conversational Gemini interface structured around **The Observation**, **The Cross-Module Impact**, and **Suggested Next Actions (1-Click Decisions)**.
- **Target Audience / Persona**: Dynamically adapts tone, priorities, and recommended actions to the active logged-in ERP persona:
  - **Executive / General Management**: Cross-division profit margins, SLA fulfillment across Security, Cleaning, and Property units, and strategic risk synthesis.
  - **HR & Administration**: Contract renewals, shift attendance anomalies, leave relief assignments, and onboarding handoffs.
  - **Finance & Payroll**: Pending voucher bottlenecks, budget variances, unbilled property/service contracts, and 30-day payroll readiness.
  - **Operations, Property Supervisors & Storekeeper**: Urgent facility maintenance tickets, low cleaning/security inventory buffers, equipment service schedules, and site staffing gaps—delivered in ultra-brief field-ready format.
- **Key Value**: Delivers **Harmony** (cross-unit alignment), **Accomplishment** (1-click task closure), **Security** (proactive bottleneck and stockout prevention), **Truth** (grounded in live ERP records), and **Oneness** (shared visibility across all departments).

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Proactive Smart Nudge Bar Flow**: As the user switches roles or navigates modules, the top nudge bar displays the most relevant active nudge ranked by urgency (**Tier 1: Habit Shortcut**, **Tier 2: Workflow Handoff**, **Tier 3: Operational Risk**). The user can execute the suggested 1-click decision right from the bar or expand the reasoning in the Copilot drawer.
  2. **Multi-Turn Gemini Chat & Ripple Analysis Flow**: Opening the slide-over drawer reveals a scrollable conversation thread where the user can ask operational questions or select quick prompts. Users can switch between three Gemini intelligence modes depending on task needs:
     - **Fast Routine Mode (`gemini-3.1-flash-lite`)**: Instant habit checks, quick status lookups, and field supervisor nudges.
     - **Standard Operational Mode (`gemini-3.8-flash`)**: Daily cross-module ripple analysis, workflow handoffs, and multi-turn operational Q&A.
     - **Deep Strategic Reasoning (`gemini-4-argon`)**: Complex executive margin diagnostics, multi-site resource optimization, and policy audits.
  3. **Habit Loop & Event Simulator Flow**: Performing actions in the ERP (such as onboarding a candidate, logging an absence, or issuing stock) or triggering a simulated event in the Copilot's *"Routine & Ripple Lab"* tab immediately computes cross-departmental impacts across HRM, Inventory, Asset Management, Property/Operations, and Finance, generating a fresh structured Copilot card with 1-click execution buttons.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Authoritative, high-craft enterprise SaaS utility aligned with the HAB Business PLC design system—combining warm light golden yellow surfaces with crisp deep navy typography and zero decorative clutter.
  - *Color Palette & Mood*:
    - Primary Surface & Drawer Header: Light Golden Yellow (`#FFF9DB` / `#FFFDE8`) paired with clean white (`#FFFFFF`) and dark slate (`#0F172A`) in dark mode.
    - Primary Brand & Action Accent: HAB Brand Yellow (`#EBE834`) with Deep Navy (`#0E1525`) interactive buttons and focus states.
    - Tier Urgency Signaling (always paired with explicit text labels and icons):
      - **Tier 1 — Habit Shortcut (Convenience)**: Warm Gold / Slate (`#D97706` / `#0E1525`)
      - **Tier 2 — Workflow Handoff (Harmony)**: Sky / Indigo (`#0284C7`)
      - **Tier 3 — Operational Risk (Security)**: Crimson / Amber (`#DC2626`)
  - *Typography & Hierarchy*: Clean sans-serif hierarchy for scannable structured blocks (*The Observation*, *Cross-Module Impact*, *Suggested Next Actions*), paired with strict monospace tabular numerals (`font-mono tabular-nums`) for ETB currency figures, stock quantities, and confidence percentages.
  - *Component Styling & Layout*: Single-elevation flat surfaces with `1px` hairline borders (`border-[#EFE1AA]` / `border-slate-200`), zero nested card clutter, and single-line action buttons (`whitespace-nowrap`).
- **Interactive Feedback & Motion**: Smooth `200ms` slide-over drawer transitions, skeleton loading indicators while Gemini synthesizes live ERP state, and an interactive execution toast with undo/inspect navigation when a 1-click decision is applied.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Structured Response Parsing + Live ERP Context Injection**:
  - *Chosen Approach*: Inject a live serialized snapshot of the current ERP state (active user role, site staffing gaps, low inventory items, pending clearances, payroll totals, onboarding queue, and recent user action history) into the server-side Gemini system instruction on every turn, and format responses into the three mandatory sections (**The Observation**, **The Cross-Module Impact**, and **Suggested Next Actions**) with executable action IDs.
  - *Why*: Ensures the Copilot never hallucinates disconnected advice; every observation references real employees, sites (e.g., CBE Tower, EAL Cargo, Kazanchis Center), and stock quantities, and every action button triggers a deterministic state mutation.
  - *Alternatives Considered*: Free-form unformatted chat text was rejected because it fails to provide 1-click operational closure or structured cross-module visibility.
- **Decision 2 — Hybrid Habit Engine (Pre-Calibrated Persona Routines + Live Session Telemetry)**:
  - *Chosen Approach*: Combine a pre-seeded habit memory store (modeling Monday 8:30 AM attendance checks, EOM lease/SLA reviews, and HRM → Inventory → Finance sequential chains with confidence scores) with a live session observer that increments pattern confidence as the user clicks through tabs and performs actions.
  - *Why*: Gives the user immediate, rich proactive intelligence on first load while visibly learning and adapting to their real clicks during the session.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        HAB ERP Application State                           │
│  (Employees, Sites, Deployments, Attendance, Leave, Payroll, Store Stock,  │
│   Clearances, Candidates, Onboarding, Active Persona, Action History Log)  │
└───────────────┬────────────────────────────────────────────┬───────────────┘
                │ Live State Snapshot & Habit Telemetry      │ Direct 1-Click
                ▼                                            │ State Mutations
┌───────────────────────────────────────────────┐            │
│      Proactive Routine & Ripple Engine        │            │
│  • 4 Cognitive Pillars & Confidence Scoring   │            │
│  • Cross-Departmental Impact Graph (6 Modules)│            │
│  • Tier 1 / Tier 2 / Tier 3 Nudge Ranking     │            │
└───────┬───────────────────────────────┬───────┘            │
        │ Top Priority Nudge            │ Full Context       │
        ▼                               ▼                    │
┌───────────────────────────┐   ┌────────────────────────────────────────────┐
│   Top Smart Nudge Bar     │   │     HAB Routine Copilot Slide-Over         │
│  • Tier Label & Why Now   │   │  • Multi-Turn Scrollable Chat Thread       │
│  • Cross-Module Summary   │   │  • Model Selector (Flash / Lite / Argon)   │
│  • 1-Click Action Buttons │   │  • Habit Memory & Ripple Simulator Tab     │
│  • "Open Copilot" Trigger │   │  • Structured Observation/Impact/Actions   │
└───────────────────────────┘   └─────────────────────┬──────────────────────┘
                                                      │ POST /api/copilot/chat
                                                      ▼
                                ┌────────────────────────────────────────────┐
                                │     Express Server Proxy (/api/copilot)    │
                                │  • @google/genai SDK (Server-Side Only)    │
                                │  • HAB Routine Copilot System Instruction  │
                                │  • Multi-Turn History & Structured Output  │
                                └────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `UserActionEvent`: Tracks `{ id, timestamp, actorRole, moduleId, actionType, targetEntity, metadata }` to detect sequential chains (e.g., `HRM:Onboard` → `Inventory:IssueUniform` → `Finance:QueuePayroll`).
  - `LearnedRoutine`: Stores `{ id, title, type: 'time-based' | 'sequential-chain' | 'preference', confidencePercent, triggerCondition, explanation, targetPersona, suggestedActions }`.
  - `ProactiveNudge`: Represents ranked alerts `{ id, tier: 1 | 2 | 3, tierLabel, observation, crossModuleImpact: { module: string, detail: string }[], actions: CopilotAction[], resolved: boolean }`.
  - `CopilotMessage`: Multi-turn conversation item `{ id, role: 'user' | 'model', timestamp, modelUsed, rawText, structured?: { observation: string, crossModuleImpact: string[], actions: CopilotAction[] } }`.
- **Interactive Component & State Mapping**:
  - **1-Click Action Dispatcher**: Maps each `CopilotAction` (`APPROVE_PAYROLL_VOUCHER`, `AUTO_RESTOCK_ITEM`, `ASSIGN_RELIEF_GUARD`, `ISSUE_UNIFORM_AND_QUEUE_PAYROLL`, `OPEN_RECONCILIATION_VIEW`, `INITIATE_GENERATOR_SERVICE`) to concrete state updaters in the root application container:
    - *Auto-Restock*: Increments `stockItems` quantity for low-buffer items (e.g., Cleaning Sanitizer Drums or Tactical Boots), appends a `Received (Restock)` entry to `stockTransactions`, and logs a Finance purchase requisition note.
    - *Issue Uniform & Queue Payroll*: Marks equipment tasks complete in `onboardingList`, decrements `stockItems`, and adds a new 30-day record to `payroll`.
    - *Assign Relief Guard*: Approves pending `leaveRequests`, assigns a standby relief officer to the affected client site in `deployments`, and updates site deployed counts.
    - *Approve Voucher / Reconcile*: Updates `payroll` payment statuses from `Pending` to `Disbursed` and navigates to the target module if requested.
- **Key Sequences & Integrations**:
  - **Server-Side Gemini Endpoint (`/api/copilot/chat`)**: Uses the official `@google/genai` SDK on the Express server with `process.env.GEMINI_API_KEY` and `User-Agent: 'aistudio-build'`. Accepts the multi-turn conversation history, selected model (`gemini-3.8-flash` default, `gemini-3.1-flash-lite` for fast routine checks, or `gemini-4-argon` for deep strategic analysis), and live ERP state context. When the user selects `gemini-4-argon`, prompts for a paid key via `paid_model_flow` if needed.
