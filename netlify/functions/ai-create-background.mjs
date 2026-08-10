import { getStore } from "@netlify/blobs";
import { config } from "../lib/auth.mjs";
import { veoCfg, generateVeoVideo } from "../lib/veo.mjs";
import { youtubeCfg, uploadYouTube, metaCfg, publishFacebook, publishInstagram } from "../lib/social.mjs";

// Background worker (up to 15 min): generate a video from image+prompt with Veo,
// store it, upload to YouTube, and post the image to Facebook/Instagram.
const jobs = () => getStore("ai-jobs");
const media = () => getStore("media");
const baseUrl = () => (process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888").replace(/\/+$/, "");

export default async (req) => {
  let body = {};
  try { body = await req.json(); } catch {}
  if (body.secret !== config().secret) return new Response("forbidden", { status: 403 });

  const s = jobs();
  const id = body.id;
  const set = async (patch) => { try { const j = (await s.get(id, { type: "json" })) || { id }; await s.setJSON(id, { ...j, ...patch, updatedAt: new Date().toISOString() }); } catch {} };

  try {
    // 1) image → base64 (Veo can take an input image)
    let imageBase64 = null, imgMime = "image/png";
    if (body.imageUrl) {
      await set({ status: "running", step: "fetching image" });
      const r = await fetch(body.imageUrl);
      if (!r.ok) throw new Error("Couldn't fetch the source image.");
      imgMime = r.headers.get("content-type") || "image/png";
      imageBase64 = Buffer.from(await r.arrayBuffer()).toString("base64");
    }

    // 2) generate the video with Veo
    await set({ status: "running", step: "generating video (this can take a few minutes)" });
    const { videoBase64, mimeType } = await generateVeoVideo(veoCfg(), { prompt: body.prompt, imageBase64, mimeType: imgMime, onStatus: (m) => set({ step: m }) });

    // 3) store the video → public URL
    await set({ step: "saving video" });
    const vidId = `media-vid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    await media().set(vidId, Buffer.from(videoBase64, "base64"), { metadata: { contentType: mimeType, name: "ai-video.mp4" } });
    const videoUrl = `${baseUrl()}/.netlify/functions/media-file?id=${vidId}`;
    const results = { videoUrl };

    // 4) upload to YouTube
    if (body.channels.includes("youtube")) {
      await set({ step: "uploading to YouTube" });
      try {
        const yt = await uploadYouTube(youtubeCfg(), { title: body.title || (body.prompt || "MedXFlow").slice(0, 80), description: body.prompt, tags: (body.tags || "").split(",").map((t) => t.trim()).filter(Boolean), privacy: body.privacy || "unlisted", videoUrl });
        results.youtube = { ok: true, url: yt.id ? `https://youtu.be/${yt.id}` : null };
      } catch (e) { results.youtube = { ok: false, error: e.message }; }
    }

    // 5) post the image to Facebook / Instagram
    if (body.imageUrl && body.channels.includes("facebook")) {
      await set({ step: "posting to Facebook" });
      try { await publishFacebook(metaCfg(), { caption: body.prompt, imageUrl: body.imageUrl }); results.facebook = { ok: true }; }
      catch (e) { results.facebook = { ok: false, error: e.message }; }
    }
    if (body.imageUrl && body.channels.includes("instagram")) {
      await set({ step: "posting to Instagram" });
      try { await publishInstagram(metaCfg(), { caption: body.prompt, imageUrl: body.imageUrl }); results.instagram = { ok: true }; }
      catch (e) { results.instagram = { ok: false, error: e.message }; }
    }

    await set({ status: "done", step: "done", results });
  } catch (e) {
    await set({ status: "error", step: "error", error: e.message });
  }
  return new Response("ok", { status: 200 });
};
