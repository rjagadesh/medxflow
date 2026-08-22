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
import { POSTS, medxflowFor } from "../src/blog.data.js";
import { AI_AGENTS, AI_AGENTS_INTRO, AI_AGENTS_FAQ } from "../src/ai-agents-rcm.data.js";
import { SEO_PAGES } from "../src/seo-pages.data.js";
import { TERMS } from "../src/glossary.data.js";
import { CODES } from "../src/denial-codes.data.js";
import { DENIAL_ANSWER, DENIAL_STATS, DENIAL_CAUSES, DENIAL_BENCHMARKS, DENIAL_FAQ } from "../src/rcm-denial-benchmarks.data.js";
import { ROLES, CAREERS_INTRO, DATE_POSTED, VALID_THROUGH } from "../src/careers.data.js";
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
    post.sections.map((s) => h2(s.h) + (s.p || []).map(p).join("") + (s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : "")).join("") +
    h2("How MedXFlow AI agents handle this") + p(medxflowFor(post)) +
    faqHtml(post.faq) +
    `</article>`;
}
function blogIndexBody() {
  return `<section><h1>RCM insights for medical practices</h1>` +
    POSTS.map((post) => `<article><h2><a href="/blog/${post.slug}/">${esc(post.title)}</a></h2>${p(post.description)}</article>`).join("") +
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
    [...TERMS].sort((a, b) => a.term.localeCompare(b.term)).map((t) => `<article><h2><a href="/glossary/${t.slug}/">${esc(t.term)}</a></h2>${p(t.def)}</article>`).join("") +
    `</section>`;
}
function glossaryTermBody(t) {
  return `<article><h1>${esc(t.term)}</h1>${p(t.def)}` +
    t.body.map(p).join("") +
    (t.related ? `<p><a href="${t.related.href}">${esc(t.related.label)}</a></p>` : "") +
    (t.see?.length ? `<nav><h2>Related terms</h2>${t.see.map((s) => `<a href="/glossary/${s}/">${esc(s.replace(/-/g, " "))}</a>`).join("")}</nav>` : "") +
    `</article>`;
}
function denialIndexBody() {
  return `<section><h1>Medical claim denial codes, explained</h1>` +
    p("Look up a CARC or RARC denial code to see what it means, why it happens, and how to fix it.") +
    CODES.map((c) => `<article><h2><a href="/denial-codes/${c.slug}/">${esc(c.code)}</a></h2>${p(c.meaning)}</article>`).join("") +
    `</section>`;
}
function denialCodeBody(c) {
  return `<article><h1>Denial Code ${esc(c.code)}: What It Means and How to Fix It</h1>` +
    p(c.meaning) +
    h2("Official description") + p(c.official) +
    h2("Common cause") + p(c.cause) +
    h2("How to fix it") + p(c.fix) +
    `<p><a href="/products/denial-management/">See MedXFlow Denial Management</a></p>` +
    `</article>`;
}
function aiAgentsBody() {
  return `<article><h1>AI Agents for Healthcare Revenue Cycle Management</h1>` +
    p(AI_AGENTS_INTRO) +
    p("AI agents for revenue cycle management are software workers that carry out an RCM task from start to finish - navigating your EHR and payer portals, validating data, applying your business rules, and escalating exceptions to staff. MedXFlow runs a connected set of these agents across eligibility, prior authorization, coding, claims, denials, payment posting and patient collections, so cash moves from the first appointment to the final payment with far less manual work.") +
    h2("The RCM agents MedXFlow runs") +
    AI_AGENTS.map((a) => `<h3><a href="${a.href}">${esc(a.h)}</a></h3>${p(a.p)}`).join("") +
    h2("How the agents work") +
    p("Every MedXFlow RCM agent follows the same loop: Receive, Understand, Process, Validate, Escalate, Track - with your staff handling the exceptions.") +
    faqHtml(AI_AGENTS_FAQ) +
    `</article>`;
}

