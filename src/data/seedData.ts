import { Project, Source, Claim, Conflict, GapOrMissingEvidence, Handover } from '../types';

export const INITIAL_PROJECT: Project = {
  id: 'proj_campus_connect',
  name: 'CampusConnect Portal',
  description: 'University student portal and marketplace. Key backend engineer Sarah Chen is transitioning out before the Semester 1 release.',
  created_at: '2026-10-15T09:00:00Z',
  members: [
    { id: 'usr_1', name: 'Alex Rivera (You)', email: 'alex@campusconnect.edu', role: 'OWNER' },
    { id: 'usr_2', name: 'Elena Rostova', email: 'elena@campusconnect.edu', role: 'REVIEWER' },
    { id: 'usr_3', name: 'Devon Vance', email: 'devon@campusconnect.edu', role: 'INCOMING_MEMBER' }
  ],
  sources_count: 3,
  claims_count: 10,
  verified_count: 7,
  pending_count: 3,
  conflicts_count: 1,
  readiness_score: 74
};

export const INITIAL_SOURCES: Source[] = [
  {
    id: 'src_gh_repo',
    project_id: 'proj_campus_connect',
    name: 'github.com/campusconnect/backend-core',
    source_type: 'GITHUB',
    access_level: 'INTERNAL',
    uploaded_by: 'Sarah Chen (Outgoing Tech Lead)',
    created_at: '2026-10-20T14:32:00Z',
    processing_status: 'PROCESSED',
    metadata: {
      repo_url: 'https://github.com/campusconnect/backend-core',
      branch: 'main',
      commits_count: 148,
      issues_count: 24,
      lines_count: 12400
    },
    raw_content: `CampusConnect Backend Core Repository Summary
Repository: campusconnect/backend-core
Branch: main | Status: Active development

--- PULL REQUEST #84 ---
Title: feat(auth): Migrate session store to Redis cluster and PostgreSQL
Author: sarah_chen
Status: MERGED
Description:
"Decided to migrate our primary auth persistence to PostgreSQL 16 with Supabase connection pooler because Firebase auth was exceeding latency budgets during test peak loads. Redis 7 is used exclusively for token revocation blocklists."

--- PULL REQUEST #102 ---
Title: feat(payment): Razorpay and Stripe campus payment gateway integration
Author: sarah_chen
Status: OPEN - WIP
Description:
"The payment webhook handler is 70% complete. Stripe card payments work in test mode, but campus UPI qr-code split payments are unfinished. CRITICAL: The Razorpay webhook signature secret is stored in Doppler vault under CAMPUS_PAY_SECRET. Needs incoming engineer to finish refund reconciliation cron."

--- ISSUE #119 ---
Title: [BUG] Rate limiter drops legitimate library seat booking requests
Author: mark_frontend
Status: OPEN
Comments:
sarah_chen: "Identified the bottleneck: IP header forwarding behind Cloudflare proxy is missing X-Forwarded-For trust config in Express app. Fix is pending review."

--- COMMIT 8f3a921 ---
Commit: 8f3a921b74e2
Author: sarah_chen <sarah@campusconnect.edu>
Date: 2026-11-02 17:40:12
Message:
"chore: update release targets in deployment manifest. Target production rollout is scheduled for December 15, 2026."
`,
    normalized_content: `CampusConnect Backend Core Repository Summary
Repository: campusconnect/backend-core
Branch: main | Status: Active development

--- PULL REQUEST #84 ---
Title: feat(auth): Migrate session store to Redis cluster and PostgreSQL
Author: sarah_chen
Status: MERGED
Description:
"Decided to migrate our primary auth persistence to PostgreSQL 16 with Supabase connection pooler because Firebase auth was exceeding latency budgets during test peak loads. Redis 7 is used exclusively for token revocation blocklists."

--- PULL REQUEST #102 ---
Title: feat(payment): Razorpay and Stripe campus payment gateway integration
Author: sarah_chen
Status: OPEN - WIP
Description:
"The payment webhook handler is 70% complete. Stripe card payments work in test mode, but campus UPI qr-code split payments are unfinished. CRITICAL: The Razorpay webhook signature secret is stored in Doppler vault under CAMPUS_PAY_SECRET. Needs incoming engineer to finish refund reconciliation cron."

--- ISSUE #119 ---
Title: [BUG] Rate limiter drops legitimate library seat booking requests
Author: mark_frontend
Status: OPEN
Comments:
sarah_chen: "Identified the bottleneck: IP header forwarding behind Cloudflare proxy is missing X-Forwarded-For trust config in Express app. Fix is pending review."

--- COMMIT 8f3a921 ---
Commit: 8f3a921b74e2
Author: sarah_chen <sarah@campusconnect.edu>
Date: 2026-11-02 17:40:12
Message:
"chore: update release targets in deployment manifest. Target production rollout is scheduled for December 15, 2026."
`
  },
  {
    id: 'src_doc_arch',
    project_id: 'proj_campus_connect',
    name: 'architecture_decision_record_v2.md',
    source_type: 'MARKDOWN',
    access_level: 'INTERNAL',
    uploaded_by: 'Sarah Chen (Outgoing Tech Lead)',
    created_at: '2026-10-25T11:15:00Z',
    processing_status: 'PROCESSED',
    metadata: {
      file_size_bytes: 8420,
      lines_count: 195
    },
    raw_content: `# ADR 004: Microservices vs Modular Monolith & Database Strategy

Status: Accepted
Date: 2026-10-22
Decision Makers: Sarah Chen (Lead), Alex Rivera (PM), Dr. Kulkarni (Advisor)

## Context
CampusConnect requires high reliability during course registration surges (approx 4,000 req/sec) while keeping hosting overhead minimal.

## Decision
1. Database Architecture:
"The team agreed to use PostgreSQL with row-level security as the single source of truth for student records, enrollment ledgers, and transactions."

2. External Services Dependency:
"SendGrid is utilized for transactional email OTPs, but SMS gateway has a single-point dependency on Twilio with zero automated failover fallback if credit balance dips below $50."

3. Deployment and Infrastructure:
"Containerized Docker services are orchestrated on GCP Cloud Run with scale-to-zero capabilities to conserve budget during night hours."

4. Security & Access Tokens:
"All database credentials and service keys are managed via Doppler environment manager. Do not check in .env files."
`,
    normalized_content: `# ADR 004: Microservices vs Modular Monolith & Database Strategy

Status: Accepted
Date: 2026-10-22
Decision Makers: Sarah Chen (Lead), Alex Rivera (PM), Dr. Kulkarni (Advisor)

## Context
CampusConnect requires high reliability during course registration surges (approx 4,000 req/sec) while keeping hosting overhead minimal.

## Decision
1. Database Architecture:
"The team agreed to use PostgreSQL with row-level security as the single source of truth for student records, enrollment ledgers, and transactions."

2. External Services Dependency:
"SendGrid is utilized for transactional email OTPs, but SMS gateway has a single-point dependency on Twilio with zero automated failover fallback if credit balance dips below $50."

3. Deployment and Infrastructure:
"Containerized Docker services are orchestrated on GCP Cloud Run with scale-to-zero capabilities to conserve budget during night hours."

4. Security & Access Tokens:
"All database credentials and service keys are managed via Doppler environment manager. Do not check in .env files."
`
  },
  {
    id: 'src_doc_meeting',
    project_id: 'proj_campus_connect',
    name: 'all_hands_meeting_notes_nov.txt',
    source_type: 'TXT',
    access_level: 'INTERNAL',
    uploaded_by: 'Alex Rivera',
    created_at: '2026-11-05T16:00:00Z',
    processing_status: 'PROCESSED',
    metadata: {
      file_size_bytes: 3900,
      lines_count: 88
    },
    raw_content: `CampusConnect Executive Sync & Handover Planning
Date: November 5, 2026
Attendees: Alex Rivera (Product), Sarah Chen (Tech Lead), Elena Rostova (QA Lead)

Meeting Transcript & Notes:

1. Handover Timeline:
Sarah Chen announced her departure effective November 18, 2026. Devon Vance will be the incoming backend engineer taking over API services.

2. Release Date Dispute:
Alex Rivera: "According to the student union agreement, final release must happen on December 20, 2026 to coincide with winter orientation."
Sarah Chen: "Commit 8f3a921 in repo explicitly specifies December 15, 2026 for database freeze. If we push to December 20, we need to extend staging QA window."

3. Unresolved Deployment Blocker:
Elena Rostova: "Who has root access to the GCP production billing account? Currently only Sarah's university email is owner, and if she loses campus SSO, production deployment pipelines will break."
Sarah Chen: "Action item pending: Transfer GCP billing admin role to Alex Rivera before Friday."

4. Unassigned Tasks:
"There is currently no assigned owner for the automated database backup verification test suite."
`,
    normalized_content: `CampusConnect Executive Sync & Handover Planning
Date: November 5, 2026
Attendees: Alex Rivera (Product), Sarah Chen (Tech Lead), Elena Rostova (QA Lead)

Meeting Transcript & Notes:

1. Handover Timeline:
Sarah Chen announced her departure effective November 18, 2026. Devon Vance will be the incoming backend engineer taking over API services.

2. Release Date Dispute:
Alex Rivera: "According to the student union agreement, final release must happen on December 20, 2026 to coincide with winter orientation."
Sarah Chen: "Commit 8f3a921 in repo explicitly specifies December 15, 2026 for database freeze. If we push to December 20, we need to extend staging QA window."

3. Unresolved Deployment Blocker:
Elena Rostova: "Who has root access to the GCP production billing account? Currently only Sarah's university email is owner, and if she loses campus SSO, production deployment pipelines will break."
Sarah Chen: "Action item pending: Transfer GCP billing admin role to Alex Rivera before Friday."

4. Unassigned Tasks:
"There is currently no assigned owner for the automated database backup verification test suite."
`
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm_1',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_arch',
    source_name: 'architecture_decision_record_v2.md',
    type: 'DECISION',
    statement: 'PostgreSQL with row-level security was chosen as the single source of truth for student records and transactions.',
    supporting_quote: 'The team agreed to use PostgreSQL with row-level security as the single source of truth for student records, enrollment ledgers, and transactions.',
    source_location: 'ADR 004 Section 1 (Database Architecture)',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Confirmed by Lead Architect and team in ADR 004.',
    reviewed_by: 'Elena Rostova',
    reviewed_at: '2026-11-06T10:15:00Z',
    owner: 'Sarah Chen',
    event_date: '2026-10-22',
    reasoning: 'Explicitly ratified in accepted Architecture Decision Record ADR-004.',
    exact_quote_match: true,
    match_start_idx: 350,
    match_end_idx: 497,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T10:15:00Z', action: 'APPROVED', actor: 'Elena Rostova (Reviewer)', details: 'Matches codebase migrations in /supabase/migrations' }
    ]
  },
  {
    id: 'clm_2',
    project_id: 'proj_campus_connect',
    source_id: 'src_gh_repo',
    source_name: 'github.com/campusconnect/backend-core',
    type: 'TASK',
    statement: 'Payment webhook handler is 70% complete; campus UPI QR split payments and refund reconciliation remain unfinished.',
    supporting_quote: 'The payment webhook handler is 70% complete. Stripe card payments work in test mode, but campus UPI qr-code split payments are unfinished.',
    source_location: 'Pull Request #102 Description',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'High priority onboarding task for incoming backend developer Devon Vance.',
    reviewed_by: 'Alex Rivera',
    reviewed_at: '2026-11-06T11:00:00Z',
    owner: 'Devon Vance (Target Assignee)',
    event_date: '2026-11-04',
    reasoning: 'Pull Request #102 notes state the exact completion percentage and missing UPI logic.',
    exact_quote_match: true,
    match_start_idx: 590,
    match_end_idx: 733,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T11:00:00Z', action: 'APPROVED', actor: 'Alex Rivera (Project Owner)' }
    ]
  },
  {
    id: 'clm_3',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_arch',
    source_name: 'architecture_decision_record_v2.md',
    type: 'DEPENDENCY',
    statement: 'SMS gateway has a single-point external dependency on Twilio with no failover if balance drops below $50.',
    supporting_quote: 'SendGrid is utilized for transactional email OTPs, but SMS gateway has a single-point dependency on Twilio with zero automated failover fallback if credit balance dips below $50.',
    source_location: 'ADR 004 Section 2 (External Services)',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Valid operational risk. Set up auto-recharge and alert threshold.',
    reviewed_by: 'Elena Rostova',
    reviewed_at: '2026-11-06T11:20:00Z',
    owner: 'Sarah Chen',
    event_date: '2026-10-22',
    reasoning: 'Quoted verbatim from ADR 004 External Services section.',
    exact_quote_match: true,
    match_start_idx: 538,
    match_end_idx: 712,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T11:20:00Z', action: 'APPROVED', actor: 'Elena Rostova (Reviewer)' }
    ]
  },
  {
    id: 'clm_4',
    project_id: 'proj_campus_connect',
    source_id: 'src_gh_repo',
    source_name: 'github.com/campusconnect/backend-core',
    type: 'BLOCKER',
    statement: 'Rate limiter misconfig behind Cloudflare drops library seat reservation requests due to missing X-Forwarded-For trust.',
    supporting_quote: 'Identified the bottleneck: IP header forwarding behind Cloudflare proxy is missing X-Forwarded-For trust config in Express app.',
    source_location: 'GitHub Issue #119 (sarah_chen comment)',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Quick 1-line Express fix: app.set("trust proxy", 1). Incoming dev should patch day 1.',
    reviewed_by: 'Elena Rostova',
    reviewed_at: '2026-11-06T12:00:00Z',
    owner: 'Sarah Chen',
    event_date: '2026-11-03',
    reasoning: 'Issue #119 root cause comment clearly diagnoses the proxy header blocker.',
    exact_quote_match: true,
    match_start_idx: 935,
    match_end_idx: 1061,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T12:00:00Z', action: 'APPROVED', actor: 'Elena Rostova (Reviewer)' }
    ]
  },
  {
    id: 'clm_5',
    project_id: 'proj_campus_connect',
    source_id: 'src_gh_repo',
    source_name: 'github.com/campusconnect/backend-core',
    type: 'DECISION',
    statement: 'Target production rollout is scheduled for December 15, 2026 according to deployment commit 8f3a921.',
    supporting_quote: 'Target production rollout is scheduled for December 15, 2026.',
    source_location: 'Git Commit 8f3a921 Message',
    confidence: 'high',
    evidence_status: 'CONFLICTING',
    reviewer_status: 'PENDING',
    reviewer_decision_notes: 'Direct conflict with Executive meeting notes targeting December 20, 2026. Reviewer must resolve.',
    reviewed_by: null,
    reviewed_at: null,
    owner: 'Sarah Chen',
    event_date: '2026-11-02',
    reasoning: 'Commit message specifies December 15, whereas executive sync specifies December 20.',
    exact_quote_match: true,
    match_start_idx: 1198,
    match_end_idx: 1261,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'FLAGGED_CONFLICT', actor: 'Conflict Detection Engine', details: 'Conflicts with claim clm_6 (Dec 20 target)' }
    ]
  },
  {
    id: 'clm_6',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_meeting',
    source_name: 'all_hands_meeting_notes_nov.txt',
    type: 'DECISION',
    statement: 'Final product release must happen on December 20, 2026 to coincide with winter orientation.',
    supporting_quote: 'According to the student union agreement, final release must happen on December 20, 2026 to coincide with winter orientation.',
    source_location: 'All-Hands Meeting Notes Item 2',
    confidence: 'high',
    evidence_status: 'CONFLICTING',
    reviewer_status: 'PENDING',
    reviewer_decision_notes: 'Reviewer resolution needed: Reconcile code manifest with Student Union contract date.',
    reviewed_by: null,
    reviewed_at: null,
    owner: 'Alex Rivera',
    event_date: '2026-11-05',
    reasoning: 'Meeting statement by Product Manager citing legal student union date.',
    exact_quote_match: true,
    match_start_idx: 367,
    match_end_idx: 494,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'FLAGGED_CONFLICT', actor: 'Conflict Detection Engine', details: 'Conflicts with claim clm_5 (Dec 15 target)' }
    ]
  },
  {
    id: 'clm_7',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_meeting',
    source_name: 'all_hands_meeting_notes_nov.txt',
    type: 'RISK',
    statement: 'GCP production billing root access is currently owned only by Sarah Chen university SSO; departure could lock deployment pipeline.',
    supporting_quote: 'Currently only Sarah\'s university email is owner, and if she loses campus SSO, production deployment pipelines will break.',
    source_location: 'All-Hands Meeting Notes Item 3',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Critical single-person failure risk. Must transfer billing ownership immediately.',
    reviewed_by: 'Alex Rivera',
    reviewed_at: '2026-11-06T12:30:00Z',
    owner: 'Sarah Chen / Alex Rivera',
    event_date: '2026-11-05',
    reasoning: 'Explicitly highlighted by QA Lead Elena in executive notes.',
    exact_quote_match: true,
    match_start_idx: 645,
    match_end_idx: 763,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T12:30:00Z', action: 'APPROVED', actor: 'Alex Rivera (Project Owner)' }
    ]
  },
  {
    id: 'clm_8',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_meeting',
    source_name: 'all_hands_meeting_notes_nov.txt',
    type: 'TASK',
    statement: 'No assigned owner exists for the automated database backup verification test suite.',
    supporting_quote: 'There is currently no assigned owner for the automated database backup verification test suite.',
    source_location: 'All-Hands Meeting Notes Item 4',
    confidence: 'high',
    evidence_status: 'MISSING_EVIDENCE',
    reviewer_status: 'PENDING',
    reviewer_decision_notes: 'Missing owner! Assigning to Devon Vance upon joining.',
    reviewed_by: null,
    reviewed_at: null,
    owner: null,
    event_date: null,
    reasoning: 'Source explicitly states that no owner was assigned.',
    exact_quote_match: true,
    match_start_idx: 940,
    match_end_idx: 1037,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'FLAGGED_GAP', actor: 'Gap Detection Engine', details: 'Unassigned task detected in mission-critical backup suite' }
    ]
  },
  {
    id: 'clm_9',
    project_id: 'proj_campus_connect',
    source_id: 'src_doc_arch',
    source_name: 'architecture_decision_record_v2.md',
    type: 'NEXT_ACTION',
    statement: 'All database credentials and service keys are managed via Doppler environment manager; .env files must never be checked in.',
    supporting_quote: 'All database credentials and service keys are managed via Doppler environment manager. Do not check in .env files.',
    source_location: 'ADR 004 Section 4 (Security & Access Tokens)',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Mandatory onboarding step: invite new dev to Doppler workspace.',
    reviewed_by: 'Alex Rivera',
    reviewed_at: '2026-11-06T12:45:00Z',
    owner: 'Devon Vance',
    event_date: '2026-10-22',
    reasoning: 'Key security rule for onboarding members.',
    exact_quote_match: true,
    match_start_idx: 880,
    match_end_idx: 994,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T12:45:00Z', action: 'APPROVED', actor: 'Alex Rivera (Project Owner)' }
    ]
  },
  {
    id: 'clm_10',
    project_id: 'proj_campus_connect',
    source_id: 'src_gh_repo',
    source_name: 'github.com/campusconnect/backend-core',
    type: 'CONTACT_OR_RESOURCE',
    statement: 'Razorpay webhook signature secret is stored in Doppler vault under CAMPUS_PAY_SECRET.',
    supporting_quote: 'CRITICAL: The Razorpay webhook signature secret is stored in Doppler vault under CAMPUS_PAY_SECRET.',
    source_location: 'Pull Request #102 Description',
    confidence: 'high',
    evidence_status: 'VERIFIED',
    reviewer_status: 'APPROVED',
    reviewer_decision_notes: 'Verified location of payment webhook signature credential in Doppler.',
    reviewed_by: 'Elena Rostova',
    reviewed_at: '2026-11-06T13:00:00Z',
    owner: 'Sarah Chen',
    event_date: '2026-11-04',
    reasoning: 'Explicitly referenced secret key vault variable.',
    exact_quote_match: true,
    match_start_idx: 720,
    match_end_idx: 820,
    created_at: '2026-11-05T18:10:00Z',
    audit_history: [
      { timestamp: '2026-11-05T18:10:00Z', action: 'EXTRACTED', actor: 'Gemini 3.8 Flash Reconstructor' },
      { timestamp: '2026-11-05T18:10:02Z', action: 'VERIFIED_QUOTE', actor: 'Deterministic Verification Engine' },
      { timestamp: '2026-11-06T13:00:00Z', action: 'APPROVED', actor: 'Elena Rostova (Reviewer)' }
    ]
  }
];

