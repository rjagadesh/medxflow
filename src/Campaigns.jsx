import { useState, useEffect, useRef, Fragment } from "react";

const API = "/.netlify/functions/campaigns";
const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "-");

const BADGE = {
  pending: ["Pending", "#8aa"],
  sent: ["Delivered", "#7FB3D5"],
  opened: ["Opened", "#17C3B2"],
  responded: ["Clicked", "#7FD8CE"],
  replied: ["Replied", "#3DDCC9"],
  bounced: ["Bounced", "#e07a5f"],
  unsubscribed: ["Unsubscribed", "#C0392B"],
  failed: ["Failed", "#e07a5f"],
};

const WEEKDAYS = [
  ["Sun", 0], ["Mon", 1], ["Tue", 2], ["Wed", 3], ["Thu", 4], ["Fri", 5], ["Sat", 6],
];

export default function Campaigns({ pw, leads = [], visitors = [] }) {
  const [campaigns, setCampaigns] = useState([]);
  const [smtpReady, setSmtpReady] = useState(false);
  const [senders, setSenders] = useState([]);
  const [view, setView] = useState("list"); // "list" | "new" | campaignId
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const call = async (payload) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const d = await call({ action: "list" });
      setCampaigns(d.campaigns || []);
      setSmtpReady(!!d.smtpReady);
      setSenders(d.senders || []);
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

  const act = async (payload, note) => {
    setBusy(payload.action + (payload.id || ""));
    setErr("");
    setMsg("");
    try {
      const r = await call(payload);
      await load();
      if (note) setMsg(typeof note === "function" ? note(r) : note);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy("");
    }
  };

  const syncInbox = () =>
    act({ action: "sync" }, (r) =>
      r.error
        ? `Inbox sync error: ${r.error}`
        : `Inbox synced - ${r.replies || 0} repl(y/ies), ${r.bounces || 0} bounce(s).`
    );

  const current = campaigns.find((c) => c.id === view);

  return (
    <div>
      <style>{CSS}</style>
      {!smtpReady && (
        <div className="cmp-warn">
          ⚠️ SMTP is not configured - emails run in <b>simulation mode</b> (logged, not sent). Add
          SMTP_HOST/USER/PASS to send for real.
        </div>
      )}
      {err && <div className="ad-err" style={{ marginBottom: 12 }}>{err}</div>}
      {msg && <div className="cmp-ok">{msg}</div>}

      {view === "list" && (
        <ListView
          campaigns={campaigns}
          loading={loading}
          busy={busy}
          onNew={() => setView("new")}
          onOpen={(id) => setView(id)}
          onSync={syncInbox}
        />
      )}
      {view === "new" && (
        <NewCampaign
          pw={pw}
          senders={senders}
          leads={leads}
          visitors={visitors}
          onCancel={() => setView("list")}
          onCreated={async (id) => {
            await load();
            setView(id);
          }}
          call={call}
        />
      )}
      {current && (
        <Detail
          c={current}
          busy={busy}
          onBack={() => setView("list")}
          act={act}
          onSync={syncInbox}
        />
      )}
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="cmp-stat">
      <b>{n}</b>
      <span>{label}</span>
    </div>
  );
}

