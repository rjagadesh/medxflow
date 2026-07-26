import { getStore } from "@netlify/blobs";

// Confirmation beacon. The client fires this ~2s after load; we flip
// beacon_confirmed=true on the originating pageview event. Events whose beacon
// never arrives keep beacon_confirmed=null (unknown), never false.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body = {};
  try { body = await req.json(); }
  catch { try { body = JSON.parse(await req.text()); } catch { body = {}; } }

  const id = typeof body.id === "string" && /^[\w-]{6,64}$/.test(body.id) ? body.id : null;
  if (!id) return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { "content-type": "application/json" } });

  try {
    const store = getStore("pageviews");
    const ev = await store.get(id, { type: "json" });
    if (ev && ev.beacon_confirmed !== true) {
      ev.beacon_confirmed = true;
      await store.setJSON(id, ev);
    }
  } catch (err) {
    console.error("beacon error:", err.message);
  }
  // Always 204 — the beacon is fire-and-forget and must never block the page.
  return new Response(null, { status: 204 });
};
