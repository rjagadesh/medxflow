// Careers page. Lists open RCM + AI roles with full JDs. Content and JobPosting
// schema are prerendered for SEO / Google Jobs. Apply by email.

import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";
import { ROLES, CAREERS_INTRO } from "./careers.data.js";

const applyHref = (title) =>
  `mailto:careers@medxflow.ai?subject=${encodeURIComponent("Application: " + title)}&body=${encodeURIComponent("Hi MedXFlow team,\n\nI'd like to apply for the " + title + " role. My resume is attached.\n\n")}`;

export default function Careers() {
  useEffect(() => { document.title = "Careers · Join MedXFlow · AI Revenue Cycle Management"; window.scrollTo(0, 0); }, []);
  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <style>{CR_CSS}</style>
        <Nav />

        <header className="pl-hero">
          <div className="wrap">
            <p className="eyebrow">Careers at MedXFlow</p>
            <h1>Build the future of the healthcare revenue cycle</h1>
            <p className="pl-lede">{CAREERS_INTRO}</p>
            <div className="cr-badges">
              <span>Remote-first (US)</span><span>AI + certified RCM experts</span><span>Ownership and craft</span>
            </div>
          </div>
        </header>

        <main className="wrap pl-main">
          <section className="pl-sec">
            <h2>{ROLES.length} open roles</h2>
            <p className="cr-sub">Click a role to see the full description. To apply, email your resume to <a href="mailto:careers@medxflow.ai">careers@medxflow.ai</a>.</p>
            <div className="cr-list">
              {ROLES.map((r) => (
                <details className="cr-role" key={r.slug} id={r.slug}>
                  <summary>
                    <div className="cr-role-head">
                      <b className="cr-role-title">{r.title}</b>
                      <span className="cr-role-team">{r.team}</span>
                    </div>
                    <div className="cr-role-meta">
                      <span>{r.type}</span><span>{r.location}</span><span>{r.experience}</span>
                    </div>
                    <p className="cr-role-summary">{r.summary}</p>
                    <span className="cr-role-more">View details</span>
                  </summary>
                  <div className="cr-role-body">
                    <h3>What you will do</h3>
                    <ul>{r.responsibilities.map((x, i) => <li key={i}>{x}</li>)}</ul>
                    <h3>What we are looking for</h3>
                    <ul>{r.requirements.map((x, i) => <li key={i}>{x}</li>)}</ul>
                    <a className="btn cr-apply" href={applyHref(r.title)}>Apply for this role →</a>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="pl-final">
            <h2>Do not see your role?</h2>
            <p>We are always looking for exceptional coders, billers, RCM leaders and AI builders. Send your resume and tell us where you would make an impact.</p>
            <a className="btn" href="mailto:careers@medxflow.ai?subject=General%20application">Email careers@medxflow.ai →</a>
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
.pillar .wrap:not(.nav-in):not(.foot-in){max-width:900px; margin:0 auto; padding:0 24px}
.pillar .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 12px}
.pillar h1{font-size:clamp(30px,5vw,46px); line-height:1.08; letter-spacing:-.02em; margin:0 0 16px; font-weight:800; text-wrap:balance}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:72px 0 40px}
.pl-lede{font-size:18.5px; color:#33455A; max-width:70ch; margin:0 0 20px}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.pillar .btn:hover{background:var(--spruce)}
.pl-main{padding:12px 24px 40px}
.pl-sec{margin-top:40px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 10px; font-weight:800}
.pl-final{margin:48px 0 20px; padding:34px; background:var(--ink); border-radius:18px; text-align:center; color:#fff}
.pl-final h2{font-size:23px; margin:0 0 10px; font-weight:800; color:#fff}
.pl-final p{font-size:16px; color:#CFE0F2; margin:0 0 18px; max-width:60ch; margin-left:auto; margin-right:auto}
.pl-final .btn{background:var(--gorse); color:#062b28}
`;

const CR_CSS = `
.cr-badges{display:flex; flex-wrap:wrap; gap:8px}
.cr-badges span{font-size:12.5px; font-weight:800; color:#0E8A7D; background:var(--mist); border:1px solid var(--seaglass); padding:6px 13px; border-radius:999px}
.cr-sub{font-size:15.5px; color:#5A6B7E; margin:0 0 22px}
.cr-sub a{color:var(--spruce); font-weight:700; text-decoration:none}
.cr-list{display:flex; flex-direction:column; gap:12px}
.cr-role{border:1px solid var(--seaglass); border-radius:14px; background:var(--paper); overflow:hidden; transition:box-shadow .15s, border-color .15s}
.cr-role[open]{box-shadow:0 10px 30px rgba(16,40,80,.08); border-color:var(--spruce)}
.cr-role summary{list-style:none; cursor:pointer; padding:18px 20px; position:relative}
.cr-role summary::-webkit-details-marker{display:none}
.cr-role-head{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap}
.cr-role-title{font-size:18px; color:var(--ink); font-weight:800}
.cr-role-team{font-size:11.5px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; color:var(--spruce); background:var(--mist); border:1px solid var(--seaglass); padding:4px 10px; border-radius:999px}
.cr-role-meta{display:flex; flex-wrap:wrap; gap:8px 16px; margin:9px 0 8px; font-size:13.5px; color:#5A6B7E; font-weight:600}
.cr-role-meta span{display:inline-flex; align-items:center; gap:6px}
.cr-role-meta span::before{content:"•"; color:var(--gorse); font-weight:800}
.cr-role-summary{font-size:15px; color:#33455A; margin:0; line-height:1.55}
.cr-role-more{display:inline-block; margin-top:10px; font-size:13.5px; font-weight:700; color:var(--spruce)}
.cr-role[open] .cr-role-more{display:none}
.cr-role-body{padding:0 20px 20px; border-top:1px solid var(--mist); margin-top:4px}
.cr-role-body h3{font-size:14px; font-weight:800; color:var(--ink); margin:18px 0 8px; letter-spacing:.01em}
.cr-role-body ul{margin:0; padding-left:20px}
.cr-role-body li{font-size:15px; color:#33455A; margin:0 0 7px; line-height:1.5}
.cr-apply{margin-top:18px}
`;