function ListView({ campaigns, loading, busy, onNew, onOpen, onSync }) {
  return (
    <div>
      <div className="cmp-head">
        <h3>Campaigns</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="cmp-btn" disabled={busy === "sync"} onClick={onSync} title="Read the inbox for replies & bounces">
            {busy === "sync" ? "Syncing…" : "⟳ Sync replies/bounces"}
          </button>
          <button className="cmp-btn cmp-primary" onClick={onNew}>+ New campaign</button>
        </div>
      </div>
      {loading && !campaigns.length ? (
        <div className="ad-empty">Loading…</div>
      ) : !campaigns.length ? (
        <div className="ad-empty">No campaigns yet. Create one to start reaching your leads.</div>
      ) : (
        <div className="ad-card">
          <div className="ad-scroll">
            <table>
              <thead>
                <tr><th>Campaign</th><th>Status</th><th>Recipients</th><th>Delivered</th><th>Opened</th><th>Replied</th><th>Bounced</th><th>No response</th><th></th></tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td><b>{c.name}</b><div className="cmp-sub">{c.subject}</div></td>
                    <td><span className={"cmp-status cmp-" + c.status}>{c.status}</span></td>
                    <td>{c.stats.total}</td>
                    <td>{c.stats.delivered}</td>
                    <td>{c.stats.opened + c.stats.replied}</td>
                    <td className="cmp-green">{c.stats.replied}</td>
                    <td>{c.stats.bounced}</td>
                    <td>{c.stats.noResponse}</td>
                    <td><button className="cmp-btn" onClick={() => onOpen(c.id)}>Open →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const CAMPAIGN_TYPES = ["Follow-up series", "One-time broadcast", "Drip sequence", "Re-engagement"];
const DAY_INITIALS = [["Sun", 0], ["Mon", 1], ["Tue", 2], ["Wed", 3], ["Thu", 4], ["Fri", 5], ["Sat", 6]];

const TEMPLATES = {
  "Missed calls": "Hi {{firstName}},\n\nYour front desk can't always pick up - and every missed call is a missed patient. MedXFlow's AI receptionist answers 24/7, books appointments and handles routine questions.\n\nWorth a quick look?\n\nBest,\nThe MedXFlow Team",
  "Denial management": "Hi {{firstName}},\n\nDenied claims quietly drain revenue. MedXFlow's AI works your denials, corrects and resubmits automatically, and flags what needs a human.\n\nCan I show you how it works?\n\nBest,\nThe MedXFlow Team",
  "Intro / demo": "Hi {{firstName}},\n\nWe help practices run their entire revenue cycle with AI - eligibility, prior auth, claims, denials and collections - plus a 24/7 AI front desk.\n\nOpen to a 15-minute demo this week?\n\nBest,\nThe MedXFlow Team",
};

function Toggle({ on, onClick }) {
  return <button type="button" className={"nc-sw" + (on ? " on" : "")} onClick={onClick} aria-pressed={on}><span /></button>;
}

function BarPopover({ icon, label, badge, open, onToggle, children, wide }) {
  return (
    <div className="nc-pop">
      <button type="button" className={"nc-pop-btn" + (open ? " on" : "")} onClick={onToggle}>
        <span>{icon}</span> {label}{badge != null && <em className="nc-pop-badge">{badge}</em>} <i className="nc-caret">▾</i>
      </button>
      {open && <div className={"nc-pop-panel" + (wide ? " wide" : "")}>{children}</div>}
    </div>
  );
}

function NewCampaign({ pw, senders = [], leads, visitors, onCancel, onCreated, call }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Follow-up series");
  const [body, setBody] = useState("Hi {{firstName}},\n\n");
  const [recipients, setRecipients] = useState("");
  const [recipMode, setRecipMode] = useState("list");
  const [listSel, setListSel] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [sheet, setSheet] = useState(null); // { workbook, tabs } | { configured:false }
  const [sheetTab, setSheetTab] = useState("");
  const [sheetBusy, setSheetBusy] = useState(false);
  const [followups, setFollowups] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [sendDays, setSendDays] = useState([1, 3, 5]);
  const [minGap, setMinGap] = useState(2);
  const [maxFup, setMaxFup] = useState(6);
  const [rotateSenders, setRotateSenders] = useState(senders.length > 1);
  const [aiOn, setAiOn] = useState(true);
  const [tplOpen, setTplOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const bodyRef = useRef(null);
  // Editable + persisted sender pool
  const [senderList, setSenderList] = useState(senders);
  const [senderText, setSenderText] = useState(senders.join("\n"));
  const [savingSenders, setSavingSenders] = useState(false);
  const [senderMsg, setSenderMsg] = useState("");
  const [openPop, setOpenPop] = useState(null);
  const togglePop = (k) => setOpenPop((p) => (p === k ? null : k));

  const addFollowup = () => setFollowups((s) => (s.length >= maxFup ? s : [...s, { subject: "", body: "", enabled: true }]));

  const doSaveSenders = async () => {
    const list = senderText.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    setSavingSenders(true); setSenderMsg("");
    try {
      const d = await call({ action: "saveSenders", senders: list });
      setSenderList(d.senders || []);
      setSenderText((d.senders || []).join("\n"));
      if ((d.senders || []).length < 2) setRotateSenders(false);
      setSenderMsg(`Saved ${d.senders?.length || 0} sender(s) ✓`);
    } catch (e) { setSenderMsg(e.message); }
    finally { setSavingSenders(false); }
  };

  const recipList = recipients.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const recipCount = recipList.length;

  const applyList = (val) => {
    setListSel(val);
    const src = val === "leads" ? leads : val === "visitors" ? visitors : val === "both" ? [...leads, ...visitors] : [];
    setRecipients([...new Set(src.map((x) => x.email).filter(Boolean))].join("\n"));
  };

  const onCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const emails = [...new Set(String(reader.result || "").match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [])];
      setRecipients(emails.join("\n"));
    };
    reader.readAsText(file);
  };

  // Google Sheet: each tab is a campaign. Load tab list, then pull a tab's emails.
  const sheetsCall = async (action, extra = {}) => {
    const res = await fetch("/.netlify/functions/sheets", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ action, ...extra }),
    });
    return res.json();
  };
  const loadTabs = async () => {
    setSheetBusy(true);
    try { setSheet(await sheetsCall("tabs")); } catch (e) { setSheet({ configured: false, reason: e.message }); }
    finally { setSheetBusy(false); }
  };
  const applySheetTab = async (tab) => {
    setSheetTab(tab);
    if (!tab) { setRecipients(""); return; }
    if (!name) setName(tab); // default the campaign name to the tab name
    setSheetBusy(true);
    try {
      const d = await sheetsCall("emails", { tab });
      const list = (d.recipients || []).map((r) => (r.name ? `${r.name} <${r.email}>` : r.email));
      setRecipients(list.join("\n"));
    } catch (e) { setErr(e.message); }
    finally { setSheetBusy(false); }
  };
  const pickMode = (m) => { setRecipMode(m); if (m === "sheet" && !sheet) loadTabs(); };

  // Lightweight formatting on the message textarea.
  const wrap = (before, after = before) => {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart, e2 = el.selectionEnd, val = el.value;
    const sel = val.slice(s, e2) || "text";
    setBody(val.slice(0, s) + before + sel + after + val.slice(e2));
    requestAnimationFrame(() => { el.focus(); el.selectionStart = s + before.length; el.selectionEnd = s + before.length + sel.length; });
  };
  const append = (txt) => setBody((b) => b.replace(/\s+$/, "") + txt);

  const generateVariations = () => {
    const base = subject.replace(/^(Quick question:|Re:|Idea:)\s*/i, "").trim() || "A quick idea for your practice";
    const variants = [`Quick question: ${base.charAt(0).toLowerCase() + base.slice(1)}`, `${base} - worth 15 minutes?`, `Idea: ${base}`];
    setSubject(variants[subject.length % variants.length].slice(0, 150));
  };

  // AI insights - simple, honest heuristics on the current draft.
  const insights = (() => {
    const out = [];
    const subjOk = subject.length >= 20 && subject.length <= 60;
    out.push([subjOk, subjOk ? "Subject line looks well-sized" : subject ? `Subject is a little ${subject.length < 20 ? "short" : "long"}` : "Add a subject line"]);
    const pers = /\{\{\s*(firstName|name)\s*\}\}/.test(body + subject);
    out.push([pers, pers ? "Personalization detected" : "Add {{firstName}} to personalize"]);
    out.push([true, `Content tone: ${/!/.test(subject + body) ? "Enthusiastic" : "Professional"}`]);
    const cta = /\?|demo|book|call|reply|show you|look/i.test(body);
    out.push([cta, cta ? "Clear call-to-action" : "Consider a clearer call-to-action"]);
    return out;
  })();

  const setFup = (i, patch) => setFollowups((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const submit = async (asDraft) => {
    if (!name || !subject || !body) { setErr("Name, subject and message are required."); return; }
    setSaving(true);
    setErr("");
    try {
      const fups = followups.filter((f) => f.enabled !== false).map(({ subject, body }) => ({ subject, body }));
      const r = await call({ action: "create", name, fromName: "MedXFlow Health", subject, body, type, status: asDraft ? "draft" : "ready", recipients, followups: fups, sendDays, minGapDays: minGap, sheetTab: recipMode === "sheet" ? sheetTab : undefined, rotateSenders: senderList.length > 1 && rotateSenders });
      onCreated(r.id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const count = (v, max) => <span className="nc-count">{v.length}/{max}</span>;

  const toolbar = (
    <div className="nc-toolbar">
      <div className="nc-tools">
        <button type="button" title="Undo" onClick={() => document.execCommand("undo")}>↶</button>
        <button type="button" title="Redo" onClick={() => document.execCommand("redo")}>↷</button>
        <span className="nc-div" />
        <button type="button" title="Bold" onClick={() => wrap("**")}><b>B</b></button>
        <button type="button" title="Italic" onClick={() => wrap("_")}><i>I</i></button>
        <button type="button" title="Underline" onClick={() => wrap("<u>", "</u>")}><u>U</u></button>
        <button type="button" title="Bulleted list" onClick={() => append("\n- ")}>☰</button>
        <button type="button" title="Link" onClick={() => wrap("[", "](https://medxflow.ai)")}>🔗</button>
        <button type="button" title="Emoji" onClick={() => append(" 🙂")}>😊</button>
      </div>
      <div className="nc-tool-right">
        <div className="nc-dd">
          <button type="button" onClick={() => { setTplOpen((o) => !o); setAiOpen(false); }}>🗂 Insert template ▾</button>
          {tplOpen && (
            <div className="nc-menu">
              {Object.keys(TEMPLATES).map((k) => (
                <button key={k} type="button" onClick={() => { setBody(TEMPLATES[k]); setTplOpen(false); }}>{k}</button>
              ))}
            </div>
          )}
        </div>
        <div className="nc-dd">
          <button type="button" className="nc-ai-btn" onClick={() => { setAiOpen((o) => !o); setTplOpen(false); }}>✨ AI assist ▾</button>
          {aiOpen && (
            <div className="nc-menu">
              <button type="button" onClick={() => { setBody((b) => (/^\s*hi/i.test(b) ? b : "Hi {{firstName}},\n\n" + b)); setAiOpen(false); }}>Add greeting</button>
              <button type="button" onClick={() => { append("\n\nOpen to a quick 15-minute demo this week?"); setAiOpen(false); }}>Add call-to-action</button>
              <button type="button" onClick={() => { append("\n\nBest,\nThe MedXFlow Team"); setAiOpen(false); }}>Add sign-off</button>
              <button type="button" onClick={() => { generateVariations(); setAiOpen(false); }}>Generate subject variation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="nc nc-compose">
      {/* Compact settings toolbar */}
      <div className="nc-bar">
        <div className="nc-ticon sm">📣</div>
        <input className="nc-bar-name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name *" />
        <select className="nc-bar-sel" value={type} onChange={(e) => setType(e.target.value)}>{CAMPAIGN_TYPES.map((t) => <option key={t}>{t}</option>)}</select>

        <BarPopover icon="👥" label="Recipients" badge={recipCount} open={openPop === "recip"} onToggle={() => togglePop("recip")} wide>
          <div className="nc-recip-head">
            <label className="nc-radio"><input type="radio" checked={recipMode === "list"} onChange={() => pickMode("list")} /> Existing list</label>
            <label className="nc-radio"><input type="radio" checked={recipMode === "csv"} onChange={() => pickMode("csv")} /> Upload CSV</label>
            <label className="nc-radio"><input type="radio" checked={recipMode === "sheet"} onChange={() => pickMode("sheet")} /> Google Sheet</label>
          </div>
          <div className="nc-recip-body">
            {recipMode === "list" ? (
              <select className="nc-select" value={listSel} onChange={(e) => applyList(e.target.value)}>
                <option value="">Select recipient list…</option>
                <option value="leads">Demo requests / leads ({leads.length})</option>
                <option value="visitors">Chat visitors ({visitors.length})</option>
                <option value="both">All contacts ({new Set([...leads, ...visitors].map((x) => x.email).filter(Boolean)).size})</option>
              </select>
            ) : recipMode === "csv" ? (
              <label className="nc-csv">📄 Choose CSV file<input type="file" accept=".csv,text/csv" onChange={onCsv} hidden /></label>
            ) : sheetBusy && !sheet ? (
              <div className="nc-select" style={{ display: "flex", alignItems: "center", color: "#64748B" }}>Loading tabs…</div>
            ) : sheet && sheet.configured === false ? (
              <div className="nc-sheet-setup">📄 Not connected — {sheet.reason || "share the workbook with the service account."}</div>
            ) : (
              <select className="nc-select" value={sheetTab} onChange={(e) => applySheetTab(e.target.value)}>
                <option value="">Select a campaign tab…{sheet?.workbook ? ` (${sheet.workbook})` : ""}</option>
                {(sheet?.tabs || []).map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            )}
            <button type="button" className="nc-obtn" onClick={() => setShowSample((s) => !s)}>👁 Sample</button>
            {recipMode === "sheet"
              ? <button type="button" className="nc-obtn" onClick={loadTabs} disabled={sheetBusy}>⟳ Refresh</button>
              : <button type="button" className="nc-obtn" onClick={() => setRecipients(recipList.filter((e) => e.includes("@")).join("\n"))}>⛃ Filter</button>}
          </div>
          <div className="nc-recip-count">{recipCount.toLocaleString()} recipient{recipCount === 1 ? "" : "s"} selected{recipMode === "sheet" && sheetTab ? ` · from “${sheetTab}”` : ""}</div>
          {showSample && recipCount > 0 && <div className="nc-sample">{recipList.slice(0, 8).join(", ")}{recipCount > 8 ? ` … +${recipCount - 8} more` : ""}</div>}
        </BarPopover>

        <BarPopover icon="📅" label="Schedule" open={openPop === "sched"} onToggle={() => togglePop("sched")}>
          <p className="nc-sub" style={{ margin: "0 0 10px" }}>Follow-ups send on these days</p>
          <div className="nc-days">
            {DAY_INITIALS.map(([label, d]) => (
              <div key={d} className="nc-day">
                <span>{label.slice(0, label === "Sun" || label === "Sat" ? 1 : 3)}</span>
                <Toggle on={sendDays.includes(d)} onClick={() => setSendDays((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d].sort()))} />
              </div>
            ))}
          </div>
          <div className="nc-min"><span>Minimum</span><input type="number" min="1" max="30" value={minGap} onChange={(e) => setMinGap(Math.max(1, +e.target.value || 1))} /><span>days between emails</span></div>
        </BarPopover>

        <BarPopover icon="✉️" label="Senders" badge={senderList.length} open={openPop === "senders"} onToggle={() => togglePop("senders")} wide>
          <div className="nc-rotate" style={{ margin: 0, border: "none", padding: 0 }}>
            <div className="nc-rotate-l">
              <b>🔁 Rotate senders</b>
              <span>{senderList.length > 1 ? `Round-robin across ${senderList.length} mailboxes` : "Add 2+ mailboxes to rotate"}</span>
            </div>
            <Toggle on={senderList.length > 1 && rotateSenders} onClick={() => senderList.length > 1 && setRotateSenders((v) => !v)} />
          </div>
          <label className="nc-pop-lbl">Sender mailboxes — one per line</label>
          <textarea className="nc-sender-edit" rows={4} value={senderText} onChange={(e) => setSenderText(e.target.value)} placeholder={"raj@medxflow.ai\njay@medxflow.ai"} />
          <div className="nc-sender-actions">
            <button type="button" className="nc-save-sm" disabled={savingSenders} onClick={doSaveSenders}>{savingSenders ? "Saving…" : "💾 Save senders"}</button>
            {senderMsg && <span className="nc-sender-msg">{senderMsg}</span>}
          </div>
          <div className="nc-pop-hint">Saved to Netlify Blobs — used for all campaigns.</div>
        </BarPopover>

        <BarPopover icon="✨" label="Insights" open={openPop === "ai"} onToggle={() => togglePop("ai")}>
          <ul className="nc-ai-list">
            {insights.map(([ok, text], i) => (
              <li key={i}><span className={"nc-chk" + (ok ? "" : " warn")}>{ok ? "✓" : "!"}</span>{text}</li>
            ))}
          </ul>
          <button type="button" className="nc-ai-gen" onClick={generateVariations}>✨ Generate subject variation</button>
        </BarPopover>

        <div className="nc-bar-actions">
          <button className="nc-back" onClick={onCancel}>← Back</button>
          <button className="nc-draft" disabled={saving} onClick={() => submit(true)}>💾 Draft</button>
          <button className="nc-create" disabled={saving} onClick={() => submit(false)}>✈ {saving ? "Creating…" : "Create campaign"}</button>
        </div>
      </div>

      {err && <div className="ad-err" style={{ margin: "10px 0" }}>{err}</div>}

      {/* Compose stack: initial email + stacked follow-up blocks */}
      <div className="nc-stack">
        <div className="nc-block">
          <div className="nc-block-h">
            <span className="nc-block-tag nc-tag-initial">Initial email</span>
            <span className="nc-block-day">sent first</span>
          </div>
          <div className="nc-input nc-input-lg"><span className="nc-ic">✉️</span><input maxLength={150} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject *" />{count(subject, 150)}</div>
          {toolbar}
          <textarea ref={bodyRef} className="nc-body nc-body-big" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message… use {{firstName}}, {{name}}, {{email}}. Links are tracked automatically." />
        </div>

        {followups.map((fu, i) => (
          <div className="nc-block" key={i}>
            <div className="nc-block-h">
              <span className="nc-block-tag">Follow-up {i + 1}</span>
              <span className="nc-block-day">Day {minGap * (i + 1)}</span>
              <span className="nc-block-sw"><Toggle on={fu.enabled !== false} onClick={() => setFup(i, { enabled: fu.enabled === false })} /></span>
              <button type="button" className="nc-block-x" onClick={() => setFollowups((s) => s.filter((_, j) => j !== i))}>✕ Remove</button>
            </div>
            <div className="nc-input nc-input-lg"><span className="nc-ic">✉️</span><input maxLength={150} value={fu.subject} onChange={(e) => setFup(i, { subject: e.target.value })} placeholder={`Follow-up ${i + 1} subject`} /></div>
            <textarea className="nc-body nc-body-big" value={fu.body} onChange={(e) => setFup(i, { body: e.target.value })} placeholder="Follow-up message…" />
          </div>
        ))}

        <button type="button" className="nc-addblock" disabled={followups.length >= maxFup} onClick={addFollowup}>
          ＋ Add follow-up{followups.length >= maxFup ? ` (max ${maxFup})` : ""}
        </button>
      </div>
    </div>
  );
}

function Detail({ c, busy, onBack, act, onSync }) {
  const s = c.stats;
  const dayNames = (c.sendDays || [1, 3, 5]).map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ");
  const addRecipients = async () => {
    const raw = window.prompt("Add recipients (one per line or comma-separated):");
    if (raw && raw.trim()) act({ action: "addRecipients", id: c.id, recipients: raw }, (r) => `Added ${r.added} recipient(s).`);
  };
  return (
    <div>
      <div className="cmp-head">
        <button className="cmp-btn" onClick={onBack}>← All campaigns</button>
        <span className={"cmp-status cmp-" + c.status}>{c.status}</span>
      </div>
      <h3 style={{ margin: "6px 0 2px" }}>{c.name}</h3>
      <div className="cmp-sub">{c.subject}</div>
      <div className="cmp-sched">📅 Sends on {dayNames} · min {c.minGapDays || 2} days apart · {(c.followups || []).length} follow-up(s) · stops on reply</div>

      <div className="cmp-stats">
        <Stat n={s.total} label="Recipients" />
        <Stat n={s.delivered} label="Delivered" />
        <Stat n={s.opened + s.replied} label="Opened" />
        <Stat n={s.replied} label="Replied" />
        <Stat n={s.noResponse} label="No response" />
        <Stat n={s.bounced} label="Bounced" />
        <Stat n={s.unsubscribed} label="Unsubscribed" />
      </div>

      <div className="cmp-actions">
        <button className="cmp-btn cmp-primary" disabled={!!busy || !s.pending} onClick={() => act({ action: "send", id: c.id }, (r) => `Sent ${r.sent}${r.simulated ? " (simulated)" : ""}. ${r.remaining} remaining.`)}>
          {busy === "send" + c.id ? "Sending…" : `Send first email${s.pending ? ` (${s.pending})` : ""}`}
        </button>
        <button className="cmp-btn" disabled={!!busy || !(c.followups || []).length} onClick={() => act({ action: "followup", id: c.id }, (r) => `Follow-ups sent: ${r.sent}${r.simulated ? " (simulated)" : ""}.`)}>
          {busy === "followup" + c.id ? "Sending…" : "Send due follow-ups now"}
        </button>
        <button className="cmp-btn" disabled={busy === "sync"} onClick={onSync}>{busy === "sync" ? "Syncing…" : "⟳ Sync replies/bounces"}</button>
        <button className="cmp-btn" onClick={addRecipients}>+ Add recipients</button>
        <button className="cmp-btn cmp-danger" onClick={() => { if (window.confirm("Delete this campaign?")) act({ action: "delete", id: c.id }); onBack(); }}>Delete</button>
      </div>

      <div className="ad-card" style={{ marginTop: 16 }}>
        <div className="ad-scroll">
          <table>
            <thead>
              <tr><th>Email</th><th>Name</th><th>Status</th><th>Sent</th><th>Opened</th><th>Follow-ups</th><th></th></tr>
            </thead>
            <tbody>
              {(c.recipients || []).map((r) => {
                const [label, color] = BADGE[r.status] || [r.status, "#8aa"];
                return (
                  <tr key={r.email}>
                    <td>{r.email}</td>
                    <td>{r.name || "-"}</td>
                    <td>
                      <span className="cmp-badge" style={{ color, borderColor: color }} title={r.error || ""}>{label}</span>
                      {r.status === "failed" && r.error && <div className="cmp-err-detail">{r.error}</div>}
                    </td>
                    <td className="ad-nowrap">{fmt(r.sentAt)}</td>
                    <td className="ad-nowrap">{fmt(r.openedAt)}</td>
                    <td>{r.followupsSent || 0}</td>
                    <td>{!["replied", "unsubscribed", "bounced"].includes(r.status) && (
                      <button className="cmp-btn cmp-sm" onClick={() => act({ action: "markReplied", id: c.id, email: r.email })}>Mark replied</button>
                    )}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.cmp-warn{background:rgba(23,195,178,.14); border:1px solid rgba(23,195,178,.4); color:#17C3B2; padding:10px 14px; border-radius:10px; font-size:13px; margin-bottom:14px}
.cmp-ok{background:rgba(61,220,201,.12); border:1px solid rgba(61,220,201,.35); color:#3DDCC9; padding:9px 13px; border-radius:9px; font-size:13px; margin-bottom:12px}
.cmp-head{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px}
.cmp-head h3,.cmp-head h4{margin:0}
.cmp-sub{font-size:13px; color:rgba(232,238,246,.55)}
.cmp-green{color:#3DDCC9; font-weight:700}
.cmp-btn{background:rgba(255,255,255,.08); border:1px solid rgba(207,224,242,.24); color:#E8EEF6; border-radius:9px; padding:8px 14px; font-size:13.5px; font-weight:600; cursor:pointer; font-family:inherit}
.cmp-btn:hover:not(:disabled){background:rgba(255,255,255,.16)}
.cmp-btn:disabled{opacity:.4; cursor:default}
.cmp-primary{background:#1A5DAD; border-color:#1A5DAD; color:#fff}
.cmp-primary:hover:not(:disabled){background:#1F6FA0}
.cmp-danger{border-color:rgba(192,57,43,.5); color:#e88}
.cmp-sm{padding:5px 10px; font-size:12px}
.cmp-status{font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; padding:3px 9px; border-radius:999px; background:rgba(255,255,255,.1)}
.cmp-active{background:rgba(61,220,201,.18); color:#3DDCC9} .cmp-draft{background:rgba(255,255,255,.12); color:#bcd}
.cmp-badge{font-size:11.5px; font-weight:700; padding:2px 9px; border:1px solid; border-radius:999px}
.cmp-err-detail{margin-top:4px; font-size:11px; color:#e88; max-width:340px; line-height:1.4; word-break:break-word}
.cmp-stats{display:flex; flex-wrap:wrap; gap:12px; margin:16px 0}
.cmp-stat{background:#112B52; border:1px solid rgba(207,224,242,.14); border-radius:12px; padding:12px 20px; min-width:96px}
.cmp-stat b{display:block; font-size:24px; color:#fff; font-weight:800; line-height:1}
.cmp-stat span{font-size:12px; color:rgba(232,238,246,.6)}
.cmp-actions{display:flex; flex-wrap:wrap; gap:10px; margin-top:8px}
.cmp-form label{display:block; font-size:13px; font-weight:600; color:#E8EEF6; margin-bottom:14px}
.cmp-form input, .cmp-form textarea{width:100%; margin-top:6px; padding:10px 12px; border:1px solid rgba(207,224,242,.2); border-radius:9px; background:#0A1830; color:#fff; font-size:14px; font-family:inherit; outline:none; resize:vertical}
.cmp-form input:focus, .cmp-form textarea:focus{border-color:#3DDCC9}
.cmp-row{display:grid; grid-template-columns:1fr 2fr; gap:14px}
.cmp-hint{font-weight:400; color:rgba(232,238,246,.45); font-size:12px}
.cmp-recip-head{display:flex; align-items:flex-end; gap:12px}
.cmp-imports{display:flex; gap:8px; margin-bottom:14px}
.cmp-fups{margin-top:8px; border-top:1px solid rgba(207,224,242,.12); padding-top:16px}
.cmp-fup{background:#112B52; border:1px solid rgba(207,224,242,.14); border-radius:10px; padding:12px; margin-bottom:10px}
.cmp-fup-top{display:flex; align-items:center; gap:12px; margin-bottom:8px; font-weight:700; font-size:13px}
.cmp-inline{display:inline-flex!important; align-items:center; gap:6px; margin:0!important; font-weight:600}
.cmp-inline input{width:60px!important; margin:0!important; padding:5px 8px!important}
.cmp-x{margin-left:auto; background:none; border:none; color:#e88; cursor:pointer; font-size:14px}
.cmp-sched{font-size:12.5px; color:rgba(232,238,246,.6); margin-top:6px}
.cmp-days{display:flex; gap:6px; flex-wrap:wrap}
.cmp-day{background:#0A1830; border:1px solid rgba(207,224,242,.2); color:rgba(232,238,246,.6); border-radius:8px; padding:7px 12px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit}
.cmp-day.on{background:#1A5DAD; border-color:#1A5DAD; color:#fff}
@media(max-width:640px){.cmp-row{grid-template-columns:1fr}}

/* ===== New campaign - light redesign ===== */
.nc{background:#F4F7FB; margin:-4px; padding:16px; border-radius:16px; color:#1B2A44; font-family:inherit}
.nc *{box-sizing:border-box}
.nc-top{display:flex; align-items:center; justify-content:space-between; gap:16px; background:#fff; border:1px solid #E6ECF3; border-radius:14px; padding:11px 18px; margin-bottom:12px; box-shadow:0 1px 2px rgba(16,40,80,.04)}
.nc-title{display:flex; align-items:center; gap:13px}
.nc-ticon{width:42px; height:42px; border-radius:11px; background:#EEF1FF; display:grid; place-items:center; font-size:20px}
.nc-title h2{margin:0; font-size:20px; font-weight:800; color:#101B33; letter-spacing:-.02em}
.nc-title p{margin:2px 0 0; font-size:13.5px; color:#64748B}
.nc-back{background:#fff; border:1px solid #E1E8F0; color:#334155; border-radius:10px; padding:10px 16px; font-size:13.5px; font-weight:600; cursor:pointer; font-family:inherit}
.nc-back:hover{background:#F8FAFC}
.nc-grid2c{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:12px}
.nc-field label{display:block; font-size:12.5px; font-weight:700; color:#334155; margin-bottom:6px}
.nc-field label i{color:#EF4444; font-style:normal}
.nc-input{position:relative; display:flex; align-items:center; background:#fff; border:1px solid #E1E8F0; border-radius:10px; padding:0 12px; height:42px; transition:border-color .15s, box-shadow .15s}
.nc-input:focus-within{border-color:#2F6BFF; box-shadow:0 0 0 3px rgba(47,107,255,.12)}
.nc-ic{font-size:15px; opacity:.65; margin-right:9px}
.nc-input input, .nc-input select{flex:1; border:none; outline:none; background:none; font-size:14px; color:#101B33; font-family:inherit; height:100%}
.nc-input select{cursor:pointer; appearance:none}
.nc-count{position:absolute; right:12px; bottom:-17px; font-size:11px; color:#94A3B8; font-variant-numeric:tabular-nums}
/* Subject - prominent, full width */
.nc-field-subject{margin-bottom:14px}
.nc-field-subject label{font-size:13.5px}
.nc-input-lg{height:58px; border-radius:12px; border-color:#D7E0EC}
.nc-input-lg .nc-ic{font-size:18px; margin-right:11px}
.nc-input-lg input{font-size:18px!important; font-weight:600}
.nc-card{background:#fff; border:1px solid #E6ECF3; border-radius:14px; box-shadow:0 1px 2px rgba(16,40,80,.04)}
/* Single-window two-column layout: compose left, feature rail right */
.nc-main{display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:14px; align-items:stretch}
.nc-left{display:flex; flex-direction:column; gap:12px; min-width:0}
.nc-col{display:flex; flex-direction:column; gap:12px; min-width:0}
.nc-grid2c{margin-bottom:0}
.nc-field-subject{margin-bottom:0}
.nc-left .nc-msg{flex:1; display:flex; flex-direction:column; min-height:0}
.nc-recip{margin-bottom:0}
.nc-msg{padding:14px 16px}
.nc-lbl{display:block; font-size:14.5px; font-weight:800; color:#1B2A44; margin-bottom:10px}
.nc-lbl i{color:#EF4444; font-style:normal}
.nc-toolbar{display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; border:1px solid #EDF1F6; border-radius:10px 10px 0 0; background:#FAFBFD; padding:7px 9px}
.nc-tools{display:flex; align-items:center; gap:2px}
.nc-tools button{width:32px; height:32px; border:none; background:none; border-radius:7px; cursor:pointer; color:#475569; font-size:14px; display:grid; place-items:center; font-family:inherit}
.nc-tools button:hover{background:#EEF2F7}
.nc-div{width:1px; height:20px; background:#E2E8F0; margin:0 5px}
.nc-tool-right{display:flex; gap:8px}
.nc-dd{position:relative}
.nc-dd>button{background:#fff; border:1px solid #E1E8F0; border-radius:8px; padding:7px 11px; font-size:12.5px; font-weight:600; color:#334155; cursor:pointer; font-family:inherit}
.nc-dd>button:hover{background:#F8FAFC}
.nc-ai-btn{color:#5B49E0!important; border-color:#DAD6FB!important; background:#F5F3FF!important}
.nc-menu{position:absolute; top:calc(100% + 6px); right:0; background:#fff; border:1px solid #E6ECF3; border-radius:10px; box-shadow:0 12px 30px rgba(16,40,80,.14); padding:6px; z-index:20; min-width:190px; display:flex; flex-direction:column}
.nc-menu button{text-align:left; background:none; border:none; padding:9px 11px; border-radius:7px; font-size:13px; color:#334155; cursor:pointer; font-family:inherit; white-space:nowrap}
.nc-menu button:hover{background:#F1F5F9}
.nc-body{width:100%; flex:1; min-height:240px; border:1px solid #EDF1F6; border-top:none; border-radius:0 0 10px 10px; padding:16px; font-size:15.5px; line-height:1.65; color:#1B2A44; font-family:inherit; resize:vertical; outline:none}
.nc-body:focus{border-color:#EDF1F6}
.nc-ai{padding:14px; background:linear-gradient(180deg,#FBFBFF,#F7F8FF); border-color:#E9E7FB}
.nc-ai.off{background:#fff}
.nc-ai-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:11px}
.nc-ai-title{font-size:14px; font-weight:800; color:#3A2Fb8; display:flex; align-items:center; gap:8px}
.nc-ai-title em{font-style:normal; font-size:10.5px; font-weight:700; background:#E6FBF0; color:#0E9F6E; padding:2px 8px; border-radius:999px; letter-spacing:.02em}
.nc-ai-list{list-style:none; margin:0 0 12px; padding:0; display:flex; flex-direction:column; gap:10px}
.nc-ai-list li{display:flex; align-items:flex-start; gap:9px; font-size:13px; color:#334155; line-height:1.4}
.nc-chk{flex:none; width:19px; height:19px; border-radius:50%; background:#DCFCE7; color:#16A34A; display:grid; place-items:center; font-size:12px; font-weight:800; margin-top:1px}
.nc-chk.warn{background:#FEF3C7; color:#D97706}
.nc-ai-gen{width:100%; background:#fff; border:1px solid #DAD6FB; color:#5B49E0; border-radius:9px; padding:10px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit}
.nc-ai-gen:hover{background:#F5F3FF}
/* toggle switch */
.nc-sw{width:38px; height:22px; border-radius:999px; border:none; background:#CBD5E1; position:relative; cursor:pointer; padding:0; transition:background .16s; flex:none}
.nc-sw.on{background:#2F6BFF}
.nc-sw span{position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:left .16s; box-shadow:0 1px 2px rgba(0,0,0,.2)}
.nc-sw.on span{left:18px}
/* recipients */
.nc-recip{padding:13px 16px; margin-bottom:12px}
.nc-recip-head{display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:11px}
.nc-recip-head b{font-size:14px; font-weight:800; color:#101B33}
.nc-recip-head b i{color:#EF4444; font-style:normal}
.nc-ic-chip{width:32px; height:32px; border-radius:9px; background:#EEF1FF; display:grid; place-items:center; font-size:15px}
.nc-radio{display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#334155; cursor:pointer}
.nc-radio input{accent-color:#2F6BFF; width:15px; height:15px}
.nc-recip-body{display:flex; gap:9px; align-items:center; flex-wrap:wrap}
.nc-select{flex:1; min-width:220px; height:40px; border:1px solid #E1E8F0; border-radius:9px; padding:0 12px; font-size:13.5px; color:#101B33; background:#fff; font-family:inherit; cursor:pointer}
.nc-csv{flex:1; min-width:220px; height:40px; border:1px dashed #C7D2E0; border-radius:9px; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; font-weight:600; color:#475569; cursor:pointer; background:#FAFBFD}
.nc-csv:hover{background:#F1F5F9}
.nc-obtn{height:40px; background:#fff; border:1px solid #E1E8F0; border-radius:9px; padding:0 13px; font-size:12.5px; font-weight:600; color:#334155; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:6px}
.nc-obtn:hover{background:#F8FAFC}
.nc-recip-count{margin-top:9px; font-size:12px; color:#64748B; font-weight:600}
.nc-sample{margin-top:8px; font-size:12.5px; color:#475569; background:#F8FAFC; border:1px solid #EDF1F6; border-radius:8px; padding:9px 12px; line-height:1.5}
.nc-sheet-setup{flex:1; min-width:240px; min-height:46px; display:flex; align-items:center; padding:0 14px; border:1px dashed #F0C36D; background:#FFFBEB; border-radius:10px; font-size:12.5px; color:#92610A; line-height:1.4}
/* schedule + follow-ups */
.nc-grid2{display:grid; grid-template-columns:1fr 1.35fr; gap:14px}
.nc-card-h{display:flex; align-items:center; gap:10px; padding:12px 16px 0}
.nc-card-h b{font-size:14px; font-weight:800; color:#101B33}
.nc-sched, .nc-fups{padding-bottom:14px}
.nc-sub{margin:6px 16px 11px; font-size:12px; color:#64748B}
.nc-days{display:flex; gap:8px; flex-wrap:wrap; padding:0 16px}
.nc-day{display:flex; flex-direction:column; align-items:center; gap:6px; font-size:11.5px; font-weight:700; color:#475569}
.nc-min{display:flex; align-items:center; gap:8px; padding:13px 16px 0; font-size:13px; color:#334155; font-weight:600}
.nc-min input{width:56px; height:38px; border:1px solid #E1E8F0; border-radius:9px; text-align:center; font-size:14px; font-family:inherit; color:#101B33}
.nc-rotate{display:flex; align-items:center; justify-content:space-between; gap:10px; margin:12px 16px 0; padding-top:11px; border-top:1px solid #EDF1F6}
.nc-rotate-l{display:flex; flex-direction:column; gap:2px}
.nc-rotate-l b{font-size:13px; font-weight:700; color:#334155}
.nc-rotate-l span{font-size:11.5px; color:#64748B}
.nc-senders{margin:8px 16px 0; padding:8px 11px; background:#F8FAFC; border:1px solid #EDF1F6; border-radius:8px; font-size:11.5px; color:#475569; line-height:1.5; word-break:break-word}
.nc-fup-ctl{margin-left:auto; display:flex; align-items:center; gap:10px}
.nc-uptok{font-size:12.5px; color:#64748B; font-weight:600; display:flex; align-items:center; gap:6px}
.nc-uptok input{width:46px; height:32px; border:1px solid #E1E8F0; border-radius:8px; text-align:center; font-family:inherit; font-size:13px}
.nc-addfup{background:#2F6BFF; border:none; color:#fff; border-radius:9px; padding:9px 14px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit}
.nc-addfup:disabled{opacity:.45; cursor:default}
.nc-fup-empty{margin:14px 18px 0; padding:18px; border:1px dashed #DCE3EC; border-radius:11px; text-align:center; font-size:13px; color:#94A3B8}
.nc-fup-table{width:100%; border-collapse:collapse; margin-top:12px}
.nc-fup-table th{text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#94A3B8; padding:8px 10px; border-bottom:1px solid #EDF1F6}
.nc-fup-table th:first-child{padding-left:18px}
.nc-fup-table td{padding:6px 10px; border-bottom:1px solid #F1F5F9; vertical-align:middle}
.nc-fup-table td:first-child{padding-left:18px}
.nc-fup-n{width:24px; color:#94A3B8; font-weight:700}
.nc-fup-day{white-space:nowrap; font-size:13px; font-weight:600; color:#334155}
.nc-fup-subj{width:100%; border:1px solid transparent; border-radius:7px; padding:7px 9px; font-size:13.5px; color:#1B2A44; font-family:inherit; background:#F8FAFC}
.nc-fup-subj:focus{outline:none; border-color:#2F6BFF; background:#fff}
.nc-fup-x{background:none; border:none; color:#94A3B8; font-size:18px; cursor:pointer; padding:0 6px}
.nc-fup-x:hover{color:#475569}
.nc-fup-bodyrow td{padding:0 18px 12px}
.nc-fup-bodyrow textarea{width:100%; border:1px solid #E1E8F0; border-radius:9px; padding:10px 12px; font-size:13.5px; font-family:inherit; color:#1B2A44; resize:vertical}
/* footer */
.nc-footer{display:flex; gap:12px; margin-top:12px}
.nc-create{background:linear-gradient(180deg,#3B7BFF,#1E52C8); border:none; color:#fff; border-radius:11px; padding:13px 26px; font-size:14.5px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 6px 16px rgba(47,107,255,.28)}
.nc-create:hover:not(:disabled){filter:brightness(1.05)}
.nc-create:disabled{opacity:.6; cursor:default}
.nc-draft{background:#fff; border:1px solid #E1E8F0; color:#334155; border-radius:11px; padding:13px 24px; font-size:14.5px; font-weight:600; cursor:pointer; font-family:inherit}
.nc-draft:hover:not(:disabled){background:#F8FAFC}
/* ===== Compose redesign: top toolbar + stacked email blocks ===== */
.nc-compose{padding:14px}
.nc-bar{position:sticky; top:0; z-index:30; display:flex; align-items:center; gap:9px; flex-wrap:wrap; background:#fff; border:1px solid #E6ECF3; border-radius:13px; padding:9px 12px; margin-bottom:14px; box-shadow:0 2px 8px rgba(16,40,80,.06)}
.nc-ticon.sm{width:34px; height:34px; border-radius:9px; font-size:17px; flex:none}
.nc-bar-name{flex:1; min-width:150px; height:38px; border:1px solid #E1E8F0; border-radius:9px; padding:0 12px; font-size:14px; font-weight:600; color:#101B33; font-family:inherit; outline:none}
.nc-bar-name:focus{border-color:#2F6BFF; box-shadow:0 0 0 3px rgba(47,107,255,.1)}
.nc-bar-sel{height:38px; border:1px solid #E1E8F0; border-radius:9px; padding:0 10px; font-size:13px; color:#334155; background:#fff; font-family:inherit; cursor:pointer}
.nc-pop{position:relative}
.nc-pop-btn{display:flex; align-items:center; gap:6px; height:38px; padding:0 12px; background:#F8FAFC; border:1px solid #E1E8F0; border-radius:9px; font-size:13px; font-weight:600; color:#334155; cursor:pointer; font-family:inherit; white-space:nowrap}
.nc-pop-btn.on{background:#EEF3FF; border-color:#B9CDF7; color:#2F6BFF}
.nc-pop-btn:hover{background:#F1F5F9}
.nc-pop-badge{font-style:normal; background:#2F6BFF; color:#fff; font-size:11px; font-weight:700; padding:1px 7px; border-radius:999px}
.nc-caret{font-style:normal; opacity:.55; font-size:11px}
.nc-pop-panel{position:absolute; top:calc(100% + 7px); right:0; left:auto; z-index:40; background:#fff; border:1px solid #E6ECF3; border-radius:12px; box-shadow:0 16px 40px rgba(16,40,80,.16); padding:14px; width:300px; max-width:92vw}
.nc-pop-panel.wide{width:380px}
.nc-pop-lbl{display:block; font-size:12px; font-weight:700; color:#334155; margin:12px 0 6px}
.nc-pop-hint{font-size:11px; color:#94A3B8; margin-top:8px}
.nc-sender-edit{width:100%; border:1px solid #E1E8F0; border-radius:9px; padding:9px 11px; font-size:13px; font-family:inherit; color:#1B2A44; resize:vertical}
.nc-sender-actions{display:flex; align-items:center; gap:10px; margin-top:8px}
.nc-save-sm{background:#2F6BFF; border:none; color:#fff; border-radius:8px; padding:8px 14px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit}
.nc-save-sm:disabled{opacity:.5}
.nc-sender-msg{font-size:12px; color:#0E9F6E; font-weight:600}
.nc-bar-actions{display:flex; gap:8px; margin-left:auto}
.nc-stack{display:flex; flex-direction:column; gap:14px; max-width:900px; margin:0 auto}
.nc-block{background:#fff; border:1px solid #E6ECF3; border-radius:14px; box-shadow:0 1px 2px rgba(16,40,80,.04); padding:14px 16px; display:flex; flex-direction:column; gap:10px}
.nc-block-h{display:flex; align-items:center; gap:10px}
.nc-block-tag{font-size:12.5px; font-weight:800; color:#5B49E0; background:#F0EEFF; padding:4px 11px; border-radius:999px}
.nc-tag-initial{color:#0E7C86; background:#E6F7F5}
.nc-block-day{font-size:12px; color:#64748B; font-weight:600}
.nc-block-sw{margin-left:auto; display:flex; align-items:center}
.nc-block-x{background:none; border:none; color:#94A3B8; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit}
.nc-block-x:hover{color:#E05A4E}
.nc-block .nc-toolbar{border-radius:10px}
.nc-body-big{min-height:300px; border:1px solid #EDF1F6!important; border-top:1px solid #EDF1F6!important; border-radius:10px!important}
.nc-addblock{align-self:center; background:#fff; border:1.5px dashed #B9CDF7; color:#2F6BFF; border-radius:11px; padding:12px 28px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; margin-bottom:8px}
.nc-addblock:hover:not(:disabled){background:#F5F8FF}
.nc-addblock:disabled{opacity:.5; cursor:default; border-color:#E1E8F0; color:#94A3B8}
@media(max-width:1150px){.nc-main{grid-template-columns:1fr 1fr}}
@media(max-width:820px){.nc-main{grid-template-columns:1fr}.nc-bar-actions{margin-left:0; width:100%}}
@media(max-width:720px){.nc-grid3{grid-template-columns:1fr}.nc-top{flex-direction:column; align-items:flex-start; gap:12px}}
`;
