import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";
import { seoPage } from "./seo-pages.data.js";

// Renders any data-driven SEO landing page (pillar / audience). Shares the site
// header/footer. Prerendered with Service + FAQ + BreadcrumbList schema.

export default function SeoPage({ slug }) {
  const p = seoPage(slug);
  if (!p) return null;
  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <Nav resources />

      <nav className="pl-crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span><a href="/products/">Products</a><span>›</span><span>{p.h1}</span>
      </nav>

      <header className="pl-hero">
        <div className="wrap">
          <p className="eyebrow">{p.eyebrow}</p>
          <h1>{p.h1}</h1>
          <p className="pl-lede">{p.intro}</p>
          <div className="pl-cta-row">
            <a className="btn" href="/#cta">Request a demo</a>
            <a className="btn btn-ghost" href="/ai-agents-rcm/">Explore AI agents</a>
          </div>
        </div>
      </header>

      <main className="wrap pl-main">
        {p.sections.map((s, i) => (
          <section key={i} className="pl-sec">
            <h2>{s.h}</h2>
            {(s.p || []).map((para, j) => <p key={j}>{para}</p>)}
            {s.list && (
              <ul className="pl-benefits">
                {s.list.map((li, k) => <li key={k}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}

        {p.related?.length ? (
          <section className="pl-sec pl-read">
            <h2>Related</h2>
            <div className="pl-read-links">
              {p.related.map((r) => <a key={r.href} href={r.href}>{r.label} →</a>)}
            </div>
          </section>
        ) : null}

        {p.faq?.length ? (
          <section className="pl-sec pl-faq">
            <h2>Frequently asked questions</h2>
            {p.faq.map((f) => (
              <div key={f.q} className="pl-faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        ) : null}

        <section className="pl-final">
          <h2>See MedXFlow on your revenue cycle</h2>
          <p>Book a free demo and watch the AI agents work real cases across the revenue cycle.</p>
          <a className="btn" href="/#cta">Request a demo →</a>
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
  background:var(--paper); color:var(--ink); line-height:1.65}
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
.pl-crumbs{max-width:1000px; margin:0 auto; padding:6px 24px 0; font-size:13px; color:#6B7C8E; display:flex; gap:8px; align-items:center; flex-wrap:wrap}
.pl-crumbs a{color:var(--spruce); text-decoration:none}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:34px 0 46px; margin-top:10px}
.pl-lede{font-size:19px; color:#33455A; max-width:660px; margin:0 0 24px}
.pl-cta-row{display:flex; gap:12px; flex-wrap:wrap}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.pillar .btn:hover{background:var(--spruce)}
.pillar .btn-ghost{background:#fff; color:var(--ink); border:1px solid var(--seaglass)}
.pl-main{padding:12px 24px 40px}
.pl-sec{margin-top:40px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 14px; font-weight:800; text-wrap:balance}
.pl-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:70ch}
.pl-benefits{margin:0; padding-left:20px; max-width:72ch}
.pl-benefits li{font-size:16px; color:#33455A; margin:9px 0}
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
