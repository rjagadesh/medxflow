import { useState, useEffect, useRef } from "react";

// Social content scheduler - upload an image + caption, pick channels
// (Facebook / Instagram / WhatsApp) and a date; a cron auto-posts it.

async function api(path, pw, action, extra = {}) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: "POST",
    headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

const CHANNELS = [
  { key: "facebook", label: "Facebook", ic: "📘" },
  { key: "instagram", label: "Instagram", ic: "📷" },
  { key: "linkedin", label: "LinkedIn", ic: "💼" },
  { key: "threads", label: "Threads", ic: "🧵" },
  { key: "gbp", label: "Google Business", ic: "📍" },
  { key: "telegram", label: "Telegram", ic: "✈️" },
  { key: "bluesky", label: "Bluesky", ic: "🦋" },
  { key: "mastodon", label: "Mastodon", ic: "🐘" },
  { key: "whatsapp", label: "WhatsApp", ic: "🟢" },
];
const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "");
const STATUS_COLOR = { scheduled: "#7FB3D5", posted: "#3DDCC9", partial: "#F2C14E", failed: "#E05A4E" };

export default function Scheduler({ pw }) {
  const [posts, setPosts] = useState(null);
  const [err, setErr] = useState("");

  // composer
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [channels, setChannels] = useState(["facebook", "instagram"]);
  const [waRecipients, setWaRecipients] = useState("");
  const [when, setWhen] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  const load = () => api("scheduler", pw, "list").then((d) => setPosts(d.posts || [])).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [pw]);

  // Live server (UTC) clock so you can schedule against the real server time.
  const [srv, setSrv] = useState(null);
  const [, tick] = useState(0);
  useEffect(() => {
    const sync = () => api("scheduler", pw, "time").then((d) => { if (d.now) setSrv({ base: Date.parse(d.now), local: Date.now() }); }).catch(() => {});
    sync();
    const s = setInterval(sync, 60000);
    const t = setInterval(() => tick((x) => x + 1), 1000);
    return () => { clearInterval(s); clearInterval(t); };
  }, [pw]);
  const serverNow = srv ? new Date(srv.base + (Date.now() - srv.local)) : null;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setErr("Image over 15 MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true); setErr("");
      try {
        const d = await api("media", pw, "upload", { dataUrl: reader.result, name: file.name });
        if (d.file) { setImageUrl(d.file.url); setFileName(file.name); } else setErr(d.error || "Upload failed");
      } catch (e2) { setErr(e2.message); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const toggleCh = (k) => setChannels((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  const schedule = async () => {
    setSaving(true); setErr(""); setMsg("");
    try {
      const d = await api("scheduler", pw, "create", {
        imageUrl, caption, channels,
        waRecipients: waRecipients.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
        scheduledAt: when ? new Date(when).toISOString() : new Date().toISOString(),
      });
      if (d.ok) {
        setMsg("Scheduled ✓");
        setImageUrl(""); setFileName(""); setCaption(""); setWaRecipients(""); setWhen("");
        if (fileRef.current) fileRef.current.value = "";
        load();
      } else setErr(d.error || "Failed");
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const postNow = async (id) => { setMsg("Posting…"); const d = await api("scheduler", pw, "postNow", { id }); setMsg(d.ok ? `Posted (${d.post?.status})` : (d.error || "Failed")); load(); };
  const del = async (id) => { if (!window.confirm("Delete this scheduled post?")) return; await api("scheduler", pw, "delete", { id }); setPosts((p) => p.filter((x) => x.id !== id)); };

  const needsWa = channels.includes("whatsapp");
  const canSave = channels.length && (caption.trim() || imageUrl) && (!channels.includes("instagram") || imageUrl) && !uploading;

  return (
    <div className="sc">
      <style>{SC_CSS}</style>

      <div className="sc-topbar">
        <div className="sc-title">🗓 Social Scheduler</div>
        <div className="sc-clock">
          <span className="sc-clock-lbl">🕒 Server time (UTC)</span>
          <span className="sc-clock-val">{serverNow ? serverNow.toUTCString().replace(" GMT", "") : "…"}</span>
          <span className="sc-clock-tz">You schedule in your local time · {tz}</span>
        </div>
      </div>

      {/* Composer */}
      <div className="ad-card sc-card sc-compose">
        <div className="sc-cardh">📅 Schedule a post</div>
        <div className="sc-form">
          <div className="sc-row2">
            <div className="sc-attach-col">
              <label className="sc-lbl">Image</label>
              {imageUrl
                ? <div className="sc-preview"><img src={imageUrl} alt="" /><button className="sc-remove" onClick={() => { setImageUrl(""); setFileName(""); }}>✕</button></div>
                : <label className="sc-attach">⬆️ Attach image<input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} /></label>}
              {uploading && <div className="sc-hint">Uploading…</div>}
              {fileName && <div className="sc-hint">📷 {fileName}</div>}
            </div>
            <div className="sc-cap-col">
              <label className="sc-lbl">Caption</label>
              <textarea className="sc-cap" rows={5} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write your caption…" />
            </div>
          </div>

          <label className="sc-lbl">Post to</label>
          <div className="sc-channels">
            {CHANNELS.map((c) => (
              <button key={c.key} className={"sc-ch" + (channels.includes(c.key) ? " on" : "")} onClick={() => toggleCh(c.key)}>
                {c.ic} {c.label}
              </button>
            ))}
          </div>

          {needsWa && (
            <>
              <label className="sc-lbl">WhatsApp recipients <span>— numbers, one per line (must be opted-in / within 24h)</span></label>
              <textarea className="sc-wa" rows={2} value={waRecipients} onChange={(e) => setWaRecipients(e.target.value)} placeholder={"+14695551234\n+919876543210"} />
            </>
          )}

          <label className="sc-lbl">When to post</label>
          <input className="sc-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          <div className="sc-hint">Uses your local time (converted to the server's UTC on save). The scheduler runs every 5 minutes, so a post goes out within ~5 min of its time.</div>

          <div className="sc-actions">
            <button className="sc-btn sc-primary" disabled={saving || !canSave} onClick={schedule}>{saving ? "Scheduling…" : "📅 Schedule post"}</button>
            {msg && <span className="sc-msg">{msg}</span>}
          </div>
          {err && <div className="ad-err">{err}</div>}
        </div>
      </div>

      {/* Scheduled queue */}
      <div className="ad-card sc-card">
        <div className="sc-cardh">Scheduled &amp; posted</div>
        {!posts ? <div className="ad-empty">Loading…</div>
          : posts.length === 0 ? <div className="ad-empty">Nothing scheduled yet.</div>
          : (
            <div className="sc-list">
              {posts.map((p) => (
                <div key={p.id} className="sc-item">
                  <div className="sc-thumb">{p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <span>📝</span>}</div>
                  <div className="sc-body">
                    <div className="sc-cap-txt">{p.caption || <em>(no caption)</em>}</div>
                    <div className="sc-badges">
                      {p.channels.map((c) => <span key={c} className="sc-badge">{(CHANNELS.find((x) => x.key === c) || {}).ic} {c}</span>)}
                    </div>
                    <div className="sc-when-txt">🕒 {fmt(p.scheduledAt)}</div>
                    {p.status !== "scheduled" && p.results && (
                      <div className="sc-results">
                        {Object.entries(p.results).filter(([k]) => p.channels.includes(k)).map(([k, v]) => (
                          <span key={k} className={"sc-res " + (v.ok ? "ok" : "bad")}>{k}: {v.ok ? "✓" : (v.error || "failed")}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sc-side">
                    <span className="sc-status" style={{ color: STATUS_COLOR[p.status] || "#8aa" }}>{p.status}</span>
                    {p.status === "scheduled" && <button className="sc-btn sc-sm" onClick={() => postNow(p.id)}>Post now</button>}
                    <button className="sc-btn sc-sm sc-del" onClick={() => del(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

const SC_CSS = `
.sc-topbar{display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px; flex-wrap:wrap}
.sc-title{font-size:17px; font-weight:800; color:#E8EEF6}
.sc-clock{display:flex; flex-direction:column; align-items:flex-end; gap:1px; background:rgba(61,220,201,.08); border:1px solid rgba(61,220,201,.25); border-radius:11px; padding:8px 14px}
.sc-clock-lbl{font-size:11px; font-weight:700; color:#7FD8CE; text-transform:uppercase; letter-spacing:.04em}
.sc-clock-val{font-size:15px; font-weight:800; color:#E8EEF6; font-variant-numeric:tabular-nums}
.sc-clock-tz{font-size:11px; color:rgba(232,238,246,.5)}
.sc-card{margin-bottom:16px}
.sc-cardh{padding:14px 18px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.sc-form{padding:16px 18px; display:flex; flex-direction:column; gap:6px}
.sc-lbl{font-size:12.5px; font-weight:700; color:rgba(232,238,246,.7); margin-top:10px}
.sc-lbl span{font-weight:400; color:rgba(232,238,246,.45)}
.sc-row2{display:grid; grid-template-columns:200px 1fr; gap:16px; align-items:start}
.sc-attach{display:flex; align-items:center; justify-content:center; height:150px; border:2px dashed rgba(61,220,201,.4); background:rgba(61,220,201,.05); border-radius:12px; color:#7FD8CE; font-size:13px; font-weight:700; cursor:pointer; text-align:center; margin-top:6px}
.sc-attach:hover{background:rgba(61,220,201,.1)}
.sc-preview{position:relative; margin-top:6px; height:150px; border-radius:12px; overflow:hidden; border:1px solid rgba(207,224,242,.14)}
.sc-preview img{width:100%; height:100%; object-fit:cover}
.sc-remove{position:absolute; top:6px; right:6px; background:rgba(10,24,48,.8); border:none; color:#fff; width:24px; height:24px; border-radius:50%; cursor:pointer}
.sc-cap,.sc-wa,.sc-when{width:100%; background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; outline:none; resize:vertical}
.sc-cap-col{display:flex; flex-direction:column}
.sc-channels{display:flex; gap:8px; flex-wrap:wrap; margin-top:6px}
.sc-ch{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); color:rgba(232,238,246,.75); padding:9px 15px; border-radius:9px; font-size:13.5px; font-weight:600; cursor:pointer}
.sc-ch.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.5); color:#7FD8CE}
.sc-when{max-width:280px}
.sc-hint{font-size:12px; color:rgba(232,238,246,.5); margin-top:5px}
.sc-actions{display:flex; align-items:center; gap:12px; margin-top:14px}
.sc-btn{background:rgba(207,224,242,.08); border:1px solid rgba(207,224,242,.16); color:#E8EEF6; border-radius:9px; padding:8px 14px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit}
.sc-btn:hover{background:rgba(207,224,242,.16)}
.sc-primary{background:#3DDCC9; border-color:#3DDCC9; color:#062b28; font-weight:800; padding:11px 22px; font-size:14px}
.sc-primary:disabled{opacity:.5; cursor:not-allowed}
.sc-sm{padding:6px 11px; font-size:12px}
.sc-del{color:#e88; border-color:rgba(224,90,78,.35)}
.sc-msg{font-size:13px; color:#7FD8CE}
.sc-list{display:flex; flex-direction:column}
.sc-item{display:flex; gap:14px; padding:14px 18px; border-bottom:1px solid rgba(207,224,242,.07)}
.sc-thumb{width:70px; height:70px; flex:none; border-radius:10px; overflow:hidden; background:rgba(10,24,48,.5); display:grid; place-items:center; font-size:26px}
.sc-thumb img{width:100%; height:100%; object-fit:cover}
.sc-body{flex:1; min-width:0}
.sc-cap-txt{font-size:14px; color:#E8EEF6; line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}
.sc-badges{display:flex; gap:6px; margin-top:6px; flex-wrap:wrap}
.sc-badge{font-size:11px; background:rgba(207,224,242,.08); border:1px solid rgba(207,224,242,.14); color:rgba(232,238,246,.7); padding:2px 8px; border-radius:999px}
.sc-when-txt{font-size:12px; color:rgba(232,238,246,.55); margin-top:6px}
.sc-results{display:flex; gap:8px; flex-wrap:wrap; margin-top:6px}
.sc-res{font-size:11px; padding:2px 8px; border-radius:6px}
.sc-res.ok{background:rgba(61,220,201,.14); color:#7FD8CE} .sc-res.bad{background:rgba(224,90,78,.14); color:#E05A4E}
.sc-side{display:flex; flex-direction:column; align-items:flex-end; gap:7px; flex:none}
.sc-status{font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.04em}
@media(max-width:720px){.sc-row2{grid-template-columns:1fr}.sc-item{flex-wrap:wrap}}
`;
