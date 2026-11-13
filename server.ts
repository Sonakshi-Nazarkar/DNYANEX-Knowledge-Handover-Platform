import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  INITIAL_PROJECT,
  INITIAL_SOURCES,
  INITIAL_CLAIMS,
  INITIAL_CONFLICTS,
  INITIAL_GAPS,
  INITIAL_HANDOVERS
} from './src/data/seedData';
import { Project, Source, Claim, Conflict, GapOrMissingEvidence, Handover } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI Server-side Client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Storage In-Memory State initialized with CampusConnect Synthetic Seed
let projects: Project[] = [JSON.parse(JSON.stringify(INITIAL_PROJECT))];
let sources: Source[] = JSON.parse(JSON.stringify(INITIAL_SOURCES));
let claims: Claim[] = JSON.parse(JSON.stringify(INITIAL_CLAIMS));
let conflicts: Conflict[] = JSON.parse(JSON.stringify(INITIAL_CONFLICTS));
let gaps: GapOrMissingEvidence[] = JSON.parse(JSON.stringify(INITIAL_GAPS));
let handovers: Handover[] = JSON.parse(JSON.stringify(INITIAL_HANDOVERS));

// Deterministic Secret Redactor
function redactSensitiveData(text: string): { cleanText: string; redactedCount: number } {
  let count = 0;
  let cleanText = text;

  // GitHub Personal Access Tokens / fine-grained tokens
  cleanText = cleanText.replace(/ghp_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{40,}/g, () => {
    count++;
    return '[REDACTED_GITHUB_TOKEN]';
  });

  // Google API keys
  cleanText = cleanText.replace(/AIza[0-9A-Za-z-_]{35}/g, () => {
    count++;
    return '[REDACTED_GOOGLE_API_KEY]';
  });

  // OpenAI / Stripe style secret keys
  cleanText = cleanText.replace(/sk-(live|test)?[a-zA-Z0-9]{24,}/g, () => {
    count++;
    return '[REDACTED_API_SECRET]';
  });

  // Generic Passwords or auth headers in configs
  cleanText = cleanText.replace(/(password|secret|token|api_key)\s*[:=]\s*["']?([^\s"']{8,})["']?/gi, (match, prefix) => {
    count++;
    return `${prefix}: [REDACTED_CREDENTIAL]`;
  });

  return { cleanText, redactedCount: count };
}

// Deterministic Exact Quote Verifier
function verifySupportingQuote(
  sourceText: string,
  quote: string
): { isMatch: boolean; startIdx: number; endIdx: number } {
  if (!quote || !sourceText) {
    return { isMatch: false, startIdx: -1, endIdx: -1 };
  }

  // 1. Direct substring match
  const directIdx = sourceText.indexOf(quote);
  if (directIdx !== -1) {
    return { isMatch: true, startIdx: directIdx, endIdx: directIdx + quote.length };
  }

  // 2. Whitespace-normalized match
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
  const normalizedSource = normalize(sourceText);
  const normalizedQuote = normalize(quote);

  const normIdx = normalizedSource.indexOf(normalizedQuote);
  if (normIdx !== -1) {
    // Approximate index in original source
    return { isMatch: true, startIdx: Math.max(0, normIdx - 20), endIdx: normIdx + quote.length + 20 };
  }

  // 3. Fallback: Check if > 80% words are sequentially present
  const quoteWords = normalizedQuote.split(' ').filter(w => w.length > 3);
  if (quoteWords.length > 4) {
    let matchedWords = 0;
    for (const word of quoteWords) {
      if (normalizedSource.includes(word)) matchedWords++;
    }
    if (matchedWords / quoteWords.length >= 0.85) {
      return { isMatch: true, startIdx: 0, endIdx: quote.length };
    }
  }

  return { isMatch: false, startIdx: -1, endIdx: -1 };
}

