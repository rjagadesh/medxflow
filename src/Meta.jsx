import { useState, useEffect, useCallback } from "react";

// Meta Business Suite tab — Facebook Page + Instagram, via the Graph API
// (server function netlify/functions/meta.mjs). Four sub-panels: Insights,
// Inbox (read/reply to DMs), Publish, Ads. Shows setup guidance until the
// Page tokens are configured.

const SUBS = [
  { key: "insights", label: "📊 Insights" },
  { key: "feed", label: "📰 Feed" },
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
      {sub === "feed" && <Feed pw={pw} ov={overview} />}
      {sub === "inbox" && <Inbox pw={pw} />}
      {sub === "publish" && <Publish pw={pw} hasIg={overview.hasIg} />}
      {sub === "ads" && <Ads pw={pw} />}
    </div>
  );
}

export function MetaSetup({ reason }) {
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

export function Insights({ ov }) {
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

export function Feed({ pw, ov }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(ov?.page ? "facebook" : "instagram");
  const [fbView, setFbView] = useState("embed"); // embed | cards
  useEffect(() => { call(pw, "posts").then(setData).catch((e) => setData({ error: e.message })); }, [pw]);

  if (!data) return <div className="ad-empty">Loading feed…</div>;
  if (data.error) return <div className="ad-err">{data.error}</div>;

  const num = (n) => (n == null ? "—" : Number(n).toLocaleString());
  const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");
  const igList = data.instagram || [];
  const fbList = data.facebook || [];
  const fbHref = ov?.page?.link;
  // Official Facebook Page Plugin - embeds the real page timeline.
  const fbSrc = fbHref ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(fbHref)}&tabs=timeline&width=500&height=800&hide_cover=false&show_facepile=true&adapt_container_width=true&small_header=false` : null;

  return (
    <div>
      <div className="mt-subnav">
        <button className={tab === "facebook" ? "on" : ""} onClick={() => setTab("facebook")}>📘 Facebook{data.facebook ? ` (${fbList.length})` : ""}</button>
        {ov?.hasIg !== false && <button className={tab === "instagram" ? "on" : ""} onClick={() => setTab("instagram")}>📷 Instagram{data.instagram ? ` (${igList.length})` : ""}</button>}
      </div>

      {tab === "facebook" ? (
        <>
          <div className="mt-feedbar">
            {fbHref && <a className="mt-openlink" href={fbHref} target="_blank" rel="noreferrer">Open Facebook page ↗</a>}
            <div className="mt-viewtoggle">
              <button className={fbView === "embed" ? "on" : ""} onClick={() => setFbView("embed")}>Page view</button>
              <button className={fbView === "cards" ? "on" : ""} onClick={() => setFbView("cards")}>Cards</button>
            </div>
          </div>
          {data.fbError && <div className="mt-carderr">{data.fbError}</div>}
          {fbView === "embed" && fbSrc ? (
            <div className="mt-fbembed">
              <iframe title="Facebook Page" src={fbSrc} width="500" height="800" scrolling="no" frameBorder="0"
                allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
              <p className="mt-embed-note">Live embed of your Facebook page timeline. If it appears blank, the browser is blocking third-party content — use “Cards”, or open the page directly.</p>
            </div>
          ) : (
            <FeedCards list={fbList} num={num} fmt={fmt} empty="No posts on this Page yet." />
          )}
        </>
      ) : (
        <>
          {data.igError && <div className="mt-carderr">{data.igError}</div>}
          {igList.length === 0 ? (
            <div className="ad-empty">No posts on this account yet.</div>
          ) : (
            <div className="mt-iggrid">
              {igList.map((p) => (
                <a key={p.id} className="mt-igcell" href={p.url} target="_blank" rel="noreferrer" title={p.message}>
                  {p.image ? <img src={p.image} alt="" loading="lazy" /> : <div className="mt-igph">📝</div>}
                  <div className="mt-igov"><span>❤️ {num(p.likes)}</span><span>💬 {num(p.comments)}</span></div>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FeedCards({ list, num, fmt, empty }) {
  if (!list.length) return <div className="ad-empty">{empty}</div>;
  return (
    <div className="mt-feed">
      {list.map((p) => (
        <a key={p.id} className="mt-post" href={p.url} target="_blank" rel="noreferrer">
          {p.image ? <div className="mt-post-img"><img src={p.image} alt="" loading="lazy" /></div> : <div className="mt-post-img mt-post-noimg">📝</div>}
          <div className="mt-post-b">
            <div className="mt-post-msg">{p.message || <em>(no caption)</em>}</div>
            <div className="mt-post-meta">
              <span>🕒 {fmt(p.createdTime)}</span>
              <span className="mt-post-stats">❤️ {num(p.likes)} · 💬 {num(p.comments)}{p.shares != null ? ` · 🔁 ${num(p.shares)}` : ""}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

async function waCall(pw, action, extra = {}) {
  const res = await fetch("/.netlify/functions/whatsapp", {
    method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

// Merge DMs (Messenger/IG), WhatsApp threads and FB/IG comments into one list.
function normalize(dm, wa, cm) {
  const items = [];
  for (const t of dm?.threads || [])
    items.push({ uid: "dm-" + t.id, kind: "dm", channel: t.platform, name: t.name, recipientId: t.recipientId, unread: t.unread || 0, updated: t.updated, snippet: t.snippet, messages: (t.messages || []).map((m) => ({ text: m.text, mine: !!m.fromPage })) });
  for (const t of wa?.threads || []) {
    const last = (t.messages || [])[t.messages.length - 1];
    items.push({ uid: "wa-" + t.wa_id, kind: "wa", channel: "whatsapp", name: t.name || t.wa_id, wa_id: t.wa_id, unread: t.unread || 0, updated: t.updated, snippet: last?.text || "", messages: (t.messages || []).map((m) => ({ text: m.text, mine: m.dir === "out" })) });
  }
  for (const c of [...(cm?.facebook || []), ...(cm?.instagram || [])])
    items.push({ uid: "cm-" + c.commentId, kind: "comment", channel: c.channel, name: c.from, commentId: c.commentId, postMsg: c.postMsg, updated: c.at, snippet: c.text, messages: [{ text: c.text, mine: false }] });
  items.sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")));
  return items;
}

const badge = (it) => {
  if (it.kind === "wa") return ["WA", "mt-whatsapp"];
  if (it.kind === "comment") return [it.channel === "instagram" ? "IG💬" : "FB💬", "mt-" + it.channel];
  return [it.channel === "instagram" ? "IG" : "FB", "mt-" + it.channel];
};

const FILTERS = [["all", "All"], ["messenger", "Messenger"], ["instagram", "Instagram"], ["whatsapp", "WhatsApp"], ["comment", "Comments"]];

export function Inbox({ pw }) {
  const [items, setItems] = useState(null);
  const [errs, setErrs] = useState({});
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const [dm, wa, cm] = await Promise.all([
      call(pw, "inbox").catch((e) => ({ error: e.message })),
      waCall(pw, "inbox").catch((e) => ({ error: e.message })),
      call(pw, "comments").catch((e) => ({ error: e.message })),
    ]);
    setErrs({ dm: dm.errors || dm.error, wa: wa.error || (wa.configured === false ? wa.reason : null), cm: cm.fbError || cm.igError });
    setItems(normalize(dm, wa, cm));
  }, [pw]);
  useEffect(() => { load(); }, [load]);

  if (!items) return <div className="ad-empty">Loading conversations…</div>;
  const shown = items.filter((it) => filter === "all" || (filter === "comment" ? it.kind === "comment" : it.channel === filter));
  const cur = items.find((it) => it.uid === active) || null;

  const send = async () => {
    if (!draft.trim() || !cur) return;
    setSending(true); setNote("");
    let r;
    if (cur.kind === "dm") r = await call(pw, "reply", { recipientId: cur.recipientId, text: draft.trim() });
    else if (cur.kind === "wa") r = await waCall(pw, "replyText", { to: cur.wa_id, text: draft.trim() });
    else r = await call(pw, "replyComment", { channel: cur.channel, commentId: cur.commentId, message: draft.trim() });
    setSending(false);
    if (r.ok) { setDraft(""); setNote("Sent ✓"); setTimeout(load, 800); }
    else setNote(r.error || "Send failed");
  };

  const [curLbl, curCls] = cur ? badge(cur) : ["", ""];

  return (
    <div>
      <div className="mt-filter">
        {FILTERS.map(([k, lbl]) => <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{lbl}</button>)}
        <button className="mt-refresh" onClick={load} title="Refresh">⟳</button>
      </div>
      {(errs.wa || errs.cm) && <div className="mt-hint">{errs.wa ? `WhatsApp: ${errs.wa}. ` : ""}{errs.cm ? `Comments: ${errs.cm}` : ""}</div>}
      <div className="mt-inbox">
        <div className="mt-threads">
          {shown.length === 0 && <div className="ad-empty">Nothing here yet.</div>}
          {shown.map((it) => {
            const [lbl, cls] = badge(it);
            return (
              <button key={it.uid} className={"mt-thread" + (it.uid === active ? " on" : "")} onClick={() => { setActive(it.uid); setNote(""); if (it.kind === "wa" && it.unread) waCall(pw, "markRead", { wa_id: it.wa_id }); }}>
                <span className={"mt-plat " + cls}>{lbl}</span>
                <span className="mt-tname">{it.name}{it.unread ? <em className="mt-unread">{it.unread}</em> : null}</span>
                <span className="mt-tsnip">{it.snippet}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-convo">
          {!cur ? (
            <div className="ad-empty">Select a conversation.</div>
          ) : (
            <>
              <div className="mt-convo-h"><span className={"mt-plat " + curCls}>{curLbl}</span> {cur.name}{cur.kind === "comment" && cur.postMsg ? <span className="mt-post-ctx"> · on “{cur.postMsg.slice(0, 40)}”</span> : null}</div>
              <div className="mt-msgs">
                {(cur.messages || []).map((m, i) => (
                  <div key={i} className={"mt-msg" + (m.mine ? " mine" : "")}>{m.text}</div>
                ))}
              </div>
              <div className="mt-reply">
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={cur.kind === "comment" ? "Reply to this comment…" : "Type a reply…"} rows={2} />
                <button onClick={send} disabled={sending || !draft.trim()}>{sending ? "Sending…" : "Send"}</button>
              </div>
              {note && <div className="mt-note">{note}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Publish({ pw, hasIg }) {
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

export function Ads({ pw }) {
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

export const CSS = `
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
.mt-whatsapp{background:#25D366; color:#062b16}
.mt-filter{display:flex; gap:7px; align-items:center; margin-bottom:12px; flex-wrap:wrap}
.mt-filter button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.75); padding:6px 13px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer}
.mt-filter button.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.45); color:#7FD8CE}
.mt-refresh{margin-left:auto}
.mt-post-ctx{font-size:12px; color:rgba(232,238,246,.5); font-weight:400}
/* feed */
.mt-feed{display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px}
.mt-post{display:flex; flex-direction:column; background:rgba(207,224,242,.04); border:1px solid rgba(207,224,242,.1); border-radius:14px; overflow:hidden; text-decoration:none; color:inherit; transition:transform .15s, border-color .15s}
.mt-post:hover{transform:translateY(-2px); border-color:rgba(61,220,201,.4)}
.mt-post-img{height:170px; background:rgba(10,24,48,.5); overflow:hidden}
.mt-post-img img{width:100%; height:100%; object-fit:cover}
.mt-post-noimg{display:grid; place-items:center; font-size:34px; opacity:.6}
.mt-post-b{padding:12px 13px; display:flex; flex-direction:column; gap:8px}
.mt-post-msg{font-size:13.5px; color:#E8EEF6; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden}
.mt-post-meta{display:flex; flex-direction:column; gap:3px; font-size:11.5px; color:rgba(232,238,246,.55)}
.mt-post-stats{color:rgba(232,238,246,.7)}
/* FB embed + feed bar */
.mt-feedbar{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; flex-wrap:wrap}
.mt-openlink{color:#7FD8CE; font-size:13px; font-weight:600; text-decoration:none}
.mt-viewtoggle{display:flex; gap:6px}
.mt-viewtoggle button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.75); padding:6px 12px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer}
.mt-viewtoggle button.on{background:rgba(24,119,242,.2); border-color:#1877F2; color:#8ab6f7}
.mt-fbembed{display:flex; flex-direction:column; align-items:center; gap:10px}
.mt-fbembed iframe{width:500px; max-width:100%; height:800px; border:none; border-radius:12px; overflow:hidden; background:#fff}
.mt-embed-note{font-size:11.5px; color:rgba(232,238,246,.45); max-width:500px; text-align:center; line-height:1.5}
/* Instagram-style square grid */
.mt-iggrid{display:grid; grid-template-columns:repeat(3,1fr); gap:4px; max-width:640px}
.mt-igcell{position:relative; aspect-ratio:1/1; overflow:hidden; background:rgba(10,24,48,.5); display:block}
.mt-igcell img{width:100%; height:100%; object-fit:cover; display:block}
.mt-igph{width:100%; height:100%; display:grid; place-items:center; font-size:32px; opacity:.5}
.mt-igov{position:absolute; inset:0; background:rgba(0,0,0,.45); color:#fff; display:flex; align-items:center; justify-content:center; gap:18px; font-size:14px; font-weight:700; opacity:0; transition:opacity .15s}
.mt-igcell:hover .mt-igov{opacity:1}
@media(max-width:600px){.mt-iggrid{gap:2px}}
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
