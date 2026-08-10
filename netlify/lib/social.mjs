import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

// Shared social publishing - Facebook & Instagram feed posts and WhatsApp image
// messages, over the Meta Graph API. Config from env / creds.json.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
const g = (k) => process.env[k] || readCreds()[k] || "";

export function metaCfg() {
  return { version: g("META_GRAPH_VERSION") || "v21.0", pageId: g("META_PAGE_ID"), token: g("META_PAGE_TOKEN"), igId: g("META_IG_ID") };
}
export function waCfg() {
  return { version: g("META_GRAPH_VERSION") || "v21.0", token: g("META_WHATSAPP_TOKEN"), phoneId: g("META_WHATSAPP_PHONE_ID") };
}

async function graph(version, node, { token, method = "GET", body } = {}) {
  const opts = { method, headers: { authorization: `Bearer ${token}` } };
  if (body) { opts.headers["content-type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(`https://graph.facebook.com/${version}/${node}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Graph HTTP ${res.status}`);
  return data;
}

export async function publishFacebook(cfg, { caption, imageUrl, link }) {
  if (!cfg.pageId || !cfg.token) throw new Error("Facebook not configured (META_PAGE_ID / META_PAGE_TOKEN).");
  if (imageUrl) {
    // Upload the photo UNPUBLISHED, then attach it to a feed post - this creates
    // a proper timeline post (message + image), not just a bare photo upload.
    const photo = await graph(cfg.version, `${cfg.pageId}/photos`, { token: cfg.token, method: "POST", body: { url: imageUrl, published: false } });
    return graph(cfg.version, `${cfg.pageId}/feed`, { token: cfg.token, method: "POST", body: { message: caption, attached_media: [{ media_fbid: photo.id }] } });
  }
  return graph(cfg.version, `${cfg.pageId}/feed`, { token: cfg.token, method: "POST", body: { message: caption, link: link || undefined } });
}

export async function publishInstagram(cfg, { caption, imageUrl }) {
  if (!cfg.igId || !cfg.token) throw new Error("Instagram not configured (META_IG_ID).");
  if (!imageUrl) throw new Error("Instagram requires an image.");
  const created = await graph(cfg.version, `${cfg.igId}/media`, { token: cfg.token, method: "POST", body: { image_url: imageUrl, caption } });
  return graph(cfg.version, `${cfg.igId}/media_publish`, { token: cfg.token, method: "POST", body: { creation_id: created.id } });
}

// ---- LinkedIn (organization page, versioned REST API) ----
export function linkedinCfg() {
  return { token: g("LINKEDIN_ACCESS_TOKEN"), org: g("LINKEDIN_ORG_ID"), version: g("LINKEDIN_VERSION") || "202409" };
}

async function liFetch(cfg, path, { method = "GET", body } = {}) {
  const headers = {
    authorization: `Bearer ${cfg.token}`,
    "LinkedIn-Version": cfg.version,
    "X-Restli-Protocol-Version": "2.0.0",
  };
  if (body) headers["content-type"] = "application/json";
  const res = await fetch(`https://api.linkedin.com/rest${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) throw new Error(data?.message || `LinkedIn HTTP ${res.status}`);
  return { data, headers: res.headers };
}

export async function publishLinkedIn(cfg, { caption, imageUrl }) {
  if (!cfg.token || !cfg.org) throw new Error("LinkedIn not configured (LINKEDIN_ACCESS_TOKEN / LINKEDIN_ORG_ID).");
  const author = `urn:li:organization:${cfg.org}`;
  let content;
  if (imageUrl) {
    // 1) init an image upload, 2) PUT the bytes, 3) reference the image URN in the post.
    const init = await liFetch(cfg, "/images?action=initializeUpload", { method: "POST", body: { initializeUploadRequest: { owner: author } } });
    const uploadUrl = init.data?.value?.uploadUrl;
    const imageUrn = init.data?.value?.image;
    if (!uploadUrl || !imageUrn) throw new Error("LinkedIn upload init failed.");
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error("Couldn't fetch image for LinkedIn upload.");
    const bytes = Buffer.from(await imgRes.arrayBuffer());
    const up = await fetch(uploadUrl, { method: "PUT", headers: { authorization: `Bearer ${cfg.token}` }, body: bytes });
    if (!up.ok) throw new Error(`LinkedIn image upload HTTP ${up.status}`);
    content = { media: { title: "image", id: imageUrn } };
  }
  const post = {
    author, commentary: caption || "", visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: "PUBLISHED", isReshareDisabledByAuthor: false,
  };
  if (content) post.content = content;
  const res = await liFetch(cfg, "/posts", { method: "POST", body: post });
  return { id: res.headers.get("x-restli-id") || res.headers.get("x-linkedin-id") || res.data?.id || null };
}

export async function sendWhatsAppImage(cfg, { to, imageUrl, caption }) {
  if (!cfg.token || !cfg.phoneId) throw new Error("WhatsApp not configured.");
  const digits = String(to).replace(/[^\d]/g, "");
  return graph(cfg.version, `${cfg.phoneId}/messages`, {
    token: cfg.token, method: "POST",
    body: { messaging_product: "whatsapp", to: digits, type: "image", image: { link: imageUrl, caption } },
  });
}

// ---- Threads (Meta) ----
export function threadsCfg() { return { token: g("THREADS_TOKEN"), userId: g("THREADS_USER_ID") }; }
export async function publishThreads(cfg, { caption, imageUrl }) {
  if (!cfg.token || !cfg.userId) throw new Error("Threads not configured (THREADS_TOKEN / THREADS_USER_ID).");
  const base = `https://graph.threads.net/v1.0/${cfg.userId}`;
  const create = new URLSearchParams({ access_token: cfg.token, media_type: imageUrl ? "IMAGE" : "TEXT", text: caption || "" });
  if (imageUrl) create.set("image_url", imageUrl);
  const c = await fetch(`${base}/threads`, { method: "POST", body: create });
  const cd = await c.json(); if (!c.ok) throw new Error(cd?.error?.message || "Threads create failed");
  const p = await fetch(`${base}/threads_publish`, { method: "POST", body: new URLSearchParams({ access_token: cfg.token, creation_id: cd.id }) });
  const pd = await p.json(); if (!p.ok) throw new Error(pd?.error?.message || "Threads publish failed");
  return { id: pd.id };
}

// ---- Telegram (bot → channel/chat) ----
export function telegramCfg() { return { token: g("TELEGRAM_BOT_TOKEN"), chatId: g("TELEGRAM_CHAT_ID") }; }
export async function publishTelegram(cfg, { caption, imageUrl }) {
  if (!cfg.token || !cfg.chatId) throw new Error("Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID).");
  const base = `https://api.telegram.org/bot${cfg.token}`;
  const url = imageUrl ? `${base}/sendPhoto` : `${base}/sendMessage`;
  const body = imageUrl ? { chat_id: cfg.chatId, photo: imageUrl, caption: caption || "" } : { chat_id: cfg.chatId, text: caption || "" };
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json(); if (!d.ok) throw new Error(d.description || "Telegram send failed");
  return { id: d.result?.message_id || null };
}

// ---- Bluesky (AT Protocol) ----
export function blueskyCfg() { return { handle: g("BLUESKY_HANDLE"), password: g("BLUESKY_APP_PASSWORD"), service: g("BLUESKY_SERVICE") || "https://bsky.social" }; }
export async function publishBluesky(cfg, { caption, imageUrl }) {
  if (!cfg.handle || !cfg.password) throw new Error("Bluesky not configured (BLUESKY_HANDLE / BLUESKY_APP_PASSWORD).");
  const s = await fetch(`${cfg.service}/xrpc/com.atproto.server.createSession`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ identifier: cfg.handle, password: cfg.password }) });
  const sd = await s.json(); if (!s.ok) throw new Error(sd?.message || "Bluesky login failed");
  const record = { $type: "app.bsky.feed.post", text: caption || "", createdAt: new Date().toISOString() };
  if (imageUrl) {
    const img = await fetch(imageUrl); const bytes = Buffer.from(await img.arrayBuffer());
    const up = await fetch(`${cfg.service}/xrpc/com.atproto.repo.uploadBlob`, { method: "POST", headers: { authorization: `Bearer ${sd.accessJwt}`, "content-type": img.headers.get("content-type") || "image/jpeg" }, body: bytes });
    const ud = await up.json(); if (!up.ok) throw new Error(ud?.message || "Bluesky blob upload failed");
    record.embed = { $type: "app.bsky.embed.images", images: [{ alt: "", image: ud.blob }] };
  }
  const post = await fetch(`${cfg.service}/xrpc/com.atproto.repo.createRecord`, { method: "POST", headers: { authorization: `Bearer ${sd.accessJwt}`, "content-type": "application/json" }, body: JSON.stringify({ repo: sd.did, collection: "app.bsky.feed.post", record }) });
  const pd = await post.json(); if (!post.ok) throw new Error(pd?.message || "Bluesky post failed");
  return { id: pd.uri || null };
}

