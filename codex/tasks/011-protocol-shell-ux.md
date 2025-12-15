Task: Protocol Shell UX + API binding

Goal:
- / is search-only landing (routes intent to /system)
- /system uses ShellLayout (sidebar + topbar + status) and pre-fills intake from `q`
- "Compute Fit Matrix" calls `POST ${NEXT_PUBLIC_AIMAS_API_BASE}/fit` with `{ intent }`, demo fallback on failure
- /docs/* renders inside ShellLayout (canonical docs feed only)
- /api renders OpenAPI from authority (with curl copy snippets referencing base URL)
- Top bar shows API status via `GET ${NEXT_PUBLIC_AIMAS_API_BASE}/`
- Dark theme across shell

Constraints:
- No protocol logic inside AIMAS-UI
- No duplication of docs or specs
- Routes frozen: `/`, `/system`, `/docs/*`, `/api` (search helper allowed but not primary entry)
- Read-only Cloud Run binding (no mutation beyond fit computation request)

Steps:
1. Create `components/shell/ShellLayout.tsx` with sidebar + topbar + slot + status indicator.
2. Update `/system` page to use ShellLayout and wire API call + fallback demo.
3. Update landing `app/page.tsx` + `GateSearch` to push `/system?q=...` only.
4. Wrap `/docs` index + doc detail pages with ShellLayout.
5. Enhance `/api` page with OpenAPI viewer + copyable curl snippets referencing `NEXT_PUBLIC_AIMAS_API_BASE`.
6. Add `.env.example` documenting `NEXT_PUBLIC_AIMAS_API_BASE` and `AIMAS_DOCS_PATH`.
7. Add topbar status box pinging the API base.
8. Ensure build stays static for docs/shell (no dynamic doc rendering outside `/system`).

Output: file diffs only (AIMAS-UI repo).
