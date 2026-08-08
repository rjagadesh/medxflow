// ─────────────────────────────────────────────────────────────────────────
//  MedXFlow specialties - vertical pages describing which processes AI agents
//  automate for each practice type, and the benefits. Each entry drives one
//  page rendered by SpecialtyPage.jsx at /specialties/<slug>.
//  A "group" is a workflow area; each process is [emoji, name, description].
//  Groups are ordered pain-first: the biggest revenue leak leads the page,
//  front-office / voice sits lower (except MedSpa, where it IS the top win).
// ─────────────────────────────────────────────────────────────────────────

export const SPECIALTIES = [
  {
    slug: "primary-care",
    icon: "🩺",
    name: "Primary Care",
    eyebrow: "Specialty · Primary Care",
    h1a: "High volume,",
    h1b: "nothing left on the table.",
    tagline:
      "At primary-care volume, the money leaks in coding - E/M levels, preventive-plus-problem, AWV/CCM/RPM and risk-adjustment gaps. AI agents catch it before the claim goes out.",
    overview:
      "Primary care wins on volume, prevention and chronic-care management - which is exactly where revenue slips away. AI agents support E/M and preventive-plus-problem coding, capture AWV, CCM and RPM, and flag open HCC and risk-adjustment gaps before the visit closes - then verify eligibility for every visit at scale.",
    stat: { n: "25", suffix: " modifier", label: "Preventive-plus-problem visits split correctly so both get paid, automatically" },
    groups: [
      {
        title: "Coding & documentation",
        note: "Where the volume leaks.",
        processes: [
          ["🏷️", "E/M & preventive-plus-problem coding", "Supports E/M level selection and preventive-plus-problem visits with modifier 25."],
          ["📋", "AWV, CCM & RPM capture", "Captures annual-wellness, chronic-care-management and remote-monitoring codes you're leaving behind."],
          ["🎯", "HCC / risk-adjustment gap flagging", "Flags open HCC and risk-adjustment gaps before the visit closes."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Real-time verification at scale", "Verifies eligibility for every visit and distinguishes preventive vs. problem coverage."],
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
      {
        title: "Front office & recall",
        processes: [
          ["🔁", "Preventive & chronic recall", "Drives annual-wellness and chronic-care recall automatically."],
          ["📞", "High-volume call answering & booking", "Absorbs call volume and books preventive and chronic-care visits."],
        ],
      },
    ],
    benefits: [
      "Split preventive-plus-problem visits so both get paid",
      "Capture AWV, CCM and RPM revenue you're leaving behind",
      "Close HCC and risk-adjustment gaps before the visit ends",
      "Verify eligibility for every visit, at scale",
      "Automate medication and referral prior auths",
      "Recover preventive-vs-problem denials",
    ],
  },

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
          ["🔔", "Retreatment reminders", "Product-duration reminders (tox ~3-4 months, filler by type) drive the recurring-revenue engine - usually run off a spreadsheet today."],
          ["📋", "Pre/post-treatment instructions", "Delivers modality-timed prep and aftercare automatically."],
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
      "Stay audit-safe on the cosmetic-vs-medical boundary",
      "Reconcile every tox unit and wastage modifier",
      "See true margin per service and per injector",
      "Turn retreatment timing into predictable recurring revenue",
      "Reconcile Square, Stripe, CareCredit, Cherry and loyalty credits automatically",
      "Keep the book full with automatic waitlist backfill",
    ],
  },

  {
    slug: "dental",
    icon: "🦷",
    name: "Dental",
    eyebrow: "Specialty · Dental",
    h1a: "Verify the plan.",
    h1b: "Attach the proof.",
    tagline:
      "Dental revenue leaks at verification and attachments - plans with maximums, frequencies and downgrades, and claims that reject without X-rays and narratives. AI agents get both right before the claim leaves.",
    overview:
      "Dental practices juggle complex plan structures, frequent eligibility changes and attachment-hungry claims. AI agents verify benefits down to frequencies and downgrades, auto-attach the right documentation to every claim, and keep the hygiene schedule full.",
    stat: { n: "1", suffix: " min", label: "Full benefit breakdown - maximums, frequencies, downgrades - before the patient sits down" },
    groups: [
      {
        title: "Insurance verification & benefits",
        note: "The number-one dental leak.",
        processes: [
          ["🛡️", "Real-time eligibility & plan breakdown", "Pulls annual maximums, frequencies, downgrades and waiting periods before the visit."],
          ["📄", "Patient-responsibility estimation", "Computes what the patient owes so the front desk quotes accurately."],
        ],
      },
      {
        title: "Claims & documentation",
        processes: [
          ["📎", "Attachment automation", "Auto-attaches X-rays, perio charts and narratives to claims so they don't reject."],
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
      {
        title: "Front office & scheduling",
        processes: [
          ["🔁", "Recall & hygiene reactivation", "Automated 6-month recall and reactivation of lapsed patients."],
          ["🪑", "No-show & waitlist backfill", "Fills cancellations from the waitlist automatically."],
          ["📞", "24/7 call answering & booking", "Answers overflow calls and books or reschedules into Dentrix, Eaglesoft or Open Dental."],
        ],
      },
    ],
    benefits: [
      "Verify every plan's maximums, frequencies and downgrades before the chair",
      "Cut claim rejections with automatic X-ray and narrative attachments",
      "Quote accurate patient responsibility up front",
      "Appeal downgrades and denials in a click",
      "Reactivate lapsed recall patients without manual chasing",
      "Fill cancelled slots from the waitlist automatically",
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
      "Two businesses under one roof - the cosmetic-vs-medical coding line is the biggest audit risk, and biologics are the biggest PA burden. AI agents keep both clean.",
    overview:
      "Dermatology mixes medical and cosmetic work with procedure-heavy coding and expensive biologics. AI agents keep the cosmetic-vs-medical line clean, get modifiers right on lesion removals and Mohs, and assemble step-therapy documentation for biologic authorizations.",
    stat: { n: "25", suffix: " & 59", label: "Modifiers validated automatically on same-day procedures and lesion removals" },
    groups: [
      {
        title: "Coding & compliance",
        note: "The biggest audit risk.",
        processes: [
          ["⚖️", "Cosmetic-vs-medical flagging", "Flags cosmetic services documented as medically necessary and holds the boundary."],
          ["🏷️", "Procedure coding & path correlation", "Codes biopsies, excisions and Mohs, correlating with pathology results."],
          ["🎯", "Modifier accuracy", "Validates modifiers 25 and 59 on same-day services."],
        ],
      },
      {
        title: "Prior authorization (biologics)",
        note: "The biggest PA burden.",
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
        title: "Denials & AR",
        processes: [
          ["🔎", "Medical-necessity appeals", "Auto-generates appeals for lesion-removal and medical-necessity denials."],
        ],
      },
      {
        title: "Front office & scheduling",
        processes: [
          ["🔁", "Recall & skin-check reminders", "Drives annual skin-check recall and reactivation."],
          ["📞", "Call answering & booking", "Answers calls and books into EMA/ModMed or Nextech."],
        ],
      },
    ],
    benefits: [
      "Keep the cosmetic-vs-medical line clean and audit-safe",
      "Get modifiers 25 and 59 right, every time",
      "Correlate coding with pathology automatically",
      "Speed biologic prior auths with auto-assembled step-therapy docs",
      "Verify coverage before medical procedures",
      "Recover lesion-removal denials fast",
    ],
  },

  {
    slug: "eye-care",
    icon: "👁️",
    name: "Eye Care",
    eyebrow: "Specialty · Ophthalmology & Optometry",
    h1a: "Every dose authorized,",
    h1b: "billed and reconciled.",
    tagline:
      "Eye-care revenue concentrates in expensive injectables and the medical-vs-vision split. AI agents assemble anti-VEGF authorizations, reconcile buy-and-bill down to the wasted unit, and route every claim to the right payer.",
    overview:
      "The money in eye care rides on high-cost injectable drugs and a benefit split that trips up the front desk. Anti-VEGF PAs, J-code units and drug wastage are unforgiving, and sending a claim to the wrong plan means a write-off. MedXFlow's agents handle the parts that leak the most.",
    stat: { n: "JW/JZ", suffix: "", label: "Drug wastage documented on every single-use anti-VEGF vial, automatically" },
    groups: [
      {
        title: "Injectable drug authorization & buy-and-bill",
        note: "Biggest dollars, biggest pain.",
        processes: [
          ["📦", "Anti-VEGF prior authorization", "Assembles PA packets for Eylea, Lucentis, Avastin and Vabysmo - diagnosis, prior therapy and imaging - and tracks renewals."],
          ["💉", "J-code units & wastage", "Reconciles drug units drawn vs. documented vs. billed, with JW/JZ wastage-modifier validation on single-use vials."],
          ["💳", "Buy-and-bill reconciliation", "Matches drug purchases to administered doses and payments, so nothing bought goes unbilled."],
        ],
      },
      {
        title: "Medical vs. vision benefit determination",
        note: "The routing that decides who pays.",
        processes: [
          ["🔀", "Route to the right plan", "Determines medical vs. routine-vision coverage before the visit and sends the claim to the correct payer."],
          ["🛡️", "Dual-benefit verification", "Verifies both medical and vision benefits, copays and frequency limits."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Retina & imaging coding", "Codes OCT, fundus photography and visual fields, and respects payer frequency limits."],
          ["⚖️", "Eye codes vs. E/M", "Chooses correctly between Eye codes (920xx) and E/M (992xx) and validates modifiers."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["📄", "Coverage & OOP", "Confirms coverage and out-of-pocket for procedures and imaging."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Drug & imaging denial recovery", "Auto-appeals anti-VEGF and imaging-frequency denials."],
          ["📉", "Underpayment detection", "Flags J-code payments below contracted or ASP-based rates."],
        ],
      },
      {
        title: "Front office & scheduling",
        processes: [
          ["🔁", "Recall for chronic care", "Recalls glaucoma, diabetic-eye and injection-series patients on schedule."],
          ["📞", "Call answering & scheduling", "Answers calls and schedules clinic visits, imaging and injection appointments."],
        ],
      },
    ],
    benefits: [
      "Never leave a bought anti-VEGF dose unbilled",
      "Document drug wastage (JW/JZ) on every single-use vial",
      "Send each claim to the right payer - medical or vision",
      "Respect imaging frequency limits to avoid denials",
      "Choose Eye codes vs. E/M correctly",
      "Recover anti-VEGF and imaging denials fast",
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
      "Authorization-heavy, session-based billing done right - expired auths and exceeded units are the top leaks. AI agents renew authorizations before units run out and scrub every recurring claim.",
    overview:
      "Behavioral health lives and dies on authorizations and recurring session billing. Missed auths, exceeded units and telehealth modifier errors are the top revenue leaks. AI agents renew auths before units run out, bill telehealth correctly, and scrub every recurring claim.",
    stat: { n: "0", suffix: "", label: "Sessions billed against an expired or exhausted authorization" },
    groups: [
      {
        title: "Prior authorization & units",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal", "Assembles medical-necessity documentation and submits or renews authorizations before units run out."],
          ["⏱", "Unit & visit tracking", "Tracks authorized vs. used sessions and alerts before expiry."],
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
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Behavioral-health eligibility", "Verifies coverage, copays and visit limits - often carved out to a separate payer."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Auth & modifier denial recovery", "Auto-appeals the recurring denials: no auth, exceeded units, wrong modifier."],
        ],
      },
      {
        title: "Intake & scheduling",
        processes: [
          ["🔁", "Recurring appointment & no-show management", "Holds recurring slots, reminds patients and backfills cancellations."],
          ["📞", "Intake call answering & booking", "Answers inbound, screens and books into the EHR (SimplePractice, TherapyNotes, Kareo)."],
        ],
      },
    ],
    benefits: [
      "Never lose revenue to an expired authorization again",
      "Track authorized vs. used units in real time",
      "Bill telehealth sessions with the correct POS and modifiers",
      "Automate recurring session claims",
      "Verify carved-out behavioral benefits before intake",
      "Recover auth- and modifier-driven denials",
    ],
  },

  {
    slug: "physical-therapy",
    icon: "🏃",
    name: "Physical Therapy",
    eyebrow: "Specialty · Physical Therapy",
    h1a: "Watch the visit cap.",
    h1b: "Bill the units right.",
    tagline:
      "Visit caps, plan-of-care recerts and the 8-minute rule are where PT revenue leaks. AI agents track every authorized visit and validate every timed unit before the claim goes out.",
    overview:
      "Physical therapy is recurring, authorization-limited and easy to under- or over-bill. AI agents track authorized visits, validate timed-code units and threshold modifiers, and remind on plan-of-care recertification - then keep the schedule full.",
    stat: { n: "8", suffix: "-min rule", label: "Timed-code units validated on every visit, automatically" },
    groups: [
      {
        title: "Authorization & visit tracking",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal", "Requests and renews authorizations before visits run out."],
          ["⏱", "Visit & recert tracking", "Tracks authorized vs. used visits and reminds on plan-of-care recertification."],
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
        title: "Eligibility & therapy caps",
        processes: [
          ["🛡️", "Benefits & cap tracking", "Verifies PT benefits and visit limits, and tracks the KX-modifier threshold."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Cap & auth denial recovery", "Auto-appeals therapy-cap and authorization denials."],
        ],
      },
      {
        title: "Scheduling & plan of care",
        processes: [
          ["🔁", "No-show & waitlist backfill", "Reminds patients and backfills cancellations."],
          ["📞", "Booking & recurring series", "Answers calls and sets up recurring visit series in the EMR."],
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
    slug: "physical-rehabilitation",
    icon: "🩼",
    name: "Physical Rehabilitation",
    eyebrow: "Specialty · Physical Rehabilitation (PT · OT · Speech)",
    h1a: "Every authorized visit,",
    h1b: "every discipline, tracked.",
    tagline:
      "Multi-discipline rehab lives on authorizations, visit limits and recert deadlines - multiplied across PT, OT and speech. AI agents track each discipline separately so no authorization lapses and no visit is billed past the cap.",
    overview:
      "Rehabilitation revenue leaks through lapsed authorizations, missed plan-of-care recertifications and timed-unit coding errors - and each is multiplied across PT, OT and speech. MedXFlow's agents track each discipline's authorized visits, flag recerts before they expire, and validate every timed unit.",
    stat: { n: "3", suffix: " disciplines", label: "PT, OT and speech authorizations tracked separately, so none lapses" },
    groups: [
      {
        title: "Authorization & visit-limit tracking",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal by discipline", "Requests and renews authorizations for PT, OT and speech, each tracked separately."],
          ["⏱", "Visit-limit tracking", "Tracks authorized vs. used visits per discipline and alerts before the cap."],
        ],
      },
      {
        title: "Plan of care & recertification",
        processes: [
          ["🗓", "Recert deadline tracking", "Flags plan-of-care recertification dates and missing physician signatures before they cost a claim."],
          ["📈", "Progress reporting", "Prompts required progress notes and functional reporting at the right intervals."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Timed-unit & modifier validation", "Validates units under the 8-minute rule and discipline modifiers (GP, GO, GN), plus co-treatment rules."],
          ["🎯", "KX threshold tracking", "Tracks the therapy-threshold amount and applies the KX modifier when appropriate."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Benefits & cap verification", "Verifies therapy benefits and visit limits across disciplines."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Cap, auth & recert denial recovery", "Auto-appeals the recurring denials: exceeded cap, no auth, expired recert."],
        ],
      },
      {
        title: "Scheduling & recurring series",
        processes: [
          ["📞", "Booking & recurring series", "Sets up recurring visit series and backfills cancellations."],
        ],
      },
    ],
    benefits: [
      "Track PT, OT and speech authorizations separately",
      "Never bill past an authorized visit count",
      "Stay ahead of every plan-of-care recert deadline",
      "Get the 8-minute rule and discipline modifiers right",
      "Apply the KX modifier at the threshold",
      "Recover cap, auth and recert denials",
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
      "Advanced imaging and device procedures carry heavy prior-auth and complex coding - that's where cardiology revenue is won or lost. AI agents match clinical criteria, split professional vs. technical, and catch underpayments.",
    overview:
      "Cardiology's revenue is concentrated in high-value imaging and procedures that are PA-heavy and easy to miscode. AI agents assemble authorization packets that match payer criteria, code cath, EP and echo correctly, and detect underpayments against contracted rates.",
    stat: { n: "26", suffix: " / TC", label: "Professional vs. technical split handled automatically on every study" },
    groups: [
      {
        title: "Prior authorization",
        note: "The number-one leak.",
        processes: [
          ["📦", "Advanced-imaging & device PA", "Assembles PAs for nuclear studies, CT/MR angiography and device procedures, matching clinical criteria."],
          ["⏱", "PA status polling & expiry", "Polls status and tracks authorization expiry."],
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
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Coverage & OOP for high-cost procedures", "Verifies coverage and out-of-pocket before expensive studies and procedures."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Imaging-PA denial recovery", "Auto-appeals imaging authorization denials."],
          ["📉", "Underpayment detection", "Flags procedure payments below contracted rates."],
        ],
      },
      {
        title: "Front office & scheduling",
        processes: [
          ["📞", "Call answering & test scheduling", "Answers calls and schedules tests and procedures."],
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
      "Surgery-heavy and DME-heavy, orthopedics needs tight prior auth and global-period discipline - the biggest sources of lost revenue. AI agents assemble PAs and keep surgical modifiers and global periods straight.",
    overview:
      "Orthopedics combines surgery, advanced imaging, injections and durable medical equipment - each with its own authorization and coding rules. AI agents assemble PAs, track global periods, and get surgical modifiers and DME HCPCS right.",
    stat: { n: "90", suffix: "-day globals", label: "Global periods tracked so post-op visits are billed correctly" },
    groups: [
      {
        title: "Prior authorization",
        note: "The number-one leak.",
        processes: [
          ["📦", "MRI, injection, surgery & DME PA", "Assembles authorizations for imaging, injections, surgery and durable medical equipment (braces)."],
          ["⏱", "PA status & expiry tracking", "Polls status and tracks expiry."],
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
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Surgical & DME coverage", "Verifies coverage and produces out-of-pocket estimates for surgery and DME."],
        ],
      },
      {
        title: "Denials & AR",
        processes: [
          ["🔎", "Surgical & DME denial recovery", "Auto-appeals surgical and DME denials."],
          ["📉", "Underpayment detection", "Flags payments below contracted surgical rates."],
        ],
      },
      {
        title: "Front office & surgical scheduling",
        processes: [
          ["📞", "Call answering & surgical scheduling", "Answers calls and coordinates surgical and clinic scheduling."],
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
];

export const bySpecialtySlug = (slug) => SPECIALTIES.find((s) => s.slug === slug) || null;