// ---- Google Business Profile (local posts) ----
export function gbpCfg() {
  return {
    clientId: g("GBP_CLIENT_ID"), clientSecret: g("GBP_CLIENT_SECRET"), refreshToken: g("GBP_REFRESH_TOKEN"),
    account: g("GBP_ACCOUNT_ID"), location: g("GBP_LOCATION_ID"), ctaUrl: g("GBP_CTA_URL") || "https://medxflow.ai",
  };
}
let _gbpTok = null;
async function gbpAccessToken(cfg) {
  if (_gbpTok && Date.now() < _gbpTok.exp) return _gbpTok.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: cfg.refreshToken }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error_description || d.error || "GBP token refresh failed");
  _gbpTok = { token: d.access_token, exp: Date.now() + (d.expires_in - 60) * 1000 };
  return d.access_token;
}
export async function publishGBP(cfg, { caption, imageUrl }) {
  if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken || !cfg.account || !cfg.location) {
    throw new Error("Google Business Profile not configured (GBP_CLIENT_ID / SECRET / REFRESH_TOKEN / ACCOUNT_ID / LOCATION_ID).");
  }
  const token = await gbpAccessToken(cfg);
  const body = { languageCode: "en-US", summary: caption || "", topicType: "STANDARD" };
  if (imageUrl) body.media = [{ mediaFormat: "PHOTO", sourceUrl: imageUrl }];
  if (cfg.ctaUrl) body.callToAction = { actionType: "LEARN_MORE", url: cfg.ctaUrl };
  const res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${cfg.account}/locations/${cfg.location}/localPosts`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d?.error?.message || `Google Business HTTP ${res.status}`);
  return { id: d.name || null };
}

// ---- Discord (channel webhook) ----
export function discordCfg() { return { webhook: g("DISCORD_WEBHOOK_URL") }; }
export async function publishDiscord(cfg, { caption, imageUrl }) {
  if (!cfg.webhook) throw new Error("Discord not configured (DISCORD_WEBHOOK_URL).");
  const body = { content: caption || "" };
  if (imageUrl) body.embeds = [{ image: { url: imageUrl } }];
  const res = await fetch(cfg.webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error(t || `Discord HTTP ${res.status}`); }
  return { id: null };
}

// ---- TikTok (Content Posting API, OAuth) ----
export function tiktokCfg() {
  return {
    clientKey: g("TIKTOK_CLIENT_KEY"), clientSecret: g("TIKTOK_CLIENT_SECRET"),
    redirectUri: g("TIKTOK_REDIRECT_URI") || "https://medxflow.ai/callback",
    scope: g("TIKTOK_SCOPE") || "user.info.basic,video.publish,video.upload",
    // Unaudited/sandbox apps can only post SELF_ONLY (private). After production
    // approval, set TIKTOK_PRIVACY=PUBLIC_TO_EVERYONE.
    privacy: g("TIKTOK_PRIVACY") || "SELF_ONLY",
  };
}
const tiktokStore = () => getStore("social-oauth");
export async function tiktokTokens() { try { return await tiktokStore().get("tiktok", { type: "json" }); } catch { return null; } }
export async function tiktokSaveTokens(t) { await tiktokStore().setJSON("tiktok", t); }

export function tiktokAuthUrl(cfg, state) {
  const p = new URLSearchParams({ client_key: cfg.clientKey, scope: cfg.scope, response_type: "code", redirect_uri: cfg.redirectUri, state: state || "medxflow" });
  return `https://www.tiktok.com/v2/auth/authorize/?${p}`;
}
export async function tiktokExchangeCode(cfg, code) {
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: cfg.clientKey, client_secret: cfg.clientSecret, code, grant_type: "authorization_code", redirect_uri: cfg.redirectUri }),
  });
  const d = await res.json();
  if (!res.ok || d.error) throw new Error(d.error_description || d.error || "TikTok token exchange failed");
  const t = { access_token: d.access_token, refresh_token: d.refresh_token, open_id: d.open_id, scope: d.scope, exp: Date.now() + (d.expires_in - 60) * 1000 };
  await tiktokSaveTokens(t);
  return t;
}
async function tiktokValidToken(cfg) {
  const t = await tiktokTokens();
  if (!t?.refresh_token) throw new Error("TikTok not connected — click Connect in the Connections panel first.");
  if (t.access_token && Date.now() < (t.exp || 0)) return t.access_token;
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: cfg.clientKey, client_secret: cfg.clientSecret, grant_type: "refresh_token", refresh_token: t.refresh_token }),
  });
  const d = await res.json();
  if (!res.ok || d.error) throw new Error(d.error_description || d.error || "TikTok refresh failed");
  const nt = { access_token: d.access_token, refresh_token: d.refresh_token || t.refresh_token, open_id: t.open_id, scope: d.scope || t.scope, exp: Date.now() + (d.expires_in - 60) * 1000 };
  await tiktokSaveTokens(nt);
  return nt.access_token;
}
export async function publishTikTok(cfg, { caption, videoUrl }) {
  if (!cfg.clientKey || !cfg.clientSecret) throw new Error("TikTok not configured (TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET).");
  if (!videoUrl) throw new Error("TikTok needs a video URL (from a verified domain).");
  const token = await tiktokValidToken(cfg);
  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ post_info: { title: (caption || "").slice(0, 150), privacy_level: cfg.privacy }, source_info: { source: "PULL_FROM_URL", video_url: videoUrl } }),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok || (d?.error && d.error.code && d.error.code !== "ok")) throw new Error(d?.error?.message || `TikTok HTTP ${res.status}`);
  return { id: d?.data?.publish_id || null };
}

