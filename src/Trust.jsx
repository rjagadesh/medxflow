import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";

// Trust / security center. Showcases MedXFlow's security and compliance posture.
// A strong trust + E-E-A-T signal for a healthcare (YMYL) site. Every claim
// mirrors what the site already states; nothing is fabricated or over-claimed.

const PILLARS = [
  { ic: "🛡️", h: "HIPAA compliant", p: "PHI is handled to HIPAA standards, and a Business Associate Agreement (BAA) is available for every customer." },
  { ic: "📋", h: "SOC 2-aligned controls", p: "Security controls are aligned to SOC 2 Type II across availability, confidentiality and processing integrity." },
  { ic: "🇺🇸", h: "US data residency", p: "Data is stored in United States data centers." },
  { ic: "🔒", h: "Encryption everywhere", p: "Data is encrypted in transit and at rest using industry-standard encryption." },
  { ic: "👤", h: "Least-privilege access", p: "Access follows least-privilege principles, so people and agents can only reach what they need." },
  { ic: "🧾", h: "Full audit logging", p: "Every action, human or AI agent, is documented, assigned and auditable." },
  { ic: "🚫", h: "Your data stays yours", p: "We never sell patient data or use PHI to train public models." },
  { ic: "🔌", h: "Secure integrations", p: "MedXFlow works with Epic, athenahealth, eClinicalWorks and more, writing data back through secure connections rather than replacing your systems." },
];

const FAQ = [
  { q: "Is MedXFlow HIPAA compliant?", a: "Yes. MedXFlow handles protected health information (PHI) to HIPAA standards and offers a Business Associate Agreement (BAA) to every customer." },
  { q: "Will you sign a BAA?", a: "Yes. A Business Associate Agreement is available for every customer before any PHI is exchanged." },
  { q: "Is MedXFlow SOC 2 certified?", a: "MedXFlow's security controls are aligned to SOC 2 Type II across availability, confidentiality and processing integrity." },
  { q: "Where is data stored?", a: "In United States data centers, encrypted in transit and at rest, with least-privilege access and full audit logging." },
  { q: "Do you use patient data to train AI?", a: "No. We never sell patient data or use PHI to train public models. Your data is used to run your revenue cycle, not to train shared models." },
  { q: "Are AI agent actions auditable?", a: "Yes. Every action an agent takes is documented and assigned, so there is a complete, reviewable trail of what happened and why." },
];

export default function Trust() {
  useEffect(() => { document.title = "Trust & Security · HIPAA, SOC 2, BAA · MedXFlow"; window.scrollTo(0, 0); }, []);
  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{TR_CSS}</style>
        <Nav resources />
        <main className="wrap tc-wrap">
          <header className="tc-head">
            <p className="eyebrow">Trust &amp; Security</p>
            <h1>Security and compliance at MedXFlow</h1>
            <p className="tc-lede">MedXFlow handles protected health information for medical practices, billing companies and RCM teams. Security and compliance are built into how the platform and its AI agents work, not bolted on.</p>
            <div className="tc-badges">
              <span>HIPAA</span><span>BAA available</span><span>SOC 2-aligned</span><span>US data centers</span><span>Encrypted</span>
            </div>
          </header>

          <section className="tc-grid">
            {PILLARS.map((x) => (
              <div className="tc-card" key={x.h}>
                <span className="tc-ic">{x.ic}</span>
                <b>{x.h}</b>
                <p>{x.p}</p>
              </div>
            ))}
          </section>

          <section className="tc-sec">
            <h2>How AI agents handle PHI safely</h2>
            <p>MedXFlow's AI agents run the revenue cycle, so they work with PHI by design. That work happens inside HIPAA-standard handling, with encryption, least-privilege access, and a complete audit trail of every step. Agents escalate uncertain or unusual cases to your staff rather than acting unsupervised, which keeps a human accountable for exceptions.</p>
          </section>

          <section className="tc-sec tc-faq">
            <h2>Security &amp; compliance FAQ</h2>
            {FAQ.map((f) => (
              <div className="tc-faq-item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>

          <section className="tc-cta">
            <h2>Have a security or compliance question?</h2>
            <p>Ask us anything about HIPAA, the BAA, data handling, or how the AI agents keep PHI secure.</p>
            <p className="tc-contact"><a href="mailto:sales@medxflow.ai">sales@medxflow.ai</a> · <a href="tel:+14693128805">(469) 312-8805</a> · <a href="/#cta">Book a demo</a></p>
          </section>
        </main>
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const TR_CSS = `
.tc-wrap{max-width:900px; margin:0 auto; padding:40px 24px 70px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.tc-head{padding:0 0 24px; border-bottom:1px solid var(--seaglass); margin-bottom:30px}
.tc-head h1{font-size:clamp(28px,4.6vw,44px); line-height:1.08; letter-spacing:-.02em; margin:0 0 14px; font-weight:800; color:var(--ink)}
.tc-lede{font-size:18.5px; line-height:1.6; color:#2B3D50; max-width:68ch; font-weight:500}
.tc-badges{display:flex; flex-wrap:wrap; gap:8px; margin-top:20px}
.tc-badges span{font-size:12.5px; font-weight:800; color:var(--accent-strong,#0E8A7D); background:var(--mist); border:1px solid var(--seaglass); padding:6px 13px; border-radius:999px}
.tc-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:14px}
.tc-card{background:var(--paper); border:1px solid var(--seaglass); border-radius:14px; padding:20px}
.tc-ic{font-size:24px; display:block; margin-bottom:8px}
.tc-card b{font-size:16px; color:var(--ink); font-weight:800}
.tc-card p{font-size:14.5px; color:#5A6B7E; margin:6px 0 0; line-height:1.55}
.tc-sec{margin-top:36px}
.tc-sec h2{font-size:24px; letter-spacing:-.01em; margin:0 0 12px; font-weight:800; color:var(--ink)}
.tc-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:72ch}
.tc-faq{border-top:1px solid var(--seaglass); padding-top:28px}
.tc-faq-item{margin-bottom:18px}
.tc-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800; color:var(--ink)}
.tc-faq-item p{font-size:16px; color:#33455A; margin:0; max-width:72ch}
.tc-cta{margin-top:38px; padding:26px; background:var(--ink); border-radius:18px; color:#fff}
.tc-cta h2{font-size:22px; margin:0 0 8px; font-weight:800; color:#fff}
.tc-cta p{font-size:16px; color:#CFE0F2; margin:0 0 8px}
.tc-contact a{color:var(--gorse); font-weight:700; text-decoration:none}
`;
