import { getStore } from "@netlify/blobs";
import {
  metaCfg, waCfg, linkedinCfg, threadsCfg, telegramCfg, blueskyCfg, mastodonCfg, gbpCfg, youtubeCfg, redditCfg, tumblrCfg,
  publishFacebook, publishInstagram, sendWhatsAppImage, publishLinkedIn,
  publishThreads, publishTelegram, publishBluesky, publishMastodon, publishGBP, publishYouTube, publishReddit, publishTumblr,
} from "./social.mjs";

export const store = () => getStore("scheduled-posts");

export async function listPosts() {
  const s = store();
  const { blobs } = await s.list();
  const out = [];
  for (const b of blobs) {
    try { const p = await s.get(b.key, { type: "json" }); if (p) out.push(p); } catch {}
  }
  out.sort((a, b) => String(a.scheduledAt || "").localeCompare(String(b.scheduledAt || "")));
  return out;
}

// Publish a post to all its channels; updates post.results and post.status.
export async function publishPost(post) {
  const results = post.results || {};
  for (const ch of post.channels || []) {
    try {
      if (ch === "facebook") {
        const r = await publishFacebook(metaCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.facebook = { ok: true, id: r.post_id || r.id || null };
      } else if (ch === "instagram") {
        const r = await publishInstagram(metaCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.instagram = { ok: true, id: r.id || null };
      } else if (ch === "linkedin") {
        const r = await publishLinkedIn(linkedinCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.linkedin = { ok: true, id: r.id || null };
      } else if (ch === "threads") {
        const r = await publishThreads(threadsCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.threads = { ok: true, id: r.id || null };
      } else if (ch === "telegram") {
        const r = await publishTelegram(telegramCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.telegram = { ok: true, id: r.id || null };
      } else if (ch === "bluesky") {
        const r = await publishBluesky(blueskyCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.bluesky = { ok: true, id: r.id || null };
      } else if (ch === "mastodon") {
        const r = await publishMastodon(mastodonCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.mastodon = { ok: true, id: r.id || null };
      } else if (ch === "gbp") {
        const r = await publishGBP(gbpCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.gbp = { ok: true, id: r.id || null };
      } else if (ch === "youtube") {
        const r = await publishYouTube(youtubeCfg(), { title: (post.caption || "").split("\n")[0], description: post.caption, videoUrl: post.videoUrl });
        results.youtube = { ok: true, id: r.id || null };
      } else if (ch === "reddit") {
        const r = await publishReddit(redditCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.reddit = { ok: true, id: r.id || null };
      } else if (ch === "tumblr") {
        const r = await publishTumblr(tumblrCfg(), { caption: post.caption, imageUrl: post.imageUrl });
        results.tumblr = { ok: true, id: r.id || null };
      } else if (ch === "whatsapp") {
        const cfg = waCfg();
        const sent = [];
        for (const to of post.waRecipients || []) {
          try { const r = await sendWhatsAppImage(cfg, { to, imageUrl: post.imageUrl, caption: post.caption }); sent.push({ to, ok: true, id: r.messages?.[0]?.id || null }); }
          catch (e) { sent.push({ to, ok: false, error: e.message }); }
        }
        results.whatsapp = { ok: sent.some((x) => x.ok), sent };
      }
    } catch (e) {
      results[ch] = { ok: false, error: e.message };
    }
  }
  post.results = results;
  const st = (post.channels || []).map((c) => results[c]?.ok);
  post.status = st.length && st.every(Boolean) ? "posted" : st.some(Boolean) ? "partial" : "failed";
  post.postedAt = new Date().toISOString();
  return { status: post.status };
}
