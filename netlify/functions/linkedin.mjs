import { authorize, json } from "../lib/auth.mjs";
import { linkedinCfg, publishLinkedIn } from "../lib/social.mjs";

// LinkedIn organization page - connection status + immediate publish.
// Returns { configured:false } with setup guidance until the token + org id
// are present.
export default async (req) => {
  const auth = authorize(req, "social");
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const cfg = linkedinCfg();
  if (!cfg.token || !cfg.org) {
    return json({ configured: false, reason: "Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID to connect LinkedIn." });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "info";

  try {
    if (action === "info") {
      // Best-effort org name lookup (needs r_organization_admin / _social).
      let org = null, orgError = null;
      try {
        const res = await fetch(`https://api.linkedin.com/rest/organizations/${cfg.org}?fields=localizedName,vanityName`, {
          headers: { authorization: `Bearer ${cfg.token}`, "LinkedIn-Version": cfg.version, "X-Restli-Protocol-Version": "2.0.0" },
        });
        const d = await res.json().catch(() => ({}));
        if (res.ok) org = { name: d.localizedName || d.vanityName || `Organization ${cfg.org}`, vanity: d.vanityName };
        else orgError = d.message || `HTTP ${res.status}`;
      } catch (e) { orgError = e.message; }
      return json({ configured: true, orgId: cfg.org, org, orgError });
    }

    if (action === "publish") {
      const r = await publishLinkedIn(cfg, { caption: body.caption, imageUrl: body.imageUrl });
      return json({ ok: true, id: r.id });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
