import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, Reveal, Eyebrow, BookDemo, CSS } from "./EirimFrontDesk.jsx";
import { PRODUCTS, platformProducts, rcmProducts, engagementProducts, serviceProducts, bySlug } from "./products.data.js";

const openDemo = () => window.dispatchEvent(new Event("eirim:book-demo"));

// Full marketing page for a single product, driven by its config object.
export default function ProductPage({ slug }) {
  const p = bySlug(slug);

  useEffect(() => {
    if (!p) return;
    document.title = `${p.name} · MedXFlow`;
    const prev = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", p.tagline);
    window.scrollTo(0, 0);
    return () => prev && meta.setAttribute("content", prev);
  }, [p]);

  if (!p) return <ProductsIndex />;

  const related = (p.category === "rcm" ? rcmProducts : PRODUCTS)
    .filter((x) => x.slug !== p.slug)
    .slice(0, 6);

  return (
    <LanguageProvider>
      <div className="eirim">
        <style>{CSS}</style>
        <style>{PP_CSS}</style>
        <Nav />

        {/* Hero */}
        <header className="pp-hero">
          <div className="wrap pp-hero-in">
            <Reveal>
              <a href="/products" className="pp-back">← All products</a>
              <div className="pp-hero-ic">{p.icon}</div>
              <Eyebrow light>{p.eyebrow}</Eyebrow>
              <h1 className="h-light pp-h1">
                {p.h1a}
                <br />
                {p.h1b}
              </h1>
              <p className="lead-light pp-tagline">{p.tagline}</p>
              <div className="pp-hero-cta">
                <a href="#cta" className="btn btn-gorse" onClick={(e) => { e.preventDefault(); openDemo(); }}>Book a demo</a>
                <a href="/products" className="btn btn-ghost">Explore the suite</a>
              </div>
            </Reveal>
          </div>
        </header>

        {/* Overview + headline stat */}
        <section className="sec">
          <div className="wrap pp-over">
            <Reveal>
              <div className="pp-over-copy">
                <Eyebrow>What it does</Eyebrow>
                <p className="pp-over-text">{p.overview}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="pp-stat">
                <div className="pp-stat-n">{p.stat.n}{p.stat.suffix}</div>
                <div className="pp-stat-l">{p.stat.label}</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>Capabilities</Eyebrow>
              <h2>What's inside {p.name}</h2>
            </Reveal>
            <div className="pp-feats">
              {p.features.map(([ic, h, d], i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="card pp-feat">
                    <div className="card-ic">{ic}</div>
                    <h3>{h}</h3>
                    <p>{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="sec sec-dark">
          <div className="wrap">
            <Reveal>
              <Eyebrow light>How it works</Eyebrow>
              <h2 className="h-light">Three steps, no leaks</h2>
            </Reveal>
            <div className="pp-flow">
              {p.steps.map(([h, d], i) => (
                <Reveal key={i} delay={i * 120}>
                  <div className="pp-step">
                    <div className="pp-step-top">
                      <span className="pp-step-num">{i + 1}</span>
                    </div>
                    <h3>{h}</h3>
                    <p>{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="sec">
          <div className="wrap pp-benefits-grid">
            <Reveal>
              <div>
                <Eyebrow>Why it matters</Eyebrow>
                <h2>What you get</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ul className="pp-ticks">
                {p.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Related products */}
        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>{p.category === "rcm" ? "The rest of the revenue cycle" : "More from MedXFlow"}</Eyebrow>
              <h2>Explore the full suite</h2>
            </Reveal>
            <div className="pp-related">
              {related.map((r) => (
                <a key={r.slug} className="pp-rel-card" href={`/products/${r.slug}`}>
                  <span className="pp-rel-ic">{r.icon}</span>
                  <span className="pp-rel-body">
                    <b>{r.name}</b>
                    <span>{r.category === "rcm" ? `Step ${r.step}` : "Managed service"}</span>
                  </span>
                  <span className="pp-rel-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sec sec-dark" id="cta">
          <div className="wrap pp-cta">
            <Reveal>
              <h2 className="h-light">Ready to plug the leaks in your revenue cycle?</h2>
              <p className="lead-light">See {p.name} - and the full MedXFlow suite - in a 20-minute demo built around your practice.</p>
              <a href="#cta" className="btn btn-gorse" onClick={(e) => { e.preventDefault(); openDemo(); }}>Book a demo</a>
            </Reveal>
          </div>
        </section>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

// Animated RCM lifecycle: an AI agent flies the pipeline, completing each stage
// (scheduling → eligibility → … → collections → analytics), then loops.
const RLC_SHORT = {
  1: "Scheduling", 2: "Eligibility", 3: "Prior Auth", 4: "Check-in", 5: "Charge & Coding",
  6: "Claims", 7: "Payment Posting", 8: "Denials", 9: "Collections", 10: "Analytics",
};
function RcmLifecycle() {
  const nodes = rcmProducts;
  const N = nodes.length;
  const Li = (i) => +(4 + i * (92 / (N - 1))).toFixed(2); // left %  → 4..96
  const Ai = (i) => 6 + i * 9;                             // arrival % → 6..78

  // Agent path: land on each node in turn, then arc back over the top.
  let agent = `0%{left:${Li(0)}%;top:6px}`;
  nodes.forEach((_, i) => {
    agent += `${Ai(i)}%{left:${Li(i)}%;top:2px}`;
    agent += `${Ai(i) + 4}%{left:${Li(i)}%;top:6px}`;
  });
  agent += `90%{left:50%;top:-24px}100%{left:${Li(0)}%;top:6px}`;

  // Each node's checkmark pops when the agent lands, then holds until the loop resets.
  const doneKf = nodes.map((_, i) => {
    const a = Ai(i);
    return `@keyframes rlcDone${i}{0%,${Math.max(a - 3, 0)}%{opacity:0;transform:scale(.3)}${a}%{opacity:1;transform:scale(1)}97%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.3)}}`;
  }).join("");

  const css = `
    @keyframes rlcAgent{${agent}}
    ${doneKf}
    @keyframes rlcFlow{to{background-position:40px 0}}
    @keyframes rlcFly1{0%{transform:translate(0,0);opacity:0}10%{opacity:.55}50%{transform:translate(60vw,-18px)}90%{opacity:.55}100%{transform:translate(120vw,6px);opacity:0}}
    @keyframes rlcFly2{0%{transform:translate(0,0);opacity:0}12%{opacity:.4}55%{transform:translate(-55vw,14px)}100%{transform:translate(-115vw,-8px);opacity:0}}
    @media(prefers-reduced-motion:reduce){.rlc-agent,.rlc-track,.rlc-fly{animation:none!important}.rlc-check{opacity:1!important;transform:none!important}}
  `;

  return (
    <div className="rlc" aria-hidden="true">
      <style>{css}</style>
      <div className="rlc-track" />
      <img src="/chat-bot.webp" alt="" className="rlc-fly rlc-fly-1" />
      <img src="/chat-bot.webp" alt="" className="rlc-fly rlc-fly-2" />
      <div className="rlc-agent"><img src="/chat-bot.webp" alt="" className="rlc-agent-bot" /></div>
      {nodes.map((p, i) => (
        <div key={p.slug} className="rlc-node" style={{ left: `${Li(i)}%` }}>
          <div className="rlc-dot">
            <span className="rlc-dot-n">{p.step}</span>
            <span className="rlc-check" style={{ animation: `rlcDone${i} 20s linear infinite` }}>✓</span>
          </div>
          <span className="rlc-label">{RLC_SHORT[p.step] || p.name}</span>
        </div>
      ))}
    </div>
  );
}

// Products overview / index page at /products
export function ProductsIndex() {
  useEffect(() => {
    document.title = "Products · MedXFlow";
    window.scrollTo(0, 0);
  }, []);
  return (
    <LanguageProvider>
      <div className="eirim">
        <style>{CSS}</style>
        <style>{PP_CSS}</style>
        <Nav />

        <header className="pp-hero pp-hero-index">
          <div className="wrap pp-hero-in">
            <Reveal>
              <Eyebrow light>Products</Eyebrow>
              <h1 className="h-light pp-h1">The whole revenue cycle,<br />one connected platform.</h1>
              <p className="lead-light pp-tagline">From the first appointment to the final payment - the connected stages of Revenue Cycle Management, plus a human-led managed billing team when you'd rather hand it over.</p>
            </Reveal>
          </div>
          <div className="wrap pp-life-wrap">
            <RcmLifecycle />
          </div>
        </header>

        <section className="sec">
          <div className="wrap">
            <Reveal>
              <Eyebrow>Platforms</Eyebrow>
              <h2>The systems your front office runs on</h2>
            </Reveal>
            <div className="pp-index-grid">
              {platformProducts.map((r) => (
                <Reveal key={r.slug}>
                  <a className="pp-index-card" href={`/products/${r.slug}`}>
                    <div className="pp-index-top">
                      <span className="pp-index-ic">{r.icon}</span>
                      <span className="pp-index-step">Platform</span>
                    </div>
                    <h3>{r.name}</h3>
                    <p>{r.tagline}</p>
                    <span className="pp-index-link">Learn more →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>Revenue Cycle Management</Eyebrow>
              <h2>{rcmProducts.length} stages, end to end</h2>
            </Reveal>
            <div className="pp-index-grid">
              {rcmProducts.map((r, i) => (
                <Reveal key={r.slug} delay={(i % 3) * 90}>
                  <a className="pp-index-card" href={`/products/${r.slug}`}>
                    <div className="pp-index-top">
                      <span className="pp-index-ic">{r.icon}</span>
                      <span className="pp-index-step">Step {r.step}</span>
                    </div>
                    <h3>{r.name}</h3>
                    <p>{r.tagline}</p>
                    <span className="pp-index-link">Learn more →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <Reveal>
              <Eyebrow>Patient Access &amp; Engagement</Eyebrow>
              <h2>Keep patients on the books</h2>
            </Reveal>
            <div className="pp-index-grid">
              {engagementProducts.map((r) => (
                <Reveal key={r.slug}>
                  <a className="pp-index-card" href={`/products/${r.slug}`}>
                    <div className="pp-index-top">
                      <span className="pp-index-ic">{r.icon}</span>
                      <span className="pp-index-step">Engagement</span>
                    </div>
                    <h3>{r.name}</h3>
                    <p>{r.tagline}</p>
                    <span className="pp-index-link">Learn more →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>Managed Services</Eyebrow>
              <h2>Prefer people over software?</h2>
            </Reveal>
            <div className="pp-index-grid">
              {serviceProducts.map((r) => (
                <Reveal key={r.slug}>
                  <a className="pp-index-card pp-index-card-svc" href={`/products/${r.slug}`}>
                    <div className="pp-index-top">
                      <span className="pp-index-ic">{r.icon}</span>
                      <span className="pp-index-step">Human-led</span>
                    </div>
                    <h3>{r.name}</h3>
                    <p>{r.tagline}</p>
                    <span className="pp-index-link">Learn more →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-dark" id="cta">
          <div className="wrap pp-cta">
            <Reveal>
              <h2 className="h-light">One platform, or one team. Or both.</h2>
              <p className="lead-light">Tell us where your revenue is leaking and we'll show you exactly which pieces fix it.</p>
              <a href="#cta" className="btn btn-gorse" onClick={(e) => { e.preventDefault(); openDemo(); }}>Book a demo</a>
            </Reveal>
          </div>
        </section>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const PP_CSS = `
.pp-hero{background:linear-gradient(160deg,var(--ink) 0%,var(--spruce-deep) 58%,var(--spruce) 100%); color:#fff; padding:132px 0 84px}
.pp-hero-index{padding-bottom:56px}
.pp-hero-in{max-width:820px}

/* Animated RCM lifecycle */
.pp-life-wrap{margin-top:30px; position:relative; overflow:hidden}
.rlc{position:relative; height:150px}
.rlc-track{position:absolute; left:2%; right:2%; top:70px; height:3px; border-radius:3px;
  background:repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 9px, rgba(255,255,255,0) 9px 22px); background-size:40px 3px; animation:rlcFlow 1.1s linear infinite}
.rlc-node{position:absolute; top:52px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:9px; width:110px}
.rlc-dot{position:relative; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.12); border:2px solid rgba(255,255,255,.42); display:grid; place-items:center}
.rlc-dot-n{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:15px; color:#fff}
.rlc-check{position:absolute; inset:-2px; border-radius:50%; background:#17C3B2; border:2px solid #fff; display:grid; place-items:center; color:#053b34; font-weight:900; font-size:19px; opacity:0}
.rlc-label{font-size:11px; font-weight:600; color:rgba(255,255,255,.82); text-align:center; line-height:1.25}
.rlc-agent{position:absolute; top:2px; left:4%; transform:translateX(-50%); z-index:4; animation:rlcAgent 20s ease-in-out infinite}
.rlc-agent-bot{width:58px; height:58px; object-fit:contain; filter:hue-rotate(60deg) saturate(1.08) drop-shadow(0 7px 12px rgba(0,0,0,.4))}
.rlc-agent::after{content:""; position:absolute; left:50%; top:56px; width:2px; height:24px; transform:translateX(-50%); background:linear-gradient(rgba(23,195,178,.75),transparent)}
.rlc-fly{position:absolute; z-index:2; width:30px; height:30px; object-fit:contain; opacity:0; filter:hue-rotate(60deg) saturate(1.05)}
.rlc-fly-1{top:8px; left:-5%; animation:rlcFly1 11s linear infinite}
.rlc-fly-2{top:104px; right:-5%; transform:scaleX(-1); animation:rlcFly2 14s linear infinite 2s}
@media(max-width:820px){.pp-life-wrap{display:none}}
.pp-back{display:inline-block; font-size:13.5px; font-weight:600; color:rgba(255,255,255,.7); margin-bottom:20px}
.pp-back:hover{color:#fff}
.pp-hero-ic{font-size:44px; width:78px; height:78px; border-radius:20px; background:rgba(23,195,178,.18); display:grid; place-items:center; margin-bottom:18px}
.pp-h1{font-size:clamp(34px,5.4vw,60px); margin:8px 0 0}
.pp-tagline{font-size:clamp(16px,2vw,19px); max-width:60ch; margin-top:18px}
.pp-hero-cta{display:flex; flex-wrap:wrap; gap:14px; margin-top:30px}

.pp-over{display:grid; grid-template-columns:1.4fr .9fr; gap:48px; align-items:center}
.pp-over-text{font-size:17.5px; line-height:1.7; color:rgba(13,43,82,.82); margin-top:12px}
.pp-stat{background:linear-gradient(150deg,var(--ink),var(--spruce-deep)); color:#fff; border-radius:24px; padding:40px 34px; text-align:center}
.pp-stat-n{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(44px,6vw,60px); color:var(--gorse); line-height:1; letter-spacing:-0.03em}
.pp-stat-l{font-size:15px; color:rgba(255,255,255,.8); margin-top:14px; line-height:1.5}

.pp-feats{display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:38px}
.pp-feat{background:#fff}
.pp-feat h3{font-size:18px; margin-bottom:8px}
.pp-feat p{font-size:14.5px; color:rgba(13,43,82,.7); line-height:1.55}

.pp-flow{display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:38px}
.pp-step{background:rgba(255,255,255,.05); border:1px solid rgba(207,224,242,.16); border-radius:20px; padding:28px}
.pp-step-num{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; color:var(--ink); background:var(--gorse); width:44px; height:44px; border-radius:12px; display:grid; place-items:center}
.pp-step h3{font-size:18px; color:#fff; margin:16px 0 8px}
.pp-step p{font-size:14.5px; color:rgba(255,255,255,.7); line-height:1.55}

.pp-benefits-grid{display:grid; grid-template-columns:.8fr 1.2fr; gap:40px; align-items:center}
.pp-ticks{list-style:none; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:14px 26px}
.pp-ticks li{padding-left:34px; position:relative; font-size:16px; color:rgba(13,43,82,.85); line-height:1.5}
.pp-ticks li:before{content:"✓"; position:absolute; left:0; top:0; width:23px; height:23px; border-radius:50%; background:var(--gorse); color:#fff; font-weight:800; font-size:13px; display:grid; place-items:center}

.pp-related{display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:34px}
.pp-rel-card{display:flex; align-items:center; gap:14px; background:#fff; border:1px solid var(--line); border-radius:14px; padding:16px 18px; transition:transform .16s, box-shadow .16s}
.pp-rel-card:hover{transform:translateY(-2px); box-shadow:0 14px 34px rgba(13,43,82,.12)}
.pp-rel-ic{font-size:24px; flex:none}
.pp-rel-body{display:flex; flex-direction:column; min-width:0}
.pp-rel-body b{font-size:15px; color:var(--ink)}
.pp-rel-body span{font-size:12.5px; color:rgba(13,43,82,.55)}
.pp-rel-arrow{margin-left:auto; color:var(--spruce); font-weight:700}

.pp-cta{text-align:center; max-width:720px; margin:0 auto}
.pp-cta .lead-light{margin:14px auto 26px}

.pp-index-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:38px}
.pp-index-card{display:flex; flex-direction:column; background:#fff; border:1px solid var(--line); border-radius:20px; padding:26px; height:100%; transition:transform .18s, box-shadow .18s}
.pp-index-card:hover{transform:translateY(-3px); box-shadow:0 22px 50px rgba(13,43,82,.14)}
.pp-index-card-svc{background:linear-gradient(150deg,var(--ink),var(--spruce-deep)); border:none}
.pp-index-card-svc h3, .pp-index-card-svc p{color:#fff}
.pp-index-card-svc p{color:rgba(255,255,255,.78)}
.pp-index-card-svc .pp-index-link{color:var(--gorse)}
.pp-index-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px}
.pp-index-ic{font-size:28px; width:52px; height:52px; border-radius:13px; background:rgba(23,195,178,.14); display:grid; place-items:center}
.pp-index-card-svc .pp-index-ic{background:rgba(23,195,178,.22)}
.pp-index-step{font-family:'Spline Sans Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--spruce); font-weight:600}
.pp-index-card-svc .pp-index-step{color:var(--seaglass)}
.pp-index-card h3{font-size:19px; margin-bottom:8px}
.pp-index-card p{font-size:14.5px; color:rgba(13,43,82,.7); line-height:1.55; flex:1}
.pp-index-link{margin-top:16px; font-size:14px; font-weight:700; color:var(--spruce)}

@media(max-width:880px){
  .pp-over{grid-template-columns:1fr; gap:28px}
  .pp-feats{grid-template-columns:1fr}
  .pp-flow{grid-template-columns:1fr}
  .pp-benefits-grid{grid-template-columns:1fr; gap:24px}
  .pp-ticks{grid-template-columns:1fr}
  .pp-related{grid-template-columns:1fr}
  .pp-index-grid{grid-template-columns:1fr}
  .pp-hero{padding-top:120px}
}
`;
