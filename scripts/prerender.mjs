// Post-build prerender (no dependencies).
//
// A Vite SPA serves one index.html for every route, so deep pages inherit the
// homepage's <title>/description/OG/JSON-LD - bad for social sharing and non-JS
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
import { AI_AGENTS, AI_AGENTS_INTRO, AI_AGENTS_FAQ } from "../src/ai-agents-rcm.data.js";
import { SEO_PAGES } from "../src/seo-pages.data.js";
import { TERMS } from "../src/glossary.data.js";
import { CODES } from "../src/denial-codes.data.js";
import { en } from "../src/i18n.strings.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const ORIGIN = "https://medxflow.ai";

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// --- Static body content (so non-JS + AI crawlers get the real text, not just
// the <head>). React replaces this on hydration; it's SEO fodder + fast paint.
const p = (t) => `<p>${esc(t)}</p>`;
const h2 = (t) => `<h2>${esc(t)}</h2>`;
const faqHtml = (faq) => (faq && faq.length ? `<section><h2>Frequently asked questions</h2>${faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>` : "");

function blogPostBody(post) {
  return `<article>` +
    `<p>${esc(post.category)}</p>` +
    `<h1>${esc(post.title)}</h1>` +
    (post.snippet ? `<p>${esc(post.snippet)}</p>` : "") +
    p(post.intro) +
    post.sections.map((s) => h2(s.h) + (s.p || []).map(p).join("")).join("") +
    faqHtml(post.faq) +
    `</article>`;
}
function blogIndexBody() {
  return `<section><h1>RCM insights for medical practices</h1>` +
    POSTS.map((post) => `<article><h2><a href="/blog/${post.slug}">${esc(post.title)}</a></h2>${p(post.description)}</article>`).join("") +
    `</section>`;
}
function seoPageBody(pg) {
  return `<article><h1>${esc(pg.h1)}</h1>${p(pg.intro)}` +
    pg.sections.map((s) => h2(s.h) + (s.p || []).map(p).join("") + (s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : "")).join("") +
    (pg.related ? `<nav><h2>Related</h2>${pg.related.map((r) => `<a href="${r.href}">${esc(r.label)}</a>`).join("")}</nav>` : "") +
    faqHtml(pg.faq) +
    `</article>`;
}
function glossaryIndexBody() {
  return `<section><h1>Revenue Cycle Management glossary</h1>` +
    p("Plain-English definitions of the RCM, coding and billing terms that run your revenue cycle.") +
    [...TERMS].sort((a, b) => a.term.localeCompare(b.term)).map((t) => `<article><h2><a href="/glossary/${t.slug}">${esc(t.term)}</a></h2>${p(t.def)}</article>`).join("") +
    `</section>`;
}
function glossaryTermBody(t) {
  return `<article><h1>${esc(t.term)}</h1>${p(t.def)}` +
    t.body.map(p).join("") +
    (t.related ? `<p><a href="${t.related.href}">${esc(t.related.label)}</a></p>` : "") +
    (t.see?.length ? `<nav><h2>Related terms</h2>${t.see.map((s) => `<a href="/glossary/${s}">${esc(s.replace(/-/g, " "))}</a>`).join("")}</nav>` : "") +
    `</article>`;
}
function denialIndexBody() {
  return `<section><h1>Medical claim denial codes, explained</h1>` +
    p("Look up a CARC or RARC denial code to see what it means, why it happens, and how to fix it.") +
    CODES.map((c) => `<article><h2><a href="/denial-codes/${c.slug}">${esc(c.code)}</a></h2>${p(c.meaning)}</article>`).join("") +
    `</section>`;
}
function denialCodeBody(c) {
  return `<article><h1>Denial Code ${esc(c.code)}: What It Means and How to Fix It</h1>` +
    p(c.meaning) +
    h2("Official description") + p(c.official) +
    h2("Common cause") + p(c.cause) +
    h2("How to fix it") + p(c.fix) +
    `<p><a href="/products/denial-management">See MedXFlow Denial Management</a></p>` +
    `</article>`;
}
function aiAgentsBody() {
  return `<article><h1>AI Agents for Healthcare Revenue Cycle Management</h1>` +
    p(AI_AGENTS_INTRO) +
    h2("The RCM agents MedXFlow runs") +
    AI_AGENTS.map((a) => `<h3><a href="${a.href}">${esc(a.h)}</a></h3>${p(a.p)}`).join("") +
    h2("How the agents work") +
    p("Every MedXFlow RCM agent follows the same loop: Receive, Understand, Process, Validate, Escalate, Track - with your staff handling the exceptions.") +
    faqHtml(AI_AGENTS_FAQ) +
    `</article>`;
}

