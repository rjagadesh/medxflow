// Free NPI lookup tool. Searches the CMS NPPES NPI Registry (via the same-origin
// /npi proxy function, since NPPES has no CORS) by provider name, organization
// or NPI number. Answer-first explanatory content + WebApplication/FAQ schema is
// prerendered for SEO; the live lookup runs client-side.

import { useState } from "react";
import { LanguageProvider } from "./i18n.jsx";
import { Nav, Footer, BookDemo, CSS as SITE_CSS } from "./EirimFrontDesk.jsx";
import AnswerBox from "./AnswerBox.jsx";

const STATES = ["", "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR"];

function providerName(r) {
  const b = r.basic || {};
  if (r.enumeration_type === "NPI-2") return b.organization_name || "Organization";
  return [b.first_name, b.middle_name, b.last_name].filter(Boolean).join(" ") + (b.credential ? `, ${b.credential}` : "");
}
function primaryTaxonomy(r) {
  const t = (r.taxonomies || []).find((x) => x.primary) || (r.taxonomies || [])[0];
  return t ? { desc: t.desc, state: t.state, license: t.license } : null;
}
function location(r) {
  const a = (r.addresses || []).find((x) => x.address_purpose === "LOCATION") || (r.addresses || [])[0];
  return a ? [a.city, a.state].filter(Boolean).join(", ") : "";
}

