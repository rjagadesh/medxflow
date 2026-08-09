import { useState, useEffect, useCallback } from "react";

// Meta Business Suite tab — Facebook Page + Instagram, via the Graph API
// (server function netlify/functions/meta.mjs). Four sub-panels: Insights,
// Inbox (read/reply to DMs), Publish, Ads. Shows setup guidance until the
// Page tokens are configured.

const SUBS = [
  { key: "insights", label: "📊 Insights" },
  { key: "inbox", label: "💬 Inbox" },
  { key: "publish", label: "✍️ Publish" },
  { key: "ads", label: "📈 Ads" },
];

async function call(pw, action, extra = {}) {
  const res = await fetch("/.netlify/functions/meta", {
    method: "POST",
    headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

const num = (n) => (n == null ? "—" : Number(n).toLocaleString());

export default function Meta({ pw }) {
  const [sub, setSub] = useState("insights");
  const [overview, setOverview] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    call(pw, "overview").then(setOverview).catch((e) => setErr(e.message));
  }, [pw]);

  if (err) return <div className="ad-err">{err}</div>;
  if (!overview) return <div className="ad-empty">Connecting to Meta…</div>;

  if (overview.configured === false) return <MetaSetup reason={overview.reason} />;

  return (
    <div>
      <style>{CSS}</style>
      <div className="mt-subnav">
        {SUBS.filter((s) => (s.key === "ads" ? overview.hasAds !== false : true)).map((s) => (
          <button key={s.key} className={sub === s.key ? "on" : ""} onClick={() => setSub(s.key)}>{s.label}</button>
        ))}
      </div>
      {sub === "insights" && <Insights ov={overview} />}
      {sub === "inbox" && <Inbox pw={pw} />}
      {sub === "publish" && <Publish pw={pw} hasIg={overview.hasIg} />}
      {sub === "ads" && <Ads pw={pw} />}
    </div>
  );
}

function MetaSetup({ reason }) {
  return (
    <div>
      <style>{CSS}</style>
      <div className="ad-card seo-card">
        <div className="seo-card-h">Connect Meta Business Suite</div>
        <div className="mt-setup">
          <p><b>Not connected yet.</b> Meta Business Suite can't be embedded directly, so this tab reads Facebook &amp; Instagram through the Meta Graph API. To connect:</p>
          <ol>
            <li>Create a <b>Meta App</b> at <code>developers.facebook.com</code> (Business type) and add the products: Facebook Login, Instagram Graph API, Messenger, Marketing API.</li>
            <li>Request &amp; get <b>App Review</b> for: <code>pages_read_engagement</code>, <code>pages_manage_posts</code>, <code>pages_messaging</code>, <code>instagram_basic</code>, <code>instagram_manage_messages</code>, <code>instagram_content_publish</code>, <code>ads_read</code>, <code>business_management</code>.</li>
            <li>Generate a <b>long-lived Page access token</b> for your MedXFlow Page, and note the linked <b>Instagram Business account ID</b> and <b>ad account ID</b>.</li>
            <li>Set these Netlify env vars: <code>META_PAGE_ID</code>, <code>META_PAGE_TOKEN</code>, and optionally <code>META_IG_ID</code>, <code>META_AD_ACCOUNT_ID</code>.</li>
          </ol>
          <p className="seo-hint">{reason || "Once set, this panel shows insights, DMs, publishing and ad stats automatically."}</p>
        </div>
      </div>
    </div>
  );
}

function Insights({ ov }) {
  return (
    <div>
      {ov.page ? (
        <div className="ad-card seo-card">
          <div className="seo-card-h">📘 Facebook Page — {ov.page.name}</div>
          <div className="ad-stats mt-stats">
            <div className="ad-stat"><b>{num(ov.page.followers ?? ov.page.fans)}</b><span>Followers</span></div>
            <div className="ad-stat"><b>{num(ov.page.impressions28)}</b><span>Impressions (28d)</span></div>
            <div className="ad-stat"><b>{num(ov.page.engagements28)}</b><span>Engagements (28d)</span></div>
            <div className="ad-stat"><b>{num(ov.page.views28)}</b><span>Page views (28d)</span></div>
          </div>
          {ov.page.link && <div className="mt-link"><a href={ov.page.link} target="_blank" rel="noreferrer">Open Page ↗</a></div>}
        </div>
      ) : ov.pageError ? (
        <div className="ad-card seo-card"><div className="seo-card-h">📘 Facebook Page</div><div className="mt-carderr">Couldn't load Page: {ov.pageError}</div></div>
      ) : null}

      {ov.instagram ? (
        <div className="ad-card seo-card">
          <div className="seo-card-h">📷 Instagram — @{ov.instagram.username}</div>
          <div className="ad-stats mt-stats">
            <div className="ad-stat"><b>{num(ov.instagram.followers)}</b><span>Followers</span></div>
            <div className="ad-stat"><b>{num(ov.instagram.posts)}</b><span>Posts</span></div>
            <div className="ad-stat"><b>{num(ov.instagram.reach28)}</b><span>Reach (28d)</span></div>
            <div className="ad-stat"><b>{num(ov.instagram.profileViews28)}</b><span>Profile views (28d)</span></div>
          </div>
        </div>
      ) : ov.igError ? (
        <div className="ad-card seo-card"><div className="seo-card-h">📷 Instagram</div><div className="mt-carderr">Couldn't load Instagram: {ov.igError}</div></div>
      ) : (
        <div className="mt-hint">Set <code>META_IG_ID</code> to show Instagram insights.</div>
      )}
    </div>
  );
}

function Inbox({ pw }) {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(() => call(pw, "inbox").then(setData), [pw]);
  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="ad-empty">Loading conversations…</div>;
  const threads = data.threads || [];
  const cur = threads.find((t) => t.id === active) || null;

  const send = async () => {
    if (!draft.trim() || !cur?.recipientId) return;
    setSending(true); setNote("");
    const r = await call(pw, "reply", { recipientId: cur.recipientId, text: draft.trim() });
    setSending(false);
    if (r.ok) { setDraft(""); setNote("Sent ✓"); setTimeout(load, 600); }
    else setNote(r.error || "Send failed");
  };

  return (
    <div className="mt-inbox">
      <div className="mt-threads">
        {threads.length === 0 && <div className="ad-empty">No conversations{data.errors ? " (or missing messaging permission)" : ""}.</div>}
        {threads.map((t) => (
          <button key={t.id} className={"mt-thread" + (t.id === active ? " on" : "")} onClick={() => { setActive(t.id); setNote(""); }}>
            <span className={"mt-plat mt-" + t.platform}>{t.platform === "instagram" ? "IG" : "FB"}</span>
            <span className="mt-tname">{t.name}{t.unread ? <em className="mt-unread">{t.unread}</em> : null}</span>
            <span className="mt-tsnip">{t.snippet}</span>
          </button>
        ))}
      </div>
      <div className="mt-convo">
        {!cur ? (
          <div className="ad-empty">Select a conversation.</div>
        ) : (
          <>
            <div className="mt-convo-h"><span className={"mt-plat mt-" + cur.platform}>{cur.platform === "instagram" ? "IG" : "FB"}</span> {cur.name}</div>
            <div className="mt-msgs">
              {(cur.messages || []).map((m, i) => (
                <div key={i} className={"mt-msg" + (m.fromPage ? " mine" : "")}>{m.text}</div>
              ))}
            </div>
            <div className="mt-reply">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a reply…" rows={2} />
              <button onClick={send} disabled={sending || !draft.trim()}>{sending ? "Sending…" : "Send"}</button>
            </div>
            {note && <div className="mt-note">{note}</div>}
          </>
        )}
      </div>
    </div>
  );
}

function Publish({ pw, hasIg }) {
  const [target, setTarget] = useState("facebook");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setResult({ ok: false, error: "Image too large (max 8 MB)." }); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true); setResult(null);
      try {
        const d = await call(pw, "uploadImage", { dataUrl: reader.result, name: file.name });
        if (d.url) { setImageUrl(d.url); setFileName(file.name); }
        else setResult({ ok: false, error: d.error || "Upload failed" });
      } catch (err) { setResult({ ok: false, error: err.message }); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const post = async () => {
    setBusy(true); setResult(null);
    const r = await call(pw, "publish", { target, message, link, imageUrl });
    setBusy(false);
    setResult(r);
    if (r.ok) { setMessage(""); setLink(""); setImageUrl(""); setFileName(""); }
  };
  const igNeedsImage = (target === "instagram" || target === "both") && !imageUrl;

  return (
    <div className="ad-card seo-card mt-publish">
      <div className="seo-card-h">Compose a post</div>
      <div className="mt-form">
        <label>Publish to</label>
        <div className="mt-targets">
          {["facebook", hasIg ? "instagram" : null, hasIg ? "both" : null].filter(Boolean).map((tg) => (
            <button key={tg} className={target === tg ? "on" : ""} onClick={() => setTarget(tg)}>
              {tg === "facebook" ? "Facebook" : tg === "instagram" ? "Instagram" : "Both"}
            </button>
          ))}
        </div>
        <label>Message / caption</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="What do you want to share?" />
        {target !== "instagram" && (
          <>
            <label>Link (optional, Facebook)</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://medxflow.ai/…" />
          </>
        )}
        <label>Image {target === "facebook" ? "(optional)" : "(required for Instagram)"}</label>
        <div className="mt-attach">
          <label className="mt-attach-btn">📎 Attach image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} hidden /></label>
          {uploading && <span className="mt-attach-status">Uploading…</span>}
          {!uploading && fileName && <span className="mt-attach-status">📷 {fileName}</span>}
          {!uploading && imageUrl && <button type="button" className="mt-attach-x" onClick={() => { setImageUrl(""); setFileName(""); }}>✕ remove</button>}
        </div>
        {imageUrl && <img className="mt-attach-preview" src={imageUrl} alt="attachment preview" />}
        <input className="mt-attach-url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setFileName(""); }} placeholder="…or paste a public image URL" />
        <button className="mt-post" onClick={post} disabled={busy || uploading || !message.trim() || igNeedsImage}>
          {busy ? "Publishing…" : "Publish"}
        </button>
        {igNeedsImage && <div className="mt-hint">Instagram posts need an image — attach one above.</div>}
        {result && (
          <div className={"mt-result " + (result.ok ? "ok" : "bad")}>
            {result.ok
              ? Object.entries(result.results || {}).map(([k, v]) => (
                  <div key={k}>{k}: {v.ok ? "published ✓" : `failed — ${v.error}`}</div>
                ))
              : (result.error || "Failed")}
          </div>
        )}
      </div>
    </div>
  );
}

