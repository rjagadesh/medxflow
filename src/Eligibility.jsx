import { useState, useEffect } from "react";
import { SAMPLE_PATIENTS, STEDI_TEST_NPI } from "./eligibility-samples.data.js";

// Real-time insurance eligibility verification (X12 270/271) through Stedi.
// The API key lives server-side in netlify/functions/eligibility.mjs; this only
// posts the patient and renders the payer's answer. No PHI is stored anywhere.

const API = "/.netlify/functions/eligibility";

// The service types a front desk actually asks about.
const SERVICE_TYPES = [
  ["30", "Health benefit plan coverage (general)"],
  ["1", "Medical care"],
  ["35", "Dental care"],
  ["47", "Hospital"],
  ["48", "Hospital - inpatient"],
  ["50", "Hospital - outpatient"],
  ["86", "Emergency services"],
  ["88", "Pharmacy"],
  ["98", "Professional (physician) visit - office"],
  ["AL", "Vision (optometry)"],
  ["MH", "Mental health"],
  ["UC", "Urgent care"],
];

const money = (n) => (n == null ? "-" : "$" + Number(n).toLocaleString("en-US"));
const fmtDob = (d) => (/^\d{8}$/.test(d || "") ? `${d.slice(4, 6)}/${d.slice(6, 8)}/${d.slice(0, 4)}` : d || "");

const BLANK = {
  payerId: "", firstName: "", lastName: "", memberId: "", dateOfBirth: "",
  serviceTypeCode: "30", providerName: "MedXFlow", npi: STEDI_TEST_NPI,
};

