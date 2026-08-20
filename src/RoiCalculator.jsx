// Interactive ROI calculator. Compares a practice's current loaded RCM labor
// cost (FTEs x hours x cost/hour) against MedXFlow's list pricing (plan by
// scale, plus optional Voice AI and EOB-to-ERA add-ons), with live SVG
// graphics. Pricing mirrors the MedXFlow pricing sheet. Explanatory content +
// WebApplication/FAQ schema is prerendered for SEO; the calculator runs client
// side. Figures are estimates; exact pricing depends on real workflow volumes.

import { useState, useMemo } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";

const WEEKS_PER_MONTH = 4.333;

// MedXFlow plans (fixed monthly, included MXU) from the pricing sheet.
const PLANS = [
  { key: "core", name: "Core", fixed: 1299, mxu: 10000, built: "1 to 3 providers" },
  { key: "professional", name: "Professional", fixed: 4499, mxu: 45000, built: "6 to 15 providers" },
  { key: "advanced", name: "Advanced", fixed: 9299, mxu: 100000, built: "20 to 30 providers" },
  { key: "enterprise", name: "Enterprise", fixed: 16999, mxu: 200000, built: "25 to 80 providers" },
  { key: "partner", name: "Partner", fixed: 23999, mxu: 500000, built: "Billing companies and BPOs" },
];
const planForProviders = (n) => n <= 3 ? PLANS[0] : n <= 15 ? PLANS[1] : n <= 30 ? PLANS[2] : PLANS[3];

// Voice AI add-on: $500/client + $0.12 per minute over 5,000 included.
const voiceMonthly = (calls, avgMin) => 500 + Math.max(0, calls * avgMin - 5000) * 0.12;
// EOB-to-ERA: marginal bands 0.25 / 0.20 / 0.15 per claim.
function eobMonthly(claims) {
  let cost = 0, rem = claims;
  const b1 = Math.min(rem, 100000); cost += b1 * 0.25; rem -= b1;
  const b2 = Math.min(rem, 100000); cost += b2 * 0.20; rem -= b2;
  cost += Math.max(rem, 0) * 0.15;
  return cost;
}

const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");

const COST_PRESETS = [
  { label: "In-house (US)", v: 32 },
  { label: "Blended", v: 22 },
  { label: "Offshore", v: 14 },
];

