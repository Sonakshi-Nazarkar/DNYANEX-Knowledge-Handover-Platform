# DNYANEX — Knowledge That Survives People

> **AI-Powered Knowledge Handover & Project Intelligence Platform**  
> *Round 2 Hackathon MVP Specification & Build*

---

## 1. Executive Summary

When developers, leads, volunteers, or team members depart an organization, critical context evaporates. It remains scattered across Git commit hashes, PR reviews, closed issue discussions, internal meeting notes, and markdown architecture documents.

Generic AI summarizers produce fluent prose but frequently hallucinate unverified dates, invent task owners, mask contradictory timelines, and expose sensitive secrets.

**DNYANEX enforces an evidence-first philosophy:**
> **"A handover is NOT a summary. It is a collection of verifiable, reviewable claims."**

Every claim extracted by DNYANEX must satisfy:
1. **Clear Statement**: Atomic assertion of fact.
2. **Category**: DECISION, TASK, OWNER, RISK, DEPENDENCY, BLOCKER, NEXT_ACTION, OPEN_QUESTION, RECURRING_PROBLEM, CONTACT_OR_RESOURCE.
3. **Exact Supporting Source**: Document or repo coordinate anchor.
4. **Original Supporting Quotation**: Verbatim quotation from source.
5. **Deterministic Evidence Verification**: Code verification against raw text.
6. **Reviewer Decision**: Mandatory human signoff before publication.
7. **Audit Ledger**: Timestamped history of extraction and reviewer actions.

---

## 2. Core Modules Implemented

- **Source Ingestion Hub**: Multi-source support for GitHub repositories (commits, PRs, issues) and architecture documents (Markdown, TXT, CSV, PDF).
- **Automated Credential Redactor**: Pre-LLM sanitization masking GitHub tokens, API keys, and passwords before AI processing.
- **Gemini 3.8 Flash Reconstructor**: High-precision structured extraction utilizing `@google/genai` TypeScript SDK on Express backend.
- **Deterministic Quote Verification Engine**: 100% deterministic code checking verbatim quotes against raw files with character coordinate offsets.
- **Conflict & Contradiction Detection**: Cross-document conflict detector (e.g. Git commit Dec 15 release target vs All-Hands meeting Dec 20 agreement) with a dedicated side-by-side reconciliation workbench.
- **Risk, Blocker & Gap Engine**: Automatic identification of unassigned critical tasks, single-point administrative bottlenecks, and third-party service credit depletion risks.
- **Split-View Claim Ledger**: Left side claim cards with category/status filters; right side original document viewer highlighting the quotation in context.
- **Human Review Desk**: Explicit reviewer gates (Approve, Reject, Clarify Statement, Add Audit Notes, Resolve Contradictions).
- **Role-Based Handover Generator**: Server-enforced RBAC view filtering for Incoming Developers, Project Managers, and Student/Interns.
- **Successor Digital Portal**: 6-question instant orientation dashboard with cryptographic receipt signature handshake.
- **Judge Demo Mode**: Instant one-click guided 9-step evaluation flow based on the *CampusConnect Backend Departure* scenario.

---

## 3. Technology Stack

- **Frontend**: React 19 SPA, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js & Express server with TypeScript (`tsx`).
- **AI Engine**: Google Gemini 3.8 Flash via `@google/genai` (`aistudio-build` User-Agent).
- **Security**: Pre-LLM credential redaction, server-side RBAC, tamper-evident audit logs.

---

## 4. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express backend + Vite middleware on Port 3000)
npm run dev

# 3. Production build
npm run build
npm start
```

---

## 5. Hackathon Demonstration Guide (CampusConnect Scenario)

Use the top **JUDGE DEMO FLOW** banner:
1. **Explore Project**: Inspect CampusConnect status and initial readiness score.
2. **Connected Sources**: View connected GitHub repo and architecture docs.
3. **AI Reconstruction**: Trigger the 8-step pipeline with live log terminal.
4. **Claim Ledger**: Test the split-view and verify yellow-highlighted source quotes.
5. **Inspect Conflict**: View the Dec 15 vs Dec 20 contradiction.
6. **Review Desk**: Resolve the conflict and approve pending claims.
7. **Role Handover**: Generate a role-tailored packet for Incoming Developer.
8. **Successor Signoff**: Switch to Incoming Member portal and sign receipt with digital hash.
