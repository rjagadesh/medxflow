import { authorize, json, config } from "../lib/auth.mjs";
import { getStore } from "@netlify/blobs";

// Start an AI create-and-publish job (image + prompt → Veo video → YouTube,
// image → FB/IG) and poll its status. The heavy work runs in the background
// worker (ai-create-background) because video generation takes minutes.
const store = () => getStore("ai-jobs");
const rid = () => `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const baseUrl = () => (process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888").replace(/\/+$/, "");

export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "start";
  const s = store();

  if (action === "status") {
    const j = await s.get(body.id, { type: "json" });
    return json(j || { error: "Job not found." });
  }

  if (action === "start") {
    const channels = (body.channels || ["youtube"]).filter((c) => ["youtube", "facebook", "instagram"].includes(c));
    if (!body.imageUrl && !body.prompt) return json({ error: "Add an image and/or a prompt." }, 400);
    if (!channels.length) return json({ error: "Pick at least one channel." }, 400);
    const id = rid();
    await s.setJSON(id, { id, status: "queued", step: "queued", prompt: body.prompt || "", channels, createdAt: new Date().toISOString(), results: {} });
    const payload = {
      id, secret: config().secret, imageUrl: body.imageUrl || "", prompt: body.prompt || "", channels,
      title: body.title || "", tags: body.tags || "", privacy: body.privacy || "unlisted",
    };
    // fire-and-forget the background worker (returns 202, keeps running)
    fetch(`${baseUrl()}/.netlify/functions/ai-create-background`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
    return json({ ok: true, id });
  }

  return json({ error: "Unknown action" }, 400);
};
