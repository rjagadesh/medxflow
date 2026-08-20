// Citable data asset: "RCM denial benchmarks". Aggregates published industry
// statistics on claim denials (rates, cost, causes, KPI benchmarks) with full
// source attribution. Built to earn AI-answer citations and backlinks - the
// kind of reference page journalists and LLMs link to. Answer-first (AEO) with
// Dataset + Article + FAQPage schema injected at prerender.

import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";
import AnswerBox from "./AnswerBox.jsx";
import {
  DENIAL_ANSWER, DENIAL_STATS, DENIAL_CAUSES, DENIAL_BENCHMARKS, DENIAL_FAQ, DENIAL_SOURCES,
} from "./rcm-denial-benchmarks.data.js";

export default function RcmDenialBenchmarks() {
  useEffect(() => {
    document.title = "RCM Denial Benchmarks: Claim Denial Rates & Statistics | MedXFlow";
    window.scrollTo(0, 0);
  }, []);

  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <style>{DB_CSS}</style>
        <Nav resources />

        <header className="pl-hero">
          <div className="wrap">
            <p className="eyebrow">RCM Data · Claim Denials</p>
            <h1>RCM denial benchmarks: claim denial rates and statistics</h1>
            <p className="pl-lede">
              A reference guide to medical claim denial rates, costs, root causes and the KPI benchmarks
              that define a healthy revenue cycle - compiled from published industry sources.
            </p>
            <AnswerBox label="The short answer">{DENIAL_ANSWER}</AnswerBox>
          </div>
        </header>

        <main className="wrap pl-main">
          <section className="pl-sec">
            <h2>Claim denials by the numbers</h2>
            <div className="db-stats">
              {DENIAL_STATS.map((s) => (
                <div key={s.label} className="db-stat">
                  <div className="db-stat-n">{s.n}</div>
                  <div className="db-stat-l">{s.label}</div>
                  <div className="db-stat-src">{s.source} · {s.year}</div>
                </div>
              ))}
            </div>
            <p className="db-caption">
              Figures are compiled from published third-party reports and are stated as ranges or approximate
              values, because reported numbers vary by year, payer and provider type. See sources below.
            </p>
          </section>

          <section className="pl-sec">
            <h2>Denial rate benchmarks: healthy vs at-risk</h2>
            <p>How the core revenue-cycle KPIs that drive denials and cash flow compare against common industry benchmarks.</p>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr><th>Metric</th><th>Healthy</th><th>Needs attention</th></tr>
                </thead>
                <tbody>
                  {DENIAL_BENCHMARKS.map((r) => (
                    <tr key={r.metric}>
                      <td>{r.metric}</td>
                      <td className="db-good">{r.healthy}</td>
                      <td className="db-bad">{r.attention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="pl-sec">
            <h2>The most common reasons claims are denied</h2>
            <div className="db-causes">
              {DENIAL_CAUSES.map((c, i) => (
                <div key={c.cause} className="db-cause">
                  <span className="db-cause-n">{i + 1}</span>
                  <div>
                    <b>{c.cause}</b>
                    <p>{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pl-sec">
            <h2>How AI agents reduce denials</h2>
            <p>
              Because most denials are avoidable and front-loaded, the highest-leverage fix is catching issues
              before the claim goes out. MedXFlow runs <a href="/ai-agents-rcm/">AI agents for the revenue cycle</a> that
              verify eligibility, secure prior authorization, and scrub coding for medical-necessity mismatches at the
              point of service, then work any denials that do occur while tracking root cause. See the
              interactive <a href="/denial-rate-calculator/">denial rate calculator</a> to estimate your own exposure,
              or the <a href="/denial-codes/">denial code lookup</a> to decode a specific CARC or RARC code.
            </p>
          </section>

          <section className="pl-sec pl-faq">
            <h2>Frequently asked questions</h2>
            {DENIAL_FAQ.map((f) => (
              <div key={f.q} className="pl-faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>

          <section className="pl-sec db-sources">
            <h2>Sources and methodology</h2>
            <p>
              The statistics on this page are compiled from published industry reports, current as of each report's
              date. Numbers are presented as ranges or approximate values to reflect variation across sources and years.
              This is a curated reference, not a MedXFlow proprietary study.
            </p>
            <ul>
              {DENIAL_SOURCES.map((s) => (
                <li key={s.org}>
                  <a href={s.url} target="_blank" rel="noopener nofollow">{s.org}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="pl-final">
            <h2>See where your revenue cycle is leaking</h2>
            <p>Book a free demo and watch MedXFlow's AI agents work eligibility, prior auth, coding and denials on real cases.</p>
            <a className="btn" href="/#cta">Book a free demo →</a>
          </section>
        </main>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const CSS = `
.pillar{--ink:#0D2B52;--spruce:#1A5DAD;--gorse:#17C3B2;--mist:#F2F6FB;--paper:#FFFFFF;--seaglass:#CFE0F2;
  background:var(--paper); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; line-height:1.65}
.pillar .wrap:not(.nav-in):not(.foot-in){max-width:1000px; margin:0 auto; padding:0 24px}
.pillar .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 12px}
.pillar h1{font-size:clamp(30px,5vw,46px); line-height:1.08; letter-spacing:-.02em; margin:0 0 16px; font-weight:800; text-wrap:balance}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:52px 0 40px}
.pl-lede{font-size:19px; color:#33455A; max-width:680px; margin:0 0 6px}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.pillar .btn:hover{background:var(--spruce)}
.pl-main{padding:12px 24px 40px}
.pl-sec{margin-top:44px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 14px; font-weight:800; text-wrap:balance}
.pl-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:72ch}
.pl-sec a{color:var(--spruce); text-decoration:none; font-weight:600}
.pl-sec a:hover{text-decoration:underline}
.pl-faq{border-top:1px solid var(--seaglass); padding-top:30px}
.pl-faq-item{margin-bottom:18px}
.pl-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800}
.pl-faq-item p{font-size:16px; color:#33455A; margin:0; max-width:72ch}
.pl-final{margin:52px 0 20px; padding:34px; background:var(--ink); border-radius:18px; text-align:center; color:#fff}
.pl-final h2{font-size:24px; margin:0 0 10px; font-weight:800; color:#fff}
.pl-final p{font-size:16px; color:#CFE0F2; margin:0 0 18px}
.pl-final .btn{background:var(--gorse); color:#062b28}
`;

const DB_CSS = `
.db-stats{display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; margin-top:6px}
.db-stat{background:var(--paper); border:1px solid var(--seaglass); border-radius:14px; padding:20px}
.db-stat-n{font-size:34px; font-weight:800; color:var(--ink); letter-spacing:-.02em; line-height:1}
.db-stat-l{font-size:14.5px; color:#33455A; margin:8px 0 10px; line-height:1.45}
.db-stat-src{font-size:11.5px; color:#7A8A9A; border-top:1px solid var(--mist); padding-top:8px}
.db-caption{font-size:13.5px; color:#7A8A9A; margin-top:14px; max-width:80ch}
.db-table-wrap{overflow-x:auto; margin-top:6px}
.db-table{width:100%; border-collapse:collapse; font-size:15.5px; min-width:520px}
.db-table th{text-align:left; background:var(--mist); color:var(--ink); font-weight:800; padding:12px 16px; border-bottom:2px solid var(--seaglass); font-size:13px; letter-spacing:.04em; text-transform:uppercase}
.db-table td{padding:12px 16px; border-bottom:1px solid var(--seaglass); color:#33455A}
.db-table td:first-child{font-weight:700; color:var(--ink)}
.db-good{color:#0E8A7D; font-weight:700}
.db-bad{color:#C2410C; font-weight:700}
.db-causes{display:grid; gap:12px; margin-top:6px}
.db-cause{display:flex; gap:14px; align-items:flex-start; background:var(--paper); border:1px solid var(--seaglass); border-radius:12px; padding:16px 18px}
.db-cause-n{flex:none; width:28px; height:28px; border-radius:8px; background:var(--ink); color:#fff; font-weight:800; font-size:14px; display:grid; place-items:center}
.db-cause b{font-size:16px; color:var(--ink)}
.db-cause p{font-size:14.5px; color:#5A6B7E; margin:4px 0 0; line-height:1.5}
.db-sources ul{margin:10px 0 0; padding-left:20px}
.db-sources li{font-size:15.5px; margin:7px 0}
`;
