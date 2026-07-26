// ─────────────────────────────────────────────────────────────────────────
//  Traffic segmentation — query-time classifier.
//
//  Adapted from the two-pass design (per-event signals, then cross-event burst
//  detection) to this project's Netlify-Blobs pageview shape (see track.mjs).
//
//  Classification is NEVER persisted — it runs at read time from stored signals
//  so rule changes apply retroactively. Precedence is internal > bot > human.
//  Every event gets a `segment` plus a list of `reasons`. When a heuristic is
//  ambiguous we classify `human` and still attach the reason code — we'd rather
//  review a suspicious row than silently drop a real prospect.
// ─────────────────────────────────────────────────────────────────────────

import { getStore } from "@netlify/blobs";

/* ── IPv4 / CIDR helpers (no dependencies) ─────────────────────────────── */
export function ipToInt(ip) {
  const p = String(ip || "").split(".");
  if (p.length !== 4) return null;
  let n = 0;
  for (const o of p) {
    const x = Number(o);
    if (!Number.isInteger(x) || x < 0 || x > 255) return null;
    n = n * 256 + x;
  }
  return n >>> 0;
}
export function parseCidr(c) {
  const [ip, bitsRaw] = String(c || "").split("/");
  const base = ipToInt(ip);
  if (base === null) return null;
  const bits = bitsRaw === undefined ? 32 : Number(bitsRaw);
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return null;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return { base: (base & mask) >>> 0, mask };
}
export function inCidrs(ip, cidrs) {
  const n = ipToInt(ip);
  if (n === null) return false;
  for (const c of cidrs) if (((n & c.mask) >>> 0) === c.base) return true;
  return false;
}
const slash24 = (ip) => {
  const p = String(ip || "").split(".");
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}` : null;
};

/* ── Datacenter CIDR ranges ─────────────────────────────────────────────
   Pulled from AWS/GCP/Azure published lists on first use, cached in a Blob with
   a weekly refresh and a hardcoded fallback seed. Native fetch — no new deps.
   (Netlify does not expose ASN, so datacenter membership stands in for the
   "hosting vs residential ASN" signal.) */
// Official, stable JSON feeds only (no third-party services). Azure has no
// stable programmatic feed, so its common ranges live in the fallback seed.
const CIDR_SOURCES = [
  { name: "aws", url: "https://ip-ranges.amazonaws.com/ip-ranges.json",
    pick: (j) => (j.prefixes || []).map((p) => p.ip_prefix).filter(Boolean) },
  { name: "gcp", url: "https://www.gstatic.com/ipranges/cloud.json",
    pick: (j) => (j.prefixes || []).map((p) => p.ipv4Prefix).filter(Boolean) },
];

// Well-known hosting ranges so classification (and the tests) work even when the
// live fetch is blocked or fails. Covers the AWS EC2 space used in the tests.
export const FALLBACK_CIDRS = [
  "3.0.0.0/8", "13.32.0.0/12", "15.177.0.0/16", "18.32.0.0/11",
  "23.20.0.0/14", "34.192.0.0/10", "35.0.0.0/8",
  "44.192.0.0/10", // AWS EC2 — covers the test IP 44.202.238.137
  "50.16.0.0/14", "52.0.0.0/8", "54.0.0.0/8", "75.101.128.0/17",
  "104.196.0.0/14", "130.211.0.0/16", "146.148.0.0/17", // GCP
  "20.0.0.0/8", "40.64.0.0/10", "168.63.0.0/16",        // Azure
];

const WEEK_MS = 7 * 24 * 3600 * 1000;
let _cidrs = null;
let _cidrsAt = 0;

async function fetchRanges() {
  const out = [];
  for (const s of CIDR_SOURCES) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);
      const r = await fetch(s.url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
      if (!r.ok) continue;
      out.push(...s.pick(await r.json()));
    } catch { /* skip this source, keep going */ }
  }
  return out;
}

// Load + cache datacenter CIDRs (module memory → Blob → live fetch → fallback).
export async function loadDatacenterCidrs({ force = false } = {}) {
  const now = Date.now();
  if (_cidrs && !force && now - _cidrsAt < WEEK_MS) return _cidrs;

  let raw = null;
  try {
    const cached = await getStore("dc-cidrs").get("cidrs", { type: "json" });
    if (cached?.list?.length && cached.at && now - new Date(cached.at).getTime() < WEEK_MS) {
      raw = cached.list;
    }
  } catch { /* no cache yet */ }

  if (!raw) {
    const fetched = await fetchRanges();
    if (fetched.length) {
      raw = fetched;
      try { await getStore("dc-cidrs").setJSON("cidrs", { at: new Date().toISOString(), list: raw }); } catch {}
    }
  }
  if (!raw?.length) raw = FALLBACK_CIDRS; // fail closed to the seed

  _cidrs = raw.map(parseCidr).filter(Boolean);
  _cidrsAt = now;
  return _cidrs;
}

/* ── Signals ────────────────────────────────────────────────────────────── */
const BOT_UA = /bot\b|crawl|spider|slurp|bingpreview|facebookexternalhit|facebot|whatsapp|telegrambot|slackbot|discordbot|twitterbot|linkedinbot|embedly|preview|headless|phantomjs|puppeteer|playwright|python-requests|curl\/|wget|go-http-client|axios|node-fetch|okhttp|scrapy|monitor|uptime|pingdom|lighthouse|gtmetrix|semrush|ahrefs|dataprovider|dotbot|petalbot/i;

const isInternal = (e) => e?.internal === true || e?.mx_internal === true;
const eventMs = (e) => { const t = Date.parse(e?.at); return Number.isNaN(t) ? 0 : t; };

// Pass 1 — per-event signals. Returns a mutable record we refine in pass 2.
function perEventSignals(e, cidrs) {
  const reasons = new Set();
  const ua = e.user_agent || e.ua || "";

  if (isInternal(e)) reasons.add("internal_cookie");
  if (e.ip && inCidrs(e.ip, cidrs)) reasons.add("datacenter_ip");
  if (ua && BOT_UA.test(ua)) reasons.add("bot_user_agent");
  if (!ua) reasons.add("empty_user_agent"); // ambiguous on its own → stays human
  if (e.accept_language == null || e.accept_language === "") reasons.add("no_accept_language"); // ambiguous alone
  if (e.beacon_confirmed === false) reasons.add("beacon_never_fired");
  if (e.beacon_confirmed === true) reasons.add("beacon_confirmed");

  return { id: e.id, reasons };
}

// Pass 2a — burst sweep: many DISTINCT visitor IDs + DISTINCT paths from the
// same /24 inside a short window (a real human is one visitor, so is immune).
function detectBurstSweep(events, rec, { windowMs = 8000, minDistinct = 5 } = {}) {
  const byNet = new Map();
  for (const e of events) {
    const net = slash24(e.ip);
    if (!net) continue;
    (byNet.get(net) || byNet.set(net, []).get(net)).push(e);
  }
  for (const list of byNet.values()) {
    list.sort((a, b) => eventMs(a) - eventMs(b));
    for (let i = 0; i < list.length; i++) {
      const t0 = eventMs(list[i]);
      const win = [];
      for (let j = i; j < list.length && eventMs(list[j]) - t0 <= windowMs; j++) win.push(list[j]);
      const vids = new Set(win.map((e) => e.visitorId).filter(Boolean));
      const paths = new Set(win.map((e) => e.path).filter(Boolean));
      if (win.length >= minDistinct && vids.size >= minDistinct && paths.size >= minDistinct) {
        for (const e of win) rec.get(e.id)?.reasons.add("burst_sweep");
      }
    }
  }
}

// Pass 2b — link-preview fetchers: same exact IP, same wall-clock second,
// several distinct visitor IDs (unfurlers hit once per platform, in parallel).
function detectLinkPreview(events, rec, { minCount = 3 } = {}) {
  const groups = new Map();
  for (const e of events) {
    if (!e.ip) continue;
    const key = `${e.ip}@${Math.floor(eventMs(e) / 1000)}`;
    (groups.get(key) || groups.set(key, []).get(key)).push(e);
  }
  for (const list of groups.values()) {
    const vids = new Set(list.map((e) => e.visitorId).filter(Boolean));
    if (list.length >= minCount && vids.size >= minCount) {
      for (const e of list) rec.get(e.id)?.reasons.add("link_preview_fetch");
    }
  }
}

// Resolve reasons → segment with precedence internal > bot > human.
const BOT_REASONS = new Set([
  "datacenter_ip", "bot_user_agent", "beacon_never_fired", "burst_sweep", "link_preview_fetch",
]);
function segmentFor(reasons) {
  if (reasons.has("internal_cookie")) return "internal";
  for (const r of reasons) if (BOT_REASONS.has(r)) return "bot";
  return "human";
}

/**
 * Classify a batch of pageview events.
 * @param {Array} events  stored pageview objects
 * @param {object} opts   { cidrs } — parsed CIDR list (defaults to the seed)
 * @returns {{ events: Array, byId: Map, counts: {human,bot,internal,total} }}
 */
export function classifyEvents(events = [], opts = {}) {
  const cidrs = opts.cidrs || FALLBACK_CIDRS.map(parseCidr).filter(Boolean);
  const rec = new Map();
  for (const e of events) rec.set(e.id, perEventSignals(e, cidrs));

  detectBurstSweep(events, rec, opts.burst);
  detectLinkPreview(events, rec, opts.linkPreview);

  const counts = { human: 0, bot: 0, internal: 0, total: 0 };
  const out = events.map((e) => {
    const reasons = [...(rec.get(e.id)?.reasons || [])];
    const segment = segmentFor(new Set(reasons));
    counts[segment]++; counts.total++;
    return { ...e, segment, reasons };
  });
  return { events: out, byId: rec, counts };
}
