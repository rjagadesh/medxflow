import fs from "node:fs";
import path from "node:path";

// Google Ads API — pull account metrics (impressions, clicks, cost, conversions)
// as a daily series via GAQL. Uses an OAuth refresh token + developer token.
// Config from env / creds.json. No dependencies.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
const g = (k) => process.env[k] || readCreds()[k] || "";

export function googleAdsCfg() {
  return {
    version: g("GOOGLE_ADS_API_VERSION") || "v18",
    developerToken: g("GOOGLE_ADS_DEVELOPER_TOKEN"),
    // OAuth can reuse the same Google app as YouTube, but the refresh token must
    // have been granted the AdWords scope, so keep it separate.
    clientId: g("GOOGLE_ADS_CLIENT_ID") || g("YOUTUBE_CLIENT_ID"),
    clientSecret: g("GOOGLE_ADS_CLIENT_SECRET") || g("YOUTUBE_CLIENT_SECRET"),
    refreshToken: g("GOOGLE_ADS_REFRESH_TOKEN"),
    customerId: (g("GOOGLE_ADS_CUSTOMER_ID") || "").replace(/-/g, ""),
    loginCustomerId: (g("GOOGLE_ADS_LOGIN_CUSTOMER_ID") || "").replace(/-/g, ""),
  };
}

export function googleAdsReady(cfg = googleAdsCfg()) {
  return !!(cfg.developerToken && cfg.clientId && cfg.clientSecret && cfg.refreshToken && cfg.customerId);
}

async function accessToken(cfg) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: cfg.refreshToken }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error_description || d.error || "Google Ads token failed");
  return d.access_token;
}

async function gaql(cfg, token, query) {
  const rows = [];
  let pageToken;
  do {
    const res = await fetch(`https://googleads.googleapis.com/${cfg.version}/customers/${cfg.customerId}/googleAds:search`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "developer-token": cfg.developerToken,
        ...(cfg.loginCustomerId ? { "login-customer-id": cfg.loginCustomerId } : {}),
        "content-type": "application/json",
      },
      body: JSON.stringify(pageToken ? { query, pageToken } : { query }),
    });
    const d = await res.json();
    if (!res.ok) {
      const msg = d?.error?.message || d?.[0]?.error?.message || `Google Ads HTTP ${res.status}`;
      throw new Error(msg);
    }
    for (const r of d.results || []) rows.push(r);
    pageToken = d.nextPageToken;
  } while (pageToken);
  return rows;
}

// Daily metrics for the last `days` days → { points:[{d, impressions, clicks,
// cost, conversions}], totals:{...}, currency }.
export async function googleAdsMetrics(cfg, days = 28) {
  const token = await accessToken(cfg);
  const cur = await gaql(cfg, token, "SELECT customer.currency_code FROM customer LIMIT 1");
  const currency = cur?.[0]?.customer?.currencyCode || "USD";
  const rows = await gaql(cfg, token,
    `SELECT segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions ` +
    `FROM customer WHERE segments.date DURING LAST_${days === 7 ? 7 : days === 14 ? 14 : 30}_DAYS ORDER BY segments.date`);
  // Aggregate per day (customer-level rows are already one per date, but be safe).
  const byDay = new Map();
  for (const r of rows) {
    const d = r.segments?.date;
    const m = r.metrics || {};
    const e = byDay.get(d) || { d, impressions: 0, clicks: 0, cost: 0, conversions: 0 };
    e.impressions += Number(m.impressions || 0);
    e.clicks += Number(m.clicks || 0);
    e.cost += Number(m.costMicros || 0) / 1e6;
    e.conversions += Number(m.conversions || 0);
    byDay.set(d, e);
  }
  const points = [...byDay.values()].sort((a, b) => a.d.localeCompare(b.d));
  const totals = points.reduce((t, p) => ({
    impressions: t.impressions + p.impressions, clicks: t.clicks + p.clicks,
    cost: t.cost + p.cost, conversions: t.conversions + p.conversions,
  }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 });
  totals.ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
  totals.avgCpc = totals.clicks ? totals.cost / totals.clicks : 0;
  totals.costPerConv = totals.conversions ? totals.cost / totals.conversions : 0;
  return { points, totals, currency };
}