// The MedXFlow RCM overview video (YouTube), embedded on the AI-agents pillar.
const RCM_VIDEO = {
  id: "5FWau1ZzAgA",
  name: "MedXFlow - AI Revenue Cycle Management & Medical Billing",
  description: "MedXFlow runs your entire revenue cycle with AI agents - eligibility, prior authorization, coding, claims, denials, payment posting and patient collections.",
  thumbnailUrl: "https://i.ytimg.com/vi/5FWau1ZzAgA/hqdefault.jpg",
  uploadDate: "2026-08-10", duration: "PT11S",
  embedUrl: "https://www.youtube.com/embed/5FWau1ZzAgA",
  contentUrl: "https://youtu.be/5FWau1ZzAgA",
};

// Every route to prerender (homepage keeps its own index.html untouched).
const routes = [
  { path: "/telehealth", title: "Telehealth · MedXFlow", desc: en.telehealth.hero_lead },
  {
    path: "/about",
    title: "About MedXFlow · AI Revenue Cycle Management",
    desc: "MedXFlow is an AI-powered revenue cycle management platform whose AI agents automate eligibility, prior authorization, coding, claims and denials for medical practices, billing companies and RCM teams in the US. HIPAA-compliant, BAA available.",
    body: `<article><h1>About MedXFlow</h1>` +
      p("MedXFlow is an AI-powered revenue cycle management platform. Our AI agents automate the repetitive work across the healthcare revenue cycle so medical practices, billing companies and RCM teams get paid faster with less manual effort.") +
      h2("What we do") + p("MedXFlow runs the revenue cycle with AI agents that carry out each task end to end: eligibility and benefits verification, prior authorization, charge capture and medical coding, claims submission and follow-up, denial management, payment posting, and patient collections. Agents escalate exceptions to staff, and a human-led Managed Billing team is available to run the whole cycle.") +
      h2("Security and compliance") + p("PHI is handled to HIPAA standards with a Business Associate Agreement available, security controls aligned to SOC 2 Type II, US data centers, encryption in transit and at rest, and least-privilege access with audit logging. MedXFlow works with Epic, athenahealth, eClinicalWorks and more.") +
      h2("Who we serve") + p("Medical practices, billing companies, MSOs and revenue cycle teams across the United States.") +
      `</article>`,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "AboutPage", name: "About MedXFlow", url: `${ORIGIN}/about/`, mainEntity: { "@id": `${ORIGIN}/#organization` } },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["About", "/about/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
      ],
    }),
  },
  { path: "/products", title: "Products · MedXFlow", desc: "The connected stages of Revenue Cycle Management, plus VoIP, telehealth and a human-led managed billing team - one platform for the whole practice." },
  ...PRODUCTS.map((p) => ({
    path: `/products/${p.slug}`, title: `${p.name} · MedXFlow`, desc: p.tagline,
    jsonld: serviceLd({
      name: p.name, serviceType: "Healthcare revenue cycle management", url: `${ORIGIN}/products/${p.slug}/`,
      description: p.tagline, crumbs: [["Home", "/"], ["Products", "/products/"], [p.name, `/products/${p.slug}/`]],
    }),
  })),
  { path: "/specialties", title: "Specialties · AI agents by practice type · MedXFlow", desc: "AI revenue-cycle agents tuned to your specialty - MedSpa, dental, mental health, dermatology, physical therapy, cardiology, orthopedics and primary care." },
  ...SPECIALTIES.map((s) => ({
    path: `/specialties/${s.slug}`, title: `${s.name} · AI agents for the revenue cycle · MedXFlow`, desc: s.tagline,
    jsonld: serviceLd({
      name: `${s.name} revenue cycle management`, serviceType: "Healthcare revenue cycle management", url: `${ORIGIN}/specialties/${s.slug}/`,
      description: s.tagline, crumbs: [["Home", "/"], ["Specialties", "/specialties/"], [s.name, `/specialties/${s.slug}/`]],
    }),
  })),
  { path: "/blog", title: "Resources · RCM insights for medical practices · MedXFlow", desc: "Practical guides on claim denials, prior authorization, coding and the healthcare revenue cycle - for the people who run medical billing.", body: blogIndexBody() },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} · MedXFlow`, desc: p.description, article: p, body: blogPostBody(p) })),
  {
    path: "/ai-agents-rcm",
    title: "AI Agents for Healthcare RCM | MedXFlow",
    desc: "AI agents for healthcare revenue cycle management - automate eligibility, prior authorization, coding, claims, denials, payment posting and patient collections. Book a free MedXFlow demo.",
    body: aiAgentsBody(),
    jsonld: serviceLd({
      name: "AI Agents for Healthcare Revenue Cycle Management",
      serviceType: "AI revenue cycle management agents",
      url: `${ORIGIN}/ai-agents-rcm/`,
      description: "AI agents that automate the healthcare revenue cycle - eligibility verification, prior authorization, medical coding, claims submission and follow-up, denial management, payment posting and patient collections.",
      faq: AI_AGENTS_FAQ,
      crumbs: [["Home", "/"], ["AI Agents for Healthcare RCM", "/ai-agents-rcm/"]],
      video: RCM_VIDEO,
    }),
  },
  { path: "/glossary", title: "RCM Glossary · Revenue cycle terms explained · MedXFlow", desc: "Plain-English definitions of revenue cycle management, medical coding and billing terms - DNFB, CARC codes, days in A/R, prior authorization and more.", body: glossaryIndexBody() },
  ...TERMS.map((t) => ({
    path: `/glossary/${t.slug}`,
    title: `${t.term} - RCM Glossary | MedXFlow`,
    desc: t.def,
    body: glossaryTermBody(t),
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "DefinedTerm", name: t.term, description: t.def, inDefinedTermSet: `${ORIGIN}/glossary`, url: `${ORIGIN}/glossary/${t.slug}/` },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Glossary", "/glossary/"], [t.term, `/glossary/${t.slug}/`]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
      ],
    }),
  })),
  { path: "/denial-codes", title: "Denial Code Lookup · CARC & RARC Codes Explained · MedXFlow", desc: "Look up medical claim denial codes (CARC and RARC): what each code means, why it happens, and how to fix it - CO-45, CO-197, PR-1 and more.", body: denialIndexBody() },
  {
    path: "/denial-rate-calculator",
    title: "Denial Rate Calculator · Free RCM Tool · MedXFlow",
    desc: "Free denial rate calculator. Enter claims submitted and denied to calculate your claim denial rate and compare it to industry benchmarks (under 5% is healthy).",
    body: `<article><h1>Denial Rate Calculator</h1>` +
      p("Your claim denial rate is the number of claims denied divided by the number submitted in a period, shown as a percentage.") +
      h2("What is a good denial rate?") + p("Under 5% is generally considered healthy, and best-in-class practices run 2 to 4%. Above 10% usually points to a concentrated, fixable root cause.") +
      h2("How to calculate denial rate") + p("Denial rate = (claims denied divided by claims submitted) times 100, measured over a period such as a month.") +
      h2("How to reduce your denial rate") + p("Verify eligibility before the visit, secure prior authorizations, scrub coding for medical-necessity mismatches, and work denials fast while tracking root cause.") +
      `</article>`,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebApplication", name: "Denial Rate Calculator", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${ORIGIN}/denial-rate-calculator/`, description: "Free calculator for a medical practice's claim denial rate.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": `${ORIGIN}/#organization` } },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Denial Rate Calculator", "/denial-rate-calculator/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: [
          { "@type": "Question", name: "What is a good denial rate?", acceptedAnswer: { "@type": "Answer", text: "Under 5% is generally healthy; best-in-class practices run 2 to 4%. Above 10% usually indicates a fixable root cause, most often eligibility or prior authorization." } },
          { "@type": "Question", name: "How do you calculate denial rate?", acceptedAnswer: { "@type": "Answer", text: "Denial rate equals claims denied divided by claims submitted, times 100, over a period such as a month." } },
        ] },
      ],
    }),
  },
  ...CODES.map((c) => ({
    path: `/denial-codes/${c.slug}`,
    title: `Denial Code ${c.code} - What It Means & How to Fix It | MedXFlow`,
    desc: `${c.code}: ${c.meaning}`.slice(0, 155),
    body: denialCodeBody(c),
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Denial Codes", "/denial-codes/"], [c.code, `/denial-codes/${c.slug}/`]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: [
          { "@type": "Question", name: `What is denial code ${c.code}?`, acceptedAnswer: { "@type": "Answer", text: `${c.meaning} Official description: ${c.official}` } },
          { "@type": "Question", name: `How do I fix denial code ${c.code}?`, acceptedAnswer: { "@type": "Answer", text: c.fix } },
        ] },
      ],
    }),
  })),
  ...SEO_PAGES.map((p) => ({
    path: `/${p.slug}`,
    title: p.title,
    desc: p.description,
    body: seoPageBody(p),
    jsonld: serviceLd({
      name: p.h1,
      serviceType: p.kind === "audience" ? "AI revenue cycle management for " + p.eyebrow : "Healthcare RCM automation",
      url: `${ORIGIN}/${p.slug}/`,
      description: p.description,
      faq: p.faq,
      crumbs: [["Home", "/"], ["Products", "/products/"], [p.h1, `/${p.slug}/`]],
    }),
  })),
];

