import { useState, useEffect } from "react";

// LinkedIn organization page - status + immediate publish (caption + image).

async function call(pw, path, action, extra = {}) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

export default function LinkedIn({ pw }) {
  const [info, setInfo] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { call(pw, "linkedin", "info").then(setInfo).catch((e) => setInfo({ error: e.message })); }, [pw]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true); setResult(null);
      try {
        const d = await call(pw, "media", "upload", { dataUrl: reader.result, name: file.name });
        if (d.file) { setImageUrl(d.file.url); setFileName(file.name); } else setResult({ ok: false, error: d.error });
      } catch (e2) { setResult({ ok: false, error: e2.message }); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const publish = async () => {
    setBusy(true); setResult(null);
    const r = await call(pw, "linkedin", "publish", { caption, imageUrl });
    setBusy(false); setResult(r);
    if (r.ok) { setCaption(""); setImageUrl(""); setFileName(""); }
  };

  if (!info) return <div className="ad-empty">Connecting to LinkedIn…</div>;
  if (info.error) return <div className="ad-err">{info.error}</div>;

  if (info.configured === false) {
    return (
      <div className="li">
        <style>{LI_CSS}</style>
        <div className="ad-card li-card">
          <div className="li-h">Connect LinkedIn</div>
          <div className="li-setup">
            <p><b>Not connected yet.</b> To post to your LinkedIn organization page:</p>
            <ol>
              <li>Create an app at <code>developer.linkedin.com</code> and request the <b>Community Management API</b> product (needs LinkedIn approval).</li>
              <li>Add your organization and get an <b>access token</b> with <code>w_organization_social</code> (and <code>r_organization_admin</code>).</li>
              <li>Find your <b>organization ID</b> (the number in your company page admin URL).</li>
              <li>Set env vars <code>LINKEDIN_ACCESS_TOKEN</code> and <code>LINKEDIN_ORG_ID</code>.</li>
            </ol>
            <p className="li-hint">{info.reason}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="li">
      <style>{LI_CSS}</style>
      <div className="ad-card li-card">
        <div className="li-status">💼 <b>{info.org?.name || `Organization ${info.orgId}`}</b>{info.orgError && <span className="li-warn"> · read note: {info.orgError}</span>}</div>
      </div>
      <div className="ad-card li-card li-compose">
        <div className="li-h">Post to LinkedIn</div>
        <div className="li-form">
          <label>Caption</label>
          <textarea rows={5} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share an update…" />
          <label>Image (optional)</label>
          <div className="li-attach">
            <label className="li-attach-btn">📎 Attach image<input type="file" accept="image/*" hidden onChange={onFile} /></label>
            {uploading && <span className="li-attach-s">Uploading…</span>}
            {!uploading && fileName && <span className="li-attach-s">📷 {fileName}</span>}
            {!uploading && imageUrl && <button className="li-x" onClick={() => { setImageUrl(""); setFileName(""); }}>✕</button>}
          </div>
          {imageUrl && <img className="li-preview" src={imageUrl} alt="" />}
          <button className="li-post" disabled={busy || uploading || (!caption.trim() && !imageUrl)} onClick={publish}>{busy ? "Posting…" : "Post to LinkedIn"}</button>
          {result && <div className={"li-result " + (result.ok ? "ok" : "bad")}>{result.ok ? "Posted ✓" : (result.error || "Failed")}</div>}
        </div>
      </div>
    </div>
  );
}

const LI_CSS = `
.li-card{margin-bottom:16px}
.li-h{padding:14px 18px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:rgba(232,238,246,.7); border-bottom:1px solid rgba(207,224,242,.09)}
.li-status{padding:16px 18px; font-size:15px; color:#E8EEF6}
.li-status b{color:#fff}
.li-warn{font-size:12px; color:#f2c14e; font-weight:400}
.li-form{padding:16px 18px; display:flex; flex-direction:column; gap:8px; max-width:640px}
.li-form label{font-size:12.5px; font-weight:700; color:rgba(232,238,246,.6); margin-top:6px}
.li-form textarea{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px; resize:vertical}
.li-attach{display:flex; align-items:center; gap:10px}
.li-attach-btn{display:inline-flex; align-items:center; gap:6px; background:rgba(10,102,194,.14); border:1px dashed rgba(10,102,194,.5); color:#6aa9e0; border-radius:9px; padding:9px 14px; font-size:13px; font-weight:700; cursor:pointer}
.li-attach-s{font-size:12.5px; color:rgba(232,238,246,.7)}
.li-x{background:none; border:none; color:#E05A4E; cursor:pointer; font-size:13px}
.li-preview{margin-top:8px; max-width:100%; max-height:220px; width:auto; border-radius:10px; border:1px solid rgba(207,224,242,.14)}
.li-post{align-self:flex-start; margin-top:12px; background:#0A66C2; border:none; color:#fff; border-radius:10px; padding:11px 22px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit}
.li-post:disabled{opacity:.5; cursor:not-allowed}
.li-result{margin-top:10px; padding:9px 13px; border-radius:9px; font-size:13px}
.li-result.ok{background:rgba(61,220,201,.12); color:#7FD8CE} .li-result.bad{background:rgba(224,90,78,.12); color:#E05A4E}
.li-setup{padding:16px} .li-setup p{margin:0 0 10px; font-size:14px; color:rgba(232,238,246,.85); line-height:1.55}
.li-setup ol{margin:0 0 10px; padding-left:20px; color:rgba(232,238,246,.75); font-size:13.5px; line-height:1.75}
.li-setup code,.li-hint code{background:rgba(207,224,242,.12); padding:1px 6px; border-radius:5px; font-size:12px; color:#7FD8CE}
`;
