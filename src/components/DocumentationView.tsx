import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  FileCode,
  Calendar,
  Sparkles,
  Clock
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SPEC' | 'ARCHITECTURE' | 'DATABASE' | 'APIS' | 'ROADMAP'>('SPEC');

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Product Specifications & Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            DNYANEX Technical Specification
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Official system architecture, database schema, fourteen-step workflow, and Round 3 Roadmap as submitted in the Round 1 proposal.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-[#FAF8FF] border border-[#E9E2F5] rounded-xl text-xs shadow-2xs">
          {(['SPEC', 'ARCHITECTURE', 'DATABASE', 'APIS', 'ROADMAP'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'text-[#52525B] hover:text-[#171717]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'SPEC' && (
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-6 text-xs text-[#52525B] shadow-xs">
          <h2 className="text-base font-bold text-[#171717] flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
            <span>The 14-Step DNYANEX Workflow</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: 1, title: 'Project Initialization', desc: 'Create project space, define roles (Owner, Reviewer, Incoming Member).' },
              { num: 2, title: 'Multi-Source Ingestion', desc: 'Connect GitHub repo via read-only PAT and upload architecture docs (MD, TXT, CSV, PDF).' },
              { num: 3, title: 'Text Normalization', desc: 'Extract and standardize text while preserving source coordinates and timestamps.' },
              { num: 4, title: 'Pre-LLM Credential Redaction', desc: 'Mask GitHub PATs, Doppler secrets, AWS keys, and database passwords before AI processing.' },
              { num: 5, title: 'Context Chunking', desc: 'Chunk text into atomic units retaining file references, line numbers, and author tags.' },
              { num: 6, title: 'Gemini 3.8 Flash Extraction', desc: 'Extract atomic claims (Decisions, Tasks, Risks, Blockers) into strict JSON schema.' },
              { num: 7, title: 'Deterministic Quote Verification', desc: 'Validate verbatim supporting quotations against raw source text using exact substring algorithms.' },
              { num: 8, title: 'Confidence & Evidence Classification', desc: 'Assign explicit statuses: VERIFIED, INFERRED, CONFLICTING, MISSING_EVIDENCE.' },
              { num: 9, title: 'Conflict Detection Engine', desc: 'Cross-reference claims from differing sources to flag clashing dates and architecture choices.' },
              { num: 10, title: 'Missing Evidence & Gap Engine', desc: 'Detect unassigned tasks, missing rollback specs, and single-person root access risks.' },
              { num: 11, title: 'Human Review Desk', desc: 'Reviewers inspect claims, edit statements, resolve conflicts, and record audit rationales.' },
              { num: 12, title: 'Role-Based Handover Compilation', desc: 'Filter approved claims into role-specific packages (Incoming Developer, PM, Student/Intern).' },
              { num: 13, title: 'Handover Readiness Verification', desc: 'Verify mathematical readiness index and block publishing if unresolved contradictions remain.' },
              { num: 14, title: 'Immutable Publishing & Digital Receipt', desc: 'Publish immutable snapshot; incoming successor confirms receipt with cryptographic signature.' }
            ].map(step => (
              <div key={step.num} className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] hover:border-[#8B5CF6] transition-colors space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] w-5 h-5 rounded-full bg-[#F5F0FF] text-[#8B5CF6] border border-[#E9E2F5] flex items-center justify-center font-bold">
                    {step.num}
                  </span>
                  <span className="font-bold text-[#171717]">{step.title}</span>
                </div>
                <p className="text-[#52525B] pl-7 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-6 text-xs text-[#52525B] shadow-xs">
          <h2 className="text-base font-bold text-[#171717] flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#8B5CF6]" />
            <span>Full-Stack Architecture & Data Flow</span>
          </h2>

          <div className="p-5 rounded-xl bg-[#FAF8FF] font-mono text-[11px] text-[#171717] leading-relaxed border border-[#E9E2F5] overflow-x-auto">
            <pre>{`
  +-----------------------------------------------------------------------------------+
  |                                  FRONTEND CLIENT                                  |
  |  React 19 SPA + Vite + Tailwind CSS + Lucide Icons + Split-View Evidence Ledger   |
  +-----------------------------------------+-----------------------------------------+
                                            |
                                            | REST API / JSON
                                            v
  +-----------------------------------------------------------------------------------+
  |                                 EXPRESS BACKEND                                   |
  |  - Auth & RBAC Permissions (Owner, Reviewer, Incoming Member)                     |
  |  - Source Ingestion & GitHub REST Connector                                       |
  |  - Deterministic Secret Redactor (API keys, Tokens, Doppler Secrets)               |
  |  - Deterministic Exact Quote Verification Engine                                  |
  |  - Contradiction & Gap Detection Logic                                            |
  |  - Mathematical Handover Readiness Scoring                                        |
  +--------------------+---------------------------------------+----------------------+
                       |                                       |
                       v                                       v
  +------------------------------------+      +---------------------------------------+
  |        GEMINI 3.8 FLASH            |      |          RELATIONAL STORAGE           |
  |  - Server-side @google/genai SDK   |      |  - Projects, Sources, Claims          |
  |  - JSON Schema Claim Extraction    |      |  - Conflicts, Evidence Matches        |
  |  - User-Agent: 'aistudio-build'    |      |  - Handovers, Audit Signatures        |
  +------------------------------------+      +---------------------------------------+
`}</pre>
          </div>
        </div>
      )}

      {activeTab === 'DATABASE' && (
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-6 text-xs text-[#52525B] shadow-xs">
          <h2 className="text-base font-bold text-[#171717] flex items-center space-x-2">
            <Database className="w-5 h-5 text-[#8B5CF6]" />
            <span>Relational Schema Design (PostgreSQL / Supabase)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] space-y-2">
              <span className="font-bold text-[#8B5CF6] block">TABLE: claims</span>
              <ul className="space-y-1 text-[#52525B]">
                <li>• id (UUID, PK)</li>
                <li>• project_id (UUID, FK &rarr; projects.id)</li>
                <li>• source_id (UUID, FK &rarr; sources.id)</li>
                <li>• type (VARCHAR: DECISION, TASK, RISK, etc.)</li>
                <li>• statement (TEXT NOT NULL)</li>
                <li>• supporting_quote (TEXT NOT NULL)</li>
                <li>• exact_quote_match (BOOLEAN NOT NULL)</li>
                <li>• match_start_idx (INTEGER)</li>
                <li>• match_end_idx (INTEGER)</li>
                <li>• evidence_status (VARCHAR: VERIFIED, CONFLICTING...)</li>
                <li>• reviewer_status (VARCHAR: PENDING, APPROVED...)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] space-y-2">
              <span className="font-bold text-[#16A34A] block">TABLE: conflicts</span>
              <ul className="space-y-1 text-[#52525B]">
                <li>• id (UUID, PK)</li>
                <li>• project_id (UUID, FK)</li>
                <li>• topic (VARCHAR)</li>
                <li>• claim_a_id (UUID, FK &rarr; claims.id)</li>
                <li>• claim_b_id (UUID, FK &rarr; claims.id)</li>
                <li>• explanation (TEXT)</li>
                <li>• status (VARCHAR: UNRESOLVED, RESOLVED)</li>
                <li>• resolved_claim_id (UUID, FK)</li>
                <li>• resolved_by (VARCHAR)</li>
                <li>• resolved_at (TIMESTAMPTZ)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'APIS' && (
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-4 text-xs text-[#52525B] shadow-xs">
          <h2 className="text-base font-bold text-[#171717] flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-[#8B5CF6]" />
            <span>Core REST API Endpoints</span>
          </h2>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6] text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-[#171717] font-semibold">/api/projects/:id/reconstruct</span>
              </div>
              <span className="text-[#71717A]">Trigger AI Extraction & Verification Pipeline</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white font-bold mr-2 text-[10px]">GET</span>
                <span className="text-[#171717] font-semibold">/api/projects/:id/claims</span>
              </div>
              <span className="text-[#71717A]">Query claims with category and status filters</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#D97706] text-white font-bold mr-2 text-[10px]">PATCH</span>
                <span className="text-[#171717] font-semibold">/api/claims/:id</span>
              </div>
              <span className="text-[#71717A]">Review, edit statement, and record audit note</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#DC2626] text-white font-bold mr-2 text-[10px]">PATCH</span>
                <span className="text-[#171717] font-semibold">/api/conflicts/:id/resolve</span>
              </div>
              <span className="text-[#71717A]">Reconcile clashing statements</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6] text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-[#171717] font-semibold">/api/handovers/:id/acknowledge</span>
              </div>
              <span className="text-[#71717A]">Incoming member signs digital receipt</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ROADMAP' && (
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-6 text-xs text-[#52525B] shadow-xs">
          <h2 className="text-base font-bold text-[#171717] flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#8B5CF6]" />
            <span>Three-Round Hackathon Roadmap</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="font-bold text-[#171717]">ROUND 1 – Planning & Specification (COMPLETED)</span>
              </div>
              <p className="text-[#52525B] text-[11px] pl-6 leading-relaxed">
                Problem discovery, 14-step workflow, database schema design, and hackathon proposal document.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F0FF] border border-[#8B5CF6] space-y-2 shadow-xs">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-bold text-[#8B5CF6]">ROUND 2 – The Build (CURRENT MVP PRIORITY)</span>
              </div>
              <p className="text-[#171717] text-[11px] pl-6 leading-relaxed">
                Full-stack web application, GitHub connector, document ingestion, Gemini 3.8 Flash pipeline,
                deterministic quote verification, split-view Claim Ledger, Review Desk, and role-based publishing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span className="font-bold text-[#171717]">ROUND 3 – Final Product & Pitch (FUTURE SCOPE)</span>
              </div>
              <ul className="list-disc list-inside text-[#52525B] text-[11px] pl-6 space-y-1">
                <li>1. Advanced Cited AI Q&A Assistant operating exclusively on approved claims.</li>
                <li>2. Automatic redaction & handover version diff engine across developer exits.</li>
                <li>3. Scheduled cron refresh of GitHub repositories with real-time change alerts.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
