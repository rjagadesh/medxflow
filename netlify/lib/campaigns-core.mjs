import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

// ---------- config ----------
function readCreds() {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8"));
  } catch {
    return {};
  }
}

export function config() {
  const c = readCreds();
  const g = (k) => process.env[k] || c[k] || "";
  const host = g("SMTP_HOST");
  const user = g("SMTP_USER");
  const pass = g("SMTP_PASS");
  const smtpReady =
    host && user && pass && !user.includes("your@email.com") && pass !== "your-app-password";
  // Microsoft Graph (client-credentials) - preferred over SMTP when present.
  const msTenant = g("MS_TENANT_ID");
  const msClientId = g("MS_CLIENT_ID");
  const msClientSecret = g("MS_CLIENT_SECRET");
  const from = g("SMTP_FROM") || user;
  // Sender pool: MS_SENDERS may be a JSON array or a comma/newline list; falls
  // back to the single MS_SENDER / the SMTP_FROM address. Used for round-robin.
  const parseSenders = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    const s = String(raw).trim();
    if (s.startsWith("[")) { try { const a = JSON.parse(s); if (Array.isArray(a)) return a; } catch {} }
    return s.split(/[\n,;]+/);
  };
  const single = g("MS_SENDER") || (from.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [])[0] || user;
  const graphSenders = [
    ...new Set(
      parseSenders(process.env.MS_SENDERS || c.MS_SENDERS)
        .concat(single)
        .map((x) => String(x).trim().toLowerCase())
        .filter((x) => x.includes("@"))
    ),
  ];
  const graphSender = graphSenders[0] || single;
  const graphReady = !!(msTenant && msClientId && msClientSecret && graphSender);
  return {
    host,
    port: parseInt(g("SMTP_PORT") || "465", 10),
    user,
    pass,
    from,
    imapHost: g("IMAP_HOST") || "imap.gmail.com",
    imapPort: parseInt(g("IMAP_PORT") || "993", 10),
    baseUrl: (g("CAMPAIGN_BASE_URL") || process.env.URL || "http://localhost:8888").replace(/\/+$/, ""),
    adminPassword: g("ADMIN_PASSWORD"),
    msTenant,
    msClientId,
    msClientSecret,
    graphSender,
    graphSenders,
    graphReady,
    // Either transport means we can actually send (not simulate).
    smtpReady,
    sendReady: smtpReady || graphReady,
  };
}

export const store = () => getStore("campaigns");

// ---------- sender pool (editable, persisted in Blobs) ----------
// Overrides the env MS_SENDERS list when the admin edits + saves senders.
const settingsStore = () => getStore("campaign-settings");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getSenders(cfg) {
  try {
    const v = await settingsStore().get("senders", { type: "json" });
    if (Array.isArray(v) && v.length) return v;
  } catch {}
  return cfg.graphSenders || [];
}
export async function saveSenders(list) {
  const clean = [
    ...new Set(
      (list || [])
        .map((s) => String(s).trim().toLowerCase())
        .filter((s) => EMAIL_RE.test(s))
    ),
  ];
  await settingsStore().setJSON("senders", clean);
  return clean;
}

// ---------- Google Sheet status write-back (best-effort) ----------
// When a campaign was built from a Google Sheet tab, mirror each recipient's
// status/timestamp back into that tab. Silent no-op if Sheets isn't configured.
let _sheetsTok = null; // { token, exp }
async function sheetsAuth() {
  const c = readCreds();
  const g = (k) => process.env[k] || c[k] || "";
  const rawSa = g("GSC_SERVICE_ACCOUNT");
  const workbookId = g("SHEETS_WORKBOOK_ID");
  if (!rawSa || !workbookId) return null;
  const sa = typeof rawSa === "string" ? JSON.parse(rawSa) : rawSa;
  if (_sheetsTok && Date.now() < _sheetsTok.exp) return { token: _sheetsTok.token, workbookId };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const si = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = crypto.createSign("RSA-SHA256").update(si).sign(sa.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${si}.${sig}` }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error_description || d.error || "sheets token failed");
  _sheetsTok = { token: d.access_token, exp: Date.now() + 3300 * 1000 };
  return { token: d.access_token, workbookId };
}

export async function writeSheetStatus(campaign, recip, status, whenIso) {
  try {
    if (!campaign?.sheetTab || !recip?.email) return;
    const auth = await sheetsAuth();
    if (!auth) return;
    const { token, workbookId } = auth;
    const tab = campaign.sheetTab;
    const q = (x) => encodeURIComponent(x);
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${workbookId}`;
    // Find the recipient's row by email in column A.
    const colRes = await fetch(`${base}/values/${q(`'${tab}'!A1:A`)}`, { headers: { authorization: `Bearer ${token}` } });
    if (!colRes.ok) return;
    const col = await colRes.json();
    const idx = (col.values || []).findIndex((r) => String(r[0] || "").trim().toLowerCase() === recip.email.toLowerCase());
    if (idx < 0) return;
    const row = idx + 1;
    const ts = (whenIso || new Date().toISOString()).replace("T", " ").slice(0, 16);
    const tsCol = status === "opened" ? "F" : status === "replied" ? "G" : status === "sent" ? "E" : null;
    const data = [{ range: `'${tab}'!D${row}`, values: [[status]] }];
    if (tsCol) data.push({ range: `'${tab}'!${tsCol}${row}`, values: [[ts]] });
    await fetch(`${base}/values:batchUpdate`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ valueInputOption: "RAW", data }),
    });
  } catch {
    // best-effort: never let a Sheets hiccup break sending
  }
}

