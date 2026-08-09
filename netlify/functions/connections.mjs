import { authorize, json } from "../lib/auth.mjs";
import { metaCfg, waCfg, linkedinCfg, threadsCfg, telegramCfg, blueskyCfg, mastodonCfg, gbpCfg } from "../lib/social.mjs";

// Reports which social platforms are configured (booleans only - never returns
// the secret values) plus the env vars each needs, for the Connections panel.
export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const meta = metaCfg(), wa = waCfg(), li = linkedinCfg(), th = threadsCfg(), tg = telegramCfg(), bs = blueskyCfg(), ma = mastodonCfg(), gb = gbpCfg();
  const connections = [
    { key: "facebook", label: "Facebook", ic: "📘", ok: !!(meta.pageId && meta.token), vars: ["META_PAGE_ID", "META_PAGE_TOKEN"], note: "Meta app + Page token" },
    { key: "instagram", label: "Instagram", ic: "📷", ok: !!(meta.igId && meta.token), vars: ["META_IG_ID", "META_PAGE_TOKEN"], note: "Linked to the Page" },
    { key: "whatsapp", label: "WhatsApp", ic: "🟢", ok: !!(wa.token && wa.phoneId), vars: ["META_WHATSAPP_TOKEN", "META_WHATSAPP_PHONE_ID"], note: "WhatsApp Cloud API" },
    { key: "linkedin", label: "LinkedIn", ic: "💼", ok: !!(li.token && li.org), vars: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_ORG_ID"], note: "Community Management API (approval needed)" },
    { key: "threads", label: "Threads", ic: "🧵", ok: !!(th.token && th.userId), vars: ["THREADS_TOKEN", "THREADS_USER_ID"], note: "Threads API (Meta)" },
    { key: "gbp", label: "Google Business", ic: "📍", ok: !!(gb.clientId && gb.refreshToken && gb.account && gb.location), vars: ["GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN", "GBP_ACCOUNT_ID", "GBP_LOCATION_ID"], note: "Business Profile API — OAuth (approval needed)" },
    { key: "telegram", label: "Telegram", ic: "✈️", ok: !!(tg.token && tg.chatId), vars: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"], note: "BotFather bot + channel id — free, instant" },
    { key: "bluesky", label: "Bluesky", ic: "🦋", ok: !!(bs.handle && bs.password), vars: ["BLUESKY_HANDLE", "BLUESKY_APP_PASSWORD"], note: "Handle + app password — free, instant" },
    { key: "mastodon", label: "Mastodon", ic: "🐘", ok: !!(ma.url && ma.token), vars: ["MASTODON_URL", "MASTODON_TOKEN"], note: "Instance URL + access token — free, instant" },
  ];
  return json({ connections });
};