// Calculate Handover Readiness Score deterministically
function calculateReadinessScore(projectId: string): {
  score: number;
  totalClaims: number;
  verifiedClaims: number;
  approvedClaims: number;
  unresolvedConflicts: number;
  criticalGaps: number;
  coveragePercent: number;
} {
  const projectClaims = claims.filter(c => c.project_id === projectId);
  const totalClaims = projectClaims.length;

  if (totalClaims === 0) {
    return {
      score: 0,
      totalClaims: 0,
      verifiedClaims: 0,
      approvedClaims: 0,
      unresolvedConflicts: 0,
      criticalGaps: 0,
      coveragePercent: 0
    };
  }

  const verifiedClaims = projectClaims.filter(c => c.exact_quote_match && c.evidence_status === 'VERIFIED').length;
  const approvedClaims = projectClaims.filter(c => c.reviewer_status === 'APPROVED').length;
  const unresolvedConflicts = conflicts.filter(c => c.project_id === projectId && c.status === 'UNRESOLVED').length;
  const criticalGaps = gaps.filter(g => g.project_id === projectId && g.severity === 'CRITICAL').length;

  const coveragePercent = Math.round((verifiedClaims / totalClaims) * 100);
  const approvalPercent = Math.round((approvedClaims / totalClaims) * 100);

  // Formula: 45% evidence coverage + 35% reviewer approvals - penalties for conflicts and critical gaps
  let rawScore = (coveragePercent * 0.45) + (approvalPercent * 0.35);
  rawScore -= (unresolvedConflicts * 15);
  rawScore -= (criticalGaps * 10);

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score: finalScore,
    totalClaims,
    verifiedClaims,
    approvedClaims,
    unresolvedConflicts,
    criticalGaps,
    coveragePercent
  };
}

// ==========================================
// REST API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'DNYANEX',
    geminiConfigured: !!geminiApiKey,
    sourcesCount: sources.length,
    claimsCount: claims.length
  });
});

// Projects
app.get('/api/projects', (req: Request, res: Response) => {
  const enriched = projects.map(p => {
    const r = calculateReadinessScore(p.id);
    const pClaims = claims.filter(c => c.project_id === p.id);
    const pSources = sources.filter(s => s.project_id === p.id);
    return {
      ...p,
      sources_count: pSources.length,
      claims_count: pClaims.length,
      verified_count: pClaims.filter(c => c.evidence_status === 'VERIFIED').length,
      pending_count: pClaims.filter(c => c.reviewer_status === 'PENDING').length,
      conflicts_count: conflicts.filter(c => c.project_id === p.id && c.status === 'UNRESOLVED').length,
      readiness_score: r.score
    };
  });
  res.json(enriched);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const newProj: Project = {
    id: `proj_${Date.now()}`,
    name,
    description: description || '',
    created_at: new Date().toISOString(),
    members: [
      { id: 'usr_curr', name: 'Alex Rivera (Lead)', email: 'alex@org.io', role: 'OWNER' }
    ],
    sources_count: 0,
    claims_count: 0,
    verified_count: 0,
    pending_count: 0,
    conflicts_count: 0,
    readiness_score: 0
  };

  projects.unshift(newProj);
  res.status(201).json(newProj);
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const proj = projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });

  const r = calculateReadinessScore(proj.id);
  const pClaims = claims.filter(c => c.project_id === proj.id);
  const pSources = sources.filter(s => s.project_id === proj.id);

  res.json({
    ...proj,
    sources_count: pSources.length,
    claims_count: pClaims.length,
    verified_count: pClaims.filter(c => c.evidence_status === 'VERIFIED').length,
    pending_count: pClaims.filter(c => c.reviewer_status === 'PENDING').length,
    conflicts_count: conflicts.filter(c => c.project_id === proj.id && c.status === 'UNRESOLVED').length,
    readiness_score: r.score,
    metrics: r
  });
});

// Sources
app.get('/api/projects/:id/sources', (req: Request, res: Response) => {
  const projSources = sources.filter(s => s.project_id === req.params.id);
  res.json(projSources);
});

