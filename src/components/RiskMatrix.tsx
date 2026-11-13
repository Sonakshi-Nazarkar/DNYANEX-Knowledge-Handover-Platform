import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Claim, GapOrMissingEvidence } from '../types';
import {
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  UserX,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Network,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Lock,
  GitBranch,
  FileCode,
  Info
} from 'lucide-react';

interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'SPOKF' | 'DECISION' | 'TASK' | 'BLOCKER' | 'DEPENDENCY' | 'CONFLICT' | 'UNASSIGNED';
  x: number;
  y: number;
  claimId?: string;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  details: string;
  evidenceQuote?: string;
  sourceFile?: string;
  owner?: string;
}

interface TopologyEdge {
  from: string;
  to: string;
  label: string;
  isConflict?: boolean;
  isCritical?: boolean;
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'node_spokf',
    label: 'Sarah Chen (Outgoing Lead)',
    sublabel: 'Single Point of Failure (SPOKF)',
    type: 'SPOKF',
    x: 480,
    y: 220,
    riskSeverity: 'CRITICAL',
    details: 'Exiting November 18. Holds exclusive knowledge of Doppler secrets, GCP billing root, and Cloudflare trust fixes.',
    sourceFile: 'all_hands_meeting_notes_nov.txt',
    owner: 'Sarah Chen'
  },
  {
    id: 'node_postgres',
    label: 'PostgreSQL RDS + Supabase',
    sublabel: 'Architecture Decision ADR-004',
    type: 'DECISION',
    x: 200,
    y: 120,
    claimId: 'clm_1',
    riskSeverity: 'MEDIUM',
    details: 'Migrated auth persistence from Firebase to PostgreSQL 16 due to peak registration latency budgets.',
    evidenceQuote: 'The team agreed to use PostgreSQL with row-level security as the single source of truth for student records, enrollment ledgers, and transactions.',
    sourceFile: 'architecture_decision_record_v2.md',
    owner: 'Sarah Chen'
  },
  {
    id: 'node_doppler',
    label: 'Doppler Vault: CAMPUS_PAY_SECRET',
    sublabel: 'Credentials & API Secret',
    type: 'BLOCKER',
    x: 480,
    y: 80,
    claimId: 'clm_7',
    riskSeverity: 'CRITICAL',
    details: 'Razorpay webhook signature secret stored exclusively in Doppler vault. Requires immediate credential delegation.',
    evidenceQuote: 'The Razorpay webhook signature secret is stored in Doppler vault under CAMPUS_PAY_SECRET.',
    sourceFile: 'github.com/campusconnect/backend-core PR #102',
    owner: 'Sarah Chen'
  },
  {
    id: 'node_razorpay',
    label: 'Payment Webhook (70% Done)',
    sublabel: 'In-Flight Task PR #102',
    type: 'TASK',
    x: 760,
    y: 120,
    claimId: 'clm_2',
    riskSeverity: 'HIGH',
    details: 'Stripe mode verified. Campus UPI split payment and refund reconciliation cron are unfinished. Critical for Devon Vance.',
    evidenceQuote: 'The payment webhook handler is 70% complete. Stripe card payments work in test mode, but campus UPI qr-code split payments are unfinished.',
    sourceFile: 'github.com/campusconnect/backend-core PR #102',
    owner: 'Devon Vance (Target)'
  },
  {
    id: 'node_cloudflare',
    label: 'Issue #119: Rate Limiter Bug',
    sublabel: 'Active Blocker in Express',
    type: 'BLOCKER',
    x: 180,
    y: 330,
    claimId: 'clm_4',
    riskSeverity: 'HIGH',
    details: 'Express drops library seat reservations due to missing trust proxy config behind Cloudflare. Needs 1-line app.set("trust proxy", 1).',
    evidenceQuote: 'Identified the bottleneck: IP header forwarding behind Cloudflare proxy is missing X-Forwarded-For trust config in Express app.',
    sourceFile: 'github.com/campusconnect/backend-core Issue #119',
    owner: 'Sarah Chen'
  },
  {
    id: 'node_gcp_billing',
    label: 'GCP Production Billing Root',
    sublabel: 'SSO Revocation Risk',
    type: 'BLOCKER',
    x: 480,
    y: 390,
    claimId: 'clm_8',
    riskSeverity: 'CRITICAL',
    details: 'Only Sarah\'s student university email is owner of GCP production billing. If campus SSO expires, deployment pipelines halt.',
    evidenceQuote: 'Currently only Sarah\'s university email is owner, and if she loses campus SSO, production deployment pipelines will break.',
    sourceFile: 'all_hands_meeting_notes_nov.txt',
    owner: 'Sarah Chen -> Alex Rivera'
  },
  {
    id: 'node_twilio',
    label: 'Twilio SMS ($50 Zero Fallback)',
    sublabel: 'Single-Point External Dependency',
    type: 'DEPENDENCY',
    x: 770,
    y: 320,
    claimId: 'clm_3',
    riskSeverity: 'MEDIUM',
    details: 'Transactional OTP SMS relies solely on Twilio. If balance dips below $50, registration OTPs fail completely.',
    evidenceQuote: 'SMS gateway has a single-point dependency on Twilio with zero automated failover fallback if credit balance dips below $50.',
    sourceFile: 'architecture_decision_record_v2.md',
    owner: 'Sarah Chen'
  },
  {
    id: 'node_release_conflict',
    label: 'Go-Live Date: Dec 15 vs Dec 20',
    sublabel: 'Conflicting Deployment Target',
    type: 'CONFLICT',
    x: 210,
    y: 220,
    claimId: 'clm_5',
    riskSeverity: 'CRITICAL',
    details: 'Git commit 8f3a921 schedules Dec 15 freeze; Student Union contract mandates Dec 20 launch. Needs Reviewer reconciliation.',
    evidenceQuote: 'Target production rollout is scheduled for December 15, 2026 vs Student Union Dec 20.',
    sourceFile: 'Git Commit 8f3a921 vs Meeting Notes',
    owner: 'Sarah Chen vs Alex Rivera'
  },
  {
    id: 'node_backup_tests',
    label: 'DB Backup Verification Suite',
    sublabel: 'Unassigned Mission-Critical Task',
    type: 'UNASSIGNED',
    x: 770,
    y: 220,
    claimId: 'clm_9',
    riskSeverity: 'HIGH',
    details: 'No engineer is assigned to verify automated disaster recovery backups for PostgreSQL.',
    evidenceQuote: 'There is currently no assigned owner for the automated database backup verification test suite.',
    sourceFile: 'all_hands_meeting_notes_nov.txt',
    owner: 'UNASSIGNED'
  }
];

