import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { authorize, json } from "../lib/auth.mjs";

// Meta Business Suite — Facebook Page + Instagram from inside the admin.
// Talks to the Meta Graph API with long-lived Page/IG tokens (Meta Business
// Suite itself can't be iframe-embedded: it sends X-Frame-Options: DENY).
// Uses native fetch, no dependencies. Returns { configured:false } with setup
// guidance until the tokens are present. Every Graph call is wrapped so one
// missing permission degrades that panel instead of blanking the whole tab.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}

function metaConfig() {
  const c = readCreds();
  const g = (k) => process.env[k] || c[k] || "";
  return {
    version: g("META_GRAPH_VERSION") || "v21.0",
    pageId: g("META_PAGE_ID"),
    pageToken: g("META_PAGE_TOKEN"),
    igId: g("META_IG_ID"),
    adAccount: g("META_AD_ACCOUNT_ID"), // e.g. act_1234567890
  };
}

// ---- Graph helper ----------------------------------------------------------
async function graph(cfg, node, { token, params = {}, method = "GET", body } = {}) {
  const url = new URL(`https://graph.facebook.com/${cfg.version}/${node}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);
  const opts = { method };
  if (body) { opts.headers = { "content-type": "application/json" }; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Graph HTTP ${res.status}`);
  return data;
}

// Run a Graph call and capture failure as data rather than throwing, so a
// single un-granted permission only greys out its own card.
async function safe(fn) {
  try { return { ok: true, data: await fn() }; }
  catch (e) { return { ok: false, error: e.message }; }
}

// ---- actions ---------------------------------------------------------------
async function overview(cfg) {
  const out = { page: null, instagram: null, pageError: null, igError: null };

  if (cfg.pageId && cfg.pageToken) {
    const info = await safe(() => graph(cfg, cfg.pageId, {
      token: cfg.pageToken,
      params: { fields: "name,fan_count,followers_count,link,new_like_count" },
    }));
    const ins = await safe(() => graph(cfg, `${cfg.pageId}/insights`, {
      token: cfg.pageToken,
      params: { metric: "page_impressions,page_post_engagements,page_views_total", period: "days_28" },
    }));
    if (info.ok) {
      const metric = (name) => {
        const m = ins.ok && (ins.data.data || []).find((x) => x.name === name);
        const vals = m?.values || [];
        return vals.length ? vals[vals.length - 1].value : null;
      };
      out.page = {
        name: info.data.name,
        link: info.data.link,
        fans: info.data.fan_count ?? info.data.followers_count ?? null,
        followers: info.data.followers_count ?? null,
        impressions28: metric("page_impressions"),
        engagements28: metric("page_post_engagements"),
        views28: metric("page_views_total"),
      };
    } else out.pageError = info.error;
  }

  if (cfg.igId && cfg.pageToken) {
    const info = await safe(() => graph(cfg, cfg.igId, {
      token: cfg.pageToken,
      params: { fields: "username,followers_count,media_count,profile_picture_url" },
    }));
    const ins = await safe(() => graph(cfg, `${cfg.igId}/insights`, {
      token: cfg.pageToken,
      params: { metric: "reach,profile_views", period: "days_28", metric_type: "total_value" },
    }));
    if (info.ok) {
      const metric = (name) => {
        const m = ins.ok && (ins.data.data || []).find((x) => x.name === name);
        return m?.total_value?.value ?? (m?.values?.[m.values.length - 1]?.value ?? null);
      };
      out.instagram = {
        username: info.data.username,
        avatar: info.data.profile_picture_url,
        followers: info.data.followers_count ?? null,
        posts: info.data.media_count ?? null,
        reach28: metric("reach"),
        profileViews28: metric("profile_views"),
      };
    } else out.igError = info.error;
  }

  return out;
}

// Normalise Messenger + Instagram conversations into one inbox list.
async function inbox(cfg) {
  if (!cfg.pageId || !cfg.pageToken) return { threads: [] };
  const fields = "participants,snippet,updated_time,unread_count,messages.limit(12){message,from,created_time}";
  const platforms = ["messenger", "instagram"];
  const threads = [];
  const errors = {};
  for (const platform of platforms) {
    const r = await safe(() => graph(cfg, `${cfg.pageId}/conversations`, {
      token: cfg.pageToken,
      params: { platform, fields, limit: 25 },
    }));
    if (!r.ok) { errors[platform] = r.error; continue; }
    for (const c of r.data.data || []) {
      const parts = c.participants?.data || [];
      // The party that isn't the page is the customer.
      const other = parts.find((p) => String(p.id) !== String(cfg.pageId)) || parts[0] || {};
      const msgs = (c.messages?.data || []).slice().reverse().map((m) => ({
        text: m.message,
        fromPage: String(m.from?.id) === String(cfg.pageId),
        at: m.created_time,
      }));
      threads.push({
        id: c.id,
        platform,
        name: other.name || other.username || other.email || other.id || "Unknown",
        recipientId: other.id,
        snippet: c.snippet,
        unread: c.unread_count || 0,
        updated: c.updated_time,
        messages: msgs,
      });
    }
  }
  threads.sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")));
  return { threads, errors };
}

