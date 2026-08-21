// Interactive ROI calculator. Compares a practice's current loaded RCM labor
// cost against MedXFlow list pricing (plan by scale), with live SVG graphics.
// Pricing mirrors the MedXFlow
// pricing sheet. Explanatory content + schema is prerendered for SEO.

import { useState, useMemo } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";

const WEEKS_PER_MONTH = 4.333;
const openDemo = () => window.dispatchEvent(new Event("eirim:book-demo"));

const PLANS = [
  { key: "core", name: "Core", fixed: 1299, mxu: 10000, built: "1 to 2 providers" },
  { key: "professional", name: "Professional", fixed: 4499, mxu: 45000, built: "3 to 6 providers" },
  { key: "advanced", name: "Advanced", fixed: 9299, mxu: 100000, built: "7 to 12 providers" },
  { key: "enterprise", name: "Enterprise", fixed: 16999, mxu: 200000, built: "13 to 18 providers" },
  { key: "partner", name: "Partner", fixed: 23999, mxu: 500000, built: "19 to 25 providers, or billing companies" },
];
const planForProviders = (n) => n <= 2 ? PLANS[0] : n <= 6 ? PLANS[1] : n <= 12 ? PLANS[2] : n <= 18 ? PLANS[3] : PLANS[4];
// Typical RCM headcount per package, so the FTE default tracks the plan/scale.
const FTE_FOR_PLAN = { core: 2, professional: 4, advanced: 8, enterprise: 12, partner: 50 };
const fteForPlan = (providers) => FTE_FOR_PLAN[planForProviders(providers).key];
const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
const usdK = (n) => n >= 1000 ? "$" + Math.round(n / 1000) + "K" : "$" + Math.round(n);

const COST_PRESETS = [
  { label: "In-house (US)", ic: "🏢", v: 32 },
  { label: "Blended", ic: "🏬", v: 22 },
  { label: "Offshore", ic: "🌐", v: 14 },
];

