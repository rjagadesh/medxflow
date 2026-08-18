import { useState, useRef } from "react";

// AI Create - image + prompt → Veo video → YouTube, and the image → FB/IG.
// Starts a background job and polls its status.

async function call(pw, path, action, extra = {}) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

const CHANNELS = [
  { key: "youtube", label: "▶️ YouTube (video)" },
  { key: "facebook", label: "📘 Facebook (image)" },
  { key: "instagram", label: "📷 Instagram (image)" },
];

export default function AICreate({ pw }) {
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("revenue cycle management, RCM, AI agents");
  const [privacy, setPrivacy] = useState("unlisted");
  const [channels, setChannels] = useState(["youtube", "facebook", "instagram"]);
  const [job, setJob] = useState(null);
  const [err, setErr] = useState("");
  const pollRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true); setErr("");
      try {
        const d = await call(pw, "media", "upload", { dataUrl: reader.result, name: file.name });
        if (d.file) { setImageUrl(d.file.url); setFileName(file.name); } else setErr(d.error || "Upload failed");
      } catch (e2) { setErr(e2.message); } finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const toggle = (k) => setChannels((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  const start = async () => {
    setErr(""); setJob({ status: "queued", step: "starting…" });
    try {
      const d = await call(pw, "ai-create", "start", { imageUrl, prompt, title, tags, privacy, channels });
      if (!d.ok) { setErr(d.error || "Failed to start"); setJob(null); return; }
      clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        const j = await call(pw, "ai-create", "status", { id: d.id });
        setJob(j);
        if (j.status === "done" || j.status === "error") clearInterval(pollRef.current);
      }, 4000);
    } catch (e) { setErr(e.message); setJob(null); }
  };

  const running = job && job.status !== "done" && job.status !== "error";
  const canStart = (imageUrl || prompt.trim()) && channels.length && !uploading && !running;

  return (
    <div className="aic">
      <style>{AIC_CSS}</style>
      <div className="aic-intro">Give an image + a prompt. Veo generates a short video → posted to YouTube, and the image goes to Facebook/Instagram.</div>

      <div className="ad-card aic-card">
        <div className="aic-h">Create with AI</div>
        <div className="aic-form">
          <label>Source image {imageUrl ? "" : "(recommended)"}</label>
          <div className="aic-attach">
            <label className="aic-attach-btn">📎 Attach image<input type="file" accept="image/*" hidden onChange={onFile} /></label>
            {uploading && <span className="aic-s">Uploading…</span>}
            {!uploading && fileName && <span className="aic-s">📷 {fileName}</span>}
            {imageUrl && <button className="aic-x" onClick={() => { setImageUrl(""); setFileName(""); }}>✕</button>}
          </div>
          {imageUrl && <img className="aic-preview" src={imageUrl} alt="" />}

          <label>Prompt</label>
          <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the video, e.g. 'Slow cinematic zoom over a modern clinic front desk, calm and professional, MedXFlow branding'" />

          <label>Post to</label>
          <div className="aic-ch">
            {CHANNELS.map((c) => <button key={c.key} className={channels.includes(c.key) ? "on" : ""} onClick={() => toggle(c.key)}>{c.label}</button>)}
          </div>

          {channels.includes("youtube") && (
            <div className="aic-yt">
              <div><label>YouTube title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Uses the prompt if blank" /></div>
              <div><label>Tags</label><input value={tags} onChange={(e) => setTags(e.target.value)} /></div>
              <div><label>Privacy</label><select value={privacy} onChange={(e) => setPrivacy(e.target.value)}><option value="unlisted">Unlisted</option><option value="public">Public</option><option value="private">Private</option></select></div>
            </div>
          )}

          <button className="aic-go" disabled={!canStart} onClick={start}>✨ {running ? "Working…" : "Generate & Publish"}</button>
          {err && <div className="ad-err">{err}</div>}
        </div>
      </div>

      {job && (
        <div className="ad-card aic-card">
          <div className="aic-h">Job status</div>
          <div className="aic-job">
            <div className={"aic-status aic-" + job.status}>{job.status === "done" ? "✅ Done" : job.status === "error" ? "⚠️ Error" : "⏳ " + (job.step || job.status)}</div>
            {job.error && <div className="ad-err">{job.error}</div>}
            {job.results && (
              <div className="aic-results">
                {job.results.videoUrl && <div>🎬 Video generated</div>}
                {job.results.youtube && <div>YouTube: {job.results.youtube.ok ? <a href={job.results.youtube.url} target="_blank" rel="noreferrer">{job.results.youtube.url}</a> : `failed - ${job.results.youtube.error}`}</div>}
                {job.results.facebook && <div>Facebook: {job.results.facebook.ok ? "posted ✓" : `failed - ${job.results.facebook.error}`}</div>}
                {job.results.instagram && <div>Instagram: {job.results.instagram.ok ? "posted ✓" : `failed - ${job.results.instagram.error}`}</div>}
              </div>
            )}
            <div className="aic-note">Video generation runs in the background and can take a few minutes - you can leave this tab; the status keeps updating.</div>
          </div>
        </div>
      )}
    </div>
  );
}

