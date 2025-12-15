---
title: "API Reference"
subtitle: "Minimal deterministic interface."
---


Set `NEXT_PUBLIC_AIMAS_API_URL` to your Cloud Run service.

### POST /v1/intent
Request:
```json
{ "intent": "..." }
```
Response:
```json
{ "fit_matrix": { "eta_minutes": 42, "probability": 0.81, "confidence": 0.74, "sensitivity": "medium", "paths": [] } }
```

