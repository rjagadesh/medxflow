import { useState, useEffect } from "react";
import { flatEn } from "./i18n.strings.mjs";
import { PRODUCTS } from "./products.data.js";

// ── Self-audit rules ──────────────────────────────────────────────────────
const TITLE_MIN = 30, TITLE_MAX = 60;
const DESC_MIN = 70, DESC_MAX = 160;

// Every public route the app serves, with the title/description it renders.
// Homepage values are read from the live HTML; the rest follow the component
// rules (ProductPage: `${name} · MedXFlow` / tagline).
function buildRoutes(homeTitle, homeDesc) {
  const routes = [
    { path: "/", title: homeTitle, desc: homeDesc, home: true },
    { path: "/telehealth", title: "Telehealth · MedXFlow", desc: flatEn["telehealth.hero_lead"] },
    { path: "/products", title: "Products · MedXFlow", desc: "From the first appointment to the final payment — nine connected stages of Revenue Cycle Management, plus a human-led managed billing team." },
  ];
  for (const p of PRODUCTS) {
    routes.push({ path: `/products/${p.slug}`, title: `${p.name} · MedXFlow`, desc: p.tagline });
  }
  return routes;
}

const mark = (ok, warn) => (ok ? "pass" : warn ? "warn" : "fail");

export default function Seo({ pw }) {
  const [audit, setAudit] = useState(null);
  const [err, setErr] = useState("");
  const [gsc, setGsc] = useState(null);
  const [gscErr, setGscErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [homeHtml, robots, sitemap] = await Promise.all([
          fetch("/", { headers: { accept: "text/html" } }).then((r) => r.text()),
          fetch("/robots.txt").then((r) => (r.ok ? r.text() : "")).catch(() => ""),
          fetch("/sitemap.xml").then((r) => (r.ok ? r.text() : "")).catch(() => ""),
        ]);
        const doc = new DOMParser().parseFromString(homeHtml, "text/html");
        const g = (sel, attr = "content") => doc.querySelector(sel)?.getAttribute(attr) || "";
        const home = {
          title: doc.querySelector("title")?.textContent || "",
          desc: g('meta[name="description"]'),
          canonical: g('link[rel="canonical"]', "href"),
          ogTitle: g('meta[property="og:title"]'),
          ogImage: g('meta[property="og:image"]'),
          ogUrl: g('meta[property="og:url"]'),
          twitter: g('meta[name="twitter:card"]'),
          jsonld: doc.querySelectorAll('script[type="application/ld+json"]').length > 0,
          lang: doc.documentElement.getAttribute("lang") || "",
          viewport: g('meta[name="viewport"]'),
          themeColor: g('meta[name="theme-color"]'),
        };
        const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        const sitemapPaths = new Set(sitemapLocs.map((u) => { try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return u; } }));
        const routes = buildRoutes(home.title, home.desc);

        // Global checks
        const checks = [
          ["Page title", mark(!!home.title, false), home.title || "missing"],
          ["Meta description", mark(!!home.desc, false), home.desc ? `${home.desc.length} chars` : "missing"],
          ["Canonical tag", mark(!!home.canonical, false), home.canonical || "missing"],
          ["Open Graph (title/image/url)", mark(home.ogTitle && home.ogImage && home.ogUrl, false), home.ogUrl || "incomplete"],
          ["Twitter card", mark(!!home.twitter, false), home.twitter || "missing"],
          ["Structured data (JSON-LD)", mark(home.jsonld, false), home.jsonld ? "present" : "missing"],
          ["robots.txt", mark(/Sitemap:/i.test(robots), !!robots), robots ? "present + sitemap directive" : "missing"],
          ["sitemap.xml", mark(sitemapLocs.length > 0, false), `${sitemapLocs.length} URLs`],
          ["Sitemap covers all routes", mark(routes.every((r) => sitemapPaths.has(r.path)), true),
            `${routes.filter((r) => sitemapPaths.has(r.path)).length}/${routes.length} routes listed`],
          ["Correct domain in canonical", mark(/^https:\/\/medxflow\.ai/.test(home.canonical), true), home.canonical.replace(/^https?:\/\//, "").split("/")[0] || "?"],
          ["<html lang> + viewport", mark(home.lang && home.viewport, false), home.lang ? `lang=${home.lang}` : "missing"],
        ];

        // Per-page checks — fetch each route's served HTML and confirm it ships
        // its OWN head (prerendered), rather than the homepage card.
        const routeHtmls = await Promise.all(
          routes.map((r) => fetch(r.path, { headers: { accept: "text/html" } }).then((res) => res.text()).catch(() => ""))
        );
        const pages = routes.map((r, idx) => {
          const tLen = (r.title || "").length, dLen = (r.desc || "").length;
          const rdoc = new DOMParser().parseFromString(routeHtmls[idx] || "", "text/html");
          const ogu = rdoc.querySelector('meta[property="og:url"]')?.getAttribute("content") || "";
          let ownHead = false;
          try { ownHead = (new URL(ogu).pathname.replace(/\/$/, "") || "/") === r.path; } catch {}
          const hasWebPage = [...rdoc.querySelectorAll('script[type="application/ld+json"]')]
            .some((s) => /"WebPage"/.test(s.textContent || ""));
          const isHome = r.path === "/";
          return {
            path: r.path,
            title: r.title, desc: r.desc,
            titleOk: mark(tLen > 0 && tLen <= TITLE_MAX, tLen === 0 || tLen > TITLE_MAX || tLen < TITLE_MIN),
            descOk: mark(dLen >= DESC_MIN && dLen <= DESC_MAX, dLen > 0),
            inSitemap: sitemapPaths.has(r.path),
            ogOk: ownHead ? "pass" : "warn",
            jsonld: isHome || hasWebPage ? "pass" : "warn",
          };
        });

        const all = [...checks.map((c) => c[1]), ...pages.flatMap((p) => [p.titleOk, p.descOk, p.inSitemap ? "pass" : "fail", p.ogOk])];
        const score = Math.round(100 * (all.filter((s) => s === "pass").length + 0.5 * all.filter((s) => s === "warn").length) / all.length);
        setAudit({ checks, pages, score });
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  // Real rankings via Google Search Console (server function; may be unconfigured).
  useEffect(() => {
    fetch("/.netlify/functions/gsc", { headers: { "x-admin-password": pw } })
      .then((r) => r.json())
      .then(setGsc)
      .catch((e) => setGscErr(e.message));
  }, [pw]);

  const ICON = { pass: "✅", warn: "⚠️", fail: "❌" };

  return (
    <div>
      <style>{CSS}</style>
      {err && <div className="ad-err">{err}</div>}
      {!audit ? (
        <div className="ad-empty">Running SEO audit…</div>
      ) : (
        <>
          <div className="seo-top">
            <div className={"seo-score s-" + (audit.score >= 90 ? "good" : audit.score >= 70 ? "ok" : "bad")}>
              <b>{audit.score}</b><span>/ 100</span>
            </div>
            <div className="seo-score-lbl">
              <h3>On-page SEO Health</h3>
              <p>A self-audit of your own pages, meta, structured data and sitemap. It doesn't measure Google position — see Search Console below for that.</p>
            </div>
          </div>

          <div className="ad-card seo-card">
            <div className="seo-card-h">Site-wide checks</div>
            {audit.checks.map(([label, status, detail]) => (
              <div key={label} className="seo-row">
                <span className="seo-ic">{ICON[status]}</span>
                <span className="seo-label">{label}</span>
                <span className={"seo-detail sd-" + status}>{detail}</span>
              </div>
            ))}
          </div>

          <div className="ad-card seo-card">
            <div className="seo-card-h">Per-page ({audit.pages.length} routes)</div>
            <div className="ad-scroll ad-scroll-tall">
              <table>
                <thead><tr><th>Route</th><th>Title</th><th>Description</th><th>In sitemap</th><th>OG / JSON-LD</th></tr></thead>
                <tbody>
                  {audit.pages.map((p) => (
                    <tr key={p.path}>
                      <td className="ad-nowrap"><b>{p.path}</b></td>
                      <td>{ICON[p.titleOk]} <span className="seo-len">{(p.title || "").length}</span></td>
                      <td>{ICON[p.descOk]} <span className="seo-len">{(p.desc || "").length}</span></td>
                      <td>{p.inSitemap ? "✅" : "❌"}</td>
                      <td>{ICON[p.ogOk]} {p.ogOk === "warn" ? <span className="seo-hint">shares homepage card</span> : "own"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="seo-note">Each row's OG/JSON-LD is checked against the route's actual served HTML. ⚠️ means it's still serving the homepage card — expected in local dev (Vite serves the SPA shell); the production build prerenders every route (<code>scripts/prerender.mjs</code>), so these turn ✅ on the live site.</div>
          </div>

          <div className="ad-card seo-card">
            <div className="seo-card-h">🔍 Google Search Console — real rankings</div>
            {gscErr && <div className="ad-err">{gscErr}</div>}
            {!gsc ? (
              <div className="ad-empty">Checking Search Console…</div>
            ) : gsc.configured === false ? (
              <div className="seo-gsc-setup">
                <p><b>Not connected yet.</b> To show real impressions, clicks and average position for <code>medxflow.ai</code>:</p>
                <ol>
                  <li>In Google Search Console, verify the <code>medxflow.ai</code> property.</li>
                  <li>Create a Google Cloud <b>service account</b>, enable the <b>Search Console API</b>, download its JSON key.</li>
                  <li>Add that service account (its <code>client_email</code>) as a <b>user</b> on the GSC property.</li>
                  <li>Set two Netlify env vars: <code>GSC_SERVICE_ACCOUNT</code> = the JSON key (as a string) and <code>GSC_SITE_URL</code> = <code>https://medxflow.ai/</code> (or <code>sc-domain:medxflow.ai</code>).</li>
                </ol>
                <p className="seo-hint">{gsc.reason || "Once set, this panel shows your top queries and positions automatically."}</p>
              </div>
            ) : (
              <>
                <div className="ad-stats seo-gsc-stats">
                  <div className="ad-stat"><b>{gsc.totals?.clicks ?? "—"}</b><span>Clicks (28d)</span></div>
                  <div className="ad-stat"><b>{gsc.totals?.impressions ?? "—"}</b><span>Impressions</span></div>
                  <div className="ad-stat"><b>{gsc.totals?.ctr != null ? (gsc.totals.ctr * 100).toFixed(1) + "%" : "—"}</b><span>CTR</span></div>
                  <div className="ad-stat"><b>{gsc.totals?.position != null ? gsc.totals.position.toFixed(1) : "—"}</b><span>Avg. position</span></div>
                </div>
                <div className="ad-scroll ad-scroll-tall">
                  <table>
                    <thead><tr><th>Query</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead>
                    <tbody>
                      {(gsc.rows || []).map((r) => (
                        <tr key={r.query}>
                          <td>{r.query}</td>
                          <td>{r.clicks}</td>
                          <td>{r.impressions}</td>
                          <td>{(r.ctr * 100).toFixed(1)}%</td>
                          <td>{r.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const CSS = `
.seo-top{display:flex; align-items:center; gap:20px; margin-bottom:20px}
.seo-score{width:110px; height:110px; flex:none; border-radius:50%; display:grid; place-items:center; text-align:center; border:5px solid}
.seo-score b{font-size:34px; font-weight:800; line-height:1} .seo-score span{font-size:12px; opacity:.7}
.s-good{border-color:#3DDCC9; color:#3DDCC9} .s-ok{border-color:#F2C14E; color:#f2c14e} .s-bad{border-color:#E05A4E; color:#E05A4E}
.seo-score-lbl h3{margin:0 0 6px; font-size:19px; color:#E8EEF6} .seo-score-lbl p{margin:0; font-size:13.5px; color:rgba(232,238,246,.6); max-width:60ch; line-height:1.5}
.seo-card{margin-bottom:16px}
.seo-card-h{padding:14px 16px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.seo-row{display:flex; align-items:center; gap:12px; padding:11px 16px; border-bottom:1px solid rgba(207,224,242,.06); font-size:14px}
.seo-ic{flex:none}
.seo-label{flex:1; color:#E8EEF6}
.seo-detail{font-size:12.5px; max-width:44%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right}
.sd-pass{color:rgba(232,238,246,.5)} .sd-warn{color:#f2c14e} .sd-fail{color:#E05A4E}
.seo-len{font-size:11px; color:rgba(232,238,246,.45); font-variant-numeric:tabular-nums}
.seo-hint{color:#f2c14e; font-size:11.5px}
.seo-note{padding:12px 16px; font-size:12.5px; color:rgba(232,238,246,.55); line-height:1.5}
.seo-gsc-setup{padding:16px} .seo-gsc-setup p{margin:0 0 10px; font-size:14px; color:rgba(232,238,246,.85); line-height:1.55}
.seo-gsc-setup ol{margin:0 0 10px; padding-left:20px; color:rgba(232,238,246,.75); font-size:13.5px; line-height:1.7}
.seo-gsc-setup code{background:rgba(207,224,242,.12); padding:1px 6px; border-radius:5px; font-size:12.5px; color:#7FD8CE}
.seo-gsc-stats{margin:16px}
`;
