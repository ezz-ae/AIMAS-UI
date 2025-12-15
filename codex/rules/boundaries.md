Repository boundaries:

/AIMAS
- Deterministic protocol only
- Schemas, math, invariants
- OpenAPI specs
- No UI
- No framework assumptions

/AIMAS-UI
- Read-only rendering
- Documentation surface
- Search → System → Response experience
- No business logic
- No scoring
- No memory

Cross-repo duplication is forbidden.
Docs flow from AIMAS → AIMAS-UI only.