function productBody(prod) {
  return `<article><h1>${esc(prod.name)}</h1>` +
    p(prod.tagline) + p(prod.overview) +
    h2(`What's inside ${prod.name}`) +
    `<ul>${(prod.features || []).map(([ic, h, d]) => `<li><strong>${esc(h)}</strong> - ${esc(d)}</li>`).join("")}</ul>` +
    h2("How it works") +
    `<ol>${(prod.steps || []).map(([h, d]) => `<li><strong>${esc(h)}</strong> - ${esc(d)}</li>`).join("")}</ol>` +
    h2("What you get") +
    `<ul>${(prod.benefits || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` +
    faqHtml(prod.faq) +
    `</article>`;
}
function productsIndexBody() {
  return `<section><h1>MedXFlow products: the whole revenue cycle, one platform</h1>` +
    p("MedXFlow's platform covers the entire revenue cycle in one place: scheduling, eligibility and benefits verification, prior authorization, patient check-in, charge capture and coding, claims submission and follow-up, payment posting, denial management, and patient collections - plus a human-led managed billing team when you would rather hand it over.") +
    PRODUCTS.map((x) => `<article><h2><a href="/products/${x.slug}/">${esc(x.name)}</a></h2>${p(x.tagline)}</article>`).join("") +
    `</section>`;
}
function specialtiesIndexBody() {
  return `<section><h1>AI agents for the revenue cycle, tuned to your specialty</h1>` +
    p("MedXFlow provides AI revenue cycle management tuned to each specialty - including medical spas, dental, mental and behavioral health, dermatology, physical therapy, cardiology, orthopedics and primary care. The AI agents automate eligibility, prior authorization, coding and denials around the billing rules and payer mix specific to your practice type.") +
    SPECIALTIES.map((s) => `<article><h2><a href="/specialties/${s.slug}/">${esc(s.name)}</a></h2>${p(s.tagline)}</article>`).join("") +
    `</section>`;
}
const ROI_FAQ = [
  { q: "How is MedXFlow priced?", a: "MedXFlow prices finished work, not seats or a percentage of collections. Each workflow has a published weight in MedXFlow Units (MXU, listed at $0.10 each), and each plan includes a monthly MXU allowance with a lower effective rate as volume grows." },
  { q: "How does the ROI calculator estimate savings?", a: "It compares your current loaded RCM labor cost (FTEs times hours times fully-loaded cost per hour) against MedXFlow's list price for the plan that fits your scale. The difference is your estimated monthly and annual saving." },
  { q: "Is this an exact quote?", a: "No. It is a list-price estimate. Because plans are priced per completed workflow outcome, your exact cost depends on your real workflow volumes. Send three months of volumes and MedXFlow will price it precisely." },
  { q: "Does MedXFlow charge a percentage of collections?", a: "No. There are no seat fees and no percentage of collections. You pay for finished work at a rate benchmarked to sit below the loaded cost of doing the same work in-house or offshore." },
];
function roiBody() {
  return `<article><h1>MedXFlow ROI calculator</h1>` +
    p("Every MedXFlow rate is benchmarked against the loaded cost of doing the same RCM work in-house or offshore, then set below it. Enter what the work costs you today - the staff, hours and fully-loaded hourly cost - and compare it against MedXFlow's list pricing to see your monthly and annual savings.") +
    h2("How MedXFlow pricing works") + p("MedXFlow prices finished work, not seats and not a percentage of collections. Each workflow carries a published weight in MedXFlow Units (MXU), listed at $0.10 each, and every plan includes a monthly MXU allowance with a lower effective rate as you scale. Plans range from Core ($1,299/month, 10,000 MXU) to Enterprise ($16,999/month, 200,000 MXU), with a Partner plan for billing companies.") +
    h2("What the calculator compares") + p("On one side is your current loaded cost: the FTEs, hours and fully-loaded hourly cost of the staff doing the RCM work you would automate. On the other is MedXFlow's list price: the plan that fits your scale. The gap is your saving.") +
    faqHtml(ROI_FAQ) +
    `</article>`;
}

