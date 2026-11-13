import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Handover, Claim } from '../types';
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck2,
  Lock,
  Layers,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Copy,
  Printer
} from 'lucide-react';

export const HandoverGenerator: React.FC = () => {
  const { activeProject, setActiveView, setDemoStep, setCurrentRole, addToast } = useApp();
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Compiler form
  const [targetRole, setTargetRole] = useState<'DEVELOPER' | 'PROJECT_MANAGER' | 'STUDENT_INTERN'>('DEVELOPER');
  const [handoverTitle, setHandoverTitle] = useState('Backend Lead Successor Packet');
  const [handoverSummary, setHandoverSummary] = useState(
    'Comprehensive, evidence-verified architectural decisions, open PRs, and day 1 tasks for incoming backend engineer.'
  );
  const [isCompiling, setIsCompiling] = useState(false);

  const loadHandovers = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const [hData, rData] = await Promise.all([
        api.getHandovers(activeProject.id),
        api.getReadiness(activeProject.id)
      ]);
      setHandovers(hData);
      setReadiness(rData);
    } catch (err: any) {
      addToast('error', 'Failed to load handovers', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHandovers();
  }, [activeProject]);

  const handlePublishHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (readiness?.unresolvedConflicts > 0) {
      addToast('error', 'Publication Blocked', 'Unresolved contradictory claims exist. Please resolve in Review Desk first.');
      return;
    }

    try {
      setIsCompiling(true);
      const newHandover = await api.createHandover(activeProject.id, {
        target_role: targetRole,
        title: handoverTitle,
        summary: handoverSummary
      });

      addToast('success', 'Handover Published', `Immutable handover ${newHandover.version} created for ${targetRole}`);
      await loadHandovers();
    } catch (err: any) {
      addToast('error', 'Publication failed', err.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSwitchToSuccessor = (h: Handover) => {
    setCurrentRole('INCOMING_MEMBER');
    setActiveView('INCOMING_PORTAL');
    setDemoStep(9);
    addToast('info', 'Switched to Incoming Member View', `Viewing ${h.title}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <Send className="w-3.5 h-3.5" />
            <span>Role-Tailored Knowledge Compiler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Handover Generator & Publisher
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Compile approved, evidence-linked claims into role-filtered immutable packets for incoming developers, project managers, or interns.
          </p>
        </div>

        {/* Readiness Indicator Pill */}
        <div className="flex items-center space-x-3 bg-white border border-[#E9E2F5] px-4 py-2 rounded-xl text-xs shadow-xs">
          <div className="text-[#52525B]">Handover Readiness:</div>
          <div className="text-lg font-bold font-mono text-[#16A34A]">
            {readiness?.score || 0}%
          </div>
        </div>
      </div>

      {/* Compiler Layout: 5 cols Compile Form, 7 cols Published Handovers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Compile New Handover Form */}
        <div className="lg:col-span-5 bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E9E2F5] pb-3">
            <h2 className="text-sm font-bold text-[#171717] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>Compile Role-Specific Packet</span>
            </h2>
            <span className="text-[10px] font-mono text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0] font-bold">
              Server-Enforced RBAC
            </span>
          </div>

          <form onSubmit={handlePublishHandover} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Target Audience Role
              </label>
              <select
                value={targetRole}
                onChange={e => {
                  const role = e.target.value as any;
                  setTargetRole(role);
                  if (role === 'DEVELOPER') {
                    setHandoverTitle('Backend Lead Successor Packet');
                    setHandoverSummary('Architecture decisions, open PRs, Redis/Postgres models, and Day 1 onboarding blockers.');
                  } else if (role === 'PROJECT_MANAGER') {
                    setHandoverTitle('Project Management Handover & Milestones');
                    setHandoverSummary('Release commitments, Twilio dependencies, unassigned backup suites, and milestone audits.');
                  } else {
                    setHandoverTitle('Student / Intern Onboarding Guide');
                    setHandoverSummary('Project orientation, safe first issues, Doppler vault access steps, and glossary.');
                  }
                }}
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="DEVELOPER">Incoming Developer (Architecture & Code)</option>
                <option value="PROJECT_MANAGER">Project Manager (Schedules & Ownership)</option>
                <option value="STUDENT_INTERN">Student / Intern (Orientation & Tasks)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Packet Title
              </label>
              <input
                type="text"
                value={handoverTitle}
                onChange={e => setHandoverTitle(e.target.value)}
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Executive Summary
              </label>
              <textarea
                rows={3}
                value={handoverSummary}
                onChange={e => setHandoverSummary(e.target.value)}
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg p-3 text-[#171717] focus:outline-none focus:border-[#8B5CF6] text-xs leading-relaxed"
              />
            </div>

            {/* Validation Checklist before Publishing */}
            <div className="p-3.5 rounded-xl bg-[#F5F0FF] border border-[#E9E2F5] space-y-2 text-[11px]">
              <span className="font-bold text-[#171717] block">Pre-Publication Gate:</span>
              <div className="flex items-center space-x-2 text-[#52525B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Evidence quotes validated verbatim against source text</span>
              </div>
              <div className="flex items-center space-x-2 text-[#52525B]">
                {readiness?.unresolvedConflicts === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                )}
                <span>
                  Contradictions: {readiness?.unresolvedConflicts || 0} unresolved
                  {readiness?.unresolvedConflicts > 0 && ' (Blocker)'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[#52525B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Cryptographic acknowledgement handshake ready</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCompiling || (readiness?.unresolvedConflicts > 0)}
              className="w-full flex items-center justify-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 text-white" />
              <span>{isCompiling ? 'Compiling Packet...' : 'Publish Immutable Handover'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Published Handovers List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold text-[#171717] flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>Published Handover Versions ({handovers.length})</span>
            </h2>
            <span className="text-xs text-[#71717A] font-mono">Immutable Snapshots</span>
          </div>

          <div className="space-y-4">
            {handovers.map(h => (
              <div
                key={h.id}
                className="bg-white border border-[#E9E2F5] rounded-2xl p-5 space-y-4 hover:border-[#8B5CF6] transition-all text-xs shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#8B5CF6] px-2.5 py-0.5 rounded-md bg-[#F5F0FF] border border-[#E9E2F5]">
                      {h.version}
                    </span>
                    <span className="font-mono text-[10px] text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0] uppercase font-bold">
                      {h.target_role}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#71717A] font-mono">
                    {new Date(h.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-[#171717] text-sm">{h.title}</h3>
                  <p className="text-[#52525B] mt-1 leading-relaxed">{h.summary}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF8FF] border border-[#E9E2F5] rounded-xl text-[11px] font-mono">
                  <div>
                    <span className="text-[#71717A] block">Claims In Packet</span>
                    <span className="text-[#171717] font-bold text-xs">{h.claims?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Readiness Index</span>
                    <span className="text-[#16A34A] font-bold text-xs">{h.readiness_score}%</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Acknowledgements</span>
                    <span className="text-[#8B5CF6] font-bold text-xs">
                      {h.acknowledgements?.length || 0} signed
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E9E2F5]">
                  <div className="text-[10px] text-[#71717A]">
                    Compiled by: <span className="text-[#171717] font-semibold">{h.created_by}</span>
                  </div>

                  <button
                    onClick={() => handleSwitchToSuccessor(h)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View as Successor & Sign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
