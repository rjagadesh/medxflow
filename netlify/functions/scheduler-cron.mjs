import { store, listPosts, publishPost } from "../lib/scheduler-core.mjs";

// Runs hourly; publishes any scheduled post whose time has arrived.
export const config = { schedule: "@hourly" };

export default async () => {
  const now = Date.now();
  let posted = 0;
  try {
    const due = (await listPosts()).filter(
      (p) => p.status === "scheduled" && new Date(p.scheduledAt).getTime() <= now
    );
    for (const p of due) {
      try { await publishPost(p); } catch (e) { p.status = "failed"; p.results = { ...(p.results || {}), error: e.message }; }
      await store().setJSON(p.id, p);
      posted++;
    }
  } catch (err) {
    console.error("scheduler-cron", err.message);
  }
  return new Response(`scheduler: processed ${posted}`);
};