// ---------- data helpers ----------
export async function listCampaigns() {
  const s = store();
  const { blobs } = await s.list();
  const out = [];
  for (const b of blobs) {
    try {
      const c = await s.get(b.key, { type: "json" });
      if (c) out.push(c);
    } catch {}
  }
  out.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return out;
}

export const loadCampaign = (id) => store().get(id, { type: "json" });
export const saveCampaign = (c) => store().setJSON(c.id, c);

export function stats(c) {
  const r = c.recipients || [];
  const has = (s) => r.filter((x) => x.status === s).length;
  const sent = r.filter((x) => x.sentAt).length; // accepted by SMTP
  const bounced = has("bounced");
  const replied = has("replied");
  const unsub = has("unsubscribed");
  const failed = has("failed");
  const pending = has("pending");
  const delivered = Math.max(0, sent - bounced); // accepted and not bounced
  const opened = r.filter((x) => x.openedAt && !["replied", "unsubscribed", "bounced"].includes(x.status)).length;
  return {
    total: r.length,
    sent,
    delivered,
    bounced,
    opened,
    replied,
    unsubscribed: unsub,
    failed,
    pending,
    noResponse: Math.max(0, delivered - replied - unsub),
  };
}

// ---------- email building ----------
const esc = encodeURIComponent;

function personalize(text, recip) {
  const first = (recip.name || "").trim().split(/\s+/)[0] || "there";
  return String(text || "")
    .replace(/\{\{\s*firstName\s*\}\}/gi, first)
    .replace(/\{\{\s*name\s*\}\}/gi, recip.name || "there")
    .replace(/\{\{\s*email\s*\}\}/gi, recip.email);
}

function buildHtml(campaign, recip, msg, cfg) {
  const track = `${cfg.baseUrl}/.netlify/functions/campaign-track`;
  let body = personalize(msg.body, recip);
  // Simple paragraph handling if the body looks like plain text.
  if (!/<[a-z][\s\S]*>/i.test(body)) {
    body = body
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }
  // Route links through the click tracker.
  body = body.replace(/href="(https?:\/\/[^"]+)"/gi,
    (_m, u) => `href="${track}?t=c&c=${campaign.id}&e=${esc(recip.email)}&u=${esc(u)}"`);

  const unsub = `${track}?t=u&c=${campaign.id}&e=${esc(recip.email)}`;
  const pixel = `${track}?t=o&c=${campaign.id}&e=${esc(recip.email)}`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a2b28;max-width:600px">
${body}
<div style="margin-top:26px;padding-top:14px;border-top:1px solid #e5e5e5;font-size:12px;color:#999">
You're receiving this because you enquired about MedXFlow Health. <a href="${unsub}" style="color:#999">Unsubscribe</a>.
</div>
<img src="${pixel}" width="1" height="1" alt="" style="display:none">
</div>`;
}

// ---------- sending ----------
let _tx = null;
function transport(cfg) {
  if (_tx) return _tx;
  _tx = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  return _tx;
}

// ---- Microsoft Graph transport (client-credentials, no dependencies) ----
let _graphTok = null; // { token, exp }
async function graphToken(cfg) {
  if (_graphTok && Date.now() < _graphTok.exp) return _graphTok.token;
  const res = await fetch(`https://login.microsoftonline.com/${cfg.msTenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: cfg.msClientId,
      client_secret: cfg.msClientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.error || `token HTTP ${res.status}`);
  _graphTok = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return _graphTok.token;
}

