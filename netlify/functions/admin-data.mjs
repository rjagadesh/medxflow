import { getStore } from "@netlify/blobs";
import { authorize, json } from "../lib/auth.mjs";
import { classifyEvents, loadDatacenterCidrs } from "../lib/traffic-segments.mjs";

async function dumpStore(name, limit) {
  const store = getStore(name);
  let { blobs } = await store.list();
  // pageview keys are timestamp-prefixed, so lexical desc ≈ most-recent first.
  blobs.sort((a, b) => String(b.key).localeCompare(String(a.key)));
  if (limit) blobs = blobs.slice(0, limit);
  const out = [];
  for (const b of blobs) {
    try {
      const v = await store.get(b.key, { type: "json" });
      if (v) out.push(v);
    } catch {
      /* skip unreadable blob */
    }
  }
  return out;
}

export default async (req) => {
  const auth = authorize(req, null); // any authenticated principal
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const can = (m) => auth.principal.owner || (auth.principal.modules || []).includes(m);

  try {
    const [transcripts, visitors, pageviews, leads] = await Promise.all([
      can("chat") ? dumpStore("chat-transcripts") : [],
      can("chat") ? dumpStore("visitors") : [],
      can("traffic") ? dumpStore("pageviews", 1000) : [],
      can("leads") ? dumpStore("leads") : [],
    ]);
    transcripts.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    visitors.sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
    leads.sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));

    // Classify traffic at query time (never persisted → rule fixes apply
    // retroactively). Cross-event detection needs the whole batch, so classify
    // before the display sort.
    let classified = pageviews;
    let segCounts = { human: 0, bot: 0, internal: 0, total: pageviews.length };
    if (pageviews.length) {
      const cidrs = await loadDatacenterCidrs().catch(() => undefined);
      const res = classifyEvents(pageviews, cidrs ? { cidrs } : {});
      classified = res.events;
      segCounts = res.counts;
    }
    classified.sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));

    return json({
      transcripts,
      visitors,
      pageviews: classified, // each carries { segment, reasons }
      leads,
      counts: {
        transcripts: transcripts.length,
        visitors: visitors.length,
        pageviews: pageviews.length,
        leads: leads.length,
        segments: segCounts, // { human, bot, internal, total }
      },
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
};
