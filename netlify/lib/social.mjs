import fs from "node:fs";
import path from "node:path";

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
