import { authorize, json } from "../lib/auth.mjs";
import { tiktokCfg, tiktokAuthUrl } from "../lib/social.mjs";

// Returns the TikTok authorize URL to start the OAuth connect flow.
export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const cfg = tiktokCfg();
  if (!cfg.clientKey || !cfg.clientSecret) return json({ error: "Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET first." }, 400);
  return json({ url: tiktokAuthUrl(cfg, "medxflow") });
};
