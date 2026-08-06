import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { authorize, json } from "../lib/auth.mjs";

// Google Sheets integration - each TAB in the workbook is one campaign.
// The app lists tabs (= campaign names), reads a tab's email column to run
// the campaign, and writes status back per row. Uses the same service-account
// JWT as GSC (no dependencies). Returns { configured:false } with setup
// guidance until the workbook id + Sheets access are present.
//
// Column layout per tab (row 1 = header):
//   A Email  B Name  C Practice  D Status  E Sent At  F Opened At
//   G Replied At  H Follow-ups Sent  I Source  J Notes

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
    scope: "https://www.googleapis.com/auth/spreadsheets",
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

const API = "https://sheets.googleapis.com/v4/spreadsheets";
const q = (s) => encodeURIComponent(s);

async function api(token, url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Sheets HTTP ${res.status}`);
  return data;
}

// List tab titles = the available campaigns.
async function listTabs(token, id) {
  const data = await api(token, `${API}/${id}?fields=properties.title,sheets.properties(title,index,gridProperties.rowCount)`);
  const workbook = data.properties?.title || "Workbook";
  const tabs = (data.sheets || [])
    .sort((a, b) => (a.properties.index || 0) - (b.properties.index || 0))
    .map((s) => ({ name: s.properties.title, rows: s.properties.gridProperties?.rowCount || 0 }));
  return { workbook, tabs };
}

// Read one tab's rows into recipient objects (only rows with a real email).
async function readTab(token, id, tab) {
  const data = await api(token, `${API}/${id}/values/${q(`'${tab}'!A2:J`)}`);
  const rows = data.values || [];
  const recipients = [];
  rows.forEach((r, i) => {
    const email = String(r[0] || "").trim();
    if (!email.includes("@")) return; // skips blanks + the legend row
    recipients.push({
      row: i + 2, // 1-based sheet row (header is row 1)
      email,
      name: r[1] || "",
      practice: r[2] || "",
      status: (r[3] || "").trim().toLowerCase(),
      source: r[8] || "",
    });
  });
  return recipients;
}

// Write status (+ matching timestamp) back to a recipient's row, matched by email.
async function writeStatus(token, id, tab, email, status, when) {
  // Find the row for this email.
  const col = await api(token, `${API}/${id}/values/${q(`'${tab}'!A1:A`)}`);
  const idx = (col.values || []).findIndex((r) => String(r[0] || "").trim().toLowerCase() === String(email).trim().toLowerCase());
  if (idx < 0) return { updated: false, reason: "email not found in tab" };
  const row = idx + 1;
  const ts = when || new Date().toISOString().replace("T", " ").slice(0, 16);
  const tsCol = status === "opened" ? "F" : status === "replied" ? "G" : status === "sent" ? "E" : null;
  const data = [{ range: `'${tab}'!D${row}`, values: [[status]] }];
  if (tsCol) data.push({ range: `'${tab}'!${tsCol}${row}`, values: [[ts]] });
  await api(token, `${API}/${id}/values:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({ valueInputOption: "RAW", data }),
  });
  return { updated: true, row };
}

export default async (req) => {
  const auth = authorize(req, "campaigns");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const creds = readCreds();
  const rawSa = process.env.GSC_SERVICE_ACCOUNT || creds.GSC_SERVICE_ACCOUNT || "";
  const workbookId = process.env.SHEETS_WORKBOOK_ID || creds.SHEETS_WORKBOOK_ID || "";
  if (!rawSa || !workbookId) {
    return json({ configured: false, reason: "Set SHEETS_WORKBOOK_ID and share the workbook with the service account." });
  }
  let sa;
  try { sa = typeof rawSa === "string" ? JSON.parse(rawSa) : rawSa; }
  catch { return json({ configured: false, reason: "Service-account JSON is invalid." }); }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "tabs";

  try {
    const token = await getAccessToken(sa);
    if (action === "tabs") return json({ configured: true, id: workbookId, ...(await listTabs(token, workbookId)) });
    if (action === "emails") {
      if (!body.tab) return json({ error: "tab is required" }, 400);
      return json({ configured: true, tab: body.tab, recipients: await readTab(token, workbookId, body.tab) });
    }
    if (action === "writeStatus") {
      const { tab, email, status, when } = body;
      if (!tab || !email || !status) return json({ error: "tab, email and status are required" }, 400);
      return json({ configured: true, ...(await writeStatus(token, workbookId, tab, email, status, when)) });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ configured: false, reason: `Sheets access failed: ${err.message}` });
  }
};
