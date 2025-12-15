# Adapters: OpenAI (Non-Foundational)

OpenAI is an optional adapter layer. It may only perform deterministic-ish normalization from raw text (L0) to feature-only capsule (L1).

Forbidden:
- Fit Matrix computation
- Confidence, probability, ETA generation
- Path pricing, guarantees, or persuasion language
- Ranking, recommendation, nudging, optimization heuristics
- Storing raw user text (L0) anywhere (DB, logs, analytics)

Allowed:
- Convert raw text → feature-only Intent Capsule fields:
  capsule_type, normalized_intent, sensitivity, derived_tags, context_vectors
- Return JSON only (strict schema)
- Enforce "no raw archival" by construction:
  - Do not log raw input
  - Do not persist raw input
  - Do not attach raw input to errors

AIMAS protocol must work fully without OpenAI.
UI may use OpenAI only via a server-side route (never client-side key exposure).
