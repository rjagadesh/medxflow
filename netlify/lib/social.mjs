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

export async function sendWhatsAppImage(cfg, { to, imageUrl, caption }) {
  if (!cfg.token || !cfg.phoneId) throw new Error("WhatsApp not configured.");
  const digits = String(to).replace(/[^\d]/g, "");
  return graph(cfg.version, `${cfg.phoneId}/messages`, {
    token: cfg.token, method: "POST",
    body: { messaging_product: "whatsapp", to: digits, type: "image", image: { link: imageUrl, caption } },
  });
}
