import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Claim } from '../types';
import {
  Clock,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  FileText,
  ArrowRight,
  ExternalLink,
  Tag
} from 'lucide-react';

export const ProjectTimeline: React.FC = () => {
  const { activeProject, setSelectedClaim, setActiveView, addToast } = useApp();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeProject?.id) return;
    const projId = activeProject.id;
    async function load(id: string) {
      try {
        setLoading(true);
        const data = await api.getClaims(id);
        // Sort chronologically: items with event_date first
        const sorted = data.sort((a, b) => {
          if (a.event_date && b.event_date) {
            return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
          }
          if (a.event_date) return -1;
          if (b.event_date) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setClaims(sorted);
      } catch (err: any) {
        addToast('error', 'Timeline load failed', err.message);
      } finally {
        setLoading(false);
      }
    }
    load(projId);
  }, [activeProject]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9E2F5]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-1 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Chronological Evidence Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Project Event & Decision Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl leading-relaxed">
            A strictly source-grounded chronology of architecture decisions, merged pull requests, and recorded executive agreements.
            Source dates are distinguished from inferred dates.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#52525B] bg-white border border-[#E9E2F5] px-3.5 py-2 rounded-xl shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
          <span className="font-semibold text-[#16A34A]">Explicit Source Date</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] ml-2"></span>
          <span className="font-semibold text-[#D97706]">Inferred Timestamp</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-[#E9E2F5] ml-4 md:ml-8 pl-6 md:pl-8 space-y-8">
        {claims.map((c, idx) => {
          const hasExplicitDate = !!c.event_date;
          const displayDate = c.event_date
            ? new Date(c.event_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : `Inferred from ingestion (${new Date(c.created_at).toLocaleDateString()})`;

          return (
            <div key={c.id} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] shadow-xs ${
                  hasExplicitDate
                    ? 'bg-white border-[#16A34A] text-[#16A34A]'
                    : 'bg-white border-[#D97706] text-[#D97706]'
                }`}
              >
                {c.type === 'DECISION' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : c.type === 'TASK' ? (
                  <GitPullRequest className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              {/* Event Card */}
              <div className="bg-white border border-[#E9E2F5] hover:border-[#8B5CF6] rounded-2xl p-5 space-y-3 transition-all shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8FF] border border-[#E9E2F5] text-[#8B5CF6] font-bold">
                      {c.type}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                        hasExplicitDate
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                      }`}
                    >
                      {hasExplicitDate ? 'EXPLICIT DATE' : 'INFERRED DATE'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-[#71717A] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{displayDate}</span>
                  </div>
                </div>

                <div className="font-bold text-[#171717] text-sm">
                  {c.statement}
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] text-xs text-[#52525B] italic leading-relaxed">
                  "{c.supporting_quote}"
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E9E2F5] text-xs">
                  <div className="text-[#71717A] truncate max-w-md">
                    <span className="text-[#A1A1AA]">Source: </span>
                    <span className="text-[#52525B] font-mono text-[11px] font-semibold">{c.source_location}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClaim(c);
                      setActiveView('CLAIM_LEDGER');
                    }}
                    className="flex items-center space-x-1 text-[#8B5CF6] hover:text-[#7C3AED] font-semibold text-xs cursor-pointer"
                  >
                    <span>Inspect Raw Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
