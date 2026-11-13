import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Handover, Claim } from '../types';
import {
  UserCheck2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Zap,
  Clock,
  HelpCircle,
  FileCheck2,
  PenTool,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const IncomingMemberPortal: React.FC = () => {
  const { activeProject, addToast, setSelectedClaim, setActiveView } = useApp();
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [selectedHandover, setSelectedHandover] = useState<Handover | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign off modal
  const [signerName, setSignerName] = useState('Devon Vance');
  const [signerRole, setSignerRole] = useState('Incoming Backend Lead');
  const [isSigning, setIsSigning] = useState(false);
  const [signedRecord, setSignedRecord] = useState<any>(null);

  const loadHandovers = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const data = await api.getHandovers(activeProject.id);
      setHandovers(data);
      if (data.length > 0) {
        setSelectedHandover(data[0]);
        if (data[0].acknowledgements?.length > 0) {
          setSignedRecord(data[0].acknowledgements[data[0].acknowledgements.length - 1]);
        }
      }
    } catch (err: any) {
      addToast('error', 'Failed to load handover', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHandovers();
  }, [activeProject]);

  const handleAcknowledge = async () => {
    if (!selectedHandover) return;
    try {
      setIsSigning(true);
      const res = await api.acknowledgeHandover(selectedHandover.id, signerName, signerRole);
      setSignedRecord(res.acknowledgement);
      await loadHandovers();
      addToast('success', 'Handover Acknowledged', 'Signed and timestamped in immutable audit ledger.');
    } catch (err: any) {
      addToast('error', 'Signing failed', err.message);
    } finally {
      setIsSigning(false);
    }
  };

  const claims = selectedHandover?.claims || [];
  const decisions = claims.filter(c => c.type === 'DECISION');
  const tasks = claims.filter(c => c.type === 'TASK' || c.type === 'NEXT_ACTION');
  const blockersAndRisks = claims.filter(c => ['BLOCKER', 'RISK', 'DEPENDENCY'].includes(c.type));

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <UserCheck2 className="w-3.5 h-3.5" />
            <span>Successor Onboarding Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Incoming Member Intelligence Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Designed for instant comprehension. Everything you need to know on Day 1 without requiring endless handover meetings.
          </p>
        </div>

        {/* Handover Selector */}
        {handovers.length > 1 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#52525B]">Packet:</span>
            <select
              value={selectedHandover?.id || ''}
              onChange={e => {
                const h = handovers.find(item => item.id === e.target.value) || null;
                setSelectedHandover(h);
              }}
              className="bg-white border border-[#E9E2F5] rounded-lg px-3 py-1.5 text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
            >
              {handovers.map(h => (
                <option key={h.id} value={h.id}>
                  {h.version} - {h.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 6 Key Successor Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Q1 & Q2: What is happening & What is done */}
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] font-mono uppercase">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
            <span>1. What is Happening & Decided?</span>
          </div>
          <p className="text-xs text-[#52525B] leading-relaxed">
            {selectedHandover?.summary || activeProject?.description}
          </p>

          <div className="space-y-2 pt-2 border-t border-[#E9E2F5]">
            <span className="text-[11px] font-mono text-[#71717A] uppercase font-semibold">
              Key Ratified Decisions:
            </span>
            {decisions.slice(0, 3).map(d => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedClaim(d);
                  setActiveView('CLAIM_LEDGER');
                }}
                className="p-2.5 rounded-lg bg-[#FAF8FF] hover:bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] text-xs text-[#171717] cursor-pointer transition-colors"
              >
                <div className="font-semibold line-clamp-2">{d.statement}</div>
                <div className="text-[10px] text-[#8B5CF6] font-mono mt-1 font-medium">Verified in {d.source_name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q3 & Q6: My Responsibilities & First Actions */}
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] font-mono uppercase">
            <Zap className="w-4 h-4 text-[#8B5CF6]" />
            <span>2. What Should I Do First?</span>
          </div>
          <div className="space-y-2">
            <div className="p-3.5 rounded-xl bg-[#F5F0FF] border border-[#E9E2F5] text-xs text-[#171717] space-y-1">
              <span className="font-bold text-[#8B5CF6] block">Day 1 Action Plan:</span>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-[#52525B]">
                <li>Configure Express <code className="bg-white px-1.5 py-0.5 rounded border border-[#E9E2F5] text-[#8B5CF6] font-mono">trust proxy</code> setting (Issue #119).</li>
                <li>Obtain Doppler vault access to <code className="bg-white px-1.5 py-0.5 rounded border border-[#E9E2F5] text-[#8B5CF6] font-mono">CAMPUS_PAY_SECRET</code>.</li>
                <li>Verify root billing admin handover before Sarah Chen departure.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E9E2F5]">
              <span className="text-[11px] font-mono text-[#71717A] uppercase font-semibold">
                Open Tasks Assigned to You:
              </span>
              {tasks.slice(0, 3).map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedClaim(t);
                    setActiveView('CLAIM_LEDGER');
                  }}
                  className="p-2.5 rounded-lg bg-[#FAF8FF] hover:bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] text-xs text-[#171717] cursor-pointer transition-colors"
                >
                  <div className="font-semibold line-clamp-2">{t.statement}</div>
                  <div className="text-[10px] text-[#71717A] mt-1">
                    Assignee: <span className="text-[#8B5CF6] font-semibold">{t.owner || 'Devon Vance'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Q4 & Q5: What Could Go Wrong & Unresolved */}
        <div className="bg-white border border-[#E9E2F5] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#DC2626] font-mono uppercase">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            <span>3. What Could Go Wrong?</span>
          </div>

          <div className="space-y-2">
            {blockersAndRisks.slice(0, 3).map(r => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedClaim(r);
                  setActiveView('CLAIM_LEDGER');
                }}
                className="p-2.5 rounded-lg bg-[#FAF8FF] hover:bg-white border border-[#FECACA] hover:border-[#DC2626] text-xs text-[#171717] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#DC2626] mb-1 font-semibold">
                  <span>{r.type}</span>
                  <span className="text-[#71717A]">{r.source_name}</span>
                </div>
                <div className="font-semibold line-clamp-2">{r.statement}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] text-[11px] text-[#52525B]">
            <strong className="text-[#171717]">Security Warning:</strong> Doppler manages credentials. Never commit <code className="text-[#DC2626] font-mono">.env</code> files to git repositories.
          </div>
        </div>
      </div>

      {/* Acknowledgment & Digital Signoff Section */}
      <div className="bg-white border border-[#E9E2F5] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
              <PenTool className="w-4 h-4 text-[#8B5CF6]" />
              <span>Digital Receipt & Acknowledgment</span>
            </div>
            <h2 className="text-xl font-bold text-[#171717]">
              Confirm Receipt of Knowledge Handover Packet
            </h2>
            <p className="text-xs text-[#52525B] mt-1 max-w-xl">
              Confirms that the incoming member has reviewed verified claims, active architectural decisions, and blocker mitigation plans.
            </p>
          </div>

          {signedRecord ? (
            <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs space-y-1 shadow-2xs">
              <div className="flex items-center space-x-2 font-bold text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Handover Acknowledged & Signed</span>
              </div>
              <div className="text-[11px] text-[#16A34A] font-mono font-medium">
                Signer: {signedRecord.acknowledged_by} ({signedRecord.role})
              </div>
              <div className="text-[10px] text-[#16A34A] font-mono">
                Hash: {signedRecord.signature_hash}
              </div>
              <div className="text-[10px] text-[#16A34A] font-mono">
                Timestamp: {new Date(signedRecord.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Full Legal Name"
                value={signerName}
                onChange={e => setSignerName(e.target.value)}
                className="bg-[#FAF8FF] border border-[#E9E2F5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
              />
              <input
                type="text"
                placeholder="Role Title"
                value={signerRole}
                onChange={e => setSignerRole(e.target.value)}
                className="bg-[#FAF8FF] border border-[#E9E2F5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#8B5CF6]"
              />
              <button
                onClick={handleAcknowledge}
                disabled={isSigning || !signerName}
                className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{isSigning ? 'Signing...' : 'Acknowledge Receipt & Sign'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
