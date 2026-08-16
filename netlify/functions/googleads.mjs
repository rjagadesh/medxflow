import { authorize, json } from "../lib/auth.mjs";
import { googleAdsCfg, googleAdsReady, googleAdsMetrics } from "../lib/googleads.mjs";

// Google Ads metrics for the Social dashboard: 28-day totals + a daily series
// for the trend charts. Returns configured:false with guidance until the
// developer token + OAuth + customer id are set.
export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const cfg = googleAdsCfg();
  if (!googleAdsReady(cfg)) {
    return json({
      configured: false,
      reason: "Set GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_REFRESH_TOKEN and GOOGLE_ADS_CUSTOMER_ID to connect Google Ads.",
    });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const days = [7, 14, 28].includes(body.days) ? body.days : 28;

  try {
    const m = await googleAdsMetrics(cfg, days);
    return json({ configured: true, ...m });
  } catch (e) {
    return json({ configured: true, error: String(e.message || e) });
  }
};