// ---- Reddit (submit to a subreddit) ----
export function redditCfg() {
  return { clientId: g("REDDIT_CLIENT_ID"), clientSecret: g("REDDIT_CLIENT_SECRET"), refreshToken: g("REDDIT_REFRESH_TOKEN"), userAgent: g("REDDIT_USER_AGENT") || "MedXFlow/1.0", subreddit: g("REDDIT_SUBREDDIT") };
}
let _redTok = null;
async function redditAccessToken(cfg) {
  if (_redTok && Date.now() < _redTok.exp) return _redTok.token;
  const basic = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: { authorization: `Basic ${basic}`, "content-type": "application/x-www-form-urlencoded", "user-agent": cfg.userAgent },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: cfg.refreshToken }),
  });
  const d = await res.json();
  if (!res.ok || !d.access_token) throw new Error(d.error || "Reddit token refresh failed");
  _redTok = { token: d.access_token, exp: Date.now() + (d.expires_in - 60) * 1000 };
  return d.access_token;
}
export async function publishReddit(cfg, { caption, imageUrl }) {
  if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken || !cfg.subreddit) throw new Error("Reddit not configured (REDDIT_CLIENT_ID / SECRET / REFRESH_TOKEN / SUBREDDIT).");
  const token = await redditAccessToken(cfg);
  const title = (caption || "").split("\n")[0].slice(0, 300) || "MedXFlow";
  const params = new URLSearchParams({ sr: cfg.subreddit, title, api_type: "json" });
  if (imageUrl) { params.set("kind", "link"); params.set("url", imageUrl); }
  else { params.set("kind", "self"); params.set("text", caption || ""); }
  const res = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/x-www-form-urlencoded", "user-agent": cfg.userAgent }, body: params,
  });
  const d = await res.json().catch(() => ({}));
  const err = d?.json?.errors?.length ? d.json.errors[0].join(" ") : null;
  if (!res.ok || err) throw new Error(err || `Reddit HTTP ${res.status}`);
  return { id: d?.json?.data?.name || d?.json?.data?.id || null };
}

