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
import { SPECIALTIES } from "../src/specialties.data.js";
import { POSTS } from "../src/blog.data.js";
import { AI_AGENTS_FAQ } from "../src/ai-agents-rcm.data.js";
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
  { path: "/specialties", title: "Specialties · AI agents by practice type · MedXFlow", desc: "AI revenue-cycle agents tuned to your specialty - MedSpa, dental, mental health, dermatology, physical therapy, cardiology, orthopedics and primary care." },
  ...SPECIALTIES.map((s) => ({ path: `/specialties/${s.slug}`, title: `${s.name} · AI agents for the revenue cycle · MedXFlow`, desc: s.tagline })),
  { path: "/blog", title: "Resources · RCM insights for medical practices · MedXFlow", desc: "Practical guides on claim denials, prior authorization, coding and the healthcare revenue cycle - for the people who run medical billing." },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} · MedXFlow`, desc: p.description, article: p })),
  {
    path: "/ai-agents-rcm",
    title: "AI Agents for Healthcare RCM | MedXFlow",
    desc: "AI agents for healthcare revenue cycle management - automate eligibility, prior authorization, coding, claims, denials, payment posting and patient collections. Book a free MedXFlow demo.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service", name: "AI Agents for Healthcare Revenue Cycle Management",
          serviceType: "AI revenue cycle management agents",
          provider: { "@id": `${ORIGIN}/#organization` },
          areaServed: { "@type": "Country", name: "United States" },
          url: `${ORIGIN}/ai-agents-rcm`,
          description: "AI agents that automate the healthcare revenue cycle - eligibility verification, prior authorization, medical coding, claims submission and follow-up, denial management, payment posting and patient collections.",
        },
        {
          "@type": "FAQPage",
          mainEntity: AI_AGENTS_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    }),
  },
];

// Article + FAQ JSON-LD for a blog post (richer than the default WebPage graph).
function articleLd(p, url) {
  const graph = [
    {
      "@type": "Article", headline: p.title, description: p.description,
      datePublished: p.date, dateModified: p.date, url,
      author: { "@type": "Organization", name: "MedXFlow" },
      publisher: { "@id": `${ORIGIN}/#organization` },
      mainEntityOfPage: url, articleSection: p.category, keywords: (p.keywords || []).join(", "),
    },
  ];
  if (p.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

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

  const ld = r.jsonld
    ? r.jsonld
    : r.article
    ? articleLd(r.article, url)
    : JSON.stringify({
        "@context": "https://schema.org", "@type": "WebPage",
        name: r.title, description: r.desc, url, isPartOf: { "@id": `${ORIGIN}/#website` },
      });
  return out.replace("</head>", `    <script type="application/ld+json">${ld}</script>\n  </head>`);
}

// Regenerate sitemap.xml from every known route (homepage + all prerendered
// routes) so new pages like blog posts are always included.
function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ["/", ...routes.map((r) => r.path)];
  const body = urls.map((u) => `  <url>\n    <loc>${ORIGIN}${u === "/" ? "/" : u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === "/" ? "1.0" : "0.7"}</priority>\n  </url>`).join("\n");
  fs.writeFileSync(path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
  return urls.length;
}

let n = 0;
for (const r of routes) {
  const dir = path.join(DIST, r.path.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), headFor(r));
  n++;
}
const smCount = writeSitemap();
console.log(`✓ prerendered ${n} routes with per-page meta + JSON-LD`);
console.log(`✓ sitemap.xml regenerated with ${smCount} URLs`);
