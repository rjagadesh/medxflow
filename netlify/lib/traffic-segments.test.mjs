// Tests for the traffic classifier — built from real patterns in our logs.
// Run:  node netlify/lib/traffic-segments.test.mjs
// No test framework (no new deps) — just node:assert.

import assert from "node:assert/strict";
import { classifyEvents } from "./traffic-segments.mjs";

const T0 = Date.parse("2026-02-10T08:00:00.000Z");
const iso = (msOffset) => new Date(T0 + msOffset).toISOString();
const ev = (o) => ({ id: o.id, at: iso(o.t || 0), ip: o.ip, visitorId: o.vid, path: o.path,
  user_agent: o.ua, accept_language: o.al ?? null, beacon_confirmed: o.beacon ?? null,
  mx_internal: o.internal || false });

const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

let pass = 0;
const test = (name, fn) => { fn(); console.log(`  ✓ ${name}`); pass++; };

// 1 — burst sweep: 6 pageviews, 6 paths, 6 visitors, same /24, within 6s → all bot
test("burst_sweep: 6 distinct paths+visitors, same /24, 6s", () => {
  const evs = Array.from({ length: 6 }, (_, i) =>
    ev({ id: `b${i}`, ip: `198.51.100.${10 + i}`, vid: `v${i}`, path: `/p${i}`, t: i * 1000, ua: CHROME, al: "en-US" }));
  const { events } = classifyEvents(evs);
  for (const e of events) {
    assert.equal(e.segment, "bot", `${e.id} should be bot`);
    assert.ok(e.reasons.includes("burst_sweep"), `${e.id} missing burst_sweep`);
  }
});

// 2 — link-preview fetcher: same IP, same second, 4 distinct visitors → bot
test("link_preview: same IP + same second, 4 visitors", () => {
  const evs = Array.from({ length: 4 }, (_, i) =>
    ev({ id: `lp${i}`, ip: "203.0.113.55", vid: `u${i}`, path: "/", t: 200, ua: "facebookexternalhit/1.1" }));
  const { events } = classifyEvents(evs);
  for (const e of events) {
    assert.equal(e.segment, "bot");
    assert.ok(e.reasons.includes("link_preview_fetch"), `${e.id} missing link_preview_fetch`);
  }
});

// 3 — raw EC2 IP → bot via datacenter range
test("datacenter_ip: raw EC2 44.202.238.137", () => {
  const { events } = classifyEvents([ev({ id: "ec2", ip: "44.202.238.137", vid: "x", path: "/", ua: CHROME, al: "en-US" })]);
  assert.equal(events[0].segment, "bot");
  assert.ok(events[0].reasons.includes("datacenter_ip"));
});

// 4 — internal cookie from a datacenter IP → internal (precedence beats bot)
test("precedence: _mx_internal from datacenter IP → internal", () => {
  const { events } = classifyEvents([ev({ id: "int", ip: "44.202.238.137", vid: "me", path: "/admin", ua: CHROME, al: "en-US", internal: true })]);
  assert.equal(events[0].segment, "internal");
  assert.ok(events[0].reasons.includes("internal_cookie"));
  assert.ok(events[0].reasons.includes("datacenter_ip")); // signal still recorded
});

// 5 — a normal browser → human
test("human: real UA + Accept-Language + beacon + residential IP", () => {
  const { events } = classifyEvents([ev({ id: "h", ip: "71.199.24.8", vid: "real", path: "/pricing", ua: CHROME, al: "en-US,en;q=0.9", beacon: true })]);
  assert.equal(events[0].segment, "human");
  assert.ok(!events[0].reasons.some((r) => ["datacenter_ip", "bot_user_agent", "burst_sweep", "link_preview_fetch", "beacon_never_fired"].includes(r)));
});

// 6 — one human, 3 pages over 4 minutes → human, NOT caught by burst (the FP case)
test("no false positive: 1 human, 3 pages over 4 minutes", () => {
  const evs = [
    ev({ id: "s1", ip: "71.199.24.8", vid: "same", path: "/", t: 0, ua: CHROME, al: "en-US" }),
    ev({ id: "s2", ip: "71.199.24.8", vid: "same", path: "/pricing", t: 120000, ua: CHROME, al: "en-US" }),
    ev({ id: "s3", ip: "71.199.24.8", vid: "same", path: "/faq", t: 240000, ua: CHROME, al: "en-US" }),
  ];
  const { events } = classifyEvents(evs);
  for (const e of events) {
    assert.equal(e.segment, "human", `${e.id} should stay human`);
    assert.ok(!e.reasons.includes("burst_sweep"), `${e.id} wrongly flagged burst_sweep`);
  }
});

console.log(`\n${pass}/6 tests passed`);