export default function Eligibility({ pw }) {
  const [f, setF] = useState(BLANK);
  const [cfg, setCfg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const api = async (payload) => {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify(payload),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
    return d;
  };

  useEffect(() => {
    api({ action: "config" }).then(setCfg).catch((e) => setErr(e.message));
  }, []);

  const loadSample = (i) => {
    const s = SAMPLE_PATIENTS[i];
    if (!s) return;
    setRes(null); setErr("");
    setF({ ...BLANK, payerId: s.payerId, firstName: s.firstName, lastName: s.lastName, memberId: s.memberId, dateOfBirth: s.dateOfBirth });
  };

  const check = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(""); setRes(null);
    try {
      setRes(await api(f));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const s = res?.summary;

  return (
    <div className="ad-card el-wrap">
      <style>{CSS}</style>

      <div className="el-head">
        <div>
          <h2>Insurance eligibility verification</h2>
          <p>Real-time 270/271 benefit check against the payer, through Stedi.</p>
        </div>
        {cfg?.configured && (
          <span className={"el-mode" + (cfg.mode === "test" ? " test" : " live")}>
            {cfg.mode === "test" ? "TEST MODE" : "LIVE"}
          </span>
        )}
      </div>

      {cfg && cfg.configured === false && (
        <div className="ad-err">Stedi is not configured. {cfg.reason}</div>
      )}

      {cfg?.mode === "test" && (
        <div className="el-note">
          Test mode returns Stedi's mock benefits. Use a sample patient below - real member IDs
          will not return data until a production key is set.
        </div>
      )}

      <div className="el-samples">
        <label>Sample patient</label>
        <select defaultValue="" onChange={(e) => loadSample(e.target.value)}>
          <option value="">Choose a Stedi test patient…</option>
          {SAMPLE_PATIENTS.map((p, i) => (
            <option key={p.memberId} value={i}>
              {p.payerName} · {p.firstName} {p.lastName} ({p.memberId})
            </option>
          ))}
        </select>
      </div>

      <form className="el-form" onSubmit={check}>
        <label>Payer ID*
          <input value={f.payerId} onChange={set("payerId")} placeholder="60054" required />
        </label>
        <label>Member ID
          <input value={f.memberId} onChange={set("memberId")} placeholder="AETNA12345" />
        </label>
        <label>First name
          <input value={f.firstName} onChange={set("firstName")} placeholder="Jane" />
        </label>
        <label>Last name
          <input value={f.lastName} onChange={set("lastName")} placeholder="Doe" />
        </label>
        <label>Date of birth
          <input value={f.dateOfBirth} onChange={set("dateOfBirth")} placeholder="YYYYMMDD" inputMode="numeric" />
        </label>
        <label>Service type
          <select value={f.serviceTypeCode} onChange={set("serviceTypeCode")}>
            {SERVICE_TYPES.map(([c, l]) => <option key={c} value={c}>{c} · {l}</option>)}
          </select>
        </label>
        <label>Provider NPI
          <input value={f.npi} onChange={set("npi")} placeholder="1999999984" />
        </label>
        <div className="el-actions">
          <button className="ad-btn" type="submit" disabled={busy}>{busy ? "Checking…" : "Check eligibility"}</button>
          <button type="button" className="ad-ghost" onClick={() => { setF(BLANK); setRes(null); setErr(""); }}>Clear</button>
        </div>
      </form>

      {err && <div className="ad-err">{err}</div>}

      {s && (
        <div className="el-result">
          <div className={"el-status" + (s.active ? " ok" : " bad")}>
            <span className="el-dot" />
            <div>
              <b>{s.status}</b>
              <span>{[s.patientName, s.planName, s.payerName].filter(Boolean).join(" · ")}</span>
            </div>
            {s.memberId && <span className="el-member">Member {s.memberId}</span>}
          </div>

          {s.active && (
            <div className="el-stats">
              <div className="el-stat"><b>{money(s.deductible)}</b><span>Deductible</span></div>
              <div className="el-stat"><b>{money(s.deductibleRemaining)}</b><span>Deductible remaining</span></div>
              <div className="el-stat"><b>{money(s.outOfPocket)}</b><span>Out-of-pocket max</span></div>
              <div className="el-stat"><b>{money(s.copay)}</b><span>Copay</span></div>
              <div className="el-stat"><b>{s.coinsurance == null ? "-" : s.coinsurance + "%"}</b><span>Coinsurance</span></div>
              <div className="el-stat"><b>{fmtDob(s.planBeginDate) || "-"}</b><span>Plan begin</span></div>
            </div>
          )}

          {!!res.errors?.length && (
            <div className="el-errors">
              <b>Payer rejected the request</b>
              {res.errors.map((e, i) => (
                <div key={i} className="el-error">
                  <span className="el-code">AAA {e.code}</span>
                  <div>
                    <b>{e.description}</b>
                    {e.followupAction && <span>{e.followupAction}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!!res.benefits?.length && (
            <>
              <div className="el-sub">Benefits returned ({res.benefits.length})</div>
              <div className="el-table-wrap">
                <table className="el-table">
                  <thead><tr><th>Benefit</th><th>Level</th><th>Network</th><th>Amount</th><th>%</th><th>Period</th></tr></thead>
                  <tbody>
                    {res.benefits.map((b, i) => (
                      <tr key={i}>
                        <td>{b.name || b.code}</td>
                        <td>{b.coverageLevel || "-"}</td>
                        <td>{b.network || "-"}</td>
                        <td>{b.amount == null ? "-" : money(b.amount)}</td>
                        <td>{b.percent == null ? "-" : Math.round(Number(b.percent) * 100) + "%"}</td>
                        <td>{b.period || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <button type="button" className="ad-ghost el-raw-btn" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? "Hide" : "Show"} raw 271 response
          </button>
          {showRaw && <pre className="el-raw">{JSON.stringify(res.raw, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}

const CSS = `
.el-wrap{display:flex; flex-direction:column; gap:14px}
.el-head{display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap}
.el-head h2{margin:0 0 4px; font-size:19px}
.el-head p{margin:0; font-size:13.5px; color:#8aa}
.el-mode{font-size:11px; font-weight:800; letter-spacing:.08em; padding:5px 10px; border-radius:999px}
.el-mode.test{background:rgba(242,193,78,.15); color:#F2C14E; border:1px solid rgba(242,193,78,.35)}
.el-mode.live{background:rgba(61,220,201,.15); color:#3DDCC9; border:1px solid rgba(61,220,201,.35)}
.el-note{font-size:13px; color:#9fb3c8; background:rgba(90,169,245,.08); border:1px solid rgba(90,169,245,.25); border-radius:10px; padding:10px 13px}
.el-samples{display:flex; align-items:center; gap:10px; flex-wrap:wrap}
.el-samples label{font-size:12.5px; font-weight:700; color:#9fb3c8}
.el-samples select{flex:1; min-width:280px}
.el-form{display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; align-items:end}
.el-form label{display:flex; flex-direction:column; gap:5px; font-size:12.5px; font-weight:700; color:#9fb3c8}
.el-form input, .el-form select, .el-samples select{padding:9px 11px; border-radius:9px; border:1px solid rgba(148,180,214,.22); background:rgba(9,25,48,.6); color:#dce9f7; font-size:14px; font-family:inherit}
.el-form input:focus, .el-form select:focus, .el-samples select:focus{outline:none; border-color:#5AA9F5}
.el-actions{display:flex; gap:8px; grid-column:1/-1}
.el-result{display:flex; flex-direction:column; gap:14px; border-top:1px solid rgba(148,180,214,.14); padding-top:16px}
.el-status{display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:12px; flex-wrap:wrap}
.el-status.ok{background:rgba(61,220,201,.1); border:1px solid rgba(61,220,201,.3)}
.el-status.bad{background:rgba(240,138,122,.1); border:1px solid rgba(240,138,122,.3)}
.el-dot{width:10px; height:10px; border-radius:50%; flex:none}
.el-status.ok .el-dot{background:#3DDCC9}
.el-status.bad .el-dot{background:#F08A7A}
.el-status b{display:block; font-size:16px; color:#eaf3ff}
.el-status span{font-size:13px; color:#9fb3c8}
.el-member{margin-left:auto; font-size:12.5px; color:#9fb3c8; font-variant-numeric:tabular-nums}
.el-stats{display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:10px}
.el-stat{background:rgba(9,25,48,.5); border:1px solid rgba(148,180,214,.16); border-radius:11px; padding:12px 14px}
.el-stat b{display:block; font-size:20px; color:#eaf3ff; font-variant-numeric:tabular-nums}
.el-stat span{font-size:11.5px; color:#8aa}
.el-errors{background:rgba(240,138,122,.08); border:1px solid rgba(240,138,122,.28); border-radius:11px; padding:13px 15px; display:flex; flex-direction:column; gap:9px}
.el-errors>b{font-size:13.5px; color:#F08A7A}
.el-error{display:flex; gap:11px; align-items:flex-start}
.el-code{flex:none; font-size:11px; font-weight:800; color:#F08A7A; background:rgba(240,138,122,.15); padding:3px 8px; border-radius:6px}
.el-error b{display:block; font-size:13.5px; color:#eaf3ff}
.el-error span{font-size:12.5px; color:#9fb3c8}
.el-sub{font-size:12.5px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#8aa}
.el-table-wrap{overflow-x:auto}
.el-table{width:100%; border-collapse:collapse; font-size:13px; min-width:560px}
.el-table th{text-align:left; padding:8px 10px; color:#8aa; font-size:11.5px; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid rgba(148,180,214,.18)}
.el-table td{padding:8px 10px; border-bottom:1px solid rgba(148,180,214,.08); color:#cfe0f2}
.el-raw-btn{align-self:flex-start}
.el-raw{max-height:340px; overflow:auto; background:rgba(4,14,30,.7); border:1px solid rgba(148,180,214,.16); border-radius:10px; padding:12px; font-size:11.5px; color:#9fb3c8}
`;