function careersBody() {
  return `<section><h1>Careers at MedXFlow</h1>` +
    p(CAREERS_INTRO) +
    h2(`${ROLES.length} open roles`) +
    ROLES.map((r) =>
      `<article><h3>${esc(r.title)}</h3>` +
      p(`${esc(r.team)} · ${esc(r.type)} · ${esc(r.location)} · ${esc(r.experience)}`) +
      p(r.summary) +
      `<h4>What you will do</h4><ul>${r.responsibilities.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` +
      `<h4>What we are looking for</h4><ul>${r.requirements.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` +
      `</article>`
    ).join("") +
    `</section>`;
}
function careersLd() {
  const jobs = ROLES.map((r) => ({
    "@type": "JobPosting",
    title: r.title,
    description: `${r.summary} Responsibilities: ${r.responsibilities.join(" ")} Requirements: ${r.requirements.join(" ")}`,
    datePosted: DATE_POSTED,
    validThrough: VALID_THROUGH,
    employmentType: "FULL_TIME",
    hiringOrganization: { "@id": `${ORIGIN}/#organization` },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "United States" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "US" } },
    directApply: false,
    url: `${ORIGIN}/careers/#${r.slug}`,
  }));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Careers", "/careers/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
      ...jobs,
    ],
  });
}

function npiLookupBody() {
  return `<article><h1>NPI lookup</h1>` +
    p("An NPI (National Provider Identifier) is a unique 10-digit number CMS assigns to every US healthcare provider and organization. This tool looks up NPIs in the official NPPES registry so you can verify a provider's number, taxonomy and enrollment status before you bill or credential.") +
    h2("What is an NPI number?") + p("An NPI is a unique 10-digit identifier that CMS, through NPPES, assigns to healthcare providers in the United States. It is required on HIPAA-standard transactions - claims, eligibility and remittance - and stays with the provider for life.") +
    h2("NPI-1 vs NPI-2: individuals and organizations") + p("An NPI-1 (Type 1) belongs to an individual provider such as a physician or therapist. An NPI-2 (Type 2) belongs to an organization such as a group practice, hospital or laboratory. Billing the wrong type is a common, avoidable denial.") +
    h2("What the taxonomy code tells you") + p("Each NPI carries taxonomy codes that classify the provider's specialty and type. A mismatch between the taxonomy on file and the service billed is a frequent source of medical-necessity and enrollment denials.") +
    h2("Why verifying the NPI matters") + p("An accurate, active NPI whose type and taxonomy match the enrollment is the anchor of a clean claim. Primary-source verification against NPPES is part of what MedXFlow's credentialing agent runs automatically during provider enrollment.") +
    faqHtml(NPI_FAQ) +
    `</article>`;
}

const NPI_FAQ = [
  { q: "How do I look up an NPI number?", a: "Enter the provider's last name (and optionally first name and state), the organization name, or a known 10-digit NPI, then search. Results come from the official CMS NPPES registry and show the NPI, provider type, primary taxonomy, location and status." },
  { q: "Is NPI lookup free?", a: "Yes. NPI data is public and maintained by CMS in the NPPES registry. This tool queries that registry at no cost." },
  { q: "What is the difference between a Type 1 and Type 2 NPI?", a: "A Type 1 (NPI-1) is for an individual provider such as a physician or nurse practitioner. A Type 2 (NPI-2) is for an organization such as a group practice, hospital or laboratory. A provider who owns a practice can have both." },
  { q: "Why would a claim be denied over an NPI?", a: "Common causes are billing under a deactivated NPI, using the wrong NPI type, or a mismatch between the provider's taxonomy or enrollment and the service billed. Verifying the NPI and taxonomy before billing prevents these denials." },
  { q: "How often is NPPES data updated?", a: "CMS refreshes the NPPES registry regularly, and providers can update their own records at any time. Always confirm active enrollment with the specific payer before billing." },
];