const TOPOLOGY_EDGES: TopologyEdge[] = [
  { from: 'node_spokf', to: 'node_doppler', label: 'Sole secret holder', isCritical: true },
  { from: 'node_doppler', to: 'node_razorpay', label: 'Injects credentials' },
  { from: 'node_spokf', to: 'node_razorpay', label: 'Handoff to Devon' },
  { from: 'node_spokf', to: 'node_gcp_billing', label: 'Single admin email', isCritical: true },
  { from: 'node_spokf', to: 'node_cloudflare', label: 'Diagnosed root cause' },
  { from: 'node_spokf', to: 'node_postgres', label: 'Ratified architecture' },
  { from: 'node_postgres', to: 'node_backup_tests', label: 'Requires verification' },
  { from: 'node_spokf', to: 'node_twilio', label: 'Configured credentials' },
  { from: 'node_spokf', to: 'node_release_conflict', label: 'Contradictory records', isConflict: true }
];

export const RiskMatrix: React.FC = () => {
  const { activeProject, setActiveView, setSelectedClaim, addToast } = useApp();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [gaps, setGaps] = useState<GapOrMissingEvidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'TOPOLOGY' | 'RISKS' | 'GAPS'>('TOPOLOGY');
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(TOPOLOGY_NODES[0]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    if (!activeProject?.id) return;
    const projId = activeProject.id;
    async function load(id: string) {
      try {
        setLoading(true);
        const [cData, gData] = await Promise.all([
          api.getClaims(id),
          api.getGaps(id)
        ]);
        setClaims(cData);
        setGaps(gData);
      } catch (err: any) {
        addToast('error', 'Failed to load risk intelligence', err.message);
      } finally {
        setLoading(false);
      }
    }
    load(projId);
  }, [activeProject]);

  const riskClaims = claims.filter(c => ['RISK', 'BLOCKER', 'DEPENDENCY'].includes(c.type));

  const filteredNodes = TOPOLOGY_NODES.filter(node => {
    if (filterType === 'ALL') return true;
    if (filterType === 'SPOKF') return node.type === 'SPOKF';
    if (filterType === 'BLOCKERS') return node.type === 'BLOCKER' || node.type === 'CONFLICT';
    if (filterType === 'TASKS') return node.type === 'TASK' || node.type === 'UNASSIGNED';
    if (filterType === 'DECISIONS') return node.type === 'DECISION';
    return true;
  });

  const getNodeColor = (type: TopologyNode['type']) => {
    switch (type) {
      case 'SPOKF':
        return {
          border: 'border-[#8B5CF6]',
          bg: 'bg-[#F5F0FF]',
          text: 'text-[#8B5CF6]',
          stroke: '#8B5CF6'
        };
      case 'DECISION':
        return {
          border: 'border-[#A78BFA]',
          bg: 'bg-[#FAF8FF]',
          text: 'text-[#8B5CF6]',
          stroke: '#8B5CF6'
        };
      case 'TASK':
        return {
          border: 'border-[#8B5CF6]',
          bg: 'bg-[#F5F0FF]',
          text: 'text-[#8B5CF6]',
          stroke: '#8B5CF6'
        };
      case 'BLOCKER':
        return {
          border: 'border-[#DC2626]',
          bg: 'bg-[#FEE2E2]',
          text: 'text-[#DC2626]',
          stroke: '#DC2626'
        };
      case 'CONFLICT':
        return {
          border: 'border-[#D97706]',
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#D97706]',
          stroke: '#D97706'
        };
      case 'DEPENDENCY':
        return {
          border: 'border-[#8B5CF6]',
          bg: 'bg-[#FAF8FF]',
          text: 'text-[#8B5CF6]',
          stroke: '#8B5CF6'
        };
      case 'UNASSIGNED':
        return {
          border: 'border-[#D97706]',
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#D97706]',
          stroke: '#D97706'
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <ShieldAlert className="w-4 h-4 text-[#8B5CF6]" />
            <span>Project Intelligence & Knowledge Topology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Knowledge Topology & Risk Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            Interactive dependency network mapping architectural decisions, in-flight handovers, single-point of failure (SPOKF) bottlenecks, and critical deployment blockers.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#FAF8FF] border border-[#E9E2F5] p-1 rounded-xl self-start md:self-auto shrink-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('TOPOLOGY')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'TOPOLOGY'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#171717]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('RISKS')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'RISKS'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#171717]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risks & Blockers ({riskClaims.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('GAPS')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'GAPS'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#171717]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Critical Gaps ({gaps.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE KNOWLEDGE TOPOLOGY GRAPH */}
      {activeTab === 'TOPOLOGY' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E9E2F5] shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#71717A] font-mono mr-2 font-semibold">Filter Network:</span>
              {[
                { id: 'ALL', label: 'All Entities' },
                { id: 'SPOKF', label: 'SPOKF Hub' },
                { id: 'BLOCKERS', label: 'Blockers & Conflicts' },
                { id: 'TASKS', label: 'Tasks & Handovers' },
                { id: 'DECISIONS', label: 'Architecture Decisions' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                    filterType === f.id
                      ? 'bg-[#8B5CF6] text-white shadow-2xs'
                      : 'text-[#52525B] hover:text-[#171717] hover:bg-[#FAF8FF]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-[#71717A] font-mono">Zoom: {Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                aria-label="Zoom in"
                className="p-1.5 text-[#52525B] hover:text-[#171717] bg-[#FAF8FF] hover:bg-white rounded-md border border-[#E9E2F5] cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
                aria-label="Zoom out"
                className="p-1.5 text-[#52525B] hover:text-[#171717] bg-[#FAF8FF] hover:bg-white rounded-md border border-[#E9E2F5] cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                aria-label="Reset zoom"
                className="p-1.5 text-[#52525B] hover:text-[#171717] bg-[#FAF8FF] hover:bg-white rounded-md border border-[#E9E2F5] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Graph Visualization Container + Inspector Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Graph Canvas */}
            <div className="lg:col-span-2 bg-[#FAF8FF] border border-[#E9E2F5] rounded-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center shadow-xs">
              <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 text-[11px] text-[#52525B] bg-white px-2.5 py-1 rounded-md border border-[#E9E2F5] shadow-2xs font-medium">
                <Info className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Click any node to inspect evidence quotes & root causes</span>
              </div>

              <div
                className="w-full h-full p-4 overflow-auto transition-transform duration-150 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <svg
                  viewBox="0 0 960 480"
                  className="w-full h-[480px] select-none"
                  style={{ minWidth: '750px' }}
                >
                  <defs>
                    <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="criticalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Render Edges */}
                  {TOPOLOGY_EDGES.map((edge, idx) => {
                    const fromNode = TOPOLOGY_NODES.find(n => n.id === edge.from);
                    const toNode = TOPOLOGY_NODES.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    const isHighlighted =
                      selectedNode?.id === fromNode.id || selectedNode?.id === toNode.id;

                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2 - 20;

                    return (
                      <g key={idx} className="transition-all">
                        <path
                          d={`M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}`}
                          fill="none"
                          stroke={
                            edge.isCritical
                              ? 'url(#criticalGrad)'
                              : edge.isConflict
                              ? '#D97706'
                              : isHighlighted
                              ? '#8B5CF6'
                              : '#CBD5E1'
                          }
                          strokeWidth={isHighlighted ? 2.5 : edge.isCritical ? 2 : 1.5}
                          strokeDasharray={edge.isConflict ? '5,5' : undefined}
                          opacity={isHighlighted ? 1 : 0.75}
                        />
                        {/* Edge Label Pill */}
                        <rect
                          x={midX - 35}
                          y={midY - 8}
                          width="70"
                          height="16"
                          rx="4"
                          fill="#FFFFFF"
                          stroke="#E9E2F5"
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          textAnchor="middle"
                          fill={isHighlighted ? '#8B5CF6' : '#52525B'}
                          fontSize="8"
                          fontWeight="600"
                          fontFamily="sans-serif"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Nodes */}
                  {filteredNodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    const color = getNodeColor(node.type);
                    const isSpokf = node.type === 'SPOKF';

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer"
                      >
                        {/* Glowing ring for SPOKF or selected */}
                        {(isSpokf || isSelected) && (
                          <circle
                            r={isSpokf ? 36 : 28}
                            fill="none"
                            stroke={color.stroke}
                            strokeWidth={isSpokf ? 2 : 1.5}
                            opacity={0.3}
                            className={isSpokf ? 'animate-ping' : ''}
                          />
                        )}

                        {/* Node Card Container */}
                        <rect
                          x={-85}
                          y={-28}
                          width="170"
                          height="56"
                          rx="12"
                          fill="#FFFFFF"
                          stroke={color.stroke}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          filter="drop-shadow(0 2px 4px rgba(139,92,246,0.08))"
                        />

                        {/* Node Type Top Indicator */}
                        <rect
                          x={-84}
                          y={-27}
                          width="168"
                          height="14"
                          rx="8"
                          fill={color.stroke}
                          opacity={0.12}
                        />

                        <text
                          x="0"
                          y={-17}
                          textAnchor="middle"
                          fill={color.stroke}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {node.type} · {node.riskSeverity} RISK
                        </text>

                        {/* Node Primary Label */}
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          fill="#171717"
                          fontSize="9.5"
                          fontWeight="bold"
                        >
                          {node.label.length > 24 ? node.label.slice(0, 22) + '...' : node.label}
                        </text>

                        {/* Node Sublabel */}
                        <text
                          x="0"
                          y="16"
                          textAnchor="middle"
                          fill="#52525B"
                          fontSize="8"
                          fontWeight="500"
                        >
                          {node.sublabel.length > 26 ? node.sublabel.slice(0, 24) + '...' : node.sublabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Node Inspector Drawer */}
            <div className="bg-white border border-[#E9E2F5] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E2F5]">
                    <span
                      className={`font-mono text-[10px] px-2.5 py-1 rounded-md border font-bold ${
                        getNodeColor(selectedNode.type).bg
                      } ${getNodeColor(selectedNode.type).text} ${
                        getNodeColor(selectedNode.type).border
                      }`}
                    >
                      {selectedNode.type}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        selectedNode.riskSeverity === 'CRITICAL'
                          ? 'text-[#DC2626]'
                          : selectedNode.riskSeverity === 'HIGH'
                          ? 'text-[#D97706]'
                          : 'text-[#8B5CF6]'
                      }`}
                    >
                      {selectedNode.riskSeverity} PRIORITY
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#171717]">
                      {selectedNode.label}
                    </h3>
                    <div className="text-xs text-[#8B5CF6] font-semibold mt-0.5">
                      {selectedNode.sublabel}
                    </div>
                  </div>

                  <div className="text-xs text-[#52525B] leading-relaxed bg-[#FAF8FF] p-3 rounded-xl border border-[#E9E2F5]">
                    <span className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 font-semibold">
                      Architectural & Operational Impact:
                    </span>
                    {selectedNode.details}
                  </div>

                  {selectedNode.evidenceQuote && (
                    <div className="text-xs text-[#52525B] leading-relaxed bg-[#F5F0FF] p-3 rounded-xl border border-[#E9E2F5]">
                      <span className="text-[10px] text-[#8B5CF6] uppercase font-mono block mb-1 flex items-center space-x-1 font-bold">
                        <FileCode className="w-3 h-3 text-[#8B5CF6]" />
                        <span>Verbatim Ground Truth Evidence:</span>
                      </span>
                      <blockquote className="italic text-[#171717] text-[11px]">
                        "{selectedNode.evidenceQuote}"
                      </blockquote>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2 text-xs">
                    {selectedNode.sourceFile && (
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span className="text-[#71717A] font-mono text-[11px]">Source Location:</span>
                        <span className="font-mono text-[#171717] text-[11px] truncate max-w-[180px] font-semibold">
                          {selectedNode.sourceFile}
                        </span>
                      </div>
                    )}
                    {selectedNode.owner && (
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span className="text-[#71717A] font-mono text-[11px]">Primary Owner:</span>
                        <span className="font-semibold text-[#8B5CF6] text-[11px]">
                          {selectedNode.owner}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#71717A] space-y-2">
                  <Network className="w-8 h-8 mx-auto text-[#A1A1AA]" />
                  <p className="text-xs">Select any node on the topology map to inspect details.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E9E2F5] space-y-2">
                {selectedNode?.claimId ? (
                  <button
                    onClick={() => {
                      const match = claims.find(c => c.id === selectedNode.claimId);
                      if (match) setSelectedClaim(match);
                      setActiveView('CLAIM_LEDGER');
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-opacity cursor-pointer shadow-xs"
                  >
                    <span>Inspect in Split-View Claim Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveView('REVIEW_DESK')}
                    className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-[#FAF8FF] text-[#171717] border border-[#E9E2F5] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <span>Open Conflict Review Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLICIT RISKS & BLOCKERS LIST */}
      {activeTab === 'RISKS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#171717] uppercase tracking-wider font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Extracted Ground-Truth Risks & External Dependencies ({riskClaims.length})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {riskClaims.map(c => (
              <div
                key={c.id}
                className="bg-white border border-[#E9E2F5] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-[#8B5CF6] transition-all shadow-xs"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-md border font-bold ${
                        c.type === 'BLOCKER'
                          ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                          : c.type === 'DEPENDENCY'
                          ? 'bg-[#F5F0FF] text-[#8B5CF6] border-[#E9E2F5]'
                          : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                      }`}
                    >
                      {c.type}
                    </span>
                    <span className="font-mono text-[10px] text-[#71717A]">
                      Source: {c.source_location}
                    </span>
                    {c.owner && (
                      <span className="font-mono text-[10px] text-[#8B5CF6] font-semibold">
                        Owner: {c.owner}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-[#171717] text-sm">
                    {c.statement}
                  </div>

                  <div className="text-[11px] text-[#52525B] italic bg-[#FAF8FF] p-2.5 rounded-lg border border-[#E9E2F5]">
                    Supporting Evidence: "{c.supporting_quote}"
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <span className="font-mono text-[10px] text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] px-2 py-0.5 rounded-md font-bold">
                    {c.reviewer_status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedClaim(c);
                      setActiveView('CLAIM_LEDGER');
                    }}
                    className="flex items-center space-x-1 text-[#8B5CF6] hover:text-[#7C3AED] font-semibold text-xs cursor-pointer"
                  >
                    <span>Open in Split-View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CRITICAL OPERATIONAL GAPS & OWNERSHIP RISKS */}
      {activeTab === 'GAPS' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#171717] uppercase tracking-wider font-mono flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#DC2626]" />
            <span>High Severity Operational Gaps & Ownership Risks ({gaps.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gaps.map(g => (
              <div
                key={g.id}
                className="bg-white border border-[#FECACA] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#DC2626] transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] font-bold">
                      {g.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#DC2626] font-bold">
                      {g.severity}
                    </span>
                  </div>

                  <div className="font-bold text-[#171717] text-sm leading-snug">
                    {g.title}
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E9E2F5] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#8B5CF6] uppercase font-mono block font-semibold">
                      Suggested Mitigation:
                    </span>
                    <span className="text-[#171717] text-[11px] leading-snug block font-medium">
                      {g.suggested_action}
                    </span>
                  </div>

                  {g.source_reference && (
                    <div className="text-[10px] text-[#71717A] font-mono truncate">
                      Ref: {g.source_reference}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
