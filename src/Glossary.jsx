import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";
import { TERMS, term as findTerm } from "./glossary.data.js";

// RCM glossary. Index = A–Z list of terms; each term is its own small page with
// a definition, explanation and internal links. Shared site header/footer.

function Shell({ children }) {
  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{GL_CSS}</style>
        <Nav resources />
        {children}
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

export function GlossaryIndex() {
  useEffect(() => { document.title = "RCM Glossary · MedXFlow"; window.scrollTo(0, 0); }, []);
  const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <Shell>
      <main className="wrap gl-wrap">
        <header className="gl-head">
          <p className="eyebrow">Glossary</p>
          <h1>Revenue Cycle Management glossary</h1>
          <p className="gl-lede">Plain-English definitions of the RCM, coding and billing terms that run your revenue cycle — from DNFB to CARC codes to days in A/R.</p>
        </header>
        <div className="gl-grid">
          {sorted.map((t) => (
            <a key={t.slug} className="gl-card" href={`/glossary/${t.slug}`}>
              <b>{t.term}</b>
              <span>{t.def}</span>
            </a>
          ))}
        </div>
      </main>
    </Shell>
  );
}

export function GlossaryTerm({ slug }) {
  const t = findTerm(slug);
  useEffect(() => { if (t) { document.title = `${t.term} — RCM Glossary · MedXFlow`; window.scrollTo(0, 0); } }, [t]);
  if (!t) {
    return <Shell><main className="wrap gl-article"><p className="eyebrow">Not found</p><h1>Term not found</h1><p><a href="/glossary">← Back to the glossary</a></p></main></Shell>;
  }
  const seeTerms = (t.see || []).map(findTerm).filter(Boolean);
  return (
    <Shell>
      <main className="wrap gl-article">
        <nav className="gl-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/glossary">Glossary</a><span>›</span><span>{t.term}</span></nav>
        <p className="eyebrow">RCM Glossary</p>
        <h1>{t.term}</h1>
        <p className="gl-def">{t.def}</p>
        {t.body.map((p, i) => <p key={i} className="gl-body">{p}</p>)}

        {t.related && (
          <div className="gl-cta">
            <a className="btn" href={t.related.href}>{t.related.label} →</a>
          </div>
        )}

        {seeTerms.length > 0 && (
          <div className="gl-see">
            <p className="eyebrow">Related terms</p>
            <div className="gl-see-links">
              {seeTerms.map((s) => <a key={s.slug} href={`/glossary/${s.slug}`}>{s.term} →</a>)}
            </div>
          </div>
        )}

        <p className="gl-back"><a href="/glossary">← All RCM terms</a></p>
      </main>
    </Shell>
  );
}

const GL_CSS = `
.gl-wrap{max-width:1080px; margin:0 auto; padding:40px 24px 70px}
.gl-article{max-width:760px; margin:0 auto; padding:36px 24px 80px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.gl-head{padding:0 0 26px; border-bottom:1px solid var(--seaglass); margin-bottom:30px}
.gl-head h1{font-size:clamp(28px,4.5vw,42px); line-height:1.1; letter-spacing:-.02em; margin:0 0 14px; font-weight:800; color:var(--ink)}
.gl-lede{font-size:18px; color:#3E5064; max-width:640px}
.gl-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px}
.gl-card{display:flex; flex-direction:column; gap:6px; background:var(--paper); border:1px solid var(--seaglass); border-radius:13px; padding:18px; text-decoration:none; color:inherit; transition:box-shadow .15s,transform .15s,border-color .15s}
.gl-card:hover{box-shadow:0 8px 22px rgba(16,40,80,.1); transform:translateY(-2px); border-color:var(--spruce)}
.gl-card b{font-size:15.5px; color:var(--ink); font-weight:800}
.gl-card span{font-size:13.5px; color:#5A6B7E; line-height:1.5; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden}
.gl-crumbs{font-size:13px; color:#6B7C8E; display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:16px}
.gl-crumbs a{color:var(--spruce); text-decoration:none}
.gl-article h1{font-size:clamp(26px,4vw,38px); line-height:1.12; letter-spacing:-.02em; margin:2px 0 16px; font-weight:800; color:var(--ink); text-wrap:balance}
.gl-def{font-size:19px; line-height:1.55; color:#2B3D50; font-weight:600; margin:0 0 18px}
.gl-body{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:68ch}
.gl-cta{margin:26px 0}
.blog .btn{display:inline-block; background:var(--ink); color:#fff; padding:11px 20px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.blog .btn:hover{background:var(--spruce)}
.gl-see{margin-top:34px; padding-top:22px; border-top:1px solid var(--seaglass)}
.gl-see-links{display:flex; flex-direction:column; gap:9px}
.gl-see-links a{color:var(--spruce); text-decoration:none; font-weight:600; font-size:15.5px}
.gl-see-links a:hover{text-decoration:underline}
.gl-back{margin-top:34px}
.gl-back a{color:var(--spruce); text-decoration:none; font-weight:700; font-size:14px}
`;
