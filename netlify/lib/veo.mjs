import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Vertex AI Veo — generate a video from an image + prompt (long-running op).
// Uses a service-account JWT (no deps). Config from env / creds.json.

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}
const g = (k) => process.env[k] || readCreds()[k] || "";

// Known Veo model IDs, newest first. Veo's names churn (preview → GA), so we
// try each until one is reachable rather than pinning a single ID.
const VEO_FALLBACKS = ["veo-3.0-generate-001", "veo-3.0-fast-generate-001", "veo-3.0-generate-preview", "veo-2.0-generate-001"];

// Parse the service account from either a base64 blob (VERTEX_SERVICE_ACCOUNT_B64
// — the safest form for env vars, no newline/quote pitfalls) or raw JSON /
// object (VERTEX_SERVICE_ACCOUNT). Repairs a common paste bug where the
// private_key's \n escapes got turned into real newlines.
function parseSA() {
  const b64 = g("VERTEX_SERVICE_ACCOUNT_B64");
  if (b64) { try { return JSON.parse(Buffer.from(String(b64).trim(), "base64").toString("utf8")); } catch {} }
  const raw = g("VERTEX_SERVICE_ACCOUNT");
  if (!raw) return null;
  if (typeof raw !== "string") return raw;
  try { return JSON.parse(raw); } catch {}
  // Real newlines inside the JSON string values are invalid JSON — re-escape
  // those that fall inside the private_key block and retry.
  try { return JSON.parse(raw.replace(/-----BEGIN[\s\S]*?-----END[^"]*/g, (m) => m.replace(/\r?\n/g, "\\n"))); } catch {}
  return null;
}

export function veoCfg() {
  const sa = parseSA();
  const preferred = g("VEO_MODEL");
  // env/creds model first (if set), then the fallback list, de-duped
  const models = [...new Set([preferred, ...VEO_FALLBACKS].filter(Boolean))];
  return {
    sa,
    project: g("VERTEX_PROJECT") || "voice-2-490513",
    location: g("VERTEX_LOCATION") || "us-central1",
    model: models[0],
    models,
  };
}

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
async function accessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: sa.client_email, scope: "https://www.googleapis.com/auth/cloud-platform", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 };
  const si = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url(claim)}`;
  const sig = crypto.createSign("RSA-SHA256").update(si).sign(sa.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${si}.${sig}` }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error_description || d.error || "Vertex token failed");
  return d.access_token;
}

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms));

// Generate a video; polls the long-running operation until done. onStatus(msg)
// is called each poll so a job can report progress.
export async function generateVeoVideo(cfg, { prompt, imageBase64, mimeType = "image/png", durationSeconds = 8, aspectRatio = "16:9", onStatus } = {}) {
  if (!cfg.sa?.client_email) throw new Error("Vertex service account not configured (VERTEX_SERVICE_ACCOUNT).");
  if (!prompt && !imageBase64) throw new Error("A prompt or image is required.");
  const token = await accessToken(cfg.sa);
  const host = `https://${cfg.location}-aiplatform.googleapis.com/v1/projects/${cfg.project}/locations/${cfg.location}/publishers/google/models`;
  const instance = {};
  if (prompt) instance.prompt = prompt;
  if (imageBase64) instance.image = { bytesBase64Encoded: imageBase64, mimeType };
  const body = { instances: [instance], parameters: { aspectRatio, sampleCount: 1, durationSeconds: String(durationSeconds), generateAudio: true } };

  // Try each candidate model ID; use the first that the project can reach.
  const candidates = cfg.models?.length ? cfg.models : [cfg.model];
  let opName = null, base = null, lastErr = "";
  for (const model of candidates) {
    base = `${host}/${model}`;
    const start = await fetch(`${base}:predictLongRunning`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
    const sd = await start.json();
    if (start.ok && sd.name) { opName = sd.name; onStatus?.(`using model ${model}`); break; }
    lastErr = sd?.error?.message || `HTTP ${start.status}`;
    // 404 = this model isn't available to the project; try the next one.
    if (start.status !== 404 && !/not found or your project does not have access/i.test(lastErr)) throw new Error(lastErr);
  }
  if (!opName) throw new Error(`No Veo model is available to this project. Enable Veo in Vertex Model Garden. Last error: ${lastErr}`);

  for (let i = 0; i < 90; i++) {
    await DELAY(8000);
    const p = await fetch(`${base}:fetchPredictOperation`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ operationName: opName }) });
    const pd = await p.json();
    if (!p.ok) throw new Error(pd?.error?.message || `Veo poll HTTP ${p.status}`);
    onStatus?.(`generating video… (${(i + 1) * 8}s)`);
    if (pd.done) {
      if (pd.error) throw new Error(pd.error.message || "Veo generation failed");
      const vids = pd.response?.videos || pd.response?.generatedSamples || pd.response?.predictions || [];
      const v = vids[0] || {};
      const vb = v.bytesBase64Encoded || v.video?.bytesBase64Encoded || v.bytes;
      if (!vb) throw new Error("Veo returned no video data.");
      return { videoBase64: vb, mimeType: v.mimeType || "video/mp4" };
    }
  }
  throw new Error("Veo generation timed out.");
}