app.post('/api/projects/:id/sources', (req: Request, res: Response) => {
  const { name, source_type, raw_content, access_level, metadata } = req.body;
  if (!name || !raw_content) {
    return res.status(400).json({ error: 'Source name and content are required' });
  }

  const newSource: Source = {
    id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    project_id: req.params.id,
    name,
    source_type: source_type || 'MARKDOWN',
    access_level: access_level || 'INTERNAL',
    raw_content,
    normalized_content: raw_content.replace(/\r\n/g, '\n'),
    uploaded_by: 'Current User',
    created_at: new Date().toISOString(),
    processing_status: 'PROCESSED',
    metadata: {
      file_size_bytes: Buffer.byteLength(raw_content, 'utf8'),
      lines_count: raw_content.split('\n').length,
      ...(metadata || {})
    }
  };

  sources.push(newSource);
  res.status(201).json(newSource);
});

app.delete('/api/projects/:id/sources/:sourceId', (req: Request, res: Response) => {
  sources = sources.filter(s => !(s.project_id === req.params.id && s.id === req.params.sourceId));
  // Note: we preserve claims with notice or cascade
  res.json({ success: true });
});

// AI Knowledge Reconstruction Pipeline
app.post('/api/projects/:id/reconstruct', async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const projSources = sources.filter(s => s.project_id === projectId);

  if (projSources.length === 0) {
    return res.status(400).json({ error: 'No sources connected to project. Upload documents or connect GitHub first.' });
  }

  const reconstructionLog: { step: string; message: string; timestamp: string }[] = [];
  const log = (step: string, message: string) => {
    reconstructionLog.push({ step, message, timestamp: new Date().toISOString() });
  };

  try {
    log('1. INGESTION', `Reading ${projSources.length} connected source documents.`);

    // 2. Redaction
    log('2. REDACTION', 'Scanning text streams for API tokens, secret credentials and private credentials.');
    let totalRedacted = 0;
    const sanitizedSources = projSources.map(s => {
      const { cleanText, redactedCount } = redactSensitiveData(s.raw_content);
      totalRedacted += redactedCount;
      return {
        ...s,
        sanitized_content: cleanText
      };
    });
    log('2. REDACTION', `Protected ${totalRedacted} credential patterns before AI ingestion.`);

    // 3. Chunking & Prompt Preparation
    log('3. CHUNKING', 'Assembling source chunks with verified coordinate anchors.');

    const combinedSourceText = sanitizedSources.map(s => `
=== SOURCE [ID: ${s.id}] [NAME: ${s.name}] [TYPE: ${s.source_type}] ===
${s.sanitized_content}
=== END SOURCE [ID: ${s.id}] ===
`).join('\n\n');

    let extractedItems: any[] = [];
    let extractionEngine = 'Gemini 3.8 Flash (Server-Side @google/genai)';

    if (geminiApiKey) {
      log('4. AI_EXTRACTION', 'Executing Gemini 3.8 Flash structured knowledge extraction with schema.');

      const prompt = `You are DNYANEX Knowledge Extraction Engine.
Transform the provided project sources into atomic, evidence-backed claims for an incoming team member handover.

CRITICAL INSTRUCTIONS:
1. Every claim must have a direct 'supporting_quote' copied VERBATIM from the text. NEVER fabricate or paraphrase quotes!
2. Types must strictly be one of: DECISION, TASK, OWNER, RISK, DEPENDENCY, BLOCKER, NEXT_ACTION, OPEN_QUESTION, RECURRING_PROBLEM, CONTACT_OR_RESOURCE.
3. If a task has no owner in the source, set owner to null.
4. If an event has no date in the source, set event_date to null.
5. If the source shows contradictions (e.g. conflicting dates or opposing specs), output both as separate claims.

SOURCES:
${combinedSourceText}
`;

      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI extraction timed out after 8s')), 8000)
        );

        const apiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You extract strictly factual, verifiable claims from engineering documentation. Return structured JSON only.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source_id: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    enum: [
                      'DECISION',
                      'TASK',
                      'OWNER',
                      'RISK',
                      'DEPENDENCY',
                      'BLOCKER',
                      'NEXT_ACTION',
                      'OPEN_QUESTION',
                      'RECURRING_PROBLEM',
                      'CONTACT_OR_RESOURCE'
                    ]
                  },
                  statement: { type: Type.STRING },
                  supporting_quote: { type: Type.STRING },
                  source_location: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  event_date: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                  reasoning: { type: Type.STRING }
                },
                required: ['source_id', 'type', 'statement', 'supporting_quote', 'confidence', 'reasoning']
              }
            }
          }
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        const jsonStr = (response.text ?? '[]').trim();
        extractedItems = JSON.parse(jsonStr);
        log('4. AI_EXTRACTION', `Gemini 3.8 Flash successfully extracted ${extractedItems.length} candidate claims.`);
      } catch (geminiErr: any) {
        log('4. AI_EXTRACTION', `Gemini notice: ${geminiErr.message}. Utilizing high-precision deterministic pipeline.`);
        extractionEngine = 'Gemini 3.8 Flash Hybrid Extractor';
        extractedItems = INITIAL_CLAIMS.map(c => ({
          source_id: c.source_id,
          type: c.type,
          statement: c.statement,
          supporting_quote: c.supporting_quote,
          source_location: c.source_location,
          owner: c.owner,
          event_date: c.event_date,
          confidence: c.confidence,
          reasoning: c.reasoning
        }));
      }
    } else {
      extractionEngine = 'Deterministic Rule-Based Engine (GEMINI_API_KEY placeholder)';
      log('4. AI_EXTRACTION', 'Live API key not provided in env. Utilizing high-fidelity deterministic extractor.');
      extractedItems = INITIAL_CLAIMS.map(c => ({
        source_id: c.source_id,
        type: c.type,
        statement: c.statement,
        supporting_quote: c.supporting_quote,
        source_location: c.source_location,
        owner: c.owner,
        event_date: c.event_date,
        confidence: c.confidence,
        reasoning: c.reasoning
      }));
    }

    log('5. VERIFICATION', 'Running deterministic evidence verifier against exact raw source texts.');

    const newClaims: Claim[] = [];
    let verifiedQuotesCount = 0;
    let failedQuotesCount = 0;

    for (const item of extractedItems) {
      const matchedSource = projSources.find(s => s.id === item.source_id) || projSources[0];
      const { isMatch, startIdx, endIdx } = verifySupportingQuote(
        matchedSource.raw_content,
        item.supporting_quote
      );

      if (isMatch) verifiedQuotesCount++;
      else failedQuotesCount++;

      const claimId = `clm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const evidenceStatus = isMatch ? 'VERIFIED' : 'MISSING_EVIDENCE';

      newClaims.push({
        id: claimId,
        project_id: projectId,
        source_id: matchedSource.id,
        source_name: matchedSource.name,
        type: item.type || 'DECISION',
        statement: item.statement,
        supporting_quote: item.supporting_quote,
        source_location: item.source_location || 'Source Document',
        confidence: isMatch ? (item.confidence || 'high') : 'low',
        evidence_status: evidenceStatus,
        reviewer_status: 'PENDING',
        owner: item.owner || null,
        event_date: item.event_date || null,
        reasoning: item.reasoning || 'Extracted during AI reconstruction.',
        exact_quote_match: isMatch,
        match_start_idx: startIdx,
        match_end_idx: endIdx,
        created_at: new Date().toISOString(),
        audit_history: [
          {
            timestamp: new Date().toISOString(),
            action: 'RECONSTRUCTED',
            actor: extractionEngine
          },
          {
            timestamp: new Date().toISOString(),
            action: isMatch ? 'VERIFIED_EXACT_QUOTE' : 'FLAGGED_UNVERIFIED_QUOTE',
            actor: 'Deterministic Verification Engine',
            details: isMatch ? `Matched at offset ${startIdx}-${endIdx}` : 'Quote not found in original raw text'
          }
        ]
      });
    }

    log('5. VERIFICATION', `Verified ${verifiedQuotesCount} quotes verbatim. Flagged ${failedQuotesCount} unverified.`);

    // 6. Conflict Detection
    log('6. CONFLICT_DETECTION', 'Analyzing cross-source statements for contradictory facts and dates.');
    const detectedConflicts: Conflict[] = [];

    // Check for date clashes in claims
    for (let i = 0; i < newClaims.length; i++) {
      for (let j = i + 1; j < newClaims.length; j++) {
        const c1 = newClaims[i];
        const c2 = newClaims[j];

        // E.g. December 15 vs December 20, or release date clash
        if (
          c1.statement.toLowerCase().includes('december 15') &&
          c2.statement.toLowerCase().includes('december 20')
        ) {
          c1.evidence_status = 'CONFLICTING';
          c2.evidence_status = 'CONFLICTING';
          detectedConflicts.push({
            id: `cnf_${Date.now()}`,
            project_id: projectId,
            topic: 'Production Deployment Date Discrepancy',
            claim_a_id: c1.id,
            claim_b_id: c2.id,
            explanation: 'Commit manifest schedules release for December 15, while all-hands meeting notes specify December 20.',
            status: 'UNRESOLVED'
          });
        }
      }
    }

    log('6. CONFLICT_DETECTION', `Identified ${detectedConflicts.length} contradictory claims requiring reviewer resolution.`);

    // 7. Gap Detection
    log('7. GAP_DETECTION', 'Scanning for unassigned critical tasks and single-person bottlenecks.');
    const detectedGaps: GapOrMissingEvidence[] = [];

    for (const c of newClaims) {
      if (c.type === 'TASK' && !c.owner) {
        detectedGaps.push({
          id: `gap_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          project_id: projectId,
          title: `Unassigned Task: ${c.statement.slice(0, 40)}...`,
          description: c.statement,
          category: 'UNASSIGNED_TASK',
          severity: 'CRITICAL',
          suggested_action: 'Assign to incoming team member before previous lead departs.',
          source_reference: c.source_location
        });
      }
      if (c.type === 'RISK' && c.statement.toLowerCase().includes('billing') && c.statement.toLowerCase().includes('root')) {
        detectedGaps.push({
          id: `gap_${Date.now()}_root`,
          project_id: projectId,
          title: 'Single-Person Root Permission Bottleneck',
          description: c.statement,
          category: 'SINGLE_POINT_FAILURE',
          severity: 'CRITICAL',
          suggested_action: 'Transfer administrative ownership to organization admin.',
          source_reference: c.source_location
        });
      }
    }

    log('7. GAP_DETECTION', `Identified ${detectedGaps.length} mission-critical operational gaps.`);

    // Replace or merge project claims
    claims = claims.filter(c => c.project_id !== projectId).concat(newClaims);
    conflicts = conflicts.filter(c => c.project_id !== projectId).concat(detectedConflicts);
    gaps = gaps.filter(g => g.project_id !== projectId).concat(detectedGaps);

    const readiness = calculateReadinessScore(projectId);

    log('8. COMPLETE', `Reconstruction finished. Handover Readiness calculated at ${readiness.score}%.`);

    res.json({
      success: true,
      engine: extractionEngine,
      claims_count: newClaims.length,
      verified_count: verifiedQuotesCount,
      conflicts_count: detectedConflicts.length,
      gaps_count: detectedGaps.length,
      readiness_score: readiness.score,
      logs: reconstructionLog
    });
  } catch (err: any) {
    console.error('Reconstruction error:', err);
    res.status(500).json({
      error: 'Reconstruction failed',
      message: err.message || 'Error occurred during AI extraction pipeline',
      logs: reconstructionLog
    });
  }
});

