Task: Route docs via /docs and /docs/[...slug]

Scope:
- Repo: AIMAS-UI only
- Use registry to statically generate doc pages

Requirements:
- /docs index grouped by section metadata
- /docs/[...slug] renders markdown + TOC + source location
- No other routes serve docs

Output:
- File diffs only
- No prose
