import { useState, useEffect, useRef, useCallback } from "react";
import { LanguageProvider, useI18n, LangSwitcher } from "./i18n.jsx";
import Tour from "./Tour.jsx";
import { rcmProducts, engagementProducts, serviceProducts } from "./products.data.js";
import { SPECIALTIES } from "./specialties.data.js";

/* ============ EIRIM FRONT DESK - GP site (React) ============ */

const IMG = {
  logoMarkLight: "/img/logoMarkLight.png",
  logoMark: "/img/logoMark.png",
  lifestyle: "/img/lifestyle.jpg",
  kioskWhite: "/img/kioskWhite.jpg",
  kioskBlack: "/img/kioskBlack.jpg",
  doctorTablet: "/img/doctorTablet.jpg",
  voiceAgent: "/img/voiceAgent.jpg",
  elderlyPhone: "/img/elderlyPhone.jpg",
};

/* ---------- hooks ---------- */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

function CountUp({ to, suffix = "", prefix = "", duration = 1400 }) {
  const [ref, on] = useReveal(0.6);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!on) return;
    let start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [on, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ---------- shared bits ---------- */
export const Eyebrow = ({ children, light }) => (
  <div className={"eyebrow" + (light ? " eyebrow-light" : "")}>{children}</div>
);

export function Reveal({ children, delay = 0, className = "" }) {
  const [ref, on] = useReveal();
  return (
    <div ref={ref} className={"rv " + (on ? "rv-on " : "") + className} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- Nav ---------- */
// Specialties mega-menu, grouped into columns (left-to-right) like Products.
const SPECIALTY_GROUPS = [
  ["Primary & Preventive", ["primary-care"]],
  ["Aesthetics & Skin", ["medspa", "dermatology"]],
  ["Dental & Vision", ["dental", "eye-care"]],
  ["Behavioral & Therapy", ["behavioral-health", "physical-therapy", "physical-rehabilitation"]],
  ["Procedural & Surgical", ["cardiology", "orthopedics"]],
];
const specBySlug = Object.fromEntries(SPECIALTIES.map((s) => [s.slug, s]));

export function Nav({ resources = false } = {}) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className={"nav" + (scrolled ? " nav-scrolled" : "") + (menuOpen ? " nav-open" : "")}>
      <div className="wrap nav-in">
        <a href="/" className="brand" onClick={closeMenu}>
          <img src="/logo.jpg" alt="MedXFlow - AI revenue cycle management for practices" className="brand-logo" width="1045" height="140" />
        </a>
        <button
          className="nav-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <div className="nav-links">
          <div className="nav-dd">
            <button className="nav-dd-btn" aria-haspopup="true">
              {t("nav.products")} <span className="nav-dd-caret">▼</span>
            </button>
            <div className="nav-dd-menu nav-dd-mega" role="menu">
              <div className="nav-dd-mega-inner wrap">
                <div className="nav-dd-col">
                  <div className="nav-dd-head">Platforms</div>
                  <a href="/ai-agents-rcm/" role="menuitem"><span className="nav-dd-em">🤖</span>AI Agents for RCM</a>
                  <a href="/healthcare-rcm-automation" role="menuitem"><span className="nav-dd-em">⚙️</span>RCM Automation</a>
                  <a href="/#checkin" role="menuitem"><span className="nav-dd-em">🏥</span>{t("nav.p_kiosk")}</a>
                  <a href="/#voice" role="menuitem"><span className="nav-dd-em">📞</span>{t("nav.p_voice")}</a>
                  <a href="/telehealth/" role="menuitem"><span className="nav-dd-em">💻</span>{t("nav.p_telehealth")}</a>
                  <a href="/products/voip/" role="menuitem"><span className="nav-dd-em">📞</span>VoIP Services</a>
                  <a href="/products/eligibility-verification/" role="menuitem"><span className="nav-dd-em">🛡️</span>Eligibility Verification</a>
                  <a href="/products/charge-capture-coding/" role="menuitem"><span className="nav-dd-em">🏷️</span>Medical Coding</a>
                  <a href="#cta" role="menuitem" onClick={(e) => { e.preventDefault(); openDemo(); }}><span className="nav-dd-em">↪️</span>Referral Workflow</a>
                  <a href="/products/" role="menuitem" className="nav-dd-all">◆ All products</a>
                </div>

                <div className="nav-dd-col nav-dd-col-span2">
                  <div className="nav-dd-head">RCM AI Agents</div>
                  <div className="nav-dd-subgrid">
                    {rcmProducts.map((p) => (
                      <a key={p.slug} href={`/products/${p.slug}/`} role="menuitem">
                        <span className="nav-dd-step" style={{ animationDelay: `${(p.step - 1) * 0.4}s` }}>{p.step}</span>{p.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="nav-dd-col">
                  <div className="nav-dd-head">Patient Engagement</div>
                  {engagementProducts.map((p) => (
                    <a key={p.slug} href={`/products/${p.slug}/`} role="menuitem">
                      <span className="nav-dd-em">{p.icon}</span>{p.name}
                    </a>
                  ))}
                </div>

                <div className="nav-dd-col">
                  <div className="nav-dd-head">Managed Billing Services</div>
                  {serviceProducts.map((p) => (
                    <a key={p.slug} href={`/products/${p.slug}/`} role="menuitem">
                      <span className="nav-dd-em">👥</span>{p.name}
                    </a>
                  ))}
                  <p className="nav-dd-note">Prefer people over software? A dedicated, human-led billing team runs your revenue cycle end to end.</p>
                </div>

                <div className="nav-dd-col">
                  <div className="nav-dd-head">Devices</div>
                  <a href="/#checkin" role="menuitem"><span className="nav-dd-em">🖥️</span>Self-service Kiosk</a>
                  <a href="/#checkin" role="menuitem"><span className="nav-dd-em">📋</span>Reception Tablet</a>
                  <a href="/#checkin" role="menuitem"><span className="nav-dd-em">💳</span>Card Payment Terminal</a>
                  <a href="/#voice" role="menuitem"><span className="nav-dd-em">☎️</span>Voice Gateway</a>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-dd">
            <button className="nav-dd-btn" aria-haspopup="true">
              Specialties <span className="nav-dd-caret">▼</span>
            </button>
            <div className="nav-dd-menu nav-dd-mega" role="menu">
              <div className="nav-dd-mega-inner wrap">
                {SPECIALTY_GROUPS.map(([title, slugs]) => (
                  <div className="nav-dd-col" key={title}>
                    <div className="nav-dd-head">{title}</div>
                    {slugs.map((sl) => {
                      const s = specBySlug[sl];
                      return s ? (
                        <a key={sl} href={`/specialties/${sl}/`} role="menuitem">
                          <span className="nav-dd-em">{s.icon}</span>{s.name}
                        </a>
                      ) : null;
                    })}
                  </div>
                ))}
                <div className="nav-dd-col">
                  <div className="nav-dd-head">Explore</div>
                  <a href="/specialties/" role="menuitem" className="nav-dd-all">◆ All specialties</a>
                  <p className="nav-dd-note">AI revenue-cycle agents tuned to your practice type - we banner the biggest revenue leak we automate for each.</p>
                </div>
              </div>
            </div>
          </div>
          <a href="/roi-calculator/">ROI Calculator</a>
          {resources && <a href="/blog/">Resources</a>}
          <a href="https://platform.medxflow.ai/login" className="nav-platform">Platform</a>
          <a href="#cta">{t("nav.contact")}</a>
          <a href="/#faq">{t("nav.faq")}</a>
          <a href="#top" className="nav-tour" onClick={(e) => { e.preventDefault(); startTour(); }}>▶ {t("nav.tour")}</a>
          <a href="tel:+12103969718" className="nav-phone">📞 (210) 396-9718</a>
          <a href="#cta" className="nav-cta" onClick={(e) => { e.preventDefault(); openDemo(); }}>{t("nav.book")}</a>
          <LangSwitcher />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="nav-mobile">
        <a href="/products/" onClick={closeMenu}>{t("nav.products")}</a>
        <a href="/specialties/" onClick={closeMenu}>Specialties</a>
        <a href="/roi-calculator/" onClick={closeMenu}>ROI Calculator</a>
        {resources && <a href="/blog/" onClick={closeMenu}>Resources</a>}
        <a href="https://platform.medxflow.ai/login" onClick={closeMenu}>Platform</a>
        <a href="#cta" onClick={closeMenu}>{t("nav.contact")}</a>
        <a href="/#faq" onClick={closeMenu}>{t("nav.faq")}</a>
        <a href="#top" onClick={(e) => { e.preventDefault(); closeMenu(); startTour(); }}>▶ {t("nav.tour")}</a>
        <a href="tel:+12103969718" onClick={closeMenu}>📞 (210) 396-9718</a>
        <a href="#cta" className="nav-mobile-cta" onClick={(e) => { e.preventDefault(); closeMenu(); openDemo(); }}>{t("nav.book")}</a>
        <div className="nav-mobile-lang"><LangSwitcher /></div>
      </div>
    </nav>
  );
}

function ShamrockMark({ size = 26, variant = "green" }) {
  return (
    <img
      src={variant === "light" ? IMG.logoMarkLight : IMG.logoMark}
      alt=""
      aria-hidden="true"
      style={{ width: size, height: "auto", display: "block" }}
      className="logo-mark"
    />
  );
}

/* ---------- Hero slider ---------- */
const CALL_SCRIPT = [
  { c: "sys", t: "3 CALLS RINGING · ALL ANSWERED INSTANTLY" },
  { c: "ai", t: "Good morning, Riverside Medical - how can I help?" },
  { c: "user", t: "Can I get an appointment this morning? It’s urgent enough." },
  { c: "ai", t: "Dr. Murphy has 10:40 free - will I book you in?" },
  { c: "user", t: "Perfect, yes." },
  { c: "sys", t: "✓ BOOKED TO EPIC · SMS SENT · 22 OTHER CALLS IN PROGRESS" },
];

function CallDemo({ script = CALL_SCRIPT, header, sub }) {
  const [n, setN] = useState(0);
  const boxRef = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setN(script.length); return; }
    const id = setInterval(() => {
      setN((v) => (v >= script.length ? (v > script.length + 2 ? 0 : v + 1) : v + 1));
    }, 1500);
    return () => clearInterval(id);
  }, [script.length]);
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [n]);
  return (
    <div className="kiosk">
      <div className="kiosk-head">
        <span><span className="dot-live" />{header}</span>
        <span>{sub}</span>
      </div>
      <div className="kiosk-screen" ref={boxRef}>
        {script.slice(0, Math.min(n, script.length)).map((m, i) => (
          <div key={i} className={"bub " + m.c}>{m.t}</div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const vid0 = useRef(null);
  const vid1 = useRef(null);
  const vid2 = useRef(null);
  const vid3 = useRef(null);
  const vids = [vid0, vid1, vid2, vid3];
  const SLIDES = vids.length;
  const activeVid = () => vids[idx]?.current;

  // On slide change: restart & play the active slide's video, pause the others.
  // Advancing is driven by each video's 'ended' event (see onEnded below).
  useEffect(() => {
    vids.forEach((r, i) => {
      const v = r.current;
      if (!v) return;
      if (i === idx) {
        try { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch {}
      } else {
        try { v.pause(); } catch {}
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Safety fallback: if a video never fires 'ended' (stall / missing metadata),
  // still move on after a generous timeout. Hover (paused) suspends it.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SLIDES), 45000);
    return () => clearTimeout(t);
  }, [idx, paused, SLIDES]);

  // Only the active slide's video carries sound; the others stay muted.
  useEffect(() => {
    vids.forEach((r, i) => { if (r.current) r.current.muted = muted || idx !== i; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, idx]);

  const soundBtn = (
    <button
      className="hero-sound"
      aria-label={muted ? t("hero.playSound") : t("hero.mute")}
      aria-pressed={!muted}
      data-tip={muted ? t("hero.playSound") : t("hero.mute")}
      onClick={() => setMuted((m) => !m)}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );

  return (
    <header
      className="hero"
      id="top"
      onMouseEnter={() => {
        setPaused(true);
        try {
          activeVid()?.pause();
        } catch {}
      }}
      onMouseLeave={() => {
        setPaused(false);
        const v = activeVid();
        if (v) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        }
      }}
    >
      <div className="hero-glow" aria-hidden="true" />
      {/* Slide 1 - Kiosk */}
      <div className={"slide" + (idx === 0 ? " slide-on" : "")} aria-hidden={idx !== 0} inert={idx !== 0 ? "" : undefined}>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow light>{t("hero.s1_eyebrow")}</Eyebrow>
            <h1>{t("hero.s1_h1a")}<br /><em>{t("hero.s1_h1b")}</em></h1>
            <p className="lead">{t("hero.s1_lead")}</p>
            <div className="btn-row">
              <a className="btn btn-gorse" href="#checkin">{t("hero.s1_cta1")}</a>
              <a className="btn btn-ghost" href="#cta">{t("hero.s1_cta2")}</a>
            </div>
            <div className="hero-note">{t("hero.s1_note")}</div>
          </div>
          <div className="hero-art">
            {soundBtn}
            <video
              ref={vid0}
              src="/medxflow-header.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setIdx((i) => (i === 0 ? 1 : i))}
              aria-label="Patient checking in at the MedXFlow kiosk in a clinic lobby"
            />
          </div>
        </div>
      </div>
      {/* Slide 2 - RCM Billing */}
      <div className={"slide" + (idx === 1 ? " slide-on" : "")} aria-hidden={idx !== 1} inert={idx !== 1 ? "" : undefined}>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow light>{t("hero.s4_eyebrow")}</Eyebrow>
            <h2 className="hero-alt-h">{t("hero.s4_h2a")}<br /><em>{t("hero.s4_h2b")}</em></h2>
            <p className="lead">{t("hero.s4_lead")}</p>
            <div className="btn-row">
              <a className="btn btn-gorse" href="/products/">{t("hero.s4_cta1")}</a>
              <a className="btn btn-ghost" href="#cta">{t("hero.s4_cta2")}</a>
            </div>
            <div className="hero-note">{t("hero.s4_note")}</div>
          </div>
          <div className="hero-art hero-art-full">
            {soundBtn}
            <video
              ref={vid1}
              src="/rcm-process.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setIdx((i) => (i === 1 ? 2 : i))}
              aria-label="MedXFlow AI agent working the revenue cycle billing process"
            />
          </div>
        </div>
      </div>
      {/* Slide 3 - Voice */}
      <div className={"slide" + (idx === 2 ? " slide-on" : "")} aria-hidden={idx !== 2} inert={idx !== 2 ? "" : undefined}>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow light>{t("hero.s2_eyebrow")}</Eyebrow>
            <h2 className="hero-alt-h">{t("hero.s2_h2a")}<br /><em>{t("hero.s2_h2b")}</em></h2>
            <p className="lead">{t("hero.s2_lead")}</p>
            <div className="btn-row">
              <a className="btn btn-gorse" href="#voice">{t("hero.s2_cta1")}</a>
              <a className="btn btn-ghost" href="#cta">{t("hero.s2_cta2")}</a>
            </div>
            <div className="hero-note">{t("hero.s2_note")}</div>
          </div>
          <div className="hero-art hero-art-full">
            {soundBtn}
            <video
              ref={vid2}
              src="/voiceai.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setIdx((i) => (i === 2 ? 3 : i))}
              aria-label="MedXFlow Voice AI agent answering patient calls alongside the reception team"
            />
          </div>
        </div>
      </div>
      {/* Slide 4 - Telehealth */}
      <div className={"slide" + (idx === 3 ? " slide-on" : "")} aria-hidden={idx !== 3} inert={idx !== 3 ? "" : undefined}>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow light>{t("hero.s3_eyebrow")}</Eyebrow>
            <h2 className="hero-alt-h">{t("hero.s3_h2a")}<br /><em>{t("hero.s3_h2b")}</em></h2>
            <p className="lead">{t("hero.s3_lead")}</p>
            <div className="btn-row">
              <a className="btn btn-gorse" href="/telehealth/">{t("hero.s3_cta1")}</a>
              <a className="btn btn-ghost" href="#cta">{t("hero.s3_cta2")}</a>
            </div>
            <div className="hero-note">{t("hero.s3_note")}</div>
          </div>
          <div className="hero-art hero-art-full">
            {soundBtn}
            <video
              ref={vid3}
              src="/telehealth.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setIdx((i) => (i === 3 ? 0 : i))}
              aria-label="A patient joining a MedXFlow telehealth video visit from home"
            />
          </div>
        </div>
      </div>

      <button className="s-arrow s-prev" aria-label="Previous slide" onClick={() => setIdx((i) => (i + SLIDES - 1) % SLIDES)}>‹</button>
      <button className="s-arrow s-next" aria-label="Next slide" onClick={() => setIdx((i) => (i + 1) % SLIDES)}>›</button>
      <div className="s-dots">
        {[0, 1, 2, 3].map((i) => (
          <button key={i} className={idx === i ? "on" : ""} aria-label={`Slide ${i + 1}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </header>
  );
}

/* ---------- Stats ---------- */
function Stats() {
  const { t } = useI18n();
  return (
    <section className="stats">
      <div className="wrap stats-grid">
        <Reveal delay={0}><div className="stat"><div className="stat-n"><CountUp to={30} suffix="%" /></div><div className="stat-l">{t("stats.s1")}</div></div></Reveal>
        <Reveal delay={100}><div className="stat"><div className="stat-n"><CountUp to={9} suffix=" hrs" /></div><div className="stat-l">{t("stats.s2")}</div></div></Reveal>
        <Reveal delay={200}><div className="stat"><div className="stat-n"><CountUp to={65} prefix="$" /></div><div className="stat-l">{t("stats.s3")}</div></div></Reveal>
        <Reveal delay={300}><div className="stat"><div className="stat-n">24/7</div><div className="stat-l">{t("stats.s4")}</div></div></Reveal>
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */
function Problem() {
  const { t } = useI18n();
  return (
    <section className="sec" id="problem">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("problem.eyebrow")}</Eyebrow>
          <h2>{t("problem.h2a")}<br />{t("problem.h2b")}</h2>
        </Reveal>
        <div className="prob-grid">
          <Reveal delay={0}><div className="card">
            <div className="card-ic">☎</div>
            <h3>{t("problem.c1_h")}</h3>
            <p>{t("problem.c1_p")}</p>
          </div></Reveal>
          <Reveal delay={120}><div className="card">
            <div className="card-ic">🧍</div>
            <h3>{t("problem.c2_h")}</h3>
            <p>{t("problem.c2_p")}</p>
          </div></Reveal>
          <Reveal delay={240}><div className="card">
            <div className="card-ic">✍</div>
            <h3>{t("problem.c3_h")}</h3>
            <p>{t("problem.c3_p")}</p>
          </div></Reveal>
        </div>
        <Reveal delay={150}>
          <figure className="wide-photo">
            <img src={IMG.elderlyPhone} alt="An older patient waiting on hold on the phone at a clinic" loading="lazy" decoding="async" />
            <figcaption>{t("problem.caption")}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Voice section ---------- */
function Voice() {
  const { t } = useI18n();
  return (
    <section className="sec sec-dark" id="voice">
      <div className="wrap voice-grid">
        <div>
          <Reveal>
            <Eyebrow light>{t("voice.eyebrow")}</Eyebrow>
            <h2 className="h-light">{t("voice.h2a")}<br />{t("voice.h2b")}</h2>
            <p className="lead-light">{t("voice.lead")}</p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="ticks">
              <li>{t("voice.t1")}</li>
              <li>{t("voice.t2")}</li>
              <li>{t("voice.t3")}</li>
              <li>{t("voice.t4")}</li>
              <li>{t("voice.t5")}</li>
            </ul>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <img className="voice-photo" src="/voice-ai-image.webp" alt="MedXFlow Voice AI receptionist answering patient calls for a clinic" loading="lazy" decoding="async" width="1536" height="1024" />
          <CallDemo header="MEDXFLOW VOICE · LIVE" sub="MON 08:02 · 23 CALLS IN PROGRESS" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Check-in section ---------- */
function Checkin() {
  const { t } = useI18n();
  const feats = [
    [t("checkin.f1_h"), t("checkin.f1_d")],
    [t("checkin.f2_h"), t("checkin.f2_d")],
    [t("checkin.f3_h"), t("checkin.f3_d")],
    [t("checkin.f4_h"), t("checkin.f4_d")],
    [t("checkin.f5_h"), t("checkin.f5_d")],
    [t("checkin.f6_h"), t("checkin.f6_d")],
  ];
  return (
    <section className="sec" id="checkin">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("checkin.eyebrow")}</Eyebrow>
          <h2>{t("checkin.h2a")}<br />{t("checkin.h2b")}</h2>
        </Reveal>
        <div className="ck-grid">
          <Reveal delay={80}>
            <div className="ck-photos">
              <video className="ck-main" src="/kisok.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Patient using an MedXFlow Health self check-in kiosk in a clinic lobby" />
            </div>
          </Reveal>
          <div className="ck-feats">
            {feats.map(([h, d], i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="feat">
                  <h3 dangerouslySetInnerHTML={{ __html: h }} />
                  <p>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Human fail-safe / handoff ---------- */
function Handoff() {
  const { t } = useI18n();
  const steps = [
    ["⚠", t("handoff.step1_h"), t("handoff.step1_d")],
    ["↪", t("handoff.step2_h"), t("handoff.step2_d")],
    ["🙋", t("handoff.step3_h"), t("handoff.step3_d")],
  ];
  return (
    <section className="sec sec-dark" id="handoff">
      <div className="wrap">
        <Reveal>
          <Eyebrow light>{t("handoff.eyebrow")}</Eyebrow>
          <h2 className="h-light">{t("handoff.h2a")}<br />{t("handoff.h2b")}</h2>
          <p className="lead-light">{t("handoff.lead")}</p>
        </Reveal>
        <div className="ho-flow">
          {steps.map(([ic, h, d], i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="ho-step">
                <div className="ho-step-top">
                  <span className="ho-ic">{ic}</span>
                  <span className="ho-num">{i + 1}</span>
                </div>
                <h3>{h}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="ho-grid">
          <Reveal delay={120}>
            <ul className="ticks">
              <li>{t("handoff.t1")}</li>
              <li>{t("handoff.t2")}</li>
              <li>{t("handoff.t3")}</li>
              <li>{t("handoff.t4")}</li>
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <div className="ho-stat">
              <div className="ho-stat-n"><CountUp to={92} suffix="%" /></div>
              <div className="ho-stat-l">{t("handoff.stat_h")}</div>
              <a href="#cta" className="btn btn-gorse ho-cta" onClick={(e) => { e.preventDefault(); openDemo(); }}>{t("handoff.cta")}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Security & Compliance ---------- */
function Compliance() {
  const { t } = useI18n();
  const badges = [
    ["🛡️", t("compliance.b1_h"), t("compliance.b1_d")],
    ["🏅", t("compliance.b2_h"), t("compliance.b2_d")],
    ["🔒", t("compliance.b3_h"), t("compliance.b3_d")],
    ["📜", t("compliance.b4_h"), t("compliance.b4_d")],
    ["🇺🇸", t("compliance.b5_h"), t("compliance.b5_d")],
  ];
  return (
    <section className="sec sec-tint" id="compliance">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("compliance.eyebrow")}</Eyebrow>
          <h2>{t("compliance.h2a")}<br />{t("compliance.h2b")}</h2>
          <p className="body">{t("compliance.lead")}</p>
        </Reveal>
        <div className="cpl-grid">
          {badges.map(([ic, h, d], i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="cpl-badge">
                <div className="cpl-ic">{ic}</div>
                <h3>{h}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="cpl-foot"><span className="cpl-lock">🔐</span>{t("compliance.foot")}</div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Integrations ---------- */
function Integrations() {
  const { t } = useI18n();
  return (
    <section className="sec sec-tint" id="integrations">
      <div className="wrap int-grid">
        <div>
          <Reveal>
            <Eyebrow>{t("integrations.eyebrow")}</Eyebrow>
            <h2>{t("integrations.h2a")}<br />{t("integrations.h2b")}</h2>
            <p className="body">{t("integrations.body")}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="int-chips">
              <span className="ichip">Epic</span>
              <span className="ichip">athenahealth</span>
              <span className="ichip">eClinicalWorks</span>
              <span className="ichip ichip-soft">Availity</span>
              <span className="ichip ichip-soft">SMS / ZIP lookup</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <figure className="int-photo">
            <img src={IMG.doctorTablet} alt="GP reviewing the day's appointment list on a tablet" loading="lazy" decoding="async" />
            <figcaption>{t("integrations.caption")}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ROI calculator ---------- */
function ROI() {
  const { t } = useI18n();
  const [missed, setMissed] = useState(12);
  const [lostPct, setLostPct] = useState(30);
  const [fee, setFee] = useState(65);
  const lostPerMonth = Math.round(missed * (lostPct / 100) * fee * 22);
  const cost = 449;
  const net = lostPerMonth - cost;
  return (
    <section className="sec" id="roi">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("roi.eyebrow")}</Eyebrow>
          <h2>{t("roi.h2")}</h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="roi">
            <div className="roi-controls">
              <label>
                <span>{t("roi.missed")} <b>{missed}</b></span>
                <input type="range" min="2" max="40" value={missed} onChange={(e) => setMissed(+e.target.value)} />
              </label>
              <label>
                <span>{t("roi.elsewhere")} <b>{lostPct}%</b></span>
                <input type="range" min="10" max="60" step="5" value={lostPct} onChange={(e) => setLostPct(+e.target.value)} />
              </label>
              <label>
                <span>{t("roi.fee")} <b>${fee}</b></span>
                <input type="range" min="45" max="90" step="5" value={fee} onChange={(e) => setFee(+e.target.value)} />
              </label>
            </div>
            <div className="roi-out">
              <div className="roi-row"><span>{t("roi.revenueOut")}</span><b className="loss">${lostPerMonth.toLocaleString()}/mo</b></div>
              <div className="roi-row"><span>{t("roi.product")}</span><b>${cost}/mo</b></div>
              <div className="roi-row roi-net"><span>{t("roi.recovered")}</span><b className="gain">${Math.max(net, 0).toLocaleString()}</b></div>
              <p className="roi-fn">{t("roi.footnote")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
  const { t } = useI18n();
  const plans = [
    {
      name: "MedXFlow Voice", price: "$250", per: t("pricing.voice_per"),
      feats: [t("pricing.voice_f1"), t("pricing.voice_f2"), t("pricing.voice_f3"), t("pricing.voice_f4"), t("pricing.voice_f5"), t("pricing.voice_f6")],
      cta: t("pricing.voice_cta"),
    },
    {
      name: "MedXFlow Front Desk", price: "$449", per: t("pricing.fd_per"), featured: true,
      feats: [t("pricing.fd_f1"), t("pricing.fd_f2"), t("pricing.fd_f3"), t("pricing.fd_f4"), t("pricing.fd_f5")],
      cta: t("pricing.fd_cta"),
    },
    {
      name: "MedXFlow Check-in", price: "$250", per: t("pricing.ci_per"),
      feats: [t("pricing.ci_f1"), t("pricing.ci_f2"), t("pricing.ci_f3"), t("pricing.ci_f4"), t("pricing.ci_f5")],
      cta: t("pricing.ci_cta"),
    },
  ];
  return (
    <section className="sec sec-tint" id="pricing">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
          <h2>{t("pricing.h2")}</h2>
        </Reveal>
        <div className="price-grid">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 110}>
              <div className={"plan" + (p.featured ? " plan-featured" : "")}>
                {p.featured && <div className="plan-tag">{t("pricing.tag")}</div>}
                <h3>{p.name}</h3>
                <div className="plan-price">{p.price}<span>{p.per}</span></div>
                <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
                <a href="#cta" className={"btn " + (p.featured ? "btn-gorse" : "btn-line")} onClick={(e) => { e.preventDefault(); openDemo(); }}>{p.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA + footer ---------- */
function CTA() {
  const { t } = useI18n();
  return (
    <section className="sec sec-dark" id="cta">
      <div className="wrap cta-grid">
        <div className="cta-copy">
          <Reveal>
            <ShamrockMark size={46} variant="light" />
            <h2 className="h-light">{t("cta.h2a")}<br />{t("cta.h2b")}</h2>
            <p className="lead-light">{t("cta.lead")}</p>
            <div className="cta-contact">
              <a href="tel:+12103969718">📞 (210) 396-9718</a>
              <a href="https://wa.me/14693128805?text=Hi%20MedXFlow%2C%20I%27d%20like%20to%20know%20more%20about%20your%20AI%20RCM%20platform." target="_blank" rel="noopener noreferrer">💬 WhatsApp us</a>
              <a href="mailto:sales@medxflow.ai">✉ sales@medxflow.ai</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="cta-form-card">
            <h3>{t("cta.formTitle")}</h3>
            <LeadForm source="cta-inline" dark />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div className="brand brand-foot"><ShamrockMark size={24} variant="light" /><span>MedXFlow <b>Health</b></span></div>
        <div className="foot-links">
          <a href="/about/">About</a>
          <a href="/trust/">Trust &amp; Security</a>
          <a href="/roi-calculator/">ROI Calculator</a>
          <a href="/npi-lookup/">NPI Lookup</a>
          <a href="tel:+12103969718">📞 (210) 396-9718</a>
          <a href="https://wa.me/14693128805?text=Hi%20MedXFlow%2C%20I%27d%20like%20to%20know%20more%20about%20your%20AI%20RCM%20platform." target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          <a href="mailto:sales@medxflow.ai">sales@medxflow.ai</a>
        </div>
        <div className="foot-legal">{t("footer.legal")}</div>
      </div>
    </footer>
  );
}

/* ---------- Lead form + Book-a-demo modal ---------- */
const LEAD_ENDPOINT = "/.netlify/functions/lead";
const isLeadEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

// Any CTA can open the booking modal by dispatching this event.
function openDemo() {
  window.dispatchEvent(new Event("eirim:book-demo"));
}

// The nav "Tour" item starts the narrated guided tour.
function startTour() {
  window.dispatchEvent(new Event("eirim:start-tour"));
}

function LeadForm({ source = "cta", onDone, dark = false }) {
  const { t } = useI18n();
  const [f, setF] = useState({ name: "", email: "", clinic: "", phone: "", preferredTime: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !isLeadEmail(f.email)) {
      setErr(t("lead.invalid"));
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          source,
          page: window.location.pathname,
          visitorId: (typeof localStorage !== "undefined" && localStorage.getItem("eirim_vid")) || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDone(true);
      if (onDone) setTimeout(onDone, 2400);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="lead-done">
        <div className="lead-check">✓</div>
        <h3>{t("lead.doneTitle")}, {f.name.trim().split(" ")[0] || "there"}!</h3>
        <p>{t("lead.doneMsg")}</p>
      </div>
    );
  }

  return (
    <form className={"lead-form" + (dark ? " lead-form-dark" : "")} onSubmit={submit}>
      <div className="lead-row">
        <label>
          {t("lead.name")}*
          <input value={f.name} onChange={set("name")} placeholder="Jane Murphy" required />
        </label>
        <label>
          {t("lead.email")}*
          <input type="email" value={f.email} onChange={set("email")} placeholder="jane@clinic.ie" required />
        </label>
      </div>
      <div className="lead-row">
        <label>
          {t("lead.clinic")}
          <input value={f.clinic} onChange={set("clinic")} placeholder="Riverside Medical" />
        </label>
        <label>
          {t("lead.phone")}
          <input value={f.phone} onChange={set("phone")} placeholder="(214) 555-0199" />
        </label>
      </div>
      <label>
        {t("lead.bestTime")}
        <input value={f.preferredTime} onChange={set("preferredTime")} placeholder="e.g. Weekday mornings" />
      </label>
      <label>
        {t("lead.message")}
        <textarea value={f.message} onChange={set("message")} rows={2} placeholder={t("lead.messagePlaceholder")} />
      </label>
      {err && <div className="lead-err">{err}</div>}
      <button type="submit" className="btn btn-gorse btn-big lead-submit" disabled={busy}>
        {busy ? t("lead.sending") : t("lead.submit")}
      </button>
      <p className="lead-fine">{t("lead.fine")}</p>
    </form>
  );
}

export function BookDemo() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("eirim:book-demo", h);
    return () => window.removeEventListener("eirim:book-demo", h);
  }, []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="eirim">
      <div className="bd-overlay" onClick={() => setOpen(false)}>
        <div className="bd-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Book a demo">
          <button className="bd-close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
          <Eyebrow>{t("bookdemo.eyebrow")}</Eyebrow>
          <h2 className="bd-title">{t("bookdemo.title")}</h2>
          <p className="bd-sub">{t("bookdemo.sub")}</p>
          <LeadForm source="cta-modal" onDone={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}

/* ---------- About / Team ---------- */
function About() {
  const { t } = useI18n();
  const highlights = [
    { icon: "📈", h: t("about.exp1_h"), d: t("about.exp1_d") },
    { icon: "🔁", h: t("about.exp2_h"), d: t("about.exp2_d") },
    { icon: "🛠", h: t("about.exp3_h"), d: t("about.exp3_d") },
  ];
  return (
    <section className="sec sec-tint" id="about">
      <div className="wrap">
        <Reveal>
          <Eyebrow>{t("about.eyebrow")}</Eyebrow>
          <h2>{t("about.h2a")}<br />{t("about.h2b")}</h2>
          <p className="body">{t("about.body")}</p>
        </Reveal>
        <div className="team-grid">
          {highlights.map((x, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="team-card">
                <div className="team-avatar" aria-hidden="true">{x.icon}</div>
                <h3>{x.h}</h3>
                <p>{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const { t } = useI18n();
  const FAQS = [
    [t("faq.q1"), t("faq.a1")],
    [t("faq.q2"), t("faq.a2")],
    [t("faq.q3"), t("faq.a3")],
    [t("faq.q4"), t("faq.a4")],
    [t("faq.q5"), t("faq.a5")],
    [t("faq.q6"), t("faq.a6")],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="sec" id="faq">
      <div className="wrap faq-wrap">
        <Reveal>
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2>{t("faq.h2")}</h2>
        </Reveal>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <div key={i} className={"faq-item" + (open === i ? " on" : "")}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{q}</span>
                <span className="faq-caret">{open === i ? "–" : "+"}</span>
              </button>
              <div className="faq-a">
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- App ---------- */
export default function EirimFrontDesk() {
  return (
    <LanguageProvider>
      <div className="eirim">
        <style>{CSS}</style>
        <Nav />
      <Hero />
      <Problem />
      <Voice />
      <Checkin />
      <Handoff />
      <Integrations />
      <Compliance />
      <About />
        <FAQ />
        <CTA />
        <Footer />
        <BookDemo />
        <Tour />
      </div>
    </LanguageProvider>
  );
}

/* ============ styles ============ */
export const CSS = `
/* Fonts are loaded via <link> in index.html for non-render-blocking, parallel fetch. */

.eirim{
  --ink:#0D2B52; --spruce:#1A5DAD; --spruce-deep:#123F7E; --mist:#F2F6FB;
  --seaglass:#CFE0F2; --gorse:#17C3B2; --paper:#FFFFFF; --line:rgba(13,43,82,.10);
  font-family:'Figtree',system-ui,sans-serif; color:var(--ink); background:var(--paper);
  -webkit-font-smoothing:antialiased; line-height:1.6; overflow-x:hidden;
}
.eirim *{box-sizing:border-box; margin:0}
.eirim a{text-decoration:none; color:inherit}
.eirim img{display:block; max-width:100%}
.wrap{max-width:1760px; margin:0 auto; padding:0 clamp(20px,3.5vw,56px)}
.eirim h1,.eirim h2{font-family:'Bricolage Grotesque',sans-serif; letter-spacing:-0.035em; line-height:1.04; font-weight:800}
.eirim h2{font-size:clamp(30px,4.4vw,52px); margin:14px 0 18px}
.eirim h3{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; letter-spacing:-0.01em}
.eyebrow{font-family:'Spline Sans Mono',monospace; font-size:12px; letter-spacing:.22em; text-transform:uppercase; color:var(--spruce); font-weight:600}
.eyebrow-light{color:var(--gorse)}
.body{font-size:17px; color:rgba(13,43,82,.78); max-width:52ch}

/* reveal */
.rv{opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1)}
.rv-on{opacity:1; transform:none}
@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}

/* logo mark */
.logo-mark{filter:none}

/* nav */
.nav{position:fixed; inset:0 0 auto 0; z-index:50; padding:8px 0; transition:all .25s; background:#fff; border-bottom:1px solid var(--line)}
.nav-scrolled{box-shadow:0 10px 34px rgba(13,43,82,.14); padding:6px 0}
.nav-in{display:flex; align-items:center; justify-content:space-between}
.brand{display:flex; align-items:center; gap:10px; font-family:'Bricolage Grotesque',sans-serif; font-size:19px; color:var(--ink)}
.brand-logo{height:34px; width:auto; display:block}
.brand b{font-weight:800}
.brand span{line-height:1}
.nav-links{display:flex; align-items:center; gap:24px; font-weight:600; font-size:15px; color:rgba(13,43,82,.72)}
.nav-links a:hover{color:var(--spruce)}
.nav-platform{display:inline-flex; align-items:center; padding:7px 16px; border:1px solid rgba(13,43,82,.22); border-radius:8px; color:var(--spruce); font-weight:700; transition:background .15s,border-color .15s}
.nav-platform:hover{background:rgba(13,43,82,.06); border-color:rgba(13,43,82,.4)}

/* products dropdown */
.nav-dd{position:relative}
.nav-dd-btn{display:inline-flex; align-items:center; gap:5px; background:none; border:none; padding:0; font:inherit; font-weight:600; font-size:15px; color:inherit; cursor:pointer}
.nav-dd-btn:hover{color:var(--spruce)}
.nav-dd-caret{font-size:15px; transition:transform .18s}
.nav-dd:hover .nav-dd-caret, .nav-dd:focus-within .nav-dd-caret{transform:rotate(180deg)}
.nav-dd-menu{position:absolute; top:100%; left:0; margin-top:14px; min-width:238px; background:#fff; border:1px solid var(--line); border-radius:14px; box-shadow:0 22px 55px rgba(13,43,82,.18); padding:8px; display:flex; flex-direction:column; gap:2px; opacity:0; visibility:hidden; transform:translateY(8px); transition:opacity .18s ease, transform .18s ease, visibility .18s; z-index:60}
.nav-dd-menu::before{content:""; position:absolute; top:-14px; left:0; right:0; height:14px}
.nav-dd:hover .nav-dd-menu, .nav-dd:focus-within .nav-dd-menu{opacity:1; visibility:visible; transform:none}
.nav-dd-menu a{padding:10px 13px; border-radius:9px; font-size:14.5px; font-weight:600; color:var(--ink); white-space:nowrap}
.nav-dd-menu a:hover{background:var(--mist); color:var(--spruce)}
/* Full-width mega menu: spans the viewport, pinned just under the nav bar */
.nav-dd-mega{position:fixed; top:57px; left:0; right:0; width:100vw; min-width:0; max-width:none; margin-top:0; padding:0; border-radius:0; border-left:none; border-right:none; border-top:1px solid var(--line); box-shadow:0 26px 55px rgba(13,46,42,.14); transform:translateY(10px)}
.nav-scrolled ~ * .nav-dd-mega, .nav-dd-mega{top:57px}
.nav-dd:hover .nav-dd-mega, .nav-dd:focus-within .nav-dd-mega{transform:none}
.nav-dd-mega::before{content:""; position:absolute; top:-20px; left:0; right:0; height:20px}
.nav-dd-mega-inner{display:grid; grid-template-columns:repeat(6,1fr); gap:10px 26px; padding:30px clamp(20px,3vw,48px) 34px}
.nav-dd-col{display:flex; flex-direction:column; gap:1px; min-width:0}
.nav-dd-col-span2{grid-column:span 2}
.nav-dd-subgrid{display:grid; grid-template-columns:1fr 1fr; gap:1px 20px}
/* A soft light travels through the step badges 1→9, suggesting the pipeline flowing */
.nav-dd-subgrid .nav-dd-step{animation:rcmflow 5s ease-in-out infinite}
@keyframes rcmflow{
  0%,100%{background:var(--seaglass); color:var(--spruce-deep); box-shadow:0 0 0 0 rgba(23,195,178,0)}
  5%{background:#9fe8df; color:var(--spruce-deep); box-shadow:0 0 0 3px rgba(23,195,178,.16)}
  13%{background:var(--seaglass); color:var(--spruce-deep); box-shadow:0 0 0 0 rgba(23,195,178,0)}
}
@media(prefers-reduced-motion:reduce){.nav-dd-subgrid .nav-dd-step{animation:none}}
.nav-dd-mega .nav-dd-head{font-family:'Spline Sans Mono',monospace; font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); font-weight:600; padding:2px 12px 8px; margin-bottom:4px; border-bottom:1px solid var(--line)}
.nav-dd-mega a{display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:9px; font-size:14px; font-weight:600; color:var(--ink)}
.nav-dd-em{font-size:15px; width:20px; text-align:center; flex:none}
.nav-dd-all{font-weight:700; color:var(--spruce)!important; margin-top:8px; border-top:1px solid var(--line); padding-top:12px!important}
.nav-dd-step{display:inline-grid; place-items:center; width:20px; height:20px; border-radius:6px; background:var(--seaglass); color:var(--spruce-deep); font-size:11px; font-weight:800; flex:none}
.nav-dd-note{font-size:12.5px; line-height:1.5; color:rgba(13,43,82,.55); padding:6px 12px 0; font-weight:500}
/* Below the hamburger breakpoint (nav-links hidden), so this only matters if the
   mega menu is ever shown at very narrow desktop widths. Kept in sync with the
   880px hamburger breakpoint to avoid a broken in-between zone. */
@media(max-width:880px){
  .nav-dd-mega{position:absolute; top:100%; width:auto; left:0; right:auto; max-width:92vw; border:1px solid var(--line); border-radius:14px; max-height:74vh; overflow-y:auto}
  .nav-dd-mega-inner{grid-template-columns:1fr; padding:14px; gap:6px}
  .nav-dd-col-span2{grid-column:auto}
  .nav-dd-subgrid{grid-template-columns:1fr}
}
.nav-tour{display:inline-flex; align-items:center; gap:5px; color:var(--spruce)!important; font-weight:700; white-space:nowrap}
.nav-tour:hover{color:var(--spruce-deep)!important}
.nav-cta{background:var(--gorse); color:var(--ink)!important; padding:9px 18px; border-radius:999px; font-weight:700; white-space:nowrap}
.nav-cta:hover{transform:translateY(-1px)}

/* mobile hamburger + slide-down menu */
.nav-burger{display:none; flex-direction:column; justify-content:center; gap:5px; width:44px; height:44px; padding:11px; background:none; border:none; cursor:pointer}
.nav-burger span{display:block; height:2.5px; width:100%; background:var(--ink); border-radius:2px; transition:transform .25s ease, opacity .2s ease}
.nav-open .nav-burger span:nth-child(1){transform:translateY(7.5px) rotate(45deg)}
.nav-open .nav-burger span:nth-child(2){opacity:0}
.nav-open .nav-burger span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}
.nav-mobile{display:none; flex-direction:column; background:#fff; border-top:1px solid var(--line); box-shadow:0 24px 44px rgba(13,43,82,.14); max-height:calc(100vh - 60px); overflow-y:auto}
.nav-mobile a{padding:15px clamp(20px,5vw,32px); font-size:16px; font-weight:600; color:var(--ink); border-bottom:1px solid var(--line)}
.nav-mobile a:active{background:var(--mist)}
.nav-mobile-cta{color:var(--spruce)!important; font-weight:800}
.nav-mobile-lang{padding:14px clamp(20px,5vw,32px)}
@media(max-width:880px){
  .nav-links{display:none}
  .nav-burger{display:flex}
  .nav-open .nav-mobile{display:flex}
}

/* hero */
.hero{position:relative; min-height:92vh; display:grid; background:
  radial-gradient(1100px 600px at 85% -10%, #1D9E8F 0%, transparent 55%),
  linear-gradient(160deg, var(--ink) 0%, var(--spruce-deep) 58%, var(--spruce) 100%);
  color:#fff; overflow:hidden; padding:120px 0 90px}
.hero-glow{position:absolute; width:640px; height:640px; border-radius:50%; background:radial-gradient(circle, rgba(23,195,178,.14), transparent 65%); top:-180px; right:-140px; pointer-events:none}
.slide{grid-area:1/1; opacity:0; transform:translateX(80px) scale(.94); filter:blur(8px);
  transition:opacity .85s ease, transform 1s cubic-bezier(.16,.84,.24,1), filter .7s ease;
  pointer-events:none; display:flex; align-items:center; will-change:opacity, transform, filter}
.slide-on{opacity:1; transform:none; filter:none; pointer-events:auto; transition-delay:.05s}
@media(prefers-reduced-motion:reduce){.slide{transition:opacity .3s ease; transform:none; filter:none}}
.hero-grid{display:grid; grid-template-columns:.88fr 1.12fr; gap:48px; align-items:center; width:100%}
.hero h1, .hero .hero-alt-h{font-family:'Bricolage Grotesque',sans-serif; letter-spacing:-0.035em; line-height:1.04; font-weight:800; font-size:clamp(38px,5.6vw,66px); margin:16px 0 20px}
.hero h1 em, .hero .hero-alt-h em{font-style:normal; color:var(--gorse)}
.lead{font-size:19px; color:rgba(255,255,255,.85); max-width:50ch}
.lead b{color:#fff}
.btn-row{display:flex; gap:14px; margin:28px 0 22px; flex-wrap:wrap}
.btn{display:inline-block; padding:14px 26px; border-radius:999px; font-weight:700; font-size:16px; transition:transform .15s, box-shadow .15s}
.btn:hover{transform:translateY(-2px)}
.btn-gorse{background:var(--gorse); color:var(--ink); box-shadow:0 10px 30px rgba(23,195,178,.35)}
.btn-ghost{border:1.5px solid rgba(255,255,255,.4); color:#fff}
.btn-line{border:1.5px solid var(--spruce); color:var(--spruce)}
.btn-big{padding:17px 34px; font-size:17px}
.hero-note{font-family:'Spline Sans Mono',monospace; font-size:11.5px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.55)}
.hero-art{position:relative}
.hero-art img,.hero-art video{border-radius:24px; box-shadow:0 40px 90px rgba(0,0,0,.45); width:100%; height:auto; display:block}
/* Feather the hero video edges so it blends/merges into the banner */
.hero-art video{border-radius:0; box-shadow:none;
  -webkit-mask-image:linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%);
  mask-composite:intersect}
.hero-art-full img{max-height:none; object-fit:contain}
.s-arrow{position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.28); color:#fff; width:46px; height:46px; border-radius:50%; font-size:24px; cursor:pointer; z-index:6; transition:background .15s}
.s-arrow:hover{background:rgba(255,255,255,.24)}
.s-prev{left:18px}.s-next{right:18px}
.s-dots{position:absolute; bottom:24px; left:50%; transform:translateX(-50%); display:flex; gap:10px; z-index:6}
.hero-sound{position:absolute; bottom:14px; right:14px; z-index:7; display:grid; place-items:center;
  width:32px; height:32px; padding:0; line-height:1;
  background:rgba(13,43,82,.55); color:#fff; border:1px solid rgba(255,255,255,.28); backdrop-filter:blur(6px);
  border-radius:50%; font-size:14px; cursor:pointer; transition:background .15s, transform .15s}
.hero-sound:hover{background:rgba(13,43,82,.85); transform:scale(1.08)}
.hero-sound::after{content:attr(data-tip); position:absolute; bottom:calc(100% + 8px); right:0;
  background:rgba(13,43,82,.95); color:#fff; font-size:11.5px; font-weight:600; font-family:'Figtree',system-ui,sans-serif;
  padding:5px 9px; border-radius:7px; white-space:nowrap; opacity:0; pointer-events:none;
  transform:translateY(4px); transition:opacity .15s, transform .15s}
.hero-sound:hover::after{opacity:1; transform:none}
@media(max-width:880px){.hero-sound{bottom:10px; right:10px; width:30px; height:30px; font-size:13px}}
.s-dots button{width:36px; height:5px; border-radius:999px; border:none; background:rgba(255,255,255,.28); cursor:pointer; transition:background .2s}
.s-dots button.on{background:var(--gorse)}
@media(max-width:880px){
  .hero{padding:104px 0 76px; min-height:auto}
  .hero-grid{grid-template-columns:1fr; gap:36px}
  .s-arrow{display:none}
}

/* kiosk (call demo) */
.kiosk{background:#081F3F; border:1px solid rgba(207,224,242,.16); border-radius:22px; overflow:hidden; box-shadow:0 34px 80px rgba(0,0,0,.5); max-width:520px; margin:0 auto; width:100%}
.kiosk-head{display:flex; justify-content:space-between; padding:13px 18px; font-family:'Spline Sans Mono',monospace; font-size:10.5px; letter-spacing:.12em; color:var(--seaglass); border-bottom:1px solid rgba(207,224,242,.12)}
.kiosk-head span{display:flex; align-items:center; gap:7px}
.dot-live{width:8px; height:8px; border-radius:50%; background:#3DDCC9; box-shadow:0 0 10px #3DDCC9; animation:pulse 1.6s infinite}
@keyframes pulse{50%{opacity:.4}}
.kiosk-screen{padding:18px; height:330px; overflow:hidden; display:flex; flex-direction:column; gap:10px}
.bub{max-width:86%; padding:11px 15px; border-radius:15px; font-size:14.5px; line-height:1.45; animation:bubin .4s ease}
@keyframes bubin{from{opacity:0; transform:translateY(10px)}to{opacity:1}}
.bub.ai{background:var(--spruce); color:#fff; border-bottom-left-radius:5px; align-self:flex-start}
.bub.user{background:#fff; color:var(--ink); border-bottom-right-radius:5px; align-self:flex-end}
.bub.sys{background:transparent; border:1px dashed rgba(207,224,242,.4); color:var(--seaglass); font-family:'Spline Sans Mono',monospace; font-size:10.5px; letter-spacing:.1em; align-self:center; text-align:center}

/* stats */
.stats{background:var(--ink); color:#fff; padding:34px 0; border-top:1px solid rgba(255,255,255,.08)}
.stats-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:26px}
.stat-n{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(28px,3.4vw,40px); color:var(--gorse); letter-spacing:-0.02em}
.stat-l{font-size:13.5px; color:rgba(255,255,255,.66); max-width:24ch; margin-top:4px}
@media(max-width:880px){.stats-grid{grid-template-columns:repeat(2,1fr)}}

/* sections */
.sec{padding:96px 0}
.sec-tint{background:var(--mist)}
.sec-dark{background:linear-gradient(150deg,var(--ink),var(--spruce-deep)); color:#fff}
.h-light{color:#fff}
.lead-light{font-size:18px; color:rgba(255,255,255,.82); max-width:50ch; margin-top:6px}

/* problem */
.prob-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:40px}
.card{background:var(--mist); border:1px solid var(--line); border-radius:20px; padding:28px; transition:transform .2s, box-shadow .2s; height:100%}
.card:hover{transform:translateY(-4px); box-shadow:0 22px 50px rgba(13,43,82,.12)}
.card-ic{font-size:26px; margin-bottom:14px}
.card h3{font-size:19px; margin-bottom:10px}
.card p{font-size:15px; color:rgba(13,43,82,.74)}
.wide-photo{margin-top:44px}
.wide-photo img{width:100%; max-height:360px; object-fit:cover; border-radius:24px}
.wide-photo figcaption{font-family:'Spline Sans Mono',monospace; font-size:11.5px; letter-spacing:.1em; color:rgba(13,43,82,.55); margin-top:12px; text-transform:uppercase}
@media(max-width:880px){.prob-grid{grid-template-columns:1fr}}

/* voice */
.voice-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:56px; align-items:center}
.voice-photo{width:100%; height:auto; border-radius:20px; margin-bottom:24px; box-shadow:0 30px 70px rgba(0,0,0,.35); display:block}
.ticks{list-style:none; padding:0; margin-top:26px; display:flex; flex-direction:column; gap:13px}
.ticks li{padding-left:34px; position:relative; font-size:16px; color:rgba(255,255,255,.88)}
.ticks li:before{content:"✓"; position:absolute; left:0; top:-1px; width:23px; height:23px; border-radius:50%; background:var(--gorse); color:var(--ink); font-weight:800; font-size:13px; display:grid; place-items:center}
@media(max-width:880px){.voice-grid{grid-template-columns:1fr; gap:36px}}

/* human fail-safe / handoff */
.ho-flow{display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:44px; position:relative}
.ho-step{background:rgba(255,255,255,.05); border:1px solid rgba(207,224,242,.16); border-radius:20px; padding:26px; height:100%; backdrop-filter:blur(4px)}
.ho-step-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:16px}
.ho-ic{font-size:24px; width:46px; height:46px; border-radius:12px; background:rgba(23,195,178,.16); display:grid; place-items:center}
.ho-num{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:30px; color:rgba(255,255,255,.16); line-height:1}
.ho-step h3{font-size:18px; color:#fff; margin-bottom:8px}
.ho-step p{font-size:14.5px; color:rgba(255,255,255,.7); line-height:1.55}
.ho-grid{display:grid; grid-template-columns:1.1fr .9fr; gap:40px; align-items:center; margin-top:44px}
.ho-grid .ticks{margin-top:0}
.ho-stat{background:linear-gradient(150deg,rgba(23,195,178,.14),rgba(26,93,173,.14)); border:1px solid rgba(61,220,201,.3); border-radius:22px; padding:34px; text-align:center}
.ho-stat-n{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(46px,6vw,64px); color:var(--gorse); letter-spacing:-0.03em; line-height:1}
.ho-stat-l{font-size:15px; color:rgba(255,255,255,.78); max-width:34ch; margin:10px auto 0}
.ho-cta{margin-top:22px}
@media(max-width:880px){.ho-flow{grid-template-columns:1fr}.ho-grid{grid-template-columns:1fr; gap:28px}}

/* security & compliance */
.cpl-grid{display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:40px}
.cpl-badge{background:#fff; border:1px solid var(--line); border-radius:18px; padding:24px 20px; height:100%; transition:transform .18s, box-shadow .18s}
.cpl-badge:hover{transform:translateY(-3px); box-shadow:0 20px 44px rgba(13,43,82,.12)}
.cpl-ic{width:50px; height:50px; border-radius:14px; background:rgba(23,195,178,.12); display:grid; place-items:center; font-size:24px; margin-bottom:14px}
.cpl-badge h3{font-size:18px; margin-bottom:7px; color:var(--ink)}
.cpl-badge p{font-size:13.5px; color:rgba(13,43,82,.7); line-height:1.5}
.cpl-foot{display:flex; align-items:center; justify-content:center; gap:10px; margin-top:32px; padding:16px 22px; background:var(--ink); color:rgba(255,255,255,.85); border-radius:14px; font-size:14px; font-weight:600; text-align:center; flex-wrap:wrap}
.cpl-lock{font-size:18px}
@media(max-width:980px){.cpl-grid{grid-template-columns:1fr 1fr 1fr}}
@media(max-width:620px){.cpl-grid{grid-template-columns:1fr 1fr}}

/* check-in */
.ck-grid{display:grid; grid-template-columns:.9fr 1.1fr; gap:56px; margin-top:44px; align-items:start}
.ck-photos{position:relative}
.ck-main{border-radius:24px; box-shadow:0 34px 80px rgba(13,43,82,.22); width:100%; height:auto}
.ck-alt{position:absolute; width:38%; right:-14px; bottom:-26px; border-radius:18px; border:5px solid #fff; box-shadow:0 22px 55px rgba(13,43,82,.3)}
.ck-feats{display:grid; grid-template-columns:1fr 1fr; gap:26px 30px}
.feat h3{font-size:17.5px; margin-bottom:7px; color:var(--spruce-deep)}
.feat p{font-size:14.5px; color:rgba(13,43,82,.74)}
@media(max-width:880px){.ck-grid{grid-template-columns:1fr}.ck-feats{grid-template-columns:1fr}}

/* integrations */
.int-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:56px; align-items:center}
.int-chips{display:flex; flex-wrap:wrap; gap:12px; margin-top:26px}
.ichip{background:var(--ink); color:#fff; border-radius:999px; padding:11px 22px; font-weight:700; font-size:15px}
.ichip-soft{background:transparent; border:1.5px solid var(--line); color:rgba(13,43,82,.7); font-weight:600}
.int-photo img{border-radius:24px; width:100%; object-fit:cover; max-height:340px; box-shadow:0 30px 70px rgba(13,43,82,.18)}
.int-photo figcaption{font-family:'Spline Sans Mono',monospace; font-size:11.5px; letter-spacing:.1em; color:rgba(13,43,82,.55); margin-top:12px; text-transform:uppercase}
@media(max-width:880px){.int-grid{grid-template-columns:1fr; gap:32px}}

/* roi */
.roi{display:grid; grid-template-columns:1.1fr .9fr; gap:0; margin-top:40px; border-radius:26px; overflow:hidden; box-shadow:0 30px 80px rgba(13,43,82,.14); border:1px solid var(--line)}
.roi-controls{background:#fff; padding:38px; display:flex; flex-direction:column; gap:30px}
.roi-controls label span{display:flex; justify-content:space-between; font-weight:600; font-size:15.5px; margin-bottom:12px}
.roi-controls label b{color:var(--spruce); font-family:'Spline Sans Mono',monospace}
.roi-controls input[type=range]{width:100%; accent-color:var(--spruce); height:5px}
.roi-out{background:var(--ink); color:#fff; padding:38px; display:flex; flex-direction:column; justify-content:center; gap:16px}
.roi-row{display:flex; justify-content:space-between; align-items:baseline; font-size:15.5px; color:rgba(255,255,255,.8)}
.roi-row b{font-family:'Spline Sans Mono',monospace; font-size:19px}
.loss{color:#FF9E80}
.gain{color:var(--gorse); font-size:30px!important}
.roi-net{border-top:1px solid rgba(255,255,255,.14); padding-top:18px; margin-top:6px}
.roi-fn{font-size:12px; color:rgba(255,255,255,.45); margin-top:8px}
@media(max-width:880px){.roi{grid-template-columns:1fr}}

/* pricing */
.price-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:44px; align-items:stretch}
.plan{background:#fff; border:1px solid var(--line); border-radius:24px; padding:34px 30px; display:flex; flex-direction:column; height:100%; transition:transform .2s, box-shadow .2s; position:relative}
.plan:hover{transform:translateY(-5px); box-shadow:0 26px 60px rgba(13,43,82,.13)}
.plan-featured{background:var(--ink); color:#fff; border:none; box-shadow:0 34px 80px rgba(13,43,82,.3); transform:scale(1.03)}
.plan-featured:hover{transform:scale(1.03) translateY(-5px)}
.plan-tag{position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:var(--gorse); color:var(--ink); font-weight:700; font-size:12.5px; padding:6px 16px; border-radius:999px; white-space:nowrap}
.plan h3{font-size:21px; margin-bottom:14px}
.plan-price{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:40px; letter-spacing:-0.02em; margin-bottom:22px}
.plan-price span{font-family:'Figtree'; font-weight:500; font-size:13.5px; letter-spacing:0; opacity:.6; margin-left:8px}
.plan ul{list-style:none; padding:0; display:flex; flex-direction:column; gap:11px; margin-bottom:28px; flex:1}
.plan li{padding-left:26px; position:relative; font-size:14.5px; opacity:.86}
.plan li:before{content:"✓"; position:absolute; left:0; color:var(--gorse); font-weight:800}
.plan:not(.plan-featured) li:before{color:var(--spruce)}
.plan .btn{text-align:center}
@media(max-width:880px){.price-grid{grid-template-columns:1fr}.plan-featured{transform:none}}

/* cta */
.cta-in{text-align:center; max-width:680px}
.cta-in h2{margin-top:22px}
.cta-in .lead-light{margin:14px auto 0}
.btn-row-c{justify-content:center; margin-top:32px}
.cta-mail{font-family:'Spline Sans Mono',monospace; font-size:13px; letter-spacing:.1em; color:rgba(255,255,255,.55); margin-top:20px}

/* footer */
.foot{background:var(--ink); color:rgba(255,255,255,.7); padding:38px 0; border-top:1px solid rgba(255,255,255,.08)}
.foot-in{display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap}
.brand-foot{font-size:17px; color:#fff}
.foot-links{display:flex; gap:12px; font-size:14px}
.foot-links a{color:var(--seaglass); font-weight:600}
.foot-legal{font-size:12.5px; color:rgba(255,255,255,.4)}

/* a11y */
.eirim :focus-visible{outline:3px solid var(--gorse); outline-offset:3px; border-radius:6px}

/* nav phone */
.nav-phone{font-weight:700; color:var(--spruce)!important; white-space:nowrap}
.nav-scrolled .nav-phone{color:var(--spruce)!important}
@media(max-width:1024px){.nav-phone{display:none}}

/* language switcher */
.lang-switch{display:inline-flex; gap:2px; background:rgba(13,43,82,.06); border:1px solid var(--line); border-radius:999px; padding:3px}
.lang-btn{border:none; background:transparent; color:rgba(13,43,82,.6); font-family:inherit; font-weight:700; font-size:12.5px; padding:5px 10px; border-radius:999px; cursor:pointer; line-height:1}
.lang-btn:hover{color:var(--ink)}
.lang-btn.on{background:var(--spruce); color:#fff}
@media(max-width:820px){.lang-switch{margin-left:auto}}

/* CTA grid + on-page lead form */
.cta-grid{display:grid; grid-template-columns:1fr 1fr; gap:clamp(32px,4vw,64px); align-items:center}
.cta-copy .cta-contact{display:flex; flex-direction:column; gap:8px; margin-top:22px}
.cta-copy .cta-contact a{color:#fff; font-weight:700; font-size:16px; width:fit-content}
.cta-copy .cta-contact a:hover{color:var(--gorse)}
.cta-form-card{background:#fff; color:var(--ink); border-radius:20px; padding:28px; box-shadow:0 34px 80px rgba(0,0,0,.35)}
.cta-form-card h3{font-size:20px; margin-bottom:16px}
@media(max-width:880px){.cta-grid{grid-template-columns:1fr; gap:32px}}

/* lead form */
.lead-form{display:flex; flex-direction:column; gap:13px}
.lead-row{display:grid; grid-template-columns:1fr 1fr; gap:13px}
.lead-form label{display:flex; flex-direction:column; gap:5px; font-size:13px; font-weight:600; color:var(--ink)}
.lead-form input, .lead-form textarea{padding:11px 13px; border:1px solid var(--line); border-radius:10px; font-size:14.5px; font-family:inherit; color:var(--ink); background:#fff; outline:none; resize:vertical}
.lead-form input:focus, .lead-form textarea:focus{border-color:var(--spruce); box-shadow:0 0 0 3px rgba(26,93,173,.12)}
.lead-submit{width:100%; text-align:center; margin-top:4px; cursor:pointer; border:none}
.lead-submit:disabled{opacity:.6}
.lead-fine{font-size:11.5px; color:rgba(13,43,82,.5); text-align:center; margin:0}
.lead-err{background:rgba(217,83,79,.12); border:1px solid rgba(217,83,79,.35); color:#b23b36; padding:8px 11px; border-radius:8px; font-size:12.5px}
.lead-done{text-align:center; padding:14px 8px}
.lead-check{width:52px; height:52px; margin:0 auto 14px; border-radius:50%; background:var(--spruce); color:#fff; display:grid; place-items:center; font-size:26px; font-weight:800}
.lead-done h3{font-size:20px; margin-bottom:8px}
.lead-done p{font-size:14.5px; color:rgba(13,43,82,.72); max-width:34ch; margin:0 auto}
@media(max-width:560px){.lead-row{grid-template-columns:1fr}}

/* book-demo modal */
.bd-overlay{position:fixed; inset:0; z-index:10000; background:rgba(8,22,42,.6); backdrop-filter:blur(4px); display:grid; place-items:center; padding:20px; animation:bdfade .2s ease}
@keyframes bdfade{from{opacity:0}to{opacity:1}}
.bd-modal{position:relative; background:#fff; color:var(--ink); border-radius:22px; padding:clamp(24px,4vw,40px); width:min(560px,100%); max-height:92vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,.5); animation:bdpop .24s cubic-bezier(.2,.8,.2,1)}
@keyframes bdpop{from{opacity:0; transform:translateY(18px) scale(.98)}to{opacity:1; transform:none}}
.bd-close{position:absolute; top:14px; right:16px; background:transparent; border:none; font-size:28px; line-height:1; color:rgba(13,43,82,.5); cursor:pointer}
.bd-close:hover{color:var(--ink)}
.bd-title{font-size:clamp(24px,3vw,32px); margin:10px 0 8px}
.bd-sub{font-size:15px; color:rgba(13,43,82,.7); margin-bottom:20px}

/* About / Team */
.team-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:44px}
.team-card{background:#fff; border:1px solid var(--line); border-radius:20px; padding:28px; height:100%}
.team-avatar{width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,var(--spruce),#1D9E8F); color:#fff; display:grid; place-items:center; font-weight:800; font-size:20px; margin-bottom:16px}
.team-card h3{font-size:18px; margin-bottom:3px}
.team-role{font-size:13px; font-weight:700; color:var(--spruce); margin-bottom:11px}
.team-card p{font-size:14.5px; color:rgba(13,43,82,.74); line-height:1.55}
@media(max-width:880px){.team-grid{grid-template-columns:1fr}}

/* FAQ */
.faq-wrap{max-width:820px}
.faq-list{margin-top:36px; display:flex; flex-direction:column; gap:12px}
.faq-item{border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#fff; transition:box-shadow .2s}
.faq-item.on{box-shadow:0 16px 40px rgba(13,43,82,.1)}
.faq-q{width:100%; display:flex; justify-content:space-between; align-items:center; gap:16px; background:transparent; border:none; padding:18px 22px; text-align:left; cursor:pointer; font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:17px; color:var(--ink)}
.faq-caret{flex:none; font-size:22px; color:var(--spruce); font-weight:700}
.faq-a{max-height:0; overflow:hidden; transition:max-height .3s ease}
.faq-item.on .faq-a{max-height:320px}
.faq-a p{padding:0 22px 20px; font-size:15px; color:rgba(13,43,82,.76); line-height:1.6; margin:0}
`;
