# Task 012 — Wire AIMAS-UI to AIMAS API

Goal:
- `/system` performs the full protocol handshake using the real AIMAS API.

Flow:
1. User declares raw intent on `/system` (or landing).
2. UI calls `/api/adapter/normalize` → receives feature-only capsule.
3. UI calls `POST ${NEXT_PUBLIC_AIMAS_API_BASE}/v1/intent` with that capsule → receives `intent_id`.
4. UI calls `POST ${NEXT_PUBLIC_AIMAS_API_BASE}/v1/fit/{intent_id}` → receives Fit Matrix.
5. UI renders Fit Matrix + paths (must highlight Free Baseline Path).
6. If any step fails, degrade gracefully with deterministic demo output + clear status messaging.

Constraints:
- No protocol math in UI (display only).
- No client exposure of `OPENAI_API_KEY`.
- `/system` must work with the Cloud Run base URL in `.env.local`.
- API status indicator (ShellLayout) should reflect the Cloud Run root availability.

Acceptance:
- End-to-end works against `https://aimas-api-936759581716.us-central1.run.app`.
- When API down, UI shows “unavailable” state but still renders demo Fit Matrix.
- Landing `/` routes directly to `/system?q=...`.
