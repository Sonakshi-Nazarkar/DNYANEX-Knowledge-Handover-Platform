import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Claim, Source, ClaimType, EvidenceStatus, ReviewerStatus } from '../types';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  Edit3,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  User,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ClaimLedger: React.FC = () => {
  const { activeProject, selectedClaim, setSelectedClaim, addToast, currentRole } = useApp();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reviewerFilter, setReviewerFilter] = useState<string>('ALL');

  // Active right-side source
  const [activeSource, setActiveSource] = useState<Source | null>(null);

  // Edit Modal State
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [editStatement, setEditStatement] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadData = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const [cData, sData] = await Promise.all([
        api.getClaims(activeProject.id),
        api.getSources(activeProject.id)
      ]);
      setClaims(cData);
      setSources(sData);

      // Select initial claim if none selected
      if (cData.length > 0) {
        const target = selectedClaim ? cData.find(c => c.id === selectedClaim.id) || cData[0] : cData[0];
        setSelectedClaim(target);
        const matchSrc = sData.find(s => s.id === target.source_id) || sData[0];
        setActiveSource(matchSrc);
      }
    } catch (err: any) {
      addToast('error', 'Failed to load claims', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  useEffect(() => {
    if (selectedClaim && sources.length > 0) {
      const matchSrc = sources.find(s => s.id === selectedClaim.source_id) || sources[0];
      setActiveSource(matchSrc);
    }
  }, [selectedClaim, sources]);

  const handleApprove = async (claimId: string) => {
    try {
      const updated = await api.updateClaim(claimId, {
        reviewer_status: 'APPROVED',
        reviewer_decision_notes: 'Verified and approved by reviewer in Claim Ledger'
      });
      setClaims(prev => prev.map(c => (c.id === claimId ? updated : c)));
      if (selectedClaim?.id === claimId) setSelectedClaim(updated);
      addToast('success', 'Claim Approved', 'Claim ratified as verified organizational knowledge');
    } catch (err: any) {
      addToast('error', 'Approval failed', err.message);
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      const updated = await api.updateClaim(claimId, {
        reviewer_status: 'REJECTED',
        reviewer_decision_notes: 'Rejected by reviewer: insufficient evidence or obsolete fact'
      });
      setClaims(prev => prev.map(c => (c.id === claimId ? updated : c)));
      if (selectedClaim?.id === claimId) setSelectedClaim(updated);
      addToast('warning', 'Claim Rejected', 'Excluded from outgoing handover views');
    } catch (err: any) {
      addToast('error', 'Rejection failed', err.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingClaim) return;
    try {
      const updated = await api.updateClaim(editingClaim.id, {
        statement: editStatement,
        owner: editOwner || null,
        reviewer_status: 'EDITED',
        reviewer_decision_notes: editNotes || 'Statement clarified by human reviewer'
      });
      setClaims(prev => prev.map(c => (c.id === editingClaim.id ? updated : c)));
      if (selectedClaim?.id === editingClaim.id) setSelectedClaim(updated);
      setEditingClaim(null);
      addToast('success', 'Claim Edited', 'Statement updated and logged to audit ledger');
    } catch (err: any) {
      addToast('error', 'Edit failed', err.message);
    }
  };

  // Filtered Claims
  const filteredClaims = claims.filter(c => {
    if (categoryFilter !== 'ALL' && c.type !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.evidence_status !== statusFilter) return false;
    if (reviewerFilter !== 'ALL' && c.reviewer_status !== reviewerFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.statement.toLowerCase().includes(q) ||
        c.supporting_quote.toLowerCase().includes(q) ||
        c.source_location.toLowerCase().includes(q) ||
        (c.owner && c.owner.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Highlight supporting quote inside raw text
  const renderHighlightedContent = () => {
    if (!activeSource || !selectedClaim) {
      return <div className="text-[#71717A] p-6 text-center text-xs">Select a claim to view source context.</div>;
    }

    const raw = activeSource.raw_content;
    const quote = selectedClaim.supporting_quote;

    if (!quote || !raw.includes(quote)) {
      return (
        <div className="space-y-4">
          <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#D97706]">
            <strong>Approximate / Inferred Match:</strong> Exact verbatim substring not directly pinpointed. Quote:
            <span className="italic block mt-1">"{quote}"</span>
          </div>
          <pre className="font-mono text-xs text-[#171717] bg-[#FAF8FF] p-4 rounded-xl leading-relaxed whitespace-pre-wrap border border-[#E9E2F5]">
            {raw}
          </pre>
        </div>
      );
    }

    const parts = raw.split(quote);
    return (
      <div className="font-mono text-xs text-[#171717] bg-[#FAF8FF] p-5 rounded-xl leading-relaxed whitespace-pre-wrap border border-[#E9E2F5]">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <mark className="bg-[#F5F0FF] text-[#8B5CF6] font-bold px-1.5 py-0.5 rounded shadow-2xs border border-[#A78BFA]">
                {quote}
              </mark>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deterministic Evidence Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            The Claim Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Inspect verifiable claims side-by-side with exact verbatim quotations highlighted inside original source artifacts.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search claims, quotes, owners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-[#E9E2F5] rounded-lg pl-8 pr-3 py-1.5 text-[#171717] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] w-56 text-xs"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#E9E2F5] rounded-lg px-2.5 py-1.5 text-[#171717] text-xs focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="ALL">All Categories</option>
            <option value="DECISION">Decisions</option>
            <option value="TASK">Tasks</option>
            <option value="BLOCKER">Blockers</option>
            <option value="RISK">Risks</option>
            <option value="DEPENDENCY">Dependencies</option>
            <option value="NEXT_ACTION">Next Actions</option>
            <option value="CONTACT_OR_RESOURCE">Resources</option>
          </select>

          {/* Evidence Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E9E2F5] rounded-lg px-2.5 py-1.5 text-[#171717] text-xs focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="ALL">All Evidence Status</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="CONFLICTING">CONFLICTING</option>
            <option value="MISSING_EVIDENCE">MISSING_EVIDENCE</option>
          </select>
        </div>
      </div>

      {/* SPLIT-VIEW CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* LEFT COLUMN: Claim List & Actions (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E9E2F5] rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#71717A] pb-2 border-b border-[#E9E2F5]">
            <span className="font-mono uppercase font-semibold">
              Showing {filteredClaims.length} Claims
            </span>
            <span className="text-[11px] text-[#8B5CF6] font-mono font-medium">
              Click claim to pin evidence
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin">
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12 text-[#71717A] text-xs">
                No claims match the selected criteria.
              </div>
            ) : (
              filteredClaims.map(c => {
                const isSelected = selectedClaim?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClaim(c)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#F5F0FF] border-[#8B5CF6] shadow-xs'
                        : 'bg-[#FAF8FF] border-[#E9E2F5] hover:bg-white hover:border-[#A78BFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
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
                      </div>

                      <div className="flex items-center space-x-1">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            c.reviewer_status === 'APPROVED'
                              ? 'bg-[#F5F0FF] text-[#8B5CF6] border border-[#E9E2F5]'
                              : c.reviewer_status === 'REJECTED'
                              ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                              : 'bg-white text-[#71717A] border border-[#E9E2F5]'
                          }`}
                        >
                          {c.reviewer_status}
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-[#171717] leading-snug mb-2">
                      {c.statement}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E9E2F5] text-[#52525B] text-[11px] italic mb-3">
                      "{c.supporting_quote}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-2 border-t border-[#E9E2F5]">
                      <div className="truncate max-w-[240px]">
                        <span className="text-[#A1A1AA]">Source: </span>
                        <span className="text-[#52525B] font-medium">{c.source_location}</span>
                      </div>

                      {c.owner && (
                        <div className="flex items-center space-x-1 text-[#171717] font-medium shrink-0">
                          <User className="w-3 h-3 text-[#8B5CF6]" />
                          <span>{c.owner}</span>
                        </div>
                      )}
                    </div>

                    {/* Review Actions (Visible when selected or in Reviewer mode) */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-[#E9E2F5] flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleApprove(c.id);
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleReject(c.id);
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border border-[#FECACA] text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setEditingClaim(c);
                              setEditStatement(c.statement);
                              setEditOwner(c.owner || '');
                              setEditNotes(c.reviewer_decision_notes || '');
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8FF] text-[#52525B] border border-[#E9E2F5] text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <span className="text-[10px] text-[#16A34A] font-mono font-semibold">
                          {c.exact_quote_match ? 'Exact Quote Verified' : 'Inferred Quote'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Viewer with Highlighted Source (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E9E2F5] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E2F5]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-bold text-[#171717]">
                  Original Source Evidence Viewer
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#52525B] bg-[#FAF8FF] px-2 py-0.5 rounded border border-[#E9E2F5]">
                {activeSource?.name || 'No Source'}
              </span>
            </div>

            {selectedClaim && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#171717]">Auditing Claim:</span>
                  <span className="font-mono text-[#8B5CF6] font-semibold">{selectedClaim.id}</span>
                </div>
                <div className="text-[#171717] font-semibold">
                  {selectedClaim.statement}
                </div>
                <div className="text-[11px] text-[#52525B]">
                  <span className="text-[#8B5CF6] font-mono font-semibold">Quotation to Verify: </span>
                  <span className="bg-[#F5F0FF] text-[#8B5CF6] font-medium px-1.5 py-0.5 rounded border border-[#E9E2F5]">
                    "{selectedClaim.supporting_quote}"
                  </span>
                </div>
              </div>
            )}

            {/* Scrollable Highlighted Document Body */}
            <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
              {renderHighlightedContent()}
            </div>
          </div>

          {/* Audit Trail Snippet */}
          {selectedClaim && selectedClaim.audit_history && (
            <div className="pt-3 border-t border-[#E9E2F5] text-[10px] font-mono text-[#71717A] space-y-1">
              <div className="font-bold text-[#171717] flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-[#8B5CF6]" />
                <span>Audit & Verification Ledger:</span>
              </div>
              {selectedClaim.audit_history.slice(-2).map((a, i) => (
                <div key={i} className="flex justify-between text-[#52525B]">
                  <span>{a.actor} — {a.action}</span>
                  <span className="text-[#71717A]">{new Date(a.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Claim Modal Dialog */}
      {editingClaim && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E9E2F5] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E2F5]">
              <h3 className="text-sm font-bold text-[#171717]">
                Edit & Clarify Claim Statement
              </h3>
              <button
                onClick={() => setEditingClaim(null)}
                className="text-[#71717A] hover:text-[#171717] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Statement
              </label>
              <textarea
                rows={3}
                value={editStatement}
                onChange={e => setEditStatement(e.target.value)}
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg p-3 text-[#171717] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Owner (Assignee)
              </label>
              <input
                type="text"
                value={editOwner}
                onChange={e => setEditOwner(e.target.value)}
                placeholder="e.g. Devon Vance"
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-mono uppercase text-[10px] font-semibold">
                Reviewer Audit Note
              </label>
              <input
                type="text"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Reason for modification..."
                className="w-full bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingClaim(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E9E2F5] text-[#52525B] hover:bg-[#FAF8FF] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white font-bold hover:bg-[#7C3AED] transition-colors cursor-pointer shadow-xs"
              >
                Save & Record in Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
