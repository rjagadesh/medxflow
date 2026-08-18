// SEO pillar page targeting "AI agents for healthcare RCM". Keyword appears in
// the URL (/ai-agents-rcm), <title>, H1, section headings and body, with
// internal links to product pages + blog. Prerendered with Service + FAQ schema.

import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";
import { AI_AGENTS as AGENTS, AI_AGENTS_INTRO, AI_AGENTS_FAQ as FAQ } from "./ai-agents-rcm.data.js";

export default function AiAgentsRcm() {
  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <Nav resources />

      <header className="pl-hero">
        <div className="wrap">
          <p className="eyebrow">AI Agents · Revenue Cycle Management</p>
          <h1>AI Agents for Healthcare Revenue Cycle Management</h1>
          <p className="pl-lede">{AI_AGENTS_INTRO}</p>
          <div className="pl-cta-row">
            <a className="btn" href="/#cta">Book a free demo</a>
            <a className="btn btn-ghost" href="/products">See all products</a>
          </div>
        </div>
      </header>

      <main className="wrap pl-main">
        <section className="pl-sec pl-video">
          <div className="pl-video-frame">
            <iframe
              src="https://www.youtube.com/embed/5FWau1ZzAgA"
              title="MedXFlow - AI Revenue Cycle Management & Medical Billing"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="pl-sec">
          <h2>What is an AI agent for healthcare RCM?</h2>
          <p>An <strong>AI agent for healthcare revenue cycle management</strong> is software that carries out an RCM task from start to finish - navigating your systems and payer portals, extracting and validating information, applying your business rules, and routing exceptions to staff. Where older automation handled a single step, an agent owns the whole workflow and works continuously, without adding another task to your team.</p>
          <p>MedXFlow deploys a connected set of these agents across the revenue cycle, so cash moves from the first appointment to the final payment with far less manual work.</p>
        </section>

        <section className="pl-sec">
          <h2>The RCM agents MedXFlow runs</h2>
          <div className="pl-grid">
            {AGENTS.map((a) => (
              <a key={a.h} className="pl-card" href={a.href}>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
                <span className="pl-card-link">Learn more →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="pl-sec">
          <h2>How the agents work</h2>
          <p>Every MedXFlow RCM agent follows the same reliable loop, with your staff in control of the exceptions:</p>
          <div className="pl-flow">
            {["Receive", "Understand", "Process", "Validate", "Escalate", "Track"].map((s, i) => (
              <span key={s} className="pl-flow-step">{i + 1}. {s}</span>
            ))}
          </div>
          <p className="pl-note">Every action is documented, assigned and auditable - AI backed by humans, never left unattended.</p>
        </section>

        <section className="pl-sec">
          <h2>Why practices use AI agents for RCM</h2>
          <ul className="pl-benefits">
            <li><strong>Fewer denials</strong> - issues are caught at eligibility and coding, before the claim goes out.</li>
            <li><strong>Faster cash</strong> - claims go out clean and follow-up never stalls, so A/R and DNFB days drop.</li>
            <li><strong>Less manual work</strong> - staff stop moving information between screens and focus on judgment calls.</li>
            <li><strong>Works with your stack</strong> - Epic, athenahealth, eClinicalWorks and more, no rip-and-replace.</li>
          </ul>
        </section>

        <section className="pl-sec pl-read">
          <h2>Go deeper</h2>
          <div className="pl-read-links">
            <a href="/blog/reduce-claim-denials-small-practice">How to reduce claim denials in a small practice →</a>
            <a href="/blog/prior-authorization-automation-guide">Prior authorization automation: a practical guide →</a>
            <a href="/blog/what-is-dnfb-clear-coding-backlog">What is DNFB, and how to clear a coding backlog →</a>
          </div>
        </section>

        <section className="pl-sec pl-faq">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} className="pl-faq-item">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <section className="pl-final">
          <h2>See MedXFlow's AI agents on your revenue cycle</h2>
          <p>Book a free demo and watch the agents work eligibility, prior auth, coding, claims and denials on real cases.</p>
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
.pl-nav{display:flex; align-items:center; justify-content:space-between; gap:16px; max-width:1000px; margin:0 auto; padding:18px 24px; flex-wrap:wrap}
.pl-brand{font-size:20px; font-weight:800; color:var(--ink); text-decoration:none}
.pl-brand span{color:var(--gorse)}
.pl-nav-links{display:flex; align-items:center; gap:22px; font-weight:600; font-size:15px}
.pl-nav-links a{color:#3E5064; text-decoration:none}
.pl-nav-links a:hover{color:var(--spruce)}
.pl-nav-cta{background:var(--ink); color:#fff !important; padding:9px 16px; border-radius:9px}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:52px 0 46px}
.pl-lede{font-size:19px; color:#33455A; max-width:640px; margin:0 0 24px}
.pl-cta-row{display:flex; gap:12px; flex-wrap:wrap}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.pillar .btn:hover{background:var(--spruce)}
.pillar .btn-ghost{background:#fff; color:var(--ink); border:1px solid var(--seaglass)}
.pl-main{padding:12px 24px 40px}
.pl-video{margin-top:24px}
.pl-video-frame{position:relative; width:100%; max-width:720px; margin:0 auto; aspect-ratio:16/9; border-radius:14px; overflow:hidden; border:1px solid var(--seaglass); box-shadow:0 10px 30px rgba(16,40,80,.12)}
.pl-video-frame iframe{position:absolute; inset:0; width:100%; height:100%; border:0}
.pl-sec{margin-top:44px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 14px; font-weight:800; text-wrap:balance}
.pl-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:70ch}
.pl-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-top:6px}
.pl-card{display:flex; flex-direction:column; gap:8px; background:var(--paper); border:1px solid var(--seaglass); border-radius:14px; padding:20px; text-decoration:none; color:inherit; transition:box-shadow .15s,transform .15s,border-color .15s}
.pl-card:hover{box-shadow:0 10px 28px rgba(16,40,80,.1); transform:translateY(-2px); border-color:var(--spruce)}
.pl-card h3{font-size:17px; margin:0; font-weight:800}
.pl-card p{font-size:14.5px; color:#5A6B7E; margin:0}
.pl-card-link{font-size:13.5px; font-weight:700; color:var(--spruce)}
.pl-flow{display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 12px}
.pl-flow-step{background:var(--mist); border:1px solid var(--seaglass); color:var(--ink); font-weight:700; font-size:14px; padding:8px 14px; border-radius:9px}
.pl-note{font-size:14.5px; color:#5A6B7E}
.pl-benefits{margin:0; padding-left:20px; max-width:70ch}
.pl-benefits li{font-size:16.5px; color:#33455A; margin:8px 0}
.pl-read-links{display:flex; flex-direction:column; gap:10px}
.pl-read-links a{color:var(--spruce); text-decoration:none; font-weight:600; font-size:16px}
.pl-read-links a:hover{text-decoration:underline}
.pl-faq{border-top:1px solid var(--seaglass); padding-top:30px}
.pl-faq-item{margin-bottom:18px}
.pl-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800}
.pl-faq-item p{font-size:16px; color:#33455A; margin:0; max-width:70ch}
.pl-final{margin:52px 0 20px; padding:34px; background:var(--ink); border-radius:18px; text-align:center; color:#fff}
.pl-final h2{font-size:24px; margin:0 0 10px; font-weight:800; color:#fff}
.pl-final p{font-size:16px; color:#CFE0F2; margin:0 0 18px}
.pl-final .btn{background:var(--gorse); color:#062b28}
.pl-foot{border-top:1px solid var(--seaglass); margin-top:20px; padding:26px 0; background:var(--mist)}
.pl-foot .wrap{display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; font-size:13.5px; color:#5A6B7E}
.pl-foot a{color:var(--spruce); text-decoration:none}
@media(max-width:640px){.pl-nav-links{gap:14px; font-size:14px}}
`;
