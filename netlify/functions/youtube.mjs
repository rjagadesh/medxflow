import { authorize, json } from "../lib/auth.mjs";
import { youtubeCfg, youtubeAccessToken, uploadYouTube } from "../lib/social.mjs";

const API = "https://www.googleapis.com/youtube/v3";

async function yt(token, path) {
  const res = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${token}` } });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d?.error?.message || `YouTube HTTP ${res.status}`);
  return d;
}

export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const cfg = youtubeCfg();
  if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken) {
    return json({ configured: false, reason: "Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN to connect YouTube." });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "channel";

  try {
    if (action === "channel") {
      const token = await youtubeAccessToken(cfg);
      const d = await yt(token, "/channels?part=snippet,statistics,contentDetails&mine=true");
      const c = d.items?.[0];
      if (!c) return json({ configured: true, channel: null });
      const uploads = c.contentDetails?.relatedPlaylists?.uploads || null;
      // statistics.videoCount only counts PUBLIC videos and lags for hours
      // after an upload; the uploads playlist's totalResults is the accurate,
      // immediate count (incl. unlisted/private), so prefer it when higher.
      let videoCount = Number(c.statistics.videoCount || 0);
      if (uploads) {
        const pl = await yt(token, `/playlistItems?part=id&maxResults=1&playlistId=${uploads}`);
        const total = Number(pl.pageInfo?.totalResults);
        if (Number.isFinite(total)) videoCount = Math.max(videoCount, total);
      }
      return json({
        configured: true,
        channel: {
          id: c.id, title: c.snippet.title, thumbnail: c.snippet.thumbnails?.default?.url || null,
          subscribers: c.statistics.subscriberCount, videos: String(videoCount), views: c.statistics.viewCount,
          uploadsPlaylist: uploads,
        },
      });
    }

    if (action === "videos") {
      const token = await youtubeAccessToken(cfg);
      const ch = await yt(token, "/channels?part=contentDetails&mine=true");
      const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploads) return json({ configured: true, videos: [] });
      const pl = await yt(token, `/playlistItems?part=snippet&maxResults=25&playlistId=${uploads}`);
      const items = pl.items || [];
      const ids = items.map((i) => i.snippet?.resourceId?.videoId).filter(Boolean);
      let stats = {};
      if (ids.length) {
        const s = await yt(token, `/videos?part=statistics,status&id=${ids.join(",")}`);
        for (const v of s.items || []) stats[v.id] = { views: v.statistics?.viewCount, likes: v.statistics?.likeCount, privacy: v.status?.privacyStatus };
      }
      return json({
        configured: true,
        videos: items.map((i) => {
          const id = i.snippet?.resourceId?.videoId;
          return {
            id, title: i.snippet?.title, publishedAt: i.snippet?.publishedAt,
            thumbnail: i.snippet?.thumbnails?.medium?.url || i.snippet?.thumbnails?.default?.url || null,
            url: `https://youtu.be/${id}`, views: stats[id]?.views ?? null, likes: stats[id]?.likes ?? null, privacy: stats[id]?.privacy ?? null,
          };
        }),
      });
    }

    if (action === "upload") {
      if (!body.videoUrl) return json({ error: "A video URL is required." }, 400);
      const tags = (body.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      const r = await uploadYouTube(cfg, { title: body.title, description: body.description, tags, privacy: body.privacy || "unlisted", videoUrl: body.videoUrl });
      return json({ ok: true, id: r.id, url: r.id ? `https://youtu.be/${r.id}` : null });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
