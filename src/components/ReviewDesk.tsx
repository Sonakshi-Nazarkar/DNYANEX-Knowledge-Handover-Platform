import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Claim, Conflict } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Edit3,
  FileCheck2,
  ArrowRight,
  GitCompare,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ReviewDesk: React.FC = () => {
  const { activeProject, addToast, setActiveView, setDemoStep } = useApp();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(false);

  // Active conflict resolution modal
  const [activeConflict, setActiveConflict] = useState<Conflict | null>(null);
  const [chosenClaimId, setChosenClaimId] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');

  // Claim review modal / notes
  const [reviewingClaim, setReviewingClaim] = useState<Claim | null>(null);
  const [reviewerNote, setReviewerNote] = useState<string>('');

  const loadData = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const [cData, confData] = await Promise.all([
        api.getClaims(activeProject.id),
        api.getConflicts(activeProject.id)
      ]);
      setClaims(cData);
      setConflicts(confData);
    } catch (err: any) {
      addToast('error', 'Failed to load review queue', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  const handleDecision = async (claimId: string, status: 'APPROVED' | 'REJECTED', note?: string) => {
    try {
      const updated = await api.updateClaim(claimId, {
        reviewer_status: status,
        reviewer_decision_notes: note || `Reviewer ${status.toLowerCase()} on desk`
      });
      setClaims(prev => prev.map(c => (c.id === claimId ? updated : c)));
      setReviewingClaim(null);
      setReviewerNote('');
      addToast('success', `Claim ${status}`, `Logged decision with audit trail`);
    } catch (err: any) {
      addToast('error', 'Decision failed', err.message);
    }
  };

  const handleResolveConflict = async () => {
    if (!activeConflict) return;
    try {
      const resolved = await api.resolveConflict(activeConflict.id, chosenClaimId || undefined, resolutionNote);
      setConflicts(prev => prev.map(c => (c.id === activeConflict.id ? resolved : c)));
      setActiveConflict(null);
      setChosenClaimId('');
      setResolutionNote('');
      await loadData();
      addToast('success', 'Contradiction Resolved', 'Decision ratified and conflicting state cleared');
    } catch (err: any) {
      addToast('error', 'Resolution failed', err.message);
    }
  };

  const pendingClaims = claims.filter(c => c.reviewer_status === 'PENDING');
  const reviewedClaims = claims.filter(c => c.reviewer_status !== 'PENDING');
  const unresolvedConflicts = conflicts.filter(c => c.status === 'UNRESOLVED');

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Human Accountability & Verification Gate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            The Review Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            No claim is published into a handover without human signoff. Inspect evidence, resolve contradictory statements, and audit organizational commitments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setActiveView('HANDOVERS');
              setDemoStep(8);
            }}
            disabled={unresolvedConflicts.length > 0}
            className={`flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs ${
              unresolvedConflicts.length > 0
                ? 'bg-[#FAF8FF] text-[#A1A1AA] cursor-not-allowed border border-[#E9E2F5]'
                : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'
            }`}
          >
            <span>Proceed to Handover Publisher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 1: CONFLICT RESOLUTION WORKBENCH */}
      <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            <h2 className="text-base font-bold text-[#171717]">
              Contradiction & Conflict Resolution Workbench ({unresolvedConflicts.length})
            </h2>
          </div>
          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
            unresolvedConflicts.length > 0
              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
              : 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
          }`}>
            {unresolvedConflicts.length > 0 ? 'Publication Blocked' : 'All Conflicts Cleared'}
          </span>
        </div>

        {unresolvedConflicts.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#DCFCE7]/40 border border-[#BBF7D0] text-[#16A34A] text-xs flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>Zero outstanding contradictory claims. Cross-source truth consistency achieved.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {unresolvedConflicts.map(cnf => {
              const claimA = claims.find(c => c.id === cnf.claim_a_id);
              const claimB = claims.find(c => c.id === cnf.claim_b_id);

              return (
                <div key={cnf.id} className="p-5 rounded-xl bg-[#FAF8FF] border border-[#FECACA] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider font-mono">
                      {cnf.topic}
                    </span>
                    <button
                      onClick={() => {
                        setActiveConflict(cnf);
                        setChosenClaimId(claimA?.id || '');
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs transition-colors cursor-pointer"
                    >
                      Resolve This Conflict
                    </button>
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {cnf.explanation}
                  </p>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Source A */}
                    <div className="p-4 rounded-xl bg-white border border-[#E9E2F5] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono">
                        <span className="font-semibold text-[#8B5CF6]">PERSPECTIVE A</span>
                        <span className="text-[#52525B] truncate max-w-[200px]">
                          {claimA?.source_location || 'Commit 8f3a921'}
                        </span>
                      </div>
                      <div className="font-bold text-[#171717]">
                        {claimA?.statement || 'Rollout target is December 15, 2026.'}
                      </div>
                      <div className="text-[11px] italic text-[#52525B] bg-[#FAF8FF] p-2.5 rounded-lg border border-[#E9E2F5]">
                        "{claimA?.supporting_quote}"
                      </div>
                    </div>

                    {/* Source B */}
                    <div className="p-4 rounded-xl bg-white border border-[#E9E2F5] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono">
                        <span className="font-semibold text-[#16A34A]">PERSPECTIVE B</span>
                        <span className="text-[#52525B] truncate max-w-[200px]">
                          {claimB?.source_location || 'All-Hands Meeting Notes'}
                        </span>
                      </div>
                      <div className="font-bold text-[#171717]">
                        {claimB?.statement || 'Release target is December 20, 2026.'}
                      </div>
                      <div className="text-[11px] italic text-[#52525B] bg-[#FAF8FF] p-2.5 rounded-lg border border-[#E9E2F5]">
                        "{claimB?.supporting_quote}"
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PENDING REVIEW QUEUE */}
      <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-base font-bold text-[#171717]">
              Pending Claims Awaiting Signoff ({pendingClaims.length})
            </h2>
          </div>
          <span className="text-xs text-[#71717A]">
            {reviewedClaims.length} already signed off
          </span>
        </div>

        <div className="space-y-3">
          {pendingClaims.length === 0 ? (
            <div className="text-center py-8 text-[#71717A] text-xs">
              All claims in queue have received reviewer decisions.
            </div>
          ) : (
            pendingClaims.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] hover:border-[#8B5CF6] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white text-[#8B5CF6] border border-[#E9E2F5] font-bold">
                      {c.type}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                        c.evidence_status === 'VERIFIED'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : c.evidence_status === 'CONFLICTING'
                          ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                          : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                      }`}
                    >
                      {c.evidence_status}
                    </span>
                    <span className="text-[#71717A] font-mono text-[11px] truncate max-w-xs">
                      {c.source_location}
                    </span>
                  </div>

                  <div className="font-bold text-[#171717] leading-snug">
                    {c.statement}
                  </div>

                  <div className="text-[11px] text-[#52525B] italic">
                    Quote: "{c.supporting_quote}"
                  </div>
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDecision(c.id, 'APPROVED')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleDecision(c.id, 'REJECTED')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border border-[#FECACA] font-bold text-xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => {
                      setReviewingClaim(c);
                      setReviewerNote(c.reviewer_decision_notes || '');
                    }}
                    className="p-1.5 text-[#52525B] hover:text-[#171717] bg-white border border-[#E9E2F5] rounded-lg transition-colors cursor-pointer"
                    title="Add review note"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conflict Resolution Modal */}
      {activeConflict && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E9E2F5] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2F5]">
              <h3 className="text-sm font-bold text-[#171717] flex items-center space-x-2">
                <GitCompare className="w-4 h-4 text-[#DC2626]" />
                <span>Resolve Contradiction: {activeConflict.topic}</span>
              </h3>
              <button
                onClick={() => setActiveConflict(null)}
                className="text-[#71717A] hover:text-[#171717] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[#52525B] leading-relaxed">
              Select which claim reflects the authoritative organizational consensus or record a reconciled verdict:
            </p>

            <div className="space-y-2">
              <label className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] cursor-pointer hover:border-[#8B5CF6]">
                <input
                  type="radio"
                  name="claimChoice"
                  value={activeConflict.claim_a_id}
                  checked={chosenClaimId === activeConflict.claim_a_id}
                  onChange={() => setChosenClaimId(activeConflict.claim_a_id)}
                  className="mt-0.5 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <div>
                  <span className="font-bold text-[#171717] block">
                    Choose Perspective A (December 15 Code Freeze)
                  </span>
                  <span className="text-[11px] text-[#52525B]">
                    Ratify Git commit 8f3a921 engineering target.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] cursor-pointer hover:border-[#8B5CF6]">
                <input
                  type="radio"
                  name="claimChoice"
                  value={activeConflict.claim_b_id}
                  checked={chosenClaimId === activeConflict.claim_b_id}
                  onChange={() => setChosenClaimId(activeConflict.claim_b_id)}
                  className="mt-0.5 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <div>
                  <span className="font-bold text-[#171717] block">
                    Choose Perspective B (December 20 Student Union Release)
                  </span>
                  <span className="text-[11px] text-[#52525B]">
                    Ratify All-Hands Executive agreement date.
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Reviewer Resolution Rationale
              </label>
              <textarea
                rows={3}
                placeholder="Explain the reconciliation rationale for successor and audit log..."
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg p-3 text-[#171717] focus:outline-none focus:border-[#8B5CF6] text-xs leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveConflict(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E9E2F5] text-[#52525B] hover:bg-[#FAF8FF] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveConflict}
                className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-xs transition-colors cursor-pointer"
              >
                Ratify & Resolve Contradiction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviewer Note Modal */}
      {reviewingClaim && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E9E2F5] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-[#171717]">
              Add Reviewer Audit Note
            </h3>
            <p className="text-[#52525B] font-medium bg-[#FAF8FF] p-2.5 rounded-lg border border-[#E9E2F5]">
              "{reviewingClaim.statement}"
            </p>
            <textarea
              rows={3}
              value={reviewerNote}
              onChange={e => setReviewerNote(e.target.value)}
              placeholder="e.g. Verified with team architecture lead in meeting..."
              className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg p-3 text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setReviewingClaim(null)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E9E2F5] text-[#52525B] hover:bg-[#FAF8FF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(reviewingClaim.id, 'APPROVED', reviewerNote)}
                className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold cursor-pointer shadow-xs"
              >
                Save & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
