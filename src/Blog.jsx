import { useEffect } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS } from "./EirimFrontDesk.jsx";
import { POSTS, post as findPost } from "./blog.data.js";

// Resources / blog. Uses the shared site header (Nav) + footer so it matches
// every other marketing page. Index lists all posts; BlogPost renders one
// article with internal links to the relevant product page.

const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function Shell({ children }) {
  return (
    <LanguageProvider>
      <div className="eirim blog">
        <style>{CSS}</style>
        <style>{BLOG_CSS}</style>
        <Nav resources />
        {children}
        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

export function BlogIndex() {
  useEffect(() => {
    document.title = "Resources · RCM insights for medical practices · MedXFlow";
    window.scrollTo(0, 0);
  }, []);
  return (
    <Shell>
      <main className="wrap blog-wrap">
        <header className="blog-head">
          <p className="eyebrow">Resources</p>
          <h1>RCM insights for medical practices</h1>
          <p className="blog-lede">Practical guides on denials, prior authorization, coding and the revenue cycle — written for the people who run billing, not just read about it.</p>
        </header>
        <div className="blog-grid">
          {[...POSTS].sort((a, b) => b.date.localeCompare(a.date)).map((p) => (
            <a key={p.slug} className="blog-card" href={`/blog/${p.slug}`}>
              <span className="blog-cat">{p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <span className="blog-meta">{fmtDate(p.date)} · {p.readMins} min read</span>
            </a>
          ))}
        </div>
      </main>
    </Shell>
  );
}

export function BlogPost({ slug }) {
  const p = findPost(slug);
  useEffect(() => {
    if (!p) return;
    document.title = `${p.title} · MedXFlow`;
    window.scrollTo(0, 0);
  }, [p]);

  if (!p) {
    return (
      <Shell>
        <main className="wrap blog-wrap"><p className="eyebrow">Not found</p><h1>That article doesn't exist</h1><p className="blog-lede"><a href="/blog">← Back to all resources</a></p></main>
      </Shell>
    );
  }
  return (
    <Shell>
      <main className="wrap blog-article">
        <a href="/blog" className="blog-back">← All resources</a>
        <span className="blog-cat">{p.category}</span>
        <h1>{p.title}</h1>
        <p className="blog-meta">{fmtDate(p.date)} · {p.readMins} min read</p>
        <p className="blog-intro">{p.intro}</p>

        {p.sections.map((s, i) => (
          <section key={i} className="blog-sec">
            <h2>{s.h}</h2>
            {s.p.map((para, j) => <p key={j}>{para}</p>)}
          </section>
        ))}

        {p.related && (
          <div className="blog-cta">
            <p>Want to see how MedXFlow automates this?</p>
            <a className="btn" href={p.related.href}>{p.related.label} →</a>
          </div>
        )}

        {p.faq?.length ? (
          <section className="blog-sec blog-faq">
            <h2>Frequently asked questions</h2>
            {p.faq.map((f, i) => (
              <div key={i} className="blog-faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        ) : null}

        <div className="blog-more">
          <p className="eyebrow">Keep reading</p>
          <div className="blog-more-links">
            {POSTS.filter((o) => o.slug !== p.slug).slice(0, 6).map((o) => (
              <a key={o.slug} href={`/blog/${o.slug}`}>{o.title} →</a>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
}

const BLOG_CSS = `
.blog{background:var(--paper); color:var(--ink)}
.blog .wrap:not(.nav-in):not(.foot-in){max-width:1080px; margin:0 auto; padding:0 24px}
.blog-wrap{padding-top:40px}
.blog-article{max-width:760px; margin:0 auto; padding:40px 24px 80px}
.blog .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 10px}
.blog h1{font-size:clamp(28px,4.5vw,42px); line-height:1.1; letter-spacing:-.02em; margin:0 0 16px; font-weight:800; text-wrap:balance; color:var(--ink)}
.blog-lede{font-size:18px; color:#3E5064; max-width:620px}
.blog-head{padding:20px 0 28px; border-bottom:1px solid var(--seaglass); margin-bottom:34px}
.blog-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; padding-bottom:70px}
.blog-card{display:flex; flex-direction:column; gap:9px; background:var(--paper); border:1px solid var(--seaglass); border-radius:16px; padding:22px; text-decoration:none; color:inherit; box-shadow:0 1px 2px rgba(16,40,80,.04); transition:box-shadow .15s,transform .15s,border-color .15s}
.blog-card:hover{box-shadow:0 10px 30px rgba(16,40,80,.1); transform:translateY(-2px); border-color:var(--spruce)}
.blog-cat{align-self:flex-start; font-size:11px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; color:var(--spruce); background:var(--mist); padding:4px 10px; border-radius:999px}
.blog-card h2{font-size:19px; line-height:1.25; margin:2px 0; font-weight:800; text-wrap:balance; color:var(--ink)}
.blog-card p{font-size:14px; color:#5A6B7E; margin:0}
.blog-meta{font-size:12.5px; color:#8494A6; font-weight:600}
.blog-back{display:inline-block; margin:0 0 18px; color:var(--spruce); text-decoration:none; font-weight:700; font-size:14px}
.blog-article .blog-cat{margin-bottom:12px}
.blog-intro{font-size:19px; line-height:1.6; color:#2B3D50; margin:18px 0 8px; font-weight:500}
.blog-sec{margin-top:30px}
.blog-sec h2{font-size:23px; letter-spacing:-.01em; margin:0 0 12px; font-weight:800; text-wrap:balance; color:var(--ink)}
.blog-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:68ch}
.blog-cta{margin:38px 0; padding:26px; background:var(--mist); border:1px solid var(--seaglass); border-radius:16px; text-align:center}
.blog-cta p{font-size:17px; font-weight:700; margin:0 0 14px; color:var(--ink)}
.blog .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px}
.blog .btn:hover{background:var(--spruce)}
.blog-faq{border-top:1px solid var(--seaglass); padding-top:26px}
.blog-faq-item{margin-bottom:18px}
.blog-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800; color:var(--ink)}
.blog-faq-item p{font-size:16px; color:#33455A; margin:0}
.blog-more{margin-top:46px; padding-top:26px; border-top:1px solid var(--seaglass)}
.blog-more-links{display:flex; flex-direction:column; gap:10px}
.blog-more-links a{color:var(--spruce); text-decoration:none; font-weight:600; font-size:15.5px}
.blog-more-links a:hover{text-decoration:underline}
`;