// ---- Tumblr (create a post on a blog) ----
export function tumblrCfg() {
  return { token: g("TUMBLR_ACCESS_TOKEN"), blog: g("TUMBLR_BLOG_ID") };
}
export async function publishTumblr(cfg, { caption, imageUrl }) {
  if (!cfg.token || !cfg.blog) throw new Error("Tumblr not configured (TUMBLR_ACCESS_TOKEN / TUMBLR_BLOG_ID).");
  const content = [];
  if (imageUrl) content.push({ type: "image", media: [{ url: imageUrl }] });
  if (caption) content.push({ type: "text", text: caption });
  const res = await fetch(`https://api.tumblr.com/v2/blog/${cfg.blog}/posts`, {
    method: "POST", headers: { authorization: `Bearer ${cfg.token}`, "content-type": "application/json" }, body: JSON.stringify({ content }),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok || (d.meta && d.meta.status >= 400)) throw new Error(d?.errors?.[0]?.detail || d?.meta?.msg || `Tumblr HTTP ${res.status}`);
  return { id: d?.response?.id || null };
}

// ---- YouTube (video upload, Data API v3, OAuth) ----
export function youtubeCfg() {
  return { clientId: g("YOUTUBE_CLIENT_ID"), clientSecret: g("YOUTUBE_CLIENT_SECRET"), refreshToken: g("YOUTUBE_REFRESH_TOKEN"), privacy: g("YOUTUBE_PRIVACY") || "public" };
}
let _ytTok = null;
async function ytAccessToken(cfg) {
  if (_ytTok && Date.now() < _ytTok.exp) return _ytTok.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: cfg.refreshToken }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error_description || d.error || "YouTube token refresh failed");
  _ytTok = { token: d.access_token, exp: Date.now() + (d.expires_in - 60) * 1000 };
  return d.access_token;
}
export async function publishYouTube(cfg, { title, description, videoUrl }) {
  if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken) throw new Error("YouTube not configured (YOUTUBE_CLIENT_ID / SECRET / REFRESH_TOKEN).");
  if (!videoUrl) throw new Error("YouTube needs a video URL (a public .mp4).");
  const token = await ytAccessToken(cfg);
  const vid = await fetch(videoUrl);
  if (!vid.ok) throw new Error("Couldn't fetch the video URL.");
  const bytes = Buffer.from(await vid.arrayBuffer());
  const contentType = vid.headers.get("content-type") || "video/mp4";
  const meta = { snippet: { title: (title || "MedXFlow").slice(0, 100), description: description || "" }, status: { privacyStatus: cfg.privacy } };
  // 1) initialise a resumable upload
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=UTF-8", "X-Upload-Content-Type": contentType, "X-Upload-Content-Length": String(bytes.length) },
    body: JSON.stringify(meta),
  });
  if (!init.ok) { const e = await init.json().catch(() => ({})); throw new Error(e?.error?.message || `YouTube init HTTP ${init.status}`); }
  const uploadUrl = init.headers.get("location");
  // 2) upload the bytes
  const up = await fetch(uploadUrl, { method: "PUT", headers: { "content-type": contentType, "content-length": String(bytes.length) }, body: bytes });
  const ud = await up.json().catch(() => ({}));
  if (!up.ok) throw new Error(ud?.error?.message || `YouTube upload HTTP ${up.status}`);
  return { id: ud.id || null };
}