async function sendViaGraph(cfg, { to, subject, html, unsubUrl, sender }) {
  const token = await graphToken(cfg);
  const from = sender || cfg.graphSender;
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          toRecipients: [{ emailAddress: { address: to } }],
          // Graph only allows custom headers prefixed with 'x-'; the standard
          // List-Unsubscribe is rejected, so we surface unsubscribe via the
          // in-body link instead. Keep a machine-readable x- hint for our own use.
          internetMessageHeaders: unsubUrl ? [{ name: "X-MedXFlow-Unsubscribe", value: unsubUrl }] : undefined,
        },
        saveToSentItems: true,
      }),
    }
  );
  if (res.status !== 202) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || `Graph sendMail HTTP ${res.status}`);
  }
}

async function sendOne(campaign, recip, msg, cfg, sender) {
  const html = buildHtml(campaign, recip, msg, cfg);
  const subject = personalize(msg.subject, recip);
  const unsubUrl = `${cfg.baseUrl}/.netlify/functions/campaign-track?t=u&c=${campaign.id}&e=${esc(recip.email)}`;
  // Prefer Microsoft Graph; fall back to SMTP; else simulate.
  if (cfg.graphReady) {
    await sendViaGraph(cfg, { to: recip.email, subject, html, unsubUrl, sender });
    return { simulated: false, via: "graph", from: sender || cfg.graphSender };
  }
  if (!cfg.smtpReady) {
    return { simulated: true };
  }
  await transport(cfg).sendMail({
    from: cfg.from,
    to: recip.email,
    subject,
    html,
    headers: { "List-Unsubscribe": `<${unsubUrl}>` },
  });
  return { simulated: false, via: "smtp" };
}

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms));

// The sender addresses to use for a campaign. When rotation is on and Graph has
// more than one sender, cycle through them round-robin (one mailbox per email);
// otherwise always the single default sender.
function senderPool(campaign, cfg, senders) {
  return campaign.rotateSenders && cfg.graphReady && (senders || []).length > 1
    ? senders
    : [senders?.[0] || cfg.graphSender];
}

// Send the initial email to pending recipients (batched to avoid timeouts).
export async function sendInitial(campaign, cfg, maxBatch = 30) {
  const msg = { subject: campaign.subject, body: campaign.body };
  const pool = senderPool(campaign, cfg, await getSenders(cfg));
  let cursor = campaign.rotateCursor || 0;
  let sent = 0,
    simulated = false;
  // Send to not-yet-sent recipients, including retrying previously failed ones.
  const pending = (campaign.recipients || []).filter((r) => r.status === "pending" || r.status === "failed");
  for (const r of pending.slice(0, maxBatch)) {
    const sender = pool[cursor % pool.length];
    cursor++;
    try {
      const res = await sendOne(campaign, r, msg, cfg, sender);
      simulated = res.simulated;
      r.status = "sent";
      r.sentAt = new Date().toISOString();
      r.lastSentAt = r.sentAt;
      if (res.from) r.sentFrom = res.from;
      delete r.error;
      sent++;
      await writeSheetStatus(campaign, r, "sent", r.sentAt);
    } catch (err) {
      r.status = "failed";
      r.error = String(err.message || err).slice(0, 200);
      await writeSheetStatus(campaign, r, "failed");
    }
    await DELAY(150);
  }
  campaign.rotateCursor = cursor;
  if (campaign.status === "draft") campaign.status = "active";
  campaign.updatedAt = new Date().toISOString();
  await saveCampaign(campaign);
  const remaining = (campaign.recipients || []).filter((r) => r.status === "pending" || r.status === "failed").length;
  return { sent, remaining, simulated };
}

// A recipient in one of these states never receives further follow-ups.
export const STOP_STATES = ["replied", "unsubscribed", "bounced", "failed"];

