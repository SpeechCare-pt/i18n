# @sinaia/i18n — Agent Context

Shared i18next translation files for the SINAIA platform (web now, mobile later). Product brand:
**SINAIA**; the practice is **SpeechCare**.

This repo is one service in a meta-repo. The umbrella (`SpeechCare-pt/speechcare`) holds shared
context. Full working model: `../.claude/CLAUDE.md` and `../docs/guides/Workspace Setup.md`.

## What this is

- Raw locale JSON only. No build step, no runtime. Consuming apps import by subpath
  (`@sinaia/i18n/locales/pt/auth.json`) and set up i18next themselves.
- **Public** git dependency on purpose: strings ship in the client bundle, so they aren't secret,
  and public avoids auth for every consumer and CI runner. Put no secrets or config here.
- Languages: pt, es. en and Arabic/RTL when needed.

## Rules

- Every key exists in every language. `npm run check` enforces it — run it before tagging.
- Portuguese is pt-PT, informal ("tu"). Spanish is es-ES, informal ("tú"). Keep technical terms in
  English where that's the norm.
- Version with git tags (`v0.1.0`, …). Consuming apps pin to a tag; bump the tag to roll copy out.
- Backend-rendered copy (email, validation, PDFs) does not belong here.

## Working model

- Branch, commit, and push from within this repo.
- Cross-cutting decisions go in the umbrella, not here.
