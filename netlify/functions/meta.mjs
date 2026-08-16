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
// Fetch one insights metric on its own, so a single invalid/ungranted metric
// only blanks its own tile (batching them means one bad metric 400s the lot).
// Returns { value, note } - note explains a blank when we can.
async function oneMetric(cfg, node, metric, extra = {}) {
  const r = await safe(() => graph(cfg, `${node}/insights`, {
    token: cfg.pageToken,
    params: { metric, period: "days_28", ...extra },  // extra can override period
  }));
  if (!r.ok) {
    const e = r.error || "";
    if (/valid insights metric/i.test(e)) return { value: null, note: "retired by Meta" };
    if (/permission/i.test(e)) return { value: null, note: "needs instagram_manage_insights permission" };
    return { value: null, note: e.slice(0, 80) };
  }
  const m = (r.data.data || [])[0];
  const v = m?.total_value?.value ?? (m?.values?.length ? m.values[m.values.length - 1].value : null);
  return { value: v ?? null, note: v == null ? "no data yet" : null };
}

async function overview(cfg) {
  const out = { page: null, instagram: null, pageError: null, igError: null };

  if (cfg.pageId && cfg.pageToken) {
    const info = await safe(() => graph(cfg, cfg.pageId, {
      token: cfg.pageToken,
      params: { fields: "name,fan_count,followers_count,link,new_like_count" },
    }));
    if (info.ok) {
      // Metrics fetched individually; page_impressions was retired by Meta, so
      // we surface new-follows instead of a permanently-blank impressions tile.
      const [engagements, views, newFollows] = await Promise.all([
        oneMetric(cfg, cfg.pageId, "page_post_engagements"),
        oneMetric(cfg, cfg.pageId, "page_views_total"),
        oneMetric(cfg, cfg.pageId, "page_daily_follows_unique"),
      ]);
      out.page = {
        name: info.data.name,
        link: info.data.link,
        fans: info.data.fan_count ?? info.data.followers_count ?? null,
        followers: info.data.followers_count ?? null,
        engagements28: engagements.value,
        views28: views.value,
        newFollows28: newFollows.value,
        notes: {
          engagements28: engagements.note,
          views28: views.note,
          newFollows28: newFollows.note,
        },
      };
    } else out.pageError = info.error;
  }

  if (cfg.igId && cfg.pageToken) {
    const info = await safe(() => graph(cfg, cfg.igId, {
      token: cfg.pageToken,
      params: { fields: "username,followers_count,media_count,profile_picture_url" },
    }));
    if (info.ok) {
      // IG's newer insights want period=day + metric_type=total_value over a
      // date range (days_28 is rejected for reach/profile_views). Aggregate the
      // last 28 days ourselves.
      const until = Math.floor(Date.now() / 1000);
      const since = until - 27 * 86400;
      const igExtra = { period: "day", metric_type: "total_value", since, until };
      const [reach, profileViews] = await Promise.all([
        oneMetric(cfg, cfg.igId, "reach", igExtra),
        oneMetric(cfg, cfg.igId, "profile_views", igExtra),
      ]);
      out.instagram = {
        username: info.data.username,
        avatar: info.data.profile_picture_url,
        followers: info.data.followers_count ?? null,
        posts: info.data.media_count ?? null,
        reach28: reach.value,
        profileViews28: profileViews.value,
        notes: { reach28: reach.note, profileViews28: profileViews.note },
      };
    } else out.igError = info.error;
  }

  return out;
}

// Fetch a daily time-series for one metric → [{ d:"YYYY-MM-DD", v:number }].
async function series(cfg, node, metric, since, until, extra = {}) {
  const r = await safe(() => graph(cfg, `${node}/insights`, {
    token: cfg.pageToken,
    params: { metric, period: "day", since, until, ...extra },
  }));
  if (!r.ok) return { points: [], error: r.error };
  const m = (r.data.data || [])[0];
  const points = (m?.values || []).map((v) => ({ d: (v.end_time || "").slice(0, 10), v: Number(v.value) || 0 }));
  return { points };
}

