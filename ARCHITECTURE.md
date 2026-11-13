# DNYANEX System Architecture & Security Model

## 1. High-Level Architecture

DNYANEX operates as a full-stack platform separating raw, untrusted source ingestion from verified organizational knowledge.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  - Split-Screen Claim Ledger with dynamic substring coordinate highlight          |
|  - Human Review Desk & Contradiction Resolution Workbench                         |
|  - Role Switcher (Owner, Reviewer, Incoming Member)                               |
|  - Judge Guided Stepper & Demo Reset                                              |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | JSON over HTTP
                                          v
+-----------------------------------------------------------------------------------+
|                                 SERVER LAYER                                      |
|  - Ingestion Engine: Normalizes GitHub issues/PRs/commits & uploaded documents    |
|  - Pre-LLM Regex Redactor: Masks API keys, tokens, Doppler credentials            |
|  - Gemini 3.8 Flash Client: Server-side @google/genai structured extraction       |
|  - Deterministic Verification Engine: String matching algorithm on raw source     |
|  - Conflict & Gap Detector: Cross-document contradictory fact pairing             |
|  - Handover Readiness Calculator: Mathematical index (coverage, approvals, gaps)  |
|  - RBAC & Role Filtering: Server-authoritative data scoping                       |
+-----------------------------------------------------------------------------------+
```

## 2. Deterministic Verification vs AI Assurance

Unlike standard generative AI wrappers that ask the LLM: *"Did you check your work?"*, DNYANEX uses a deterministic code verification algorithm:

```typescript
function verifySupportingQuote(sourceText: string, quote: string) {
  // 1. Direct exact character index check
  const directIdx = sourceText.indexOf(quote);
  if (directIdx !== -1) {
    return { isMatch: true, startIdx: directIdx, endIdx: directIdx + quote.length };
  }
  // 2. Whitespace-normalized comparison
  // 3. Fallback sequential token boundary match
}
```

If the supporting quote is not found verbatim in the original source, the claim is rejected or demoted to `MISSING_EVIDENCE`.

## 3. Handover Readiness Metric Formula

$$
\text{Readiness Score} = (\text{Coverage} \times 0.45) + (\text{Approvals} \times 0.35) - (\text{Conflicts} \times 15) - (\text{Critical Gaps} \times 10)
$$

A handover cannot be published if unresolved contradictory facts remain.

## 4. Security & Privacy Safeguards

- Zero browser exposure of `GEMINI_API_KEY` or third-party tokens.
- Secret redaction before LLM dispatch.
- Audit history recording actor, action, previous value, and timestamp.
- Tamper-resistant acknowledgement hash upon successor signoff.
