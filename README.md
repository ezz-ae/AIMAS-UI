# AIMAS Protocol UI

Read-only surface that renders canonical AIMAS documentation straight from the authority repo. Landing is search-only, `/search` handles intent input, `/system` visualizes the Input → Capsule → Fit Matrix → Paths chain, and `/api` shows the OpenAPI artifact if it exists.

## Source of truth

Docs never live in this repo. By default the UI consumes the `vendor/aimas` git submodule. In development you can point to any checkout via `AIMAS_DOCS_PATH`.

```bash
# clone + install deps
pnpm install

# make sure the authority submodule is present
git submodule update --init --recursive

# optional: override doc path (absolute or relative)
export AIMAS_DOCS_PATH=../AIMAS
```

`pnpm docs:verify` fails fast if the authority repo is missing, sections are empty, the registry could not be built, or the OpenAPI spec is absent. (Set `AIMAS_ALLOW_MISSING_OPENAPI=1` only when you intentionally want to skip the spec check.)

## Local development

```bash
pnpm docs:verify   # ensure vendor/aimas (or AIMAS_DOCS_PATH) is readable
pnpm dev           # Next dev server, builds MiniSearch index at runtime
```

## Production build

`pnpm build` first runs `tsx scripts/build-search.ts` to create `public/search-index.json`, then executes `next build`. The build fails if the docs registry is empty or the submodule is missing.

## Deployment notes

- **Submodule required**: Vercel/GitHub Actions must check out `vendor/aimas` (or set `AIMAS_DOCS_PATH`).
- **Env vars**: set `AIMAS_DOCS_PATH` only if you need a non-submodule source path. Use `AIMAS_ALLOW_MISSING_OPENAPI=1` to bypass the `/api` spec check temporarily (not recommended for production).
- **Verification**: CI workflow (`.github/workflows/verify.yml`) runs `pnpm docs:verify`, `pnpm lint`, and `pnpm build`.

## Commands

- `pnpm dev` – local server with runtime MiniSearch indexing.
- `pnpm docs:verify` – ensures authority docs are reachable and each section has entries.
- `pnpm build` – builds search index + static site.
- `pnpm lint` – Next.js ESLint config (no interactive prompts).

## CI guardrails

`.github/workflows/verify.yml` runs on every push/PR and refuses to build if:
- `vendor/aimas` (or `AIMAS_DOCS_PATH`) is unavailable
- the doc registry is empty
- the OpenAPI spec is missing (unless `AIMAS_ALLOW_MISSING_OPENAPI=1`)

It executes `pnpm docs:verify`, `pnpm lint`, and `pnpm build` in that order, mirroring the local ritual.

## Structure

```
vendor/aimas          # git submodule → https://github.com/ezz-ae/AIMAS
lib/docs.ts           # deterministic document loader + registry + TOC
lib/search/*          # MiniSearch index builder + runtime loader
scripts/*.ts          # build-search + docs-verify (run via tsx)
app/docs              # index + [...slug] renderer (no local markdown)
app/search            # intent input + doc search surface
app/system            # read-only pipeline visualization
app/api               # renders OpenAPI spec from authority repo
```

No logic crosses layers: `/aimas` stays authority-only, `/aimas-ui` stays surface-only.
