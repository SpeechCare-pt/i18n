# @sinaia/i18n

Shared translation files for the SINAIA platform. UI copy lives here once and both the web app
(SINAIA Suite) and, later, the mobile app (SINAIA Família) read from it, so a wording change is
made in one place.

Languages: **pt** and **es** today. **en** and Arabic (RTL) follow when they're needed.

## How it's consumed

The package is a **public** git dependency. Translation strings ship in the client bundle anyway,
so they aren't secret, and a public repo avoids setting up registry auth or deploy tokens for every
app and CI runner. It's public despite the rest of the org being private for that reason alone; no
patient data or config goes here, only display copy.

```jsonc
// consuming app's package.json
"@sinaia/i18n": "github:SpeechCare-pt/i18n#v0.1.0"
```

Pin to a tag so a copy change can't silently alter a released app. Bump the tag when you want the
app to pick up new strings.

Apps import the raw JSON by subpath and wire it into i18next themselves:

```ts
import ptAuth from "@sinaia/i18n/locales/pt/auth.json";
```

## Layout

```
locales/
  pt/   common.json  auth.json  invites.json
  es/   common.json  auth.json  invites.json
scripts/
  check-parity.mjs
```

One file per namespace, one folder per language. Keys and structure match across languages; only
the values differ.

## Keeping languages aligned

`npm run check` fails if a key exists in one language but not another, or if a namespace file is
empty. Run it before tagging a release.

## Adding to it

- **A string:** add the same key to every language's namespace file, then `npm run check`.
- **A namespace:** create `locales/<lang>/<namespace>.json` for each language, then add the imports
  in each consuming app's i18n setup.
- **A language:** add its folder with every namespace, list it in `check-parity.mjs`, and register
  it in each app.

## Backend copy is not here

Server-owned strings (email, validation, PDFs) belong with the backend that renders them, not in
this client-facing package.