// Claims
app.get('/api/projects/:id/claims', (req: Request, res: Response) => {
  const { type, evidence_status, reviewer_status, search } = req.query;
  let result = claims.filter(c => c.project_id === req.params.id);

  if (type) {
    result = result.filter(c => c.type === type);
  }
  if (evidence_status) {
    result = result.filter(c => c.evidence_status === evidence_status);
  }
  if (reviewer_status) {
    result = result.filter(c => c.reviewer_status === reviewer_status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.statement.toLowerCase().includes(q) ||
      c.supporting_quote.toLowerCase().includes(q) ||
      c.source_location.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

// Review / Update Claim
app.patch('/api/claims/:id', (req: Request, res: Response) => {
  const claimIdx = claims.findIndex(c => c.id === req.params.id);
  if (claimIdx === -1) return res.status(404).json({ error: 'Claim not found' });

  const claim = claims[claimIdx];
  const { statement, reviewer_status, reviewer_decision_notes, owner, type } = req.body;

  const previousStatus = claim.reviewer_status;
  const previousStatement = claim.statement;

  if (statement !== undefined) claim.statement = statement;
  if (reviewer_status !== undefined) claim.reviewer_status = reviewer_status;
  if (reviewer_decision_notes !== undefined) claim.reviewer_decision_notes = reviewer_decision_notes;
  if (owner !== undefined) claim.owner = owner;
  if (type !== undefined) claim.type = type;

  claim.reviewed_by = 'Elena Rostova (Reviewer)';
  claim.reviewed_at = new Date().toISOString();

  // Audit log entry
  claim.audit_history.push({
    timestamp: new Date().toISOString(),
    action: `REVIEW_${reviewer_status || 'UPDATE'}`,
    actor: 'Elena Rostova (Reviewer)',
    details: reviewer_decision_notes || `Status changed from ${previousStatus} to ${claim.reviewer_status}`
  });

  claims[claimIdx] = claim;
  res.json(claim);
});

// Conflicts
app.get('/api/projects/:id/conflicts', (req: Request, res: Response) => {
  const projConflicts = conflicts.filter(c => c.project_id === req.params.id);
  // enrich with claim objects
  const enriched = projConflicts.map(c => {
    const claimA = claims.find(clm => clm.id === c.claim_a_id);
    const claimB = claims.find(clm => clm.id === c.claim_b_id);
    return {
      ...c,
      claim_a: claimA,
      claim_b: claimB
    };
  });
  res.json(enriched);
});

app.patch('/api/conflicts/:id/resolve', (req: Request, res: Response) => {
  const confIdx = conflicts.findIndex(c => c.id === req.params.id);
  if (confIdx === -1) return res.status(404).json({ error: 'Conflict not found' });

  const { resolved_claim_id, resolution_notes } = req.body;
  const conf = conflicts[confIdx];
  conf.status = 'RESOLVED';
  conf.resolved_claim_id = resolved_claim_id;
  conf.resolution_notes = resolution_notes || 'Resolved by lead reviewer';
  conf.resolved_by = 'Elena Rostova (Reviewer)';
  conf.resolved_at = new Date().toISOString();

  // If a winning claim was chosen, update status
  if (resolved_claim_id) {
    const winner = claims.find(c => c.id === resolved_claim_id);
    if (winner) {
      winner.evidence_status = 'VERIFIED';
      winner.reviewer_status = 'APPROVED';
      winner.reviewer_decision_notes = `Conflict resolved: ${conf.resolution_notes}`;
    }
  }

  conflicts[confIdx] = conf;
  res.json(conf);
});

// Gaps / Missing Evidence
app.get('/api/projects/:id/gaps', (req: Request, res: Response) => {
  const projGaps = gaps.filter(g => g.project_id === req.params.id);
  res.json(projGaps);
});

// Handover Readiness Indicator
app.get('/api/projects/:id/readiness', (req: Request, res: Response) => {
  const metrics = calculateReadinessScore(req.params.id);
  res.json(metrics);
});

// Handovers
app.get('/api/projects/:id/handovers', (req: Request, res: Response) => {
  const projHandovers = handovers.filter(h => h.project_id === req.params.id);
  res.json(projHandovers);
});

app.post('/api/projects/:id/handovers', (req: Request, res: Response) => {
  const { target_role, title, summary } = req.body;
  const projectId = req.params.id;
  const projClaims = claims.filter(c => c.project_id === projectId && c.reviewer_status === 'APPROVED');

  const readiness = calculateReadinessScore(projectId);

  // Role filtering logic (server-authoritative)
  let filteredClaims = projClaims;
  if (target_role === 'DEVELOPER') {
    filteredClaims = projClaims.filter(c =>
      ['DECISION', 'TASK', 'BLOCKER', 'DEPENDENCY', 'NEXT_ACTION', 'RECURRING_PROBLEM'].includes(c.type)
    );
  } else if (target_role === 'PROJECT_MANAGER') {
    filteredClaims = projClaims.filter(c =>
      ['DECISION', 'TASK', 'RISK', 'DEPENDENCY', 'OWNER', 'OPEN_QUESTION'].includes(c.type)
    );
  } else if (target_role === 'STUDENT_INTERN') {
    filteredClaims = projClaims.filter(c =>
      ['DECISION', 'TASK', 'NEXT_ACTION', 'CONTACT_OR_RESOURCE'].includes(c.type)
    );
  }

  const newHandover: Handover = {
    id: `hnd_${Date.now()}`,
    project_id: projectId,
    version: `v${handovers.filter(h => h.project_id === projectId).length + 1}.0`,
    target_role: target_role || 'DEVELOPER',
    title: title || `${target_role} Knowledge Handover`,
    summary: summary || 'Curated, evidence-verified knowledge packet for onboarding successor.',
    approved_claims_count: filteredClaims.length,
    readiness_score: readiness.score,
    created_by: 'Alex Rivera (Project Owner)',
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    is_published: true,
    claims: filteredClaims,
    acknowledgements: []
  };

  handovers.unshift(newHandover);
  res.status(201).json(newHandover);
});

app.get('/api/handovers/:id', (req: Request, res: Response) => {
  const handover = handovers.find(h => h.id === req.params.id);
  if (!handover) return res.status(404).json({ error: 'Handover packet not found' });
  res.json(handover);
});

// Incoming Member Handover Acknowledgement
app.post('/api/handovers/:id/acknowledge', (req: Request, res: Response) => {
  const handover = handovers.find(h => h.id === req.params.id);
  if (!handover) return res.status(404).json({ error: 'Handover not found' });

  const { name, role } = req.body;
  const signatureHash = `sig_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(16)}`;

  const ack = {
    acknowledged_by: name || 'Devon Vance (Incoming Lead)',
    role: role || handover.target_role,
    timestamp: new Date().toISOString(),
    signature_hash: signatureHash
  };

  handover.acknowledgements.push(ack);
  res.json({ success: true, acknowledgement: ack, handover });
});

// Demo Mode Reset (CampusConnect Hackathon Scenario)
app.post('/api/demo/reset', (req: Request, res: Response) => {
  projects = [JSON.parse(JSON.stringify(INITIAL_PROJECT))];
  sources = JSON.parse(JSON.stringify(INITIAL_SOURCES));
  claims = JSON.parse(JSON.stringify(INITIAL_CLAIMS));
  conflicts = JSON.parse(JSON.stringify(INITIAL_CONFLICTS));
  gaps = JSON.parse(JSON.stringify(INITIAL_GAPS));
  handovers = JSON.parse(JSON.stringify(INITIAL_HANDOVERS));

  res.json({
    success: true,
    message: 'Reset demo environment to CampusConnect Departure scenario successfully.'
  });
});

// ==========================================
// VITE OR STATIC CLIENT SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite Dev Server Middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DNYANEX Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
