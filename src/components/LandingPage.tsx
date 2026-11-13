import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck2,
  GitBranch,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  Key,
  Database,
  Network,
  Users,
  EyeOff,
  UserCheck2,
  ExternalLink,
  ChevronRight,
  Search,
  BookOpen
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, setDemoStep } = useApp();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  const workflowSteps = [
    {
      num: '01',
      title: 'Multimodal Ingestion',
      subtitle: 'Code, PRs, ADRs & Transcripts',
      desc: 'Ingests raw commits, open/merged pull requests, architecture decision records, and meeting audio transcripts without altering original files.',
      badge: 'Git + Markdown + Docs'
    },
    {
      num: '02',
      title: 'Evidence-First Extraction',
      subtitle: 'Gemini 3.8 Flash + Secret Redaction',
      desc: 'Identifies atomic decisions, in-flight tasks, and blockers while automatically redacting API keys, passwords, and environment credentials before inference.',
      badge: 'Safe AI Extraction'
    },
    {
      num: '03',
      title: 'Deterministic Verification',
      subtitle: 'Exact Substring Matching & SPOKF Audit',
      desc: 'Mathematical verification algorithm proves that every supporting quotation exists verbatim in the source files. Flagged conflicts prevent hallucinated consensus.',
      badge: 'Zero-Hallucination Gate'
    },
    {
      num: '04',
      title: 'Role-Aware Handover Publishing',
      subtitle: 'Immutable Ledger & Successor Signoff',
      desc: 'Reviewers approve claims, resolve conflicting dates, and publish tailored views (Executive, Backend Successor, Security) with cryptographic digital signatures.',
      badge: 'Enterprise Compliance'
    }
  ];

  return (
    <div className="bg-[#FAF8FF] text-[#171717] min-h-screen selection:bg-[#8B5CF6] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E9E2F5] bg-gradient-to-b from-[#FAF8FF] via-[#F5F0FF] to-white">
        {/* Subtle Background Glow with Soft Lavender */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#A78BFA]/20 via-[#F5F0FF] to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E9E2F5] text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-[#52525B]">DNYANEX Enterprise Knowledge Preservation</span>
            <span className="text-[#A78BFA]">·</span>
            <span className="text-[#8B5CF6] font-semibold">Light Theme</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#171717] leading-[1.08]">
              Knowledge That{' '}
              <span className="text-[#8B5CF6]">
                Survives People.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[#52525B] max-w-2xl mx-auto leading-relaxed font-normal">
              When key engineers, architects, or managers leave, critical decisions vanish into chat threads.
              DNYANEX turns raw commits, ADRs, and meeting transcripts into verified, permission-aware project handovers.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setActiveView('DASHBOARD');
                setDemoStep(1);
              }}
              className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-7 py-4 rounded-xl shadow-md shadow-[#8B5CF6]/25 transition-all text-sm cursor-pointer"
            >
              <span>Explore Interactive Mission</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => {
                setActiveView('CLAIM_LEDGER');
                setDemoStep(4);
              }}
              className="flex items-center space-x-2 bg-white hover:bg-[#FAF8FF] text-[#8B5CF6] border border-[#8B5CF6] px-6 py-4 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-xs"
            >
              <FileCheck2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>Inspect Verbatim Evidence Ledger</span>
            </button>

            <button
              onClick={() => setActiveView('DOCS')}
              className="flex items-center space-x-2 bg-transparent hover:bg-white text-[#52525B] hover:text-[#171717] px-5 py-4 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>Technical Spec & Schema</span>
            </button>
          </div>

          {/* Foundational Philosophical Axiom Box */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E9E2F5] text-xs text-[#52525B] text-left shadow-sm flex items-start space-x-3.5">
              <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-[#171717] flex items-center space-x-2">
                  <span>The DNYANEX Core Tenet</span>
                  <span className="text-[10px] font-mono text-[#8B5CF6] bg-[#F5F0FF] px-2 py-0.5 rounded border border-[#E9E2F5] uppercase">
                    Zero Unverified Claims
                  </span>
                </div>
                <p className="text-[#52525B] text-xs leading-relaxed">
                  "A handover is not a summary. It is a collection of verifiable, reviewable claims.
                  A statement without exact quote verification must never be presented as verified organizational truth."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4-PHASE HANDOVER WORKFLOW PIPELINE */}
      <section className="py-20 border-b border-[#E9E2F5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5CF6]">
              Continuous Knowledge Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
              How DNYANEX Reconstructs Project Truth
            </h2>
            <p className="text-sm text-[#52525B]">
              From disparate git commits and transcripts to verified successor briefings in 4 automated, human-supervised stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => {
              const isActive = activeWorkflowStep === idx + 1;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(idx + 1)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-[#F5F0FF] border-[#8B5CF6] shadow-sm'
                      : 'bg-[#FAF8FF] border-[#E9E2F5] hover:bg-white hover:border-[#A78BFA]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${
                        isActive
                          ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                          : 'bg-white text-[#8B5CF6] border-[#E9E2F5]'
                      }`}>
                        {step.num}
                      </span>
                      <span className="font-mono text-[10px] text-[#71717A]">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#171717] text-sm">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#8B5CF6]">
                      {step.subtitle}
                    </div>

                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E9E2F5] flex items-center justify-between text-[11px]">
                    <span className="text-[#71717A]">Stage {step.num} of 04</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. COMPARISON MATRIX: DNYANEX VS GENERIC AI SUMMARIZERS */}
      <section className="py-20 border-b border-[#E9E2F5] bg-[#FAF8FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5CF6]">
              The Precision Difference
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
              Why Generic AI Summaries Are Dangerous for Handovers
            </h2>
            <p className="text-sm text-[#52525B]">
              Generic LLMs guess missing dates, conceal contradictory commitments, and invent plausible sounding untruths. DNYANEX enforces deterministic accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generic AI Pitfalls Card */}
            <div className="bg-white border border-[#FECACA] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold text-lg">
                  ✕
                </div>
                <div>
                  <h3 className="font-bold text-[#DC2626] text-base">
                    Generic AI Summarizers & Copilots
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Opaque LLM prompts without verification guarantees
                  </p>
                </div>
              </div>

              <ul className="space-y-4 text-xs text-[#52525B]">
                <li className="flex items-start space-x-3">
                  <span className="text-[#DC2626] font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Hallucinates Missing Timelines:</strong>
                    Invents go-live dates, author identities, and completion percentages when records are incomplete.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#DC2626] font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Silently Harmonizes Contradictions:</strong>
                    If Git says Dec 15 and Slack says Dec 20, LLMs average them or pick one without alerting engineers.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#DC2626] font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Leads to Security Leaks:</strong>
                    Sends Doppler credentials, database connection strings, and webhook secrets directly into model contexts.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#DC2626] font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Zero Human Accountability:</strong>
                    Output is published immediately without mandatory reviewer audit trail or digital signoff.
                  </div>
                </li>
              </ul>
            </div>

            {/* DNYANEX Deterministic Card */}
            <div className="bg-white border border-[#A78BFA] rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F0FF] text-[#8B5CF6] flex items-center justify-center font-bold text-lg border border-[#E9E2F5]">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-[#171717] text-base">
                    DNYANEX Evidence-First Handover Engine
                  </h3>
                  <p className="text-xs text-[#8B5CF6] font-medium">
                    Deterministic Verification + Human Review Gate
                  </p>
                </div>
              </div>

              <ul className="space-y-4 text-xs text-[#52525B]">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Verbatim Quote Verification:</strong>
                    TypeScript engine performs strict substring matching against raw documents to prove every quote is authentic.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Explicit Conflict Highlighting:</strong>
                    Flags conflicting dates side-by-side with exact character offsets; prevents publication until resolved.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Pre-LLM Secret Redaction:</strong>
                    Regex pipeline strips JWTs, private keys, Doppler passwords, and AWS secrets before model input.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#171717] block mb-0.5">Mandatory Human Signoff & Role Filtering:</strong>
                    Immutable handovers require designated Reviewer signoff; secrets and executive notes filtered by role.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY, PERMISSION-AWARENESS & COMPLIANCE */}
      <section className="py-20 border-b border-[#E9E2F5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5CF6]">
              Enterprise-Grade Protection
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
              Permission-Aware Knowledge Security
            </h2>
            <p className="text-sm text-[#52525B]">
              Enterprise knowledge transfers frequently involve sensitive salary discussions, unreleased intellectual property, and production secrets. DNYANEX enforces role-based barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">Server-Side Secret Redaction</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Tokens, private RSA keys, Doppler environment strings, and database passwords are redacted before reaching the LLM and the client.
              </p>
            </div>

            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <Users className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">Strict RBAC Permission Filtering</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Three discrete roles (Owner, Reviewer, Incoming Member). Only authorized personnel can inspect confidential compensation or executive items.
              </p>
            </div>

            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">Auditable Review Trail</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Every claim modification, approval, and conflict resolution records the actor name, timestamp, and justification reason.
              </p>
            </div>

            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <Network className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">SPOKF Bottleneck Analysis</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Automatically maps Single Points of Knowledge Failure so leaders know exactly what will break if a team member leaves tomorrow.
              </p>
            </div>

            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">Conflict Gates Before Publishing</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                The platform hard-blocks handover compilation if unresolved conflicting claims remain in the review desk.
              </p>
            </div>

            <div className="bg-[#FAF8FF] border border-[#E9E2F5] p-6 rounded-2xl space-y-3 hover:border-[#A78BFA] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E9E2F5] flex items-center justify-center">
                <UserCheck2 className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="font-bold text-[#171717] text-sm">Incoming Successor Signoff</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Answers the 6 vital successor onboarding questions and provides digital acknowledgement signature for HR compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-[#FAF8FF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-[#171717]">
            Never Lose Institutional Knowledge Again.
          </h2>
          <p className="text-[#52525B] text-sm sm:text-base max-w-xl mx-auto">
            Experience the complete CampusConnect developer departure scenario: extract claims, verify quotes, resolve date conflicts, and compile the official handover.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveView('DASHBOARD');
                setDemoStep(1);
              }}
              className="inline-flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-8 py-4 rounded-xl shadow-md shadow-[#8B5CF6]/25 text-sm transition-all cursor-pointer"
            >
              <span>Launch Live Interactive Handover</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. PROFESSIONAL FOOTER */}
      <footer className="py-12 border-t border-[#E9E2F5] bg-white text-xs text-[#71717A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-extrabold text-sm text-[#171717] tracking-wider">
              DNYANEX
            </div>
            <p className="text-[#52525B]">
              Knowledge That Survives People. Built for AI Knowledge Handover Hackathon Round 2.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#52525B] font-mono text-[11px]">
            <button onClick={() => setActiveView('DASHBOARD')} className="hover:text-[#8B5CF6] cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => setActiveView('CLAIM_LEDGER')} className="hover:text-[#8B5CF6] cursor-pointer">
              Evidence Ledger
            </button>
            <button onClick={() => setActiveView('RISK_MATRIX')} className="hover:text-[#8B5CF6] cursor-pointer">
              Knowledge Topology
            </button>
            <button onClick={() => setActiveView('DOCS')} className="hover:text-[#8B5CF6] cursor-pointer">
              Architecture & Spec
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