async function reply(cfg, { recipientId, text }) {
  if (!cfg.pageId || !cfg.pageToken) throw new Error("Page not configured.");
  if (!recipientId || !text) throw new Error("recipientId and text are required.");
  return graph(cfg, `${cfg.pageId}/messages`, {
    token: cfg.pageToken,
    method: "POST",
    body: { recipient: { id: recipientId }, messaging_type: "RESPONSE", message: { text } },
  });
}

async function publish(cfg, { target, message, link, imageUrl }) {
  const results = {};
  if ((target === "facebook" || target === "both")) {
    if (!cfg.pageId || !cfg.pageToken) throw new Error("Facebook Page not configured.");
    results.facebook = await safe(() =>
      imageUrl
        ? graph(cfg, `${cfg.pageId}/photos`, { token: cfg.pageToken, method: "POST", body: { url: imageUrl, caption: message } })
        : graph(cfg, `${cfg.pageId}/feed`, { token: cfg.pageToken, method: "POST", body: { message, link: link || undefined } })
    );
  }
  if ((target === "instagram" || target === "both")) {
    if (!cfg.igId || !cfg.pageToken) throw new Error("Instagram account not configured.");
    if (!imageUrl) throw new Error("Instagram posts require a public image URL.");
    results.instagram = await safe(async () => {
      const created = await graph(cfg, `${cfg.igId}/media`, {
        token: cfg.pageToken, method: "POST", body: { image_url: imageUrl, caption: message },
      });
      return graph(cfg, `${cfg.igId}/media_publish`, {
        token: cfg.pageToken, method: "POST", body: { creation_id: created.id },
      });
    });
  }
  return results;
}

async function ads(cfg) {
  if (!cfg.adAccount || !cfg.pageToken) return { configured: false };
  const acct = cfg.adAccount.startsWith("act_") ? cfg.adAccount : `act_${cfg.adAccount}`;
  const totals = await safe(() => graph(cfg, `${acct}/insights`, {
    token: cfg.pageToken,
    params: { fields: "spend,impressions,clicks,cpc,ctr,reach", date_preset: "last_30d" },
  }));
  const campaigns = await safe(() => graph(cfg, `${acct}/campaigns`, {
    token: cfg.pageToken,
    params: { fields: "name,status,objective,insights.date_preset(last_30d){spend,impressions,clicks,ctr}", limit: 25 },
  }));
  return {
    configured: true,
    totals: totals.ok ? (totals.data.data?.[0] || {}) : null,
    totalsError: totals.ok ? null : totals.error,
    campaigns: campaigns.ok
      ? (campaigns.data.data || []).map((c) => ({
          name: c.name, status: c.status, objective: c.objective,
          ...(c.insights?.data?.[0] || {}),
        }))
      : [],
    campaignsError: campaigns.ok ? null : campaigns.error,
  };
}

// ---- handler ---------------------------------------------------------------
export default async (req) => {
  const auth = authorize(req, "meta");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const cfg = metaConfig();
  if (!cfg.pageId || !cfg.pageToken) {
    return json({
      configured: false,
      reason: "Set META_PAGE_ID and META_PAGE_TOKEN to connect your Meta Business Suite.",
    });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "overview";

  try {
    // Store an uploaded image and return a public URL that FB/IG can fetch.
    if (action === "uploadImage") {
      const m = /^data:([^;]+);base64,(.+)$/s.exec(body.dataUrl || "");
      if (!m) return json({ error: "Invalid image data." }, 400);
      const contentType = m[1];
      if (!/^image\//.test(contentType)) return json({ error: "File must be an image." }, 400);
      const id = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      const store = getStore("meta-media");
      await store.set(id, Buffer.from(m[2], "base64"), { metadata: { contentType, name: body.name || "" } });
      const base = (process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888").replace(/\/+$/, "");
      return json({ ok: true, url: `${base}/.netlify/functions/meta-media?id=${id}` });
    }

    if (action === "overview") return json({ configured: true, ...(await overview(cfg)), hasIg: !!cfg.igId, hasAds: !!cfg.adAccount });
    if (action === "inbox") return json({ configured: true, ...(await inbox(cfg)) });
    if (action === "reply") { await reply(cfg, body); return json({ ok: true }); }
    if (action === "publish") return json({ ok: true, results: await publish(cfg, body) });
    if (action === "ads") return json({ configured: true, ...(await ads(cfg)) });
    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
};
