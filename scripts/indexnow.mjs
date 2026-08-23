// IndexNow ping: tells Bing/DuckDuckGo (whose index feeds ChatGPT search and
// Copilot) about new/changed URLs instantly, instead of waiting for a crawl.
// Run AFTER a production deploy:  node scripts/indexnow.mjs
// Reads the built sitemap and submits every URL in one batch.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "615eeea2cfd323647d2178e197bc525e";
const HOST = "medxflow.ai";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sm = fs.readFileSync(path.join(__dirname, "..", "dist", "sitemap.xml"), "utf8");
const urlList = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) { console.error("No URLs found in dist/sitemap.xml - run a build first."); process.exit(1); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status}`, res.status === 200 || res.status === 202 ? "(accepted)" : await res.text());