export default function RoiCalculator() {
  const [providers, setProviders] = useState(10);
  const [isBpo, setIsBpo] = useState(false);
  const [fte, setFte] = useState(fteForPlan(10));
  const [hours, setHours] = useState(40);
  const [rate, setRate] = useState(32);

  const r = useMemo(() => {
    const perFte = hours * WEEKS_PER_MONTH * rate;
    const plan = isBpo ? PLANS[4] : planForProviders(providers);
    const currentMonthly = fte * perFte;
    const medxMonthly = plan.fixed;
    const saveMonthly = currentMonthly - medxMonthly;
    const pct = currentMonthly > 0 ? (saveMonthly / currentMonthly) * 100 : 0;
    return { plan, currentMonthly, medxMonthly, saveMonthly, saveAnnual: saveMonthly * 12,
      currentAnnual: currentMonthly * 12, medxAnnual: medxMonthly * 12, pct, positive: saveMonthly > 0 };
  }, [fte, hours, rate, providers, isBpo]);

  return (
    <LanguageProvider>
      <div className="eirim roi2">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <Nav resources />

        <div className="r2-page">
          <div className="r2-topbar">
            <div className="r2-topbar-in">
              <div className="r2-live"><span className="r2-dot" /> Live pricing <span className="r2-live-dot">·</span> Real-time comparison <span className="r2-ic-i">ⓘ</span></div>
            </div>
          </div>

          <div className="r2-wrap">
            <header className="r2-head">
              <h1>See Your RCM ROI with MedXFlow</h1>
              <p>Enter your details to see how much you can save and compare with MedXFlow pricing - live.</p>
            </header>

            <div className="r2-grid">
              {/* LEFT: form */}
              <div className="r2-forms">
                <div className="r2-card">
                  <div className="r2-card-t">1. How Big Is Your Practice?</div>
                  <SliderRow icon="👤" label="Number of Providers" hint="Total providers / clinicians in your group"
                    value={providers} unit="providers" min={1} max={25} minLabel="1" maxLabel="25"
                    onChange={(n) => { setProviders(n); if (!isBpo) setFte(fteForPlan(n)); }} disabled={isBpo} />
                  <label className="r2-check">
                    <input type="checkbox" checked={isBpo} onChange={(e) => {
                      const on = e.target.checked; setIsBpo(on);
                      if (on) setFte(50); else setFte(fteForPlan(providers));
                    }} />
                    <span>We are a billing company / BPO (Partner plan)</span>
                  </label>
                </div>

                <div className="r2-card">
                  <div className="r2-card-t">2. Your Current RCM Workload</div>
                  <SliderRow icon="👥" label="RCM Staff (FTEs)" hint="Full-time equivalents" info
                    value={fte} unit={fte === 1 ? "person" : "people"} min={1} max={isBpo ? 500 : 20} minLabel="1" maxLabel={isBpo ? "500" : "20+"}
                    onChange={setFte} />
                  <SliderRow icon="🕐" label="Hours per week each" hint="Average hours spent on RCM work" info
                    value={hours} unit="hrs" min={10} max={60} minLabel="10" maxLabel="60+" onChange={setHours} />
                  <SliderRow icon="💲" label="Fully-loaded cost per hour" hint="Including salary, benefits, overhead" info
                    value={usd(rate)} unit="/hr" min={15} max={100} minLabel="$15" maxLabel="$100+" onChange={setRate} rawValue={rate} />
                  <div className="r2-work">
                    <div className="r2-work-l">Workplace</div>
                    <div className="r2-toggle">
                      {COST_PRESETS.map((p) => (
                        <button type="button" key={p.label} className={"r2-tog" + (rate === p.v ? " on" : "")} onClick={() => setRate(p.v)}>
                          <span className="r2-tog-ic">{p.ic}</span>{p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: summary */}
              <div className="r2-summary">
                <div className="r2-sum-t">Your ROI Summary</div>

                <div className="r2-plan">
                  <span className="r2-plan-star">★</span>
                  <div>
                    <div className="r2-plan-l"><b>Suggested plan: {r.plan.name}</b> · {usd(r.plan.fixed)}/mo · {r.plan.mxu.toLocaleString()} MXU included</div>
                    <div className="r2-plan-b">Built for {r.plan.built}</div>
                  </div>
                </div>

                <div className="r2-costs">
                  <div className="r2-cost">
                    <div className="r2-cost-l">Your cost today</div>
                    <div className="r2-cost-n">{usd(r.currentMonthly)}<i>/mo</i></div>
                    <div className="r2-cost-sub">{usd(r.currentAnnual)} / year</div>
                  </div>
                  <div className="r2-cost r2-cost-mx">
                    <div className="r2-cost-l">With MedXFlow</div>
                    <div className="r2-cost-n">{usd(r.medxMonthly)}<i>/mo</i></div>
                    <div className="r2-cost-sub">{usd(r.medxAnnual)} / year</div>
                  </div>
                  <div className={"r2-cost r2-cost-save" + (r.positive ? "" : " neg")}>
                    <div className="r2-cost-l">{r.positive ? "You save" : "Added cost"}</div>
                    <div className="r2-cost-save-row">
                      <div>
                        <div className="r2-cost-n">{usd(Math.abs(r.saveMonthly))}<i>/mo</i></div>
                        <div className="r2-cost-sub">{usd(Math.abs(r.saveAnnual))} saved per year</div>
                      </div>
                      <Donut pct={Math.max(0, Math.min(100, r.pct))} positive={r.positive} />
                    </div>
                  </div>
                </div>

                <div className="r2-viz-row">
                  <div className="r2-panel">
                    <div className="r2-panel-t">Today vs MedXFlow, per month</div>
                    <Bars current={r.currentMonthly} medx={r.medxMonthly} />
                  </div>
                  <div className="r2-note">
                    <span className="r2-note-ic">🛡️</span>
                    <p>MedXFlow reduces manual RCM costs and improves cash flow with AI-powered automation.</p>
                  </div>
                </div>

                <div className="r2-viz-row">
                  <div className="r2-panel">
                    <div className="r2-panel-t">Cumulative savings over 12 months</div>
                    {r.positive
                      ? <AreaChart monthly={r.saveMonthly} />
                      : <p className="r2-neg-msg">At this volume the plan costs more than your current labor. A smaller plan or partial rollout usually fits better - <a href="#" onClick={(e) => { e.preventDefault(); openDemo(); }}>talk to us</a>.</p>}
                  </div>
                  <div className="r2-note">
                    <span className="r2-note-ic">📊</span>
                    <p><b>How it works</b><br />We analyze your inputs and compare them to MedXFlow list pricing in real time. Your exact cost depends on actual workflow volumes. Share your volumes and we will price it precisely.</p>
                  </div>
                </div>

                <div className="r2-benefits">
                  {[["💸", "Lower costs", "Reduce manual work and operating expenses"],
                    ["⚡", "Faster reimbursements", "Improve cash flow and revenue cycle"],
                    ["📈", "Scalable growth", "Automate more as your practice grows"]].map(([ic, h, p]) => (
                    <div className="r2-benefit" key={h}>
                      <span className="r2-benefit-ic">{ic}</span>
                      <div><b>{h}</b><span>{p}</span></div>
                    </div>
                  ))}
                </div>

                <div className="r2-cta">
                  <span className="r2-cta-ic">📅</span>
                  <div className="r2-cta-txt">
                    <b>Want a precise quote?</b>
                    <span>Send us your 3 months of workflow volumes and we will build a custom proposal.</span>
                  </div>
                  <button className="r2-cta-btn" onClick={openDemo}>Get My Custom Quote →</button>
                </div>
              </div>
            </div>

            <p className="r2-disclaimer">Estimate only, based on MedXFlow list pricing. Plans are priced per completed workflow outcome (MXU), so exact cost depends on your real volumes. Send three months of workflow volumes and we will price it precisely.</p>

            <section className="r2-seo">
              <h2>How MedXFlow pricing works</h2>
              <p>MedXFlow prices finished work, not seats and not a percentage of collections. Each workflow carries a published weight in MedXFlow Units (MXU), listed at $0.10 each, and every plan includes a monthly MXU allowance with a lower effective rate as you scale. There is no per-seat fee and no cut of your revenue, so the savings from automating a workflow stay with you.</p>
              <h2>What the calculator compares</h2>
              <p>On one side is your current loaded cost: the FTEs, hours and fully-loaded hourly cost of the staff doing the RCM work you would automate. On the other is MedXFlow's list price: the plan that fits your scale. The gap is your saving.</p>
              <div className="r2-faq">
                {FAQ.map((f) => (<div className="r2-faq-item" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
              </div>
            </section>
          </div>
        </div>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

function SliderRow({ icon, label, hint, info, value, unit, min, max, step, minLabel, maxLabel, onChange, rawValue, disabled, compact }) {
  const v = rawValue !== undefined ? rawValue : value;
  return (
    <div className={"r2-field" + (compact ? " r2-field-c" : "") + (disabled ? " off" : "")}>
      <div className="r2-field-head">
        <span className="r2-field-ic">{icon}</span>
        <div className="r2-field-meta">
          <div className="r2-field-l">{label}{info ? <span className="r2-i">ⓘ</span> : null}</div>
          {hint ? <div className="r2-field-h">{hint}</div> : null}
        </div>
        <div className="r2-field-val">{value}<span>{unit}</span></div>
      </div>
      <input type="range" min={min} max={max} step={step || 1} value={v} disabled={disabled}
        onChange={(e) => onChange(+e.target.value)} />
      <div className="r2-field-scale"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}

function Donut({ pct, positive }) {
  const R = 44, C = 2 * Math.PI * R;
  const off = C * (1 - pct / 100);
  return (
    <svg className="r2-donut" viewBox="0 0 120 120" width="94" height="94" aria-hidden="true">
      <circle cx="60" cy="60" r={R} fill="none" stroke="#E2E8F0" strokeWidth="12" />
      <circle cx="60" cy="60" r={R} fill="none" stroke={positive ? "#16A34A" : "#DC2626"} strokeWidth="12"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
        transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset .5s ease" }} />
      <text x="60" y="57" textAnchor="middle" className="r2-donut-n">{Math.round(pct)}%</text>
      <text x="60" y="75" textAnchor="middle" className="r2-donut-l">{positive ? "LOWER" : "HIGHER"}</text>
    </svg>
  );
}

function Bars({ current, medx }) {
  const max = Math.max(current, medx, 1);
  const rows = [
    { l: "Your cost today", v: current, cls: "today" },
    { l: "MedXFlow", v: medx, cls: "mx" },
  ];
  return (
    <div className="r2-bars">
      {rows.map((row) => (
        <div className="r2-bar-row" key={row.l}>
          <span className="r2-bar-label"><span className={"r2-bar-dot " + row.cls} />{row.l}</span>
          <div className="r2-bar-track"><div className={"r2-bar-fill " + row.cls} style={{ width: (row.v / max) * 100 + "%" }} /></div>
          <span className="r2-bar-val">{usd(row.v)}</span>
        </div>
      ))}
    </div>
  );
}

function AreaChart({ monthly }) {
  const W = 600, H = 226, padL = 52, padR = 26, padT = 26, padB = 34;
  const annual = monthly * 12;
  const rawMax = Math.max(annual * 1.1, 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / (mag / 2)) * (mag / 2);
  const x = (m) => padL + (m / 12) * (W - padL - padR);
  const y = (v) => H - padB - (v / niceMax) * (H - padT - padB);
  const months = Array.from({ length: 13 }, (_, i) => i);
  const line = months.map((m) => `${x(m)},${y(monthly * m)}`).join(" ");
  const area = `M ${x(0)},${y(0)} L ${months.map((m) => `${x(m)},${y(monthly * m)}`).join(" L ")} L ${x(12)},${y(0)} Z`;
  return (
    <svg className="r2-area" viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cumulative savings over 12 months">
      <defs>
        <linearGradient id="r2Fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16A34A" stopOpacity="0.24" />
          <stop offset="1" stopColor="#16A34A" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={padL} y1={y(niceMax * f)} x2={W - padR} y2={y(niceMax * f)} stroke="#EDF1F6" strokeWidth="1" />
          <text x={padL - 10} y={y(niceMax * f) + 4} textAnchor="end" className="r2-area-tick">{usdK(niceMax * f)}</text>
        </g>
      ))}
      <path d={area} fill="url(#r2Fill)" />
      <polyline points={line} fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={x(12)} cy={y(annual)} r="5" fill="#16A34A" stroke="#fff" strokeWidth="2" />
      <text x={W - padR} y={y(annual) - 12} textAnchor="end" className="r2-area-end">{usd(annual)} / yr</text>
      {[[0, "Now"], [3, "Month 3"], [6, "Month 6"], [9, "Month 9"], [12, "Month 12"]].map(([m, lbl]) => (
        <text key={m} x={x(m)} y={H - 11} textAnchor="middle" className="r2-area-mtick">{lbl}</text>
      ))}
    </svg>
  );
}

const FAQ = [
  { q: "How is MedXFlow priced?", a: "MedXFlow prices finished work, not seats or a percentage of collections. Each workflow has a published weight in MedXFlow Units (MXU, listed at $0.10 each), and each plan includes a monthly MXU allowance with a lower effective rate as volume grows." },
  { q: "How does the ROI calculator estimate savings?", a: "It compares your current loaded RCM labor cost (FTEs times hours times fully-loaded cost per hour) against MedXFlow's list price for the plan that fits your scale. The difference is your estimated monthly and annual saving." },
  { q: "Is this an exact quote?", a: "No. It is a list-price estimate. Because plans are priced per completed workflow outcome, your exact cost depends on your real workflow volumes. Send three months of volumes and MedXFlow will price it precisely." },
  { q: "Does MedXFlow charge a percentage of collections?", a: "No. There are no seat fees and no percentage of collections. You pay for finished work at a rate benchmarked to sit below the loaded cost of doing the same work in-house or offshore." },
];

const CSS = `
.roi2{--navy:#0D2B52;--blue:#2563EB;--blue-d:#1E40AF;--green:#16A34A;--green-l:#ECFDF5;--ink:#0F2440;--muted:#64748B;--line:#E2E8F0;--bg:#F5F8FC;--card:#FFFFFF;
  background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; line-height:1.55}
.r2-page{padding-top:56px}
.r2-topbar{background:linear-gradient(100deg,#0A2144,#123769); color:#fff}
.r2-topbar-in{max-width:1440px; margin:0 auto; padding:13px 32px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap}
.r2-brand{font-size:17px; font-weight:800; display:flex; align-items:center; gap:9px}
.r2-mark{color:#4FD1C5; font-size:18px}
.r2-sep{color:rgba(255,255,255,.35); font-weight:400}
.r2-tool{font-weight:600; color:#CFE0F2}
.r2-live{font-size:13px; color:#AFC6E4; display:flex; align-items:center; gap:8px}
.r2-dot{width:8px; height:8px; border-radius:50%; background:#22C55E; box-shadow:0 0 0 3px rgba(34,197,94,.22)}
.r2-live-dot{color:rgba(255,255,255,.4)}
.r2-ic-i{opacity:.6}

.r2-wrap{max-width:1440px; margin:0 auto; padding:26px 32px 56px}
.r2-head h1{font-size:clamp(26px,3vw,34px); font-weight:800; letter-spacing:-.02em; color:var(--navy); margin:0 0 6px}
.r2-head p{font-size:15.5px; color:var(--muted); margin:0}

.r2-grid{display:grid; grid-template-columns:minmax(340px,0.9fr) 1.6fr; gap:20px; margin-top:20px; align-items:start}
.r2-forms{display:flex; flex-direction:column; gap:16px}
.r2-card, .r2-summary{background:var(--card); border:1px solid var(--line); border-radius:16px; box-shadow:0 1px 3px rgba(15,36,64,.04)}
.r2-card{padding:20px}
.r2-card-t{font-size:15px; font-weight:800; color:var(--navy); margin:0 0 16px}

.r2-field{margin:0 0 18px}
.r2-field:last-child{margin-bottom:0}
.r2-field.off{opacity:.5}
.r2-field-c{margin:0 0 12px}
.r2-field-head{display:flex; align-items:center; gap:12px; margin-bottom:10px}
.r2-field-ic{flex:none; width:38px; height:38px; border-radius:10px; background:#EFF5FE; color:var(--blue); display:grid; place-items:center; font-size:17px}
.r2-field-c .r2-field-ic{width:30px; height:30px; font-size:14px; border-radius:8px}
.r2-field-meta{flex:1; min-width:0}
.r2-field-l{font-size:14.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px}
.r2-field-c .r2-field-l{font-size:13px}
.r2-i{color:#B4C0CE; font-size:11px}
.r2-field-h{font-size:12.5px; color:var(--muted); margin-top:1px}
.r2-field-val{flex:none; min-width:78px; text-align:right; border:1px solid var(--line); border-radius:9px; padding:7px 12px; font-size:17px; font-weight:800; color:var(--navy); font-variant-numeric:tabular-nums; background:#FBFDFF}
.r2-field-c .r2-field-val{font-size:14px; min-width:64px; padding:5px 9px}
.r2-field-val span{font-size:11px; font-weight:600; color:var(--muted); margin-left:4px}
.r2-field input[type=range]{width:100%; accent-color:var(--blue); height:20px; cursor:pointer}
.r2-field-scale{display:flex; justify-content:space-between; font-size:11.5px; color:#9AA7B6; margin-top:1px}

.r2-plan{display:flex; gap:11px; align-items:flex-start; background:#EEF3FE; border:1px solid #D6E2FA; border-radius:12px; padding:13px 15px; margin:4px 0 14px}
.r2-plan-star{color:var(--blue); font-size:16px; line-height:1.3}
.r2-plan-l{font-size:13.5px; color:#2B4160}
.r2-plan-l b{color:var(--blue-d)}
.r2-plan-b{font-size:12.5px; color:var(--muted); margin-top:2px}

.r2-check{display:flex; align-items:center; gap:10px; font-size:14px; font-weight:600; color:var(--ink); cursor:pointer; margin-top:4px}
.r2-check input{width:17px; height:17px; accent-color:var(--blue); flex:none}
.r2-check-lg{padding:13px 0; border-top:1px solid #F1F5F9}
.r2-card .r2-check-lg:first-of-type{border-top:0; padding-top:2px}
.r2-check-main{font-weight:700}
.r2-check-note{margin-left:auto; font-size:12.5px; font-weight:600; color:var(--muted)}
.r2-addon{background:#F8FAFD; border:1px solid var(--line); border-radius:11px; padding:12px 13px; margin:0 0 6px}
.r2-addon-note{font-size:12px; color:var(--muted); margin-top:2px}

.r2-work{margin-top:4px}
.r2-work-l{font-size:13px; font-weight:700; color:var(--ink); margin-bottom:8px}
.r2-toggle{display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px}
.r2-tog{display:flex; align-items:center; justify-content:center; gap:6px; border:1px solid var(--line); background:#fff; color:var(--muted); font-size:13px; font-weight:700; padding:10px 8px; border-radius:10px; cursor:pointer}
.r2-tog-ic{font-size:14px}
.r2-tog.on{background:#EFF5FE; border-color:var(--blue); color:var(--blue-d)}

.r2-summary{padding:22px}
.r2-sum-t{font-size:17px; font-weight:800; color:var(--navy); margin:0 0 16px}
.r2-costs{display:grid; grid-template-columns:1fr 1fr 1.25fr; gap:14px}
.r2-cost{border:1px solid var(--line); border-radius:14px; padding:16px 18px; background:#FBFDFF}
.r2-cost-l{font-size:12px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--muted)}
.r2-cost-n{font-size:30px; font-weight:800; color:var(--navy); letter-spacing:-.02em; margin-top:6px; font-variant-numeric:tabular-nums; line-height:1.05}
.r2-cost-n i{font-size:14px; font-weight:600; font-style:normal; color:var(--muted)}
.r2-cost-sub{font-size:12.5px; color:var(--muted); margin-top:3px}
.r2-cost-mx{background:linear-gradient(150deg,var(--blue-d),#2A56C9); border-color:transparent}
.r2-cost-mx .r2-cost-l{color:#B9CCF2}
.r2-cost-mx .r2-cost-n{color:#fff}
.r2-cost-mx .r2-cost-n i, .r2-cost-mx .r2-cost-sub{color:#C3D3F5}
.r2-cost-save{background:var(--green-l); border-color:#C7EBD3}
.r2-cost-save.neg{background:#FEF2F2; border-color:#FBD5D5}
.r2-cost-save .r2-cost-l{color:var(--green)}
.r2-cost-save.neg .r2-cost-l{color:#DC2626}
.r2-cost-save-row{display:flex; align-items:center; justify-content:space-between; gap:8px}
.r2-donut{flex:none}
.r2-donut-n{font-size:22px; font-weight:800; fill:var(--navy)}
.r2-donut-l{font-size:9px; font-weight:800; fill:var(--muted); letter-spacing:.08em}

.r2-breakdown{margin-top:14px; border:1px solid var(--line); border-radius:12px; overflow:hidden}
.r2-brk-row{display:grid; grid-template-columns:1.4fr 1.2fr auto; gap:10px; align-items:center; padding:9px 14px; font-size:13px; border-top:1px solid #F1F5F9}
.r2-brk-row:first-child{border-top:0}
.r2-brk-l{font-weight:700; color:var(--ink)}
.r2-brk-v{color:var(--muted); font-variant-numeric:tabular-nums}
.r2-brk-s{color:var(--green); font-weight:800; text-align:right; font-variant-numeric:tabular-nums}
.r2-brk-s.neg{color:#DC2626}

.r2-viz-row{display:grid; grid-template-columns:1.55fr 1fr; gap:14px; margin-top:14px}
.r2-panel{background:#FCFDFF; border:1px solid var(--line); border-radius:14px; padding:16px 18px}
.r2-panel-t{font-size:13.5px; font-weight:800; color:var(--navy); margin:0 0 12px}
.r2-note{background:#F6F9FD; border:1px solid var(--line); border-radius:14px; padding:16px; display:flex; gap:11px; align-items:flex-start}
.r2-note-ic{flex:none; width:34px; height:34px; border-radius:9px; background:#EFF5FE; display:grid; place-items:center; font-size:15px}
.r2-note p{font-size:13px; color:#41546B; margin:0; line-height:1.5}
.r2-note b{color:var(--navy)}
.r2-neg-msg{font-size:13.5px; color:#DC2626; margin:8px 0}
.r2-neg-msg a{color:#DC2626; font-weight:700}

.r2-bars{display:grid; gap:12px}
.r2-bar-row{display:grid; grid-template-columns:130px 1fr auto; align-items:center; gap:12px}
.r2-bar-label{font-size:13px; font-weight:600; color:#41546B; display:flex; align-items:center; gap:8px}
.r2-bar-dot{width:9px; height:9px; border-radius:50%; flex:none}
.r2-bar-dot.today{background:#64748B}
.r2-bar-dot.mx{background:var(--green)}
.r2-bar-track{height:20px; background:#EEF2F7; border-radius:6px; overflow:hidden}
.r2-bar-fill{height:100%; border-radius:6px; transition:width .5s cubic-bezier(.4,0,.2,1)}
.r2-bar-fill.today{background:linear-gradient(90deg,#7C8CA0,#5B6B80)}
.r2-bar-fill.mx{background:linear-gradient(90deg,#22C55E,#16A34A)}
.r2-bar-val{font-size:14px; font-weight:800; color:var(--navy); font-variant-numeric:tabular-nums}
.r2-area{display:block}
.r2-area-tick{font-size:11px; fill:#94A3B4; font-weight:600}
.r2-area-mtick{font-size:11.5px; fill:#64748B; font-weight:600}
.r2-area-end{font-size:13.5px; fill:var(--green); font-weight:800}

.r2-benefits{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-top:14px}
.r2-benefit{display:flex; gap:11px; align-items:flex-start; background:#FCFDFF; border:1px solid var(--line); border-radius:14px; padding:15px}
.r2-benefit-ic{flex:none; width:36px; height:36px; border-radius:10px; background:#EFF5FE; display:grid; place-items:center; font-size:16px}
.r2-benefit b{display:block; font-size:14px; color:var(--navy)}
.r2-benefit span{display:block; font-size:12.5px; color:var(--muted); margin-top:2px; line-height:1.45}

.r2-cta{display:flex; align-items:center; gap:15px; margin-top:16px; padding:18px 22px; background:#EEF3FE; border:1px solid #D6E2FA; border-radius:14px; flex-wrap:wrap}
.r2-cta-ic{flex:none; width:40px; height:40px; border-radius:11px; background:#fff; display:grid; place-items:center; font-size:18px}
.r2-cta-txt{flex:1; min-width:200px}
.r2-cta-txt b{display:block; font-size:15px; color:var(--navy)}
.r2-cta-txt span{font-size:13px; color:#41546B}
.r2-cta-btn{flex:none; background:var(--navy); color:#fff; border:0; border-radius:10px; padding:12px 20px; font-size:14px; font-weight:700; cursor:pointer}
.r2-cta-btn:hover{background:var(--blue-d)}

.r2-disclaimer{font-size:12px; color:#9AA7B6; margin:16px 0 0; line-height:1.5; max-width:100ch}
.r2-seo{margin-top:40px; border-top:1px solid var(--line); padding-top:28px; max-width:900px}
.r2-seo h2{font-size:22px; font-weight:800; color:var(--navy); margin:22px 0 10px}
.r2-seo h2:first-child{margin-top:0}
.r2-seo p{font-size:16px; color:#33455A; margin:0 0 12px; max-width:72ch}
.r2-faq{margin-top:20px}
.r2-faq-item{margin-bottom:16px}
.r2-faq-item h3{font-size:16.5px; font-weight:800; color:var(--navy); margin:0 0 5px}
.r2-faq-item p{font-size:15.5px; color:#33455A; margin:0; max-width:72ch}

@media(max-width:1080px){
  .r2-grid{grid-template-columns:1fr}
  .r2-costs{grid-template-columns:1fr 1fr}
  .r2-cost-save{grid-column:1 / -1}
  .r2-viz-row{grid-template-columns:1fr}
  .r2-benefits{grid-template-columns:1fr}
}
@media(max-width:560px){
  .r2-topbar-in, .r2-wrap{padding-left:18px; padding-right:18px}
  .r2-costs{grid-template-columns:1fr}
  .r2-toggle{grid-template-columns:1fr}
  .r2-cta-btn{width:100%}
}
`;