function denialBenchmarksBody() {
  return `<article><h1>RCM denial benchmarks: claim denial rates and statistics</h1>` +
    p(DENIAL_ANSWER) +
    h2("Claim denials by the numbers") +
    `<ul>${DENIAL_STATS.map((s) => `<li>${esc(s.n)} - ${esc(s.label)} (${esc(s.source)}, ${esc(s.year)})</li>`).join("")}</ul>` +
    h2("Denial rate benchmarks: healthy vs at-risk") +
    `<table><thead><tr><th>Metric</th><th>Healthy</th><th>Needs attention</th></tr></thead><tbody>` +
    DENIAL_BENCHMARKS.map((r) => `<tr><td>${esc(r.metric)}</td><td>${esc(r.healthy)}</td><td>${esc(r.attention)}</td></tr>`).join("") +
    `</tbody></table>` +
    h2("The most common reasons claims are denied") +
    `<ul>${DENIAL_CAUSES.map((c) => `<li><strong>${esc(c.cause)}</strong> - ${esc(c.note)}</li>`).join("")}</ul>` +
    faqHtml(DENIAL_FAQ) +
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
    path: "/trust",
    title: "Trust & Security · HIPAA, SOC 2, BAA · MedXFlow",
    desc: "MedXFlow security and compliance: HIPAA-compliant with a BAA available, controls aligned to SOC 2 Type II, US data centers, encryption in transit and at rest, least-privilege access and full audit logging.",
    body: `<article><h1>Security and compliance at MedXFlow</h1>` +
      p("MedXFlow handles protected health information for medical practices, billing companies and RCM teams. Security and compliance are built into how the platform and its AI agents work.") +
      h2("HIPAA") + p("PHI is handled to HIPAA standards, and a Business Associate Agreement (BAA) is available for every customer.") +
      h2("SOC 2-aligned controls") + p("Security controls are aligned to SOC 2 Type II across availability, confidentiality and processing integrity.") +
      h2("Data protection") + p("Data is stored in US data centers, encrypted in transit and at rest, with least-privilege access and full audit logging. We never sell patient data or use PHI to train public models.") +
      h2("How AI agents handle PHI safely") + p("Agents work inside HIPAA-standard handling with encryption, least-privilege access and a complete audit trail, and they escalate uncertain cases to staff rather than acting unsupervised.") +
      `</article>`,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", name: "Trust & Security at MedXFlow", url: `${ORIGIN}/trust/`, about: { "@id": `${ORIGIN}/#organization` }, description: "MedXFlow security and compliance: HIPAA, BAA, SOC 2-aligned controls, US data centers, encryption." },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Trust & Security", "/trust/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: [
          { "@type": "Question", name: "Is MedXFlow HIPAA compliant?", acceptedAnswer: { "@type": "Answer", text: "Yes. MedXFlow handles PHI to HIPAA standards and offers a Business Associate Agreement (BAA) to every customer." } },
          { "@type": "Question", name: "Is MedXFlow SOC 2 certified?", acceptedAnswer: { "@type": "Answer", text: "MedXFlow's security controls are aligned to SOC 2 Type II across availability, confidentiality and processing integrity." } },
          { "@type": "Question", name: "Do you use patient data to train AI?", acceptedAnswer: { "@type": "Answer", text: "No. We never sell patient data or use PHI to train public models." } },
        ] },
      ],
    }),
  },
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
  {
    path: "/careers",
    title: "Careers · Join MedXFlow · AI Revenue Cycle Management",
    desc: "Careers at MedXFlow. Remote-first US roles across AI engineering and certified RCM: Generative AI Specialist, CPC and CBCS coders, denial management, prior authorization, credentialing and revenue cycle leadership.",
    body: careersBody(),
    jsonld: careersLd(),
  },
  { path: "/products", title: "Products · MedXFlow", desc: "The connected stages of Revenue Cycle Management, plus VoIP, telehealth and a human-led managed billing team - one platform for the whole practice.", body: productsIndexBody() },
  ...PRODUCTS.map((p) => ({
    path: `/products/${p.slug}/`, title: `${p.name} · MedXFlow`, desc: p.tagline,
    body: productBody(p),
    jsonld: serviceLd({
      name: p.name, serviceType: "Healthcare revenue cycle management", url: `${ORIGIN}/products/${p.slug}/`,
      description: p.tagline, faq: p.faq, crumbs: [["Home", "/"], ["Products", "/products/"], [p.name, `/products/${p.slug}/`]],
    }),
  })),
  { path: "/specialties", title: "Specialties · AI agents by practice type · MedXFlow", desc: "AI revenue-cycle agents tuned to your specialty - MedSpa, dental, mental health, dermatology, physical therapy, cardiology, orthopedics and primary care.", body: specialtiesIndexBody() },
  ...SPECIALTIES.map((s) => ({
    path: `/specialties/${s.slug}/`, title: `${s.name} · AI agents for the revenue cycle · MedXFlow`, desc: s.tagline,
    jsonld: serviceLd({
      name: `${s.name} revenue cycle management`, serviceType: "Healthcare revenue cycle management", url: `${ORIGIN}/specialties/${s.slug}/`,
      description: s.tagline, crumbs: [["Home", "/"], ["Specialties", "/specialties/"], [s.name, `/specialties/${s.slug}/`]],
    }),
  })),
  { path: "/blog", title: "Resources · RCM insights for medical practices · MedXFlow", desc: "Practical guides on claim denials, prior authorization, coding and the healthcare revenue cycle - for the people who run medical billing.", body: blogIndexBody() },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}/`, title: `${p.title} · MedXFlow`, desc: p.description, article: p, body: blogPostBody(p) })),
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
    path: `/glossary/${t.slug}/`,
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
  {
    path: "/roi-calculator",
    title: "RCM ROI Calculator · What MedXFlow Saves You · MedXFlow",
    desc: "Free RCM ROI calculator. Enter your staff, hours and cost per hour and compare your current revenue-cycle labor cost against MedXFlow's pricing to see your monthly and annual savings.",
    body: roiBody(),
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebApplication", name: "MedXFlow ROI Calculator", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${ORIGIN}/roi-calculator/`, description: "Interactive calculator comparing current RCM labor cost against MedXFlow pricing to estimate savings.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": `${ORIGIN}/#organization` } },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["ROI Calculator", "/roi-calculator/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: ROI_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
    }),
  },
  {
    path: "/npi-lookup",
    title: "NPI Lookup · Free NPI Number Registry Search · MedXFlow",
    desc: "Free NPI lookup. Search the official CMS NPPES registry for any US provider or organization by name or NPI number - the NPI, taxonomy, location and status, for billing and credentialing.",
    body: npiLookupBody(),
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebApplication", name: "NPI Lookup", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${ORIGIN}/npi-lookup/`, description: "Free tool to look up a provider's National Provider Identifier (NPI) in the CMS NPPES registry.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": `${ORIGIN}/#organization` } },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["NPI Lookup", "/npi-lookup/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: NPI_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
    }),
  },
  {
    path: "/rcm-denial-benchmarks",
    title: "RCM Denial Benchmarks: Claim Denial Rates & Statistics | MedXFlow",
    desc: "Medical claim denial statistics and benchmarks: average denial rates (around 11%), the share that are avoidable (around 85%), cost per denial, top root causes, and healthy-vs-at-risk KPI benchmarks - compiled from published industry sources.",
    body: denialBenchmarksBody(),
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Dataset",
          name: "RCM denial benchmarks: claim denial rates and statistics",
          description: "Compiled statistics on US medical claim denials: average initial denial rate, share of avoidable denials, cost per reworked claim, top root causes, and healthy-vs-at-risk revenue-cycle KPI benchmarks, aggregated from published industry reports.",
          url: `${ORIGIN}/rcm-denial-benchmarks/`,
          keywords: ["claim denial rate", "medical claim denials", "revenue cycle benchmarks", "denial management", "RCM statistics"],
          creator: { "@id": `${ORIGIN}/#organization` },
          isAccessibleForFree: true,
          variableMeasured: ["Initial claim denial rate", "Share of avoidable denials", "Cost to rework a denied claim", "Clean claim rate", "Denial overturn rate", "Days in A/R"],
        },
        {
          "@type": "Article",
          headline: "RCM denial benchmarks: claim denial rates and statistics",
          description: "A reference guide to medical claim denial rates, costs, root causes and the KPI benchmarks that define a healthy revenue cycle, compiled from published industry sources.",
          url: `${ORIGIN}/rcm-denial-benchmarks/`,
          author: { "@id": `${ORIGIN}/#organization` },
          publisher: { "@id": `${ORIGIN}/#organization` },
          mainEntityOfPage: `${ORIGIN}/rcm-denial-benchmarks/`,
          articleSection: "RCM data",
        },
        { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["RCM Denial Benchmarks", "/rcm-denial-benchmarks/"]].map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${ORIGIN}${u}` })) },
        { "@type": "FAQPage", mainEntity: DENIAL_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
    }),
  },
  ...CODES.map((c) => ({
    path: `/denial-codes/${c.slug}/`,
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
