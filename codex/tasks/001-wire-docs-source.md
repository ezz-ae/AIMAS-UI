Task: Wire AIMAS authority repo into AIMAS-UI

Scope:
- Repo: AIMAS-UI only
- Introduce vendor/aimas submodule
- Allow AIMAS_DOCS_PATH override (absolute or relative)

Requirements:
- Build fails if neither vendor/aimas nor override path exists
- No content duplication inside AIMAS-UI
- Document env usage in README

Output:
- File diffs only
- No prose
