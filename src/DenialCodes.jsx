import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";
import { CODES, denialCode } from "./denial-codes.data.js";

// Denial code lookup. Index lists all codes grouped by category; each code is
// its own page (what it means, common cause, how to fix). Shared site chrome.

function Shell({ children }) {
  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{DC_CSS}</style>
        <Nav resources />
        {children}
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

export function DenialCodesIndex() {
  useEffect(() => { document.title = "Denial Code Lookup · CARC & RARC Codes · MedXFlow"; window.scrollTo(0, 0); }, []);
  const cats = [...new Set(CODES.map((c) => c.cat))];
  return (
    <Shell>
      <main className="wrap dc-wrap">
        <header className="dc-head">
          <p className="eyebrow">Denial Code Lookup</p>
          <h1>Medical claim denial codes, explained</h1>
          <p className="dc-lede">Look up a CARC or RARC denial code to see what it means, why it happens, and how to fix it. Search by the exact code (for example CO-45, CO-197, PR-1).</p>
        </header>
        {cats.map((cat) => (
          <section key={cat} className="dc-group">
            <h2>{cat}</h2>
            <div className="dc-grid">
              {CODES.filter((c) => c.cat === cat).map((c) => (
                <a key={c.slug} className="dc-card" href={`/denial-codes/${c.slug}/`}>
                  <b>{c.code}</b>
                  <span>{c.meaning}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Shell>
  );
}

export function DenialCodePage({ slug }) {
  const c = denialCode(slug);
  useEffect(() => { if (c) { document.title = `Denial Code ${c.code} - What It Means & How to Fix It · MedXFlow`; window.scrollTo(0, 0); } }, [c]);
  if (!c) {
    return <Shell><main className="wrap dc-article"><p className="eyebrow">Not found</p><h1>Code not found</h1><p><a href="/denial-codes/">Back to the denial code lookup</a></p></main></Shell>;
  }
  return (
    <Shell>
      <main className="wrap dc-article">
        <nav className="dc-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/denial-codes/">Denial Codes</a><span>›</span><span>{c.code}</span></nav>
        <p className="eyebrow">Denial Code · {c.cat}</p>
        <h1>Denial Code {c.code}: What It Means and How to Fix It</h1>
        <p className="dc-answer">{c.meaning}</p>

        <div className="dc-block"><h2>Official description</h2><p className="dc-official">{c.official}</p></div>
        <div className="dc-block"><h2>Common cause</h2><p>{c.cause}</p></div>
        <div className="dc-block"><h2>How to fix it</h2><p>{c.fix}</p></div>

        <div className="dc-cta">
          <p>Working denials by hand? MedXFlow AI agents triage denials by reason code, draft appeals, and surface the root cause.</p>
          <a className="btn" href="/products/denial-management/">See MedXFlow Denial Management →</a>
        </div>

        <p className="dc-back"><a href="/denial-codes/">Back to all denial codes</a></p>
      </main>
    </Shell>
  );
}

const DC_CSS = `
.dc-wrap{max-width:1080px; margin:0 auto; padding:40px 24px 70px}
.dc-article{max-width:760px; margin:0 auto; padding:36px 24px 80px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.dc-head{padding:0 0 26px; border-bottom:1px solid var(--seaglass); margin-bottom:20px}
.dc-head h1{font-size:clamp(28px,4.5vw,42px); line-height:1.1; letter-spacing:-.02em; margin:0 0 14px; font-weight:800; color:var(--ink)}
.dc-lede{font-size:18px; color:#3E5064; max-width:640px}
.dc-group{margin-top:30px}
.dc-group h2{font-size:15px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; color:var(--spruce); margin:0 0 12px}
.dc-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px}
.dc-card{display:flex; flex-direction:column; gap:5px; background:var(--paper); border:1px solid var(--seaglass); border-radius:12px; padding:16px 18px; text-decoration:none; color:inherit; transition:box-shadow .15s,transform .15s,border-color .15s}
.dc-card:hover{box-shadow:0 8px 22px rgba(16,40,80,.1); transform:translateY(-2px); border-color:var(--spruce)}
.dc-card b{font-size:16px; color:var(--ink); font-weight:800; font-variant-numeric:tabular-nums}
.dc-card span{font-size:13px; color:#5A6B7E; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}
.dc-crumbs{font-size:13px; color:#6B7C8E; display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:16px}
.dc-crumbs a{color:var(--spruce); text-decoration:none}
.dc-article h1{font-size:clamp(24px,3.6vw,34px); line-height:1.14; letter-spacing:-.01em; margin:2px 0 16px; font-weight:800; color:var(--ink); text-wrap:balance}
.dc-answer{font-size:18px; line-height:1.55; color:var(--ink); background:var(--mist); border-left:4px solid var(--spruce); border-radius:0 10px 10px 0; padding:14px 18px; margin:0 0 22px; font-weight:500}
.dc-block{margin-top:22px}
.dc-block h2{font-size:19px; margin:0 0 8px; font-weight:800; color:var(--ink)}
.dc-block p{font-size:16.5px; color:#33455A; margin:0; max-width:70ch}
.dc-official{font-style:italic; color:#45596E}
.dc-cta{margin:34px 0; padding:24px; background:var(--mist); border:1px solid var(--seaglass); border-radius:16px}
.dc-cta p{font-size:16px; font-weight:600; margin:0 0 14px; color:var(--ink)}
.blog .btn{display:inline-block; background:var(--ink); color:#fff; padding:11px 20px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.blog .btn:hover{background:var(--spruce)}
.dc-back{margin-top:30px}
.dc-back a{color:var(--spruce); text-decoration:none; font-weight:700; font-size:14px}
`;
