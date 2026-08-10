import { useState, useEffect } from "react";

// YouTube portal — channel stats, upload a video (title/description/tags/
// privacy from a video URL), and the list of uploaded videos.

async function call(pw, path, action, extra = {}) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}
const num = (n) => (n == null ? "—" : Number(n).toLocaleString());
const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

export default function YouTube({ pw }) {
  const [chan, setChan] = useState(null);
  const [videos, setVideos] = useState(null);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("revenue cycle management, RCM, AI agents, medical billing");
  const [privacy, setPrivacy] = useState("unlisted");
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const loadVideos = () => call(pw, "youtube", "videos").then((d) => setVideos(d.videos || [])).catch(() => setVideos([]));
  useEffect(() => {
    call(pw, "youtube", "channel").then(setChan).catch((e) => setChan({ error: e.message }));
    loadVideos();
  }, [pw]);

  const upload = async () => {
    if (!videoUrl.trim()) { setErr("A video URL is required (a public .mp4)."); return; }
    setBusy(true); setErr(""); setResult(null);
    try {
      const d = await call(pw, "youtube", "upload", { title, description, tags, privacy, videoUrl });
      setResult(d);
      if (d.ok) { setTitle(""); setDescription(""); setVideoUrl(""); setTimeout(loadVideos, 1500); }
    } catch (e) { setResult({ ok: false, error: e.message }); }
    finally { setBusy(false); }
  };

  if (!chan) return <div className="ad-empty">Connecting to YouTube…</div>;
  if (chan.error) return <div className="ad-err">{chan.error}</div>;
  if (chan.configured === false) {
    return (
      <div className="yt">
        <style>{YT_CSS}</style>
        <div className="ad-card yt-card"><div className="yt-h">Connect YouTube</div>
          <div className="yt-setup"><p><b>Not connected.</b> Set <code>YOUTUBE_CLIENT_ID</code>, <code>YOUTUBE_CLIENT_SECRET</code> and <code>YOUTUBE_REFRESH_TOKEN</code> (OAuth, scope <code>youtube.upload</code>).</p><p className="yt-hint">{chan.reason}</p></div>
        </div>
      </div>
    );
  }

  const c = chan.channel;
  return (
    <div className="yt">
      <style>{YT_CSS}</style>

      {c && (
        <div className="ad-card yt-card yt-chan">
          {c.thumbnail && <img className="yt-avatar" src={c.thumbnail} alt="" />}
          <div className="yt-chan-b">
            <b>{c.title}</b>
            <div className="yt-stats">
              <span><b>{num(c.subscribers)}</b> subscribers</span>
              <span><b>{num(c.videos)}</b> videos</span>
              <span><b>{num(c.views)}</b> views</span>
            </div>
          </div>
        </div>
      )}

      <div className="ad-card yt-card yt-upload">
        <div className="yt-h">Upload a video</div>
        <div className="yt-form">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="MedXFlow — AI Revenue Cycle Management" />
          <label>Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's the video about? Links and keywords help discovery." />
          <label>Tags <span>— comma-separated keywords</span></label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
          <div className="yt-row">
            <div><label>Privacy</label>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="yt-grow"><label>Video URL <span>— a public .mp4 (e.g. from Media)</span></label>
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://medxflow.ai/rcm-process.mp4" />
            </div>
          </div>
          <button className="yt-btn" disabled={busy || !videoUrl.trim()} onClick={upload}>{busy ? "Uploading…" : "▶ Upload to YouTube"}</button>
          {err && <div className="ad-err">{err}</div>}
          {result && (
            <div className={"yt-result " + (result.ok ? "ok" : "bad")}>
              {result.ok ? <>Uploaded ✓ <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a></> : (result.error || "Failed")}
            </div>
          )}
        </div>
      </div>

      <div className="ad-card yt-card">
        <div className="yt-h">Uploaded videos {videos ? `(${videos.length})` : ""}</div>
        {!videos ? <div className="ad-empty">Loading…</div>
          : videos.length === 0 ? <div className="ad-empty">No videos yet — upload one above.</div>
          : (
            <div className="yt-grid">
              {videos.map((v) => (
                <a key={v.id} className="yt-vid" href={v.url} target="_blank" rel="noreferrer">
                  {v.thumbnail && <img src={v.thumbnail} alt="" loading="lazy" />}
                  <div className="yt-vid-b">
                    <b>{v.title}</b>
                    <span>👁 {num(v.views)} · 👍 {num(v.likes)} · {fmt(v.publishedAt)}{v.privacy && v.privacy !== "public" ? ` · ${v.privacy}` : ""}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

const YT_CSS = `
.yt-card{margin-bottom:16px}
.yt-h{padding:14px 18px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.yt-chan{display:flex; align-items:center; gap:16px; padding:16px 18px}
.yt-avatar{width:56px; height:56px; border-radius:50%; flex:none}
.yt-chan-b b{font-size:18px; color:#fff}
.yt-stats{display:flex; gap:18px; margin-top:6px; font-size:13px; color:rgba(232,238,246,.6)}
.yt-stats b{color:#E8EEF6}
.yt-form{padding:16px 18px; display:flex; flex-direction:column; gap:8px; max-width:720px}
.yt-form label{font-size:12.5px; font-weight:700; color:rgba(232,238,246,.6); margin-top:6px}
.yt-form label span{font-weight:400; color:rgba(232,238,246,.45)}
.yt-form input,.yt-form textarea,.yt-form select{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; outline:none}
.yt-form textarea{resize:vertical}
.yt-row{display:flex; gap:12px; align-items:flex-end}
.yt-row>div{display:flex; flex-direction:column; gap:6px}
.yt-grow{flex:1}
.yt-grow input{width:100%}
.yt-btn{align-self:flex-start; margin-top:12px; background:#FF0000; border:none; color:#fff; border-radius:10px; padding:11px 22px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit}
.yt-btn:disabled{opacity:.5; cursor:not-allowed}
.yt-result{margin-top:10px; padding:9px 13px; border-radius:9px; font-size:13px}
.yt-result.ok{background:rgba(61,220,201,.12); color:#7FD8CE} .yt-result.bad{background:rgba(224,90,78,.12); color:#E05A4E}
.yt-result a{color:#7FD8CE}
.yt-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; padding:16px 18px}
.yt-vid{background:rgba(207,224,242,.04); border:1px solid rgba(207,224,242,.1); border-radius:12px; overflow:hidden; text-decoration:none; color:inherit; transition:transform .15s}
.yt-vid:hover{transform:translateY(-2px)}
.yt-vid img{width:100%; aspect-ratio:16/9; object-fit:cover; display:block}
.yt-vid-b{padding:10px 12px}
.yt-vid-b b{font-size:13.5px; color:#E8EEF6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}
.yt-vid-b span{font-size:11.5px; color:rgba(232,238,246,.55); display:block; margin-top:5px}
.yt-setup{padding:16px} .yt-setup p{margin:0 0 8px; font-size:14px; color:rgba(232,238,246,.85); line-height:1.55}
.yt-setup code,.yt-hint code{background:rgba(207,224,242,.12); padding:1px 6px; border-radius:5px; font-size:12px; color:#7FD8CE}
`;
