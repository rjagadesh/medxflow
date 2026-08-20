import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";

// About page - establishes who MedXFlow is, its RCM expertise, and trust and
// compliance signals. This is a core E-E-A-T page for a healthcare (YMYL) site.
// All claims mirror what is already stated on the site; nothing is fabricated.

export default function About() {
  useEffect(() => { document.title = "About MedXFlow · AI Revenue Cycle Management"; window.scrollTo(0, 0); }, []);
  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{AB_CSS}</style>
        <Nav resources />
        <main className="wrap ab-wrap">
          <header className="ab-head">
            <p className="eyebrow">About</p>
            <h1>About MedXFlow</h1>
            <p className="ab-lede">MedXFlow is an AI-powered revenue cycle management platform. Our AI agents automate the repetitive work across the healthcare revenue cycle so medical practices, billing companies and RCM teams get paid faster with less manual effort.</p>
          </header>

          <section className="ab-sec">
            <h2>What we do</h2>
            <p>MedXFlow runs the revenue cycle with AI agents that carry out each task end to end: eligibility and benefits verification, prior authorization, charge capture and medical coding, claims submission and follow-up, denial management and appeals, payment posting, and patient statements and collections. The agents navigate payer portals, extract and validate data, apply your business rules, and escalate exceptions to your team.</p>
            <p>For practices that would rather hand it all off, a human-led Managed Billing team can run the entire revenue cycle.</p>
          </section>

          <section className="ab-sec">
            <h2>Our approach and expertise</h2>
            <p>MedXFlow is built around how the revenue cycle actually works. Each agent maps to a real RCM stage, applies payer-specific rules, and is designed for the constant change in payer requirements that breaks brittle, script-based automation. It is AI backed by humans: agents handle the repetitive volume, and staff own the judgment calls, with every action documented, assigned and auditable.</p>
            <p>We publish practical <a href="/blog/">RCM guides</a>, a plain-English <a href="/glossary/">revenue cycle glossary</a>, and a <a href="/denial-codes/">denial code lookup</a> because we believe the people who run billing should be able to understand and trust the tools that support them.</p>
          </section>

          <section className="ab-sec">
            <h2>Security and compliance</h2>
            <ul className="ab-trust">
              <li><b>HIPAA</b> - PHI is handled to HIPAA standards, with a Business Associate Agreement (BAA) available.</li>
              <li><b>SOC 2</b> - security controls aligned to SOC 2 Type II.</li>
              <li><b>US data centers</b> - data stored in the United States, encrypted in transit and at rest.</li>
              <li><b>Least-privilege access and audit logging</b> - every action is tracked and reviewable.</li>
              <li><b>Works with your systems</b> - Epic, athenahealth, eClinicalWorks and more, writing data back rather than replacing them.</li>
            </ul>
          </section>

          <section className="ab-sec">
            <h2>Who we serve</h2>
            <p>MedXFlow serves medical practices, billing companies, MSOs and revenue cycle teams across the United States, from lean practices with a small billing team to organizations managing the revenue cycle for many practices at once.</p>
          </section>

          <section className="ab-contact">
            <h2>Contact</h2>
            <p><a href="tel:+12103969718">(210) 396-9718</a> · <a href="mailto:sales@medxflow.ai">sales@medxflow.ai</a> · <a href="/#cta">Book a demo</a></p>
          </section>
        </main>
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const AB_CSS = `
.ab-wrap{max-width:820px; margin:0 auto; padding:40px 24px 70px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.ab-head{padding:0 0 26px; border-bottom:1px solid var(--seaglass); margin-bottom:10px}
.ab-head h1{font-size:clamp(30px,5vw,46px); line-height:1.08; letter-spacing:-.02em; margin:0 0 14px; font-weight:800; color:var(--ink)}
.ab-lede{font-size:19px; line-height:1.6; color:#2B3D50; max-width:66ch; font-weight:500}
.ab-sec{margin-top:34px}
.ab-sec h2{font-size:24px; letter-spacing:-.01em; margin:0 0 12px; font-weight:800; color:var(--ink)}
.ab-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:70ch}
.ab-sec a{color:var(--spruce)}
.ab-trust{margin:6px 0 0; padding-left:20px; max-width:72ch}
.ab-trust li{font-size:16px; color:#33455A; margin:9px 0}
.ab-trust li b{color:var(--ink)}
.ab-contact{margin-top:38px; padding:24px; background:var(--mist); border:1px solid var(--seaglass); border-radius:16px}
.ab-contact h2{font-size:20px; margin:0 0 8px; font-weight:800; color:var(--ink)}
.ab-contact p{font-size:16.5px; margin:0; color:#33455A}
.ab-contact a{color:var(--spruce); font-weight:700; text-decoration:none}
`;
