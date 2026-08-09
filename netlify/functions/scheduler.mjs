import { authorize, json } from "../lib/auth.mjs";
import { store, listPosts, publishPost } from "../lib/scheduler-core.mjs";

const rid = () => `sp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const CHANNELS = ["facebook", "instagram", "linkedin", "threads", "gbp", "youtube", "telegram", "bluesky", "mastodon", "reddit", "tumblr", "whatsapp"];

export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "list";
  const s = store();

  try {
    if (action === "time") return json({ ok: true, now: new Date().toISOString() });
    if (action === "list") return json({ ok: true, posts: await listPosts() });

    if (action === "create") {
      const channels = (body.channels || []).filter((c) => CHANNELS.includes(c));
      if (!channels.length) return json({ error: "Pick at least one channel." }, 400);
      if (!body.caption && !body.imageUrl) return json({ error: "Add a caption or an image." }, 400);
      if (channels.includes("instagram") && !body.imageUrl) return json({ error: "Instagram posts need an image." }, 400);
      if (channels.includes("youtube") && !body.videoUrl) return json({ error: "YouTube needs a video URL." }, 400);
      const waRecipients = (body.waRecipients || []).map((x) => String(x).replace(/[^\d]/g, "")).filter(Boolean);
      if (channels.includes("whatsapp") && !waRecipients.length) return json({ error: "WhatsApp needs at least one recipient number." }, 400);
      const post = {
        id: rid(),
        imageUrl: body.imageUrl || "",
        imageId: body.imageId || "",
        videoUrl: body.videoUrl || "",
        caption: body.caption || "",
        channels,
        waRecipients,
        scheduledAt: body.scheduledAt || new Date().toISOString(),
        status: "scheduled",
        results: {},
        createdAt: new Date().toISOString(),
      };
      await s.setJSON(post.id, post);
      return json({ ok: true, post });
    }

    if (action === "delete") {
      if (body.id) await s.delete(body.id);
      return json({ ok: true });
    }

    if (action === "postNow") {
      const p = await s.get(body.id, { type: "json" });
      if (!p) return json({ error: "Post not found." }, 404);
      await publishPost(p);
      await s.setJSON(p.id, p);
      return json({ ok: true, post: p });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
