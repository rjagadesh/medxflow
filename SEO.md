# MedXFlow SEO — architecture & manual steps

This documents the SEO setup and the steps that require **your** accounts (I can't do these from the codebase).

## How SEO pages are built

- **SPA + prerender.** The site is a Vite React SPA. `scripts/prerender.mjs` runs after `vite build` and writes a static `dist/<route>/index.html` for every public route, with that page's own `<title>`, meta description, canonical, Open Graph, and JSON-LD. Netlify serves these static files to crawlers; the React app still hydrates for users.
- **Canonical/URLs use a trailing slash** on sub-pages (e.g. `/products/`), matching how Netlify serves them, so canonicals never point at a redirecting URL.
- **Sitemap is generated** by the prerender from every route → `dist/sitemap.xml`. `robots.txt` references it and disallows `/admin`.

### To add a new landing page
Add an entry to `src/seo-pages.data.js` (slug, title, h1, description, sections, faq, related). It's automatically: routed (`src/main.jsx`), rendered (`src/SeoPage.jsx`), prerendered with Service + FAQ + Breadcrumb schema, and added to the sitemap. No other wiring needed.

### To add a blog article
Add an entry to `src/blog.data.js`. Same automatic pipeline (Article + FAQ schema).

## Keyword → URL map

| Keyword intent | URL |
|---|---|
| AI agents for healthcare RCM | `/ai-agents-rcm` |
| Healthcare RCM automation | `/healthcare-rcm-automation` |
| AI for medical billing companies | `/ai-for-medical-billing-companies` |
| AI for RCM companies / MSOs | `/ai-for-rcm-companies` |
| Eligibility verification | `/products/eligibility-verification` |
| Prior authorization | `/products/pre-authorization` |
| Denial management | `/products/denial-management` |
| Claims submission | `/products/claims-submission` |
| Medical coding / charge capture | `/products/charge-capture-coding` |
| Reduce claim denials (guide) | `/blog/reduce-claim-denials-small-practice` |
| Prior auth automation (guide) | `/blog/prior-authorization-automation-guide` |
| DNFB / coding backlog (guide) | `/blog/what-is-dnfb-clear-coding-backlog` |

We deliberately do **not** create `/ai-eligibility-verification`-style duplicates of the existing `/products/*` pages — that would split ranking signals for the same intent.

## Manual steps that need YOUR accounts

### 1. Deploy (required first)
Recent SEO pages are only live after a Netlify deploy. Deploys → Trigger deploy → Deploy site. Verify a new page returns its own title:
`curl -A Googlebot https://medxflow.ai/ai-agents-rcm/ | grep '<title>'`

### 2. Google Search Console
1. Go to https://search.google.com/search-console → **Add property** → **Domain** property `medxflow.ai` (verify via DNS TXT record with your domain registrar).
2. **Sitemaps** → submit `https://medxflow.ai/sitemap.xml`.
3. **URL Inspection** → paste the homepage → **Request indexing**. Repeat for:
   - `https://medxflow.ai/ai-agents-rcm/`
   - `https://medxflow.ai/healthcare-rcm-automation/`
   - `https://medxflow.ai/blog/` and each article
   - each key `/products/*` page
4. **Check Coverage/Pages** weekly for excluded/notindexed pages.

### 3. Bing Webmaster Tools
https://www.bing.com/webmasters → add site → submit the same sitemap (also feeds ChatGPT/Copilot search).

### 4. Brand disambiguation (biggest early win)
Google currently confuses "MedXFlow" with "MedFlow". Fix by creating, with the **exact** name "MedXFlow":
- **Google Business Profile** (google.com/business)
- **LinkedIn** company page, **Crunchbase**, **G2**/**Capterra** (RCM software category), **Product Hunt**
Then send me the URLs → I'll add them to the Organization `sameAs` array in `index.html`.

### 5. Backlinks (off-site authority — the real ranking lever)
Directory listings (Clutch, GoodFirms), guest posts on healthcare/RCM blogs, HARO. A new domain needs authority signals before it ranks for competitive terms; on-page work alone won't do it.

## Honest expectations
- Brand term "medxflow" → page 1 in ~2–4 weeks after steps 1–4.
- Long-tail (blog/audience pages) → 2–4 months.
- Competitive head terms ("revenue cycle management software") → 12+ months + heavy links; use Google Ads meanwhile.