export default function NpiLookup() {
  const [type, setType] = useState("name");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [org, setOrg] = useState("");
  const [number, setNumber] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  async function search(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type === "number") {
      const n = number.replace(/\D/g, "");
      if (n.length !== 10) { setError("An NPI is a 10-digit number."); setStatus("error"); return; }
      params.set("number", n);
    } else if (type === "org") {
      if (org.trim().length < 2) { setError("Enter at least 2 characters of the organization name."); setStatus("error"); return; }
      params.set("organization_name", org.trim());
      if (state) params.set("state", state);
    } else {
      if (last.trim().length < 2) { setError("Enter at least 2 characters of the last name."); setStatus("error"); return; }
      if (first.trim()) params.set("first_name", first.trim());
      params.set("last_name", last.trim());
      if (state) params.set("state", state);
    }
    params.set("limit", "20");
    setStatus("loading"); setError(""); setResults([]);
    try {
      const res = await fetch(`/.netlify/functions/npi?${params.toString()}`);
      const data = await res.json();
      if (data.Errors?.length) { setError(data.Errors[0].description || "No matches. Try a broader search."); setStatus("error"); return; }
      if (data.error) { setError(data.error); setStatus("error"); return; }
      setResults(data.results || []);
      setStatus("done");
    } catch {
      setError("Something went wrong reaching the NPI registry. Please try again."); setStatus("error");
    }
  }

  return (
    <LanguageProvider>
      <div className="eirim pillar">
        <style>{SITE_CSS}</style>
        <style>{CSS}</style>
        <style>{NPI_CSS}</style>
        <Nav resources />

        <header className="pl-hero">
          <div className="wrap">
            <p className="eyebrow">Free RCM Tool · NPI Registry</p>
            <h1>NPI lookup</h1>
            <p className="pl-lede">Search the official CMS NPPES registry for any US provider or organization by name or NPI number - the number, taxonomy, location and status, in one place.</p>
            <AnswerBox label="What this does">
              An NPI (National Provider Identifier) is a unique 10-digit number CMS assigns to every US healthcare
              provider and organization. This tool looks up NPIs in the official NPPES registry so you can verify a
              provider's number, taxonomy and enrollment status before you bill or credential.
            </AnswerBox>
          </div>
        </header>

        <main className="wrap pl-main">
          <section className="npi-tool">
            <form className="npi-form" onSubmit={search}>
              <div className="npi-tabs" role="tablist">
                {[["name", "Provider name"], ["org", "Organization"], ["number", "NPI number"]].map(([k, label]) => (
                  <button type="button" key={k} role="tab" aria-selected={type === k}
                    className={"npi-tab" + (type === k ? " on" : "")} onClick={() => { setType(k); setError(""); }}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="npi-fields">
                {type === "name" && (
                  <>
                    <label>First name (optional)<input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Jane" /></label>
                    <label>Last name<input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Smith" autoComplete="off" /></label>
                  </>
                )}
                {type === "org" && (
                  <label className="npi-wide">Organization name<input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Mansfield Family Medicine" autoComplete="off" /></label>
                )}
                {type === "number" && (
                  <label className="npi-wide">NPI number<input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1234567890" inputMode="numeric" /></label>
                )}
                {type !== "number" && (
                  <label>State (optional)
                    <select value={state} onChange={(e) => setState(e.target.value)}>
                      {STATES.map((s) => <option key={s} value={s}>{s || "Any state"}</option>)}
                    </select>
                  </label>
                )}
              </div>

              <button className="btn npi-go" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Searching…" : "Search the NPI registry"}
              </button>
              {status === "error" && <p className="npi-error">{error}</p>}
            </form>

            {status === "done" && (
              <div className="npi-results">
                <p className="npi-count">{results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : "No matches. Try a broader search or drop the state filter."}</p>
                {results.map((r) => {
                  const tax = primaryTaxonomy(r);
                  const deactivated = r.basic?.status === "D" || !!r.basic?.deactivation_date;
                  return (
                    <div className="npi-card" key={r.number}>
                      <div className="npi-card-h">
                        <b>{providerName(r)}</b>
                        <span className={"npi-badge" + (deactivated ? " off" : "")}>{deactivated ? "Deactivated" : "Active"}</span>
                      </div>
                      <div className="npi-num">NPI <strong>{r.number}</strong> · {r.enumeration_type === "NPI-2" ? "Organization" : "Individual"}</div>
                      {tax && <div className="npi-row">{tax.desc}{tax.state ? ` · License ${tax.license || "n/a"} (${tax.state})` : ""}</div>}
                      {location(r) && <div className="npi-row npi-loc">{location(r)}</div>}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="npi-src">Source: CMS NPPES NPI Registry (public data). MedXFlow is not affiliated with CMS. Always confirm against the payer of record before billing.</p>
          </section>

          <section className="pl-sec">
            <h2>What is an NPI number?</h2>
            <p>An NPI (National Provider Identifier) is a unique 10-digit identification number that CMS, through the NPPES system, assigns to healthcare providers in the United States. It is required on HIPAA-standard transactions - claims, eligibility, remittance - and it stays with the provider for life, regardless of where they practice or which payer they bill.</p>
          </section>

          <section className="pl-sec">
            <h2>NPI-1 vs NPI-2: individuals and organizations</h2>
            <p>There are two types. An <strong>NPI-1 (Type 1)</strong> belongs to an individual provider - a physician, nurse practitioner, therapist or other clinician. An <strong>NPI-2 (Type 2)</strong> belongs to an organization - a group practice, hospital, laboratory or billing entity. A single physician who also owns a practice will have both: a Type 1 as a person and a Type 2 for the organization. Billing the wrong one is a common, avoidable denial.</p>
          </section>

          <section className="pl-sec">
            <h2>What the taxonomy code tells you</h2>
            <p>Each NPI record carries one or more taxonomy codes, which classify the provider's specialty and type. The primary taxonomy is what payers use to check that the provider is eligible to deliver and bill for a given service. A mismatch between the taxonomy on file and the service billed is a frequent source of medical-necessity and enrollment denials, which is why verifying it up front matters.</p>
          </section>

          <section className="pl-sec">
            <h2>Why verifying the NPI matters for billing and credentialing</h2>
            <p>An accurate NPI is the anchor of a clean claim. If a provider is billed under a deactivated NPI, the wrong type, or an NPI whose taxonomy does not match the enrollment, the claim is delayed or denied. During credentialing, primary-source verification against NPPES confirms the provider exists, is active, and matches the identity and specialty on the application - which is exactly the kind of check MedXFlow's <a href="/products/credentialing/">credentialing agent</a> runs automatically as part of provider enrollment.</p>
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
            <h2>Automate provider credentialing and NPI verification</h2>
            <p>MedXFlow's credentialing agent verifies NPIs against NPPES, keeps CAQH current, and tracks enrollment to approval. See it on your practice.</p>
            <a className="btn" href="/products/credentialing/">See Credentialing &amp; Provider Enrollment →</a>
          </section>
        </main>

        <Footer />
        <BookDemo />
      </div>
    </LanguageProvider>
  );
}

const FAQ = [
  { q: "How do I look up an NPI number?", a: "Enter the provider's last name (and optionally first name and state), the organization name, or a known 10-digit NPI, then search. Results come from the official CMS NPPES registry and show the NPI, provider type, primary taxonomy, location and status." },
  { q: "Is NPI lookup free?", a: "Yes. NPI data is public and maintained by CMS in the NPPES registry. This tool queries that registry at no cost." },
  { q: "What is the difference between a Type 1 and Type 2 NPI?", a: "A Type 1 (NPI-1) is for an individual provider, such as a physician or nurse practitioner. A Type 2 (NPI-2) is for an organization, such as a group practice, hospital or laboratory. A provider who owns a practice can have both." },
  { q: "Why would a claim be denied over an NPI?", a: "Common causes are billing under a deactivated NPI, using the wrong NPI type, or a mismatch between the provider's taxonomy or enrollment and the service billed. Verifying the NPI and taxonomy before billing prevents these denials." },
  { q: "How often is NPPES data updated?", a: "CMS refreshes the NPPES registry regularly (weekly full-file updates), and providers can update their own records at any time. Always confirm active enrollment with the specific payer before billing." },
];

const CSS = `
.pillar{--ink:#0D2B52;--spruce:#1A5DAD;--gorse:#17C3B2;--mist:#F2F6FB;--paper:#FFFFFF;--seaglass:#CFE0F2;
  background:var(--paper); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; line-height:1.65}
.pillar .wrap:not(.nav-in):not(.foot-in){max-width:1000px; margin:0 auto; padding:0 24px}
.pillar .eyebrow{font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--spruce); margin:0 0 12px}
.pillar h1{font-size:clamp(30px,5vw,46px); line-height:1.08; letter-spacing:-.02em; margin:0 0 16px; font-weight:800; text-wrap:balance}
.pl-hero{background:linear-gradient(180deg,var(--mist),#fff); border-bottom:1px solid var(--seaglass); padding:52px 0 40px}
.pl-lede{font-size:19px; color:#33455A; max-width:680px; margin:0 0 6px}
.pillar .btn{display:inline-block; background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:15px; cursor:pointer; border:0}
.pillar .btn:hover{background:var(--spruce)}
.pl-main{padding:12px 24px 40px}
.pl-sec{margin-top:44px}
.pl-sec h2{font-size:26px; letter-spacing:-.01em; margin:0 0 14px; font-weight:800; text-wrap:balance}
.pl-sec p{font-size:16.5px; color:#33455A; margin:0 0 14px; max-width:72ch}
.pl-sec a{color:var(--spruce); text-decoration:none; font-weight:600}
.pl-sec a:hover{text-decoration:underline}
.pl-faq{border-top:1px solid var(--seaglass); padding-top:30px}
.pl-faq-item{margin-bottom:18px}
.pl-faq-item h3{font-size:17px; margin:0 0 6px; font-weight:800}
.pl-faq-item p{font-size:16px; color:#33455A; margin:0; max-width:72ch}
.pl-final{margin:52px 0 20px; padding:34px; background:var(--ink); border-radius:18px; text-align:center; color:#fff}
.pl-final h2{font-size:24px; margin:0 0 10px; font-weight:800; color:#fff}
.pl-final p{font-size:16px; color:#CFE0F2; margin:0 0 18px}
.pl-final .btn{background:var(--gorse); color:#062b28}
`;

const NPI_CSS = `
.npi-tool{margin-top:26px; background:var(--paper); border:1px solid var(--seaglass); border-radius:18px; padding:24px; box-shadow:0 10px 30px rgba(16,40,80,.06)}
.npi-tabs{display:flex; gap:6px; background:var(--mist); border:1px solid var(--seaglass); border-radius:12px; padding:4px; width:fit-content; max-width:100%; flex-wrap:wrap}
.npi-tab{border:0; background:transparent; padding:9px 16px; border-radius:9px; font-weight:700; font-size:14px; color:#5A6B7E; cursor:pointer}
.npi-tab.on{background:var(--paper); color:var(--ink); box-shadow:0 1px 4px rgba(16,40,80,.12)}
.npi-fields{display:grid; grid-template-columns:1fr 1fr auto; gap:14px; margin:18px 0}
.npi-fields label{display:flex; flex-direction:column; gap:6px; font-size:13px; font-weight:700; color:var(--ink)}
.npi-fields .npi-wide{grid-column:1 / span 2}
.npi-fields input, .npi-fields select{font-size:15.5px; padding:11px 12px; border:1px solid var(--seaglass); border-radius:10px; background:#fff; color:var(--ink); font-weight:500; min-width:0}
.npi-fields input:focus, .npi-fields select:focus{outline:2px solid var(--gorse); outline-offset:1px}
.npi-go{width:100%}
.npi-error{color:#C2410C; font-size:14.5px; font-weight:600; margin:12px 0 0}
.npi-results{margin-top:22px; display:grid; gap:12px}
.npi-count{font-size:14px; font-weight:700; color:#5A6B7E; margin:0}
.npi-card{border:1px solid var(--seaglass); border-radius:14px; padding:16px 18px; background:#fff}
.npi-card-h{display:flex; align-items:center; justify-content:space-between; gap:12px}
.npi-card-h b{font-size:17px; color:var(--ink)}
.npi-badge{font-size:11px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#0E8A7D; background:#E7F6F2; border:1px solid #B7E5DB; padding:4px 9px; border-radius:999px}
.npi-badge.off{color:#C2410C; background:#FDECE3; border-color:#F6C9AF}
.npi-num{font-size:15px; color:var(--ink); margin-top:8px}
.npi-num strong{font-variant-numeric:tabular-nums; letter-spacing:.02em}
.npi-row{font-size:14.5px; color:#5A6B7E; margin-top:4px}
.npi-loc{color:#33455A}
.npi-src{font-size:12.5px; color:#7A8A9A; margin-top:16px; max-width:80ch}
@media(max-width:640px){.npi-fields{grid-template-columns:1fr} .npi-fields .npi-wide{grid-column:auto}}
`;
