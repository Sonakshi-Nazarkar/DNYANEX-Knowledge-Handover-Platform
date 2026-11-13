import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  FileSearch,
  Lock,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

export const ReconstructionView: React.FC = () => {
  const { activeProject, setActiveView, setDemoStep, addToast, refreshProjectData } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [logs, setLogs] = useState<{ step: string; message: string; timestamp: string }[]>([]);
  const [result, setResult] = useState<any>(null);

  const PIPELINE_STEPS = [
    { title: 'Data Ingestion', desc: 'Normalize markdown, commits, issues, PRs', icon: Layers },
    { title: 'Credential Redaction', desc: 'Mask Doppler secrets, GitHub PATs & passwords', icon: Lock },
    { title: 'Context Chunking', desc: 'Preserve source coordinates & line bounds', icon: FileSearch },
    { title: 'Gemini AI Extraction', desc: 'Gemini 3.8 Flash structured claim extraction', icon: Sparkles },
    { title: 'Deterministic Verifier', desc: 'Verbatim quote validation in raw text', icon: ShieldCheck },
    { title: 'Conflict Detection', desc: 'Cross-document fact & date clash engine', icon: AlertTriangle },
    { title: 'Gap Detection', desc: 'Unassigned tasks & single-point bottlenecks', icon: HelpCircle },
    { title: 'Handover Readiness', desc: 'Mathematical operational readiness score', icon: CheckCircle2 }
  ];

  const handleRunPipeline = async () => {
    if (!activeProject) return;
    try {
      setIsRunning(true);
      setActiveStepIdx(0);
      setLogs([]);
      setResult(null);

      // Visual pipeline progress ticker
      const interval = setInterval(() => {
        setActiveStepIdx(prev => (prev < 7 ? prev + 1 : prev));
      }, 700);

      const res = await api.runReconstruction(activeProject.id);
      clearInterval(interval);
      setActiveStepIdx(7);
      setResult(res);
      setLogs(res.logs || []);
      await refreshProjectData();
      addToast('success', 'Knowledge Reconstruction Complete', `Extracted ${res.claims_count} claims with ${res.verified_count} verified quotes.`);
    } catch (err: any) {
      addToast('error', 'Reconstruction Failed', err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Knowledge Reconstruction Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Evidence-First Knowledge Reconstruction
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Transforms raw engineering activity into atomic, reviewable claims using Gemini 3.8 Flash
            and enforces 100% deterministic quote verification against original files.
          </p>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 text-white ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Reconstructing Knowledge...' : 'Trigger AI Pipeline'}</span>
        </button>
      </div>

      {/* 8-Step Pipeline Visual Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = result || (isRunning && activeStepIdx > idx);
          const isCurrent = isRunning && activeStepIdx === idx;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-[#F5F0FF] border-[#8B5CF6] shadow-xs ring-1 ring-[#8B5CF6]'
                  : isDone
                  ? 'bg-white border-[#BBF7D0]'
                  : 'bg-white border-[#E9E2F5]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#71717A]">0{idx + 1}</span>
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? 'text-[#8B5CF6]'
                        : isDone
                        ? 'text-[#16A34A]'
                        : 'text-[#A1A1AA]'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-[#171717] leading-tight">{step.title}</div>
                <div className="text-[10px] text-[#52525B] mt-1 leading-snug">{step.desc}</div>
              </div>
              <div className="mt-3">
                {isCurrent ? (
                  <span className="text-[9px] font-mono text-[#8B5CF6] uppercase font-bold">Running...</span>
                ) : isDone ? (
                  <span className="text-[9px] font-mono text-[#16A34A] uppercase font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-[#A1A1AA] uppercase font-medium">Standby</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Execution Arena: Left side Terminal, Right side Extraction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Terminal Logs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E9E2F5] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E2F5] text-xs">
              <div className="flex items-center space-x-2 text-[#171717] font-mono font-semibold">
                <Terminal className="w-4 h-4 text-[#8B5CF6]" />
                <span>Reconstruction Execution Logs</span>
              </div>
              <span className="text-[10px] font-mono text-[#71717A] bg-[#FAF8FF] px-2 py-0.5 rounded border border-[#E9E2F5]">
                {isRunning ? 'STREAMING' : 'IDLE'}
              </span>
            </div>

            <div className="font-mono text-xs space-y-2 max-h-96 overflow-y-auto scrollbar-thin text-[#171717] p-2 bg-[#FAF8FF] rounded-xl border border-[#E9E2F5]">
              {logs.length === 0 ? (
                <div className="text-[#71717A] py-12 text-center">
                  <p className="font-medium text-[#171717]">Ready to reconstruct project intelligence.</p>
                  <p className="text-[11px] mt-1 text-[#71717A]">
                    Click "Trigger AI Pipeline" to execute redaction, Gemini extraction, and deterministic verification.
                  </p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                    <span className="text-[#71717A] shrink-0 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`font-semibold shrink-0 ${
                        log.step.includes('VERIFICATION')
                          ? 'text-[#16A34A]'
                          : log.step.includes('REDACTION')
                          ? 'text-[#D97706]'
                          : log.step.includes('CONFLICT')
                          ? 'text-[#DC2626]'
                          : 'text-[#8B5CF6]'
                      }`}
                    >
                      [{log.step}]
                    </span>
                    <span className="text-[#171717]">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E9E2F5] text-[11px] text-[#71717A] font-mono flex items-center justify-between">
            <span>Security: Zero raw secrets logged</span>
            <span className="text-[#16A34A] font-semibold">Deterministic Verifier: Active</span>
          </div>
        </div>

        {/* Pipeline Output Summary & Next Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#171717] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span>Pipeline Intelligence Report</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5]">
                <span className="text-[#71717A] block text-[11px]">Total Extracted</span>
                <span className="text-xl font-bold font-mono text-[#171717]">
                  {result ? result.claims_count : activeProject?.claims_count || 10}
                </span>
                <span className="text-[10px] text-[#71717A] block mt-0.5">Atomic claims</span>
              </div>

              <div className="p-3 rounded-xl bg-[#DCFCE7]/40 border border-[#BBF7D0]">
                <span className="text-[#16A34A] block text-[11px] font-semibold">Exact Quote Matches</span>
                <span className="text-xl font-bold font-mono text-[#16A34A]">
                  {result ? result.verified_count : activeProject?.verified_count || 7}
                </span>
                <span className="text-[10px] text-[#16A34A] block mt-0.5">100% verified text</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FEE2E2]/40 border border-[#FECACA]">
                <span className="text-[#DC2626] block text-[11px] font-semibold">Fact Contradictions</span>
                <span className="text-xl font-bold font-mono text-[#DC2626]">
                  {result ? result.conflicts_count : activeProject?.conflicts_count || 1}
                </span>
                <span className="text-[10px] text-[#DC2626] block mt-0.5">Clashing dates/specs</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A]">
                <span className="text-[#D97706] block text-[11px] font-semibold">Handover Readiness</span>
                <span className="text-xl font-bold font-mono text-[#D97706]">
                  {result ? `${result.readiness_score}%` : `${activeProject?.readiness_score || 74}%`}
                </span>
                <span className="text-[10px] text-[#D97706] block mt-0.5">Mathematical index</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] text-xs text-[#52525B] space-y-2">
              <div className="font-bold text-[#171717]">Next Steps for Verification:</div>
              <ul className="list-disc list-inside space-y-1 text-[#52525B] text-[11px]">
                <li>Inspect exact supporting quotes side-by-side in the Claim Ledger.</li>
                <li>Resolve the December 15 vs December 20 release date clash in the Review Desk.</li>
                <li>Assign missing owner to the database backup test suite task.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setActiveView('CLAIM_LEDGER');
                  setDemoStep(4);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
              >
                <span>Audit in Split-View Claim Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setActiveView('REVIEW_DESK');
                  setDemoStep(6);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-[#FAF8FF] text-[#171717] border border-[#E9E2F5] font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span>Resolve Contradictions at Review Desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
