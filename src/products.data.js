// ─────────────────────────────────────────────────────────────────────────
//  MedXFlow product catalogue — the Revenue Cycle Management (RCM) suite plus
//  the human-led Managed Billing service. Each entry drives one page rendered
//  by ProductPage.jsx at /products/<slug>. Copy is English source-of-truth;
//  keep brand/product names and prices here (they don't get translated).
// ─────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  rcm: "Revenue Cycle Management",
  services: "Managed Services",
};

export const PRODUCTS = [
  {
    slug: "pre-registration-scheduling",
    category: "rcm",
    step: 1,
    icon: "🗓",
    eyebrow: "RCM · Step 1 · Pre-registration & scheduling",
    name: "Pre-registration & Scheduling",
    h1a: "The clean claim starts",
    h1b: "before the visit does.",
    tagline:
      "Capture demographics, insurance and consent up front, and fill the schedule with the right appointment in the right slot — so nothing downstream has to be fixed later.",
    overview:
      "Most denials are born at the front door. MedXFlow pre-registration collects and validates patient demographics, guarantor and insurance details before the patient ever arrives, then books them into the correct visit type with the right provider, location and duration. Every field that a claim will later depend on is verified at the point it's cheapest to fix.",
    features: [
      ["📇", "Digital pre-registration", "Patients complete demographics, guarantor and insurance on their phone before the visit — no clipboard, no re-keying."],
      ["🧠", "Smart scheduling", "Rules-based booking picks the correct visit type, provider and slot length, and prevents double-books and impossible combinations."],
      ["🔔", "Reminders & prep", "Automated SMS/email reminders with prep instructions cut no-shows and keep the schedule full."],
      ["✅", "Front-end data validation", "Names, dates of birth, member IDs and addresses are format-checked and normalised so claims don't reject on typos."],
    ],
    steps: [
      ["Patient books or is scheduled", "Online self-scheduling or staff booking, both governed by the same visit-type rules."],
      ["Details captured up front", "A secure pre-registration link collects demographics, insurance and consent ahead of time."],
      ["Validated and slotted", "Data is normalised and the appointment lands in the right slot — ready for eligibility to run automatically."],
    ],
    benefits: [
      "Fewer denials caused by bad demographic or insurance data",
      "Shorter check-in — most of it is already done",
      "Lower no-show rate from automated reminders",
      "A schedule that reflects real provider capacity",
    ],
    stat: { n: 40, suffix: "%", label: "of denials trace back to registration — caught here, before they happen" },
  },
  {
    slug: "eligibility-verification",
    category: "rcm",
    step: 2,
    icon: "🛡",
    eyebrow: "RCM · Step 2 · Eligibility verification",
    name: "Eligibility Verification",
    h1a: "Know exactly what's covered",
    h1b: "before you deliver care.",
    tagline:
      "Real-time eligibility and benefits checks confirm active coverage, co-pays, deductibles and prior-auth requirements — so you bill the right payer, the first time.",
    overview:
      "MedXFlow runs automated 270/271 eligibility checks against payers the moment an appointment is booked, and re-checks on the day of service. Staff see active coverage, plan details, co-pay, deductible-remaining and whether a prior authorisation is required — surfaced directly in the worklist, with exceptions flagged for a human to resolve.",
    features: [
      ["⚡", "Real-time payer checks", "Automated 270/271 transactions confirm active coverage and benefits in seconds, not phone calls."],
      ["💳", "Co-pay & deductible surfaced", "Patient responsibility is known before the visit, so front desk can collect at the point of care."],
      ["🔐", "Prior-auth detection", "Services that need authorisation are flagged early, with a task raised so nothing is delivered un-authorised."],
      ["🔁", "Batch & day-of re-checks", "Coverage is re-verified before service to catch plan changes and lapses since booking."],
    ],
    steps: [
      ["Appointment triggers a check", "Eligibility runs automatically as soon as the visit is booked."],
      ["Benefits parsed and displayed", "Coverage, co-pay, deductible and auth requirements appear in the worklist."],
      ["Exceptions escalated", "Inactive coverage or missing auth is flagged for staff to fix before the visit."],
    ],
    benefits: [
      "Bill the correct, active payer every time",
      "Collect patient responsibility up front",
      "Catch prior-auth requirements before service",
      "Eliminate rework from coverage-related denials",
    ],
    stat: { n: 75, suffix: "%", label: "of eligibility-related denials are preventable with automated verification" },
  },
  {
    slug: "registration-check-in",
    category: "rcm",
    step: 3,
    icon: "🏥",
    eyebrow: "RCM · Step 3 · Registration & check-in",
    name: "Registration & Check-in",
    h1a: "Check in the patient,",
    h1b: "not the paperwork.",
    tagline:
      "A fast, accurate arrival: confirm identity and coverage, capture signatures and consents, collect what's owed, and mark the patient arrived — straight into your PMS.",
    overview:
      "MedXFlow check-in turns arrival into a two-minute, error-free step. Patients confirm their details, sign consents and financial-responsibility forms on screen, and pay their co-pay or balance at the kiosk or front desk. Everything writes back to the practice management system instantly, so the encounter is clean before the clinician even opens the chart.",
    features: [
      ["🪪", "Identity & insurance confirm", "Photo ID and insurance card capture, with details reconciled against what was pre-registered."],
      ["✍️", "On-screen consents", "Consent and financial-responsibility forms signed digitally — legible, dated, stored, auditable."],
      ["💶", "Point-of-service collection", "Co-pays and outstanding balances collected by card at check-in, before the patient sits down."],
      ["↔️", "Real-time PMS write-back", "Arrival status and updated details flow straight into Socrates, HealthOne and more."],
    ],
    steps: [
      ["Patient arrives", "Kiosk or front-desk check-in, with pre-registration already done."],
      ["Confirm, sign, pay", "Details verified, consents signed, patient responsibility collected on the spot."],
      ["Marked arrived in the PMS", "The clinical team sees an arrived, financially-cleared patient — no desk queue."],
    ],
    benefits: [
      "Point-of-service collections instead of chasing later",
      "Signed, stored consents with a clear audit trail",
      "No re-keying — details reconcile automatically",
      "A shorter, calmer waiting room",
    ],
    stat: { n: 2, suffix: " min", label: "average check-in — most of it completed before the patient walks in" },
  },
  {
    slug: "charge-capture-coding",
    category: "rcm",
    step: 4,
    icon: "🧾",
    eyebrow: "RCM · Step 4 · Charge capture & coding",
    name: "Charge Capture & Coding",
    h1a: "Every service rendered",
    h1b: "is a service billed.",
    tagline:
      "Capture charges at the point of care and code them accurately with CPT/ICD support and automated scrubbing — so nothing leaks and nothing goes out wrong.",
    overview:
      "Revenue leaks when charges are missed or mis-coded. MedXFlow reconciles the day's encounters against the schedule to surface missing charges, assists coders with CPT, ICD-10 and modifier suggestions, and runs a rules engine that checks medical necessity, bundling and payer-specific edits before a claim is ever created.",
    features: [
      ["🔍", "Missing-charge reconciliation", "Encounters are matched to the schedule so no rendered service goes uncharged."],
      ["🏷", "Coding assistance", "CPT, ICD-10 and modifier suggestions with medical-necessity and LCD/NCD checks."],
      ["🧹", "Automated charge scrubbing", "A rules engine catches bundling, mutually-exclusive and payer-specific edits pre-submission."],
      ["👩‍⚕️", "Coder review queue", "Ambiguous or high-risk charges route to a certified coder before release."],
    ],
    steps: [
      ["Charges captured at care", "Rendered services are recorded against the encounter, not reconstructed later."],
      ["Coded and scrubbed", "Codes are assigned and validated against clinical and payer rules."],
      ["Clean charge released", "Only compliant, complete charges pass through to claim creation."],
    ],
    benefits: [
      "Recover revenue from missed and under-coded charges",
      "Fewer coding-related denials and takebacks",
      "Compliance with payer and medical-necessity rules",
      "Faster coder throughput with assistive suggestions",
    ],
    stat: { n: 1, suffix: "%", label: "of net revenue is typically lost to charge capture leakage — closed here" },
  },
  {
    slug: "claims-submission",
    category: "rcm",
    step: 5,
    icon: "📤",
    eyebrow: "RCM · Step 5 · Claims submission",
    name: "Claims Submission",
    h1a: "Clean claims out the door,",
    h1b: "first pass, every day.",
    tagline:
      "Generate, scrub and submit compliant 837 claims electronically to every payer and clearinghouse — with acknowledgements tracked and rejections worked automatically.",
    overview:
      "MedXFlow builds compliant electronic claims, runs them through a multi-layer scrubber, and submits them to payers and clearinghouses. Every 999/277CA acknowledgement is tracked, front-end rejections are auto-triaged and corrected, and clean-claim and first-pass rates are measured so you can see — and improve — how much goes right the first time.",
    features: [
      ["🧼", "Multi-layer claim scrubbing", "Format, payer-edit and clinical checks run before submission to maximise first-pass acceptance."],
      ["🔌", "Any payer, any clearinghouse", "Electronic 837 submission across your full payer mix, with paper fallback where required."],
      ["📨", "Acknowledgement tracking", "999 and 277CA responses are reconciled so no claim silently disappears."],
      ["♻️", "Auto-rejection handling", "Front-end rejections are triaged, corrected and resubmitted without manual hunting."],
    ],
    steps: [
      ["Claim assembled", "A compliant 837 is generated from the coded, scrubbed charge."],
      ["Scrubbed and submitted", "Multi-layer edits run, then the claim is transmitted electronically."],
      ["Acknowledged and tracked", "Payer acknowledgements are reconciled; rejections loop back for correction."],
    ],
    benefits: [
      "Higher first-pass and clean-claim rates",
      "No claims lost between practice and payer",
      "Faster time-to-submission, faster cash",
      "Rejections worked automatically, not weeks later",
    ],
    stat: { n: 98, suffix: "%", label: "first-pass acceptance is achievable with disciplined scrubbing and tracking" },
  },
  {
    slug: "payment-posting",
    category: "rcm",
    step: 6,
    icon: "💰",
    eyebrow: "RCM · Step 6 · Payment posting & remittance",
    name: "Payment Posting & Remittance",
    h1a: "Every dollar posted,",
    h1b: "reconciled and explained.",
    tagline:
      "Automated 835/ERA and manual EOB posting with line-level reconciliation — so cash is accurate, variances are visible, and underpayments never slip through.",
    overview:
      "MedXFlow ingests electronic remittance (835/ERA) and posts payments, adjustments and patient responsibility at the line level, reconciled against what was billed. Contractual variances and underpayments are flagged, denials are automatically routed to the denial-management workflow, and daily cash is balanced against deposits so the books always tie out.",
    features: [
      ["🤖", "Auto ERA/835 posting", "Electronic remittances post automatically at line level, with manual EOB entry where needed."],
      ["⚖️", "Underpayment detection", "Payments are compared to contracted rates so short-pays are caught, not accepted."],
      ["🔀", "Denial routing", "Denied and adjusted lines flow straight into denial management with the reason code attached."],
      ["📊", "Daily cash reconciliation", "Posted payments are balanced against bank deposits so cash always ties out."],
    ],
    steps: [
      ["Remittance received", "835/ERA files and paper EOBs are ingested."],
      ["Posted line by line", "Payments, adjustments and patient balances post against the original charges."],
      ["Variances flagged", "Underpayments and denials are surfaced and routed for action."],
    ],
    benefits: [
      "Accurate cash and a balanced daily close",
      "Underpayments recovered, not written off",
      "Denials actioned the moment they post",
      "Clear patient balances ready for statements",
    ],
    stat: { n: 7, suffix: "%", label: "of payer payments are underpaid on average — surfaced here for recovery" },
  },
  {
    slug: "denial-management",
    category: "rcm",
    step: 7,
    icon: "🔧",
    eyebrow: "RCM · Step 7 · Denial management",
    name: "Denial Management",
    h1a: "Turn denials into",
    h1b: "recovered revenue.",
    tagline:
      "Categorise, prioritise and work denials by root cause — with appeals, resubmissions and prevention analytics that stop the same denial happening twice.",
    overview:
        "MedXFlow captures every denial with its CARC/RARC reason code, categorises it by root cause and dollar value, and drives a prioritised work queue so the highest-yield denials are worked first. Appeals and corrected claims are generated with the right documentation, timely-filing clocks are tracked, and root-cause analytics feed prevention back upstream.",
    features: [
      ["🗂", "Root-cause categorisation", "Every denial is coded by CARC/RARC and grouped by cause, payer and dollar impact."],
      ["🎯", "Prioritised work queues", "Denials are ranked by recoverable value and timely-filing urgency, not just date."],
      ["📝", "Appeals & resubmission", "Appeal letters and corrected claims are generated with supporting documentation."],
      ["🛑", "Prevention analytics", "Recurring denial patterns feed fixes back into registration, coding and eligibility."],
    ],
    steps: [
      ["Denial captured", "The denied line arrives from payment posting with its reason code."],
      ["Categorised and queued", "Root cause and recoverable value determine priority."],
      ["Worked and prevented", "Appeal or resubmit — and push the fix upstream so it doesn't recur."],
    ],
    benefits: [
      "Recover revenue that would otherwise be written off",
      "Work the highest-value denials before the filing deadline",
      "Stop repeat denials at their source",
      "A clear, auditable trail on every appeal",
    ],
    stat: { n: 65, suffix: "%", label: "of denials are never reworked industry-wide — this workflow reclaims them" },
  },
  {
    slug: "patient-collections",
    category: "rcm",
    step: 8,
    icon: "📬",
    eyebrow: "RCM · Step 8 · Patient statements & collections",
    name: "Patient Statements & Collections",
    h1a: "Clear balances,",
    h1b: "kindly and quickly.",
    tagline:
      "Accurate statements, digital payment options and gentle automated follow-up — so patients understand what they owe and paying is effortless.",
    overview:
      "Patient responsibility is a growing share of revenue and the hardest to collect. MedXFlow issues clear, itemised statements across print, email and SMS, offers online and text-to-pay with payment plans, and runs a compassionate reminder cadence. Balances that remain are aged, segmented and routed appropriately — with a full record kept for every touch.",
    features: [
      ["🧾", "Clear itemised statements", "Plain-language statements delivered by the channel each patient prefers."],
      ["📱", "Digital & text-to-pay", "Online payment, text-to-pay and card-on-file remove friction from paying."],
      ["📆", "Payment plans", "Automated instalment plans for larger balances, tracked to completion."],
      ["💬", "Compassionate follow-up", "A configurable, respectful reminder cadence — not a barrage."],
    ],
    steps: [
      ["Balance finalised", "After insurance posts, the patient's true responsibility is set."],
      ["Statement delivered", "Clear statements go out on the patient's preferred channel with easy payment links."],
      ["Followed up & resolved", "Reminders, plans and segmentation move balances to paid."],
    ],
    benefits: [
      "Higher patient collection rates, collected sooner",
      "Fewer billing questions from clearer statements",
      "A better patient financial experience",
      "Aged balances segmented for the right next step",
    ],
    stat: { n: 3, suffix: "×", label: "faster patient payment when digital and text-to-pay options are offered" },
  },
  {
    slug: "reporting-analytics",
    category: "rcm",
    step: 9,
    icon: "📈",
    eyebrow: "RCM · Step 9 · Reporting & analytics",
    name: "Reporting & Analytics",
    h1a: "See the whole revenue cycle",
    h1b: "on one screen.",
    tagline:
      "KPIs, denial trends, payer performance and cash forecasting in real time — so you can find the leaks and act before they cost you a month.",
    overview:
      "MedXFlow turns the entire revenue cycle into a live dashboard: days in A/R, clean-claim and first-pass rates, net collection rate, denial rate by cause and payer, and cash forecasting. Drill from a headline KPI to the individual claim, benchmark providers and locations, and get scheduled reports in the inbox of whoever needs them.",
    features: [
      ["📊", "Live KPI dashboards", "Days in A/R, clean-claim rate, net collection rate and more, updated in real time."],
      ["🔎", "Drill-down to the claim", "Move from a headline metric to the exact claims driving it in two clicks."],
      ["🏦", "Payer & provider benchmarking", "Compare performance across payers, providers and locations to find outliers."],
      ["📤", "Scheduled & ad-hoc reports", "Automated report delivery plus a flexible builder for one-off questions."],
    ],
    steps: [
      ["Data flows in", "Every stage of the cycle feeds the analytics layer automatically."],
      ["KPIs surfaced", "Dashboards highlight what's healthy and what's slipping."],
      ["Act on the leak", "Drill in, assign the fix, and watch the metric move."],
    ],
    benefits: [
      "One source of truth for revenue-cycle health",
      "Find and fix leaks before they compound",
      "Benchmark and hold performance accountable",
      "Board-ready reporting without the spreadsheet night",
    ],
    stat: { n: 360, suffix: "°", label: "visibility across every stage — from scheduling to final payment" },
  },
  {
    slug: "managed-billing",
    category: "services",
    step: 0,
    icon: "👥",
    eyebrow: "Managed service · Human-led medical billing",
    name: "Managed Billing Services",
    h1a: "A dedicated billing team,",
    h1b: "without the overhead.",
    tagline:
      "Prefer people over software? Our certified billers and coders run your entire revenue cycle for you — the traditional, full-service billing partnership, backed by MedXFlow technology.",
    overview:
      "Not every practice wants to run the software themselves. Managed Billing Services is our human-led, full-service offering: a dedicated team of certified medical billers, coders and A/R specialists who own your revenue cycle end to end — from eligibility to final payment — and report to you against clear performance targets. It's the classic outsourced-billing relationship, with MedXFlow's automation working quietly behind your team.",
    features: [
      ["🧑‍💼", "Dedicated account team", "Named certified billers and coders who know your practice, your payers and your specialty."],
      ["🔄", "Full-cycle ownership", "We handle eligibility, coding, claims, posting, denials and patient collections — end to end."],
      ["📞", "You keep a human on the phone", "A real account manager you can call, with regular reviews and transparent reporting."],
      ["📑", "Compliance & credentialing", "Certified coding, payer enrolment and credentialing support, with audit-ready documentation."],
    ],
    steps: [
      ["We learn your practice", "Onboarding maps your payers, fee schedule, specialty and existing backlog."],
      ["We run the cycle", "Our team works your claims and denials daily, using MedXFlow to move faster."],
      ["You get paid & reported to", "Cash lands, and you get clear monthly performance reviews against agreed KPIs."],
    ],
    benefits: [
      "No billing staff to hire, train or cover",
      "Certified coders across your specialty",
      "Transparent, KPI-based monthly reporting",
      "Percentage-of-collections pricing — we win when you do",
    ],
    stat: { n: 100, suffix: "%", label: "of your revenue cycle handled by a dedicated human team" },
  },
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug) || null;
export const rcmProducts = PRODUCTS.filter((p) => p.category === "rcm").sort((a, b) => a.step - b.step);
export const serviceProducts = PRODUCTS.filter((p) => p.category === "services");
