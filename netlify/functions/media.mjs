import { getStore } from "@netlify/blobs";
import { authorize, json } from "../lib/auth.mjs";

// Media library - upload files into the portal (Netlify Blobs), each gets a
// public URL served by media-file.mjs. list / upload / delete.

const store = () => getStore("media");
const INDEX = "__index__";
const baseUrl = () => (process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888").replace(/\/+$/, "");
const withUrl = (it) => ({ ...it, url: `${baseUrl()}/.netlify/functions/media-file?id=${it.id}` });

async function readIndex(s) {
  try { return (await s.get(INDEX, { type: "json" })) || []; } catch { return []; }
}

export default async (req) => {
  const auth = authorize(req, "media");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "list";
  const s = store();

  try {
    if (action === "list") {
      const idx = await readIndex(s);
      idx.sort((a, b) => String(b.uploadedAt || "").localeCompare(String(a.uploadedAt || "")));
      return json({ ok: true, files: idx.map(withUrl) });
    }

    if (action === "upload") {
      const m = /^data:([^;]+);base64,(.+)$/s.exec(body.dataUrl || "");
      if (!m) return json({ error: "Invalid file data." }, 400);
      const contentType = m[1];
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > 15 * 1024 * 1024) return json({ error: "File too large (max 15 MB)." }, 400);
      const id = `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      await s.set(id, buf, { metadata: { contentType, name: body.name || "" } });
      const item = { id, name: body.name || id, contentType, size: buf.length, uploadedAt: new Date().toISOString() };
      const idx = await readIndex(s);
      idx.push(item);
      await s.setJSON(INDEX, idx);
      return json({ ok: true, file: withUrl(item) });
    }

    if (action === "delete") {
      const id = body.id;
      if (!id) return json({ error: "id required" }, 400);
      try { await s.delete(id); } catch {}
      const idx = (await readIndex(s)).filter((x) => x.id !== id);
      await s.setJSON(INDEX, idx);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