// ---- Mastodon ----
export function mastodonCfg() { return { url: (g("MASTODON_URL") || "").replace(/\/+$/, ""), token: g("MASTODON_TOKEN") }; }
export async function publishMastodon(cfg, { caption, imageUrl }) {
  if (!cfg.url || !cfg.token) throw new Error("Mastodon not configured (MASTODON_URL / MASTODON_TOKEN).");
  let mediaId;
  if (imageUrl) {
    const img = await fetch(imageUrl); const bytes = Buffer.from(await img.arrayBuffer());
    const fd = new FormData();
    fd.append("file", new Blob([bytes], { type: img.headers.get("content-type") || "image/jpeg" }), "image.jpg");
    const m = await fetch(`${cfg.url}/api/v2/media`, { method: "POST", headers: { authorization: `Bearer ${cfg.token}` }, body: fd });
    const md = await m.json(); if (!m.ok) throw new Error(md?.error || "Mastodon media failed"); mediaId = md.id;
  }
  const body = { status: caption || "" }; if (mediaId) body.media_ids = [mediaId];
  const res = await fetch(`${cfg.url}/api/v1/statuses`, { method: "POST", headers: { authorization: `Bearer ${cfg.token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json(); if (!res.ok) throw new Error(d?.error || "Mastodon post failed");
  return { id: d.id || null };
}
