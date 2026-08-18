import { useEffect, useState, useMemo } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";

// Free denial rate calculator - a linkable, rankable tool. The interactive part
// is client-side; the explanatory content is prerendered for SEO.

const usd = (n) => "$" + Math.round(n).toLocaleString();

export default function DenialRateCalculator() {
  useEffect(() => { document.title = "Denial Rate Calculator · MedXFlow"; window.scrollTo(0, 0); }, []);
  const [submitted, setSubmitted] = useState("");
  const [denied, setDenied] = useState("");
  const [avgClaim, setAvgClaim] = useState("");

  const r = useMemo(() => {
    const s = parseFloat(submitted) || 0, d = parseFloat(denied) || 0, a = parseFloat(avgClaim) || 0;
    if (!s || d > s) return null;
    const rate = (d / s) * 100;
    const band = rate < 5 ? { label: "Healthy", tone: "good" } : rate <= 10 ? { label: "Average", tone: "warn" } : { label: "Needs attention", tone: "bad" };
    const atRisk = a ? d * a : 0;
    return { rate, band, atRisk };
  }, [submitted, denied, avgClaim]);

  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{CALC_CSS}</style>
        <Nav resources />
        <main className="wrap calc-wrap">
          <nav className="calc-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>Denial Rate Calculator</span></nav>
          <p className="eyebrow">Free tool</p>
          <h1>Denial Rate Calculator</h1>
          <p className="calc-answer">Your claim denial rate is the number of claims denied divided by the number submitted in a period, shown as a percentage. Enter your numbers to calculate it and see how it compares to industry benchmarks.</p>

          <div className="calc-card">
            <div className="calc-inputs">
              <label>Claims submitted<input type="number" min="0" inputMode="numeric" value={submitted} onChange={(e) => setSubmitted(e.target.value)} placeholder="e.g. 1000" /></label>
              <label>Claims denied<input type="number" min="0" inputMode="numeric" value={denied} onChange={(e) => setDenied(e.target.value)} placeholder="e.g. 80" /></label>
              <label>Avg. claim value (optional)<input type="number" min="0" inputMode="numeric" value={avgClaim} onChange={(e) => setAvgClaim(e.target.value)} placeholder="$" /></label>
            </div>
            <div className="calc-result">
              {r ? (
                <>
                  <div className="calc-rate"><b>{r.rate.toFixed(1)}%</b><span>denial rate</span></div>
                  <div className={"calc-band cb-" + r.band.tone}>{r.band.label}</div>
                  {r.atRisk > 0 && <div className="calc-risk">{usd(r.atRisk)} in denied claim value</div>}
                </>
              ) : (
                <div className="calc-empty">Enter claims submitted and denied to see your denial rate.</div>
              )}
            </div>
          </div>

          <section className="calc-sec">
            <h2>What is a good denial rate?</h2>
            <p>Under 5% is generally considered healthy, and best-in-class practices run 2 to 4%. A denial rate above 10% usually points to a concentrated, fixable root cause, most often eligibility or prior authorization.</p>
          </section>
          <section className="calc-sec">
            <h2>How to calculate denial rate</h2>
            <p>Denial rate = (claims denied ÷ claims submitted) × 100, measured over a period such as a month. Track it by payer and by denial reason code (CARC/RARC) so you can see which payers and which causes drive the most denials.</p>
          </section>
          <section className="calc-sec">
            <h2>How to reduce your denial rate</h2>
            <p>Fix the top causes at the source: verify eligibility before the visit, secure prior authorizations, scrub coding for medical-necessity mismatches, and work denials fast while tracking root cause. Most denials come from a few repeatable, preventable issues.</p>
            <div className="calc-links">
              <a href="/blog/reduce-claim-denials-small-practice">How to reduce claim denials →</a>
              <a href="/denial-codes">Denial code lookup →</a>
            </div>
          </section>

          <div className="calc-cta">
            <p>MedXFlow AI agents catch denials at the source and work the rest by reason code.</p>
            <a className="btn" href="/products/denial-management">See MedXFlow Denial Management →</a>
          </div>
        </main>
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const CALC_CSS = `
.calc-wrap{max-width:760px; margin:0 auto; padding:36px 24px 80px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.calc-crumbs{font-size:13px; color:#6B7C8E; display:flex; gap:8px; align-items:center; margin-bottom:16px}
.calc-crumbs a{color:var(--spruce); text-decoration:none}
.calc-wrap h1{font-size:clamp(28px,4.5vw,40px); line-height:1.1; letter-spacing:-.02em; margin:2px 0 14px; font-weight:800; color:var(--ink)}
.calc-answer{font-size:18px; line-height:1.55; color:var(--ink); background:var(--mist); border-left:4px solid var(--spruce); border-radius:0 10px 10px 0; padding:14px 18px; margin:0 0 24px; font-weight:500}
.calc-card{display:grid; grid-template-columns:1.3fr 1fr; gap:20px; align-items:center; background:var(--paper); border:1px solid var(--seaglass); border-radius:16px; padding:22px; box-shadow:0 1px 2px rgba(16,40,80,.05)}
.calc-inputs{display:flex; flex-direction:column; gap:12px}
.calc-inputs label{display:flex; flex-direction:column; gap:5px; font-size:13px; font-weight:700; color:#45596E}
.calc-inputs input{background:#F4F7FA; border:1px solid var(--seaglass); border-radius:9px; color:var(--ink); padding:10px 12px; font:inherit; font-size:16px; outline:none}
.calc-inputs input:focus{border-color:var(--spruce)}
.calc-result{text-align:center; border-left:1px solid var(--seaglass); padding-left:18px}
.calc-rate b{display:block; font-size:46px; font-weight:800; line-height:1; color:var(--ink); font-variant-numeric:tabular-nums}
.calc-rate span{font-size:13px; color:#6B7C8E; font-weight:600}
.calc-band{display:inline-block; margin-top:12px; font-size:12.5px; font-weight:800; padding:4px 12px; border-radius:999px}
.cb-good{background:rgba(23,195,178,.16); color:#0E8A7D} .cb-warn{background:rgba(242,193,78,.2); color:#8a6212} .cb-bad{background:rgba(224,90,78,.16); color:#c0392b}
.calc-risk{margin-top:10px; font-size:13.5px; color:#45596E; font-weight:600}
.calc-empty{font-size:13.5px; color:#8494A6; line-height:1.5}
.calc-sec{margin-top:32px}
.calc-sec h2{font-size:21px; margin:0 0 8px; font-weight:800; color:var(--ink)}
.calc-sec p{font-size:16.5px; color:#33455A; margin:0; max-width:70ch}
.calc-links{display:flex; gap:20px; margin-top:12px; flex-wrap:wrap}
.calc-links a{color:var(--spruce); text-decoration:none; font-weight:700; font-size:15px}
.calc-cta{margin:36px 0 0; padding:24px; background:var(--ink); border-radius:16px; color:#fff}
.calc-cta p{font-size:16px; font-weight:600; margin:0 0 14px; color:#fff}
.calc-cta .btn{display:inline-block; background:var(--gorse); color:#062b28; padding:11px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:15px}
@media(max-width:620px){.calc-card{grid-template-columns:1fr}.calc-result{border-left:none; border-top:1px solid var(--seaglass); padding-left:0; padding-top:16px}}
`;
