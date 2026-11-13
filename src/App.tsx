import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SourceManager } from './components/SourceManager';
import { ReconstructionView } from './components/ReconstructionView';
import { ClaimLedger } from './components/ClaimLedger';
import { ReviewDesk } from './components/ReviewDesk';
import { ProjectTimeline } from './components/ProjectTimeline';
import { RiskMatrix } from './components/RiskMatrix';
import { HandoverGenerator } from './components/HandoverGenerator';
import { IncomingMemberPortal } from './components/IncomingMemberPortal';
import { DocumentationView } from './components/DocumentationView';
import { ToastContainer } from './components/ToastContainer';

function MainContent() {
  const { activeView } = useApp();

  if (activeView === 'LANDING') {
    return <LandingPage />;
  }

  return (
    <div className="flex flex-1 min-h-[calc(100vh-6.5rem)]">
      <Sidebar />
      <main className="flex-1 bg-[#F5F0FF] overflow-y-auto min-w-0">
        {activeView === 'DASHBOARD' && <Dashboard />}
        {activeView === 'SOURCES' && <SourceManager />}
        {activeView === 'RECONSTRUCTION' && <ReconstructionView />}
        {activeView === 'CLAIM_LEDGER' && <ClaimLedger />}
        {activeView === 'REVIEW_DESK' && <ReviewDesk />}
        {activeView === 'TIMELINE' && <ProjectTimeline />}
        {activeView === 'RISK_MATRIX' && <RiskMatrix />}
        {activeView === 'HANDOVERS' && <HandoverGenerator />}
        {activeView === 'INCOMING_PORTAL' && <IncomingMemberPortal />}
        {activeView === 'DOCS' && <DocumentationView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F5F0FF] text-[#171717] flex flex-col font-sans selection:bg-[#8B5CF6] selection:text-white">
        <Navbar />
        <MainContent />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
