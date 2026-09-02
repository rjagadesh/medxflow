// Real-time insurance eligibility verification (X12 270/271) via Stedi.
//
// The browser never sees the Stedi API key - it posts a patient here and this
// function calls Stedi server-side, then returns a normalized summary plus the
// raw payer response.
//
// PHI: nothing is persisted. Patient details are passed through to the payer
// and returned to the caller only; no blobs, no logs of names/member IDs.

import fs from "node:fs";
import path from "node:path";
import { authorize, json } from "../lib/auth.mjs";

const STEDI_URL = "https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3";

function readCreds() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "creds.json"), "utf8")); }
  catch { return {}; }
}

// NPI check-digit validation (Luhn over the 80840 prefix + first 9 digits).
function npiValid(npi) {
  if (!/^\d{10}$/.test(npi || "")) return false;
  const s = "80840" + npi.slice(0, 9);
  let sum = 0, dbl = true;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return (10 - (sum % 10)) % 10 === +npi[9];
}

const digits = (s) => String(s || "").replace(/\D/g, "");

// Pull the numbers a front desk actually needs out of the 271 benefits array.
function summarize(data) {
  const bi = data.benefitsInformation || [];
  const inNetwork = (b) => !b.inPlanNetworkIndicatorCode || b.inPlanNetworkIndicatorCode === "Y";
  const pick = (code, level) => bi.find((b) =>
    b.code === code && inNetwork(b) &&
    (!level || (b.coverageLevelCode || "").toUpperCase() === level) &&
    (b.benefitAmount != null || b.benefitPercent != null));

  const money = (b) => (b && b.benefitAmount != null ? Number(b.benefitAmount) : null);
  const active = (data.planStatus || []).find((p) => p.statusCode === "1");
  const copay = bi.find((b) => b.code === "B" && inNetwork(b) && b.benefitAmount != null);
  const coins = bi.find((b) => b.code === "A" && inNetwork(b) && b.benefitPercent != null);

  return {
    active: !!active,
    status: active?.status || (data.planStatus || [])[0]?.status || (data.errors?.length ? "Not verified" : "Unknown"),
    planName: (data.planStatus || []).map((p) => p.planDetails).find(Boolean) || data.planInformation?.planDescription || null,
    payerName: data.payer?.name || null,
    memberId: data.subscriber?.memberId || null,
    patientName: [data.subscriber?.firstName, data.subscriber?.lastName].filter(Boolean).join(" ") || null,
    deductible: money(pick("C", "IND")) ?? money(pick("C")),
    deductibleRemaining: money(bi.find((b) => b.code === "C" && inNetwork(b) && /remaining/i.test(b.timeQualifier || "") && b.benefitAmount != null)),
    outOfPocket: money(pick("G", "IND")) ?? money(pick("G")),
    copay: money(copay),
    coinsurance: coins?.benefitPercent != null ? Math.round(Number(coins.benefitPercent) * 100) : null,
    planBeginDate: data.planDateInformation?.planBegin || data.planDateInformation?.eligibilityBegin || null,
  };
}

export default async (req) => {
  const auth = authorize(req, "eligibility");
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const creds = readCreds();
  const key = process.env.STEDI_API_KEY || creds.STEDI_API_KEY || "";
  const mode = (process.env.STEDI_ENV || creds.STEDI_ENV || (key.startsWith("test_") ? "test" : "production"));
  if (!key) {
    return json({ configured: false, reason: "Set STEDI_API_KEY to run eligibility checks." });
  }

  let body = {};
  try { body = await req.json(); } catch {}

  if (body.action === "config") return json({ configured: true, mode });

  const payerId = String(body.payerId || "").trim();
  const npi = digits(body.npi) || "1999999984";
  const memberId = String(body.memberId || "").trim();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const dob = digits(body.dateOfBirth);
  const serviceTypeCode = String(body.serviceTypeCode || "30").trim();

  if (!payerId) return json({ error: "Payer ID is required." }, 400);
  if (!memberId && !(lastName && dob)) return json({ error: "Member ID, or last name plus date of birth, is required." }, 400);
  if (dob && dob.length !== 8) return json({ error: "Date of birth must be YYYYMMDD." }, 400);
  if (!npiValid(npi)) return json({ error: `NPI ${npi} fails check-digit validation.` }, 400);

  const payload = {
    controlNumber: String(Math.floor(100000000 + Math.random() * 899999999)),
    tradingPartnerServiceId: payerId,
    provider: { organizationName: String(body.providerName || "MedXFlow").trim(), npi },
    subscriber: {
      ...(memberId ? { memberId } : {}),
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(dob ? { dateOfBirth: dob } : {}),
    },
    encounter: { serviceTypeCodes: [serviceTypeCode] },
  };

  try {
    const res = await fetch(STEDI_URL, {
      method: "POST",
      headers: { authorization: key, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return json({ error: data?.message || `Stedi HTTP ${res.status}`, mode, raw: data }, 502);
    }
    return json({
      ok: true,
      mode,
      summary: summarize(data),
      errors: data.errors || [],
      benefits: (data.benefitsInformation || []).map((b) => ({
        code: b.code, name: b.name, coverageLevel: b.coverageLevel, network: b.inPlanNetworkIndicator,
        amount: b.benefitAmount ?? null, percent: b.benefitPercent ?? null,
        period: b.timeQualifier || null, serviceTypes: b.serviceTypes || b.serviceTypeCodes || [],
      })),
      raw: data,
    });
  } catch (err) {
    return json({ error: `Could not reach Stedi: ${err.message}`, mode }, 502);
  }
};
