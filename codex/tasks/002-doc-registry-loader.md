Task: Implement deterministic doc registry loader

Scope:
- Repo: AIMAS-UI only
- Read markdown/mdx/txt/json/yaml from vendor/aimas (RFC, schemas, conformance, compliance, docs, meta files)

Requirements:
- Output typed registry with slug, section, toc, sourcePath
- Enforce zero-drift (throw if required dirs/files missing)
- Provide helper to override root via AIMAS_DOCS_PATH

Output:
- File diffs only
- No prose