function Ads({ pw }) {
  const [data, setData] = useState(null);
  useEffect(() => { call(pw, "ads").then(setData); }, [pw]);

  if (!data) return <div className="ad-empty">Loading ad performance…</div>;
  if (data.configured === false) return <div className="mt-hint">Set <code>META_AD_ACCOUNT_ID</code> to show ad performance.</div>;
  const t = data.totals || {};
  return (
    <div>
      <div className="ad-card seo-card">
        <div className="seo-card-h">Ad account — last 30 days</div>
        {data.totalsError ? <div className="mt-carderr">{data.totalsError}</div> : (
          <div className="ad-stats mt-stats">
            <div className="ad-stat"><b>${num(t.spend)}</b><span>Spend</span></div>
            <div className="ad-stat"><b>{num(t.impressions)}</b><span>Impressions</span></div>
            <div className="ad-stat"><b>{num(t.clicks)}</b><span>Clicks</span></div>
            <div className="ad-stat"><b>{t.ctr ? Number(t.ctr).toFixed(2) + "%" : "—"}</b><span>CTR</span></div>
          </div>
        )}
      </div>
      <div className="ad-card seo-card">
        <div className="seo-card-h">Campaigns</div>
        {data.campaignsError ? <div className="mt-carderr">{data.campaignsError}</div> :
          (data.campaigns || []).length === 0 ? <div className="ad-empty">No campaigns.</div> : (
          <div className="ad-scroll ad-scroll-tall">
            <table>
              <thead><tr><th>Campaign</th><th>Status</th><th>Spend</th><th>Impr.</th><th>Clicks</th><th>CTR</th></tr></thead>
              <tbody>
                {data.campaigns.map((c, i) => (
                  <tr key={i}>
                    <td><b>{c.name}</b></td>
                    <td>{c.status}</td>
                    <td>{c.spend ? "$" + num(c.spend) : "—"}</td>
                    <td>{num(c.impressions)}</td>
                    <td>{num(c.clicks)}</td>
                    <td>{c.ctr ? Number(c.ctr).toFixed(2) + "%" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const CSS = `
.mt-subnav{display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap}
.mt-subnav button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.75); padding:8px 14px; border-radius:9px; font-size:13.5px; font-weight:600; cursor:pointer}
.mt-subnav button.on{background:rgba(61,220,201,.14); border-color:rgba(61,220,201,.45); color:#7FD8CE}
.mt-stats{margin:16px}
.mt-link{padding:0 16px 14px} .mt-link a{color:#7FD8CE; font-size:13px; text-decoration:none}
.mt-hint{padding:12px 16px; font-size:13px; color:rgba(232,238,246,.55)}
.mt-hint code,.mt-setup code{background:rgba(207,224,242,.12); padding:1px 6px; border-radius:5px; font-size:12.5px; color:#7FD8CE}
.mt-carderr{padding:14px 16px; font-size:13px; color:#E05A4E}
.mt-setup{padding:16px} .mt-setup p{margin:0 0 10px; font-size:14px; color:rgba(232,238,246,.85); line-height:1.55}
.mt-setup ol{margin:0 0 10px; padding-left:20px; color:rgba(232,238,246,.75); font-size:13.5px; line-height:1.75}
/* inbox */
.mt-inbox{display:grid; grid-template-columns:300px 1fr; gap:14px}
.mt-threads{border:1px solid rgba(207,224,242,.1); border-radius:12px; overflow:hidden; max-height:560px; overflow-y:auto; background:rgba(207,224,242,.03)}
.mt-thread{display:grid; grid-template-columns:auto 1fr; gap:4px 8px; width:100%; text-align:left; padding:11px 13px; background:none; border:none; border-bottom:1px solid rgba(207,224,242,.06); cursor:pointer; color:#E8EEF6}
.mt-thread.on{background:rgba(61,220,201,.1)}
.mt-plat{font-size:10px; font-weight:800; padding:2px 6px; border-radius:5px; align-self:center}
.mt-messenger,.mt-facebook{background:#1877F2; color:#fff} .mt-instagram{background:linear-gradient(45deg,#F58529,#DD2A7B,#8134AF); color:#fff}
.mt-tname{font-size:13.5px; font-weight:700; display:flex; align-items:center; gap:6px}
.mt-unread{font-style:normal; background:#E05A4E; color:#fff; font-size:10px; padding:1px 6px; border-radius:9px}
.mt-tsnip{grid-column:2; font-size:12px; color:rgba(232,238,246,.55); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.mt-convo{border:1px solid rgba(207,224,242,.1); border-radius:12px; display:flex; flex-direction:column; min-height:360px; max-height:560px}
.mt-convo-h{padding:12px 16px; border-bottom:1px solid rgba(207,224,242,.1); font-weight:700; font-size:14px; display:flex; align-items:center; gap:8px}
.mt-msgs{flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:8px}
.mt-msg{max-width:74%; padding:9px 13px; border-radius:13px; font-size:13.5px; line-height:1.45; background:rgba(207,224,242,.09); color:#E8EEF6; align-self:flex-start}
.mt-msg.mine{align-self:flex-end; background:rgba(61,220,201,.2); color:#d7f5ef}
.mt-reply{display:flex; gap:8px; padding:12px; border-top:1px solid rgba(207,224,242,.1)}
.mt-reply textarea{flex:1; background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:9px 11px; font:inherit; font-size:13.5px; resize:vertical}
.mt-reply button,.mt-post,.mt-targets button{background:rgba(61,220,201,.16); border:1px solid rgba(61,220,201,.4); color:#7FD8CE; border-radius:9px; padding:9px 16px; font-weight:700; cursor:pointer; font-size:13.5px}
.mt-reply button:disabled,.mt-post:disabled{opacity:.5; cursor:not-allowed}
.mt-note{padding:6px 12px 12px; font-size:12.5px; color:#7FD8CE}
/* publish */
.mt-form{padding:16px; display:flex; flex-direction:column; gap:8px; max-width:640px}
.mt-form label{font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:rgba(232,238,246,.6); margin-top:6px}
.mt-form textarea,.mt-form input{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.14); border-radius:9px; color:#E8EEF6; padding:10px 12px; font:inherit; font-size:14px}
.mt-form textarea{resize:vertical}
.mt-targets{display:flex; gap:8px}
.mt-targets button{background:rgba(207,224,242,.06); border-color:rgba(207,224,242,.14); color:rgba(232,238,246,.7)}
.mt-targets button.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.4); color:#7FD8CE}
.mt-post{align-self:flex-start; margin-top:10px; padding:11px 22px}
.mt-attach{display:flex; align-items:center; gap:10px; flex-wrap:wrap}
.mt-attach-btn{display:inline-flex; align-items:center; gap:6px; background:rgba(61,220,201,.1); border:1px dashed rgba(61,220,201,.45); color:#7FD8CE; border-radius:9px; padding:9px 14px; font-size:13px; font-weight:700; cursor:pointer}
.mt-attach-btn:hover{background:rgba(61,220,201,.16)}
.mt-attach-status{font-size:12.5px; color:rgba(232,238,246,.7)}
.mt-attach-x{background:none; border:none; color:#E05A4E; font-size:12.5px; font-weight:600; cursor:pointer}
.mt-attach-preview{margin-top:10px; max-width:100%; max-height:220px; width:auto; border-radius:10px; border:1px solid rgba(207,224,242,.14)}
.mt-attach-url{margin-top:8px}
.mt-result{margin-top:10px; padding:10px 13px; border-radius:9px; font-size:13px; line-height:1.5}
.mt-result.ok{background:rgba(61,220,201,.12); color:#7FD8CE} .mt-result.bad{background:rgba(224,90,78,.12); color:#E05A4E}
@media(max-width:760px){ .mt-inbox{grid-template-columns:1fr} }
`;