// Day-by-day trends for the charts. profile_views has no daily series (totals
// only), so it's intentionally omitted here.
async function trends(cfg) {
  const until = Math.floor(Date.now() / 1000);
  const since = until - 27 * 86400;
  const out = { since, until, page: null, instagram: null };

  if (cfg.pageId && cfg.pageToken) {
    const [views, engagements, follows] = await Promise.all([
      series(cfg, cfg.pageId, "page_views_total", since, until),
      series(cfg, cfg.pageId, "page_post_engagements", since, until),
      series(cfg, cfg.pageId, "page_daily_follows_unique", since, until),
    ]);
    out.page = { views, engagements, follows };
  }
  if (cfg.igId && cfg.pageToken) {
    const [reach] = await Promise.all([
      series(cfg, cfg.igId, "reach", since, until),
    ]);
    out.instagram = { reach };
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

// Recent posts on the FB Page and IG account - the "page feed".
async function posts(cfg) {
  const out = { facebook: [], instagram: [], fbError: null, igError: null };
  if (cfg.pageId && cfg.pageToken) {
    const r = await safe(() => graph(cfg, `${cfg.pageId}/posts`, {
      token: cfg.pageToken,
      params: { fields: "message,created_time,permalink_url,full_picture,likes.summary(true),comments.summary(true),shares", limit: 25 },
    }));
    if (r.ok) out.facebook = (r.data.data || []).map((p) => ({
      id: p.id, message: p.message || "", createdTime: p.created_time, url: p.permalink_url, image: p.full_picture || null,
      likes: p.likes?.summary?.total_count ?? null, comments: p.comments?.summary?.total_count ?? null, shares: p.shares?.count ?? null,
    }));
    else out.fbError = r.error;
  }
  if (cfg.igId && cfg.pageToken) {
    const r = await safe(() => graph(cfg, `${cfg.igId}/media`, {
      token: cfg.pageToken,
      params: { fields: "caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count", limit: 25 },
    }));
    if (r.ok) out.instagram = (r.data.data || []).map((m) => ({
      id: m.id, message: m.caption || "", createdTime: m.timestamp, url: m.permalink, type: m.media_type,
      image: m.media_type === "VIDEO" ? (m.thumbnail_url || null) : (m.media_url || null),
      likes: m.like_count ?? null, comments: m.comments_count ?? null,
    }));
    else out.igError = r.error;
  }
  return out;
}

// Comments on recent FB/IG posts - "who replied to a post".
async function comments(cfg) {
  const out = { facebook: [], instagram: [], fbError: null, igError: null };
  if (cfg.pageId && cfg.pageToken) {
    const r = await safe(() => graph(cfg, `${cfg.pageId}/posts`, {
      token: cfg.pageToken,
      params: { fields: "message,created_time,permalink_url,comments.limit(15){id,from,message,created_time}", limit: 10 },
    }));
    if (r.ok) {
      for (const post of r.data.data || [])
        for (const cm of post.comments?.data || [])
          out.facebook.push({ channel: "facebook", postId: post.id, postMsg: post.message || "", commentId: cm.id, from: cm.from?.name || "Someone", text: cm.message, at: cm.created_time });
    } else out.fbError = r.error;
  }
  if (cfg.igId && cfg.pageToken) {
    const r = await safe(() => graph(cfg, `${cfg.igId}/media`, {
      token: cfg.pageToken,
      params: { fields: "caption,permalink,comments.limit(15){id,from,text,username,timestamp}", limit: 10 },
    }));
    if (r.ok) {
      for (const media of r.data.data || [])
        for (const cm of media.comments?.data || [])
          out.instagram.push({ channel: "instagram", postId: media.id, postMsg: media.caption || "", commentId: cm.id, from: cm.username || "Someone", text: cm.text, at: cm.timestamp });
    } else out.igError = r.error;
  }
  return out;
}

async function replyComment(cfg, { channel, commentId, message }) {
  if (!commentId || !message) throw new Error("commentId and message are required.");
  const node = channel === "instagram" ? `${commentId}/replies` : `${commentId}/comments`;
  return graph(cfg, node, { token: cfg.pageToken, method: "POST", body: { message } });
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
    results.facebook = await safe(async () => {
      if (imageUrl) {
        // Unpublished photo → feed post with attached_media = a real post.
        const photo = await graph(cfg, `${cfg.pageId}/photos`, { token: cfg.pageToken, method: "POST", body: { url: imageUrl, published: false } });
        return graph(cfg, `${cfg.pageId}/feed`, { token: cfg.pageToken, method: "POST", body: { message, attached_media: [{ media_fbid: photo.id }] } });
      }
      return graph(cfg, `${cfg.pageId}/feed`, { token: cfg.pageToken, method: "POST", body: { message, link: link || undefined } });
    });
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
  const auth = authorize(req, "social");
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
    if (action === "trends") return json({ configured: true, ...(await trends(cfg)) });
    if (action === "inbox") return json({ configured: true, ...(await inbox(cfg)) });
    if (action === "posts") return json({ configured: true, ...(await posts(cfg)) });
    if (action === "comments") return json({ configured: true, ...(await comments(cfg)) });
    if (action === "replyComment") { await replyComment(cfg, body); return json({ ok: true }); }
    if (action === "reply") { await reply(cfg, body); return json({ ok: true }); }
    if (action === "publish") return json({ ok: true, results: await publish(cfg, body) });
    if (action === "ads") return json({ configured: true, ...(await ads(cfg)) });
    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
};
