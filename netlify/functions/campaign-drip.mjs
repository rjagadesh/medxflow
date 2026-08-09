import { config as getCfg, listCampaigns, sendInitial } from "../lib/campaigns-core.mjs";

// Drives throttled ("drip") campaigns: for each campaign with a sending pace
// (sendIntervalMinutes > 0), sends the next batch once the interval has elapsed
// since the last drip. Runs every minute; each campaign self-throttles.
export const config = { schedule: "* * * * *" };

export default async () => {
  const cfg = getCfg();
  const now = Date.now();
  let advanced = 0;
  try {
    for (const c of await listCampaigns()) {
      const interval = c.sendIntervalMinutes || 0;
      if (interval <= 0) continue;
      const pending = (c.recipients || []).filter((r) => r.status === "pending").length;
      if (!pending) continue;
      const last = c.lastDripAt ? new Date(c.lastDripAt).getTime() : 0;
      if (now - last < interval * 60000) continue; // not time yet
      c.lastDripAt = new Date().toISOString();
      try { await sendInitial(c, cfg, c.sendBatch || 1); } catch (e) { console.error("drip", c.id, e.message); }
      advanced++;
    }
  } catch (err) {
    console.error("campaign-drip", err.message);
  }
  return new Response(`drip: advanced ${advanced} campaign(s)`);
};
