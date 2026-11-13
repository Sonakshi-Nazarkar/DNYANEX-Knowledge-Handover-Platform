import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  FolderGit2,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileText,
  UserCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeProject, setActiveView, setDemoStep } = useApp();
  const [readiness, setReadiness] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [handovers, setHandovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProject?.id) return;
    const projId = activeProject.id;
    async function loadData(id: string) {
      try {
        setLoading(true);
        const [rData, cData, sData, confData, gData, hData] = await Promise.all([
          api.getReadiness(id),
          api.getClaims(id),
          api.getSources(id),
          api.getConflicts(id),
          api.getGaps(id),
          api.getHandovers(id)
        ]);
        setReadiness(rData);
        setClaims(cData);
        setSources(sData);
        setConflicts(confData);
        setGaps(gData);
        setHandovers(hData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData(projId);
  }, [activeProject]);

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-8 bg-white border border-[#E9E2F5] rounded-lg w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white border border-[#E9E2F5] rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-white border border-[#E9E2F5] rounded-xl animate-pulse"></div>
      </div>
    );
  }

  const verifiedCount = claims.filter(c => c.evidence_status === 'VERIFIED').length;
  const pendingCount = claims.filter(c => c.reviewer_status === 'PENDING').length;
  const approvedCount = claims.filter(c => c.reviewer_status === 'APPROVED').length;
  const conflictingCount = conflicts.filter(c => c.status === 'UNRESOLVED').length;
  const missingCount = claims.filter(c => c.evidence_status === 'MISSING_EVIDENCE').length;

  const score = readiness?.score || 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Operational Knowledge Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            {activeProject?.name || 'CampusConnect'} Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-3xl leading-relaxed">
            {activeProject?.description}
          </p>
        </div>

        {/* Primary CTA Cluster */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              setActiveView('RECONSTRUCTION');
              setDemoStep(3);
            }}
            className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Run AI Reconstruction</span>
          </button>

          <button
            onClick={() => {
              setActiveView('HANDOVERS');
              setDemoStep(8);
            }}
            className="flex items-center space-x-2 bg-white hover:bg-[#FAF8FF] text-[#171717] border border-[#E9E2F5] hover:border-[#8B5CF6] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4 text-[#8B5CF6]" />
            <span>Generate Handover</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Sources */}
        <div
          onClick={() => setActiveView('SOURCES')}
          className="bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#71717A] text-xs mb-2">
            <span>Sources</span>
            <FolderGit2 className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#171717]">{sources.length}</div>
          <div className="text-[11px] text-[#71717A] mt-1">Repo + Documents</div>
        </div>

        {/* Total Claims */}
        <div
          onClick={() => setActiveView('CLAIM_LEDGER')}
          className="bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#71717A] text-xs mb-2">
            <span>Claims Extracted</span>
            <FileSearch className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#8B5CF6]">{claims.length}</div>
          <div className="text-[11px] text-[#71717A] mt-1">Verifiable statements</div>
        </div>

        {/* Verified by Quotes */}
        <div
          onClick={() => setActiveView('CLAIM_LEDGER')}
          className="bg-white border border-[#E9E2F5] hover:border-[#16A34A] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#16A34A] text-xs mb-2 font-medium">
            <span>Quote Verified</span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#16A34A]">{verifiedCount}</div>
          <div className="text-[11px] text-[#16A34A] mt-1">Exact text match</div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setActiveView('REVIEW_DESK')}
          className="bg-white border border-[#E9E2F5] hover:border-[#D97706] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#D97706] text-xs mb-2 font-medium">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#D97706]">{pendingCount}</div>
          <div className="text-[11px] text-[#D97706] mt-1">Awaiting signoff</div>
        </div>

        {/* Conflicts */}
        <div
          onClick={() => setActiveView('REVIEW_DESK')}
          className="bg-white border border-[#E9E2F5] hover:border-[#DC2626] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#DC2626] text-xs mb-2 font-medium">
            <span>Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#DC2626]">{conflictingCount}</div>
          <div className="text-[11px] text-[#DC2626] mt-1">Conflicting sources</div>
        </div>

        {/* Published Handovers */}
        <div
          onClick={() => setActiveView('HANDOVERS')}
          className="bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#8B5CF6] text-xs mb-2 font-medium">
            <span>Handovers</span>
            <Send className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#171717]">{handovers.length}</div>
          <div className="text-[11px] text-[#71717A] mt-1">Immutable packets</div>
        </div>
      </div>

      {/* Handover Readiness Engine Scorecard & Audit Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Handover Readiness Score Gauge */}
        <div className="bg-white border border-[#E9E2F5] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#71717A]">
                Formula-Driven Readiness
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                  score >= 80
                    ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                    : score >= 50
                    ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                    : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                }`}
              >
                {score >= 80 ? 'HIGH READINESS' : score >= 50 ? 'ACTION REQUIRED' : 'BLOCKED'}
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <span className="text-5xl font-black font-mono text-[#171717]">{score}%</span>
              <span className="text-xs text-[#71717A]">Handover Readiness Score</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#F5F0FF] rounded-full overflow-hidden border border-[#E9E2F5] mt-4">
              <div
                className={`h-full transition-all duration-700 ${
                  score >= 80
                    ? 'bg-[#16A34A]'
                    : score >= 50
                    ? 'bg-[#8B5CF6]'
                    : 'bg-[#DC2626]'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>

            <p className="text-xs text-[#52525B] mt-4 leading-relaxed">
              Calculated deterministically from evidence coverage (45%), human approval rate (35%),
              with penalties for unresolved contradictions and unassigned critical gaps.
            </p>
          </div>

          {/* Underlying Counts Breakdown */}
          <div className="mt-6 pt-4 border-t border-[#E9E2F5] space-y-2 text-xs">
            <div className="flex justify-between text-[#52525B]">
              <span>Evidence Coverage Rate</span>
              <span className="font-mono text-[#16A34A] font-semibold">
                {readiness?.coveragePercent || 0}% ({verifiedCount}/{claims.length})
              </span>
            </div>
            <div className="flex justify-between text-[#52525B]">
              <span>Reviewer Approved Claims</span>
              <span className="font-mono text-[#8B5CF6] font-semibold">
                {approvedCount}/{claims.length}
              </span>
            </div>
            <div className="flex justify-between text-[#52525B]">
              <span>Unresolved Clashing Facts</span>
              <span className={`font-mono ${conflictingCount > 0 ? 'text-[#DC2626] font-bold' : 'text-[#71717A]'}`}>
                {conflictingCount}
              </span>
            </div>
            <div className="flex justify-between text-[#52525B]">
              <span>Critical Knowledge Gaps</span>
              <span className={`font-mono ${gaps.length > 0 ? 'text-[#D97706] font-bold' : 'text-[#71717A]'}`}>
                {gaps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Claim Verification Status Matrix */}
        <div className="bg-white border border-[#E9E2F5] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#71717A]">
                Evidence Status Breakdown
              </span>
              <FileSearch className="w-4 h-4 text-[#8B5CF6]" />
            </div>

            <div className="space-y-3.5 mt-4">
              {/* Verified */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#16A34A] font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                    <span>VERIFIED (Exact Match)</span>
                  </span>
                  <span className="font-mono text-[#16A34A] font-bold">{verifiedCount}</span>
                </div>
                <div className="w-full h-2 bg-[#F5F0FF] rounded-full overflow-hidden border border-[#E9E2F5]">
                  <div
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: `${claims.length ? (verifiedCount / claims.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Conflicting */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#DC2626] font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                    <span>CONFLICTING (Disputed Facts)</span>
                  </span>
                  <span className="font-mono text-[#DC2626] font-bold">
                    {claims.filter(c => c.evidence_status === 'CONFLICTING').length}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F5F0FF] rounded-full overflow-hidden border border-[#E9E2F5]">
                  <div
                    className="h-full bg-[#DC2626] rounded-full"
                    style={{
                      width: `${claims.length ? (claims.filter(c => c.evidence_status === 'CONFLICTING').length / claims.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Missing Evidence */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#D97706] font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                    <span>MISSING_EVIDENCE (Unassigned/Unproven)</span>
                  </span>
                  <span className="font-mono text-[#D97706] font-bold">{missingCount}</span>
                </div>
                <div className="w-full h-2 bg-[#F5F0FF] rounded-full overflow-hidden border border-[#E9E2F5]">
                  <div
                    className="h-full bg-[#D97706] rounded-full"
                    style={{ width: `${claims.length ? (missingCount / claims.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Approved Decisions */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#8B5CF6] font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                    <span>APPROVED REVIEWER DECISIONS</span>
                  </span>
                  <span className="font-mono text-[#8B5CF6] font-bold">{approvedCount}</span>
                </div>
                <div className="w-full h-2 bg-[#F5F0FF] rounded-full overflow-hidden border border-[#E9E2F5]">
                  <div
                    className="h-full bg-[#8B5CF6] rounded-full"
                    style={{ width: `${claims.length ? (approvedCount / claims.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E9E2F5] text-[11px] text-[#71717A] flex items-center justify-between">
            <span>DNYANEX Philosophy:</span>
            <span className="text-[#171717] font-medium italic">No evidence = Never verified.</span>
          </div>
        </div>

        {/* Right: Urgent Reviewer Action Items */}
        <div className="bg-white border border-[#E9E2F5] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#DC2626] flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Urgent Blockers & Gaps</span>
              </span>
              <span className="text-[10px] font-mono bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded-full border border-[#FECACA] font-bold">
                {conflicts.length + gaps.length} items
              </span>
            </div>

            <div className="space-y-3">
              {/* Conflict item */}
              {conflicts.slice(0, 1).map(cnf => (
                <div
                  key={cnf.id}
                  onClick={() => setActiveView('REVIEW_DESK')}
                  className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FECACA] hover:border-[#DC2626] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#DC2626] font-bold mb-1">
                    <span>DATE CONTRADICTION</span>
                    <span className="text-[10px] font-mono uppercase bg-white px-1.5 py-0.2 rounded border border-[#FECACA]">Unresolved</span>
                  </div>
                  <p className="text-xs text-[#171717] line-clamp-2 leading-relaxed">
                    {cnf.explanation}
                  </p>
                </div>
              ))}

              {/* Gap item */}
              {gaps.slice(0, 2).map(gap => (
                <div
                  key={gap.id}
                  onClick={() => setActiveView('RISK_MATRIX')}
                  className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] hover:border-[#D97706] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#D97706] font-bold mb-1">
                    <span>{gap.title}</span>
                    <span className="text-[10px] font-mono text-[#D97706] bg-white px-1.5 py-0.2 rounded border border-[#FDE68A]">{gap.severity}</span>
                  </div>
                  <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('REVIEW_DESK')}
            className="mt-4 w-full flex items-center justify-center space-x-2 text-xs text-[#8B5CF6] hover:text-white bg-[#FAF8FF] hover:bg-[#8B5CF6] border border-[#E9E2F5] py-2.5 rounded-xl transition-all font-semibold cursor-pointer"
          >
            <span>Open Human Review Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Extracted Claims Table Snippet */}
      <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Recent Extracted Claims</h2>
            <p className="text-xs text-[#71717A]">Directly grounded in commits, PRs, and meeting records</p>
          </div>
          <button
            onClick={() => setActiveView('CLAIM_LEDGER')}
            className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <span>View all in Claim Ledger</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E2F5] text-[#71717A] font-mono">
                <th className="pb-3 font-semibold">TYPE</th>
                <th className="pb-3 font-semibold">STATEMENT</th>
                <th className="pb-3 font-semibold">SOURCE LOCATION</th>
                <th className="pb-3 font-semibold">EVIDENCE STATUS</th>
                <th className="pb-3 font-semibold">REVIEWER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2F5]">
              {claims.slice(0, 5).map(c => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setActiveView('CLAIM_LEDGER');
                  }}
                  className="hover:bg-[#FAF8FF] cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8FF] border border-[#E9E2F5] text-[#8B5CF6] font-bold">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-[#171717] max-w-md truncate">
                    {c.statement}
                  </td>
                  <td className="py-3 pr-3 text-[#52525B] max-w-[180px] truncate">
                    {c.source_location}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                        c.evidence_status === 'VERIFIED'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : c.evidence_status === 'CONFLICTING'
                          ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                          : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                      }`}
                    >
                      {c.evidence_status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${
                        c.reviewer_status === 'APPROVED'
                          ? 'bg-[#F5F0FF] text-[#8B5CF6] border border-[#E9E2F5]'
                          : 'bg-[#FAF8FF] text-[#71717A] border border-[#E9E2F5]'
                      }`}
                    >
                      {c.reviewer_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
