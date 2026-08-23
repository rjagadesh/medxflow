import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, Reveal, Eyebrow, BookDemo, CSS } from "./EirimFrontDesk.jsx";
import AnswerBox from "./AnswerBox.jsx";
import { SPECIALTIES, bySpecialtySlug } from "./specialties.data.js";

const openDemo = () => window.dispatchEvent(new Event("eirim:book-demo"));

// Keep the meta description under Google's ~155-char snippet limit.
const clip155 = (s, n = 155) => {
  s = String(s || "").trim();
  if (s.length <= n) return s;
  let c = s.slice(0, n);
  const sp = c.lastIndexOf(" ");
  if (sp > 60) c = c.slice(0, sp);
  return c.replace(/[\s,;:.\-]+$/, "");
};

// Full marketing page for one specialty, driven by its config object.
export default function SpecialtyPage({ slug }) {
  const s = bySpecialtySlug(slug);

  useEffect(() => {
    if (!s) return;
    document.title = `${s.name} · AI agents for the revenue cycle · MedXFlow`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    const prev = meta.getAttribute("content");
    meta.setAttribute("content", clip155(s.tagline));
    window.scrollTo(0, 0);
    return () => prev && meta.setAttribute("content", prev);
  }, [s]);

  if (!s) return <SpecialtiesIndex />;

  const others = SPECIALTIES.filter((x) => x.slug !== s.slug);
  const processCount = s.groups.reduce((n, g) => n + g.processes.length, 0);

  return (
    <LanguageProvider>
      <div className="eirim">
        <style>{CSS}</style>
        <style>{SP_CSS}</style>
        <Nav resources />

        {/* Hero */}
        <header className="pp-hero">
          <div className="wrap pp-hero-in">
            <Reveal>
              <a href="/specialties/" className="pp-back">← All specialties</a>
              <div className="pp-hero-ic">{s.icon}</div>
              <Eyebrow light>{s.eyebrow}</Eyebrow>
              <h1 className="h-light pp-h1">{s.h1a}{" "}<br />{s.h1b}</h1>
              <p className="lead-light pp-tagline">{s.tagline}</p>
              <div className="pp-hero-cta">
                <a href="#cta" className="btn btn-gorse" onClick={(e) => { e.preventDefault(); openDemo(); }}>Book a demo</a>
                <a href="/specialties/" className="btn btn-ghost">All specialties</a>
              </div>
            </Reveal>
          </div>
        </header>

        {/* Overview + stat */}
        <section className="sec">
          <div className="wrap pp-over">
            <Reveal>
              <div className="pp-over-copy">
                <Eyebrow>Where the revenue leaks</Eyebrow>
                <p className="pp-over-text">{s.overview}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="pp-stat">
                <div className="pp-stat-n">{s.stat.n}{s.stat.suffix}</div>
                <div className="pp-stat-l">{s.stat.label}</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Automatable processes, grouped */}
        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>What AI agents automate</Eyebrow>
              <h2>{processCount} processes across {s.groups.length} workflows</h2>
            </Reveal>
            <div className="sp-groups">
              {s.groups.map((g, gi) => (
                <Reveal key={g.title} delay={(gi % 2) * 90}>
                  <div className="sp-group">
                    <div className="sp-group-h">
                      <h3>{g.title}</h3>
                      {g.note && <span className="sp-group-note">{g.note}</span>}
                    </div>
                    <ul className="sp-proc">
                      {g.processes.map(([ic, name, desc], i) => (
                        <li key={i}>
                          <span className="sp-proc-ic">{ic}</span>
                          <span className="sp-proc-body"><b>{name}</b><span>{desc}</span></span>
                        </li>
                      ))}
                    </ul>
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
                {s.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Other specialties */}
        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal>
              <Eyebrow>More specialties</Eyebrow>
              <h2>AI agents, tuned to your practice</h2>
            </Reveal>
            <div className="sp-index-grid">
              {others.map((o) => (
                <a key={o.slug} className="sp-index-card" href={`/specialties/${o.slug}/`}>
                  <span className="sp-index-ic">{o.icon}</span>
                  <span className="sp-index-body">
                    <b>{o.name}</b>
                    <span>{o.groups.reduce((n, g) => n + g.processes.length, 0)} automated processes</span>
                  </span>
                  <span className="pp-rel-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ (answer-first, for SEO/AEO) */}
        {s.faq?.length ? (
          <section className="sec">
            <div className="wrap sp-faq">
              <Reveal>
                <Eyebrow>FAQ</Eyebrow>
                <h2>{s.name} billing: frequently asked questions</h2>
              </Reveal>
              <div className="sp-faq-list">
                {s.faq.map((f, i) => (
                  <div className="sp-faq-item" key={i}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <section className="sec sec-dark" id="cta">
          <div className="wrap pp-cta">
            <Reveal>
              <h2 className="h-light">See MedXFlow run your {s.name.toLowerCase()} revenue cycle</h2>
              <p className="lead-light">A 20-minute demo built around your practice - the agents, the workflows and the numbers.</p>
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

// Specialties overview at /specialties
export function SpecialtiesIndex() {
  useEffect(() => {
    document.title = "Specialties · AI agents by practice type · MedXFlow";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.setAttribute("content", clip155("AI revenue-cycle agents tuned to your specialty - MedSpa, dental, mental health, dermatology, physical therapy, cardiology, orthopedics and primary care."));
    window.scrollTo(0, 0);
  }, []);
  return (
    <LanguageProvider>
      <div className="eirim">
        <style>{CSS}</style>
        <style>{SP_CSS}</style>
        <Nav resources />

        <header className="pp-hero pp-hero-index">
          <div className="wrap pp-hero-in">
            <Reveal>
              <Eyebrow light>Specialties</Eyebrow>
              <h1 className="h-light pp-h1">AI agents, tuned to<br />your specialty.</h1>
              <p className="lead-light pp-tagline">Every practice type leaks revenue in different places. Pick your specialty to see exactly which processes MedXFlow's AI agents automate - and what you get back.</p>
              <AnswerBox>
                MedXFlow provides AI revenue cycle management tuned to each specialty - including medical spas, dental,
                mental and behavioral health, dermatology, physical therapy, cardiology, orthopedics and primary care.
                The AI agents automate eligibility, prior authorization, coding and denials around the billing rules and
                payer mix specific to your practice type.
              </AnswerBox>
            </Reveal>
          </div>
        </header>

        <section className="sec sec-tint">
          <div className="wrap">
            <div className="sp-index-grid sp-index-grid-lg">
              {SPECIALTIES.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 80}>
                  <a className="sp-index-card sp-index-card-lg" href={`/specialties/${s.slug}/`}>
                    <span className="sp-index-ic sp-index-ic-lg">{s.icon}</span>
                    <span className="sp-index-body">
                      <b>{s.name}</b>
                      <span>{s.tagline}</span>
                    </span>
                    <span className="sp-index-link">Explore →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-dark" id="cta">
          <div className="wrap pp-cta">
            <Reveal>
              <h2 className="h-light">Don't see your specialty?</h2>
              <p className="lead-light">MedXFlow's agents adapt to any practice type. Tell us yours and we'll map the workflows we'd automate.</p>
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

const SP_CSS = `
.pp-hero{background:linear-gradient(160deg,var(--ink) 0%,var(--spruce-deep) 58%,var(--spruce) 100%); color:#fff; padding:132px 0 84px}
.pp-hero-index{padding-bottom:64px}
.pp-hero-in{max-width:820px}
.pp-back{display:inline-block; font-size:13.5px; font-weight:600; color:rgba(255,255,255,.7); margin-bottom:20px}
.pp-back:hover{color:#fff}
.pp-hero-ic{font-size:44px; width:78px; height:78px; border-radius:20px; background:rgba(23,195,178,.18); display:grid; place-items:center; margin-bottom:18px}
.pp-h1{font-size:clamp(34px,5.4vw,60px); margin:8px 0 0}
.pp-tagline{font-size:clamp(16px,2vw,19px); max-width:62ch; margin-top:18px}
.pp-hero-cta{display:flex; flex-wrap:wrap; gap:14px; margin-top:30px}

.pp-over{display:grid; grid-template-columns:1.4fr .9fr; gap:48px; align-items:center}
.pp-over-text{font-size:17.5px; line-height:1.7; color:rgba(13,43,82,.82); margin-top:12px}
.pp-stat{background:linear-gradient(150deg,var(--ink),var(--spruce-deep)); color:#fff; border-radius:24px; padding:40px 34px; text-align:center}
.pp-stat-n{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(40px,5.4vw,56px); color:var(--gorse); line-height:1; letter-spacing:-0.03em}
.pp-stat-l{font-size:15px; color:rgba(255,255,255,.8); margin-top:14px; line-height:1.5}

/* Process groups */
.sp-groups{display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:38px}
.sp-group{background:#fff; border:1px solid var(--line); border-radius:20px; padding:26px 26px 20px}
.sp-group-h{display:flex; align-items:baseline; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line)}
.sp-group-h h3{font-size:18px; margin:0}
.sp-group-note{font-size:12px; color:var(--spruce); font-weight:600}
.sp-proc{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:15px}
.sp-proc li{display:flex; gap:13px; align-items:flex-start}
.sp-proc-ic{font-size:19px; flex:none; width:30px; height:30px; border-radius:9px; background:rgba(23,195,178,.12); display:grid; place-items:center}
.sp-proc-body{display:flex; flex-direction:column; gap:3px}
.sp-proc-body b{font-size:14.5px; color:var(--ink)}
.sp-proc-body span{font-size:13.5px; color:rgba(13,43,82,.7); line-height:1.5}

.pp-benefits-grid{display:grid; grid-template-columns:.8fr 1.2fr; gap:40px; align-items:center}
.pp-ticks{list-style:none; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:14px 26px}
.pp-ticks li{padding-left:34px; position:relative; font-size:16px; color:rgba(13,43,82,.85); line-height:1.5}
.pp-ticks li:before{content:"✓"; position:absolute; left:0; top:0; width:23px; height:23px; border-radius:50%; background:var(--gorse); color:#fff; font-weight:800; font-size:13px; display:grid; place-items:center}

/* Specialty cards */
.sp-index-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:34px}
.sp-index-grid-lg{grid-template-columns:repeat(2,1fr); gap:18px; margin-top:0}
.sp-index-card{display:flex; align-items:center; gap:15px; background:#fff; border:1px solid var(--line); border-radius:16px; padding:18px 20px; transition:transform .16s, box-shadow .16s}
.sp-index-card:hover{transform:translateY(-2px); box-shadow:0 16px 38px rgba(13,43,82,.12)}
.sp-index-card-lg{padding:24px 26px; align-items:flex-start}
.sp-index-ic{font-size:26px; flex:none; width:52px; height:52px; border-radius:13px; background:rgba(23,195,178,.14); display:grid; place-items:center}
.sp-index-ic-lg{font-size:32px; width:62px; height:62px}
.sp-index-body{display:flex; flex-direction:column; gap:4px; min-width:0}
.sp-index-body b{font-size:16px; color:var(--ink)}
.sp-index-body span{font-size:13px; color:rgba(13,43,82,.62); line-height:1.5}
.sp-index-link{margin-top:8px; font-size:14px; font-weight:700; color:var(--spruce); flex:none}
.pp-rel-arrow{margin-left:auto; color:var(--spruce); font-weight:700; flex:none}

.pp-cta{text-align:center; max-width:720px; margin:0 auto}
.pp-cta .lead-light{margin:14px auto 26px}
.sp-faq{max-width:760px}
.sp-faq-list{margin-top:26px; display:flex; flex-direction:column; gap:18px}
.sp-faq-item h3{font-size:17.5px; font-weight:800; color:var(--ink); margin:0 0 6px}
.sp-faq-item p{font-size:16px; color:rgba(13,43,82,.78); line-height:1.6; margin:0; max-width:70ch}

@media(max-width:880px){
  .pp-over{grid-template-columns:1fr; gap:28px}
  .sp-groups{grid-template-columns:1fr}
  .pp-benefits-grid{grid-template-columns:1fr; gap:24px}
  .pp-ticks{grid-template-columns:1fr}
  .sp-index-grid, .sp-index-grid-lg{grid-template-columns:1fr}
  .pp-hero{padding-top:120px}
}
`;
