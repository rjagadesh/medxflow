import { useState, useEffect } from "react";
import { Insights, Feed, Inbox, Publish, Ads, MetaSetup, CSS as META_CSS } from "./Meta.jsx";
import Scheduler from "./Scheduler.jsx";
import WhatsApp from "./WhatsApp.jsx";
import LinkedIn from "./LinkedIn.jsx";
import Media from "./Media.jsx";

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
  { key: "media", label: "🖼 Media" },
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
      {sec === "media" && <Media pw={pw} />}
      {META_SECTIONS.includes(sec) && metaSection()}
    </div>
  );
}

const SOC_CSS = `
.soc-nav{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid rgba(207,224,242,.1)}
.soc-nav button{background:rgba(207,224,242,.06); border:1px solid rgba(207,224,242,.12); color:rgba(232,238,246,.8); padding:9px 16px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit}
.soc-nav button:hover{background:rgba(207,224,242,.12)}
.soc-nav button.on{background:rgba(61,220,201,.16); border-color:rgba(61,220,201,.5); color:#7FD8CE}
`;