const AIC_CSS = `
.aic-intro{font-size:13.5px; color:rgba(232,238,246,.65); margin-bottom:14px; line-height:1.55}
.aic-card{margin-bottom:16px}
.aic-h{padding:14px 18px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.aic-form{padding:16px 18px; display:flex; flex-direction:column; gap:8px; max-width:720px}
.aic-form label{font-size:12.5px; font-weight:700; color:rgba(232,238,246,.6); margin-top:6px}
.aic-form input,.aic-form textarea,.aic-form select{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; outline:none}
.aic-form textarea{resize:vertical}
.aic-attach{display:flex; align-items:center; gap:10px}
.aic-attach-btn{display:inline-flex; align-items:center; gap:6px; background:rgba(61,220,201,.1); border:1px dashed rgba(61,220,201,.45); color:#7FD8CE; border-radius:9px; padding:9px 14px; font-size:13px; font-weight:700; cursor:pointer}
.aic-s{font-size:12.5px; color:rgba(232,238,246,.7)} .aic-x{background:none;border:none;color:#E05A4E;cursor:pointer}
.aic-preview{margin-top:8px; max-width:100%; max-height:200px; width:auto; border-radius:10px; border:1px solid rgba(207,224,242,.14)}
.aic-ch{display:flex; gap:8px; flex-wrap:wrap}
.aic-ch button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); color:rgba(232,238,246,.75); padding:9px 14px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer}
.aic-ch button.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.5); color:#7FD8CE}
.aic-yt{display:grid; grid-template-columns:2fr 2fr 1fr; gap:10px; margin-top:4px}
.aic-yt>div{display:flex; flex-direction:column; gap:5px}
.aic-yt input,.aic-yt select{width:100%}
.aic-go{align-self:flex-start; margin-top:12px; background:linear-gradient(180deg,#3B7BFF,#1E52C8); border:none; color:#fff; border-radius:10px; padding:12px 24px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit}
.aic-go:disabled{opacity:.5; cursor:not-allowed}
.aic-job{padding:16px 18px; display:flex; flex-direction:column; gap:10px}
.aic-status{font-size:15px; font-weight:700; color:#E8EEF6}
.aic-done{color:#3DDCC9} .aic-error{color:#E05A4E}
.aic-results{display:flex; flex-direction:column; gap:6px; font-size:13.5px; color:rgba(232,238,246,.8)}
.aic-results a{color:#7FD8CE}
.aic-note{font-size:12px; color:rgba(232,238,246,.5); line-height:1.5}
@media(max-width:640px){.aic-yt{grid-template-columns:1fr}}
`;
