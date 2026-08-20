// Public, read-only proxy for the CMS NPPES NPI Registry API.
//
// The upstream (npiregistry.cms.hhs.gov) sends no CORS header, so a browser
// cannot call it directly. This same-origin function forwards a whitelisted
// set of search params, adds prefix wildcards for friendlier name matching,
// and returns the NPPES JSON unchanged. The data is public domain.

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json",
      // NPPES data is public and refreshed weekly; cache a day at the edge.
      "cache-control": "public, max-age=86400",
      "access-control-allow-origin": "*",
    },
  });

// Params we forward to NPPES. Anything else is ignored.
const ALLOWED = [
  "number", "first_name", "last_name", "organization_name",
  "taxonomy_description", "city", "state", "postal_code", "enumeration_type",
];
// Name-like fields get a trailing wildcard so partial searches work (NPPES
// requires at least 2 characters before the '*').
const WILDCARD = new Set(["first_name", "last_name", "organization_name", "taxonomy_description"]);

export default async (req) => {
  const p = new URL(req.url).searchParams;
  const upstream = new URL("https://npiregistry.cms.hhs.gov/api/");
  upstream.searchParams.set("version", "2.1");

  let hasCriteria = false;
  for (const k of ALLOWED) {
    let v = (p.get(k) || "").trim();
    if (!v) continue;
    if (WILDCARD.has(k) && v.length >= 2 && !v.includes("*")) v = `${v}*`;
    upstream.searchParams.set(k, v);
    hasCriteria = true;
  }
  if (!hasCriteria) return json({ result_count: 0, results: [], error: "Enter a search term." }, 400);

  const limit = Math.min(Math.max(parseInt(p.get("limit") || "10", 10) || 10, 1), 20);
  upstream.searchParams.set("limit", String(limit));

  try {
    const r = await fetch(upstream, { headers: { accept: "application/json" } });
    const data = await r.json();
    return json(data, r.ok ? 200 : 502);
  } catch {
    return json({ result_count: 0, results: [], error: "The NPI registry is temporarily unavailable. Please try again." }, 502);
  }
};
