Task: Build MiniSearch index over AIMAS docs

Scope:
- Repo: AIMAS-UI only
- Use registry output as source

Requirements:
- Runtime loader for dev, serialized index for prod builds
- Search covers titles, headings, bodies; links back to /docs routes
- Provide `pnpm docs:verify` + build step that fails if registry empty

Output:
- File diffs only
- No prose
