// Post-build prerender (no dependencies).
//
// A Vite SPA serves one index.html for every route, so deep pages inherit the
// homepage's <title>/description/OG/JSON-LD — bad for social sharing and non-JS
// crawlers. This clones the built dist/index.html for each known route and
// rewrites its <head> with that page's own meta + a per-page WebPage JSON-LD.
// Netlify serves these static files to scrapers; the React app still hydrates
// normally for real users. Runs automatically after `vite build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "../src/products.data.js";
import { en } from "../src/i18n.strings.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const ORIGIN = "https://medxflow.ai";

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Every route to prerender (homepage keeps its own index.html untouched).
const routes = [
  { path: "/telehealth", title: "Telehealth · MedXFlow", desc: en.telehealth.hero_lead },
  { path: "/products", title: "Products · MedXFlow", desc: "The connected stages of Revenue Cycle Management, plus VoIP, telehealth and a human-led managed billing team - one platform for the whole practice." },
  ...PRODUCTS.map((p) => ({ path: `/products/${p.slug}`, title: `${p.name} · MedXFlow`, desc: p.tagline })),
];

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

// [^>]* matches across newlines, so these are safe whether Vite emits the tags
// single-line or multi-line. Each replacement rewrites the whole tag cleanly.
function headFor(r) {
  const url = ORIGIN + r.path;
  const t = esc(r.title), d = esc(r.desc);
  let out = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/<meta[^>]*\bname="description"[^>]*>/, `<meta name="description" content="${d}" />`)
    .replace(/<link[^>]*\brel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta[^>]*\bproperty="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta[^>]*\bproperty="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta[^>]*\bproperty="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta[^>]*\bname="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta[^>]*\bname="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);

  const ld = JSON.stringify({
    "@context": "https://schema.org", "@type": "WebPage",
    name: r.title, description: r.desc, url, isPartOf: { "@id": `${ORIGIN}/#website` },
  });
  return out.replace("</head>", `    <script type="application/ld+json">${ld}</script>\n  </head>`);
}

let n = 0;
for (const r of routes) {
  const dir = path.join(DIST, r.path.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), headFor(r));
  n++;
}
console.log(`✓ prerendered ${n} routes with per-page meta + JSON-LD`);
