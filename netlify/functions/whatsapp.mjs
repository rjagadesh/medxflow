import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { authorize, json } from "../lib/auth.mjs";

// WhatsApp Business (Cloud API) - send template and text messages from the
// admin. Uses the Meta Graph API with a WhatsApp token + phone-number id.
// Native fetch, no dependencies. Returns { configured:false } with guidance
// until META_WHATSAPP_TOKEN and META_WHATSAPP_PHONE_ID are set.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
function cfg() {
  const c = readCreds();
  const g = (k) => process.env[k] || c[k] || "";
  return {
    version: g("META_GRAPH_VERSION") || "v21.0",
    token: g("META_WHATSAPP_TOKEN"),
    phoneId: g("META_WHATSAPP_PHONE_ID"),
    wabaId: g("META_WHATSAPP_WABA_ID"),
  };
}

async function graph(c, node, { params = {}, method = "GET", body } = {}) {
  const url = new URL(`https://graph.facebook.com/${c.version}/${node}`);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);
  const opts = { method, headers: { authorization: `Bearer ${c.token}` } };
  if (body) { opts.headers["content-type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Graph HTTP ${res.status}`);
  return data;
}

// Number of {{n}} body variables a template expects.
function bodyVarCount(components = []) {
  const b = components.find((x) => x.type === "BODY");
  if (!b?.text) return 0;
  const m = b.text.match(/\{\{\s*\d+\s*\}\}/g);
  return m ? new Set(m).size : 0;
}

const digits = (s) => String(s || "").replace(/[^\d]/g, "");

export default async (req) => {
  const auth = authorize(req, "whatsapp");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const c = cfg();
  if (!c.token || !c.phoneId) {
    return json({ configured: false, reason: "Set META_WHATSAPP_TOKEN and META_WHATSAPP_PHONE_ID to connect WhatsApp." });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "info";

  try {
    if (action === "info") {
      let number = null, numberError = null;
      try {
        number = await graph(c, c.phoneId, { params: { fields: "display_phone_number,verified_name,quality_rating,code_verification_status" } });
      } catch (e) { numberError = e.message; }
      return json({ configured: true, number, numberError, hasWaba: !!c.wabaId });
    }

    if (action === "templates") {
      if (!c.wabaId) return json({ configured: true, templates: [], reason: "Set META_WHATSAPP_WABA_ID to list templates." });
      const d = await graph(c, `${c.wabaId}/message_templates`, { params: { fields: "name,status,language,category,components", limit: 100 } });
      const templates = (d.data || [])
        .filter((t) => t.status === "APPROVED")
        .map((t) => ({ name: t.name, language: t.language, category: t.category, vars: bodyVarCount(t.components) }));
      return json({ configured: true, templates });
    }

    // Inbound message threads (captured by whatsapp-webhook.mjs).
    if (action === "inbox") {
      const s = getStore("wa-inbox");
      const { blobs } = await s.list();
      const threads = [];
      for (const b of blobs) { try { const t = await s.get(b.key, { type: "json" }); if (t) threads.push(t); } catch {} }
      threads.sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")));
      return json({ configured: true, threads });
    }

    if (action === "replyText") {
      const to = digits(body.to);
      if (!to || !body.text) return json({ error: "recipient and text required" }, 400);
      const res = await graph(c, `${c.phoneId}/messages`, { method: "POST", body: { messaging_product: "whatsapp", to, type: "text", text: { body: String(body.text) } } });
      try {
        const s = getStore("wa-inbox");
        const k = `wa-${to}`;
        const t = (await s.get(k, { type: "json" })) || { wa_id: to, name: to, messages: [], unread: 0 };
        t.messages.push({ dir: "out", text: String(body.text), type: "text", at: new Date().toISOString() });
        t.updated = new Date().toISOString();
        await s.setJSON(k, t);
      } catch {}
      return json({ ok: true, id: res.messages?.[0]?.id || null });
    }

    if (action === "markRead") {
      try {
        const s = getStore("wa-inbox");
        const k = `wa-${digits(body.wa_id)}`;
        const t = await s.get(k, { type: "json" });
        if (t) { t.unread = 0; await s.setJSON(k, t); }
      } catch {}
      return json({ ok: true });
    }

    if (action === "send") {
      const to = digits(body.to);
      if (!to) return json({ error: "A recipient phone number is required." }, 400);
      let payload;
      if (body.mode === "text") {
        if (!body.text) return json({ error: "Message text is required." }, 400);
        payload = { messaging_product: "whatsapp", to, type: "text", text: { body: String(body.text) } };
      } else {
        if (!body.templateName) return json({ error: "A template is required." }, 400);
        const params = (body.params || []).filter((p) => p != null && p !== "");
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: body.templateName,
            language: { code: body.language || "en_US" },
            ...(params.length ? { components: [{ type: "body", parameters: params.map((p) => ({ type: "text", text: String(p) })) }] } : {}),
          },
        };
      }
      const res = await graph(c, `${c.phoneId}/messages`, { method: "POST", body: payload });
      return json({ ok: true, id: res.messages?.[0]?.id || null, to });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
};
