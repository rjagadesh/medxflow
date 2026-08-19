// Data for the citable "RCM denial benchmarks" asset at /rcm-denial-benchmarks.
//
// IMPORTANT: every figure here is compiled from PUBLISHED third-party industry
// reports and is attributed to its source with a year. Nothing is a MedXFlow
// proprietary study - we do not have first-party denial data across practices,
// so we do not claim one. Figures are stated as ranges / "around" to reflect
// that published numbers vary by year, segment (physician vs hospital) and
// methodology. Verify against the latest source report before citing publicly.

// The single quotable answer an AI engine or featured snippet can lift whole.
export const DENIAL_ANSWER =
  "Across the US healthcare industry, providers see roughly 10 to 12 percent of claims denied on first submission, and industry analyses estimate the large majority of those denials - around 85 percent - are avoidable. A denial rate under 5 percent is considered healthy, while a rate above 10 percent usually signals a concentrated, fixable root cause such as eligibility or prior authorization.";

// Headline stat cards. n = big number, label = what it measures.
export const DENIAL_STATS = [
  {
    n: "~11%",
    label: "of claims are denied on first submission",
    source: "Change Healthcare Denials Index; Crowe RCA benchmarking",
    year: "2020-2022",
  },
  {
    n: "~85%",
    label: "of denials are considered avoidable",
    source: "Change Healthcare Denials Index",
    year: "2020",
  },
  {
    n: "~$25",
    label: "average cost to rework a single denied claim (physician practice; hospital claims cost far more)",
    source: "MGMA; Change Healthcare",
    year: "2017-2021",
  },
  {
    n: "~17%",
    label: "of in-network claims denied by ACA marketplace insurers",
    source: "KFF analysis of HealthCare.gov claims",
    year: "2023 (2021 data)",
  },
  {
    n: "under 1%",
    label: "of denied marketplace claims are appealed by patients",
    source: "KFF analysis of HealthCare.gov claims",
    year: "2023 (2021 data)",
  },
  {
    n: "under 5%",
    label: "denial rate is the benchmark for a healthy revenue cycle",
    source: "MGMA / HFMA benchmarks",
    year: "ongoing",
  },
];

// Most common root causes of claim denials (order reflects how often industry
// reports rank them; exact shares vary by source).
export const DENIAL_CAUSES = [
  { cause: "Registration and eligibility errors", note: "Wrong or inactive coverage, demographic mismatches, missing subscriber details - consistently the single largest avoidable category." },
  { cause: "Missing or invalid prior authorization", note: "Service required an authorization that was never obtained, expired, or did not match the code billed." },
  { cause: "Missing or incorrect information", note: "Absent modifiers, invalid NPI or member ID, incomplete claim fields." },
  { cause: "Medical necessity and coding", note: "Diagnosis does not support the procedure, NCCI edits, unbundling, or documentation gaps." },
  { cause: "Duplicate or already-adjudicated claims", note: "The same claim submitted more than once, or a service already paid." },
  { cause: "Untimely filing", note: "The claim arrived after the payer's filing deadline - almost always unrecoverable." },
];

// Benchmark table: what "healthy" vs "needs attention" looks like on the KPIs
// that drive denials and cash.
export const DENIAL_BENCHMARKS = [
  { metric: "Initial denial rate", healthy: "Under 5%", attention: "Over 10%" },
  { metric: "Clean claim rate", healthy: "95% or higher", attention: "Below 90%" },
  { metric: "Denial overturn (appeal win) rate", healthy: "60% or higher", attention: "Under 40%" },
  { metric: "Days in accounts receivable (A/R)", healthy: "Under 40 days", attention: "Over 50 days" },
  { metric: "Discharged-not-final-billed (DNFB) days", healthy: "3 to 5 days", attention: "Over 7 days" },
];

export const DENIAL_FAQ = [
  {
    q: "What percentage of medical claims are denied?",
    a: "Industry reports put the average initial claim denial rate at roughly 10 to 12 percent, and analyses have shown it rising over the past decade. Rates vary widely by payer, specialty and provider type.",
  },
  {
    q: "What is a good claim denial rate?",
    a: "A denial rate under 5 percent is generally considered healthy, and best-in-class practices run 2 to 4 percent. A rate above 10 percent usually points to a concentrated, fixable root cause, most often eligibility or prior authorization.",
  },
  {
    q: "How much do claim denials cost?",
    a: "Industry estimates put the cost to rework a single denied claim at around 25 dollars for a physician practice, and considerably more for hospital claims. Multiplied across denied volume, and combined with claims that are never resubmitted, denials represent a large recurring revenue leak.",
  },
  {
    q: "Are most claim denials preventable?",
    a: "Yes. Industry analysis estimates that around 85 percent of denials are avoidable, because the majority stem from front-end issues - eligibility, registration and prior authorization - that can be caught before the claim is submitted.",
  },
  {
    q: "What are the most common reasons claims are denied?",
    a: "The most common causes are registration and eligibility errors, missing or invalid prior authorization, missing or incorrect claim information, medical-necessity and coding mismatches, duplicate claims, and untimely filing.",
  },
];

// Published sources behind the figures above. Linked to each organization so
// readers (and AI engines) can trace every claim back to a real report.
export const DENIAL_SOURCES = [
  { org: "Change Healthcare (now Optum) - Denials Index", url: "https://www.optum.com" },
  { org: "Crowe - Revenue cycle analytics / hospital benchmarking", url: "https://www.crowe.com" },
  { org: "KFF - Claims denials and appeals in ACA marketplace plans", url: "https://www.kff.org" },
  { org: "MGMA - Medical Group Management Association benchmarks", url: "https://www.mgma.com" },
  { org: "HFMA - Healthcare Financial Management Association", url: "https://www.hfma.org" },
];
