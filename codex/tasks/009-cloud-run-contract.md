# Task 009 — Cloud Run Contract (AIMAS API)

Goal:
- Ensure Cloud Run service returns deterministic responses and exposes health endpoints.
- Match OpenAPI paths exactly.

Scope:
- Repo: AIMAS only (apps/api, openapi spec, cloudrun docs).

Required routes:
- GET /healthz -> 200 { ok: true }
- GET /livez -> 200 { ok: true }
- GET /readyz -> 200 { ok: true }
- GET / -> 200 { service, protocol_version }
- GET /v1/schemas
- POST /v1/intent
- POST /v1/fit/{intent_id}
- POST /v1/conformance/validate
- GET /openapi.yaml (or /openapi.json)

Non-negotiable:
- No raw L0 persistence
- No L0 logging
- Any payload with raw text fields is rejected
- OpenAPI servers list must include the deployed Cloud Run URL

Acceptance:
- curl /healthz /livez /readyz returns 200
- curl /openapi.yaml returns 200
- UI can call API with CORS configured via env vars
