import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { authorize, json } from "../lib/auth.mjs";

// Google Search Console — real impressions/clicks/position for the property.
// Uses a service-account JWT signed with node:crypto (no dependencies). Returns
// { configured:false } with setup guidance until the env vars are present.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${b64url(header)}.${b64url(claim)}`;
  const signature = crypto.createSign("RSA-SHA256").update(signingInput).sign(sa.private_key).toString("base64url");
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || "token request failed");
  return data.access_token;
}

async function query(token, siteUrl, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `GSC HTTP ${res.status}`);
  return data;
}

const ymd = (d) => d.toISOString().slice(0, 10);

export default async (req) => {
  const auth = authorize(req, null);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const creds = readCreds();
  const rawSa = process.env.GSC_SERVICE_ACCOUNT || creds.GSC_SERVICE_ACCOUNT || "";
  const siteUrl = process.env.GSC_SITE_URL || creds.GSC_SITE_URL || "";
  if (!rawSa || !siteUrl) {
    return json({ configured: false, reason: "Set GSC_SERVICE_ACCOUNT and GSC_SITE_URL to connect." });
  }

  let sa;
  try { sa = typeof rawSa === "string" ? JSON.parse(rawSa) : rawSa; }
  catch { return json({ configured: false, reason: "GSC_SERVICE_ACCOUNT is not valid JSON." }); }
  if (!sa.client_email || !sa.private_key) {
    return json({ configured: false, reason: "Service-account JSON is missing client_email / private_key." });
  }

  try {
    const token = await getAccessToken(sa);
    const end = new Date(Date.now() - 2 * 864e5);   // GSC data lags ~2 days
    const start = new Date(Date.now() - 30 * 864e5);
    const range = { startDate: ymd(start), endDate: ymd(end) };

    const [totalsRes, rowsRes] = await Promise.all([
      query(token, siteUrl, { ...range }),
      query(token, siteUrl, { ...range, dimensions: ["query"], rowLimit: 20 }),
    ]);

    return json({
      configured: true,
      range,
      totals: totalsRes.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      rows: (rowsRes.rows || []).map((r) => ({
        query: r.keys?.[0] || "—",
        clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position,
      })),
    });
  } catch (err) {
    // Configured but the call failed — surface why (bad key, no access, etc.).
    return json({ configured: false, reason: `Connection failed: ${err.message}` });
  }
};