// Send the next due follow-up in the drip. Follow-ups go out on the campaign's
// send-days (e.g. Mon/Wed/Fri) with a minimum gap since the last email, and
// stop the moment someone replies / unsubscribes / bounces.
export async function sendFollowups(campaign, cfg, { respectDays = true, maxBatch = 60 } = {}) {
  const fups = campaign.followups || [];
  if (!fups.length) return { sent: 0, remaining: 0, simulated: !cfg.sendReady };

  const sendDays = campaign.sendDays && campaign.sendDays.length ? campaign.sendDays : [1, 2, 3, 4, 5];
  const minGap = campaign.minGapDays || 2;
  const today = new Date().getDay(); // 0=Sun … 6=Sat
  if (respectDays && !sendDays.includes(today)) {
    return { sent: 0, remaining: 0, skipped: "not a send day", simulated: !cfg.sendReady };
  }

  const now = Date.now();
  const due = (campaign.recipients || []).filter((r) => {
    if (!r.sentAt || STOP_STATES.includes(r.status)) return false;
    const i = r.followupsSent || 0;
    if (i >= fups.length) return false;
    const daysSince = (now - new Date(r.lastSentAt || r.sentAt).getTime()) / 86400000;
    return daysSince >= minGap;
  });

  const pool = senderPool(campaign, cfg, await getSenders(cfg));
  let cursor = campaign.rotateCursor || 0;
  let sent = 0,
    simulated = false;
  for (const r of due.slice(0, maxBatch)) {
    const i = r.followupsSent || 0;
    const sender = pool[cursor % pool.length];
    cursor++;
    try {
      const res = await sendOne(campaign, r, { subject: fups[i].subject, body: fups[i].body }, cfg, sender);
      simulated = res.simulated;
      r.followupsSent = i + 1;
      r.lastSentAt = new Date().toISOString();
      if (res.from) r.sentFrom = res.from;
      sent++;
    } catch (err) {
      r.error = String(err.message || err).slice(0, 200);
    }
    await DELAY(150);
  }
  campaign.rotateCursor = cursor;
  campaign.updatedAt = new Date().toISOString();
  await saveCampaign(campaign);
  return { sent, remaining: Math.max(0, due.length - maxBatch), simulated };
}

// Read the Gmail inbox (IMAP) to detect replies (→ stop follow-ups) and
// bounce-backs (→ marked "not delivered"). Idempotent; safe to run often.
export async function syncInbox(cfg) {
  if (!cfg.smtpReady) return { replies: 0, bounces: 0, skipped: "no mailbox credentials" };

  const campaigns = await listCampaigns();
  const active = campaigns.filter((c) => c.status === "active");
  const map = new Map(); // email -> { c, r }
  for (const c of active) for (const r of c.recipients || []) map.set(r.email, { c, r });
  if (!map.size) return { replies: 0, bounces: 0 };

  const client = new ImapFlow({
    host: cfg.imapHost,
    port: cfg.imapPort,
    secure: true,
    auth: { user: cfg.user, pass: cfg.pass },
    logger: false,
  });

  let replies = 0,
    bounces = 0;
  const changed = new Set();
  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      const since = new Date(Date.now() - 7 * 86400000);
      for await (const msg of client.fetch({ since }, { envelope: true, source: true })) {
        const from = (msg.envelope?.from?.[0]?.address || "").toLowerCase();
        const subject = msg.envelope?.subject || "";
        if (map.has(from)) {
          const { c, r } = map.get(from);
          if (!["replied", "unsubscribed"].includes(r.status)) {
            r.status = "replied";
            r.repliedAt = new Date().toISOString();
            r.respondedAt = r.respondedAt || r.repliedAt;
            changed.add(c.id);
            replies++;
          }
        } else if (/mailer-daemon|postmaster|mail delivery|delivery status|undeliverable|failure notice|returned mail/i.test(from + " " + subject)) {
          const raw = (msg.source ? msg.source.toString("utf8") : "").toLowerCase();
          for (const [email, { c, r }] of map) {
            if (raw.includes(email)) {
              if (!["bounced", "replied", "unsubscribed"].includes(r.status)) {
                r.status = "bounced";
                r.bouncedAt = new Date().toISOString();
                changed.add(c.id);
                bounces++;
              }
              break;
            }
          }
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (err) {
    return { replies, bounces, error: String(err.message || err) };
  }

  const byId = new Map(campaigns.map((c) => [c.id, c]));
  for (const id of changed) {
    const c = byId.get(id);
    if (c) {
      c.updatedAt = new Date().toISOString();
      await saveCampaign(c);
    }
  }
  return { replies, bounces };
}
