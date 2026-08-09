import { useState, useEffect } from "react";

// WhatsApp Business tab - send template and text messages via the Cloud API
// (server function netlify/functions/whatsapp.mjs).

async function call(pw, action, extra = {}) {
  const res = await fetch("/.netlify/functions/whatsapp", {
    method: "POST",
    headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

export default function WhatsApp({ pw }) {
  const [info, setInfo] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [err, setErr] = useState("");

  const [mode, setMode] = useState("template"); // template | text
  const [recipients, setRecipients] = useState("");
  const [tplName, setTplName] = useState("");
  const [vars, setVars] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    call(pw, "info").then(setInfo).catch((e) => setErr(e.message));
    call(pw, "templates").then((d) => setTemplates(d.templates || [])).catch(() => {});
  }, [pw]);

  const tpl = templates.find((t) => t.name === tplName);
  const onPickTpl = (name) => {
    setTplName(name);
    const t = templates.find((x) => x.name === name);
    setVars(Array((t?.vars) || 0).fill(""));
  };

  const recipList = recipients.split(/[\n,;]+/).map((s) => s.replace(/[^\d]/g, "")).filter(Boolean);

  const send = async () => {
    if (!recipList.length) { setErr("Add at least one recipient number."); return; }
    setSending(true); setErr(""); setResults(null);
    const out = [];
    for (const to of recipList) {
      const payload = mode === "text"
        ? { to, mode: "text", text }
        : { to, mode: "template", templateName: tplName, language: tpl?.language || "en_US", params: vars };
      try {
        const r = await call(pw, "send", payload);
        out.push({ to, ok: !!r.ok, msg: r.ok ? (r.id || "sent") : (r.error || "failed") });
      } catch (e) { out.push({ to, ok: false, msg: e.message }); }
    }
    setResults(out);
    setSending(false);
  };

  if (err && !info) return <div className="ad-err">{err}</div>;
  if (!info) return <div className="ad-empty">Connecting to WhatsApp…</div>;
  if (info.configured === false) return <WaSetup reason={info.reason} />;

  const n = info.number || {};
  const canSend = mode === "text" ? !!text.trim() && recipList.length : !!tplName && recipList.length;

  return (
    <div className="wa">
      <style>{WA_CSS}</style>

      {/* Sending number */}
      <div className="ad-card wa-card">
        <div className="wa-numhead">
          <span className="wa-wa">🟢 WhatsApp</span>
          {info.numberError ? (
            <span className="wa-numerr">Couldn't load number: {info.numberError}</span>
          ) : (
            <>
              <b>{n.verified_name || "WhatsApp Business"}</b>
              <span className="wa-num">{n.display_phone_number || "—"}</span>
              {n.quality_rating && <span className={"wa-q wa-q-" + (n.quality_rating || "").toLowerCase()}>{n.quality_rating}</span>}
            </>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="ad-card wa-card wa-compose">
        <div className="wa-modes">
          <button className={mode === "template" ? "on" : ""} onClick={() => setMode("template")}>📋 Template</button>
          <button className={mode === "text" ? "on" : ""} onClick={() => setMode("text")}>💬 Text</button>
        </div>

        <label className="wa-lbl">Recipients <span>— one per line, full international format (e.g. +14695551234)</span></label>
        <textarea className="wa-recip" rows={2} value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder={"+14695551234\n+919876543210"} />
        {recipList.length > 0 && <div className="wa-count">{recipList.length} recipient{recipList.length === 1 ? "" : "s"}</div>}

        {mode === "template" ? (
          <>
            <label className="wa-lbl">Template</label>
            <select className="wa-sel" value={tplName} onChange={(e) => onPickTpl(e.target.value)}>
              <option value="">Select an approved template…</option>
              {templates.map((t) => <option key={t.name + t.language} value={t.name}>{t.name} · {t.language}{t.vars ? ` · ${t.vars} var${t.vars > 1 ? "s" : ""}` : ""}</option>)}
            </select>
            {tpl && tpl.vars > 0 && (
              <div className="wa-vars">
                {vars.map((v, i) => (
                  <input key={i} className="wa-var" placeholder={`Variable {{${i + 1}}}`} value={v}
                    onChange={(e) => setVars((s) => s.map((x, j) => (j === i ? e.target.value : x)))} />
                ))}
              </div>
            )}
            {templates.length === 0 && <div className="wa-hint">No approved templates found. Set META_WHATSAPP_WABA_ID, or create &amp; get a template approved in Meta.</div>}
          </>
        ) : (
          <>
            <label className="wa-lbl">Message</label>
            <textarea className="wa-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message…" />
            <div className="wa-hint">⚠️ Free-form text only reaches a user within 24 hours of their last message to you. To start a new conversation, use a template.</div>
          </>
        )}

        <button className="wa-send" disabled={sending || !canSend} onClick={send}>{sending ? "Sending…" : `Send${recipList.length > 1 ? ` to ${recipList.length}` : ""}`}</button>

        {results && (
          <div className="wa-results">
            {results.map((r, i) => (
              <div key={i} className={"wa-res " + (r.ok ? "ok" : "bad")}>
                <b>{r.to}</b> — {r.ok ? "sent ✓" : r.msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates reference */}
      {templates.length > 0 && (
        <div className="ad-card wa-card">
          <div className="wa-cardh">Approved templates ({templates.length})</div>
          <div className="wa-tpls">
            {templates.map((t) => (
              <div key={t.name + t.language} className="wa-tpl">
                <b>{t.name}</b>
                <span>{t.category} · {t.language}{t.vars ? ` · ${t.vars} var${t.vars > 1 ? "s" : ""}` : ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WaSetup({ reason }) {
  return (
    <div>
      <style>{WA_CSS}</style>
      <div className="ad-card wa-card">
        <div className="wa-cardh">Connect WhatsApp Business</div>
        <div className="wa-setup">
          <p><b>Not connected yet.</b> To send WhatsApp messages, MedXFlow talks to the WhatsApp Cloud API.</p>
          <ol>
            <li>In Meta, set up <b>WhatsApp</b> on your app and note the <b>phone-number ID</b> and <b>WhatsApp Business Account (WABA) ID</b>.</li>
            <li>Generate a token with <code>whatsapp_business_messaging</code> and <code>whatsapp_business_management</code>.</li>
            <li>Set these env vars: <code>META_WHATSAPP_TOKEN</code>, <code>META_WHATSAPP_PHONE_ID</code>, and (for templates) <code>META_WHATSAPP_WABA_ID</code>.</li>
            <li>To message someone new, use an <b>approved template</b>; test numbers only send to <b>allow-listed recipients</b>.</li>
          </ol>
          <p className="wa-hint">{reason || "Once set, this panel lets you send template and text messages."}</p>
        </div>
      </div>
    </div>
  );
}

const WA_CSS = `
.wa-card{margin-bottom:16px}
.wa-numhead{display:flex; align-items:center; gap:12px; padding:16px 18px; flex-wrap:wrap}
.wa-wa{font-weight:800; color:#25D366}
.wa-numhead b{font-size:16px; color:#E8EEF6}
.wa-num{font-size:14px; color:rgba(232,238,246,.7); font-variant-numeric:tabular-nums}
.wa-numerr{color:#E05A4E; font-size:13px}
.wa-q{font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:999px}
.wa-q-green{background:rgba(37,211,102,.18); color:#25D366} .wa-q-yellow{background:rgba(242,193,78,.18); color:#F2C14E}
.wa-q-red{background:rgba(224,90,78,.18); color:#E05A4E} .wa-q-unknown{background:rgba(207,224,242,.12); color:rgba(232,238,246,.6)}
.wa-compose{padding:16px 18px}
.wa-modes{display:flex; gap:8px; margin-bottom:14px}
.wa-modes button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.75); padding:8px 15px; border-radius:9px; font-size:13.5px; font-weight:600; cursor:pointer}
.wa-modes button.on{background:rgba(37,211,102,.16); border-color:rgba(37,211,102,.5); color:#25D366}
.wa-lbl{display:block; font-size:12.5px; font-weight:700; color:rgba(232,238,246,.7); margin:12px 0 6px}
.wa-lbl span{font-weight:400; color:rgba(232,238,246,.45)}
.wa-recip,.wa-text,.wa-var,.wa-sel{width:100%; background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; outline:none}
.wa-recip,.wa-text{resize:vertical}
.wa-sel{cursor:pointer}
.wa-count{font-size:12px; color:rgba(232,238,246,.55); margin-top:5px}
.wa-vars{display:flex; flex-direction:column; gap:8px; margin-top:10px}
.wa-hint{font-size:12.5px; color:rgba(232,238,246,.55); margin-top:8px; line-height:1.5}
.wa-hint code,.wa-setup code{background:rgba(207,224,242,.12); padding:1px 6px; border-radius:5px; font-size:12px; color:#7FD8CE}
.wa-send{margin-top:14px; background:#25D366; border:none; color:#062b16; border-radius:10px; padding:11px 22px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit}
.wa-send:disabled{opacity:.5; cursor:not-allowed}
.wa-results{margin-top:12px; display:flex; flex-direction:column; gap:6px}
.wa-res{font-size:13px; padding:8px 12px; border-radius:8px}
.wa-res.ok{background:rgba(37,211,102,.12); color:#7ee3a6} .wa-res.bad{background:rgba(224,90,78,.12); color:#E05A4E}
.wa-cardh{padding:14px 18px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.wa-tpls{display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; padding:14px 18px}
.wa-tpl{background:rgba(207,224,242,.04); border:1px solid rgba(207,224,242,.1); border-radius:10px; padding:11px 13px; display:flex; flex-direction:column; gap:3px}
.wa-tpl b{font-size:13.5px; color:#E8EEF6}
.wa-tpl span{font-size:11.5px; color:rgba(232,238,246,.55)}
.wa-setup{padding:16px} .wa-setup p{margin:0 0 10px; font-size:14px; color:rgba(232,238,246,.85); line-height:1.55}
.wa-setup ol{margin:0 0 10px; padding-left:20px; color:rgba(232,238,246,.75); font-size:13.5px; line-height:1.75}
`;
