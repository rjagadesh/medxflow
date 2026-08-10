import { useState, useEffect } from "react";
import { Insights, Feed, Inbox, Publish, Ads, MetaSetup, CSS as META_CSS } from "./Meta.jsx";
import Scheduler from "./Scheduler.jsx";
import WhatsApp from "./WhatsApp.jsx";
import LinkedIn from "./LinkedIn.jsx";
import YouTube from "./YouTube.jsx";
import Media from "./Media.jsx";

async function connectOauth(pw, fn) {
  try {
    const res = await fetch(`/.netlify/functions/${fn}`, { method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" }, body: "{}" });
    const d = await res.json();
    if (d.url) window.open(d.url, "_blank", "noopener");
    else alert(d.error || "Couldn't start the connect flow.");
  } catch (e) { alert(e.message); }
}

function Connections({ pw }) {
  const [conns, setConns] = useState(null);
  useEffect(() => {
    fetch("/.netlify/functions/connections", { method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" }, body: "{}" })
      .then((r) => r.json()).then((d) => setConns(d.connections || [])).catch(() => setConns([]));
  }, [pw]);
  if (!conns) return <div className="ad-empty">Loading connections…</div>;
  return (
    <div>
      <div className="soc-conn-head">Platform connections — set each platform's env vars to enable it in the Scheduler.</div>
      <div className="soc-conns">
        {conns.map((c) => (
          <div key={c.key} className={"soc-conn" + (c.ok ? " ok" : "")}>
            <span className="soc-conn-ic">{c.ic}</span>
            <div className="soc-conn-b">
              <b>{c.label} <span className={"soc-conn-badge " + (c.ok ? "on" : "off")}>{c.ok ? "Connected" : "Not set"}</span></b>
              <span className="soc-conn-note">{c.note}</span>
              <span className="soc-conn-vars">{c.vars.join(" · ")}</span>
              {c.oauth && <button className="soc-conn-connect" onClick={() => connectOauth(pw, c.oauthFn)}>Connect →</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// One unified Social Media tab: dashboard/metrics, feed, inbox, publish,
// scheduler, WhatsApp and media - all in a single top-level tab.

async function metaCall(pw, action, extra = {}) {
  const res = await fetch("/.netlify/functions/meta", {
    method: "POST", headers: { "x-admin-password": pw, "content-type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

const SECTIONS = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "feed", label: "📰 Feed" },
  { key: "inbox", label: "💬 Inbox" },
  { key: "publish", label: "✍️ Publish" },
  { key: "scheduler", label: "🗓 Scheduler" },
  { key: "whatsapp", label: "🟢 WhatsApp" },
  { key: "linkedin", label: "💼 LinkedIn" },
  { key: "youtube", label: "▶️ YouTube" },
  { key: "media", label: "🖼 Media" },
  { key: "connections", label: "🔌 Connections" },
  { key: "ads", label: "📈 Ads" },
];
// Sections that depend on the Meta (FB/IG) connection.
const META_SECTIONS = ["dashboard", "feed", "publish", "ads"];

export default function Social({ pw }) {
  const [sec, setSec] = useState("dashboard");
  const [ov, setOv] = useState(null);

  useEffect(() => { metaCall(pw, "overview").then(setOv).catch(() => setOv({ error: true })); }, [pw]);

  const sections = SECTIONS.filter((s) => (s.key === "ads" ? ov?.hasAds : true));

  const metaSection = () => {
    if (!ov) return <div className="ad-empty">Connecting to Meta…</div>;
    if (ov.error) return <div className="ad-err">Couldn't connect to Meta. Check the META_* configuration.</div>;
    if (ov.configured === false) return <MetaSetup reason={ov.reason} />;
    if (sec === "dashboard") return <Insights ov={ov} />;
    if (sec === "feed") return <Feed pw={pw} ov={ov} />;
    if (sec === "publish") return <Publish pw={pw} hasIg={ov.hasIg} />;
    if (sec === "ads") return <Ads pw={pw} />;
    return null;
  };

  return (
    <div className="soc">
      <style>{META_CSS}</style>
      <style>{SOC_CSS}</style>
      <div className="soc-nav">
        {sections.map((s) => (
          <button key={s.key} className={sec === s.key ? "on" : ""} onClick={() => setSec(s.key)}>{s.label}</button>
        ))}
      </div>

      {sec === "inbox" && <Inbox pw={pw} />}
      {sec === "scheduler" && <Scheduler pw={pw} />}
      {sec === "whatsapp" && <WhatsApp pw={pw} />}
      {sec === "linkedin" && <LinkedIn pw={pw} />}
      {sec === "youtube" && <YouTube pw={pw} />}
      {sec === "media" && <Media pw={pw} />}
      {sec === "connections" && <Connections pw={pw} />}
      {META_SECTIONS.includes(sec) && metaSection()}
    </div>
  );
}

const SOC_CSS = `
.soc-nav{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid rgba(207,224,242,.1)}
.soc-nav button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.8); padding:9px 16px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit}
.soc-nav button:hover{background:rgba(207,224,242,.12)}
.soc-nav button.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.5); color:#7FD8CE}
.soc-conn-head{font-size:13.5px; color:rgba(232,238,246,.65); margin-bottom:14px}
.soc-conns{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px}
.soc-conn{display:flex; gap:12px; align-items:flex-start; background:rgba(207,224,242,.04); border:1px solid rgba(207,224,242,.1); border-radius:12px; padding:14px}
.soc-conn.ok{border-color:rgba(61,220,201,.35); background:rgba(61,220,201,.06)}
.soc-conn-ic{font-size:22px}
.soc-conn-b{display:flex; flex-direction:column; gap:3px; min-width:0}
.soc-conn-b b{font-size:14px; color:#E8EEF6; display:flex; align-items:center; gap:8px}
.soc-conn-badge{font-size:10px; font-weight:800; padding:2px 8px; border-radius:999px; text-transform:uppercase; letter-spacing:.03em}
.soc-conn-badge.on{background:rgba(61,220,201,.2); color:#3DDCC9} .soc-conn-badge.off{background:rgba(207,224,242,.1); color:rgba(232,238,246,.5)}
.soc-conn-note{font-size:12px; color:rgba(232,238,246,.6)}
.soc-conn-vars{font-size:11px; color:rgba(232,238,246,.4); font-family:'Spline Sans Mono',monospace}
.soc-conn-connect{margin-top:8px; align-self:flex-start; background:rgba(61,220,201,.16); border:1px solid rgba(61,220,201,.45); color:#7FD8CE; border-radius:8px; padding:6px 13px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit}
.soc-conn-connect:hover{background:rgba(61,220,201,.24)}
`;
