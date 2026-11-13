import { Project, Source, Claim, Conflict, GapOrMissingEvidence, Handover } from '../types';

export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project & { metrics: any }> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project details');
    return res.json();
  },

  async createProject(name: string, description: string): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  // Sources
  async getSources(projectId: string): Promise<Source[]> {
    const res = await fetch(`/api/projects/${projectId}/sources`);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async addSource(projectId: string, payload: {
    name: string;
    source_type: string;
    raw_content: string;
    access_level?: string;
    metadata?: any;
  }): Promise<Source> {
    const res = await fetch(`/api/projects/${projectId}/sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add source');
    return res.json();
  },

  async deleteSource(projectId: string, sourceId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/projects/${projectId}/sources/${sourceId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete source');
    return res.json();
  },

  // Reconstruction
  async runReconstruction(projectId: string): Promise<{
    success: boolean;
    engine: string;
    claims_count: number;
    verified_count: number;
    conflicts_count: number;
    gaps_count: number;
    readiness_score: number;
    logs: { step: string; message: string; timestamp: string }[];
  }> {
    const res = await fetch(`/api/projects/${projectId}/reconstruct`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Reconstruction pipeline execution failed');
    }
    return res.json();
  },

  // Claims
  async getClaims(projectId: string, filters?: {
    type?: string;
    evidence_status?: string;
    reviewer_status?: string;
    search?: string;
  }): Promise<Claim[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.evidence_status) params.set('evidence_status', filters.evidence_status);
    if (filters?.reviewer_status) params.set('reviewer_status', filters.reviewer_status);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`/api/projects/${projectId}/claims?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch claims');
    return res.json();
  },

  async updateClaim(claimId: string, payload: Partial<Claim>): Promise<Claim> {
    const res = await fetch(`/api/claims/${claimId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update claim');
    return res.json();
  },

  // Conflicts
  async getConflicts(projectId: string): Promise<Conflict[]> {
    const res = await fetch(`/api/projects/${projectId}/conflicts`);
    if (!res.ok) throw new Error('Failed to fetch conflicts');
    return res.json();
  },

  async resolveConflict(conflictId: string, resolved_claim_id?: string, resolution_notes?: string): Promise<Conflict> {
    const res = await fetch(`/api/conflicts/${conflictId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolved_claim_id, resolution_notes })
    });
    if (!res.ok) throw new Error('Failed to resolve conflict');
    return res.json();
  },

  // Gaps
  async getGaps(projectId: string): Promise<GapOrMissingEvidence[]> {
    const res = await fetch(`/api/projects/${projectId}/gaps`);
    if (!res.ok) throw new Error('Failed to fetch gaps');
    return res.json();
  },

  // Readiness
  async getReadiness(projectId: string): Promise<{
    score: number;
    totalClaims: number;
    verifiedClaims: number;
    approvedClaims: number;
    unresolvedConflicts: number;
    criticalGaps: number;
    coveragePercent: number;
  }> {
    const res = await fetch(`/api/projects/${projectId}/readiness`);
    if (!res.ok) throw new Error('Failed to fetch readiness');
    return res.json();
  },

  // Handovers
  async getHandovers(projectId: string): Promise<Handover[]> {
    const res = await fetch(`/api/projects/${projectId}/handovers`);
    if (!res.ok) throw new Error('Failed to fetch handovers');
    return res.json();
  },

  async createHandover(projectId: string, payload: {
    target_role: string;
    title: string;
    summary: string;
  }): Promise<Handover> {
    const res = await fetch(`/api/projects/${projectId}/handovers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create handover');
    return res.json();
  },

  async acknowledgeHandover(handoverId: string, name: string, role: string): Promise<{
    success: boolean;
    acknowledgement: any;
    handover: Handover;
  }> {
    const res = await fetch(`/api/handovers/${handoverId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role })
    });
    if (!res.ok) throw new Error('Failed to acknowledge handover');
    return res.json();
  },

  // Reset Demo
  async resetDemo(): Promise<void> {
    const res = await fetch('/api/demo/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo');
  }
};
