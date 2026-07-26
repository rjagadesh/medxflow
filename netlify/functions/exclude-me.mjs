// Self-exclusion. Visiting /debug/exclude-me sets the _mx_internal cookie so
// your own QA browsing is classified `internal` (never counted as a prospect).
// /debug/exclude-me?clear=1 removes it again.
export const config = { path: "/debug/exclude-me" };

const YEAR = 60 * 60 * 24 * 365;

const page = (title, msg, linkLabel, linkHref) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0D2B52;
    font-family:system-ui,sans-serif;color:#E8EEF6}
  .card{background:#112B52;border:1px solid rgba(207,224,242,.16);border-radius:16px;
    padding:34px 30px;max-width:420px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.5)}
  h1{font-size:20px;margin:0 0 10px} p{color:rgba(232,238,246,.7);font-size:14.5px;line-height:1.5;margin:0 0 20px}
  a{display:inline-block;background:#1A5DAD;color:#fff;text-decoration:none;padding:11px 20px;
    border-radius:10px;font-weight:700;font-size:14px}
  .dot{font-size:34px}
</style></head>
<body><div class="card"><div class="dot">${title.includes("cleared") ? "🧹" : "🛡️"}</div>
<h1>${title}</h1><p>${msg}</p><a href="${linkHref}">${linkLabel}</a></div></body></html>`;

export default async (req) => {
  const url = new URL(req.url);
  const clearing = url.searchParams.get("clear") === "1";
  const secure = url.protocol === "https:" ? " Secure;" : ""; // omit on localhost http

  const cookie = clearing
    ? `_mx_internal=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;${secure}`
    : `_mx_internal=1; Path=/; Max-Age=${YEAR}; HttpOnly; SameSite=Lax;${secure}`;

  const html = clearing
    ? page("Exclusion cleared", "Your visits will be counted again as normal traffic.",
        "Exclude me again", "/debug/exclude-me")
    : page("You're excluded", "Your visits from this browser are now tagged internal and filtered out of the Real-traffic view. This lasts up to a year.",
        "Undo — count me again", "/debug/exclude-me?clear=1");

  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "set-cookie": cookie } });
};