// Service + FAQPage + BreadcrumbList (+ optional VideoObject) JSON-LD.
function serviceLd({ name, serviceType, url, description, faq, crumbs, video }) {
  const graph = [
    {
      "@type": "Service", name, serviceType, url, description,
      provider: { "@id": `${ORIGIN}/#organization` },
      areaServed: { "@type": "Country", name: "United States" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })),
    },
  ];
  if (video) {
    graph.push({
      "@type": "VideoObject", name: video.name, description: video.description,
      thumbnailUrl: video.thumbnailUrl, uploadDate: video.uploadDate, duration: video.duration,
      embedUrl: video.embedUrl, contentUrl: video.contentUrl, publisher: { "@id": `${ORIGIN}/#organization` },
    });
  }
  if (faq?.length) {
    graph.push({ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

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
  // Netlify serves prerendered directory pages with a trailing slash and 301s
  // the non-slash form to it, so the canonical + og:url must use the slash form
  // (otherwise the canonical points at a URL that redirects).
  const url = ORIGIN + r.path + "/";
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
  out = out.replace("</head>", `    <script type="application/ld+json">${ld}</script>\n  </head>`);

  // Inject static body content into #root for crawlers that don't run JS.
  // Visually hidden so there's no unstyled flash before React mounts and
  // replaces it. Rendered content is identical in meaning to the React output.
  if (r.body) {
    out = out.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root"><div id="prerender" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${r.body}</div></div>`
    );
  }
  return out;
}

// Regenerate sitemap.xml from every known route (homepage + all prerendered
// routes) so new pages like blog posts are always included.
function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  // Trailing slash on sub-pages to match what Netlify serves + the canonical.
  const urls = ["/", ...routes.map((r) => r.path + "/")];
  const body = urls.map((u) => `  <url>\n    <loc>${ORIGIN}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === "/" ? "1.0" : "0.7"}</priority>\n  </url>`).join("\n");
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
