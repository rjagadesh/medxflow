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

export function veoCfg() {
  const raw = g("VERTEX_SERVICE_ACCOUNT");
  let sa = null;
  try { sa = typeof raw === "string" ? JSON.parse(raw) : raw; } catch {}
  return {
    sa,
    project: g("VERTEX_PROJECT") || "voice-2-490513",
    location: g("VERTEX_LOCATION") || "us-central1",
    model: g("VEO_MODEL") || "veo-3.0-generate-preview",
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
  const base = `https://${cfg.location}-aiplatform.googleapis.com/v1/projects/${cfg.project}/locations/${cfg.location}/publishers/google/models/${cfg.model}`;
  const instance = {};
  if (prompt) instance.prompt = prompt;
  if (imageBase64) instance.image = { bytesBase64Encoded: imageBase64, mimeType };
  const body = { instances: [instance], parameters: { aspectRatio, sampleCount: 1, durationSeconds: String(durationSeconds), generateAudio: true } };

  const start = await fetch(`${base}:predictLongRunning`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
  const sd = await start.json();
  if (!start.ok) throw new Error(sd?.error?.message || `Veo start HTTP ${start.status}`);
  const opName = sd.name;

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
