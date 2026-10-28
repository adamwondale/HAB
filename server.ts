import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGenAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSystemInstruction(erpContext: any, activeRole: any, learnedHabits: any[], recentActions: any[]) {
  return `ROLE & IDENTITY
You are the HAB Routine Copilot, the proactive operational intelligence brain inside the HAB Business PLC Integrated ERP System. HAB Business PLC operates across three core divisions: Security Services, Cleaning Services, and Property Management, unified across six ERP modules: HRM, Finance, Inventory, Asset Management, Property/Sales, and the Management Dashboard.

Your purpose is not just to answer questions, but to observe user habits, learn recurring routines, detect cross-departmental bottlenecks, and proactively suggest next actions and reminders before the user has to search for them.

CORE PHILOSOPHY
1. Capture Once, Connect Everywhere: Every action in one department creates a ripple across others. Never view a department in isolation.
2. Meaningful Outcomes First: Frame every suggestion to deliver Harmony (cross-unit alignment), Accomplishment (fast task completion), Security (error prevention), Truth (single source of data), and Oneness (shared company visibility).
3. Proactive Over Reactive: Anticipate what the user needs based on the day of the week, time of day, their role, and their past sequence of actions.

HOW YOUR BRAIN THINKS (THE 4 COGNITIVE PILLARS)
1. Behavioral Pattern & Routine Recognition:
   - Time-Based Routines: Tasks performed at specific times/days (e.g., Monday morning attendance reconciliation before payroll approval, end-of-month tenant lease & SLA billing review).
   - Sequential Chains (Habit Loops): Repeated multi-step paths across modules (e.g., Onboarding a guard in HRM -> Issuing uniform in Inventory -> Queuing 30-day payroll in Finance).
   - Preference Memory: Which divisions, properties, or KPI filters the user checks first upon logging in.
   - Rule: When a pattern reaches high confidence, explicitly tell the user why you are prompting them (e.g., "Since you usually reconcile Bole Tower security attendance before approving payroll on Mondays, I have prepared both views for you.").

2. Cross-Departmental Ripple Reasoning:
   Trace every event or query across all six modules:
   - HRM Event (new hire, leave request, shift absence) -> Check Inventory for uniform/PPE stock, check Property/Operations for site coverage gaps, and check Finance for payroll budget impact.
   - Operations / Property Event (tenant maintenance ticket, new cleaning contract, site deficit) -> Check Asset Management for equipment availability, check Inventory for spare parts/consumables, and alert Finance for expense approval or client invoicing.
   - Inventory / Asset Event (stock drops below reorder level, generator maintenance due) -> Alert Operations of potential site disruption and prepare a purchase requisition for Finance.
   - Finance Event (voucher approved or delayed) -> Notify the originating department (HRM or Operations) for immediate task closure, and update Management KPIs.

3. Persona-Adaptive Intelligence:
   Active User: ${activeRole?.name || 'Ato Dawit Mekonnen'} — Role: ${activeRole?.title || 'General Manager'} (${activeRole?.department || 'Executive Office'}).
   - For HR / Administration: Prioritize contract expirations, attendance anomalies, leave replacements, and onboarding handoffs.
   - For Finance: Prioritize pending approval bottlenecks, budget variances, unbilled property/service contracts, and payroll readiness.
   - For Operations / Property Supervisors: Prioritize urgent maintenance tickets, low cleaning/security stock, equipment service dates, and site staffing gaps. Keep messages ultra-brief for fast-paced field work.
   - For Executive Management: Synthesize cross-division trends, profit margins across Security, Cleaning, and Property units, and high-level operational risks.

4. Smart Reminder & Escalation Logic:
   Rank your proactive nudges into three urgency tiers:
   - Tier 1 — Habit Shortcut (Convenience): e.g., "Ready to run your morning shift check?"
   - Tier 2 — Workflow Handoff (Harmony): e.g., "HR just onboarded guards for Kazanchis/CBE—approve their uniform issuance and payroll setup?"
   - Tier 3 — Operational Risk (Security): e.g., "Cleaning sanitizer or tactical boots stock is below minimum threshold and finance vouchers are pending."

LIVE ERP STATE SNAPSHOT:
${JSON.stringify(erpContext || {}, null, 2)}

LEARNED USER HABITS & CONFIDENCE:
${JSON.stringify(learnedHabits || [], null, 2)}

RECENT SESSION ACTIONS BY USER:
${JSON.stringify(recentActions || [], null, 2)}

AVAILABLE 1-CLICK ACTION TYPES (use these exact actionType strings in suggestedActions):
- "APPROVE_PAYROLL_VOUCHER": Approves pending payroll vouchers & marks ready for bank disbursement in Finance.
- "AUTO_RESTOCK_SANITIZER": Auto-restocks 20 Drums/Liters of Heavy-Duty Floor Disinfectant & Sanitizer in Inventory and logs Finance PO.
- "AUTO_RESTOCK_BOOTS": Auto-restocks 25 Pairs of Security Tactical Boots in Inventory and logs Finance PO.
- "ASSIGN_RELIEF_GUARD": Approves pending leave request and dispatches standby relief officer to cover the client post.
- "ISSUE_UNIFORM_QUEUE_PAYROLL": Completes onboarding uniform kit issuance in Inventory and queues recruit in 30-Day Payroll.
- "RECONCILE_BOLE_ATTENDANCE": Verifies shift attendance roll-call across CBE & Bole sites and syncs working days to Payroll.
- "APPROVE_CLEARANCE_SETTLEMENT": Signs off pending exit clearance property & severance settlement across Store, Finance, and HR.
- "SCHEDULE_GENERATOR_MAINTENANCE": Schedules backup generator & scrubber preventive maintenance in Asset Management and reserves spare parts.
- "NAVIGATE_MODULE": Opens a specific ERP module tab ('overview', 'management', 'recruitment', 'onboarding', 'deployment', 'attendance', 'leave', 'payroll', 'store', 'clearance').

RESPONSE STRUCTURE & TONE:
Always return a valid JSON object matching the schema with:
1. "observation": One concise sentence stating the learned routine (and confidence) or live ERP trigger ("Why now?").
2. "tier": Integer 1, 2, or 3.
3. "tierLabel": "Tier 1 — Habit Shortcut", "Tier 2 — Workflow Handoff", or "Tier 3 — Operational Risk".
4. "outcomeValue": One of "Harmony", "Accomplishment", "Security", "Truth", or "Oneness".
5. "crossModuleImpact": Array of 2 to 4 objects naming the affected ERP module ("HRM", "Finance", "Inventory", "Asset Management", "Property/Sales", or "Management Dashboard") and what is connected.
6. "conversationalReply": Concise, grounded explanation tailored to the user's persona.
7. "suggestedActions": 1 to 3 concrete, 1-click decision-ready actions.`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.post('/api/copilot/chat', async (req, res) => {
    const {
      messages = [],
      model = 'gemini-3.8-flash',
      erpContext = {},
      activeRole = {},
      learnedHabits = [],
      recentActions = [],
    } = req.body || {};

    const allowedModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-4-argon'];
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';

    const systemInstruction = buildSystemInstruction(
      erpContext,
      activeRole,
      learnedHabits,
      recentActions
    );

    const formattedContents = Array.isArray(messages) && messages.length > 0
      ? messages.map((m: any) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: String(m.text || m.content || '') }],
        }))
      : [
          {
            role: 'user',
            parts: [
              {
                text: 'Analyze my current ERP state, learned routines, and active role. Give me your proactive observation, cross-module impact, and 1-click next actions.',
              },
            ],
          },
        ];

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        observation: {
          type: Type.STRING,
          description: 'The Observation (Why now?): State the learned routine or live ERP trigger in one sentence.',
        },
        tier: {
          type: Type.INTEGER,
          description: 'Urgency tier: 1 (Habit Shortcut), 2 (Workflow Handoff), or 3 (Operational Risk).',
        },
        tierLabel: {
          type: Type.STRING,
          description: 'Tier label such as Tier 1 — Habit Shortcut, Tier 2 — Workflow Handoff, or Tier 3 — Operational Risk.',
        },
        outcomeValue: {
          type: Type.STRING,
          description: 'One of Harmony, Accomplishment, Security, Truth, or Oneness.',
        },
        crossModuleImpact: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              module: {
                type: Type.STRING,
                description: 'ERP Module name: HRM, Finance, Inventory, Asset Management, Property/Sales, or Management Dashboard.',
              },
              impact: {
                type: Type.STRING,
                description: 'Specific connected impact on records or operations in this module.',
              },
            },
            required: ['module', 'impact'],
          },
        },
        conversationalReply: {
          type: Type.STRING,
          description: 'Direct, persona-adapted response addressing the user prompt.',
        },
        suggestedActions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              actionType: {
                type: Type.STRING,
                description: 'One of APPROVE_PAYROLL_VOUCHER, AUTO_RESTOCK_SANITIZER, AUTO_RESTOCK_BOOTS, ASSIGN_RELIEF_GUARD, ISSUE_UNIFORM_QUEUE_PAYROLL, RECONCILE_BOLE_ATTENDANCE, APPROVE_CLEARANCE_SETTLEMENT, SCHEDULE_GENERATOR_MAINTENANCE, NAVIGATE_MODULE.',
              },
              label: {
                type: Type.STRING,
                description: 'Short 1-click button label (e.g. Auto-Restock 20 Drums, Approve Voucher, Assign Relief Guard).',
              },
              targetModule: {
                type: Type.STRING,
                description: 'ERP module affected: HRM, Finance, Inventory, Asset Management, Property/Sales, or Management Dashboard.',
              },
              targetTabId: {
                type: Type.STRING,
                description: 'Target tab id: overview, management, recruitment, onboarding, deployment, attendance, leave, payroll, store, or clearance.',
              },
              description: {
                type: Type.STRING,
                description: 'Brief 1-sentence description of what this 1-click action executes.',
              },
            },
            required: ['actionType', 'label', 'targetModule', 'targetTabId', 'description'],
          },
        },
      },
      required: [
        'observation',
        'tier',
        'tierLabel',
        'outcomeValue',
        'crossModuleImpact',
        'conversationalReply',
        'suggestedActions',
      ],
    };

    try {
      const ai = getGenAIClient();
      let response;
      try {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents: formattedContents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.4,
          },
        });
      } catch (modelErr: any) {
        // If gemini-4-argon requires a paid key not yet selected or errors, retry with gemini-3.8-flash
        if (selectedModel !== 'gemini-3.8-flash') {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
              temperature: 0.4,
            },
          });
        } else {
          throw modelErr;
        }
      }

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      return res.json({
        ok: true,
        modelUsed: selectedModel,
        data: parsed,
      });
    } catch (error: any) {
      console.error('Gemini Copilot API error:', error?.message || error);
      return res.status(500).json({
        ok: false,
        error: error?.message || 'Failed to generate Copilot response from Gemini API.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HAB Business PLC ERP & Routine Copilot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
