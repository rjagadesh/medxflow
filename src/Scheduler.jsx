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
  { key: "youtube", label: "YouTube", ic: "▶️" },
  { key: "tiktok", label: "TikTok", ic: "🎵" },
  { key: "telegram", label: "Telegram", ic: "✈️" },
  { key: "bluesky", label: "Bluesky", ic: "🦋" },
  { key: "mastodon", label: "Mastodon", ic: "🐘" },
  { key: "reddit", label: "Reddit", ic: "👽" },
  { key: "tumblr", label: "Tumblr", ic: "📓" },
  { key: "discord", label: "Discord", ic: "💬" },
  { key: "whatsapp", label: "WhatsApp", ic: "🟢" },
];
const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "");
const STATUS_COLOR = { scheduled: "#7FB3D5", posted: "#3DDCC9", partial: "#F2C14E", failed: "#E05A4E" };

// Channels a bulk (image + caption) post can go to without extra per-post
// fields. Video-only (youtube/tiktok) and whatsapp (needs recipients) excluded.
const BULK_CHANNELS = CHANNELS.filter((c) => !["youtube", "tiktok", "whatsapp"].includes(c.key));

// ---- Browser-side ZIP reader (central-directory based, no dependency) -------
async function unzip(buf) {
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= 0; i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
  if (eocd < 0) throw new Error("Not a valid ZIP file.");
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const entries = [];
  for (let i = 0; i < count && dv.getUint32(off, true) === 0x02014b50; i++) {
    const method = dv.getUint16(off + 10, true);
    const compSize = dv.getUint32(off + 20, true);
    const nameLen = dv.getUint16(off + 28, true);
    const extraLen = dv.getUint16(off + 30, true);
    const commentLen = dv.getUint16(off + 32, true);
    const localOff = dv.getUint32(off + 42, true);
    const name = new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nameLen));
    entries.push({ name, method, compSize, localOff });
    off += 46 + nameLen + extraLen + commentLen;
  }
  const out = [];
  for (const e of entries) {
    if (e.name.endsWith("/") || e.name.startsWith("__MACOSX")) continue;
    const lnameLen = dv.getUint16(e.localOff + 26, true);
    const lextraLen = dv.getUint16(e.localOff + 28, true);
    const dataStart = e.localOff + 30 + lnameLen + lextraLen;
    const comp = u8.subarray(dataStart, dataStart + e.compSize);
    let bytes;
    if (e.method === 0) bytes = comp;
    else if (e.method === 8) bytes = new Uint8Array(await new Response(new Blob([comp]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
    else continue;
    out.push({ name: e.name, bytes });
  }
  return out;
}

const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };

// Group ZIP entries by top-level folder → { folder, caption, imageBytes, mime }.
function buildPosts(entries) {
  const folders = {};
  for (const e of entries) {
    const parts = e.name.split("/");
    if (parts.length < 2) continue; // skip top-level files like INDEX.txt
    const folder = parts[0];
    const file = parts[parts.length - 1].toLowerCase();
    const ext = file.split(".").pop();
    (folders[folder] = folders[folder] || {});
    if (file === "description.txt" || file === "caption.txt") folders[folder].caption = cleanCaption(new TextDecoder().decode(e.bytes));
    else if (MIME[ext]) { folders[folder].imageBytes = e.bytes; folders[folder].imageName = parts[parts.length - 1]; folders[folder].mime = MIME[ext]; }
  }
  return Object.keys(folders).sort().map((f) => ({ folder: f, ...folders[f] })).filter((p) => p.imageBytes || p.caption);
}

// Strip markdown headings/bold so captions read cleanly on social (keeps
// #hashtags and emojis).
function cleanCaption(md) {
  return (md || "").replace(/\r/g, "").replace(/^#{1,6}[ \t]+/gm, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\n{3,}/g, "\n\n").trim();
}

const bytesToDataUrl = (bytes, mime) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(new Blob([bytes], { type: mime })); });

// Compute the datetime for each post: `perDay` posts each day starting at
// `firstTime`, spaced `gapHours` apart, beginning on `startDate` (local time).
function scheduleTimes(count, startDate, firstTime, perDay, gapHours) {
  const [hh, mm] = firstTime.split(":").map(Number);
  const times = [];
  for (let i = 0; i < count; i++) {
    const day = Math.floor(i / perDay), slot = i % perDay;
    const d = new Date(`${startDate}T00:00:00`);
    d.setDate(d.getDate() + day);
    d.setHours(hh + slot * gapHours, mm, 0, 0);
    times.push(d);
  }
  return times;
}

