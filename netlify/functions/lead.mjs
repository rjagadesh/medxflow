import { getStore } from "@netlify/blobs";
import fs from "node:fs";
import path from "node:path";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}

// Notify the team of a new booking via Microsoft Graph (client credentials).
// Non-fatal: if creds are absent or the send fails, the lead is still stored.
async function emailBooking(record) {
  const c = readCreds();
  const tenant = process.env.MS_TENANT_ID || c.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID || c.MS_CLIENT_ID;
  const secret = process.env.MS_CLIENT_SECRET || c.MS_CLIENT_SECRET;
  const sender = process.env.MS_SENDER || c.MS_SENDER || String(process.env.MS_SENDERS || c.MS_SENDERS || "").split(",")[0].trim();
  if (!tenant || !clientId || !secret || !sender) return { skipped: "no graph creds" };

  const tokRes = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: secret, scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials" }),
  });
  const tok = await tokRes.json().catch(() => ({}));
  if (!tok.access_token) throw new Error(tok.error_description || tok.error || "token failed");

  const rows = [
    ["Name", record.name], ["Email", record.email], ["Company", record.clinic],
    ["Phone", record.phone], ["Requested slot", record.preferredTime], ["Message", record.message],
    ["Page", record.page], ["Location", [record.geo?.city, record.geo?.region, record.geo?.country].filter(Boolean).join(", ")],
    ["Submitted", record.at],
  ].filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:4px 14px 4px 0;color:#5A6B7E;font-weight:600">${esc(k)}</td><td style="padding:4px 0;color:#0D2B52">${esc(v)}</td></tr>`
  ).join("");
  const html = `<div style="font-family:Arial,sans-serif"><h2 style="color:#0D2B52;margin:0 0 12px">New demo booking</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table><p style="font-size:12px;color:#8aa;margin-top:16px">Sent automatically from the MedXFlow booking form.</p></div>`;

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: "POST",
    headers: { authorization: `Bearer ${tok.access_token}`, "content-type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: `New demo booking: ${record.name}${record.clinic ? " (" + record.clinic + ")" : ""}${record.preferredTime ? " - " + record.preferredTime : ""}`,
        body: { contentType: "HTML", content: html },
        toRecipients: [{ emailAddress: { address: "jay@medxflow.ai" } }],
        replyTo: record.email ? [{ emailAddress: { address: record.email } }] : undefined,
      },
      saveToSentItems: true,
    }),
  });
  if (res.status !== 202) { const d = await res.json().catch(() => ({})); throw new Error(d?.error?.message || `sendMail HTTP ${res.status}`); }
  return { sent: true };
}

// Captures a demo request / lead from the on-page form or the CTA modal.
export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  if (!name || !isEmail(email)) {
    return json({ error: "Name and a valid email are required." }, 400);
  }

  const geo = context?.geo || {};
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    id,
    at: new Date().toISOString(),
    name,
    email,
    clinic: String(body.clinic || "").trim() || null,
    phone: String(body.phone || "").trim() || null,
    bookDate: String(body.bookDate || "").trim() || null,
    bookTime: String(body.bookTime || "").trim() || null,
    preferredTime: String(body.preferredTime || "").trim() || null,
    message: String(body.message || "").trim() || null,
    source: body.source || "cta",
    page: body.page || null,
    visitorId: body.visitorId || null,
    ip:
      context?.ip ||
      req.headers.get("x-nf-client-connection-ip") ||
      req.headers.get("x-forwarded-for") ||
      null,
    geo: {
      country: geo?.country?.name || null,
      region: geo?.subdivision?.name || null,
      city: geo?.city || null,
    },
  };

  try {
    const store = getStore("leads");
    await store.setJSON(id, record);
  } catch (err) {
    console.error("lead store error:", err.message);
    return json({ error: "Could not save. Please email sales@medxflow.ai." }, 500);
  }

  // Notify the team (jay@medxflow.ai). Non-fatal: never block the booking.
  try {
    await emailBooking(record);
  } catch (err) {
    console.error("lead notify error:", err.message);
  }

  return json({ ok: true });
};
