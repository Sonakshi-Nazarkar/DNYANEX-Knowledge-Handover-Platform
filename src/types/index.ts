export type Role = 'OWNER' | 'REVIEWER' | 'INCOMING_MEMBER';

export type ClaimType =
  | 'DECISION'
  | 'TASK'
  | 'OWNER'
  | 'RISK'
  | 'DEPENDENCY'
  | 'BLOCKER'
  | 'NEXT_ACTION'
  | 'OPEN_QUESTION'
  | 'RECURRING_PROBLEM'
  | 'CONTACT_OR_RESOURCE';

export type EvidenceStatus =
  | 'VERIFIED'
  | 'INFERRED'
  | 'CONFLICTING'
  | 'MISSING_EVIDENCE'
  | 'PENDING_REVIEW';

export type ReviewerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITED';

export type SourceType = 'GITHUB' | 'PDF' | 'DOCX' | 'MARKDOWN' | 'TXT' | 'CSV';

export interface Source {
  id: string;
  project_id: string;
  name: string;
  source_type: SourceType;
  access_level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL';
  raw_content: string;
  normalized_content: string;
  uploaded_by: string;
  created_at: string;
  processing_status: 'PROCESSED' | 'PENDING' | 'FAILED';
  metadata: {
    repo_url?: string;
    branch?: string;
    commits_count?: number;
    issues_count?: number;
    file_size_bytes?: number;
    lines_count?: number;
  };
}

export interface Claim {
  id: string;
  project_id: string;
  source_id: string;
  source_name: string;
  type: ClaimType;
  statement: string;
  supporting_quote: string;
  source_location: string;
  confidence: 'high' | 'medium' | 'low';
  evidence_status: EvidenceStatus;
  reviewer_status: ReviewerStatus;
  reviewer_decision_notes?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  owner?: string | null;
  event_date?: string | null;
  reasoning: string;
  exact_quote_match: boolean;
  match_start_idx?: number;
  match_end_idx?: number;
  created_at: string;
  audit_history: {
    timestamp: string;
    action: string;
    actor: string;
    details?: string;
  }[];
}

export interface Conflict {
  id: string;
  project_id: string;
  topic: string;
  claim_a_id: string;
  claim_b_id: string;
  explanation: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  resolution_notes?: string;
  resolved_claim_id?: string;
  resolved_by?: string;
  resolved_at?: string;
}

export interface GapOrMissingEvidence {
  id: string;
  project_id: string;
  title: string;
  description: string;
  category: 'UNASSIGNED_TASK' | 'MISSING_DEPLOY_SPEC' | 'UNKNOWN_DEADLINE' | 'SINGLE_POINT_FAILURE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  suggested_action: string;
  source_reference?: string;
}

export interface Handover {
  id: string;
  project_id: string;
  version: string;
  target_role: 'DEVELOPER' | 'PROJECT_MANAGER' | 'STUDENT_INTERN';
  title: string;
  summary: string;
  approved_claims_count: number;
  readiness_score: number;
  created_by: string;
  created_at: string;
  published_at?: string;
  is_published: boolean;
  claims: Claim[];
  acknowledgements: {
    acknowledged_by: string;
    role: string;
    timestamp: string;
    signature_hash: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  members: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }[];
  sources_count: number;
  claims_count: number;
  verified_count: number;
  pending_count: number;
  conflicts_count: number;
  readiness_score: number;
}
