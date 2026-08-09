import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

// WhatsApp Cloud API webhook. GET verifies the subscription; POST receives
// inbound messages and stores them as threads for the unified inbox.
// Public (Meta calls it) - no admin auth.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
const g = (k) => process.env[k] || readCreds()[k] || "";
const store = () => getStore("wa-inbox");
const key = (wa) => `wa-${String(wa).replace(/[^\d]/g, "")}`;

export default async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const verify = g("META_WHATSAPP_VERIFY_TOKEN") || "medxflow-verify";
    if (mode === "subscribe" && token === verify) return new Response(challenge || "", { status: 200 });
    return new Response("forbidden", { status: 403 });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  try {
    const s = store();
    for (const entry of body.entry || []) {
      for (const ch of entry.changes || []) {
        const v = ch.value || {};
        const contacts = v.contacts || [];
        for (const m of v.messages || []) {
          const wa = m.from;
          if (!wa) continue;
          const name = contacts.find((c) => c.wa_id === wa)?.profile?.name || wa;
          const text = m.text?.body || (m.type && m.type !== "text" ? `[${m.type}]` : "");
          const k = key(wa);
          const t = (await s.get(k, { type: "json" })) || { wa_id: wa, name, messages: [], unread: 0 };
          t.name = name || t.name;
          t.messages.push({ dir: "in", text, type: m.type || "text", at: new Date((parseInt(m.timestamp || "0", 10) || 0) * 1000 || Date.now()).toISOString() });
          t.messages = t.messages.slice(-60);
          t.unread = (t.unread || 0) + 1;
          t.updated = new Date().toISOString();
          await s.setJSON(k, t);
        }
      }
    }
  } catch (e) {
    console.error("wa-webhook", e.message);
  }
  return new Response("EVENT_RECEIVED", { status: 200 });
};
