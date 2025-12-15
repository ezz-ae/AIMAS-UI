# Task 010 — CI Guardrails (No Drift, No Leakage)

Goal:
- Prevent boundary violations, leakage, and secret exposure across AIMAS + AIMAS-UI.

Scope:
- AIMAS + AIMAS-UI repos (workflows + scripts only).

Requirements:
AIMAS:
- CI verifies OpenAPI exists.
- CI checks health/ready/live routes respond (curl against dev server).
- Ensure no UI/framework deps creep into package.json.

AIMAS-UI:
- CI runs `pnpm docs:verify`, `pnpm lint`, `pnpm build`.
- Fail if docs source or search index missing.
- Fail if any tracked file contains an OpenAI secret pattern (`sk-...`).
- Ensure OpenAI adapter code is server-only (no `OPENAI_API_KEY` in client bundles).

Acceptance:
- GitHub Actions workflow blocks PR/merge on violation.
- Guard scripts live in repo (no manual steps).
