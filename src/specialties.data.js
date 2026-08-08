// ─────────────────────────────────────────────────────────────────────────
//  MedXFlow specialties - vertical pages describing which processes AI agents
//  automate for each practice type, and the benefits. Each entry drives one
//  page rendered by SpecialtyPage.jsx at /specialties/<slug>.
//  A "group" is a workflow area; each process is [emoji, name, description].
// ─────────────────────────────────────────────────────────────────────────

export const SPECIALTIES = [
  {
    slug: "medspa",
    icon: "💆",
    name: "MedSpa & Aesthetics",
    eyebrow: "Specialty · MedSpa & Aesthetics",
    h1a: "Every lead answered.",
    h1b: "Every unit accounted for.",
    tagline:
      "Medspas run on speed, recurring visits and a tricky cosmetic-vs-medical billing line. MedXFlow's AI agents cover the whole journey - from the missed inbound call to retreatment reminders - while keeping you audit-safe on the services that touch insurance.",
    overview:
      "Most medspa revenue leaks happen at two points: the phone that rings during a treatment, and the cosmetic-vs-medical boundary that gets documented wrong. MedXFlow's agents answer every lead in seconds, keep the book full, reconcile every tox unit and payment, and turn retreatment timing into predictable recurring revenue.",
    stat: { n: "60", suffix: "s", label: "From a web form or Instagram DM to an AI call-back - before the lead goes cold" },
    groups: [
      {
        title: "Front-office & lead-to-booking",
        note: "Highest volume, biggest immediate win.",
        processes: [
          ["📞", "Voice AI for inbound calls", "Medspas lose a large share of leads to unanswered phones during treatments. A 24/7 agent answers every call, explains services and books directly into Boulevard or Zenoti."],
          ["⚡", "Outbound speed-to-lead", "A web form or Instagram DM triggers an AI call within 60 seconds - conversion drops sharply after five minutes."],
          ["🔁", "No-show & cancellation recovery", "Automated waitlist backfill instantly offers a freed slot to the next patient, keeping the book full."],
          ["💬", "Consultation-to-treatment follow-up", "Timed nurture sequences close the classic drop-off between the consult and the booked treatment."],
        ],
      },
      {
        title: "Prior authorization (the medical slice)",
        processes: [
          ["📦", "PA packet assembly", "For therapeutic Botox (migraine, hyperhidrosis) and vein procedures, the agent assembles conservative-therapy documentation, duplex findings and prior-treatment history."],
          ["🧾", "Payer-specific policy matching", "Auto-checks the encounter against the payer's LCD/policy criteria before submission."],
          ["⏱", "PA status polling & expiry", "Polls authorization status by voice agent or portal RPA, and tracks expiry."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Real-time 270/271", "Verifies coverage for covered services plus deductible/out-of-pocket status, so the front desk quotes accurately."],
          ["🔍", "Cosmetic vs. covered at booking", "Flags which services are cosmetic vs. potentially covered at booking time - preventing the patient-collections mess later."],
        ],
      },
      {
        title: "Coding & documentation compliance",
        note: "The real audit-risk area.",
        processes: [
          ["⚖️", "Cosmetic-vs-medical flagging", "Reviews chart notes to flag cosmetic services documented as medically necessary - the single largest audit exposure in this vertical."],
          ["💉", "Unit reconciliation", "Reconciles tox units drawn vs. documented vs. billed, with JW/JZ wastage-modifier validation."],
          ["🏷️", "CPT/ICD suggestion with a hard gate", "Auto-suggests codes from the treatment note, with a hard gate on the cosmetic/medical boundary."],
        ],
      },
      {
        title: "Revenue operations",
        note: "Applies even to 100% cash-pay medspas.",
        processes: [
          ["📦", "Package & membership deferred revenue", "Tracks sold vs. rendered vs. expired across packages and memberships."],
          ["💳", "Payment reconciliation", "Matches Square, Stripe, CareCredit and Cherry against the PM system."],
          ["🎁", "Loyalty credit application", "Applies Allē and Aspire credits - today almost always manual."],
          ["📊", "Injector commission calculation", "Calculates commissions tiered by service line and product cost."],
        ],
      },
      {
        title: "Inventory & cost control",
        processes: [
          ["📈", "Predictive ordering", "Forecasts tox and filler orders by each injector's consumption pattern."],
          ["⏳", "Expiry tracking & waste attribution", "Tracks expiry on high-cost vials and attributes waste by provider."],
          ["💰", "Margin-per-service analytics", "Shows which services actually make money - most medspas genuinely don't know."],
        ],
      },
      {
        title: "Denials & AR",
        note: "Small volume, high per-claim value.",
        processes: [
          ["🧾", "Denial classification & auto-appeals", "Classifies denials and generates appeal letters for the recurring reasons: medical necessity, missing PA, cosmetic exclusion."],
          ["🔎", "Underpayment detection", "Flags payments that fall below contracted rates."],
        ],
      },
      {
        title: "Patient communications & retention",
        processes: [
          ["📋", "Pre/post-treatment instructions", "Delivers modality-timed prep and aftercare automatically."],
          ["🔔", "Retreatment reminders", "Product-duration reminders (tox ~3-4 months, filler by type) drive the recurring-revenue engine - usually run off a spreadsheet today."],
          ["⭐", "Review solicitation", "Times review requests to each patient's peak-result window."],
        ],
      },
      {
        title: "Marketing intelligence",
        processes: [
          ["🎯", "Revenue attribution", "Attributes ad spend all the way through to treatment revenue, not just bookings."],
          ["📉", "Churn prediction", "Predicts membership churn before it happens."],
        ],
      },
    ],
    benefits: [
      "Stop losing leads to unanswered phones - every call answered 24/7",
      "Reach new leads in under 60 seconds, while intent is hottest",
      "Keep the book full with automatic waitlist backfill",
      "Stay audit-safe on the cosmetic-vs-medical boundary",
      "Reconcile every tox unit and wastage modifier",
      "See true margin per service and per injector",
      "Turn retreatment timing into predictable recurring revenue",
      "Reconcile Square, Stripe, CareCredit, Cherry and loyalty credits automatically",
    ],
  },

  {
    slug: "dental",
    icon: "🦷",
    name: "Dental",
    eyebrow: "Specialty · Dental",
    h1a: "Verify the plan.",
    h1b: "Stay chairside.",
    tagline:
      "From insurance verification to claims, attachments and recall, MedXFlow's AI agents run the dental revenue cycle so your team can stay with the patient.",
    overview:
      "Dental practices juggle complex plan structures, frequent eligibility changes and heavy recall workflows. AI agents verify benefits down to frequencies and downgrades, attach the right documentation to every claim, and keep the hygiene schedule full.",
    stat: { n: "1", suffix: " min", label: "Full benefit breakdown - maximums, frequencies, downgrades - before the patient sits down" },
    groups: [
      {
        title: "Front office & scheduling",
        processes: [
          ["📞", "24/7 call answering & booking", "Answers overflow calls and books or reschedules into Dentrix, Eaglesoft or Open Dental."],
          ["🔁", "Recall & hygiene reactivation", "Automated 6-month recall and reactivation of lapsed patients."],
          ["🪑", "No-show & waitlist backfill", "Fills cancellations from the waitlist automatically."],
        ],
      },
      {
        title: "Insurance verification & benefits",
        processes: [
          ["🛡️", "Real-time eligibility & plan breakdown", "Pulls annual maximums, frequencies, downgrades and waiting periods before the visit."],
          ["📄", "Patient-responsibility estimation", "Computes what the patient owes so the front desk quotes accurately."],
        ],
      },
      {
        title: "Claims & documentation",
        processes: [
          ["📎", "Attachment automation", "Auto-attaches X-rays, perio charts and narratives to claims."],
          ["🏷️", "CDT coding assistance", "Suggests CDT codes from the clinical note and flags likely downgrades (e.g., composite to amalgam)."],
          ["🧾", "Predetermination handling", "Submits and tracks predeterminations for major work."],
        ],
      },
      {
        title: "Denials, AR & payments",
        processes: [
          ["🔎", "Denial & downgrade appeals", "Auto-generates appeals for common dental denials and downgrades."],
          ["💳", "Payment posting & reconciliation", "Posts ERAs and reconciles patient payments."],
        ],
      },
    ],
    benefits: [
      "Verify every plan's maximums, frequencies and downgrades before the chair",
      "Cut claim rejections with automatic X-ray and narrative attachments",
      "Reactivate lapsed recall patients without manual chasing",
      "Quote accurate patient responsibility up front",
      "Fill cancelled slots from the waitlist automatically",
      "Appeal downgrades and denials in a click",
    ],
  },

  {
    slug: "behavioral-health",
    icon: "🧠",
    name: "Mental & Behavioral Health",
    eyebrow: "Specialty · Mental & Behavioral Health",
    h1a: "Never lose a session",
    h1b: "to an expired auth.",
    tagline:
      "Authorization-heavy, session-based billing done right - AI agents handle prior auth, unit tracking, eligibility and recurring claims so clinicians can focus on care.",
    overview:
      "Behavioral health lives and dies on authorizations and recurring session billing. Missed auths, exceeded units and telehealth modifier errors are the top revenue leaks. AI agents renew auths before units run out, scrub every recurring claim, and bill telehealth correctly.",
    stat: { n: "0", suffix: "", label: "Sessions billed against an expired or exhausted authorization" },
    groups: [
      {
        title: "Intake & scheduling",
        processes: [
          ["📞", "Intake call answering & booking", "Answers inbound, screens and books into the EHR (SimplePractice, TherapyNotes, Kareo)."],
          ["🔁", "Recurring appointment & no-show management", "Holds recurring slots, reminds patients and backfills cancellations."],
        ],
      },
      {
        title: "Prior authorization & units",
        processes: [
          ["📦", "Auth request & renewal", "Assembles medical-necessity documentation and submits or renews authorizations before units run out."],
          ["⏱", "Unit & visit tracking", "Tracks authorized vs. used sessions and alerts before expiry."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Behavioral-health eligibility", "Verifies coverage, copays and visit limits - often carved out to a separate payer."],
        ],
      },
      {
        title: "Coding & claims",
        processes: [
          ["🏷️", "Session coding & modifiers", "Validates time-based CPT (90837 vs. 90834), telehealth POS/modifiers (95, GT) and add-on codes."],
          ["🔄", "Recurring claim scrubbing", "Scrubs and submits recurring session claims automatically."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Auth & modifier denial recovery", "Auto-appeals the recurring denials: no auth, exceeded units, wrong modifier."],
        ],
      },
    ],
    benefits: [
      "Never lose revenue to an expired authorization again",
      "Track authorized vs. used units in real time",
      "Bill telehealth sessions with the correct POS and modifiers",
      "Verify carved-out behavioral benefits before intake",
      "Automate recurring session claims",
      "Recover auth- and modifier-driven denials",
    ],
  },

  {
    slug: "dermatology",
    icon: "🧴",
    name: "Dermatology",
    eyebrow: "Specialty · Dermatology",
    h1a: "Medical and cosmetic,",
    h1b: "billed cleanly.",
    tagline:
      "Two businesses under one roof - AI agents keep the coding boundary clean, verify Mohs and biopsy coverage, and speed prior authorization for biologics.",
    overview:
      "Dermatology mixes medical and cosmetic work with procedure-heavy coding and expensive biologics. AI agents assemble step-therapy documentation for PAs, keep the cosmetic-vs-medical line clean, and get modifiers right on lesion removals and Mohs.",
    stat: { n: "25", suffix: " & 59", label: "Modifiers validated automatically on same-day procedures and lesion removals" },
    groups: [
      {
        title: "Front office & scheduling",
        processes: [
          ["📞", "Call answering & booking", "Answers calls and books into EMA/ModMed or Nextech."],
          ["🔁", "Recall & skin-check reminders", "Drives annual skin-check recall and reactivation."],
        ],
      },
      {
        title: "Prior authorization (biologics)",
        processes: [
          ["📦", "Biologic PA assembly & renewal", "Assembles step-therapy documentation and prior-treatment history for biologics (e.g., Dupixent), and tracks renewals."],
          ["🧾", "Payer-policy matching", "Checks the encounter against payer criteria before submission."],
        ],
      },
      {
        title: "Eligibility & the cosmetic/medical split",
        processes: [
          ["🛡️", "Eligibility & benefits", "Verifies coverage and out-of-pocket for medical services."],
          ["🔍", "Cosmetic vs. medical at booking", "Flags cosmetic vs. medical at booking time to prevent collections issues later."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Procedure coding & path correlation", "Codes biopsies, excisions and Mohs, correlating with pathology results."],
          ["⚖️", "Modifier accuracy", "Validates modifiers 25 and 59 and the cosmetic/medical boundary."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Medical-necessity appeals", "Auto-generates appeals for lesion-removal and medical-necessity denials."],
        ],
      },
    ],
    benefits: [
      "Keep the cosmetic-vs-medical line clean and audit-safe",
      "Speed biologic prior auths with auto-assembled step-therapy docs",
      "Get modifiers 25 and 59 right, every time",
      "Correlate coding with pathology automatically",
      "Verify coverage before medical procedures",
      "Recover lesion-removal denials fast",
    ],
  },

  {
    slug: "physical-therapy",
    icon: "🏃",
    name: "Physical Therapy",
    eyebrow: "Specialty · Physical Therapy & Rehab",
    h1a: "Watch the visit cap.",
    h1b: "Bill the units right.",
    tagline:
      "Visit caps, plan-of-care recerts and the 8-minute rule - AI agents track every authorized visit and validate every timed unit so recurring billing stays clean.",
    overview:
      "Physical therapy is recurring, authorization-limited and easy to under- or over-bill. AI agents track authorized visits, remind on plan-of-care recertification, and validate timed-code units and threshold modifiers on every recurring claim.",
    stat: { n: "8", suffix: "-min rule", label: "Timed-code units validated on every visit, automatically" },
    groups: [
      {
        title: "Scheduling & plan of care",
        processes: [
          ["📞", "Booking & recurring series", "Answers calls and sets up recurring visit series in the EMR."],
          ["🔁", "No-show & waitlist backfill", "Reminds patients and backfills cancellations."],
        ],
      },
      {
        title: "Authorization & visit tracking",
        processes: [
          ["📦", "Auth request & renewal", "Requests and renews authorizations before visits run out."],
          ["⏱", "Visit & recert tracking", "Tracks authorized vs. used visits and reminds on plan-of-care recertification."],
        ],
      },
      {
        title: "Eligibility & therapy caps",
        processes: [
          ["🛡️", "Benefits & cap tracking", "Verifies PT benefits and visit limits, and tracks the KX-modifier threshold."],
        ],
      },
      {
        title: "Coding & claims",
        processes: [
          ["🏷️", "Timed-unit & modifier validation", "Validates units under the 8-minute rule and checks modifiers (GP, KX, 59)."],
          ["🔄", "Recurring claim scrubbing", "Scrubs and submits recurring visit claims automatically."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Cap & auth denial recovery", "Auto-appeals therapy-cap and authorization denials."],
        ],
      },
    ],
    benefits: [
      "Never bill past an authorized visit count",
      "Get the 8-minute rule right on every timed code",
      "Track the KX-modifier threshold automatically",
      "Stay ahead of plan-of-care recertification dates",
      "Automate recurring visit claims",
      "Recover cap and authorization denials",
    ],
  },

  {
    slug: "cardiology",
    icon: "🫀",
    name: "Cardiology",
    eyebrow: "Specialty · Cardiology",
    h1a: "High-value procedures,",
    h1b: "authorized and coded right.",
    tagline:
      "Advanced imaging and device procedures carry heavy prior-auth and complex coding. AI agents match clinical criteria, split professional vs. technical, and catch underpayments.",
    overview:
      "Cardiology's revenue is concentrated in high-value imaging and procedures that are PA-heavy and easy to miscode. AI agents assemble authorization packets that match payer criteria, code cath, EP and echo correctly, and detect underpayments against contracted rates.",
    stat: { n: "26", suffix: " / TC", label: "Professional vs. technical split handled automatically on every study" },
    groups: [
      {
        title: "Front office & scheduling",
        processes: [
          ["📞", "Call answering & test scheduling", "Answers calls and schedules tests and procedures."],
        ],
      },
      {
        title: "Prior authorization",
        processes: [
          ["📦", "Advanced-imaging & device PA", "Assembles PAs for nuclear studies, CT/MR angiography and device procedures, matching clinical criteria."],
          ["⏱", "PA status polling & expiry", "Polls status and tracks authorization expiry."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Coverage & OOP for high-cost procedures", "Verifies coverage and out-of-pocket before expensive studies and procedures."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Cath, EP & echo coding", "Codes catheterization, EP and echo studies from the report."],
          ["⚖️", "Professional/technical split", "Applies modifiers 26 and TC correctly by setting."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Imaging-PA denial recovery", "Auto-appeals imaging authorization denials."],
          ["📉", "Underpayment detection", "Flags procedure payments below contracted rates."],
        ],
      },
    ],
    benefits: [
      "Match payer criteria on every advanced-imaging PA",
      "Split professional vs. technical automatically",
      "Code cath, EP and echo studies from the report",
      "Verify out-of-pocket before high-cost procedures",
      "Catch underpayments on contracted procedure rates",
      "Recover imaging authorization denials",
    ],
  },

  {
    slug: "orthopedics",
    icon: "🦴",
    name: "Orthopedics",
    eyebrow: "Specialty · Orthopedics",
    h1a: "Surgery, imaging, DME -",
    h1b: "authorized and tracked.",
    tagline:
      "Surgery-heavy and DME-heavy, orthopedics needs tight prior auth and global-period discipline. AI agents assemble PAs and keep surgical modifiers and global periods straight.",
    overview:
      "Orthopedics combines surgery, advanced imaging, injections and durable medical equipment - each with its own authorization and coding rules. AI agents assemble PAs, track global periods, and get surgical modifiers and DME HCPCS right.",
    stat: { n: "90", suffix: "-day globals", label: "Global periods tracked so post-op visits are billed correctly" },
    groups: [
      {
        title: "Front office & surgical scheduling",
        processes: [
          ["📞", "Call answering & surgical scheduling", "Answers calls and coordinates surgical and clinic scheduling."],
        ],
      },
      {
        title: "Prior authorization",
        processes: [
          ["📦", "MRI, injection, surgery & DME PA", "Assembles authorizations for imaging, injections, surgery and durable medical equipment (braces)."],
          ["⏱", "PA status & expiry tracking", "Polls status and tracks expiry."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Surgical & DME coverage", "Verifies coverage and produces out-of-pocket estimates for surgery and DME."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Surgical coding & global periods", "Codes procedures and tracks 10/90-day global periods."],
          ["⚖️", "Modifier & DME HCPCS accuracy", "Validates modifiers (24, 25, 58, 78, 79) and DME HCPCS codes."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Surgical & DME denial recovery", "Auto-appeals surgical and DME denials."],
          ["📉", "Underpayment detection", "Flags payments below contracted surgical rates."],
        ],
      },
    ],
    benefits: [
      "Assemble PAs for imaging, injections, surgery and DME",
      "Track 10- and 90-day global periods automatically",
      "Get surgical modifiers (24, 25, 58, 78, 79) right",
      "Produce accurate surgical and DME out-of-pocket estimates",
      "Recover surgical and DME denials",
      "Catch underpayments on contracted rates",
    ],
  },

  {
    slug: "primary-care",
    icon: "🩺",
    name: "Primary Care",
    eyebrow: "Specialty · Primary Care",
    h1a: "High volume,",
    h1b: "nothing left on the table.",
    tagline:
      "At primary-care volume, small per-visit leaks add up fast. AI agents verify eligibility at scale, capture preventive and chronic-care codes, and close risk-adjustment gaps.",
    overview:
      "Primary care wins on volume, prevention and chronic-care management - which is exactly where coding gets missed. AI agents verify eligibility at scale, support E/M and preventive-plus-problem coding, and flag AWV, CCM, RPM and HCC gaps before the claim goes out.",
    stat: { n: "25", suffix: " modifier", label: "Preventive-plus-problem visits split correctly so both get paid" },
    groups: [
      {
        title: "Front office & recall",
        processes: [
          ["📞", "High-volume call answering & booking", "Absorbs call volume and books preventive and chronic-care visits."],
          ["🔁", "Preventive & chronic recall", "Drives annual-wellness and chronic-care recall automatically."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Real-time verification at scale", "Verifies eligibility for every visit and distinguishes preventive vs. problem coverage."],
        ],
      },
      {
        title: "Coding & documentation",
        processes: [
          ["🏷️", "E/M & preventive-plus-problem coding", "Supports E/M level selection and preventive-plus-problem visits with modifier 25."],
          ["📋", "AWV, CCM & RPM capture", "Captures annual-wellness, chronic-care-management and remote-monitoring codes."],
          ["🎯", "HCC / risk-adjustment gap flagging", "Flags open HCC and risk-adjustment gaps before the visit closes."],
        ],
      },
      {
        title: "Prior authorization",
        processes: [
          ["📦", "Medication & referral PA", "Handles medication and referral authorizations."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Preventive-vs-problem denial recovery", "Auto-appeals preventive-vs-problem and other recurring denials."],
        ],
      },
    ],
    benefits: [
      "Verify eligibility for every visit, at scale",
      "Split preventive-plus-problem visits so both get paid",
      "Capture AWV, CCM and RPM revenue you're leaving behind",
      "Close HCC and risk-adjustment gaps before the visit ends",
      "Automate medication and referral prior auths",
      "Recover preventive-vs-problem denials",
    ],
  },
];

export const bySpecialtySlug = (slug) => SPECIALTIES.find((s) => s.slug === slug) || null;
