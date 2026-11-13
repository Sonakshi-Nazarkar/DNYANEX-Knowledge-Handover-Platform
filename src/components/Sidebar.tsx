import React from 'react';
import { useApp, NavView } from '../context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  FileSearch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  UserCheck2,
  Home,
  ShieldCheck,
  FileCode,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    activeProject,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const handleNavClick = (view: NavView) => {
    setActiveView(view);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navItems: NavItem[] = [
    { id: 'DASHBOARD', label: 'Mission Dashboard', icon: LayoutDashboard },
    { id: 'SOURCES', label: 'Source Ingestion', icon: FolderGit2, badge: activeProject?.sources_count },
    { id: 'RECONSTRUCTION', label: 'AI Reconstruction', icon: Cpu, badge: 'Gemini' },
    { id: 'CLAIM_LEDGER', label: 'Claim Ledger', icon: FileSearch, badge: activeProject?.claims_count },
    {
      id: 'REVIEW_DESK',
      label: 'Human Review Desk',
      icon: CheckCircle2,
      badge: activeProject?.pending_count ? `${activeProject.pending_count} pending` : undefined,
      badgeColor: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
    },
    { id: 'TIMELINE', label: 'Project Timeline', icon: Clock },
    {
      id: 'RISK_MATRIX',
      label: 'Risks & Topology',
      icon: AlertTriangle,
      badge: activeProject?.conflicts_count ? `${activeProject.conflicts_count} conflict` : undefined,
      badgeColor: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
    },
    { id: 'HANDOVERS', label: 'Handover Publisher', icon: Send },
    { id: 'INCOMING_PORTAL', label: 'Incoming Member View', icon: UserCheck2, badge: 'Successor' },
    { id: 'LANDING', label: 'Product Landing Page', icon: Home },
    { id: 'DOCS', label: 'Architecture & Spec', icon: FileCode }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-64 bg-white border-r border-[#E9E2F5] flex flex-col shrink-0 min-h-screen lg:min-h-[calc(100vh-6.5rem)] transform transition-transform duration-200 ease-in-out shadow-xs ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b border-[#E9E2F5] lg:hidden bg-[#FAF8FF]">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Navigation Menu</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 text-[#52525B] hover:text-[#171717] rounded-lg hover:bg-[#F5F0FF]"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>

        {/* Project Status Snippet */}
        <div className="p-4 border-b border-[#E9E2F5] bg-[#FAF8FF]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mb-1 flex items-center justify-between">
            <span>Active Project</span>
            <span className="text-[10px] text-[#8B5CF6] font-mono font-bold bg-[#F5F0FF] px-1.5 py-0.5 rounded border border-[#E9E2F5]">
              {activeProject?.readiness_score || 0}% Ready
            </span>
          </div>
          <div className="font-bold text-sm text-[#171717] truncate">
            {activeProject?.name || 'CampusConnect'}
          </div>
          <div className="mt-1 text-xs text-[#52525B] line-clamp-2 leading-relaxed">
            {activeProject?.description || 'Active knowledge transition session'}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#52525B] bg-white p-2 rounded-lg border border-[#E9E2F5]">
            <span>Active Role:</span>
            <span className="font-mono font-bold text-[#8B5CF6]">
              {currentRole}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F5F0FF] text-[#8B5CF6] border border-[#E9E2F5] shadow-2xs font-bold'
                    : 'text-[#52525B] hover:text-[#171717] hover:bg-[#FAF8FF]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#8B5CF6]' : 'text-[#71717A]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] font-bold'
                        : 'bg-[#F5F0FF] text-[#71717A] border-[#E9E2F5]')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* DNYANEX Assurance Box with Light Purple Accent */}
        <div className="p-3.5 m-3 rounded-xl bg-[#FAF8FF] border border-[#E9E2F5] text-[11px] text-[#52525B]">
          <div className="flex items-center space-x-1.5 text-[#8B5CF6] font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
            <span>Evidence Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#52525B]">
            "A handover is not a summary. It is a collection of verifiable, reviewable claims."
          </p>
        </div>
      </aside>
    </>
  );
};