export default function RoiCalculator() {
  const [fte, setFte] = useState(4);
  const [hours, setHours] = useState(40);
  const [rate, setRate] = useState(32);
  const [providers, setProviders] = useState(10);
  const [isBpo, setIsBpo] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [calls, setCalls] = useState(1500);
  const [voiceFte, setVoiceFte] = useState(1);
  const [eobOn, setEobOn] = useState(false);
  const [claims, setClaims] = useState(6000);
  const [eobFte, setEobFte] = useState(2);

  const r = useMemo(() => {
    // Monthly loaded cost of one FTE, shared across the core work and add-ons.
    const perFte = hours * WEEKS_PER_MONTH * rate;
    const plan = isBpo ? PLANS[4] : planForProviders(providers);
    const lines = [
      { key: "core", label: "Core RCM workflows", current: fte * perFte, medx: plan.fixed },
    ];
    if (voiceOn) lines.push({ key: "voice", label: "Voice AI (payer calls)", current: voiceFte * perFte, medx: voiceMonthly(calls, 6.5) });
    if (eobOn) lines.push({ key: "eob", label: "EOB to ERA conversion", current: eobFte * perFte, medx: eobMonthly(claims) });

    const currentMonthly = lines.reduce((s, l) => s + l.current, 0);
    const medxMonthly = lines.reduce((s, l) => s + l.medx, 0);
    const saveMonthly = currentMonthly - medxMonthly;
    const pct = currentMonthly > 0 ? (saveMonthly / currentMonthly) * 100 : 0;
    return {
      lines, plan, currentMonthly, medxMonthly,
      saveMonthly, saveAnnual: saveMonthly * 12,
      currentAnnual: currentMonthly * 12, medxAnnual: medxMonthly * 12,
      pct, positive: saveMonthly > 0,
    };
  }, [fte, hours, rate, providers, isBpo, voiceOn, calls, voiceFte, eobOn, claims, eobFte]);

  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <style>{ROI_CSS}</style>
        <Nav resources />

        <header className="pl-hero">
          <div className="wrap">
            <p className="eyebrow">Free RCM Tool · ROI Calculator</p>
            <h1>MedXFlow ROI calculator</h1>
            <p className="pl-lede">Enter what the RCM work costs you today and see how it compares to MedXFlow's pricing - live.</p>
          </div>
        </header>

        <main className="wrap pl-main">
          <section className="roi-grid">
            {/* Inputs */}
            <div className="roi-inputs">
              <div className="roi-h">What the work costs you today</div>

              <Field label="RCM staff (FTEs)" value={fte} suffix={fte === 1 ? "person" : "people"}>
                <input type="range" min="1" max={isBpo ? 500 : 50} value={fte} onChange={(e) => setFte(+e.target.value)} />
              </Field>
              <Field label="Hours per week each" value={hours} suffix="hrs">
                <input type="range" min="10" max="60" value={hours} onChange={(e) => setHours(+e.target.value)} />
              </Field>
              <Field label="Fully-loaded cost per hour" value={usd(rate)} suffix="/hr">
                <input type="range" min="10" max="80" value={rate} onChange={(e) => setRate(+e.target.value)} />
                <div className="roi-presets">
                  {COST_PRESETS.map((p) => (
                    <button type="button" key={p.label} className={"roi-preset" + (rate === p.v ? " on" : "")} onClick={() => setRate(p.v)}>{p.label}</button>
                  ))}
                </div>
              </Field>

              <div className="roi-h roi-h2">Your scale</div>
              <Field label="Providers in your group" value={providers} suffix={providers === 1 ? "provider" : "providers"} disabled={isBpo}>
                <input type="range" min="1" max="80" value={providers} onChange={(e) => setProviders(+e.target.value)} disabled={isBpo} />
              </Field>
              <label className="roi-check">
                <input type="checkbox" checked={isBpo} onChange={(e) => {
                  const on = e.target.checked;
                  setIsBpo(on);
                  // BPOs run larger teams: default to a minimum of 50 FTEs.
                  // Turning it off returns to the standard 4-FTE default.
                  if (on) { if (fte < 50) setFte(50); }
                  else setFte(4);
                }} />
                We are a billing company / BPO (Partner plan)
              </label>

              <div className="roi-plan-pick">
                Suggested plan: <strong>{r.plan.name}</strong> · {usd(r.plan.fixed)}/mo · {r.plan.mxu.toLocaleString()} MXU included
                <span className="roi-plan-built">Built for {r.plan.built}</span>
              </div>

              <div className="roi-h roi-h2">Add-ons (optional)</div>
              <label className="roi-check">
                <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} />
                Voice AI agents <span className="roi-check-note">$500/mo + 5,000 min included</span>
              </label>
              {voiceOn && (
                <>
                  <Field label="Staff on payer calls today (FTEs)" value={voiceFte} suffix={voiceFte === 1 ? "person" : "people"} small>
                    <input type="range" min="0" max="20" value={voiceFte} onChange={(e) => setVoiceFte(+e.target.value)} />
                  </Field>
                  <Field label="Outbound payer calls / month" value={calls.toLocaleString()} suffix="calls" small>
                    <input type="range" min="100" max="10000" step="100" value={calls} onChange={(e) => setCalls(+e.target.value)} />
                    <div className="roi-sub">~6.5 min/call = {(calls * 6.5).toLocaleString()} min · MedXFlow {usd(voiceMonthly(calls, 6.5))}/mo</div>
                  </Field>
                </>
              )}
              <label className="roi-check">
                <input type="checkbox" checked={eobOn} onChange={(e) => setEobOn(e.target.checked)} />
                EOB to ERA conversion <span className="roi-check-note">per claim, no platform fee</span>
              </label>
              {eobOn && (
                <>
                  <Field label="Staff posting paper EOBs today (FTEs)" value={eobFte} suffix={eobFte === 1 ? "person" : "people"} small>
                    <input type="range" min="0" max="20" value={eobFte} onChange={(e) => setEobFte(+e.target.value)} />
                  </Field>
                  <Field label="Paper/PDF EOB claims / month" value={claims.toLocaleString()} suffix="claims" small>
                    <input type="range" min="500" max="120000" step="500" value={claims} onChange={(e) => setClaims(+e.target.value)} />
                    <div className="roi-sub">MedXFlow {usd(eobMonthly(claims))}/mo</div>
                  </Field>
                </>
              )}
            </div>

            {/* Results */}
            <div className="roi-out">
              <div className="roi-cards">
                <div className="roi-card roi-card-today">
                  <span className="roi-card-l">Your cost today</span>
                  <span className="roi-card-n">{usd(r.currentMonthly)}<i>/mo</i></span>
                  <span className="roi-card-sub">{usd(r.currentAnnual)} / year</span>
                </div>
                <div className="roi-card roi-card-mx">
                  <span className="roi-card-l">With MedXFlow</span>
                  <span className="roi-card-n">{usd(r.medxMonthly)}<i>/mo</i></span>
                  <span className="roi-card-sub">{usd(r.medxAnnual)} / year</span>
                </div>
              </div>

              <div className={"roi-save" + (r.positive ? "" : " neg")}>
                <div className="roi-save-main">
                  <span className="roi-save-l">{r.positive ? "You save" : "Added cost"}</span>
                  <span className="roi-save-n">{usd(Math.abs(r.saveMonthly))}<i>/mo</i></span>
                </div>
                <Donut pct={Math.max(0, Math.min(100, r.pct))} positive={r.positive} />
                <div className="roi-save-annual">
                  <span>{usd(Math.abs(r.saveAnnual))}</span> saved per year
                </div>
              </div>

              {r.lines.length > 1 && (
                <div className="roi-breakdown">
                  <div className="roi-brk-head">
                    <span>Where it comes from</span><span>Today</span><span>MedXFlow</span><span>Save/mo</span>
                  </div>
                  {r.lines.map((l) => {
                    const s = l.current - l.medx;
                    return (
                      <div className="roi-brk-row" key={l.key}>
                        <span className="roi-brk-l">{l.label}</span>
                        <span className="roi-brk-v">{usd(l.current)}</span>
                        <span className="roi-brk-v">{usd(l.medx)}</span>
                        <span className={"roi-brk-s" + (s >= 0 ? "" : " neg")}>{s >= 0 ? "" : "+"}{usd(Math.abs(s))}</span>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Graphics */}
            <div className="roi-viz">
              <div className="roi-chart-block">
                <h3 className="roi-chart-h">Today vs MedXFlow, per month</h3>
                <Bars current={r.currentMonthly} medx={r.medxMonthly} />
              </div>
              {r.positive && (
                <div className="roi-chart-block">
                  <h3 className="roi-chart-h">Cumulative savings over 12 months</h3>
                  <AreaChart monthly={r.saveMonthly} />
                </div>
              )}

              {!r.positive && (
                <p className="roi-note-neg">At this volume the plan costs more than your current labor. That usually means a smaller plan or a partial rollout fits better - <a href="/#cta">talk to us</a> and we will right-size it.</p>
              )}
              <p className="roi-disclaimer">Estimate only, based on MedXFlow list pricing. Plans are priced per completed workflow outcome (MXU), so exact cost depends on your real volumes. Send three months of workflow volumes and we will price it precisely.</p>
            </div>
          </section>

          <section className="pl-sec">
            <h2>How MedXFlow pricing works</h2>
            <p>MedXFlow prices finished work, not seats and not a percentage of collections. Each workflow carries a published weight in MedXFlow Units (MXU), listed at $0.10 each, and every plan includes a monthly MXU allowance with a lower effective rate as you scale. There is no per-seat fee and no cut of your revenue, so the savings from automating a workflow stay with you.</p>
          </section>
          <section className="pl-sec">
            <h2>What the calculator compares</h2>
            <p>On one side is your current loaded cost: the FTEs, hours and fully-loaded hourly cost (salary plus benefits and overhead) of the staff doing the RCM work you would hand to MedXFlow. On the other is MedXFlow's list price: the plan that fits your scale, plus any Voice AI or EOB-to-ERA add-ons. The gap is your saving. Because MedXFlow rates are benchmarked to sit below the loaded cost of the same work, most groups see a lower monthly cost with capacity that scales without hiring.</p>
          </section>

          <section className="pl-sec pl-faq">
            <h2>Frequently asked questions</h2>
            {FAQ.map((f) => (
              <div key={f.q} className="pl-faq-item"><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </section>

          <section className="pl-final">
            <h2>Want your exact number?</h2>
            <p>Send us three months of workflow volumes and we will price it precisely, and show you the ROI on your real data.</p>
            <a className="btn" href="/#cta">Book a pricing walkthrough →</a>
          </section>
        </main>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

function Field({ label, value, suffix, children, disabled, small }) {
  return (
    <div className={"roi-field" + (disabled ? " off" : "") + (small ? " sm" : "")}>
      <div className="roi-field-top">
        <span className="roi-field-l">{label}</span>
        <span className="roi-field-v">{value}{suffix ? <i> {suffix}</i> : null}</span>
      </div>
      {children}
    </div>
  );
}

// Animated horizontal comparison bars.
function Bars({ current, medx }) {
  const max = Math.max(current, medx, 1);
  const rows = [
    { l: "Your cost today", v: current, cls: "today" },
    { l: "MedXFlow", v: medx, cls: "mx" },
  ];
  return (
    <div className="roi-bars">
      {rows.map((row) => (
        <div className="roi-bar-row" key={row.l}>
          <span className="roi-bar-label">{row.l}</span>
          <div className="roi-bar-track">
            <div className={"roi-bar-fill " + row.cls} style={{ width: (row.v / max) * 100 + "%" }} />
          </div>
          <span className="roi-bar-val">{usd(row.v)}</span>
        </div>
      ))}
    </div>
  );
}

// Animated donut for percent saved.
function Donut({ pct, positive }) {
  const R = 52, C = 2 * Math.PI * R;
  const off = C * (1 - pct / 100);
  return (
    <svg className="roi-donut" viewBox="0 0 140 140" width="96" height="96" aria-hidden="true">
      <circle cx="70" cy="70" r={R} fill="none" stroke="#E3ECF6" strokeWidth="14" />
      <circle cx="70" cy="70" r={R} fill="none" stroke={positive ? "#17C3B2" : "#C2410C"} strokeWidth="14"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
        transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset .5s ease" }} />
      <text x="70" y="66" textAnchor="middle" className="roi-donut-n">{Math.round(pct)}%</text>
      <text x="70" y="88" textAnchor="middle" className="roi-donut-l">{positive ? "lower" : "higher"}</text>
    </svg>
  );
}

// 12-month cumulative savings area chart (linear accrual).
function AreaChart({ monthly }) {
  // Generous left padding so the dollar tick labels never clip, and top padding
  // (via maxY headroom) so the endpoint value sits clear of the top edge.
  const W = 580, H = 200, padL = 84, padR = 22, padT = 30, padB = 34;
  const annual = monthly * 12;
  const maxY = Math.max(annual * 1.12, 1);
  const x = (m) => padL + (m / 12) * (W - padL - padR);
  const y = (v) => H - padB - (v / maxY) * (H - padT - padB);
  const months = Array.from({ length: 13 }, (_, i) => i);
  const line = months.map((m) => `${x(m)},${y(monthly * m)}`).join(" ");
  const area = `M ${x(0)},${y(0)} L ${months.map((m) => `${x(m)},${y(monthly * m)}`).join(" L ")} L ${x(12)},${y(0)} Z`;
  return (
    <svg className="roi-area" viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cumulative savings over 12 months">
      <defs>
        <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17C3B2" stopOpacity="0.28" />
          <stop offset="1" stopColor="#17C3B2" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={padL} y1={y(annual * f)} x2={W - padR} y2={y(annual * f)} stroke="#EAF1F8" strokeWidth="1" />
          <text x={padL - 10} y={y(annual * f) + 4} textAnchor="end" className="roi-area-tick">{usd(annual * f)}</text>
        </g>
      ))}
      <path d={area} fill="url(#roiFill)" />
      <polyline points={line} fill="none" stroke="#0E8A7D" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={x(12)} cy={y(annual)} r="5" fill="#0E8A7D" stroke="#fff" strokeWidth="2" />
      <text x={W - padR} y={y(annual) - 12} textAnchor="end" className="roi-area-end">{usd(annual)} / yr</text>
      {[0, 3, 6, 9, 12].map((m) => (
        <text key={m} x={x(m)} y={H - 12} textAnchor="middle" className="roi-area-mtick">{m === 0 ? "now" : "m" + m}</text>
      ))}
    </svg>
  );
}

const FAQ = [
  { q: "How is MedXFlow priced?", a: "MedXFlow prices finished work, not seats or a percentage of collections. Each workflow has a published weight in MedXFlow Units (MXU, listed at $0.10 each), and each plan includes a monthly MXU allowance with a lower effective rate as volume grows. Voice AI and EOB-to-ERA are optional add-ons." },
  { q: "How does the ROI calculator estimate savings?", a: "It compares your current loaded RCM labor cost (FTEs times hours times fully-loaded cost per hour) against MedXFlow's list price for the plan that fits your scale, plus any add-ons you enable. The difference is your estimated monthly and annual saving." },
  { q: "Is this an exact quote?", a: "No. It is a list-price estimate. Because plans are priced per completed workflow outcome, your exact cost depends on your real workflow volumes. Send three months of volumes and MedXFlow will price it precisely." },
  { q: "Does MedXFlow charge a percentage of collections?", a: "No. There are no seat fees and no percentage of collections. You pay for finished work at a rate benchmarked to sit below the loaded cost of doing the same work in-house or offshore." },
];

const CSS = `
.pillar{--ink:#0D2B52;--spruce:#1A5DAD;--gorse:#17C3B2;--mist:#F2F6FB;--paper:#FFFFFF;--seaglass:#CFE0F2;
  background:var(--paper); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; line-height:1.65}
.pillar .wrap:not(.nav-in):not(.foot-in){max-width:1400px; margin:0 auto; padding:0 40px}
.pillar .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 12px}
.pillar h1{font-size:clamp(23px,3.2vw,33px); line-height:1.08; letter-spacing:-.02em; margin:0 0 8px; font-weight:800; text-wrap:balance}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:72px 0 10px}
.pl-lede{font-size:15px; color:#33455A; max-width:760px; margin:0}
.pillar .eyebrow{margin-bottom:5px}
.pl-main{padding-top:10px}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px; cursor:pointer; border:0}
.pillar .btn:hover{background:var(--spruce)}
.pl-main{padding:12px 24px 40px}
.pl-sec{margin-top:44px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 14px; font-weight:800; text-wrap:balance}
.pl-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:72ch}
.pl-sec a{color:var(--spruce); text-decoration:none; font-weight:600}
.pl-faq{border-top:1px solid var(--seaglass); padding-top:30px}
.pl-faq-item{margin-bottom:18px}
.pl-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800}
.pl-faq-item p{font-size:16px; color:#33455A; margin:0; max-width:72ch}
.pl-final{margin:52px 0 20px; padding:34px; background:var(--ink); border-radius:18px; text-align:center; color:#fff}
.pl-final h2{font-size:24px; margin:0 0 10px; font-weight:800; color:#fff}
.pl-final p{font-size:16px; color:#CFE0F2; margin:0 0 18px}
.pl-final .btn{background:var(--gorse); color:#062b28}
`;

const ROI_CSS = `
.roi-grid{display:grid; grid-template-columns:1.05fr .92fr 1.06fr; gap:13px; margin-top:12px; align-items:start}
.roi-inputs, .roi-out, .roi-viz{background:var(--paper); border:1px solid var(--seaglass); border-radius:16px; padding:14px 15px}
.roi-out, .roi-viz{background:linear-gradient(180deg,#fff,#FAFCFE)}
.roi-h{font-size:12px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; color:var(--spruce); margin:0 0 9px}
.roi-h2{margin-top:12px; padding-top:11px; border-top:1px solid var(--mist)}
.roi-field{margin:0 0 9px}
.roi-field.off{opacity:.45}
.roi-field.sm{margin:6px 0 8px; padding-left:12px; border-left:2px solid var(--seaglass)}
.roi-field-top{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px}
.roi-field-l{font-size:13.5px; font-weight:600; color:#33455A}
.roi-field-v{font-size:16px; font-weight:800; color:var(--ink); font-variant-numeric:tabular-nums}
.roi-field-v i{font-size:12px; font-weight:600; color:#7A8A9A; font-style:normal}
.roi-field input[type=range]{width:100%; accent-color:var(--gorse); height:16px; margin:2px 0}
.roi-presets{display:flex; gap:6px; margin-top:6px}
.roi-preset{border:1px solid var(--seaglass); background:#fff; color:#5A6B7E; font-size:12px; font-weight:700; padding:5px 10px; border-radius:8px; cursor:pointer}
.roi-preset.on{background:var(--ink); color:#fff; border-color:var(--ink)}
.roi-sub{font-size:12px; color:#7A8A9A; margin-top:4px}
.roi-check{display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:600; color:#33455A; margin:7px 0; cursor:pointer}
.roi-check input{width:16px; height:16px; accent-color:var(--gorse)}
.roi-check-note{font-size:12px; font-weight:600; color:#7A8A9A}
.roi-plan-pick{margin-top:10px; background:var(--mist); border:1px solid var(--seaglass); border-radius:10px; padding:10px 12px; font-size:13px; color:#33455A}
.roi-plan-pick strong{color:var(--ink)}
.roi-plan-built{display:block; font-size:12px; color:#7A8A9A; margin-top:2px}

.roi-cards{display:grid; grid-template-columns:1fr 1fr; gap:10px}
.roi-card{border-radius:12px; padding:12px 14px; border:1px solid var(--seaglass)}
.roi-card-today{background:#FBFDFE}
.roi-card-mx{background:var(--ink); border-color:var(--ink)}
.roi-card-l{font-size:11.5px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; color:#7A8A9A}
.roi-card-mx .roi-card-l{color:#9FC3E8}
.roi-card-n{display:block; font-size:24px; font-weight:800; color:var(--ink); letter-spacing:-.02em; margin-top:3px; font-variant-numeric:tabular-nums}
.roi-card-mx .roi-card-n{color:#fff}
.roi-card-n i{font-size:13px; font-weight:600; font-style:normal; color:#7A8A9A}
.roi-card-mx .roi-card-n i{color:#9FC3E8}
.roi-card-sub{font-size:12px; color:#7A8A9A; margin-top:1px}
.roi-card-mx .roi-card-sub{color:#9FC3E8}

.roi-save{display:grid; grid-template-columns:1fr auto; align-items:center; gap:8px; margin-top:10px; padding:12px 15px; border-radius:14px;
  background:linear-gradient(120deg,#E7F6F2,#F2FBF9); border:1px solid #B7E5DB}
.roi-save.neg{background:linear-gradient(120deg,#FDECE3,#FEF6F1); border-color:#F6C9AF}
.roi-save-l{font-size:12px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; color:#0E8A7D}
.roi-save.neg .roi-save-l{color:#C2410C}
.roi-save-n{display:block; font-size:30px; font-weight:800; color:var(--ink); letter-spacing:-.02em; font-variant-numeric:tabular-nums}
.roi-save-n i{font-size:15px; font-weight:600; font-style:normal; color:#5A6B7E}
.roi-save-annual{grid-column:1 / -1; font-size:13.5px; color:#33455A; padding-top:8px; margin-top:2px; border-top:1px solid rgba(14,138,125,.18)}
.roi-save-annual span{font-weight:800; color:#0E8A7D}
.roi-save.neg .roi-save-annual span{color:#C2410C}
.roi-donut{flex:none}
.roi-donut-n{font-size:26px; font-weight:800; fill:var(--ink)}
.roi-donut-l{font-size:11px; font-weight:700; fill:#7A8A9A; letter-spacing:.04em; text-transform:uppercase}

.roi-breakdown{margin-top:12px; border:1px solid var(--seaglass); border-radius:12px; overflow:hidden}
.roi-brk-head, .roi-brk-row{display:grid; grid-template-columns:1.7fr 1fr 1fr 1fr; gap:8px; align-items:center; padding:8px 13px}
.roi-brk-head{background:var(--mist); font-size:10.5px; font-weight:800; letter-spacing:.03em; text-transform:uppercase; color:#7A8A9A}
.roi-brk-head span:not(:first-child){text-align:right}
.roi-brk-row{border-top:1px solid var(--mist); font-size:13.5px}
.roi-brk-l{font-weight:700; color:var(--ink)}
.roi-brk-v{color:#5A6B7E; font-weight:600; text-align:right; font-variant-numeric:tabular-nums}
.roi-brk-s{color:#0E8A7D; font-weight:800; text-align:right; font-variant-numeric:tabular-nums}
.roi-brk-s.neg{color:#C2410C}
.roi-chart-block{margin-top:14px}
.roi-viz .roi-chart-block:first-child{margin-top:0}
.roi-chart-h{font-size:12.5px; font-weight:800; color:var(--ink); margin:0 0 8px}
.roi-bars{display:grid; gap:9px}
.roi-bar-row{display:grid; grid-template-columns:104px 1fr auto; align-items:center; gap:10px}
.roi-bar-label{font-size:12.5px; font-weight:600; color:#5A6B7E}
.roi-bar-track{height:18px; background:var(--mist); border-radius:6px; overflow:hidden}
.roi-bar-fill{height:100%; border-radius:6px; transition:width .5s cubic-bezier(.4,0,.2,1)}
.roi-bar-fill.today{background:linear-gradient(90deg,#94A9BF,#6E869F)}
.roi-bar-fill.mx{background:linear-gradient(90deg,var(--gorse),#0E8A7D)}
.roi-bar-val{font-size:13px; font-weight:800; color:var(--ink); font-variant-numeric:tabular-nums}
.roi-area{display:block; background:#fff; border:1px solid var(--mist); border-radius:10px}
.roi-area-tick{font-size:11.5px; fill:#5A6B7E; font-weight:600; font-variant-numeric:tabular-nums}
.roi-area-mtick{font-size:12px; fill:#5A6B7E; font-weight:700}
.roi-area-end{font-size:14px; fill:#0E8A7D; font-weight:800}
.roi-note-neg{font-size:13.5px; color:#C2410C; margin-top:11px; font-weight:500}
.roi-note-neg a{color:#C2410C; font-weight:700}
.roi-disclaimer{font-size:11.5px; color:#7A8A9A; margin-top:10px; line-height:1.45}
@media(max-width:1180px){.roi-grid{grid-template-columns:1fr 1fr}.roi-viz{grid-column:1 / -1}}
@media(max-width:760px){.roi-grid{grid-template-columns:1fr}.roi-viz{grid-column:auto}}
`;
