import { tiktokCfg, tiktokExchangeCode } from "../lib/social.mjs";

// TikTok OAuth redirect target (https://medxflow.ai/callback). Exchanges the
// authorization code for tokens and stores them. Public - TikTok calls it.
const page = (title, msg, ok) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<div style="font-family:system-ui,sans-serif;max-width:460px;margin:16vh auto;padding:0 24px;text-align:center;color:#0F2E2A">
<div style="font-size:40px">${ok ? "✅" : "⚠️"}</div>
<h2 style="font-family:Georgia,serif">${title}</h2>
<p style="font-size:16px;line-height:1.6;color:#456">${msg}</p>
<p style="margin-top:22px"><a href="/admin" style="color:#0E9E8E;font-weight:600">Back to the admin</a></p></div>`,
  { status: 200, headers: { "content-type": "text/html" } }
);

export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  if (err) return page("TikTok connection failed", err, false);
  if (!code) return page("Missing authorization code", "TikTok didn't return a code. Please start the connect flow again from the Connections panel.", false);
  try {
    await tiktokExchangeCode(tiktokCfg(), code);
    return page("TikTok connected", "Your TikTok account is now linked. You can schedule video posts from the Scheduler (sandbox posts are private until TikTok approves production).", true);
  } catch (e) {
    return page("TikTok connection failed", e.message, false);
  }
};
