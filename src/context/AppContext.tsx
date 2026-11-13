import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Role, Claim, Source } from '../types';
import { api } from '../services/api';

export type NavView =
  | 'LANDING'
  | 'DASHBOARD'
  | 'SOURCES'
  | 'RECONSTRUCTION'
  | 'CLAIM_LEDGER'
  | 'REVIEW_DESK'
  | 'TIMELINE'
  | 'RISK_MATRIX'
  | 'HANDOVERS'
  | 'INCOMING_PORTAL'
  | 'DOCS';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (proj: Project | null) => void;
  selectedClaim: Claim | null;
  setSelectedClaim: (claim: Claim | null) => void;
  highlightedSource: Source | null;
  setHighlightedSource: (source: Source | null) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  refreshProjectData: () => Promise<void>;
  isLoading: boolean;
  resetDemoToCampusConnect: () => Promise<void>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('REVIEWER');
  const [activeView, setActiveView] = useState<NavView>('DASHBOARD');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [highlightedSource, setHighlightedSource] = useState<Source | null>(null);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshProjectData = async () => {
    try {
      const projList = await api.getProjects();
      setProjects(projList);
      if (projList.length > 0) {
        if (!activeProject || !projList.find(p => p.id === activeProject.id)) {
          setActiveProject(projList[0]);
        } else {
          const updated = projList.find(p => p.id === activeProject.id) || projList[0];
          setActiveProject(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProjectData();
  }, []);

  const resetDemoToCampusConnect = async () => {
    try {
      setIsLoading(true);
      await api.resetDemo();
      await refreshProjectData();
      setDemoStep(1);
      setActiveView('DASHBOARD');
      addToast('success', 'Demo Reset', 'CampusConnect Departure scenario reloaded with fresh state.');
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        projects,
        activeProject,
        setActiveProject,
        selectedClaim,
        setSelectedClaim,
        highlightedSource,
        setHighlightedSource,
        demoStep,
        setDemoStep,
        toasts,
        addToast,
        removeToast,
        refreshProjectData,
        isLoading,
        resetDemoToCampusConnect,
        isMobileMenuOpen,
        setIsMobileMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
