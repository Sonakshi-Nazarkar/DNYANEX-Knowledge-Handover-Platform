import React from 'react';
import { useApp, NavView } from '../context/AppContext';
import { Role } from '../types';
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen,
  UserCheck,
  Eye,
  FileCheck2,
  GitBranch,
  Layers,
  Menu,
  X
} from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, title: 'Explore Project', view: 'DASHBOARD' as NavView, role: 'OWNER' as Role },
  { step: 2, title: 'Connected Sources', view: 'SOURCES' as NavView, role: 'OWNER' as Role },
  { step: 3, title: 'AI Reconstruction', view: 'RECONSTRUCTION' as NavView, role: 'OWNER' as Role },
  { step: 4, title: 'Claim Ledger', view: 'CLAIM_LEDGER' as NavView, role: 'REVIEWER' as Role },
  { step: 5, title: 'Exact Evidence', view: 'CLAIM_LEDGER' as NavView, role: 'REVIEWER' as Role },
  { step: 6, title: 'Inspect Conflict', view: 'REVIEW_DESK' as NavView, role: 'REVIEWER' as Role },
  { step: 7, title: 'Review & Approve', view: 'REVIEW_DESK' as NavView, role: 'REVIEWER' as Role },
  { step: 8, title: 'Role Handover', view: 'HANDOVERS' as NavView, role: 'REVIEWER' as Role },
  { step: 9, title: 'Incoming Member Sign', view: 'INCOMING_PORTAL' as NavView, role: 'INCOMING_MEMBER' as Role },
];

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    activeProject,
    demoStep,
    setDemoStep,
    resetDemoToCampusConnect,
    addToast,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const handleStepClick = (s: typeof DEMO_STEPS[0]) => {
    setDemoStep(s.step);
    setActiveView(s.view);
    setCurrentRole(s.role);
    setIsMobileMenuOpen(false);
    addToast('info', `Demo Step ${s.step}: ${s.title}`, `Switched role to ${s.role}`);
  };

  return (
    <header className="border-b border-[#E9E2F5] bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Project */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Mobile Menu Toggle Button */}
          {activeView !== 'LANDING' && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#52525B] hover:text-[#171717] bg-[#FAF8FF] border border-[#E9E2F5] focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#8B5CF6]" /> : <Menu className="w-5 h-5 text-[#8B5CF6]" />}
            </button>
          )}

          <div
            onClick={() => {
              setActiveView('LANDING');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center shadow-md shadow-[#8B5CF6]/20 group-hover:bg-[#7C3AED] transition-all">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-[#171717]">
                  DNYANEX
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#F5F0FF] text-[#8B5CF6] border border-[#E9E2F5] font-mono">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] font-medium hidden sm:block">
                Knowledge That Survives People
              </p>
            </div>
          </div>

          {/* Project Selector & Color Palette Widget */}
          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-[#E9E2F5]">
            <div className="flex items-center space-x-2 text-xs text-[#52525B] bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-2.5 py-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[#171717] font-semibold">
                {activeProject?.name || 'CampusConnect Portal'}
              </span>
              <span className="text-[10px] text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] px-1.5 py-0.2 rounded font-mono font-medium">
                Live
              </span>
            </div>

            {/* Custom Brand Palette Swatches */}
            <div
              className="flex items-center space-x-1.5 bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg px-2.5 py-1.5 text-[10px] text-[#52525B]"
              title="Brand Palette: #8B5CF6 (Primary Purple) | #A78BFA (Light Purple) | #F5F0FF (Lavender) | #FFFFFF (White)"
            >
              <span className="font-mono text-[9px] text-[#71717A] uppercase hidden xl:inline">Palette</span>
              <div className="flex items-center -space-x-1">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6] ring-1 ring-white" title="#8B5CF6 Primary Purple"></span>
                <span className="w-3 h-3 rounded-full bg-[#A78BFA] ring-1 ring-white" title="#A78BFA Light Purple"></span>
                <span className="w-3 h-3 rounded-full bg-[#F5F0FF] ring-1 ring-slate-300" title="#F5F0FF Soft Lavender"></span>
                <span className="w-3 h-3 rounded-full bg-[#FFFFFF] ring-1 ring-slate-300" title="#FFFFFF White"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Quick Actions */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher */}
          <div className="flex items-center bg-[#FAF8FF] border border-[#E9E2F5] rounded-lg p-0.5 text-xs">
            <span className="text-[10px] text-[#71717A] px-2 font-mono uppercase tracking-wider hidden lg:inline">
              Role:
            </span>
            {(['OWNER', 'REVIEWER', 'INCOMING_MEMBER'] as Role[]).map(role => {
              const active = currentRole === role;
              const label =
                role === 'OWNER'
                  ? 'Owner'
                  : role === 'REVIEWER'
                  ? 'Reviewer'
                  : 'Incoming Dev';
              return (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                    if (role === 'INCOMING_MEMBER') {
                      setActiveView('INCOMING_PORTAL');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    active
                      ? 'bg-[#8B5CF6] text-white font-semibold shadow-xs'
                      : 'text-[#52525B] hover:text-[#171717] hover:bg-[#F5F0FF]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemoToCampusConnect}
            title="Reset to CampusConnect Departure scenario"
            className="flex items-center space-x-1.5 text-xs text-[#52525B] hover:text-[#171717] bg-white hover:bg-[#FAF8FF] border border-[#E9E2F5] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Docs / Technical Specs */}
          <button
            onClick={() => setActiveView('DOCS')}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              activeView === 'DOCS'
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                : 'text-[#52525B] bg-white border-[#E9E2F5] hover:text-[#171717] hover:bg-[#FAF8FF]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="hidden sm:inline">Spec & Docs</span>
          </button>
        </div>
      </div>

      {/* Hackathon Judge Guided Stepper Banner */}
      <div className="bg-[#FAF8FF] border-t border-[#E9E2F5] px-4 py-2 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 min-w-max text-xs">
          <div className="flex items-center space-x-1 pr-3 border-r border-[#E9E2F5] text-[11px] font-semibold text-[#8B5CF6] tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>JUDGE DEMO FLOW:</span>
          </div>

          {DEMO_STEPS.map((s, idx) => {
            const isCurrent = demoStep === s.step;
            const isPast = demoStep > s.step;
            return (
              <React.Fragment key={s.step}>
                <button
                  onClick={() => handleStepClick(s)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#8B5CF6] text-white font-bold shadow-xs'
                      : isPast
                      ? 'text-[#8B5CF6] bg-[#F5F0FF] hover:bg-[#E9E2F5] border border-[#E9E2F5]'
                      : 'text-[#71717A] bg-white hover:bg-[#FAF8FF] hover:text-[#171717] border border-[#E9E2F5]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-white text-[#8B5CF6]'
                        : isPast
                        ? 'bg-[#A78BFA] text-white'
                        : 'bg-[#F5F0FF] text-[#71717A]'
                    }`}
                  >
                    {s.step}
                  </span>
                  <span>{s.title}</span>
                </button>
                {idx < DEMO_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#E9E2F5] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