function BulkZip({ pw, onDone }) {
  const [posts, setPosts] = useState(null); // parsed [{folder, caption, imageBytes, mime}]
  const [zipName, setZipName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [channels, setChannels] = useState(["facebook", "instagram"]);
  const [startDate, setStartDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [firstTime, setFirstTime] = useState("09:00");
  const [perDay, setPerDay] = useState(2);
  const [gapHours, setGapHours] = useState(4);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, note: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const zipRef = useRef(null);

  const onZip = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true); setErr(""); setMsg(""); setPosts(null);
    try {
      const buf = await file.arrayBuffer();
      const parsed = buildPosts(await unzip(buf));
      if (!parsed.length) throw new Error("No posts found. Expected folders each containing image + description.txt.");
      setPosts(parsed); setZipName(file.name);
    } catch (e2) { setErr(e2.message); }
    finally { setParsing(false); }
  };

  const toggleCh = (k) => setChannels((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  const times = posts ? scheduleTimes(posts.length, startDate, firstTime, Math.max(1, perDay), Math.max(0, gapHours)) : [];

  const scheduleAll = async () => {
    if (!posts?.length || !channels.length) return;
    setRunning(true); setErr(""); setMsg("");
    let created = 0;
    try {
      for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        setProgress({ done: i, total: posts.length, note: p.folder });
        let imageUrl = "";
        if (p.imageBytes) {
          const dataUrl = await bytesToDataUrl(p.imageBytes, p.mime);
          const up = await api("media", pw, "upload", { dataUrl, name: p.imageName || `${p.folder}.png` });
          if (!up.file) throw new Error(`Image upload failed for ${p.folder}: ${up.error || "unknown"}`);
          imageUrl = up.file.url;
        }
        const d = await api("scheduler", pw, "create", { imageUrl, caption: p.caption || "", channels, scheduledAt: times[i].toISOString() });
        if (!d.ok) throw new Error(`Schedule failed for ${p.folder}: ${d.error || "unknown"}`);
        created++;
      }
      setProgress({ done: posts.length, total: posts.length, note: "" });
      setMsg(`Scheduled ${created} posts ✓`);
      setPosts(null); setZipName(""); if (zipRef.current) zipRef.current.value = "";
      onDone?.();
    } catch (e) { setErr(`${e.message} (${created} scheduled before this)`); }
    finally { setRunning(false); }
  };

  return (
    <div className="ad-card sc-card">
      <div className="sc-cardh">📦 Bulk upload — schedule a whole ZIP</div>
      <div className="sc-form">
        {!posts ? (
          <>
            <div className="sc-hint" style={{ marginTop: 0 }}>Upload one ZIP where each folder holds an <code>image</code> + a <code>description.txt</code>. Each folder becomes one scheduled post.</div>
            <label className="sc-zip">{parsing ? "Reading ZIP…" : "📦 Choose ZIP file"}<input ref={zipRef} type="file" accept=".zip,application/zip" hidden onChange={onZip} disabled={parsing} /></label>
          </>
        ) : (
          <>
            <div className="sc-zip-loaded">✅ <b>{zipName}</b> — {posts.length} posts found</div>

            <label className="sc-lbl">Post to</label>
            <div className="sc-channels">
              {BULK_CHANNELS.map((c) => (
                <button key={c.key} className={"sc-ch" + (channels.includes(c.key) ? " on" : "")} onClick={() => toggleCh(c.key)}>{c.ic} {c.label}</button>
              ))}
            </div>

            <div className="sc-bulk-grid">
              <div><label className="sc-lbl" style={{ marginTop: 0 }}>Start date</label><input className="sc-when" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div><label className="sc-lbl" style={{ marginTop: 0 }}>First post time</label><input className="sc-when" type="time" value={firstTime} onChange={(e) => setFirstTime(e.target.value)} /></div>
              <div><label className="sc-lbl" style={{ marginTop: 0 }}>Posts per day</label><input className="sc-when" type="number" min="1" max="12" value={perDay} onChange={(e) => setPerDay(Math.max(1, +e.target.value || 1))} /></div>
              <div><label className="sc-lbl" style={{ marginTop: 0 }}>Hours between posts</label><input className="sc-when" type="number" min="1" max="12" value={gapHours} onChange={(e) => setGapHours(Math.max(1, +e.target.value || 1))} /></div>
            </div>
            <div className="sc-hint">{posts.length} posts · {perDay}/day → spans {Math.ceil(posts.length / perDay)} days ({fmt(times[0])} → {fmt(times[times.length - 1])}), your local time.</div>

            <label className="sc-lbl">Preview</label>
            <div className="sc-bulk-list">
              {posts.map((p, i) => (
                <div key={p.folder} className="sc-bulk-item">
                  <div className="sc-thumb sc-bulk-thumb">{p.imageBytes ? <img src={URL.createObjectURL(new Blob([p.imageBytes], { type: p.mime }))} alt="" /> : <span>📝</span>}</div>
                  <div className="sc-bulk-cap"><b>{p.folder.replace(/^\d+_/, "").replace(/_/g, " ")}</b><span>{(p.caption || "").slice(0, 90)}…</span></div>
                  <div className="sc-bulk-time">🕒 {fmt(times[i])}</div>
                </div>
              ))}
            </div>

            {running && <div className="sc-prog"><div className="sc-prog-bar"><div style={{ width: `${(progress.done / progress.total) * 100}%` }} /></div><span>{progress.done}/{progress.total} {progress.note}</span></div>}

            <div className="sc-actions">
              <button className="sc-btn sc-primary" disabled={running || !channels.length} onClick={scheduleAll}>{running ? "Scheduling…" : `📅 Schedule all ${posts.length} posts`}</button>
              <button className="sc-btn" disabled={running} onClick={() => { setPosts(null); setZipName(""); if (zipRef.current) zipRef.current.value = ""; }}>Cancel</button>
              {msg && <span className="sc-msg">{msg}</span>}
            </div>
          </>
        )}
        {err && <div className="ad-err">{err}</div>}
        {msg && !posts && <div className="sc-msg" style={{ marginTop: 8 }}>{msg}</div>}
      </div>
    </div>
  );
}

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
  const [videoUrl, setVideoUrl] = useState("");
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
        imageUrl, caption, channels, videoUrl,
        waRecipients: waRecipients.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
        scheduledAt: when ? new Date(when).toISOString() : new Date().toISOString(),
      });
      if (d.ok) {
        setMsg("Scheduled ✓");
        setImageUrl(""); setFileName(""); setCaption(""); setWaRecipients(""); setVideoUrl(""); setWhen("");
        if (fileRef.current) fileRef.current.value = "";
        load();
      } else setErr(d.error || "Failed");
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const postNow = async (id) => { setMsg("Posting…"); const d = await api("scheduler", pw, "postNow", { id }); setMsg(d.ok ? `Posted (${d.post?.status})` : (d.error || "Failed")); load(); };
  const del = async (id) => { if (!window.confirm("Delete this scheduled post?")) return; await api("scheduler", pw, "delete", { id }); setPosts((p) => p.filter((x) => x.id !== id)); };

  const needsWa = channels.includes("whatsapp");
  const needsVideo = channels.includes("youtube") || channels.includes("tiktok");
  const canSave = channels.length && (caption.trim() || imageUrl) && (!channels.includes("instagram") || imageUrl) && (!needsVideo || videoUrl.trim()) && !uploading;

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

      {/* Bulk ZIP upload */}
      <BulkZip pw={pw} onDone={load} />

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

          {needsVideo && (
            <>
              <label className="sc-lbl">Video URL <span>— YouTube uploads a video; paste a public .mp4 link. Caption becomes the title + description.</span></label>
              <input className="sc-when" style={{ maxWidth: "100%" }} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…/video.mp4" />
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
.sc-zip{display:flex; align-items:center; justify-content:center; height:70px; border:2px dashed rgba(61,220,201,.4); background:rgba(61,220,201,.05); border-radius:12px; color:#7FD8CE; font-size:14px; font-weight:700; cursor:pointer; margin-top:8px}
.sc-zip:hover{background:rgba(61,220,201,.1)}
.sc-zip-loaded{font-size:14px; color:#E8EEF6; padding:6px 0 4px}
.sc-zip-loaded b{color:#7FD8CE}
.sc-bulk-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:10px}
.sc-bulk-grid .sc-when{max-width:100%; width:100%}
.sc-bulk-list{display:flex; flex-direction:column; gap:2px; max-height:300px; overflow-y:auto; border:1px solid rgba(207,224,242,.1); border-radius:10px; margin-top:6px}
.sc-bulk-item{display:flex; gap:12px; align-items:center; padding:8px 12px; border-bottom:1px solid rgba(207,224,242,.06)}
.sc-bulk-thumb{width:44px; height:44px; border-radius:8px}
.sc-bulk-cap{flex:1; min-width:0; display:flex; flex-direction:column; gap:2px}
.sc-bulk-cap b{font-size:13px; color:#E8EEF6}
.sc-bulk-cap span{font-size:11.5px; color:rgba(232,238,246,.5); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.sc-bulk-time{font-size:11.5px; color:rgba(127,179,213,.9); white-space:nowrap; flex:none}
.sc-prog{display:flex; align-items:center; gap:10px; margin-top:12px}
.sc-prog-bar{flex:1; height:8px; background:rgba(207,224,242,.1); border-radius:99px; overflow:hidden}
.sc-prog-bar div{height:100%; background:#3DDCC9; transition:width .2s}
.sc-prog span{font-size:12px; color:rgba(232,238,246,.7); white-space:nowrap}
@media(max-width:720px){.sc-row2{grid-template-columns:1fr}.sc-item{flex-wrap:wrap}.sc-bulk-grid{grid-template-columns:1fr 1fr}}
`;
