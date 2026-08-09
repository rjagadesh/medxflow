import { useState, useEffect, useRef } from "react";

// Media library - upload files into the portal, get a public URL to copy and
// paste anywhere (e.g. the Meta Publish image field).

async function call(pw, action, extra = {}) {
  const res = await fetch("/.netlify/functions/media", {
    method: "POST",
    headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

const fmtSize = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : n > 1024 ? (n / 1024).toFixed(0) + " KB" : n + " B");
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : "");
const isImg = (ct) => /^image\//.test(ct || "");

export default function Media({ pw }) {
  const [files, setFiles] = useState(null);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(0);
  const [copied, setCopied] = useState("");
  const inputRef = useRef(null);

  const load = () => call(pw, "list").then((d) => setFiles(d.files || [])).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [pw]);

  const uploadFiles = async (list) => {
    const arr = [...list];
    setUploading(arr.length); setErr("");
    for (const file of arr) {
      if (file.size > 15 * 1024 * 1024) { setErr(`${file.name} is over 15 MB — skipped.`); setUploading((n) => n - 1); continue; }
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const d = await call(pw, "upload", { dataUrl: reader.result, name: file.name });
            if (d.file) setFiles((f) => [d.file, ...(f || [])]);
            else setErr(d.error || "Upload failed");
          } catch (e) { setErr(e.message); }
          finally { setUploading((n) => n - 1); resolve(); }
        };
        reader.readAsDataURL(file);
      });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); };
  const copy = (url) => { navigator.clipboard?.writeText(url); setCopied(url); setTimeout(() => setCopied(""), 1500); };
  const del = async (id) => { if (!window.confirm("Delete this file?")) return; await call(pw, "delete", { id }); setFiles((f) => f.filter((x) => x.id !== id)); };

  return (
    <div className="ml">
      <style>{ML_CSS}</style>

      <div className="ml-drop" onDragOver={(e) => e.preventDefault()} onDrop={onDrop} onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)} />
        <div className="ml-drop-in">
          <div className="ml-drop-ic">⬆️</div>
          <b>Click to upload or drag files here</b>
          <span>Images, PDFs and more · up to 15 MB each{uploading ? ` · uploading ${uploading}…` : ""}</span>
        </div>
      </div>

      {err && <div className="ad-err" style={{ marginTop: 12 }}>{err}</div>}

      {!files ? (
        <div className="ad-empty">Loading…</div>
      ) : files.length === 0 ? (
        <div className="ad-empty">No files yet. Upload something to get a shareable URL.</div>
      ) : (
        <div className="ml-grid">
          {files.map((f) => (
            <div key={f.id} className="ml-card">
              <div className="ml-thumb">
                {isImg(f.contentType) ? <img src={f.url} alt={f.name} loading="lazy" /> : <span className="ml-fileic">📄</span>}
              </div>
              <div className="ml-meta">
                <b title={f.name}>{f.name}</b>
                <span>{fmtSize(f.size)} · {fmtDate(f.uploadedAt)}</span>
              </div>
              <div className="ml-actions">
                <button className="ml-btn ml-copy" onClick={() => copy(f.url)}>{copied === f.url ? "Copied ✓" : "📋 Copy URL"}</button>
                <a className="ml-btn" href={f.url} target="_blank" rel="noreferrer">Open ↗</a>
                <button className="ml-btn ml-del" onClick={() => del(f.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ML_CSS = `
.ml-drop{border:2px dashed rgba(61,220,201,.4); border-radius:16px; background:rgba(61,220,201,.05); padding:34px; text-align:center; cursor:pointer; transition:background .15s}
.ml-drop:hover{background:rgba(61,220,201,.1)}
.ml-drop-in{display:flex; flex-direction:column; align-items:center; gap:6px}
.ml-drop-ic{font-size:28px}
.ml-drop-in b{font-size:15px; color:#E8EEF6}
.ml-drop-in span{font-size:12.5px; color:rgba(232,238,246,.55)}
.ml-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; margin-top:18px}
.ml-card{background:rgba(207,224,242,.04); border:1px solid rgba(207,224,242,.1); border-radius:14px; overflow:hidden; display:flex; flex-direction:column}
.ml-thumb{height:150px; background:rgba(10,24,48,.5); display:grid; place-items:center; overflow:hidden}
.ml-thumb img{width:100%; height:100%; object-fit:cover}
.ml-fileic{font-size:44px; opacity:.7}
.ml-meta{padding:11px 13px 6px; display:flex; flex-direction:column; gap:3px; min-width:0}
.ml-meta b{font-size:13.5px; color:#E8EEF6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.ml-meta span{font-size:11.5px; color:rgba(232,238,246,.5)}
.ml-actions{display:flex; gap:6px; padding:8px 11px 12px; flex-wrap:wrap}
.ml-btn{background:rgba(207,224,242,.08); border:1px solid rgba(207,224,242,.16); color:#E8EEF6; border-radius:8px; padding:6px 10px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; text-decoration:none}
.ml-btn:hover{background:rgba(207,224,242,.16)}
.ml-copy{background:rgba(61,220,201,.14); border-color:rgba(61,220,201,.4); color:#7FD8CE}
.ml-del{color:#e88; border-color:rgba(224,90,78,.35)}
`;
