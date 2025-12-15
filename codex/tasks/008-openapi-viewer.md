Task: Render AIMAS OpenAPI spec on /api

Scope:
- Repo: AIMAS-UI only
- Consume vendor/aimas/openapi.yaml|yml|json via loader

Requirements:
- Show source filename + format + readonly body
- Fail build if spec missing (unless env override provided)
- Never mutate spec content client-side

Output:
- File diffs only
- No prose
