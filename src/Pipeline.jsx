import { useState, useEffect } from "react";
import { contactsApi, STAGES, STAGE_LABEL } from "./Contacts.jsx";

const usd = (n) => "$" + Math.round(n).toLocaleString();
const DEMO_STAGES = ["demo_scheduled", "demo_completed", "proposal", "won"];

export default function Pipeline({ pw, onOpen }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [over, setOver] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const d = await contactsApi(pw, { action: "list" });
      setContacts(d.contacts || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = async (email, stage) => {
    const prev = contacts;
    setContacts((cs) => cs.map((c) => (c.email === email ? { ...c, stage } : c)));
    try {
      await contactsApi(pw, { action: "update", email, patch: { stage } });
    } catch (e) {
      setErr(e.message);
      setContacts(prev);
    }
  };
  const remove = async (email, label) => {
    if (!window.confirm(`Remove ${label} from the pipeline?`)) return;
    setErr("");
    setMsg("");
    const prev = contacts;
    setContacts((cs) => cs.filter((c) => c.email !== email));
    try {
      await contactsApi(pw, { action: "delete", email });
      setMsg(`Removed ${label} from the pipeline ✓`);
    } catch (e) {
      setErr(e.message);
      setContacts(prev);
    }
  };
  const convert = async (email) => {
    setMsg("");
    try {
      const r = await contactsApi(pw, { action: "convertToIncome", email });
      setMsg(r.ok ? `Added ${usd(r.amount)} to Financials as income ✓` : "Already converted to income.");
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const total = contacts.length;
  const demos = contacts.filter((c) => c.demoRequest || DEMO_STAGES.includes(c.stage)).length;
  const wonList = contacts.filter((c) => c.stage === "won");
  const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "-");
  const totalValue = contacts.reduce((s, c) => s + (c.dealValue || 0), 0);
  const wonValue = wonList.reduce((s, c) => s + (c.dealValue || 0), 0);

  return (
    <div className="pl">
      <style>{CSS}</style>
      <div className="cmp-head">
        <h3>Pipeline</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pl-add-btn" onClick={() => setAdding(true)}>+ Add prospect</button>
          <button className="cmp-btn" onClick={load} disabled={loading}>{loading ? "…" : "⟳ Refresh"}</button>
        </div>
      </div>
      {err && <div className="ad-err" style={{ marginBottom: 12 }}>{err}</div>}
      {msg && <div className="cmp-ok">{msg}</div>}

      {adding && (
        <AddProspect
          pw={pw}
          onClose={() => setAdding(false)}
          onAdded={(name) => { setAdding(false); setMsg(`Added ${name} to the pipeline ✓`); load(); }}
          onError={(e) => setErr(e)}
        />
      )}

      <div className="pl-metrics">
        <Metric label="Total deals" v={total} />
        <Metric label="Pipeline value" v={usd(totalValue)} />
        <Metric label="Won value" v={usd(wonValue)} tone="in" />
        <Metric label="Lead → Demo" v={pct(demos, total)} />
        <Metric label="Demo → Won" v={pct(wonList.length, demos)} />
      </div>

      <div className="pl-board">
        {STAGES.map((stage) => {
          const items = contacts.filter((c) => c.stage === stage);
          const val = items.reduce((s, c) => s + (c.dealValue || 0), 0);
          return (
            <div
              key={stage}
              className={"pl-col" + (over === stage ? " over" : "")}
              onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={(e) => { e.preventDefault(); const email = e.dataTransfer.getData("text"); setOver(null); if (email) move(email, stage); }}
            >
              <div className="pl-col-hd">
                <span className={"ct-stage st-" + stage}>{STAGE_LABEL[stage]}</span>
                <span className="pl-col-meta">{items.length}{val ? ` · ${usd(val)}` : ""}</span>
              </div>
              <div className="pl-cards">
                {items.map((c) => (
                  <div
                    key={c.email}
                    className="pl-card"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text", c.email)}
                    onClick={() => onOpen(c.email)}
                  >
                    <button
                      className="pl-del"
                      draggable={false}
                      title="Remove from pipeline"
                      aria-label={`Remove ${c.name || c.email} from the pipeline`}
                      onClick={(e) => { e.stopPropagation(); remove(c.email, c.name || c.email); }}
                    >
                      ×
                    </button>
                    <div className="pl-card-name">{c.name || c.email}</div>
                    <div className="pl-card-clinic">{c.clinic || c.email}</div>
                    <div className="pl-card-foot">
                      <span className={"ct-src ct-" + (c.sources[0] || "chat")}>{c.sources[0] || "-"}</span>
                      {c.dealValue ? <span className="pl-val">{usd(c.dealValue)}</span> : null}
                    </div>
                    {c.lastActivityAt && <div className="pl-card-date">{new Date(c.lastActivityAt).toLocaleDateString()}</div>}
                    {stage === "won" && (
                      <button className="pl-conv" onClick={(e) => { e.stopPropagation(); convert(c.email); }}>→ Add to income</button>
                    )}
                  </div>
                ))}
                {!items.length && <div className="pl-empty">Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddProspect({ pw, onClose, onAdded, onError }) {
  const [f, setF] = useState({ name: "", email: "", clinic: "", phone: "", stage: "new", dealValue: "" });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email.includes("@")) { onError("A valid email is required."); return; }
    setSaving(true);
    try {
      const r = await contactsApi(pw, { action: "create", ...f });
      if (r.ok) onAdded(f.name || f.email);
      else onError(r.error || "Couldn't add prospect.");
    } catch (e2) { onError(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="pl-modal-bg" onClick={onClose}>
      <form className="pl-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="pl-modal-hd">Add a prospect</div>
        <label>Name<input value={f.name} onChange={set("name")} placeholder="Jane Doe" autoFocus /></label>
        <label>Email *<input type="email" value={f.email} onChange={set("email")} placeholder="jane@clinic.com" required /></label>
        <label>Clinic / company<input value={f.clinic} onChange={set("clinic")} placeholder="Bright Health Clinic" /></label>
        <label>Phone<input value={f.phone} onChange={set("phone")} placeholder="(210) 555-0100" /></label>
        <div className="pl-modal-row">
          <label>Stage
            <select value={f.stage} onChange={set("stage")}>
              {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
            </select>
          </label>
          <label>Deal value ($)<input type="number" min="0" value={f.dealValue} onChange={set("dealValue")} placeholder="0" /></label>
        </div>
        <div className="pl-modal-actions">
          <button type="button" className="cmp-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="pl-add-btn" disabled={saving}>{saving ? "Adding…" : "Add prospect"}</button>
        </div>
      </form>
    </div>
  );
}

function Metric({ label, v, tone }) {
  return (
    <div className="pl-metric">
      <b className={tone === "in" ? "fin-in" : ""}>{v}</b>
      <span>{label}</span>
    </div>
  );
}

const CSS = `
.pl-metrics{display:flex; flex-wrap:wrap; gap:12px; margin:4px 0 18px}
.pl-metric{background:#112B52; border:1px solid rgba(207,224,242,.14); border-radius:12px; padding:12px 20px; min-width:120px}
.pl-metric b{display:block; font-size:22px; font-weight:800; line-height:1.1}
.pl-metric span{font-size:12px; color:rgba(232,238,246,.6)}
.fin-in{color:#3DDCC9}
.pl-board{display:flex; gap:12px; overflow-x:auto; padding-bottom:12px; align-items:flex-start}
.pl-col{flex:0 0 232px; background:#0D1F3C; border:1px solid rgba(207,224,242,.1); border-radius:14px; padding:10px; min-height:120px; transition:background .15s, border-color .15s}
.pl-col.over{background:#112B52; border-color:#3DDCC9}
.pl-col-hd{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; gap:6px}
.pl-col-meta{font-size:11.5px; color:rgba(232,238,246,.5); white-space:nowrap}
.pl-cards{display:flex; flex-direction:column; gap:8px; min-height:40px}
.pl-card{position:relative; background:#16305A; border:1px solid rgba(207,224,242,.14); border-radius:10px; padding:11px 12px; cursor:pointer; transition:transform .1s, box-shadow .1s}
.pl-card:hover{transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,0,0,.3)}
.pl-card:active{cursor:grabbing}
.pl-card-name{font-weight:700; font-size:14px; color:#fff; padding-right:20px}
.pl-del{position:absolute; top:5px; right:5px; width:20px; height:20px; display:grid; place-items:center; padding:0; background:transparent; border:1px solid transparent; border-radius:6px; color:rgba(232,238,246,.45); font-size:16px; line-height:1; font-family:inherit; cursor:pointer; opacity:0; transition:opacity .12s, background .12s, color .12s}
.pl-card:hover .pl-del{opacity:1}
.pl-del:hover{background:rgba(224,122,95,.18); border-color:rgba(224,122,95,.4); color:#E07A5F}
.pl-del:focus-visible{opacity:1; outline:2px solid #3DDCC9; outline-offset:1px}
@media (hover:none){.pl-del{opacity:1}}
.pl-card-clinic{font-size:12.5px; color:rgba(232,238,246,.65); margin:2px 0 8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.pl-card-foot{display:flex; align-items:center; justify-content:space-between; gap:6px}
.pl-val{font-size:12.5px; font-weight:700; color:#3DDCC9}
.pl-card-date{font-size:11px; color:rgba(232,238,246,.4); margin-top:6px}
.pl-conv{margin-top:8px; width:100%; background:rgba(61,220,201,.14); border:1px solid rgba(61,220,201,.4); color:#3DDCC9; border-radius:7px; padding:5px; font-size:11.5px; font-weight:700; cursor:pointer; font-family:inherit}
.pl-conv:hover{background:rgba(61,220,201,.24)}
.pl-empty{font-size:11.5px; color:rgba(232,238,246,.28); text-align:center; padding:14px 0; border:1px dashed rgba(207,224,242,.14); border-radius:8px}
.ct-src{display:inline-block; font-size:10.5px; font-weight:700; text-transform:uppercase; padding:2px 7px; border-radius:999px}
.ct-demo{background:rgba(23,195,178,.16); color:#17C3B2} .ct-chat{background:rgba(127,216,206,.16); color:#7FD8CE} .ct-campaign{background:rgba(123,179,213,.16); color:#7FB3D5}
.ct-stage{font-size:11px; font-weight:700; padding:3px 8px; border-radius:999px; background:rgba(255,255,255,.08)}
.st-won{background:rgba(61,220,201,.2); color:#3DDCC9} .st-lost{background:rgba(224,122,95,.18); color:#E07A5F}
.st-demo_scheduled,.st-demo_completed{background:rgba(23,195,178,.16); color:#17C3B2} .st-proposal{background:rgba(123,179,213,.16); color:#7FB3D5}
.ct-manual{background:rgba(190,160,235,.18); color:#c3a6ec}
.pl-add-btn{background:#3DDCC9; border:1px solid #3DDCC9; color:#062b28; border-radius:9px; padding:8px 14px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit}
.pl-add-btn:hover{background:#5fe6d5} .pl-add-btn:disabled{opacity:.5; cursor:not-allowed}
.pl-modal-bg{position:fixed; inset:0; background:rgba(6,16,32,.72); display:grid; place-items:center; z-index:50; padding:20px}
.pl-modal{background:#0D1F3C; border:1px solid rgba(207,224,242,.16); border-radius:16px; padding:22px; width:100%; max-width:440px; display:flex; flex-direction:column; gap:12px; box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pl-modal-hd{font-size:17px; font-weight:800; color:#fff; margin-bottom:2px}
.pl-modal label{display:flex; flex-direction:column; gap:5px; font-size:12.5px; font-weight:700; color:rgba(232,238,246,.7)}
.pl-modal input,.pl-modal select{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.16); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; outline:none}
.pl-modal input:focus,.pl-modal select:focus{border-color:#3DDCC9}
.pl-modal-row{display:grid; grid-template-columns:1fr 1fr; gap:12px}
.pl-modal-actions{display:flex; justify-content:flex-end; gap:10px; margin-top:8px}
`;
