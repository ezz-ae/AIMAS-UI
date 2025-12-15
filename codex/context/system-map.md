System Map
----------
AIMAS (authority)
  → defines math, schemas, RFCs, invariants, OpenAPI specs.
  → append-only, deterministic, zero UI assumptions.

AIMAS-UI (surface)
  → renders AIMAS artifacts read-only (docs, OpenAPI viewer, search, dashboards).
  → provides Landing → Search → System flow; never alters protocol output.

Cloud / Deployment
  → Cloud Run hosts AIMAS API; Vercel hosts AIMAS-UI.
  → Submodules or AIMAS_DOCS_PATH feed UI from AIMAS.

Codex
  → Landscaper executing scripted tasks.
  → Enforces rules before touching either repo.
  → Outputs diffs only, never prose, when running tasks.
