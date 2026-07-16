// Fails if any key present in one language is missing in another (per namespace), or if a
// namespace file is empty. Keeps the languages aligned so a copy change in one isn't forgotten
// in another. Run with `npm run check`.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localesDir = join(root, "locales");
const langs = ["pt", "es"];

const flatten = (obj, prefix = "", acc = {}) => {
  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      flatten(value, fullKey, acc);
    } else {
      acc[fullKey] = true;
    }
  }
  return acc;
};

function namespacesFor(lang) {
  const out = {};
  for (const file of readdirSync(join(localesDir, lang))) {
    if (!file.endsWith(".json")) continue;
    const path = join(localesDir, lang, file);
    out[file.replace(/\.json$/, "")] = flatten(JSON.parse(readFileSync(path, "utf8")));
  }
  return out;
}

const byLang = Object.fromEntries(langs.map((lang) => [lang, namespacesFor(lang)]));
const allNamespaces = new Set(langs.flatMap((lang) => Object.keys(byLang[lang])));
let problems = 0;

for (const namespace of allNamespaces) {
  const union = new Set();
  for (const lang of langs) {
    for (const key of Object.keys(byLang[lang][namespace] || {})) union.add(key);
  }

  if (union.size === 0) {
    problems += 1;
    console.error(`${namespace}: every language's file is empty (no keys)`);
    continue;
  }

  for (const lang of langs) {
    const have = byLang[lang][namespace] || {};
    if (Object.keys(have).length === 0) {
      problems += 1;
      console.error(`[${lang}] ${namespace}: file missing or empty`);
      continue;
    }
    const missing = [...union].filter((key) => !have[key]);
    if (missing.length) {
      problems += missing.length;
      const shown = missing.slice(0, 8).join(", ");
      console.error(
        `[${lang}] ${namespace}: ${missing.length} missing key(s): ${shown}${missing.length > 8 ? " ..." : ""}`,
      );
    }
  }
}

if (problems) {
  console.error(`\nParity check FAILED: ${problems} problem(s).`);
  process.exit(1);
}
console.log(`Parity check passed: ${langs.join("/")} aligned across all namespaces.`);