export const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: 'cnf_1',
    project_id: 'proj_campus_connect',
    topic: 'Release and Production Deployment Date Discrepancy',
    claim_a_id: 'clm_5',
    claim_b_id: 'clm_6',
    explanation: 'Git commit 8f3a921 schedules rollout for December 15, 2026 (Sarah Chen tech lead schedule), while All-Hands Meeting notes by Product Manager specify December 20, 2026 (Student Union agreement).',
    status: 'UNRESOLVED'
  }
];

export const INITIAL_GAPS: GapOrMissingEvidence[] = [
  {
    id: 'gap_1',
    project_id: 'proj_campus_connect',
    title: 'Unassigned Automated Backup Verification Suite',
    description: 'No engineer is assigned to verify database automated restore drills before Sarah Chen departs.',
    category: 'UNASSIGNED_TASK',
    severity: 'CRITICAL',
    suggested_action: 'Assign to incoming engineer Devon Vance as a Week 1 priority task.',
    source_reference: 'all_hands_meeting_notes_nov.txt Item 4'
  },
  {
    id: 'gap_2',
    project_id: 'proj_campus_connect',
    title: 'GCP Production Billing Account Root Ownership',
    description: 'Single-person permission dependency on outgoing developer Sarah Chen. University SSO revocation will lock GCP console.',
    category: 'SINGLE_POINT_FAILURE',
    severity: 'CRITICAL',
    suggested_action: 'Transfer GCP Billing Admin & Organization Admin to Alex Rivera before November 15.',
    source_reference: 'All-Hands Meeting Notes Item 3'
  },
  {
    id: 'gap_3',
    project_id: 'proj_campus_connect',
    title: 'Twilio SMS Balance Failover Fallback',
    description: 'No automated fallback or recharge alert exists if Twilio credit balance drops under $50, halting student 2FA SMS.',
    category: 'SINGLE_POINT_FAILURE',
    severity: 'WARNING',
    suggested_action: 'Configure auto-recharge and secondary backup SMS provider route in Doppler.',
    source_reference: 'ADR 004 Section 2'
  }
];

export const INITIAL_HANDOVERS: Handover[] = [
  {
    id: 'hnd_dev_1',
    project_id: 'proj_campus_connect',
    version: 'v1.0-draft',
    target_role: 'DEVELOPER',
    title: 'Backend Engineering Handover - Core Services & Auth',
    summary: 'Essential architecture decisions, database models, payment webhook status, and day 1 blockers for incoming backend engineers.',
    approved_claims_count: 7,
    readiness_score: 74,
    created_by: 'Elena Rostova (Reviewer)',
    created_at: '2026-11-06T14:00:00Z',
    is_published: false,
    claims: INITIAL_CLAIMS.filter(c => ['DECISION', 'TASK', 'BLOCKER', 'DEPENDENCY', 'NEXT_ACTION'].includes(c.type)),
    acknowledgements: []
  }
];
